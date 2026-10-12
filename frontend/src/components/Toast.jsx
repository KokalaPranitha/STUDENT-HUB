import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let typeClass = 'toast-success';

        if (toast.type === 'error' || toast.type === 'danger') {
          Icon = AlertCircle;
          typeClass = 'toast-danger';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          typeClass = 'toast-warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          typeClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast ${typeClass}`} role="alert">
            <Icon size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn-ghost"
              style={{ padding: '2px', color: '#94a3b8' }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
