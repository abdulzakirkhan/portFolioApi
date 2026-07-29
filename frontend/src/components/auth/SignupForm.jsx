import React, { useState } from 'react';
import { useSignupMutation } from '../../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials, setError } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const [signup, { isLoading }] = useSignupMutation();
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      errors.name = 'Name cannot be more than 50 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const result = await signup({
        name: formData.name.trim(),
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
        error.data?.message || 'Registration failed. Please try again.'
      ));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-bg">
      <div className="max-w-md w-full mx-4">
        <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-texts mb-2 font-heading">
              Create Account
            </h1>
            <p className="text-secondary">
              Sign up to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-texts mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-base-bg-light border rounded-lg text-texts placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                  validationErrors.name ? 'border-danger' : 'border-borders'
                }`}
                placeholder="John Doe"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-danger">{validationErrors.name}</p>
              )}
            </div>

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
                className={`w-full px-4 py-3 bg-base-bg-light border rounded-lg text-texts placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary ${
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
                className={`w-full px-4 py-3 bg-base-bg-light border rounded-lg text-texts placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                  validationErrors.password ? 'border-danger' : 'border-borders'
                }`}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-danger">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-texts mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-base-bg-light border rounded-lg text-texts placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                  validationErrors.confirmPassword ? 'border-danger' : 'border-borders'
                }`}
                placeholder="••••••••"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-danger">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/80 text-dark font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-heading"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary">
              Already have an account?{' '}
              <a href="/signin" className="text-primary hover:text-primary/80 font-medium">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
