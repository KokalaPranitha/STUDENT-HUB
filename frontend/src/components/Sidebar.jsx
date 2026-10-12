import React from 'react';
import { LayoutDashboard, Users, UserPlus, LogOut, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, user, onLogout, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'View Students', icon: Users },
    { id: 'add-student', label: 'Add Student', icon: UserPlus },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (setIsOpen) setIsOpen(false);
  };

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon-wrapper">
          <GraduationCap size={24} />
        </div>
        <div>
          <div className="brand-title">
            Student<span>Hub</span>
          </div>
          <div className="brand-subtitle">Records Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Core Operations</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer User Info & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">{userInitials}</div>
          <div className="user-info">
            <div className="user-name">{user?.fullName || 'Administrator'}</div>
            <div className="user-role" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={12} color="#10b981" />
              <span>{user?.role || 'ROLE_ADMIN'}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="btn-icon btn-ghost"
            style={{ color: '#94a3b8' }}
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
