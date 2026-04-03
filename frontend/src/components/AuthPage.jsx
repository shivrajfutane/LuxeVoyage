import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, Globe, Smartphone, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import anime from 'animejs/lib/anime.es.js';
import { shakeElement, pulseGlow } from '../hooks/useAnime';
import { API_BASE_URL } from '../config';

export default function AuthPage({ onLoginSuccess, onBack }) {
  const [authMode, setAuthMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const cardRef = useRef(null);

  // Card entrance animation on mount
  useEffect(() => {
    if (!cardRef.current) return;
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });
  }, []);

  // Re-animate card when auth mode changes
  useEffect(() => {
    if (!cardRef.current) return;
    anime({
      targets: cardRef.current,
      opacity: [0.6, 1],
      translateX: [20, 0],
      duration: 400,
      easing: 'easeOutCubic',
    });
  }, [authMode]);

  // Shake on error
  useEffect(() => {
    if (error && cardRef.current) shakeElement(cardRef.current);
  }, [error]);

  // Glow on success
  useEffect(() => {
    if (successMsg && cardRef.current) pulseGlow(cardRef.current, 'rgba(34,197,94,0.4)');
  }, [successMsg]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    pin: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoogleSuccess = async (idToken) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google Authentication failed');

      onLoginSuccess(data.user);
    } catch (err) {
      if (err.message.includes('503') || err.message.toLowerCase().includes('database')) {
        setError('DATABASE OFFLINE: LuxeVoyage cannot reach its vault. Please ensure your current IP is whitelisted in MongoDB Atlas.');
      } else {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
        if (!formData.agreeTerms) throw new Error("You must agree to the Terms of Service");

        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        onLoginSuccess(data.user);

      } else if (authMode === 'login') {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        onLoginSuccess(data.user);

      } else if (authMode === 'forgot_email') {
        const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        setSuccessMsg(data.message || "Security PIN dispatched! Please check your email inbox.");
        setAuthMode('forgot_pin');

      } else if (authMode === 'forgot_pin') {
        if (formData.password !== formData.confirmPassword) throw new Error("New passwords do not match");

        const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, pin: formData.pin, newPassword: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        setSuccessMsg("Password successfully reset! You can now log in.");
        setAuthMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '', pin: '' }));
      }
    } catch (err) {
      if (err.status === 503 || err.message.includes('503') || err.message.toLowerCase().includes('database')) {
        setError('DATABASE OFFLINE: LuxeVoyage cannot reach its vault. Please ensure your current IP is whitelisted in MongoDB Atlas (Network Access).');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header text-center" style={{ marginBottom: '40px' }}>
        <h1 className="app-title text-gradient" style={{ fontSize: '2.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="url(#goldGradient)" />
            <path d="M12 5.5L13.5 10.5L18.5 12L13.5 13.5L12 18.5L10.5 13.5L5.5 12L10.5 10.5L12 5.5Z" fill="#050505" />
            <defs>
              <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f1cf5b" />
                <stop offset="0.5" stopColor="#d4af37" />
                <stop offset="1" stopColor="#b08d28" />
              </linearGradient>
            </defs>
          </svg>
          LuxeVoyage
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          {authMode === 'login' && "Sign in to craft your perfect journey"}
          {authMode === 'signup' && "Create your account to get started"}
          {authMode === 'forgot_email' && "Recover your account securely"}
          {authMode === 'forgot_pin' && "Check your email inbox for the PIN"}
        </p>
      </div>

      <div ref={cardRef} className="glass auth-card" style={{ opacity: 0 }}>
        {authMode !== 'login' && authMode !== 'signup' && (
          <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px', fontSize: '0.9rem', fontFamily: 'Outfit' }}>
            <ArrowLeft size={16} /> Back to login
          </button>
        )}

        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center', color: 'white' }}>
          {authMode === 'login' && "Welcome Back"}
          {authMode === 'signup' && "Create Account"}
          {authMode === 'forgot_email' && "Reset Password"}
          {authMode === 'forgot_pin' && "Enter Security PIN"}
        </h2>

        {/* New: Back to Landing Page Button */}
        {(authMode === 'login' || authMode === 'signup') && (
          <button 
            onClick={onBack} 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '25px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.85rem',
              opacity: 0.7,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
            onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} /> Authentication Notice
            </div>
            <p style={{ margin: 0, lineHeight: '1.5', opacity: 0.9 }}>{error}</p>
            {error.includes('DATABASE') && (
              <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <strong>How to fix:</strong> Log into MongoDB Atlas ➔ Network Access ➔ Add Current IP Address.
              </div>
            )}
          </div>
        )}
        
        {successMsg && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label className="form-label">
                <User size={16} className="icon" /> Full Name
              </label>
              <input 
                type="text" name="name" className="input" placeholder="John Doe" 
                value={formData.name} onChange={handleChange} required 
              />
            </div>
          )}

          {(authMode === 'login' || authMode === 'signup' || authMode === 'forgot_email') && (
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} className="icon" /> Email Address
              </label>
              <input 
                type="email" name="email" className="input" placeholder="you@example.com" 
                value={formData.email} onChange={handleChange} required disabled={authMode === 'forgot_pin'}
              />
            </div>
          )}

          {authMode === 'forgot_pin' && (
            <div className="form-group">
              <label className="form-label">
                <ShieldCheck size={16} className="icon" /> 6-Digit PIN
              </label>
              <input 
                type="text" name="pin" className="input" placeholder="123456" 
                value={formData.pin} onChange={handleChange} required maxLength="6"
                style={{ letterSpacing: '2px', fontSize: '1.2rem', textAlign: 'center' }}
              />
            </div>
          )}

          {(authMode === 'login' || authMode === 'signup' || authMode === 'forgot_pin') && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  {authMode === 'forgot_pin' ? <><KeyRound size={16} className="icon" /> New Password</> : <><Lock size={16} className="icon" /> Password</>}
                </label>
                {authMode === 'login' && <button type="button" onClick={() => switchMode('forgot_email')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Outfit' }}>Forgot password?</button>}
              </div>
              <input 
                type="password" name="password" className="input" placeholder="••••••••" 
                value={formData.password} onChange={handleChange} required 
                style={{ marginTop: '10px' }}
              />
            </div>
          )}

          {(authMode === 'signup' || authMode === 'forgot_pin') && (
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} className="icon" /> Confirm {authMode === 'forgot_pin' ? 'New ' : ''}Password
              </label>
              <input 
                type="password" name="confirmPassword" className="input" placeholder="••••••••" 
                value={formData.confirmPassword} onChange={handleChange} required 
              />
            </div>
          )}

          {authMode === 'login' && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-8px' }}>
              <input type="checkbox" id="remember" className="custom-checkbox" />
              <label htmlFor="remember" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>Remember me</label>
            </div>
          )}

          {authMode === 'signup' && (
             <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input type="checkbox" id="agree" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="custom-checkbox" style={{ marginTop: '4px' }} />
              <label htmlFor="agree" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', lineHeight: '1.4' }}>
                I agree to the <span style={{ color: 'var(--primary)' }}>Terms of Service</span> and <span style={{ color: 'var(--primary)' }}>Privacy Policy</span>
              </label>
            </div>
          )}

          <button type="submit" className="btn" disabled={isLoading} style={{ marginTop: '10px' }}>
            {isLoading ? "Please wait..." : (
              authMode === 'login' ? "Sign In" : 
              authMode === 'signup' ? "Create Account" :
              authMode === 'forgot_email' ? "Send Reset PIN" : "Save New Password"
            )}
            {!isLoading && <ArrowRight size={18} style={{ marginLeft: '4px' }} />}
          </button>
        </form>

        {(authMode === 'login' || authMode === 'signup') && (
          <>
            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="google-login-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    handleGoogleSuccess(credentialResponse.credential);
                  }}
                  onError={() => {
                    setError('Google Login failed. Please try again.');
                  }}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  width="100%"
                />
              </div>
              <button type="button" className="social-btn" disabled={isLoading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.9463 3.06451C18.0699 1.63661 18.7905 0 18.2917 0C17.0674 0.224424 15.3683 1.1687 14.2868 2.51268C13.313 3.70889 12.4344 5.38555 12.9866 6.94297C14.3313 6.90379 15.8601 6.01428 16.9463 3.06451ZM22.5186 16.8524C22.086 18.0253 19.3364 24 15.5401 24C13.5658 24 12.8718 22.8665 10.8755 22.8665C8.83546 22.8665 8.01257 23.9593 6.35332 23.9593C4.54226 23.9593 1.61907 17.5855 0.5 15.156C-1.39956 10.9705 2.16279 8.16335 4.96874 8.16335C6.73292 8.16335 7.97169 9.38778 9.53126 9.38778C11.1351 9.38778 12.1158 8.08271 14.3323 8.08271C15.5134 8.08271 18.2435 8.44124 19.7844 10.7481C16.9189 12.5593 17.5113 16.2996 20.3541 17.4116C20.9168 17.6534 21.7348 17.669 22.5186 16.8524Z" />
                </svg> Apple
              </button>
            </div>
          </>
        )}
      </div>

      {(authMode === 'login' || authMode === 'signup') && (
        <div className="auth-footer text-center" style={{ marginTop: '30px', color: 'var(--text-muted)' }}>
          {authMode === 'login' ? (
            <p>Don't have an account? <button onClick={() => switchMode('signup')} className="link-btn">Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => switchMode('login')} className="link-btn">Sign in</button></p>
          )}
        </div>
      )}
    </div>
  );
}
