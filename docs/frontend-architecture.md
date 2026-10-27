# Frontend Architecture

## 1. Overview

The frontend is a React 18 + TypeScript single-page application built with Vite. It follows
a feature-based structure to scale with the platform's growth.

## 2. Directory Structure (target)

```
frontend/src/
  app/              # App shell, routing, providers
  features/         # Feature modules
    auth/
    patient/
    appointment/
    ehr/
    pharmacy/
    billing/
    staff/
    telemedicine/
    analytics/
  components/       # Shared UI kit
  hooks/            # Shared hooks
  lib/              # API client, utils
  styles/           # Global styles, tokens
  types/            # Shared types
```

## 3. State Management

- Server state: React Query (caching, refetch, mutations).
- UI state: local component state.
- Global state: React Context for auth and theme.
- Form state: React Hook Form + Zod validation.

## 4. Routing

- React Router v6 with lazy-loaded routes.
- Protected routes by role.
- Breadcrumbs and deep linking.

## 5. API Client

- Axios instance with interceptors.
- JWT attached from auth context.
- Automatic refresh on 401 (when refresh tokens available).
- Error normalization to a common shape.

## 6. Design System

- CSS Modules for component styles.
- Design tokens (colors, spacing, typography) in `styles/tokens.css`.
- Accessible components (ARIA, keyboard navigation).
- Dark mode support (Phase 3).

## 7. Performance

- Code splitting per route and feature.
- Memoization for expensive components.
- Virtualized lists for large datasets.
- Image optimization and lazy loading.

## 8. Accessibility

- WCAG 2.1 AA target.
- Semantic HTML.
- Focus management.
- Screen reader support.

## 9. Testing

- Unit/component: Vitest + React Testing Library.
- E2E: Playwright.
- Visual regression (optional, Phase 7).

## 10. Build and Deploy

- Vite production build with tree-shaking.
- Environment variables via `VITE_*`.
- Static assets served via NGINX/CDN.

## 11. References

- `frontend/package.json`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 1, 4, 7
