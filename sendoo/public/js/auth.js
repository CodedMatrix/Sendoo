// Authentication functions for Sendoo

// API URL
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem('sendoo_token', token);
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('sendoo_token');
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('sendoo_token');
};

// Store user data in localStorage
const setUser = (user) => {
  localStorage.setItem('sendoo_user', JSON.stringify(user));
};

// Get user data from localStorage
const getUser = () => {
  const user = localStorage.getItem('sendoo_user');
  return user ? JSON.parse(user) : null;
};

// Remove user data from localStorage
const removeUser = () => {
  localStorage.removeItem('sendoo_user');
};

// Check if user is logged in
const isLoggedIn = () => {
  return getToken() !== null;
};

// Register a new user
const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Registration failed');
    }

    setToken(data.token);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    setToken(data.token);
    setUser(data.user);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/index.html';
};

// Get user profile
const getUserProfile = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get user profile');
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Change password
const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to change password');
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Forgot password
const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to send password reset email');
    }

    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// Reset password
const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Verify email
const verifyEmail = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to verify email');
    }

    return data;
  } catch (error) {
    console.error('Verify email error:', error);
    throw error;
  }
};

// Check authentication status and update UI
const checkAuth = () => {
  const token = getToken();
  const user = getUser();
  
  if (token && user) {
    // User is logged in
    document.querySelectorAll('.auth-buttons').forEach(el => {
      el.innerHTML = `
        <div class="user-menu">
          <i class="fas fa-user-circle"></i>
          <span>${user.firstName}</span>
          <i class="fas fa-chevron-down"></i>
          <div class="dropdown-menu">
            <a href="/pages/profile.html"><i class="fas fa-user"></i> Profile</a>
            <a href="/pages/history.html"><i class="fas fa-history"></i> History</a>
            <a href="/pages/settings.html"><i class="fas fa-cog"></i> Settings</a>
            <a href="#" class="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        </div>
      `;
    });
    
    // Add event listener to logout link
    document.querySelectorAll('.logout-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });
    
    // Show dropdown menu on click
    document.querySelectorAll('.user-menu').forEach(menu => {
      menu.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('active');
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        document.querySelectorAll('.user-menu').forEach(menu => {
          menu.classList.remove('active');
        });
      }
    });
  } else {
    // User is not logged in
    document.querySelectorAll('.auth-buttons').forEach(el => {
      el.innerHTML = `
        <a href="/pages/login.html" class="btn btn-outline">Login</a>
        <a href="/pages/register.html" class="btn btn-primary">Sign Up</a>
      `;
    });
  }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});