package com.studenthub.service;

import com.studenthub.dto.DashboardStatsDto;
import com.studenthub.dto.PageResponse;
import com.studenthub.dto.StudentDto;

import java.util.List;

public interface StudentService {

    PageResponse<StudentDto> getStudents(
            int pageNo,
            int pageSize,
            String sortBy,
            String sortDir,
            String search,
            String department,
            String status
    );

    StudentDto getStudentById(Long id);

    StudentDto getStudentByStudentId(String studentId);

    StudentDto createStudent(StudentDto studentDto);

    StudentDto updateStudent(Long id, StudentDto studentDto);

    void deleteStudent(Long id);

    DashboardStatsDto getDashboardStats();

    List<String> getAllDepartments();
}
