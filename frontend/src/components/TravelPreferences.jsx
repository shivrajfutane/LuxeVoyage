import React, { useState, useEffect } from 'react';
import { Heart, Compass, Wallet, User as UserIcon, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import anime from 'animejs';
import { API_BASE_URL } from '../config';

const INTERESTS = [
  'Nature & Parks', 'Culinary & Dining', 'Nightlife', 
  'Culture & Arts', 'Extreme Adventure', 'Wellness & Spa', 
  'Photography', 'Luxury Shopping', 'History & Musems'
];

const STYLES = ['Slow Traveler', 'Fast-Paced Explorer', 'Luxury Enthusiast', 'Balanced Nomad'];
const BUDGETS = ['Value / Economy', 'Premium Comfort', 'Ultra-Luxury'];

export default function TravelPreferences({ user, onUpdateUser }) {
  const [prefs, setPrefs] = useState({
    interests: user?.preferences?.interests || [],
    travelStyle: user?.preferences?.travelStyle || 'Balanced Nomad',
    budgetTier: user?.preferences?.budgetTier || 'Premium Comfort',
    bio: user?.preferences?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const toggleInterest = (interest) => {
    setPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id || user._id}/preferences`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });

      if (res.ok) {
        const updatedPrefs = await res.json();
        if (onUpdateUser) {
          onUpdateUser({ preferences: updatedPrefs });
        }
        setSavedStatus(true);
        setTimeout(() => setSavedStatus(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="layout-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px', marginTop: '20px' }}>
        
        {/* Left Side: Interests & Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass" style={{ padding: '30px' }}>
             <h3 style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '15px', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Heart size={20} color="var(--primary)" /> Passion & Interests
             </h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {INTERESTS.map(interest => {
                  const isActive = prefs.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '100px',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="glass" style={{ padding: '30px' }}>
             <h3 style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '15px', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserIcon size={20} color="var(--primary)" /> Travel Bio
             </h3>
             <textarea 
                value={prefs.bio}
                onChange={(e) => setPrefs(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Briefly describe your wanderlust goals..."
                style={{
                  width: '100%', minHeight: '120px', padding: '15px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', color: 'white', fontFamily: 'inherit', resize: 'none',
                  outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
             />
          </div>
        </div>

        {/* Right Side: Travel Style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <div className="glass" style={{ padding: '30px' }}>
              <h3 style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '15px', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={20} color="var(--primary)" /> Transit Style
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {STYLES.map(style => {
                    const isSelected = prefs.travelStyle === style;
                    return (
                      <div 
                        key={style}
                        onClick={() => setPrefs(prev => ({ ...prev, travelStyle: style }))}
                        className="glass"
                        style={{
                          padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                          background: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                          color: isSelected ? 'white' : 'var(--text-muted)',
                          fontSize: '0.9rem', transition: 'all 0.3s'
                        }}
                      >
                         {style}
                      </div>
                    );
                 })}
              </div>
           </div>

           <div className="glass" style={{ padding: '30px' }}>
              <h3 style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '15px', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wallet size={20} color="var(--primary)" /> Budget Priority
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {BUDGETS.map(budget => {
                    const isSelected = prefs.budgetTier === budget;
                    return (
                      <div 
                        key={budget}
                        onClick={() => setPrefs(prev => ({ ...prev, budgetTier: budget }))}
                        className="glass"
                        style={{
                          padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                          background: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                          color: isSelected ? 'white' : 'var(--text-muted)',
                          fontSize: '0.9rem', transition: 'all 0.3s'
                        }}
                      >
                         {budget}
                      </div>
                    );
                 })}
              </div>
           </div>

           <button 
              onClick={handleSave}
              disabled={saving}
              className="btn"
              style={{
                background: savedStatus ? '#10b981' : 'var(--primary)',
                color: savedStatus ? 'white' : '#0f172a',
                padding: '20px', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
           >
              {saving ? (
                <Sparkles className="animate-spin" size={20} />
              ) : savedStatus ? (
                <CheckCircle2 size={20} />
              ) : (
                <Save size={20} />
              )}
              {saving ? 'Saving Persona...' : savedStatus ? 'Persona Saved!' : 'Update Travel Persona'}
           </button>
        </div>
      </div>
    </div>
  );
}
