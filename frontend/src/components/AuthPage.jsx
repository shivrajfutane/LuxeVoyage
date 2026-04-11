import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, Globe, Smartphone, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Google Authentication failed');

        onLoginSuccess(data.user);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Google Authentication failed');
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login Error:', errorResponse);
      setError('Google Login failed. Please try again.');
    }
  });

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
      setError(err.message);
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
        <h1 className="app-title text-gradient" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

      <div ref={cardRef} className="glass auth-card" style={{ opacity: 0, position: 'relative' }}>
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
              display: 'flex',
              alignItems: 'center', 
              gap: '6px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              fontSize: '0.85rem',
              opacity: 0.7,
              transition: 'opacity 0.2s',
              marginBottom: '16px',
              fontFamily: 'Outfit, sans-serif'
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <button type="button" className="social-btn" onClick={() => loginWithGoogle()} disabled={isLoading} style={{ justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg> Sign in with Google
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
