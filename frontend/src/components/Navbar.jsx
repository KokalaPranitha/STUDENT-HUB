import React from 'react';
import { Menu, ChevronRight, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeView, onOpenSidebar, user, onLogout, onQuickAdd }) {
  const getBreadcrumbTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Executive Overview';
      case 'students':
        return 'Student Directory & Records';
      case 'add-student':
        return 'Enroll New Student';
      default:
        return 'Student Records Portal';
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="page-breadcrumb">
          <span>StudentHub</span>
          <ChevronRight size={14} color="#94a3b8" />
          <span className="breadcrumb-current">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Live Database status pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: '#ecfdf5',
          borderRadius: '9999px',
          border: '1px solid #a7f3d0',
          fontSize: '0.75rem',
          color: '#065f46',
          fontWeight: 600
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
          }} />
          <span>MySQL Live</span>
        </div>

        {activeView === 'students' && (
          <button className="btn btn-primary btn-sm" onClick={onQuickAdd}>
            <UserPlus size={15} />
            <span>Add Student</span>
          </button>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={onLogout}
          title="Sign out from session"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
