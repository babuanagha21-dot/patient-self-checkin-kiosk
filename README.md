 Patient Self Check-in Kiosk

A full-stack healthcare kiosk application that allows patients to self-register, generate tokens, and enables admin staff to manage patient records efficiently.

 Tech Stack

 Frontend
- React.js
- React Router
- Axios / Fetch API
- Inline CSS (Kiosk UI design)

 Backend
- FastAPI (Python)
- SQLite Database
- Pydantic (Validation)
- CORS Middleware

 Features

Patient Side
- Patient registration form
- Input validation (age, mobile, required fields)
- Department selection
- Automatic token generation
- Token confirmation screen
- Loading indicator during API calls
- Print option on token page
- Auto redirect to home after submission

 Admin Dashboard
- View all registered patients
- Search patient by name
- Filter by department
- Display token and timestamp


 Database Structure (SQLite)

Table: patients

| Column        | Type    |
|--------------|--------|
| id           | INTEGER |
| name         | TEXT    |
| age          | INTEGER |
| gender       | TEXT    |
| mobile       | TEXT    |
| address      | TEXT    |
| department   | TEXT    |
| token        | TEXT    |
| created_at   | TEXT    |


 API Endpoints

 Patient APIs
- POST /api/patients → Create patient & generate token
- GET /api/patients → Get all patients
- GET /api/patients/{id} → Get patient by ID
- GET /api/patients?search=name → Search patient by name


 Setup Instructions

Clone Repository
git clone https://github.com/babuanagha21-dot/patient-self-checkin-kiosk
