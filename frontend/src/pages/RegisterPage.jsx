import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageTemplate from '../components/layout/PageTemplate';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!userData.username) {
      newErrors.username = 'Username is required';
    } else if (userData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(userData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(userData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!userData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (userData.password !== userData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Remove confirm_password before sending to backend
      const { confirm_password, ...submitData } = userData;
      
      await register(submitData);
      toast.success('Registration Successful');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      toast.error(errorMessage);
    }
  };

  return (
    <PageTemplate>
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="bg-white p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-6 text-brand-blue">
            Create Account
          </h2>
          
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              error={errors.username}
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              error={errors.password}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={userData.confirm_password}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirm_password}
            />
            
            <Button 
              type="submit"
              variant="primary"
              className="w-full mt-4"
            >
              Register
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-brand-blue hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Additional Registration Help */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-brand-blue hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-brand-blue hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default RegisterPage;