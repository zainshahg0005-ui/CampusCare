import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campuscare_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('campuscare_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate and sync user session on initial mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('campuscare_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('campuscare_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { user: loggedInUser, token: authToken } = res.data;
        setUser(loggedInUser);
        setToken(authToken);
        localStorage.setItem('campuscare_token', authToken);
        localStorage.setItem('campuscare_user', JSON.stringify(loggedInUser));
        return { success: true, user: loggedInUser };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Unable to connect to server',
      };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data?.success) {
        if (res.data.requiresOtp) {
          return {
            success: true,
            requiresOtp: true,
            email: res.data.email,
            message: res.data.message,
          };
        }
        const { user: newUser, token: authToken } = res.data;
        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('campuscare_token', authToken);
        localStorage.setItem('campuscare_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Unable to connect to server',
      };
    }
  };

  // Verify Registration OTP handler
  const verifyRegistrationOtp = async ({ email, otp }) => {
    try {
      const res = await api.post('/auth/verify-registration-otp', { email, otp });
      if (res.data?.success && res.data?.token) {
        const { user: newUser, token: authToken } = res.data;
        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('campuscare_token', authToken);
        localStorage.setItem('campuscare_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data?.message || 'Verification failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Verification failed',
      };
    }
  };

  // Resend Registration OTP
  const resendRegistrationOtp = async (email) => {
    try {
      const res = await api.post('/auth/resend-registration-otp', { email });
      return { success: !!res.data?.success, message: res.data?.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to resend code',
      };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        register,
        verifyRegistrationOtp,
        resendRegistrationOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
