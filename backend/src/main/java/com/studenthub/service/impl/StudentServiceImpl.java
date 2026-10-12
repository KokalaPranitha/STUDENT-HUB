package com.studenthub.service.impl;

import com.studenthub.dto.DashboardStatsDto;
import com.studenthub.dto.PageResponse;
import com.studenthub.dto.StudentDto;
import com.studenthub.entity.Student;
import com.studenthub.exception.DuplicateResourceException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public PageResponse<StudentDto> getStudents(
            int pageNo,
            int pageSize,
            String sortBy,
            String sortDir,
            String search,
            String department,
            String status) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        String searchQuery = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String deptFilter = (department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("ALL")) ? department.trim() : null;
        String statusFilter = (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) ? status.trim() : null;

        Page<Student> studentsPage = studentRepository.searchStudents(searchQuery, deptFilter, statusFilter, pageable);

        List<StudentDto> content = studentsPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                studentsPage.getNumber(),
                studentsPage.getSize(),
                studentsPage.getTotalElements(),
                studentsPage.getTotalPages(),
                studentsPage.isFirst(),
                studentsPage.isLast()
        );
    }

    @Override
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToDto(student);
    }

    @Override
    public StudentDto getStudentByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "studentId", studentId));
        return mapToDto(student);
    }

    @Override
    @Transactional
    public StudentDto createStudent(StudentDto studentDto) {
        String cleanStudentId = studentDto.getStudentId().trim().toUpperCase();
        String cleanEmail = studentDto.getEmail().trim().toLowerCase();

        if (studentRepository.existsByStudentId(cleanStudentId)) {
            throw new DuplicateResourceException("Student ID '" + cleanStudentId + "' is already assigned to an existing record.");
        }

        if (studentRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("Email '" + cleanEmail + "' is already registered to another student.");
        }

        Student student = mapToEntity(studentDto);
        student.setStudentId(cleanStudentId);
        student.setEmail(cleanEmail);

        Student savedStudent = studentRepository.save(student);
        return mapToDto(savedStudent);
    }

    @Override
    @Transactional
    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String cleanStudentId = studentDto.getStudentId().trim().toUpperCase();
        String cleanEmail = studentDto.getEmail().trim().toLowerCase();

        // Check uniqueness if studentId has changed
        if (!student.getStudentId().equalsIgnoreCase(cleanStudentId)) {
            studentRepository.findByStudentId(cleanStudentId).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new DuplicateResourceException("Student ID '" + cleanStudentId + "' is already assigned to another student.");
                }
            });
            student.setStudentId(cleanStudentId);
        }

        // Check uniqueness if email has changed
        if (!student.getEmail().equalsIgnoreCase(cleanEmail)) {
            studentRepository.findByEmail(cleanEmail).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new DuplicateResourceException("Email '" + cleanEmail + "' is already registered to another student.");
                }
            });
            student.setEmail(cleanEmail);
        }

        student.setFirstName(studentDto.getFirstName().trim());
        student.setLastName(studentDto.getLastName().trim());
        student.setPhone(studentDto.getPhone().trim());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setDepartment(studentDto.getDepartment().trim());
        student.setEnrollmentDate(studentDto.getEnrollmentDate());
        student.setGpa(studentDto.getGpa());
        student.setAcademicStatus(studentDto.getAcademicStatus() != null ? studentDto.getAcademicStatus() : "ACTIVE");
        student.setAddress(studentDto.getAddress() != null ? studentDto.getAddress().trim() : null);

        Student updatedStudent = studentRepository.save(student);
        return mapToDto(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        studentRepository.delete(student);
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.countByAcademicStatus("ACTIVE");
        long probationStudents = studentRepository.countByAcademicStatus("PROBATION");
        long graduatedStudents = studentRepository.countByAcademicStatus("GRADUATED");

        Double rawAvgGpa = studentRepository.findAverageGpa();
        double avgGpa = 0.0;
        if (rawAvgGpa != null) {
            avgGpa = BigDecimal.valueOf(rawAvgGpa)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        List<Object[]> deptCounts = studentRepository.countStudentsByDepartment();
        Map<String, Long> distribution = new HashMap<>();
        for (Object[] row : deptCounts) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            distribution.put(dept, count);
        }

        return new DashboardStatsDto(
                totalStudents,
                activeStudents,
                probationStudents,
                graduatedStudents,
                avgGpa,
                distribution.size(),
                distribution
        );
    }

    @Override
    public List<String> getAllDepartments() {
        return studentRepository.findDistinctDepartments();
    }

    private StudentDto mapToDto(Student student) {
        return new StudentDto(
                student.getId(),
                student.getStudentId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getPhone(),
                student.getDateOfBirth(),
                student.getDepartment(),
                student.getEnrollmentDate(),
                student.getGpa(),
                student.getAcademicStatus(),
                student.getAddress(),
                student.getCreatedAt(),
                student.getUpdatedAt()
        );
    }

    private Student mapToEntity(StudentDto dto) {
        Student student = new Student();
        student.setId(dto.getId());
        student.setStudentId(dto.getStudentId());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setDepartment(dto.getDepartment());
        student.setEnrollmentDate(dto.getEnrollmentDate());
        student.setGpa(dto.getGpa());
        student.setAcademicStatus(dto.getAcademicStatus() != null ? dto.getAcademicStatus() : "ACTIVE");
        student.setAddress(dto.getAddress());
        return student;
    }
}
