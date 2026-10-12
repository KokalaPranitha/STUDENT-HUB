package com.studenthub.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class StudentDto {

    private Long id;

    @NotBlank(message = "Student ID is required")
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Student ID must consist of alphanumeric characters and hyphens")
    @Size(min = 3, max = 20, message = "Student ID must be between 3 and 20 characters")
    private String studentId;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+0-9()\\s-]{7,25}$", message = "Phone number must be a valid contact format")
    private String phone;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Department is required")
    @Size(max = 80, message = "Department cannot exceed 80 characters")
    private String department;

    @NotNull(message = "Enrollment date is required")
    private LocalDate enrollmentDate;

    @NotNull(message = "GPA is required")
    @DecimalMin(value = "0.00", message = "GPA cannot be less than 0.00")
    @DecimalMax(value = "4.00", message = "GPA cannot be greater than 4.00")
    private Double gpa;

    private String academicStatus = "ACTIVE";

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentDto() {
    }

    public StudentDto(Long id, String studentId, String firstName, String lastName, String email,
                      String phone, LocalDate dateOfBirth, String department, LocalDate enrollmentDate,
                      Double gpa, String academicStatus, String address,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.department = department;
        this.enrollmentDate = enrollmentDate;
        this.gpa = gpa;
        this.academicStatus = academicStatus != null ? academicStatus : "ACTIVE";
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public String getAcademicStatus() {
        return academicStatus;
    }

    public void setAcademicStatus(String academicStatus) {
        this.academicStatus = academicStatus;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
