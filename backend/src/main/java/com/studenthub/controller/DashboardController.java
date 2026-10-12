package com.studenthub.controller;

import com.studenthub.dto.DashboardStatsDto;
import com.studenthub.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final StudentService studentService;

    public DashboardController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = studentService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
