package com.studenthub.dto;

import java.util.Map;

public class DashboardStatsDto {

    private long totalStudents;
    private long activeStudents;
    private long probationStudents;
    private long graduatedStudents;
    private double averageGpa;
    private int departmentCount;
    private Map<String, Long> departmentDistribution;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalStudents, long activeStudents, long probationStudents,
                             long graduatedStudents, double averageGpa, int departmentCount,
                             Map<String, Long> departmentDistribution) {
        this.totalStudents = totalStudents;
        this.activeStudents = activeStudents;
        this.probationStudents = probationStudents;
        this.graduatedStudents = graduatedStudents;
        this.averageGpa = averageGpa;
        this.departmentCount = departmentCount;
        this.departmentDistribution = departmentDistribution;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(long activeStudents) {
        this.activeStudents = activeStudents;
    }

    public long getProbationStudents() {
        return probationStudents;
    }

    public void setProbationStudents(long probationStudents) {
        this.probationStudents = probationStudents;
    }

    public long getGraduatedStudents() {
        return graduatedStudents;
    }

    public void setGraduatedStudents(long graduatedStudents) {
        this.graduatedStudents = graduatedStudents;
    }

    public double getAverageGpa() {
        return averageGpa;
    }

    public void setAverageGpa(double averageGpa) {
        this.averageGpa = averageGpa;
    }

    public int getDepartmentCount() {
        return departmentCount;
    }

    public void setDepartmentCount(int departmentCount) {
        this.departmentCount = departmentCount;
    }

    public Map<String, Long> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }
}
