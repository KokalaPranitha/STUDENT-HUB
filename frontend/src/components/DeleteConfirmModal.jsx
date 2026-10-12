import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, CheckSquare, Square } from 'lucide-react';

export default function DeleteConfirmModal({ student, isOpen, onClose, onConfirm, isDeleting }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [typedConfirm, setTypedConfirm] = useState('');

  if (!isOpen || !student) return null;

  const handleClose = () => {
    setAcknowledged(false);
    setTypedConfirm('');
    onClose();
  };

  const isConfirmed = acknowledged && typedConfirm.trim().toUpperCase() === student.studentId.trim().toUpperCase();

  const handleProceed = () => {
    if (isConfirmed) {
      onConfirm(student.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottomColor: '#fecaca', backgroundColor: '#fff5f5' }}>
          <div className="modal-title" style={{ color: '#dc2626' }}>
            <AlertTriangle size={22} />
            <span>Confirm Record Deletion</span>
          </div>
          <button className="modal-close-btn" onClick={handleClose} disabled={isDeleting}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#334155' }}>
            You are initiating the permanent removal of the following student record from the persistent database:
          </p>

          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Student ID:</span>
              <span className="student-code-badge">{student.studentId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Full Name:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{student.firstName} {student.lastName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Department:</span>
              <span style={{ fontSize: '0.85rem', color: '#334155' }}>{student.department}</span>
            </div>
          </div>

          {/* Double Confirmation Step 1: Checkbox */}
          <div
            onClick={() => setAcknowledged(!acknowledged)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              userSelect: 'none'
            }}
          >
            {acknowledged ? (
              <CheckSquare size={20} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
            ) : (
              <Square size={20} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
              I acknowledge that this action cannot be undone and all academic records for this student will be permanently deleted.
            </span>
          </div>

          {/* Double Confirmation Step 2: Verification Input */}
          {acknowledged && (
            <div style={{ marginTop: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Type <strong style={{ color: '#0f172a' }}>{student.studentId}</strong> to confirm:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={student.studentId}
                value={typedConfirm}
                onChange={(e) => setTypedConfirm(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleProceed}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner spinner-white" style={{ width: '16px', height: '16px' }} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Permanently Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
