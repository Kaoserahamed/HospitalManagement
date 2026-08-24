from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.department import router as department_router
from routes.appointment import router as appointment_router
from routes.doctor_schedule import router as schedule_router
from routes.patient import router as patient_router

# Import models to register them
from models.user import User
from models.department import Department
from models.doctor import DoctorProfile
from models.patient import Patient
from models.appointment import Appointment
from models.doctor_schedule import DoctorSchedule

app = FastAPI(title="Hospital Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(department_router)
app.include_router(appointment_router)
app.include_router(schedule_router)
app.include_router(patient_router)

@app.get("/")
async def root():
    return {"message": "API Running"}