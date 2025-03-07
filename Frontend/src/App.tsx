import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LolManagerPage from './pages/LolMStartPage';

interface IUser {
  username: string;
  email: string;
}

const App: React.FC = () => {
  // State to track the logged-in user (null means not logged in)
  const [user, setUser] = useState<IUser | null>(null);

  const handleLogin = (token: string, user: { username: string; email: string }) => {
    setUser(user);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
      <BrowserRouter>
        <Routes>
          {/* Default route: show Dashboard if logged in, else LoginPage */}
          <Route
              path="/"
              element={
                user ? (
                    <LolManagerPage username={user.username} onLogout={handleLogout} />
                ) : (
                    <LoginPage onLogin={handleLogin} />
                )
              }
          />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Protected route: only allow access if logged in */}
          <Route
              path="/dashboard"
              element={
                user ? (
                    <LolManagerPage username={user.username} onLogout={handleLogout} />
                ) : (
                    <Navigate to="/" replace />
                )
              }
          />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
