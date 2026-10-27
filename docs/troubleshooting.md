# Troubleshooting Guide

## 1. Backend won't start

- Check `DATABASE_URL` in `.env`.
- Ensure MySQL is running and schema applied.
- Run `python init_tables.py`.
- Check Python version (3.11).

## 2. Frontend build fails

- Run `npm ci` (not `npm install`).
- Check Node version (18).
- Clear cache: `rm -rf node_modules/.vite`.

## 3. Tests fail

- Backend: ensure test DB env vars set (CI uses SQLite).
- Frontend: run `npm test -- --run`.
- Check coverage threshold (70%).

## 4. Lint/typecheck failures

- Run `ruff format .` then `ruff check --fix .`.
- Run `npx prettier --write .`.
- Fix mypy/tsc errors manually.

## 5. Docker issues

- Rebuild images: `docker compose build --no-cache`.
- Check port conflicts (3306, 8000, 5173).
- Inspect logs: `docker compose logs`.

## 6. Database connection errors

- Verify credentials and host.
- Check MySQL user permissions.
- Ensure `hospital_db` exists.

## 7. JWT/auth errors

- Verify `SECRET_KEY` consistency.
- Check token expiry.
- Ensure issuer/audience match.

## 8. Getting Help

- Check `docs/` and `README.md`.
- Open an issue via templates.
- Contact maintainers in `CODEOWNERS`.
