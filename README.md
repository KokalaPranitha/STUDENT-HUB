# StudentHub - Enterprise Student Management Web Application

**StudentHub** is an enterprise-grade full-stack web application designed to securely manage student records. Built with a strict layered architecture, robust validation constraints, JWT-based security, and a modern corporate user interface.

---

## 🏛️ Technical Architecture & Stack

```
                     ┌────────────────────────────────────────┐
                     │          React 19 + Vite Frontend      │
                     │  - Functional Components & Hooks       │
                     │  - Vanilla CSS Executive Design System │
                     │  - Lucide Icons & Responsive Grids     │
                     └───────────────────▲────────────────────┘
                                         │ JSON / REST + Bearer JWT
                     ┌───────────────────▼────────────────────┐
                     │       Spring Boot 3.3.4 Backend        │
                     │  - REST Controllers (Validation Layer) │
                     │  - Service Layer (Business Logic)      │
                     │  - Spring Security (Stateless JWT)     │
                     │  - Spring Data JPA / Hibernate         │
                     └───────────────────▲────────────────────┘
                                         │ JDBC / HikariCP
                     ┌───────────────────▼────────────────────┐
                     │          MySQL 8.0 Database            │
                     │  - studenthub_db                       │
                     │  - users & students tables             │
                     │  - Indexes & Unique Constraints        │
                     └────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Authentication Portal**:
   - Secure login and registration flows.
   - BCrypt password hashing & Stateless HMAC-SHA256 JWT tokens.
   - User-friendly invalid credentials error feedback.
   - One-click demo credentials autofill (`admin` / `password123`).

2. **Main Dashboard**:
   - Executive metrics: Total Students, Active Enrollment rate, Average GPA, Departments count.
   - Card-based navigation menu for primary CRUD operations.
   - Real-time department distribution progress indicators.
   - Academic standing breakdown (Active, Probation, Graduated, Suspended).
   - Recent enrollments preview table with direct row actions.

3. **Student Directory & CRUD Operations**:
   - **View Students**: Clean, paginated data table with customizable page size (5, 10, 20, 50).
   - **Multi-field Sorting**: Interactive column sorting on Student ID, Name, Department, Enrollment, GPA, and Status.
   - **Responsive Search**: Real-time filtering by Student Name or Student ID.
   - **Department & Status Filters**: Filter by major or academic standing with instant reset.
   - **Add Student**: Interactive form with dual client-side & server-side validation.
   - **Update Student**: Safe modal editor with real-time field validation.
   - **View Dossier**: Detailed student profile view.
   - **Double-Confirmation Deletion**: Two-step protection modal (confirmation checkbox + typing Student ID) to prevent accidental data loss.

---

## 📁 Project Directory Structure

```
c:\STUDENT-HUB\
├── database/
│   └── schema.sql                  # MySQL schema definition, constraints, and seed data
├── backend/                        # Spring Boot 3 Java Backend
│   ├── pom.xml                     # Maven project configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/studenthub/
│       │   │   ├── StudentHubApplication.java
│       │   │   ├── config/         # Security, CORS, JWT Filters & Provider
│       │   │   ├── controller/     # AuthController, StudentController, DashboardController
│       │   │   ├── dto/            # Data transfer objects with Bean Validation
│       │   │   ├── entity/         # JPA entities (User, Student)
│       │   │   ├── exception/      # GlobalExceptionHandler & custom exceptions
│       │   │   ├── repository/     # Spring Data JPA repositories
│       │   │   └── service/        # Business logic services & implementations
│       │   └── resources/
│       │       └── application.properties # MySQL & JWT configuration
├── frontend/                       # React Frontend Application
│   ├── index.html                  # HTML entry point with Google Fonts (Inter, Outfit)
│   ├── package.json
│   ├── vite.config.js              # Vite server & backend API proxy
│   └── src/
│       ├── App.jsx                 # Main React component & state orchestrator
│       ├── index.css               # Corporate executive design system
│       ├── components/             # Reusable UI components (Sidebar, Navbar, Modals, Toast)
│       ├── pages/                  # AuthPage, DashboardPage, StudentsListPage, AddStudentPage
│       └── services/
│           └── api.js              # REST client with JWT interceptor & error mapping
├── task.md                         # Detailed implementation checklist
└── README.md                       # Documentation & setup guide
```

---

## ⚡ Quick Start Guide

### 1. Database Setup (MySQL)
Ensure MySQL is running on `localhost:3306`:
```powershell
Get-Content 'c:\STUDENT-HUB\database\schema.sql' | mysql -u root -p
```
*Default database credentials in `backend/src/main/resources/application.properties`:*
- Port: `3306`
- Database: `studenthub_db`
- Username: `root`
- Password: `root`

### 2. Run Backend (Spring Boot)
Open a terminal in `c:\STUDENT-HUB\backend`:
```powershell
# Option A: Using the included Maven Wrapper (recommended, no system Maven required)
.\mvnw spring-boot:run

# Option B: Double-click or run the startup batch file
.\run-backend.bat

# Option C: If Maven is in your PATH
mvn spring-boot:run
```
The backend starts on: `http://localhost:8080`

### 3. Run Frontend (React + Vite)
Open a terminal in `c:\STUDENT-HUB\frontend`:
```powershell
npm install
npm run dev
```
The application opens at: `http://localhost:5173`

---

## 🔑 Default Credentials

| Username | Password | Full Name | Role |
| :--- | :--- | :--- | :--- |
| `admin` | `password123` | Administrator | `ROLE_ADMIN` |
| `sarah_connor` | `password123` | Dr. Sarah Connor | `ROLE_STAFF` |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & generate JWT | No |
| `POST` | `/api/auth/register` | Register new user | No |
| `GET` | `/api/auth/me` | Fetch authenticated user info | Yes (Bearer) |
| `GET` | `/api/dashboard/stats` | Aggregated dashboard enrollment metrics | Yes (Bearer) |
| `GET` | `/api/students` | Paginated, filtered, and sorted students list | Yes (Bearer) |
| `GET` | `/api/students/{id}` | Retrieve specific student profile | Yes (Bearer) |
| `POST` | `/api/students` | Create new student record | Yes (Bearer) |
| `PUT` | `/api/students/{id}` | Update existing student record | Yes (Bearer) |
| `DELETE`| `/api/students/{id}` | Remove student record permanently | Yes (Bearer) |
| `GET` | `/api/students/departments` | Distinct list of academic departments | Yes (Bearer) |
| `GET` | `/api/health` | Service health status check | No |
