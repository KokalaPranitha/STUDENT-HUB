package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.PageResponse;
import com.studenthub.dto.StudentDto;
import com.studenthub.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<StudentDto>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status
    ) {
        PageResponse<StudentDto> students = studentService.getStudents(page, size, sortBy, sortDir, search, department, status);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/code/{studentId}")
    public ResponseEntity<StudentDto> getStudentByStudentId(@PathVariable String studentId) {
        StudentDto student = studentService.getStudentByStudentId(studentId);
        return ResponseEntity.ok(student);
    }

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@Valid @RequestBody StudentDto studentDto) {
        StudentDto created = studentService.createStudent(studentDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDto studentDto) {
        StudentDto updated = studentService.updateStudent(id, studentDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student record successfully deleted."));
    }

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments() {
        List<String> departments = studentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
}
