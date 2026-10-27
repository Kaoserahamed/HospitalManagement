# Architecture Overview

## 1. Introduction

HospitalManagement is evolving from a monolithic FastAPI + React application into a
modular, cloud-native hospital management platform. This document describes the
target architecture for Phases 1-13.

## 2. Logical Architecture

### 2.1 Frontend

- React 18 single-page application built with Vite.
- Feature-based folder structure: `src/features/<capability>/`.
- Shared design system in `src/components/ui/`.
- Data fetching via React Query; global state via context.
- Route-level code splitting and lazy loading.

### 2.2 Backend (Modular Monolith)

- FastAPI application with module boundaries under `backend/modules/`.
- Each module exposes: `api` (routers), `service` (business logic), `repository`
  (data access), `model` (SQLAlchemy), `schema` (Pydantic).
- Shared kernel: `backend/shared/` for pagination, errors, correlation, auth.
- Dependency injection via FastAPI `Depends`.

### 2.3 Data Layer

- MySQL 8 as primary OLTP store.
- Alembic for versioned migrations.
- Redis for caching, sessions, and task queues.
- Object storage (S3-compatible) for imaging and documents.
- Read replicas for analytics and reporting.

### 2.4 Integration

- REST + JSON for synchronous APIs.
- OpenAPI 3.1 contract; versioned under `/api/v1`.
- FHIR R4 and HL7 v2 for EHR interoperability (Phase 2).
- Domain events via in-process bus initially; message broker later.

### 2.5 Async Processing

- Celery/RQ workers for billing, notifications, EHR sync.
- Scheduled jobs for reports and reminders.
- Retry with backoff and dead-letter handling.

## 3. Module Catalog

| Module | Responsibility | Phase |
|---|---|---|
| patient | Demographics, history, insurance | 1 |
| appointment | Booking, scheduling, conflicts | 1 |
| ehr | Encounters, diagnoses, prescriptions, labs | 2 |
| pharmacy | Inventory, dispensing, interactions | 3 |
| billing | Charges, invoices, payments | 3 |
| insurance | Claims, denials, appeals | 3 |
| staff | Profiles, credentials, schedules | 5 |
| department | Departments, rooms, equipment | 1 |
| telemedicine | Video visits, waiting room | 4 |
| monitoring | Remote vitals, alerts | 4 |
| analytics | Registries, metrics, reports | 6 |
| auth | Identity, RBAC, MFA, SSO | 1/12 |

## 4. Cross-Cutting Concerns

- Authentication/authorization: JWT + RBAC (+ MFA/SSO later).
- Observability: structured logs, metrics, traces.
- Security: encryption, audit log, input validation.
- Configuration: pydantic-settings, env validation.

## 5. Deployment Topology

- Local: docker-compose (MySQL + backend + frontend).
- Cloud: Kubernetes (EKS/GKE/AKS) with Helm.
- Ingress via NGINX/traefik; TLS via cert-manager.
- Managed database (RDS/Cloud SQL) + managed Redis.

## 6. Scaling Strategy

- Horizontal scaling of stateless backend/frontend.
- Read replicas for analytics.
- Caching hot paths (patient search, schedules).
- Async offloading for heavy work.

## 7. Failure Modes and Resilience

- Health checks and readiness probes.
- Circuit breakers for external integrations.
- Graceful degradation (cached reads).
- Disaster recovery with backups and failover.

## 8. Security Architecture

- TLS 1.3 in transit; encryption at rest for PHI.
- RBAC + ABAC; minimum necessary.
- Immutable audit log for PHI access.
- Secret management via Vault/KMS.

## 9. Evolution Path

Monolith → modular monolith → service extraction (strangler fig) as scale demands.
Extract candidates: billing, pharmacy, analytics, telemedicine.

## 10. References

- `docs/adr/`
- `STRATEGIC_ENGINEERING_ROADMAP.md`
