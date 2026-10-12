import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users,
  GraduationCap,
  Award,
  Building,
  UserPlus,
  Search,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage({
  onNavigate,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailsModal,
  onOpenDeleteModal
}) {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, studentsData] = await Promise.all([
        api.getDashboardStats(),
        api.getStudents({ page: 0, size: 5, sortBy: 'id', sortDir: 'desc' })
      ]);
      setStats(statsData);
      setRecentStudents(studentsData.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="status-badge badge-active"><span className="status-badge-dot" /> Active</span>;
      case 'PROBATION':
        return <span className="status-badge badge-probation"><span className="status-badge-dot" /> Probation</span>;
      case 'GRADUATED':
        return <span className="status-badge badge-graduated"><span className="status-badge-dot" /> Graduated</span>;
      case 'SUSPENDED':
        return <span className="status-badge badge-suspended"><span className="status-badge-dot" /> Suspended</span>;
      default:
        return <span className="status-badge badge-active">{status}</span>;
    }
  };

  const getGpaClass = (gpa) => {
    if (gpa >= 3.5) return 'gpa-high';
    if (gpa >= 3.0) return 'gpa-mid';
    return 'gpa-low';
  };

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '36px', height: '36px' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Retrieving live statistics from MySQL database...</p>
      </div>
    );
  }

  const deptDistribution = stats?.departmentDistribution || {};
  const totalInDepts = Object.values(deptDistribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div>
      {/* Title & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Academic Operations Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Real-time enrollment analytics, department distribution, and CRUD operations control
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spinner' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* 1. Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div>
            <div className="metric-label">Total Students</div>
            <div className="metric-value">{stats?.totalStudents ?? 0}</div>
            <div className="metric-sub">
              <TrendingUp size={14} color="#059669" />
              <span>Persisted in MySQL</span>
            </div>
          </div>
          <div className="metric-icon-box metric-icon-blue">
            <Users size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-label">Active Enrollment</div>
            <div className="metric-value">{stats?.activeStudents ?? 0}</div>
            <div className="metric-sub">
              <span style={{ color: '#059669', fontWeight: 600 }}>
                {stats?.totalStudents ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}% Active Rate
              </span>
            </div>
          </div>
          <div className="metric-icon-box metric-icon-emerald">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-label">Average GPA</div>
            <div className="metric-value">{Number(stats?.averageGpa || 0).toFixed(2)}</div>
            <div className="metric-sub">
              <span>Standard 4.00 Grade Scale</span>
            </div>
          </div>
          <div className="metric-icon-box metric-icon-amber">
            <Award size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-label">Departments</div>
            <div className="metric-value">{stats?.departmentCount ?? 0}</div>
            <div className="metric-sub">
              <span>Academic Divisions</span>
            </div>
          </div>
          <div className="metric-icon-box metric-icon-indigo">
            <Building size={24} />
          </div>
        </div>
      </div>

      {/* 2. Primary Card-Based Navigation Menu (Prompt requirement) */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#1e293b' }}>Primary Record Operations</h3>
      <div className="quick-actions-row">
        {/* Action 1: Add Student */}
        <div className="action-card" onClick={onOpenAddModal}>
          <div className="action-card-icon">
            <UserPlus size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title">Add Student</div>
            <div className="action-card-desc">Collect & validate new student profile with MySQL persistence</div>
          </div>
          <ArrowRight size={18} color="#94a3b8" />
        </div>

        {/* Action 2: View Students */}
        <div className="action-card" onClick={() => onNavigate('students')}>
          <div className="action-card-icon">
            <Users size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title">View Students</div>
            <div className="action-card-desc">Inspect paginated data table with sorting and filtering</div>
          </div>
          <ArrowRight size={18} color="#94a3b8" />
        </div>

        {/* Action 3: Search Student */}
        <div className="action-card" onClick={() => onNavigate('students', { focusSearch: true })}>
          <div className="action-card-icon">
            <Search size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title">Search Student</div>
            <div className="action-card-desc">Filter by Student ID, full name, or department</div>
          </div>
          <ArrowRight size={18} color="#94a3b8" />
        </div>
      </div>

      {/* 3. Middle Section: Department Distribution & Academic Status Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Department Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: '#0f172a' }}>
            Department Distribution
          </h3>
          {Object.keys(deptDistribution).length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No departmental records available.</p>
          ) : (
            <div>
              {Object.entries(deptDistribution).map(([dept, count]) => {
                const percentage = Math.round((count / totalInDepts) * 100);
                return (
                  <div key={dept} className="dept-stat-row">
                    <div className="dept-stat-header">
                      <span style={{ color: '#1e293b' }}>{dept}</span>
                      <span style={{ color: '#64748b' }}>
                        <strong>{count}</strong> ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: '#0f172a' }}>
            Academic Standing Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: 600 }}>Active Students</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                {stats?.activeStudents ?? 0}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>Academic Probation</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '0.2rem' }}>
                {stats?.probationStudents ?? 0}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#eef2ff', borderRadius: '10px', border: '1px solid #c7d2fe' }}>
              <div style={{ fontSize: '0.78rem', color: '#3730a3', fontWeight: 600 }}>Graduated</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.2rem' }}>
                {stats?.graduatedStudents ?? 0}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Avg GPA Score</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginTop: '0.2rem' }}>
                {Number(stats?.averageGpa || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Student Records Table with Quick Actions */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.15rem' }}>
              Recent Student Enrollments
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Latest student records persisted in the MySQL database
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('students')}
          >
            <span>View All Records</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Profile</th>
                <th>Department</th>
                <th>GPA</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No student records found in the database.
                  </td>
                </tr>
              ) : (
                recentStudents.map((student) => {
                  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();
                  return (
                    <tr key={student.id}>
                      <td>
                        <span className="student-code-badge">{student.studentId}</span>
                      </td>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar">{initials}</div>
                          <div>
                            <div className="student-primary-name">{student.firstName} {student.lastName}</div>
                            <div className="student-secondary-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{student.department}</td>
                      <td>
                        <span className={`gpa-pill ${getGpaClass(student.gpa)}`}>
                          {Number(student.gpa).toFixed(2)}
                        </span>
                      </td>
                      <td>{getStatusBadge(student.academicStatus)}</td>
                      <td>
                        <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-table-action"
                            title="View Dossier"
                            onClick={() => onOpenDetailsModal(student)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-table-action"
                            title="Edit Student"
                            onClick={() => onOpenEditModal(student)}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="btn-table-action delete"
                            title="Delete Student"
                            onClick={() => onOpenDeleteModal(student)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
