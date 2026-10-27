# Configuration

## Backend Environment Variables
See `.env.example`. Required:
- `DATABASE_URL`
- `SECRET_KEY`

Optional:
- `ENVIRONMENT` (local/test/staging/production)
- `LOG_LEVEL`
- `DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_RECYCLE`, `DB_ECHO`
- `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `JWT_ISSUER`, `JWT_AUDIENCE`
- `LOGIN_RATE_LIMIT_MAX`, `LOGIN_RATE_LIMIT_WINDOW_SECONDS`
- `CORS_ORIGINS`

## Frontend
- `VITE_API_URL` (defaults to `http://localhost:8000`)

## Secret Management
- Do not commit `.env`.
- Use environment injection in production.
- Rotate any exposed credentials immediately.
