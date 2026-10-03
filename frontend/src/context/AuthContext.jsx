import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rachnika_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Demo Buyer', email: 'user@rachnika.com', role: 'ROLE_BUYER' };
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('rachnika_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rachnika_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};