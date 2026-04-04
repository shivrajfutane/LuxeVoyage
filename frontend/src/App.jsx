import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import TripResults from './components/TripResults';
import Loader from './components/Loader';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import SharedTrip from './pages/SharedTrip';
import PublicProfile from './pages/PublicProfile';
import ProfileSection from './components/ProfileSection';
import { Compass, Map, LogOut, History, Plane, User, Sun, Moon } from 'lucide-react';

import useUser from './hooks/useUser';
import { API_BASE_URL } from './config';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('planner');
  const [showLanding, setShowLanding] = useState(true);

  // Identity Hook
  const { user, isAuthenticated, loading: sessionLoading, login: handleLogin, logout: handleLogout, updateUser, refresh: recoverSession } = useUser();

  // Handle session recovery on mount
  useEffect(() => {
    recoverSession();
  }, []);

  // Sync profile when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && !user.createdAt) {
      refreshFullProfile();
    }
  }, [isAuthenticated, user?.id]);

  const refreshFullProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        updateUser(data);
      }
    } catch (err) {
      console.warn('Profile sync failed:', err);
    }
  };

  const handleLoginSuccess = (userData) => {
    handleLogin(userData);
  };

  const handleSignOut = (goToLanding = false) => {
    handleLogout();
    setActiveView('planner');
    setResults(null);
    if (goToLanding) setShowLanding(true);
  };

  const generateTrip = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/plan-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate trip');
      setResults(data);
      setActiveView('planner');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white' }}>
        <div className="animate-pulse" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="animate-pulse">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="url(#goldGradientLoader)" />
              <path d="M12 5.5L13.5 10.5L18.5 12L13.5 13.5L12 18.5L10.5 13.5L5.5 12L10.5 10.5L12 5.5Z" fill="#050505" />
              <defs><linearGradient id="goldGradientLoader" x1="2" y1="2" x2="22" y2="22"><stop stopColor="#f1cf5b" /><stop offset="0.5" stopColor="#d4af37" /><stop offset="1" stopColor="#b08d28" /></linearGradient></defs>
            </svg>
          </div>
          <h2 style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem', opacity: 0.8 }}>Scanning Travel Vaults...</h2>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/profile/:userId" element={<PublicProfile />} />
      <Route 
        path="/" 
        element={
          !isAuthenticated ? (
            showLanding
              ? <LandingPage onGetStarted={() => setShowLanding(false)} />
              : <AuthPage onLoginSuccess={handleLoginSuccess} onBack={() => setShowLanding(true)} />
          ) : (
            <div className="app-layout" style={{ minHeight: '100vh', background: '#050505', position: 'relative' }}>
              {/* Modern Nav Rail / Header */}
              <header style={{ 
                position: 'sticky', top: 0, zIndex: 100, 
                background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(212, 175, 55, 0.15)', padding: '15px 40px' 
              }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('planner')}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="url(#goldGradientApp)" />
                        <path d="M12 5.5L13.5 10.5L18.5 12L13.5 13.5L12 18.5L10.5 13.5L5.5 12L10.5 10.5L12 5.5Z" fill="#050505" />
                        <defs><linearGradient id="goldGradientApp" x1="2" y1="2" x2="22" y2="22"><stop stopColor="#f1cf5b" /><stop offset="0.5" stopColor="#d4af37" /><stop offset="1" stopColor="#b08d28" /></linearGradient></defs>
                      </svg>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        <span className="text-gradient">Luxe</span>Voyage
                      </span>
                    </div>

                    <nav style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setActiveView('planner')}
                        style={{ 
                          background: activeView === 'planner' ? 'rgba(212, 175, 55, 0.1)' : 'none',
                          color: activeView === 'planner' ? 'var(--primary)' : 'var(--text-muted)',
                          border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
                          fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        <Map size={18} /> Planner
                      </button>
                      <button 
                        onClick={() => setActiveView('profile')}
                        style={{ 
                          background: activeView === 'profile' ? 'rgba(212, 175, 55, 0.1)' : 'none',
                          color: activeView === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
                          border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
                          fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        <User size={18} /> Profile
                      </button>
                    </nav>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    
                    <div 
                      onClick={() => setActiveView('profile')}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #b08d28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050505', fontWeight: 'bold' }}>
                        {user?.profilePhoto ? <img src={user.profilePhoto} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user?.name?.[0] || 'U'}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>{user?.name || 'Explorer'}</span>
                    </div>
                    <button 
                      onClick={handleSignOut} 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </header>

              {activeView === 'planner' ? (
                <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '15px', color: 'white' }}>
                      <Compass className="animate-pulse" size={20} /> Where to next, {user?.name?.split(' ')[0] || 'Traveler'}?
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                      Our AI architect is ready to craft your next extraordinary journey.
                    </p>
                  </div>

                  <div className="layout-grid">
                    <div style={{ position: 'sticky', top: '120px' }}>
                      <TripForm onSubmit={generateTrip} isLoading={loading} />
                    </div>
                    
                    <div className="results-column">
                      {loading && (
                        <div className="animate-fade-in" style={{ 
                          textAlign: 'center', padding: '100px 40px', 
                          background: 'rgba(255,255,255,0.01)', 
                          borderRadius: '40px', border: '1px solid rgba(212, 175, 55, 0.1)',
                          minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                           <Loader />
                        </div>
                      )}

                      {results && results.itinerary ? (
                        <TripResults 
                          results={results} 
                          user={user} 
                          onUpdate={(updated) => setResults(updated)} 
                        />
                      ) : !loading && (
                        <div className="glass animate-fade-in" style={{ 
                          minHeight: '600px', display: 'flex', flexDirection: 'column', 
                          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                          padding: '60px', opacity: 0.8
                        }}>
                           <div style={{ 
                             width: '120px', height: '120px', borderRadius: '50%', 
                             background: 'rgba(212, 175, 55, 0.05)', display: 'flex', 
                             alignItems: 'center', justifyContent: 'center', marginBottom: '30px',
                             border: '1px solid rgba(212, 175, 55, 0.1)'
                           }}>
                             <Compass size={60} color="var(--primary)" style={{ opacity: 0.3 }} />
                           </div>
                           <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '15px', letterSpacing: '-1px' }}>
                             Your Vision Awaits
                           </h2>
                           <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.6' }}>
                             Define your destination and travel style to the left, and our AI architect will craft a bespoke itinerary right here.
                           </p>
                           
                           {/* Subtle decorative line */}
                           <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', marginTop: '40px', opacity: 0.3 }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <ProfileSection 
                  user={user} 
                  onUpdateUser={updateUser}
                  onLogout={handleSignOut}
                  onViewTrip={(trip) => {
                    setResults(trip);
                    setActiveView('planner');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }} 
                />
              )}
            </div>
          )
        } 
      />
      <Route path="/trip/:id" element={<SharedTrip />} />
    </Routes>
  );
}

export default App;
