package com.studenthub.config;

import com.studenthub.entity.Student;
import com.studenthub.entity.User;
import com.studenthub.repository.StudentRepository;
import com.studenthub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default demo users if users table is empty
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("password123");

            User admin = new User("admin", "admin@studenthub.edu", encodedPassword, "Administrator", "ROLE_ADMIN");
            User sarah = new User("sarah_connor", "sarah.c@studenthub.edu", encodedPassword, "Dr. Sarah Connor", "ROLE_STAFF");

            userRepository.saveAll(List.of(admin, sarah));
        }

        // Seed default student records if students table is empty
        if (studentRepository.count() == 0) {
            studentRepository.saveAll(List.of(
                createStudent("STU-2024-001", "Alexander", "Wright", "alex.wright@university.edu", "+1 (555) 234-5678", LocalDate.of(2003, 4, 15), "Computer Science", LocalDate.of(2022, 9, 1), 3.88, "ACTIVE", "742 Evergreen Terrace, Springfield"),
                createStudent("STU-2024-002", "Sophia", "Chen", "sophia.chen@university.edu", "+1 (555) 345-6789", LocalDate.of(2004, 1, 22), "Data Science", LocalDate.of(2023, 1, 15), 3.95, "ACTIVE", "10880 Wilshire Blvd, Los Angeles, CA"),
                createStudent("STU-2024-003", "Marcus", "Johnson", "marcus.j@university.edu", "+1 (555) 456-7890", LocalDate.of(2002, 11, 8), "Mechanical Engineering", LocalDate.of(2021, 9, 1), 3.42, "ACTIVE", "350 5th Ave, New York, NY"),
                createStudent("STU-2024-004", "Emily", "Rodriguez", "emily.rod@university.edu", "+1 (555) 567-8901", LocalDate.of(2003, 8, 30), "Information Technology", LocalDate.of(2022, 9, 1), 3.75, "ACTIVE", "221B Baker Street, Boston, MA"),
                createStudent("STU-2024-005", "Liam", "Patel", "liam.patel@university.edu", "+1 (555) 678-9012", LocalDate.of(2004, 5, 12), "Computer Science", LocalDate.of(2023, 9, 1), 3.60, "ACTIVE", "400 Broad St, Seattle, WA"),
                createStudent("STU-2024-006", "Olivia", "Kim", "olivia.kim@university.edu", "+1 (555) 789-0123", LocalDate.of(2003, 12, 3), "Business Administration", LocalDate.of(2022, 1, 10), 3.82, "ACTIVE", "600 Montgomery St, San Francisco, CA"),
                createStudent("STU-2024-007", "Ethan", "Davis", "ethan.davis@university.edu", "+1 (555) 890-1234", LocalDate.of(2002, 7, 19), "Electrical Engineering", LocalDate.of(2021, 9, 1), 2.85, "PROBATION", "1200 S Figueroa St, Los Angeles, CA"),
                createStudent("STU-2024-008", "Isabella", "Garcia", "isabella.g@university.edu", "+1 (555) 901-2345", LocalDate.of(2001, 9, 14), "Data Science", LocalDate.of(2020, 9, 1), 3.90, "GRADUATED", "100 Biscayne Blvd, Miami, FL"),
                createStudent("STU-2024-009", "Noah", "Wilson", "noah.wilson@university.edu", "+1 (555) 012-3456", LocalDate.of(2003, 3, 25), "Computer Science", LocalDate.of(2022, 9, 1), 3.55, "ACTIVE", "500 W Madison St, Chicago, IL"),
                createStudent("STU-2024-010", "Ava", "Taylor", "ava.taylor@university.edu", "+1 (555) 123-4567", LocalDate.of(2004, 10, 11), "Biomedical Engineering", LocalDate.of(2023, 9, 1), 3.71, "ACTIVE", "77 Massachusetts Ave, Cambridge, MA"),
                createStudent("STU-2024-011", "Lucas", "Anderson", "lucas.anderson@university.edu", "+1 (555) 234-8901", LocalDate.of(2002, 2, 18), "Information Technology", LocalDate.of(2021, 9, 1), 3.20, "ACTIVE", "200 S Michigan Ave, Chicago, IL"),
                createStudent("STU-2024-012", "Mia", "Martinez", "mia.martinez@university.edu", "+1 (555) 345-9012", LocalDate.of(2003, 6, 7), "Business Administration", LocalDate.of(2022, 9, 1), 3.65, "ACTIVE", "1100 Louisiana St, Houston, TX")
            ));
        }
    }

    private Student createStudent(String studentId, String firstName, String lastName, String email,
                                  String phone, LocalDate dob, String department, LocalDate enrollmentDate,
                                  Double gpa, String status, String address) {
        Student s = new Student();
        s.setStudentId(studentId);
        s.setFirstName(firstName);
        s.setLastName(lastName);
        s.setEmail(email);
        s.setPhone(phone);
        s.setDateOfBirth(dob);
        s.setDepartment(department);
        s.setEnrollmentDate(enrollmentDate);
        s.setGpa(gpa);
        s.setAcademicStatus(status);
        s.setAddress(address);
        return s;
    }
}
