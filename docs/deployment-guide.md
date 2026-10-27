# Deployment Guide

## 1. Local Development

### Docker Compose

```bash
docker compose up -d
```

Services: MySQL, backend, frontend. Schema initialized via mount.

### Manual

See README.md.

## 2. Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| DATABASE_URL | Yes | MySQL connection string |
| SECRET_KEY | Yes | JWT signing key |
| ALGORITHM | Yes | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Yes | Token TTL |
| ENVIRONMENT | No | dev/test/prod |

### Frontend

| Variable | Required | Description |
|---|---|---|
| VITE_API_URL | Yes | Backend base URL |

## 3. Production (Phase 8+)

### Container Images

- Multi-stage builds; non-root runtime user.
- Distroless or slim base images.
- SBOM generated per image.
- Signed with cosign.

### Kubernetes

- Helm chart under `deploy/helm/hospital/` (Phase 8).
- HPA for backend/frontend.
- PDB for availability.
- Ingress with TLS via cert-manager.

### Cloud Provisioning (Terraform)

- VPC, subnets, security groups.
- Managed database (RDS/Cloud SQL).
- Managed Redis.
- Object storage bucket.
- Kubernetes cluster.

## 4. Database Migrations

- Alembic migrations applied during deploy.
- Backward-compatible migrations (expand/contract).
- Rollback scripts maintained.

## 5. Health Checks

- `GET /health` (planned) — liveness.
- `GET /ready` (planned) — readiness (DB + deps).
- Frontend served via NGINX with health endpoint.

## 6. Scaling

- Stateless backend/frontend scale horizontally.
- Database read replicas for analytics.
- Redis for session/cache.

## 7. Backup and Restore

- Daily automated DB backups (Phase 8).
- Point-in-time recovery.
- Restore drills quarterly.

## 8. Monitoring (Phase 11)

- Prometheus + Grafana.
- OpenTelemetry tracing.
- Sentry for errors.
- Alerting via PagerDuty/Slack.

## 9. Security in Production

- TLS 1.3 termination at ingress.
- Secrets via Vault/KMS.
- Network policies restricting pod traffic.
- Image scanning in CI.

## 10. References

- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 8-9
