import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import SignupForm from './components/auth/SignupForm';
import SigninForm from './components/auth/SigninForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { apiSlice } from './services/api';
import { useGetMeQuery } from './services/authApi';
import { setUser, logout } from './store/authSlice';

function AppContent() {
  const token = localStorage.getItem('token');
  const { data: user, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token, // Skip query if no token
  });

  useEffect(() => {
    if (user) {
      store.dispatch(setUser(user.user));
    } else if (error) {
      // Token invalid, clear it
      store.dispatch(logout());
    }
  }, [user, error]);

  if (isLoading && token) {
    return <div className="min-h-screen flex items-center justify-center bg-base-bg text-texts">Loading user from database...</div>;
  }

  return (
    <Routes>
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/signin" element={<SigninForm />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
