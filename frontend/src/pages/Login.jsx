import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../api/client';
import LoginLeftPanel from '../components/LoginLeftPanel';
import LoginRightPanel from '../components/LoginRightPanel';
import MpesaPaymentModal from '../components/MpesaPaymentModal';
import { getTierById } from '../data/tiers';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingPayment, setPendingPayment] = useState(null);

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
      setError(err.response?.data?.message || 'Wrong email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const selectedTier = signupForm.plan;
    // Always create the account on FREE first; paid plans are activated via M-Pesa right after.
    try {
      const data = await registerUser({ ...signupForm, plan: 'FREE' });
      login(data.token, data.user);
      if (selectedTier !== 'FREE') {
        const tier = getTierById(selectedTier);
        setPendingPayment({ plan: tier.id, amount: tier.amount });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const finishSignup = () => {
    setPendingPayment(null);
    navigate('/', { replace: true });
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen md:h-screen w-full md:w-screen overflow-y-auto md:overflow-hidden flex flex-col md:flex-row antialiased selection:bg-surface-variant selection:text-primary">
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
      {pendingPayment && (
        <MpesaPaymentModal
          isOpen={!!pendingPayment}
          onClose={finishSignup}
          plan={pendingPayment.plan}
          amount={pendingPayment.amount}
          onSuccess={finishSignup}
        />
      )}
    </div>
  );
};

export default Login;
