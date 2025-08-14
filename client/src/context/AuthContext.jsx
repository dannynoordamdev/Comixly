import React, { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  register as registerUser,
} from "../services/authService";
import { userInfo } from "../services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const detail = await userInfo();
        setUserDetail(detail);
      } else {
        setUserDetail(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await loginUser(email, password);
    await loadUserData();
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      await registerUser(email, password);
      await loginUser(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setUserDetail(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, userDetail, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
