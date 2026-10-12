import React, { useState } from 'react';
import { api } from '../services/api';
import { UserPlus, Save, AlertCircle, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Information Technology',
  'Software Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Biomedical Engineering',
  'Business Administration',
  'Cybersecurity',
  'Civil Engineering'
];

export default function AddStudentPage({ onStudentAdded, onCancel }) {
  const [formData, setFormData] = useState({
    studentId: `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    department: 'Computer Science',
    enrollmentDate: new Date().toISOString().split('T')[0],
    gpa: '3.75',
    academicStatus: 'ACTIVE',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'studentId':
        if (!value || !value.trim()) return 'Student ID is required.';
        if (!/^[A-Za-z0-9-]+$/.test(value)) return 'Student ID can only contain letters, numbers, and hyphens.';
        if (value.length < 3 || value.length > 20) return 'Must be between 3 and 20 characters.';
        return '';
      case 'firstName':
        if (!value || !value.trim()) return 'First name is required.';
        if (value.trim().length < 2) return 'Must be at least 2 characters.';
        return '';
      case 'lastName':
        if (!value || !value.trim()) return 'Last name is required.';
        if (value.trim().length < 2) return 'Must be at least 2 characters.';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Invalid email address format.';
        return '';
      case 'phone':
        if (!value || !value.trim()) return 'Phone number is required.';
        if (!/^[+0-9()\\s-]{7,25}$/.test(value.trim())) return 'Invalid contact number format.';
        return '';
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required.';
        if (new Date(value) >= new Date()) return 'Date of birth must be in the past.';
        return '';
      case 'department':
        if (!value || !value.trim()) return 'Department is required.';
        return '';
      case 'enrollmentDate':
        if (!value) return 'Enrollment date is required.';
        return '';
      case 'gpa':
        if (value === '' || value === null || value === undefined) return 'GPA is required.';
        const num = parseFloat(value);
        if (isNaN(num)) return 'GPA must be a valid number.';
        if (num < 0 || num > 4.0) return 'GPA must be between 0.00 and 4.00.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    const newTouched = {};
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        studentId: formData.studentId.trim().toUpperCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        gpa: parseFloat(formData.gpa),
        address: formData.address.trim()
      };

      const result = await api.createStudent(payload);
      onStudentAdded(result);
    } catch (err) {
      setServerError(err.message || 'Failed to save student profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-icon" onClick={onCancel} title="Go back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.15rem' }}>Enroll New Student</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Create an authenticated student record with MySQL database validation
            </p>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {serverError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Identification & Academic Classification
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              System identifier, departmental assignment, and initial GPA status
            </p>
          </div>

          <div className="form-grid" style={{ marginBottom: '1.75rem' }}>
            {/* Student ID */}
            <div className="form-group">
              <label className="form-label">
                Student ID <span className="req">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                className={`form-control ${errors.studentId && touched.studentId ? 'has-error' : ''}`}
                placeholder="STU-2024-001"
                value={formData.studentId}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.studentId && touched.studentId ? (
                <span className="error-text"><AlertCircle size={12} /> {errors.studentId}</span>
              ) : (
                <span className="form-hint">Unique institutional ID (e.g. STU-2024-XXX)</span>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">
                Department / Major <span className="req">*</span>
              </label>
              <select
                name="department"
                className="form-control custom-select"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* GPA */}
            <div className="form-group">
              <label className="form-label">
                Cumulative GPA (0.00 - 4.00) <span className="req">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.00"
                max="4.00"
                name="gpa"
                className={`form-control ${errors.gpa && touched.gpa ? 'has-error' : ''}`}
                placeholder="3.75"
                value={formData.gpa}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.gpa && touched.gpa ? (
                <span className="error-text"><AlertCircle size={12} /> {errors.gpa}</span>
              ) : (
                <span className="form-hint">Must be between 0.00 and 4.00</span>
              )}
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">
                Academic Status <span className="req">*</span>
              </label>
              <select
                name="academicStatus"
                className="form-control custom-select"
                value={formData.academicStatus}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="ACTIVE">Active</option>
                <option value="PROBATION">Probation</option>
                <option value="GRADUATED">Graduated</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Personal & Contact Information
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Student identity and primary contact channels
            </p>
          </div>

          <div className="form-grid" style={{ marginBottom: '1.75rem' }}>
            {/* First Name */}
            <div className="form-group">
              <label className="form-label">
                First Name <span className="req">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${errors.firstName && touched.firstName ? 'has-error' : ''}`}
                placeholder="Alexander"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.firstName && touched.firstName && (
                <span className="error-text"><AlertCircle size={12} /> {errors.firstName}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">
                Last Name <span className="req">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${errors.lastName && touched.lastName ? 'has-error' : ''}`}
                placeholder="Wright"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.lastName && touched.lastName && (
                <span className="error-text"><AlertCircle size={12} /> {errors.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Institutional Email <span className="req">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email && touched.email ? 'has-error' : ''}`}
                placeholder="alex.wright@university.edu"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.email && touched.email && (
                <span className="error-text"><AlertCircle size={12} /> {errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="req">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className={`form-control ${errors.phone && touched.phone ? 'has-error' : ''}`}
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.phone && touched.phone && (
                <span className="error-text"><AlertCircle size={12} /> {errors.phone}</span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label">
                Date of Birth <span className="req">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className={`form-control ${errors.dateOfBirth && touched.dateOfBirth ? 'has-error' : ''}`}
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.dateOfBirth && touched.dateOfBirth && (
                <span className="error-text"><AlertCircle size={12} /> {errors.dateOfBirth}</span>
              )}
            </div>

            {/* Enrollment Date */}
            <div className="form-group">
              <label className="form-label">
                Enrollment Date <span className="req">*</span>
              </label>
              <input
                type="date"
                name="enrollmentDate"
                className={`form-control ${errors.enrollmentDate && touched.enrollmentDate ? 'has-error' : ''}`}
                value={formData.enrollmentDate}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.enrollmentDate && touched.enrollmentDate && (
                <span className="error-text"><AlertCircle size={12} /> {errors.enrollmentDate}</span>
              )}
            </div>

            {/* Address */}
            <div className="form-group col-span-2">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="742 Evergreen Terrace, Springfield"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Discard Changes
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner spinner-white" style={{ width: '16px', height: '16px' }} />
                  <span>Submitting to Database...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Register Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
