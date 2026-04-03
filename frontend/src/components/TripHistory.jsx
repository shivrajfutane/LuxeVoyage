import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trash2, Clock, Loader2, Sparkles, FolderOpen, TrendingUp } from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';
import { API_BASE_URL } from '../config';

export default function TripHistory({ userId, onViewTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId]);

  useEffect(() => {
    if (!loading && trips.length > 0) {
      anime({
        targets: '.trip-card',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        duration: 1000
      });
    }
  }, [loading, trips]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/trips/user/${userId}`);
      if (!response.ok) throw new Error('Could not synchronize your travel legacy.');
      const data = await response.json();
      setTrips(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '20px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Scanning Travel Vaults...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#f87171' }}>
        <TrendingUp size={40} style={{ marginBottom: '20px', opacity: 0.5 }} />
        <h3>Security Sync Error</h3>
        <p>{error}</p>
        <button className="btn" style={{ width: 'auto', marginTop: '20px' }} onClick={fetchHistory}>Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="history-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)' }}>
            <FolderOpen color="var(--primary)" size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>My Journeys</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>A chronicle of your adventures ({trips.length})</p>
          </div>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="glass" style={{ padding: '80px', textAlign: 'center', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.01)' }}>
          <Sparkles size={50} color="var(--text-muted)" style={{ marginBottom: '24px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '12px' }}>A Blank Page</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
            Your travel legacy starts with your first journey. Let's craft an itinerary that defines you.
          </p>
          <button className="btn" style={{ width: 'auto', padding: '12px 30px' }} onClick={() => window.location.reload()}>
            Start Planning
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {trips.map((trip, idx) => (
            <div 
              key={trip._id} 
              className="glass trip-card" 
              style={{ 
                padding: '0', 
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => onViewTrip(trip)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ height: '8px', background: 'linear-gradient(90deg, var(--primary), transparent)', opacity: 0.8 }} />
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
                      <MapPin size={20} color="var(--primary)" />
                    </div>
                    <h4 style={{ fontSize: '1.4rem', color: 'white', margin: 0, fontWeight: '700' }}>{trip.destination}</h4>
                  </div>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>{trip.travelStyle || 'Standard'}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Calendar size={16} /> <span style={{ color: 'white' }}>{trip.days} Days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <TrendingUp size={16} /> <span style={{ color: 'white' }}>{trip.budget}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Clock size={14} /> Created {new Date(trip.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Review <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
