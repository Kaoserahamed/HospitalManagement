# Changelog

All notable changes to HospitalManagement are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Phase 0 Governance

### Added
- Strategic engineering roadmap (`STRATEGIC_ENGINEERING_ROADMAP.md`) with scc baseline and phased plan.
- Contributor guide (`CONTRIBUTING.md`).
- Security policy (`SECURITY.md`).
- Code owners (`CODEOWNERS`).
- ADR template and ADR-0001, 0002, 0003.
- Pre-commit configuration and secret/PHI guard script.
- Engineering audit baseline (`docs/engineering-audit.md`).
- scc baseline metrics artifact (`docs/metrics/baseline.json`).
- README, incident response runbook, HIPAA baseline, API versioning strategy.

### Changed
- Removed legacy audit and planning documents in favor of the new roadmap structure.

### Security
- Added pre-commit guard against secrets and PHI markers.

## [1.0.0-foundation] — In Progress

### Phase 1 — Modular Architecture (planned)
- Restructure backend into `modules/` (patient, appointment, EHR, pharmacy, billing, staff).
- Shared kernel for pagination, errors, correlation IDs.
- Frontend feature folders and shared UI kit.

### Phase 2 — EHR & Clinical Workflows (planned)
- Encounters, diagnoses, vitals, SOAP notes, prescriptions, lab results.
- FHIR R4 resources and HL7 v2 handling.

### Phase 3 — Pharmacy, Billing & Insurance (planned)
- Inventory, dispensing, drug interactions.
- Charges, invoices, payments, insurance claims, medical coding.

## Historical Commits (backfilled)

### Foundation
- `d01e044` Add CI/CD pipeline, Docker setup, lint/format tooling, and test coverage
- `c3a8125` tests added

### Frontend evolution
- `6dc8422` refactor: standardize frontend loading and error states
- `48cbc0d` completed with few functionalities
- `cb6eb20` frontend e patient prescription fetch baki
- `e042d5b` fixing patients appointments
- `c997e60` departments creation, assign doctors to departments
- `f72c1ad` Role based authentication (admin, receptionist, doctors and frontend dashboard)
- `f1112a5` User service: role based authentication database + backend

### Deployment
- `c56c8d6` Add deployment information documentation
- `21c7420` Deploy backend and frontend separately to Vercel
- `e6b2447` Simplify build command
- `a8df8ad` Use functions config for API
- `baacf51` Disable default install command
- `dceca50` Use --prefix for npm commands in build
- `385f3b8` Fix Vercel build command to include npm install
- `4669480` Fix npm install command for Vercel
- `495e80c` Fix Vercel configuration - add API serverless function and proper build settings
- `2581be3` Fix Vercel deployment configuration for unified hospital management app
- `c97bc79` Add production database setup script and environment variables guide
- `8b0e618` Add deployment guide and vercel ignore file
- `abb8b1b` vercel
- `326c6dc` vercel deployment

### Architecture and CI/CD documentation
- `3b3bda0` docs: add Day 3 CI/CD pipeline - build, test, deploy automation
- `f864bc3` docs: add Day 2 architecture design - service boundaries, database schema, API contracts
- `9eaa62f` docs: add implementation plan and Day 1 repository audit

### Feature development (development branch)
- `dd67763` docs: add feature branch marker for PR
- `5350766` ci: restrict workflow to push on main branch only
- `ec9d01b` refactor: Day 4 project restructuring - separate into modules
- `49f3347` feat: Day 5 authentication system - OAuth2, JWT, RBAC
- `76deb7b` chore: remove legacy audit and planning documents

## Release Tags (planned)

- `v1.0.0-foundation` — Phase 0/1 baseline.
- `v1.1.0-core` — Phase 2/3 clinical + billing.
- `v2.0.0-ga` — Production general availability.
