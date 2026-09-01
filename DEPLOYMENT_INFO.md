# 🚀 Deployment Information

## Vercel Deployments

### Backend API
- **URL**: https://backend-api-black.vercel.app
- **Project**: backend-api
- **Framework**: FastAPI (Python)
- **Repository**: Connected to GitHub

### Frontend
- **URL**: https://hospital-frontend-tau-snowy.vercel.app
- **Project**: hospital-frontend
- **Framework**: Vite + React + TypeScript
- **Repository**: Connected to GitHub

## Environment Variables

### Backend
- DATABASE_URL (Secret)
- SECRET_KEY (Secret)
- ALGORITHM (Secret)
- ACCESS_TOKEN_EXPIRE_MINUTES (Secret)

### Frontend
- VITE_API_URL=https://backend-api-black.vercel.app

## Default Login Credentials

**Admin Account:**
- Email: `admin@hospital.com`
- Password: `Admin@123`

## Deployment Commands

### Backend
```bash
cd backend
vercel --prod
```

### Frontend
```bash
cd frontend
vercel --prod
```

## Automatic Deployments

Both projects are connected to GitHub. Any push to `main` branch will trigger automatic deployments.

- **Backend**: Deploys from `/backend` directory
- **Frontend**: Deploys from `/frontend` directory

## Project Structure

```
HospitalManagement/
├── backend/
│   ├── vercel.json          # Backend Vercel configuration
│   ├── .vercel/             # Vercel deployment settings
│   └── ...
├── frontend/
│   ├── vercel.json          # Frontend Vercel configuration
│   ├── .vercel/             # Vercel deployment settings
│   └── ...
└── README.md
```

## Testing the Deployment

1. **Backend API Test:**
   ```bash
   curl https://backend-api-black.vercel.app
   ```
   Expected: `{"message": "API Running"}`

2. **API Documentation:**
   Visit: https://backend-api-black.vercel.app/docs

3. **Frontend:**
   Visit: https://hospital-frontend-tau-snowy.vercel.app

## Updating Environment Variables

### Backend
```bash
cd backend
vercel env add VARIABLE_NAME production
```

### Frontend
```bash
cd frontend
vercel env add VITE_API_URL production
```

## Viewing Logs

```bash
# Backend logs
cd backend
vercel logs

# Frontend logs
cd frontend
vercel logs
```

## Redeploying

```bash
# Redeploy backend
cd backend
vercel --prod

# Redeploy frontend
cd frontend
vercel --prod
```

## Notes

- Backend and frontend are deployed as separate Vercel projects
- Backend uses Python runtime with FastAPI
- Frontend uses Node.js with Vite build
- CORS is configured in backend to allow frontend domain
- Database needs to be hosted externally (not included in Vercel)
