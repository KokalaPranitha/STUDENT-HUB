import React, { useState, useEffect } from 'react';
import { api, getAuthToken, getStoredUser, clearAuthSession } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailsModal from './components/StudentDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import StudentsListPage from './pages/StudentsListPage';
import AddStudentPage from './pages/AddStudentPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()));
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedStudentForForm, setSelectedStudentForForm] = useState(null);
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  // Navigation search focus flag
  const [focusSearchOnList, setFocusSearchOnList] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleAuthExpired = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      addToast('Session Expired', 'Please sign in again to continue.', 'warning');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const handleAuthSuccess = (response) => {
    setIsAuthenticated(true);
    setCurrentUser({
      id: response.id,
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      role: response.role
    });
    addToast('Welcome back!', `Signed in as ${response.fullName}`, 'success');
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    addToast('Logged Out', 'Your session has been securely ended.', 'info');
  };

  const handleNavigate = (view, options = {}) => {
    setActiveView(view);
    if (options.focusSearch) {
      setFocusSearchOnList(true);
    } else {
      setFocusSearchOnList(false);
    }
    setSidebarOpen(false);
  };

  // Open modal handlers
  const handleOpenAddModal = () => {
    setSelectedStudentForForm(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudentForForm(student);
    setFormModalOpen(true);
  };

  const handleOpenDetailsModal = (student) => {
    setSelectedStudentForDetails(student);
    setDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setSelectedStudentForDelete(student);
    setDeleteModalOpen(true);
  };

  // Save student (Add or Edit)
  const handleSaveStudent = async (studentData, id) => {
    setIsSavingStudent(true);
    try {
      if (id) {
        await api.updateStudent(id, studentData);
        addToast('Student Updated', `${studentData.firstName} ${studentData.lastName}'s record was updated successfully.`, 'success');
      } else {
        await api.createStudent(studentData);
        addToast('Student Enrolled', `Record for ${studentData.firstName} ${studentData.lastName} was created successfully.`, 'success');
      }
      setFormModalOpen(false);
      setSelectedStudentForForm(null);
      // Trigger refresh by bumping view or re-rendering
      window.dispatchEvent(new CustomEvent('students:refresh'));
    } catch (err) {
      addToast('Error Saving Record', err.message || 'Validation failed on server.', 'danger');
    } finally {
      setIsSavingStudent(false);
    }
  };

  // Delete student
  const handleConfirmDelete = async (studentId) => {
    setIsDeletingStudent(true);
    try {
      await api.deleteStudent(studentId);
      addToast('Record Deleted', `Student record ${selectedStudentForDelete?.studentId} was removed from database.`, 'info');
      setDeleteModalOpen(false);
      setSelectedStudentForDelete(null);
      window.dispatchEvent(new CustomEvent('students:refresh'));
    } catch (err) {
      addToast('Deletion Failed', err.message || 'Unable to delete student record.', 'danger');
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // If not authenticated, render Auth Portal
  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        user={currentUser}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          activeView={activeView}
          onOpenSidebar={() => setSidebarOpen(true)}
          user={currentUser}
          onLogout={handleLogout}
          onQuickAdd={handleOpenAddModal}
        />

        <main className="content-body">
          {activeView === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onOpenDetailsModal={handleOpenDetailsModal}
              onOpenDeleteModal={handleOpenDeleteModal}
            />
          )}

          {activeView === 'students' && (
            <StudentsListPage
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onOpenDetailsModal={handleOpenDetailsModal}
              onOpenDeleteModal={handleOpenDeleteModal}
              initialFocusSearch={focusSearchOnList}
            />
          )}

          {activeView === 'add-student' && (
            <AddStudentPage
              onStudentAdded={(newStudent) => {
                addToast('Student Enrolled', `${newStudent.firstName} ${newStudent.lastName} added successfully!`, 'success');
                setActiveView('students');
              }}
              onCancel={() => setActiveView('students')}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <StudentFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudentForForm}
        isSaving={isSavingStudent}
      />

      <StudentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onEdit={(student) => {
          setDetailsModalOpen(false);
          handleOpenEditModal(student);
        }}
        student={selectedStudentForDetails}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        student={selectedStudentForDelete}
        isDeleting={isDeletingStudent}
      />

      {/* Toast Notification System */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
