import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function StudentsListPage({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailsModal,
  onOpenDeleteModal,
  initialFocusSearch = false
}) {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination & Filtering state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchDepartments = async () => {
    try {
      const depts = await api.getDepartments();
      setDepartments(depts || []);
    } catch (e) {
      // Fallback
    }
  };

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getStudents({
        page,
        size,
        sortBy,
        sortDir,
        search: searchQuery,
        department: departmentFilter,
        status: statusFilter
      });
      setStudents(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Error fetching student records from MySQL');
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, sortDir, searchQuery, departmentFilter, statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('ALL');
    setStatusFilter('ALL');
    setPage(0);
  };

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

  const startEntry = totalElements === 0 ? 0 : page * size + 1;
  const endEntry = Math.min((page + 1) * size, totalElements);

  return (
    <div>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Student Directory & Records</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Browse, search, edit, and safely manage authenticated student profiles persisted in MySQL
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={loadStudents}
            disabled={loading}
            title="Reload from MySQL"
          >
            <RefreshCw size={14} className={loading ? 'spinner' : ''} />
            <span>Reload</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <UserPlus size={15} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Toolbar: Responsive Search Bar & Filters */}
      <div className="table-toolbar">
        {/* Search Input (Prompt requirement: Search by Student Name or Student ID) */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon-adornment" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Student Name or Student ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            autoFocus={initialFocusSearch}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setPage(0); }}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                padding: '2px'
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="filters-group">
          {/* Department Filter */}
          <select
            className="custom-select"
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setPage(0);
            }}
            title="Filter by Department"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Academic Status Filter */}
          <select
            className="custom-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            title="Filter by Academic Status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PROBATION">Probation</option>
            <option value="GRADUATED">Graduated</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {(searchQuery || departmentFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
              title="Clear all active filters"
            >
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Paginated Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="th-sortable" onClick={() => handleSort('studentId')}>
                <div className="th-content">
                  <span>Student ID</span>
                  {sortBy === 'studentId' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>

              <th className="th-sortable" onClick={() => handleSort('firstName')}>
                <div className="th-content">
                  <span>Student Profile</span>
                  {sortBy === 'firstName' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>

              <th className="th-sortable" onClick={() => handleSort('department')}>
                <div className="th-content">
                  <span>Department</span>
                  {sortBy === 'department' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>

              <th className="th-sortable" onClick={() => handleSort('enrollmentDate')}>
                <div className="th-content">
                  <span>Enrollment</span>
                  {sortBy === 'enrollmentDate' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>

              <th className="th-sortable" onClick={() => handleSort('gpa')}>
                <div className="th-content">
                  <span>GPA</span>
                  {sortBy === 'gpa' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>

              <th className="th-sortable" onClick={() => handleSort('academicStatus')}>
                <div className="th-content">
                  <span>Academic Status</span>
                  {sortBy === 'academicStatus' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>

              <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Loading student records from MySQL...</p>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Search size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No matching students found</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '380px', marginBottom: '1.25rem' }}>
                      No student records in MySQL match the selected filters or search terms. Try adjusting your search query or reset filters.
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
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
                    <td>
                      <span style={{ fontWeight: 500, color: '#334155' }}>{student.department}</span>
                    </td>
                    <td>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{student.enrollmentDate || 'N/A'}</span>
                    </td>
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

      {/* Pagination Footer */}
      <div className="table-pagination">
        <div>
          Showing <strong style={{ color: '#0f172a' }}>{startEntry}</strong> to{' '}
          <strong style={{ color: '#0f172a' }}>{endEntry}</strong> of{' '}
          <strong style={{ color: '#0f172a' }}>{totalElements}</strong> students
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Rows per page selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Per page:</span>
            <select
              className="custom-select"
              style={{ padding: '0.3rem 1.6rem 0.3rem 0.6rem', fontSize: '0.8rem' }}
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page numbers navigation */}
          <div className="pagination-pages">
            <button
              className="page-btn"
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || loading}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i).map((pageIdx) => {
              // Show first, last, and current neighbors if pages are many
              if (
                totalPages > 7 &&
                pageIdx !== 0 &&
                pageIdx !== totalPages - 1 &&
                Math.abs(pageIdx - page) > 1
              ) {
                if (Math.abs(pageIdx - page) === 2) {
                  return <span key={pageIdx} style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>;
                }
                return null;
              }

              return (
                <button
                  key={pageIdx}
                  className={`page-btn ${page === pageIdx ? 'active' : ''}`}
                  onClick={() => setPage(pageIdx)}
                  disabled={loading}
                >
                  {pageIdx + 1}
                </button>
              );
            })}

            <button
              className="page-btn"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
