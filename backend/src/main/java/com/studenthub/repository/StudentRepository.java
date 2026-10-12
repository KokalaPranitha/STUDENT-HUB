package com.studenthub.repository;

import com.studenthub.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByEmail(String email);

    Boolean existsByStudentId(String studentId);

    Boolean existsByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(s.studentId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(CONCAT(s.firstName, ' ', s.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR s.department = :department) AND " +
           "(:status IS NULL OR :status = '' OR s.academicStatus = :status)")
    Page<Student> searchStudents(
            @Param("query") String query,
            @Param("department") String department,
            @Param("status") String status,
            Pageable pageable
    );

    long countByAcademicStatus(String academicStatus);

    @Query("SELECT AVG(s.gpa) FROM Student s")
    Double findAverageGpa();

    @Query("SELECT DISTINCT s.department FROM Student s ORDER BY s.department ASC")
    List<String> findDistinctDepartments();

    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department ORDER BY COUNT(s) DESC")
    List<Object[]> countStudentsByDepartment();
}
