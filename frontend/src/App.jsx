import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import SignupForm from './components/auth/SignupForm';
import SigninForm from './components/auth/SigninForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AboutMe from './pages/AboutMe';
import Education from './pages/Education';
import Experience from './pages/Experience';
import Portfolio from './pages/Portfolio';
import Achievements from './pages/Achievements';
import Updates from './pages/Updates';
import Sections from './pages/Sections';
import Items from './pages/Items';
import Categories from './pages/Categories';
import Skills from './pages/Skills';
import Translations from './pages/Translations';
import Files from './pages/Files';
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
      <Route 
        path="/dashboard/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/about" 
        element={
          <ProtectedRoute>
            <AboutMe />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/education" 
        element={
          <ProtectedRoute>
            <Education />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/experience" 
        element={
          <ProtectedRoute>
            <Experience />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/portfolio" 
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/updates" 
        element={
          <ProtectedRoute>
            <Updates />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/achievements" 
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/sections" 
        element={
          <ProtectedRoute>
            <Sections />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/items" 
        element={
          <ProtectedRoute>
            <Items />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/skills" 
        element={
          <ProtectedRoute>
            <Skills />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/categories" 
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/strings" 
        element={
          <ProtectedRoute>
            <Translations />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/files" 
        element={
          <ProtectedRoute>
            <Files />
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
