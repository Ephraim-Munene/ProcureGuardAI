import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentUser();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('procureguard_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('procureguard_token', token);
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const logout = () => {
    localStorage.removeItem('procureguard_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
