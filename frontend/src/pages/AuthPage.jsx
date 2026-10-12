import React, { useState } from 'react';
import { api } from '../services/api';
import { GraduationCap, LogIn, UserPlus, AlertCircle, CheckCircle2, Lock, Mail, User, Shield } from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    usernameOrEmail: 'admin',
    password: 'password123'
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_ADMIN'
  });

  // Client validation state
  const [clientErrors, setClientErrors] = useState({});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginForm.usernameOrEmail.trim() || !loginForm.password) {
      setErrorMessage('Please provide both username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(loginForm.usernameOrEmail.trim(), loginForm.password);
      onAuthSuccess(response);
    } catch (err) {
      // User-friendly Invalid credentials error messages
      if (err.status === 401 || err.message?.toLowerCase().includes('credential')) {
        setErrorMessage('Invalid credentials. Please verify your username/email and password.');
      } else {
        setErrorMessage(err.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const errors = {};
    if (!registerForm.username.trim() || registerForm.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }
    if (!registerForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email.trim())) {
      errors.email = 'Valid email address is required.';
    }
    if (!registerForm.fullName.trim() || registerForm.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }
    if (!registerForm.password || registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setClientErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const response = await api.register({
        username: registerForm.username.trim(),
        email: registerForm.email.trim().toLowerCase(),
        fullName: registerForm.fullName.trim(),
        password: registerForm.password,
        role: registerForm.role
      });
      setSuccessMessage('Registration successful! Redirecting to workspace...');
      setTimeout(() => {
        onAuthSuccess(response);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setLoginForm({
      usernameOrEmail: 'admin',
      password: 'password123'
    });
    setErrorMessage('');
  };

  return (
    <div className="auth-page-container">
      {/* Left Hero Branding Section */}
      <div className="auth-sidebar-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '48px', height: '48px' }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Student<span style={{ color: '#60a5fa' }}>Hub</span>
              </div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                Enterprise Records Portal
              </div>
            </div>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Secure Student Records & Academic Management.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '480px' }}>
            Built with Spring Boot 3, React, and MySQL. Complete tiered architecture featuring authenticated REST services, real-time validation, and paginated data operations.
          </p>
        </div>

        <div className="hero-quote-card">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Shield size={20} color="#60a5fa" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e2e8f0' }}>Enterprise Security</span>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
            All operations are authenticated with signed JSON Web Tokens and BCrypt credential encryption. Data validations protect student records across both client and server layers.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} StudentHub Portal. All rights reserved.
        </div>
      </div>

      {/* Right Form Card Section */}
      <div className="auth-form-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              {isLoginTab ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {isLoginTab ? 'Enter your credentials to access the student portal' : 'Register a new administrator or academic staff member'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
              onClick={() => { setIsLoginTab(true); setErrorMessage(''); }}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
              onClick={() => { setIsLoginTab(false); setErrorMessage(''); }}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* Quick Demo Credentials Bar */}
          {isLoginTab && (
            <div className="demo-credentials-banner">
              <div>
                <strong>Default Demo Account:</strong>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', marginTop: '2px' }}>
                  User: <b>admin</b> | Pass: <b>password123</b>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Alert Messages */}
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              animation: 'fadeIn 180ms ease'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              color: '#059669',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          {isLoginTab ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">
                  Username or Email <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="e.g. admin or admin@studenthub.edu"
                    value={loginForm.usernameOrEmail}
                    onChange={(e) => setLoginForm({ ...loginForm, usernameOrEmail: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Password <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Enter account password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-white" style={{ width: '18px', height: '18px' }} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In to StudentHub</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${clientErrors.fullName ? 'has-error' : ''}`}
                  placeholder="e.g. Eleanor Vance"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  disabled={loading}
                />
                {clientErrors.fullName && <span className="error-text">{clientErrors.fullName}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">
                  Username <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${clientErrors.username ? 'has-error' : ''}`}
                  placeholder="e.g. eleanor_vance"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  disabled={loading}
                />
                {clientErrors.username && <span className="error-text">{clientErrors.username}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">
                  Official Email Address <span className="req">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${clientErrors.email ? 'has-error' : ''}`}
                  placeholder="e.g. eleanor.v@university.edu"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  disabled={loading}
                />
                {clientErrors.email && <span className="error-text">{clientErrors.email}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">
                  Password <span className="req">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${clientErrors.password ? 'has-error' : ''}`}
                  placeholder="At least 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  disabled={loading}
                />
                {clientErrors.password && <span className="error-text">{clientErrors.password}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Confirm Password <span className="req">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${clientErrors.confirmPassword ? 'has-error' : ''}`}
                  placeholder="Re-type password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  disabled={loading}
                />
                {clientErrors.confirmPassword && <span className="error-text">{clientErrors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-white" style={{ width: '18px', height: '18px' }} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
