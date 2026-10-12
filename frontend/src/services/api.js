/**
 * StudentHub API Client Service
 * Communicates with Spring Boot REST Backend with JWT Authentication
 */

const API_BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('studenthub_token');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('studenthub_token', token);
  } else {
    localStorage.removeItem('studenthub_token');
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('studenthub_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('studenthub_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('studenthub_user');
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem('studenthub_token');
  localStorage.removeItem('studenthub_user');
};

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      if (!endpoint.includes('/auth/login')) {
        clearAuthSession();
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred';
      if (data) {
        if (data.message) {
          errorMessage = data.message;
        } else if (data.validationErrors) {
          errorMessage = Object.values(data.validationErrors).join(', ');
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    // Network or server unreachable error
    const err = new Error(error.message || 'Unable to connect to the backend server');
    err.status = 503;
    throw err;
  }
}

export const api = {
  // Authentication
  login: async (usernameOrEmail, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (res.token) {
      setAuthToken(res.token);
      setStoredUser({
        id: res.id,
        username: res.username,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });
    }
    return res;
  },

  register: async ({ username, email, password, fullName, role }) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, fullName, role }),
    });
    if (res.token) {
      setAuthToken(res.token);
      setStoredUser({
        id: res.id,
        username: res.username,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });
    }
    return res;
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  logout: () => {
    clearAuthSession();
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    return apiRequest('/dashboard/stats');
  },

  // Student CRUD
  getStudents: async ({ page = 0, size = 10, sortBy = 'id', sortDir = 'desc', search = '', department = '', status = '' }) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDir) params.append('sortDir', sortDir);
    if (search) params.append('search', search);
    if (department && department !== 'ALL') params.append('department', department);
    if (status && status !== 'ALL') params.append('status', status);

    return apiRequest(`/students?${params.toString()}`);
  },

  getStudentById: async (id) => {
    return apiRequest(`/students/${id}`);
  },

  createStudent: async (studentData) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  updateStudent: async (id, studentData) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  deleteStudent: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  getDepartments: async () => {
    return apiRequest('/students/departments');
  },
};
