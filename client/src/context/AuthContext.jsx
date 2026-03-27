import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('almgiver-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('almgiver-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('almgiver-user');
    }
  }, [user]);

  const authenticate = async (endpoint, payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(endpoint, payload);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const { data } = await api.get('/users/profile');
    setUser((prev) => ({ ...prev, ...data, token: prev?.token }));
    return data;
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', payload);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', payload);
      if (data.user) {
        setUser(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: (payload) => authenticate('/auth/login', payload),
        register: (payload) => authenticate('/auth/register', payload),
        refreshProfile,
        updateProfile,
        forgotPassword,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
