import React, { useState } from 'react';
import { useSigninMutation } from '../../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials, setError } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const [signin, { isLoading }] = useSigninMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await signin({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));

      navigate('/dashboard');
    } catch (error) {
      dispatch(setError(
        error.data?.message || 'Login failed. Please check your credentials.'
      ));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-bg">
      <div className="max-w-md w-full mx-4">
        <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-texts mb-2 font-heading">
              Welcome Back
            </h1>
            <p className="text-secondary">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-texts mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-base-bg-light border rounded-lg text-texts placeholder-muted focus-outline-none focus-ring-2 focus-ring-primary ${
                  validationErrors.email ? 'border-danger' : 'border-borders'
                }`}
                placeholder="john@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-danger">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-texts mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-base-bg-light border rounded-lg text-texts placeholder-muted focus-outline-none focus-ring-2 focus-ring-primary ${
                  validationErrors.password ? 'border-danger' : 'border-borders'
                }`}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-danger">{validationErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover-bg-primary-80 text-dark font-semibold py-3 px-4 rounded-lg transition duration-200 disabled-opacity-50 disabled-cursor-not-allowed font-heading"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary hover-text-primary-80 font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
