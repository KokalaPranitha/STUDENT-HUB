import React from 'react';
import { X, Edit3, Mail, Phone, MapPin, Calendar, Award, Building, UserCheck } from 'lucide-react';

export default function StudentDetailsModal({ student, isOpen, onClose, onEdit }) {
  if (!isOpen || !student) return null;

  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="status-badge badge-active"><span className="status-badge-dot" /> Active</span>;
      case 'PROBATION':
        return <span className="status-badge badge-probation"><span className="status-badge-dot" /> Academic Probation</span>;
      case 'GRADUATED':
        return <span className="status-badge badge-graduated"><span className="status-badge-dot" /> Graduated</span>;
      case 'SUSPENDED':
        return <span className="status-badge badge-suspended"><span className="status-badge-dot" /> Suspended</span>;
      default:
        return <span className="status-badge badge-active">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <UserCheck size={20} color="#2563eb" />
            <span>Student Dossier</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Profile Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              flexShrink: 0
            }}>
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.35rem' }}>{student.firstName} {student.lastName}</h3>
                <span className="student-code-badge">{student.studentId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                {getStatusBadge(student.academicStatus)}
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{student.department}</span>
              </div>
            </div>
          </div>

          {/* Academic Profile Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <Award size={16} color="#d97706" /> Cumulative GPA
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {Number(student.gpa).toFixed(2)} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>/ 4.00</span>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <Building size={16} color="#2563eb" /> Department
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                {student.department}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <Calendar size={16} color="#059669" /> Enrollment Date
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                {student.enrollmentDate || 'N/A'}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <Calendar size={16} color="#6366f1" /> Date of Birth
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                {student.dateOfBirth || 'N/A'}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#1e293b' }}>Contact & Location Details</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Mail size={16} color="#64748b" />
                <span style={{ color: '#64748b', width: '90px' }}>Email:</span>
                <a href={`mailto:${student.email}`} style={{ color: '#2563eb', fontWeight: 500 }}>{student.email}</a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Phone size={16} color="#64748b" />
                <span style={{ color: '#64748b', width: '90px' }}>Phone:</span>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>{student.phone}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <MapPin size={16} color="#64748b" />
                <span style={{ color: '#64748b', width: '90px' }}>Address:</span>
                <span style={{ color: '#0f172a' }}>{student.address || 'No residential address on file'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
          >
            <Edit3 size={16} />
            <span>Modify Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}
