# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Engineering audit and modernization roadmap (`docs/engineering-audit.md`).
- Repository governance: CONTRIBUTING, SECURITY policy, changelog, code
  owners, PR and issue templates, editor configuration.

### Planned (tracked in docs/engineering-audit.md §9)
- Backend quality pass: validated configuration, structured logging with
  request correlation IDs, standardized error envelope, pagination.
- Versioned database migrations (Alembic) and booking-slot integrity
  constraints.
- Security hardening: JWT library migration, password policy, rate limiting,
  object-level authorization, secret/dependency/SAST scanning.
- Frontend quality pass: centralized typed API client, data-fetching hooks,
  decomposed pages, component tests.
- Production containers, Kubernetes manifests, Terraform modules.
- CI/CD quality gates, staged deployment with production approval.
- Observability: metrics, tracing, health/readiness endpoints, SLOs.
- Operational runbooks and disaster-recovery documentation.
