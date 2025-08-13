import React, { useEffect, useState } from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/components/pages/Home';
import Login from '../src/components/pages/LoginPage';
import Dashboard from '../src/components/pages/Dashboard';
import NotFound from '../src/components/pages/NotFound';

// Auth check from asp.net core backend
const checkAuthentication = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data.isAuthenticated;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// protected route that uses above checkAuth function
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkAuthentication();
      setIsAuthenticated(true);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;