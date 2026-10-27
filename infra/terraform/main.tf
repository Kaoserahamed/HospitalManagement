# Terraform configuration for HospitalManagement infrastructure

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  backend "s3" {
    bucket         = "hospitalmanagement-tfstate"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "hospitalmanagement-tflock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "HospitalManagement"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "prod"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }
}

# EKS cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.0"

  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = var.node_desired_size
      min_size     = var.node_min_size
      max_size     = var.node_max_size

      instance_types = var.node_instance_types
      capacity_type  = "ON_DEMAND"

      labels = {
        role = "general"
      }
    }

    compute = {
      desired_size = 1
      min_size     = 1
      max_size     = 3

      instance_types = ["c5.xlarge"]
      capacity_type  = "SPOT"

      labels = {
        role = "compute"
      }

      taints = [{
        key    = "workload"
        value  = "compute"
        effect = "NO_SCHEDULE"
      }]
    }
  }

  cluster_endpoint_public_access = true
  enable_irsa                   = true
}

# RDS (MySQL)
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.3.0"

  identifier = "${var.project_name}-db"

  engine               = "mysql"
  engine_version       = "8.0"
  family               = "mysql8.0"
  major_engine_version = "8.0"
  instance_class       = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage

  db_name  = var.db_name
  username = var.db_username
  port     = 3306

  multi_az               = var.environment == "prod"
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = var.environment == "prod" ? 7 : 1
  skip_final_snapshot    = var.environment != "prod"
  deletion_protection     = var.environment == "prod"

  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn

  performance_insights_enabled = true
}

# ElastiCache (Redis)
module "redis" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "1.1.0"

  cluster_id           = "${var.project_name}-redis"
  engine               = "redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = var.redis_num_nodes
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_ids         = module.vpc.private_subnets
  security_group_ids  = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled  = true
  auth_token                 = var.redis_auth_token
}

# S3 bucket for documents/imaging
resource "aws_s3_bucket" "documents" {
  bucket = "${var.project_name}-documents-${var.environment}"
}

resource "aws_s3_bucket_versioning" "documents" {
  bucket = aws_s3_bucket.documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

# KMS keys
resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

resource "aws_kms_key" "s3" {
  description             = "KMS key for S3 encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

# Security groups
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
  }
}

resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg"
  description = "Security group for Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
  }
}

# Outputs
output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  value = module.rds.db_instance_endpoint
}

output "redis_endpoint" {
  value = module.redis.cluster_cache_nodes[0].address
}

output "documents_bucket" {
  value = aws_s3_bucket.documents.bucket
}
