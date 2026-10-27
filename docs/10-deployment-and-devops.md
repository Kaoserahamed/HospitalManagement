# Deployment and DevOps

## Local
- Docker Compose: `docker-compose up --build`

## Cloud
- Kubernetes manifests under `infra/k8s/`
- Helm chart under `infra/helm/hospital/`
- Terraform under `infra/terraform/`

## CI/CD
- GitHub Actions workflows in `.github/workflows/`

## Notes
- Credentials must be injected via secrets.
- Database migrations are placeholders.
