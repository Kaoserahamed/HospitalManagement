from fastapi import FastAPI
from routes.auth import router as auth_router

app = FastAPI(title="Hospital Management System API")

app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "API Running"}