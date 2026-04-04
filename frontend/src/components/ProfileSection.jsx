import React, { useState, useEffect, useRef } from 'react';
import { History, Shield, User, Clock, Star, Camera, Loader2, Award, MapPin, Globe, Trash2, AlertTriangle, Sparkles, Share2 } from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';
import TripHistory from './TripHistory';
import TravelPreferences from './TravelPreferences';
import ProfileShareModal from './ProfileShareModal';
import { API_BASE_URL } from '../config';

export default function ProfileSection({ user, onViewTrip, onUpdateUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('history');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState('confirm'); // 'confirm' or 'otp'
  const [isSuccessfullyDeleted, setIsSuccessfullyDeleted] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const profileCardRef = useRef(null);

  useEffect(() => {
    if (profileCardRef.current) {
      anime({
        targets: profileCardRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutCubic'
      });
    }
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo must be under 2MB for elite verification.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/${user.id}/profile`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePhoto: reader.result })
        });
        if (res.ok) {
          const data = await res.json();
          onUpdateUser(data.user);
        }
      } catch (err) {
        console.error('Photo upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    };
  };

  const requestDeleteOTP = async () => {
    if (!user?.id) {
      alert('Security Error: Your traveler ID is missing. Please refresh and try again.');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id}/delete-request`, { method: 'POST' });
      if (res.ok) {
        setDeleteStep('otp');
      } else {
        const data = await res.json();
        const errorMsg = data.path ? `Security Route Not Found: ${data.path}` : (data.error || 'The security server is currently synchronized. Please wait a moment.');
        alert(errorMsg);
      }
    } catch (err) {
      console.error('OTP request failed:', err);
      alert('Network error: Unable to reach the LuxeVoyage security vault.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!otpValue || otpValue.length < 6) {
      alert("Please enter the 6-digit security code sent to your email.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpValue })
      });
      if (res.ok) {
        setIsSuccessfullyDeleted(true);
        // Aesthetics: Let the user see the success message for 3 seconds before logout
        setTimeout(() => {
          onLogout(true);
        }, 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Verification failed. Please check your code.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Purge failed. The security vault is locked.');
    } finally {
      setIsDeleting(false);
    }
  };

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2026';
  const stats = user.stats || { journeys: 0, miles: '0k', continents: 0 };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px', maxWidth: '1200px' }}>
      <div ref={profileCardRef} className="glass" style={{ padding: '60px', borderRadius: '40px', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>

        {/* Profile Card Background Glow */}
        <div style={{ position: 'absolute', top: '-10% ', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>

          {/* Avatar Section */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '200px', height: '200px', borderRadius: '50%',
              border: '4px solid rgba(212, 175, 55, 0.3)', padding: '8px',
              boxShadow: '0 0 50px rgba(212, 175, 55, 0.15)'
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={80} color="var(--primary)" style={{ opacity: 0.5 }} />
                )}
              </div>
            </div>

            <label style={{
              position: 'absolute', bottom: '10px', right: '10px',
              background: 'var(--primary)', color: '#050505',
              width: '44px', height: '44px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '3px solid #050505', transition: 'all 0.3s'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
              <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
            </label>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.1)', padding: '6px 18px', borderRadius: '100px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#d4af37" />
                </svg>
                <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px' }}>VERIFIED NOMAD</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> Member since {joinDate}</span>
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '950', letterSpacing: '-3px', color: 'white', lineHeight: '1', margin: '0 0 10px 0' }}>{user.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.email} • {user.preferences?.travelStyle || 'Elite Voyager'}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn"
                style={{ width: 'auto', padding: '14px 28px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <Share2 size={18} /> Share Profile
              </button>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="btn"
                style={{
                  width: 'auto', padding: '14px 28px',
                  background: isDeleting ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f87171'
                }}
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white' }}>{stats.journeys}</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 'bold' }}>JOURNEYS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--primary)' }}>{stats.miles}</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 'bold' }}>MILES</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white' }}>{stats.continents}</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 'bold' }}>CONTINENTS</div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="animate-slide-up" style={{ marginTop: '40px', padding: '30px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AlertTriangle color="#f87171" size={32} />
              <div>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>
                  {isSuccessfullyDeleted ? 'Nomad Identity Decommissioned' : deleteStep === 'confirm' ? 'Confirm Permanent Account Deletion' : 'Security Verification'}
                </h4>
                <p style={{ color: 'rgba(248, 113, 113, 0.8)', fontSize: '0.9rem', margin: 0 }}>
                  {isSuccessfullyDeleted 
                    ? 'Your records have been wiped from the vault. Fair winds, traveler.' 
                    : deleteStep === 'confirm'
                    ? 'This will erase all your travel vaults and itineraries forever.'
                    : 'Enter the 6-digit code sent to your registered email to authorize this purge.'}
                </p>
              </div>
            </div>

            {isSuccessfullyDeleted ? (
               <div style={{ color: 'white', fontWeight: '800', background: 'rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '100px', fontSize: '0.8rem' }}>
                 REDIRECTION IN 3s...
               </div>
            ) : deleteStep === 'confirm' ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} className="social-btn" style={{ fontSize: '0.9rem', padding: '10px 24px' }}>Cancel</button>
                <button
                  onClick={requestDeleteOTP}
                  className="btn"
                  disabled={isDeleting}
                  style={{ background: '#ef4444', color: 'white', border: 'none', width: 'auto', padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  {isDeleting ? "Synchronizing..." : "Yes, Purge My Identity"}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000 000"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    width: '120px',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    letterSpacing: '2px',
                    fontWeight: 'bold'
                  }}
                />
                <button
                  onClick={handleDeleteAccount}
                  className="btn"
                  disabled={isDeleting || otpValue.length < 6}
                  style={{ background: '#ef4444', color: 'white', border: 'none', width: 'auto', padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  {isDeleting ? "Obliterating..." : "Confirm Final Deletion"}
                </button>
                {!isSuccessfullyDeleted && <button onClick={() => setDeleteStep('confirm')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Back</button>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            background: activeTab === 'history' ? 'rgba(212, 175, 55, 0.1)' : 'none',
            color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)',
            border: 'none', padding: '12px 30px', borderRadius: '100px', cursor: 'pointer',
            fontWeight: '700', fontSize: '1rem', transition: 'all 0.3s'
          }}
        >
          Trip History
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          style={{
            background: activeTab === 'preferences' ? 'rgba(212, 175, 55, 0.1)' : 'none',
            color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--text-muted)',
            border: 'none', padding: '12px 30px', borderRadius: '100px', cursor: 'pointer',
            fontWeight: '700', fontSize: '1rem', transition: 'all 0.3s'
          }}
        >
          Travel Persona
        </button>
      </div>

      <div className="glass" style={{ padding: '40px', borderRadius: '32px' }}>
        {activeTab === 'history' ? (
          <TripHistory userId={user.id} onViewTrip={onViewTrip} />
        ) : (
          <TravelPreferences user={user} onUpdate={onUpdateUser} />
        )}
      </div>

      {showShareModal && (
        <ProfileShareModal user={user} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
