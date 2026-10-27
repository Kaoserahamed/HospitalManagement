# API Reference

## Overview
Backend is FastAPI. Base URL: `http://localhost:8000`.

## Legacy Routes
- `/auth/*` authentication
- `/patients/*` patient management
- `/appointments/*` appointments
- `/departments/*` departments
- `/prescriptions/*` prescriptions
- `/schedules/*` schedules
- `/health` health check

## Module Routes
Each backend module under `backend/modules/<name>/` exposes a router at `/{name}` with standard endpoints:
- `GET /{name}` list (pagination via `page`, `per_page`)
- `POST /{name}` create
- `GET /{name}/{id}` get
- `PUT /{name}/{id}` update
- `DELETE /{name}/{id}` delete
- `POST /{name}/{id}/activate`
- `POST /{name}/{id}/deactivate`
- `POST /{name}/{id}/complete`
- `POST /{name}/{id}/cancel`
- `GET /{name}/all`
- `GET /{name}/count`
- `GET /{name}/search?q=`
- `GET /{name}/summary`

Some modules add domain-specific endpoints (e.g., departments rooms/equipment).

## Authentication
Bearer token in `Authorization` header.

## OpenAPI
FastAPI provides `/docs` and `/openapi.json`.
