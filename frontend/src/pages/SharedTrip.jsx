import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TripResults from '../components/TripResults';
import AuthPage from '../components/AuthPage';
import { ArrowLeft, Loader, Globe, User } from 'lucide-react';
import useUser from '../hooks/useUser';
import { API_BASE_URL } from '../config';

export default function SharedTrip() {
  const { id } = useParams();
  const { user, login: handleLogin, isAuthenticated } = useUser();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${id}`);
        if (!response.ok) {
          throw new Error('Trip not found or server is offline.');
        }
        const data = await response.json();
        setTripData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Loader className="spin icon" size={48} color="var(--primary)" />
        <h2 className="text-gradient" style={{ marginTop: '20px' }}>Loading Itinerary...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)', color: 'white' }}>
        <Globe size={64} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
        <h2>{error}</h2>
        <Link to="/" className="btn" style={{ marginTop: '30px', display: 'inline-flex' }}>
          <ArrowLeft size={20} /> Build your own trip
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '20px', color: 'white' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header className="glass animate-fade-in stagger-1" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 className="app-title" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="url(#goldGradientAppShared)" />
              <path d="M12 5.5L13.5 10.5L18.5 12L13.5 13.5L12 18.5L10.5 13.5L5.5 12L10.5 10.5L12 5.5Z" fill="#050505" />
              <defs>
                <linearGradient id="goldGradientAppShared" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f1cf5b" />
                  <stop offset="0.5" stopColor="#d4af37" />
                  <stop offset="1" stopColor="#b08d28" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-gradient">Luxe</span>Voyage
          </h1>
          
          <Link to="/" className="btn" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.9rem' }}>
            Build your own trip
          </Link>
        </header>

        {!isAuthenticated && showAuth ? (
          <div className="animate-fade-in">
            <button 
              onClick={() => setShowAuth(false)}
              className="link-btn"
              style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} /> Back to Itinerary
            </button>
            <AuthPage onLoginSuccess={(userData) => {
              handleLogin(userData);
              setShowAuth(false);
            }} />
          </div>
        ) : (
          <TripResults 
            results={tripData} 
            isSharedView={true} 
            user={user}
            onUpdate={(updated) => setTripData(updated)}
            onAuthRequired={() => setShowAuth(true)}
          />
        )}
      </div>
    </div>
  );
}
