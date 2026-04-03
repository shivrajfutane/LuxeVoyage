import { useState, useEffect } from 'react';

/**
 * Custom Hook: useUser
 * Centralizes User Identity, Session Recovery, and Authorization
 */
export default function useUser() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recoverSession();
  }, []);

  const logout = () => {
    localStorage.removeItem('tripPlannerUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const recoverSession = () => {
    try {
      const savedUser = localStorage.getItem('tripPlannerUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        
        // NORMALIZATION: Ensure 'id' exists (handles _id mismatch)
        const normalizedUser = {
          ...parsedUser,
          id: parsedUser.id || parsedUser._id
        };

        setUser(normalizedUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Session recovery failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    // Normalization during login
    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id
    };

    setUser(normalizedUser);
    setIsAuthenticated(true);
    localStorage.setItem('tripPlannerUser', JSON.stringify(normalizedUser));
  };

  const updateUser = (newData) => {
    setUser(prev => {
      // NORMALIZATION: Ensure id is preserved even if backend only returns _id
      const normalizedNewData = {
        ...newData,
        id: newData.id || newData._id || prev?.id
      };
      const updatedUser = { ...prev, ...normalizedNewData };
      localStorage.setItem('tripPlannerUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return { user, isAuthenticated, loading, login, logout, refresh: recoverSession, updateUser };
}
