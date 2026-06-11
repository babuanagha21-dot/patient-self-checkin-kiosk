from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from datetime import datetime

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DATABASE CONNECTION
conn = sqlite3.connect("patients.db", check_same_thread=False)
cursor = conn.cursor()

# CREATE TABLE IF NOT EXISTS
cursor.execute("""
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    gender TEXT,
    mobile TEXT,
    address TEXT,
    department TEXT,
    token TEXT,
    created_at TEXT
)
""")

conn.commit()


# PATIENT MODEL
class Patient(BaseModel):
    name: str
    age: int
    gender: str
    mobile: str
    address: str = ""
    department: str


# TOKEN GENERATOR
def generate_token(department):
    cursor.execute(
        "SELECT COUNT(*) FROM patients WHERE department=?",
        (department,)
    )
    count = cursor.fetchone()[0] + 1

    prefix = department[:3].upper()
    return f"{prefix}-{str(count).zfill(3)}"


# CREATE PATIENT
@app.post("/api/patients")
def create_patient(patient: Patient):

    # VALIDATION
    if not patient.name.strip():
        return {"error": "Name is required"}

    if patient.age < 1 or patient.age > 120:
        return {"error": "Age must be between 1 and 120"}

    if len(patient.mobile) != 10 or not patient.mobile.isdigit():
        return {"error": "Mobile number must contain exactly 10 digits"}

    if not patient.department.strip():
        return {"error": "Department is required"}

    token = generate_token(patient.department)

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    INSERT INTO patients
    (name, age, gender, mobile, address, department, token, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (
        patient.name,
        patient.age,
        patient.gender,
        patient.mobile,
        patient.address,
        patient.department,
        token,
        created_at
    ))

    conn.commit()

    return {
        "name": patient.name,
        "department": patient.department,
        "token": token,
        "created_at": created_at
    }


# GET ALL PATIENTS


# GET PATIENT BY ID
@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: int):

    cursor.execute(
        "SELECT * FROM patients WHERE id=?",
        (patient_id,)
    )

    patient = cursor.fetchone()

    if not patient:
        return {"error": "Patient not found"}

    return patient


# SEARCH PATIENTS BY NAME
@app.get("/api/patients")
def get_patients(search: str = None):

    if search:
        cursor.execute(
            "SELECT * FROM patients WHERE name LIKE ? ORDER BY id DESC",
            ('%' + search + '%',)
        )
    else:
        cursor.execute(
            "SELECT * FROM patients ORDER BY id DESC"
        )

    rows = cursor.fetchall()

    return rows


# ROOT ROUTE
@app.get("/")
def home():
    return {
        "message": "Patient Self Check-in Kiosk API Running"
    }

