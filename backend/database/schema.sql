-- ==============================================================================
-- StudentHub - MySQL Database Schema & Seed Data
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS studenthub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studenthub_db;

-- ------------------------------------------------------------------------------
-- 1. Users Table (Authentication & Access Control)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Students Table (Student Records & Profiles)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    department VARCHAR(80) NOT NULL,
    enrollment_date DATE NOT NULL,
    gpa DECIMAL(3, 2) NOT NULL,
    academic_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_code (student_id),
    INDEX idx_student_name (first_name, last_name),
    INDEX idx_student_dept (department),
    INDEX idx_student_status (academic_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Seed Data - Users
-- Default test credentials:
-- Username: admin / Password: password123
-- Username: john_doe / Password: password123
-- (BCrypt hash for 'password123': $2a$10$7Zk49.h1Vq5oD8Qz2e7D..0o8z76wz9yR09Z5bS3rZ7sB5N3m9h8y or standard bcrypt)
-- ------------------------------------------------------------------------------
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@studenthub.edu', '$2a$10$Mud6d7srXZxymKRP1V0yMeQ10virUXsRPLmm4z.CrWBxba5e11tEG', 'Administrator', 'ROLE_ADMIN'),
('sarah_connor', 'sarah.c@studenthub.edu', '$2a$10$Mud6d7srXZxymKRP1V0yMeQ10virUXsRPLmm4z.CrWBxba5e11tEG', 'Dr. Sarah Connor', 'ROLE_STAFF');

-- Note: The bcrypt hash above represents 'password123'.

-- ------------------------------------------------------------------------------
-- 4. Seed Data - Students
-- ------------------------------------------------------------------------------
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, department, enrollment_date, gpa, academic_status, address) VALUES
('STU-2024-001', 'Alexander', 'Wright', 'alex.wright@university.edu', '+1 (555) 234-5678', '2003-04-15', 'Computer Science', '2022-09-01', 3.88, 'ACTIVE', '742 Evergreen Terrace, Springfield'),
('STU-2024-002', 'Sophia', 'Chen', 'sophia.chen@university.edu', '+1 (555) 345-6789', '2004-01-22', 'Data Science', '2023-01-15', 3.95, 'ACTIVE', '10880 Wilshire Blvd, Los Angeles, CA'),
('STU-2024-003', 'Marcus', 'Johnson', 'marcus.j@university.edu', '+1 (555) 456-7890', '2002-11-08', 'Mechanical Engineering', '2021-09-01', 3.42, 'ACTIVE', '350 5th Ave, New York, NY'),
('STU-2024-004', 'Emily', 'Rodriguez', 'emily.rod@university.edu', '+1 (555) 567-8901', '2003-08-30', 'Information Technology', '2022-09-01', 3.75, 'ACTIVE', '221B Baker Street, Boston, MA'),
('STU-2024-005', 'Liam', 'Patel', 'liam.patel@university.edu', '+1 (555) 678-9012', '2004-05-12', 'Computer Science', '2023-09-01', 3.60, 'ACTIVE', '400 Broad St, Seattle, WA'),
('STU-2024-006', 'Olivia', 'Kim', 'olivia.kim@university.edu', '+1 (555) 789-0123', '2003-12-03', 'Business Administration', '2022-01-10', 3.82, 'ACTIVE', '600 Montgomery St, San Francisco, CA'),
('STU-2024-007', 'Ethan', 'Davis', 'ethan.davis@university.edu', '+1 (555) 890-1234', '2002-07-19', 'Electrical Engineering', '2021-09-01', 2.85, 'PROBATION', '1200 S Figueroa St, Los Angeles, CA'),
('STU-2024-008', 'Isabella', 'Garcia', 'isabella.g@university.edu', '+1 (555) 901-2345', '2001-09-14', 'Data Science', '2020-09-01', 3.90, 'GRADUATED', '100 Biscayne Blvd, Miami, FL'),
('STU-2024-009', 'Noah', 'Wilson', 'noah.wilson@university.edu', '+1 (555) 012-3456', '2003-03-25', 'Computer Science', '2022-09-01', 3.55, 'ACTIVE', '500 W Madison St, Chicago, IL'),
('STU-2024-010', 'Ava', 'Taylor', 'ava.taylor@university.edu', '+1 (555) 123-4567', '2004-10-11', 'Biomedical Engineering', '2023-09-01', 3.71, 'ACTIVE', '77 Massachusetts Ave, Cambridge, MA'),
('STU-2024-011', 'Lucas', 'Anderson', 'lucas.anderson@university.edu', '+1 (555) 234-8901', '2002-02-18', 'Information Technology', '2021-09-01', 3.20, 'ACTIVE', '200 S Michigan Ave, Chicago, IL'),
('STU-2024-012', 'Mia', 'Martinez', 'mia.martinez@university.edu', '+1 (555) 345-9012', '2003-06-07', 'Business Administration', '2022-09-01', 3.65, 'ACTIVE', '1100 Louisiana St, Houston, TX');
