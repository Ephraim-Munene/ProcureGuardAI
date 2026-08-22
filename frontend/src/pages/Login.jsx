import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../api/client';
import LoginLeftPanel from '../components/LoginLeftPanel';
import LoginRightPanel from '../components/LoginRightPanel';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('procureguard_token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'FREE',
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(loginForm);
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await registerUser(signupForm);
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface h-screen w-screen overflow-hidden flex flex-col md:flex-row antialiased selection:bg-surface-variant selection:text-primary">
      <LoginLeftPanel />
      <LoginRightPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        error={error}
        loginForm={loginForm}
        signupForm={signupForm}
        handleLoginChange={handleLoginChange}
        handleSignupChange={handleSignupChange}
        handleLoginSubmit={handleLoginSubmit}
        handleSignupSubmit={handleSignupSubmit}
      />
    </div>
  );
};

export default Login;
