import sys
import os

# Add parent directory to path so we can import from main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from mangum import Mangum

# Ensure CORS middleware is properly configured
@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    origin = request.headers.get("origin")
    allowed_origins = [
        "https://hospital-frontend-tau-snowy.vercel.app",
        "https://backend-api-black.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ]
    
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, Origin, User-Agent"
    
    return response

# Handler for Vercel serverless
handler = Mangum(app, lifespan="off")
