# Setup and Installation

## Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8

## Backend
```bash
cd backend
pip install -e ".[dev]"
cp ../.env.example .env
python init_tables.py
python seed_admin.py
uvicorn main:app --reload --port 8000
```

## Frontend
```bash
cd frontend
npm ci
npm run dev
```

## Database
- MySQL database `hospital_db` must exist.
- `init_tables.py` creates tables.
- `seed_admin.py` creates default admin (requires `ADMIN_PASSWORD`).

## Common Issues
- Missing `DATABASE_URL` or `SECRET_KEY` prevents startup.
- MySQL connection errors indicate wrong credentials or server not running.
- Frontend API base URL is controlled by `VITE_API_URL`.
