import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, AlertCircle, Save } from 'lucide-react';

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

const ACADEMIC_STATUSES = [
  { value: 'ACTIVE', label: 'Active Status' },
  { value: 'PROBATION', label: 'Academic Probation' },
  { value: 'GRADUATED', label: 'Graduated' },
  { value: 'SUSPENDED', label: 'Suspended' }
];

export default function StudentFormModal({ isOpen, onClose, onSave, student = null, isSaving = false }) {
  const isEditMode = Boolean(student && student.id);

  const initialForm = {
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    department: 'Computer Science',
    enrollmentDate: new Date().toISOString().split('T')[0],
    gpa: '3.50',
    academicStatus: 'ACTIVE',
    address: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '',
        department: student.department || 'Computer Science',
        enrollmentDate: student.enrollmentDate || '',
        gpa: student.gpa !== undefined ? String(student.gpa) : '3.50',
        academicStatus: student.academicStatus || 'ACTIVE',
        address: student.address || ''
      });
    } else {
      // Auto generate sample student ID for convenience on new
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        ...initialForm,
        studentId: `STU-2024-${randomNum}`
      });
    }
    setErrors({});
    setTouched({});
  }, [student, isOpen]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    switch (name) {
      case 'studentId':
        if (!value || !value.trim()) return 'Student ID is required';
        if (!/^[A-Za-z0-9-]+$/.test(value)) return 'Student ID can only contain letters, numbers, and hyphens';
        if (value.length < 3 || value.length > 20) return 'Must be between 3 and 20 characters';
        return '';
      case 'firstName':
        if (!value || !value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value || !value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Invalid email address format';
        return '';
      case 'phone':
        if (!value || !value.trim()) return 'Phone number is required';
        if (!/^[+0-9()\\s-]{7,25}$/.test(value.trim())) return 'Invalid contact number format';
        return '';
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        if (new Date(value) >= new Date()) return 'Date of birth must be in the past';
        return '';
      case 'department':
        if (!value || !value.trim()) return 'Department is required';
        return '';
      case 'enrollmentDate':
        if (!value) return 'Enrollment date is required';
        return '';
      case 'gpa':
        if (value === '' || value === null || value === undefined) return 'GPA is required';
        const num = parseFloat(value);
        if (isNaN(num)) return 'GPA must be a valid number';
        if (num < 0 || num > 4.0) return 'GPA must be between 0.00 and 4.00';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const newTouched = {};
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

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

    onSave(payload, student?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEditMode ? <Edit3 size={20} color="#2563eb" /> : <UserPlus size={20} color="#2563eb" />}
            <span>{isEditMode ? 'Update Student Record' : 'Register New Student'}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isSaving}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Student ID */}
              <div className="form-group">
                <label className="form-label">
                  Student ID <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  className={`form-control ${errors.studentId && touched.studentId ? 'has-error' : ''}`}
                  placeholder="e.g. STU-2024-001"
                  value={formData.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSaving}
                />
                {errors.studentId && touched.studentId && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.studentId}
                  </span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Department <span className="req">*</span>
                </label>
                <select
                  name="department"
                  className={`form-control custom-select ${errors.department && touched.department ? 'has-error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSaving}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* First Name */}
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control ${errors.firstName && touched.firstName ? 'has-error' : ''}`}
                  placeholder="e.g. Alexander"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSaving}
                />
                {errors.firstName && touched.firstName && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.firstName}
                  </span>
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
                  placeholder="e.g. Wright"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSaving}
                />
                {errors.lastName && touched.lastName && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.lastName}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && touched.email ? 'has-error' : ''}`}
                  placeholder="alex.wright@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSaving}
                />
                {errors.email && touched.email && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.email}
                  </span>
                )}
              </div>

              {/* Contact Phone */}
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
                  disabled={isSaving}
                />
                {errors.phone && touched.phone && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.phone}
                  </span>
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
                  disabled={isSaving}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.dateOfBirth}
                  </span>
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
                  disabled={isSaving}
                />
                {errors.enrollmentDate && touched.enrollmentDate && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.enrollmentDate}
                  </span>
                )}
              </div>

              {/* Cumulative GPA */}
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
                  placeholder="3.85"
                  value={formData.gpa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSaving}
                />
                {errors.gpa && touched.gpa && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.gpa}
                  </span>
                )}
              </div>

              {/* Academic Status */}
              <div className="form-group">
                <label className="form-label">
                  Academic Status <span className="req">*</span>
                </label>
                <select
                  name="academicStatus"
                  className="form-control custom-select"
                  value={formData.academicStatus}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  {ACADEMIC_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Residential Address */}
              <div className="form-group col-span-2">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="spinner spinner-white" style={{ width: '16px', height: '16px' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditMode ? 'Update Record' : 'Save Record'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
