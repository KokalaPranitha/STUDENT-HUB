# StudentHub - Backend

Spring Boot 3 REST API backend service for the StudentHub Enterprise Student Management Portal.

## 🏛️ Architecture & Technologies
- **Java 21**
- **Spring Boot 3.3.4**
  - Spring Web (RESTful Controllers)
  - Spring Security (Stateless JWT Authentication)
  - Spring Data JPA & Hibernate
  - Jakarta Bean Validation
- **MySQL 8.0** (with HikariCP Connection Pooling)
- **jjwt 0.12.6** (HMAC-SHA256 Token Generation & Verification)

## 📦 Getting Started

### 1. Database Setup
Ensure MySQL is running on `localhost:3306`, then run the database setup script:
```powershell
Get-Content .\database\schema.sql | mysql -u root -p
```
*Default configuration in `src/main/resources/application.properties`:*
- Port: `3306`
- Database: `studenthub_db`
- Username: `root`
- Password: `root`

### 2. Run Application

#### Using Maven Wrapper (recommended)
```powershell
.\mvnw.cmd spring-boot:run
```

#### Or using system Maven
```powershell
mvn spring-boot:run
```

The service will start on: `http://localhost:8080`

### 3. API Endpoints
- `GET  /api/health` - Health check status
- `POST /api/auth/login` - Authenticate & obtain JWT token
- `POST /api/auth/register` - Register a new user
- `GET  /api/auth/me` - Fetch current authenticated user
- `GET  /api/dashboard/stats` - Enrollment analytics and department metrics
- `GET  /api/students` - Paginated, filtered, and sorted students list
- `GET  /api/students/{id}` - Retrieve student by ID
- `POST /api/students` - Create a student record
- `PUT  /api/students/{id}` - Update a student record
- `DELETE /api/students/{id}` - Delete a student record
- `GET  /api/students/departments` - List distinct academic departments

## 🔑 Default Credentials
- **Username:** `admin` / **Password:** `password123` (Admin Role)
- **Username:** `sarah_connor` / **Password:** `password123` (Staff Role)
