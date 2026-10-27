# Troubleshooting

## Startup Failures
- Ensure `DATABASE_URL` and `SECRET_KEY` are set.
- Ensure MySQL is running.

## Frontend Issues
- Set `VITE_API_URL` to backend URL.
- Run `npm ci` before dev.

## Tests
- Integration tests require live MySQL.
- Frontend typecheck requires all dependencies installed.
