# 🚀 Deploy in 3 Minutes

## Step 1: Setup Database (2 minutes)

### Option A: PlanetScale (Fastest - Free)
1. Go to: https://planetscale.com/
2. Click "Sign up" (use GitHub to sign up instantly)
3. Create new database: `hospital_db`
4. Click "Connect" → Get connection string
5. **Important**: Change format from `mysql://...` to `mysql+asyncmy://...`

### Option B: Railway (Alternative)
1. Go to: https://railway.app/
2. Click "Start a New Project" → "Provision MySQL"
3. Copy connection string
4. Change format to `mysql+asyncmy://...`

## Step 2: Deploy to Vercel (1 minute)

### Click this button:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kaoserahamed/HospitalManagement)

### Or manually:
1. Go to: https://vercel.com/new
2. Import: `https://github.com/Kaoserahamed/HospitalManagement`
3. Vercel will detect `vercel.json` automatically

## Step 3: Set Environment Variables

### Backend Environment Variables:
```
DATABASE_URL=mysql+asyncmy://user:pass@host/hospital_db
SECRET_KEY=PAX3RS0ThetYnI5H09cGG9cKTGP0zk8Qr10FC-qQmWw
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-project-name.vercel.app/api
```

**Note**: Deploy first to get your URL, then add `VITE_API_URL` and redeploy.

## Step 4: Initialize Database

After deployment, run schema:
```bash
mysql -h <your-db-host> -u <user> -p <database> < database/complete_schema.sql
```

Then seed admin:
```bash
cd backend
DATABASE_URL=<your-production-url> python seed_admin.py
```

## 🎉 Done!

Access your app at: `https://your-project-name.vercel.app`

Login with:
- Email: `admin@hospital.com`
- Password: `Admin@123`

---

## Need Help?

**Database connection string format:**
```
mysql+asyncmy://username:password@host:port/database_name
```

**Generate new SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
