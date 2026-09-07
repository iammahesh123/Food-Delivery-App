import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Eye, EyeOff, X, Shield, Lock, Mail, User, Building } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
  const { handleRegister, handleLogin } = useContext(StoreContext);
  const navigate = useNavigate();

  const [currentState, setCurrentState] = useState('Login'); // 'Login' | 'Register'
  const [selectedRole, setSelectedRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN'
  const [data, setData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowLogin(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [setShowLogin]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (currentState === 'Register') {
      if (!data.fullName.trim() || !data.email.trim() || !data.password.trim()) {
        setErrorMessage('All required fields must be filled.');
        return false;
      }
      if (data.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return false;
      }
    } else {
      if (!data.email.trim() || !data.password.trim()) {
        setErrorMessage('Email and password are required.');
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (currentState === 'Register') {
        const payload = { ...data, role: selectedRole };
        const res = await handleRegister(payload);
        if (res.success) {
          setSuccessMessage('Registration successful! Redirecting...');
          setTimeout(() => {
            setShowLogin(false);
            if (selectedRole === 'RESTAURANT_OWNER' || selectedRole === 'ADMIN') {
              navigate('/dashboard');
            }
          }, 800);
        } else {
          setErrorMessage(res.message || 'Registration failed.');
        }
      } else {
        const payload = { email: data.email, password: data.password, role: selectedRole };
        const res = await handleLogin(payload);
        if (res.success) {
          setSuccessMessage('Login successful! Redirecting...');
          setTimeout(() => {
            setShowLogin(false);
            if (selectedRole === 'RESTAURANT_OWNER' || selectedRole === 'ADMIN') {
              navigate('/dashboard');
            }
          }, 800);
        } else {
          setErrorMessage(res.message || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setErrorMessage('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-popup-backdrop fade-in"
      onClick={() => setShowLogin(false)}
      role="presentation"
    >
      <div
        className="login-popup-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          className="login-close-btn"
          onClick={() => setShowLogin(false)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="login-popup-header">
          <h2 id="auth-modal-title" className="login-title">
            {currentState === 'Login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="login-desc">
            {currentState === 'Login'
              ? 'Access your saved orders, favorites, and operations console.'
              : 'Join as a diner or register as a merchant partner.'}
          </p>
        </div>

        {/* State Tabs */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${currentState === 'Login' ? 'active' : ''}`}
            onClick={() => {
              setCurrentState('Login');
              setErrorMessage('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${currentState === 'Register' ? 'active' : ''}`}
            onClick={() => {
              setCurrentState('Register');
              setErrorMessage('');
            }}
          >
            Register
          </button>
        </div>

        {/* Role Selector */}
        <div className="role-selector-wrap">
          <span className="role-label">Select Account Type:</span>
          <div className="role-buttons-grid">
            <button
              type="button"
              className={`role-btn ${selectedRole === 'CUSTOMER' ? 'active' : ''}`}
              onClick={() => setSelectedRole('CUSTOMER')}
            >
              <User size={14} /> Diner / Customer
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === 'RESTAURANT_OWNER' ? 'active' : ''}`}
              onClick={() => setSelectedRole('RESTAURANT_OWNER')}
            >
              <Building size={14} /> Restaurant Partner
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === 'ADMIN' ? 'active' : ''}`}
              onClick={() => setSelectedRole('ADMIN')}
            >
              <Shield size={14} /> Platform Admin
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="login-form">
          {currentState === 'Register' && (
            <>
              <Input
                label="Full Name"
                name="fullName"
                value={data.fullName}
                onChange={onChangeHandler}
                placeholder="e.g. Alex Morgan"
                required
              />
              <Input
                label="Username"
                name="username"
                value={data.username}
                onChange={onChangeHandler}
                placeholder="alexmorgan"
                required
              />
            </>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="you@domain.com"
            required
          />

          <div className="password-input-group">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={onChangeHandler}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errorMessage && <p className="auth-error-banner" role="alert">{errorMessage}</p>}
          {successMessage && <p className="auth-success-banner" role="status">{successMessage}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="auth-submit-btn"
          >
            {currentState === 'Login' ? 'Sign In to Account' : 'Create Account'}
          </Button>

          <p className="auth-footer-terms">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;