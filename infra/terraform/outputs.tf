# Terraform outputs

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  description = "EKS cluster CA data"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.db_instance_endpoint
}

output "rds_port" {
  description = "RDS port"
  value       = module.rds.db_instance_port
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = module.redis.cluster_cache_nodes[0].address
}

output "documents_bucket_name" {
  description = "S3 documents bucket"
  value       = aws_s3_bucket.documents.bucket
}

output "documents_bucket_arn" {
  description = "S3 documents bucket ARN"
  value       = aws_s3_bucket.documents.arn
}

output "rds_kms_key_arn" {
  description = "RDS KMS key ARN"
  value       = aws_kms_key.rds.arn
}

output "s3_kms_key_arn" {
  description = "S3 KMS key ARN"
  value       = aws_kms_key.s3.arn
}
