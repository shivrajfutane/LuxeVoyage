import React, { useState } from 'react';
import { Plane, Wallet, CalendarDays, Heart, Sparkles, Navigation, User, Users, Baby, Crown, Backpack } from 'lucide-react';

const TRAVEL_STYLES = [
  { id: 'Solo', name: 'Solo Traveler', icon: <User size={20} />, color: '#60a5fa', desc: 'Focus on social spots & safety' },
  { id: 'Couple', name: 'Romantic Couple', icon: <Users size={20} />, color: '#f472b6', desc: 'Sunsets, dining & privacy' },
  { id: 'Family', name: 'Family Fun', icon: <Baby size={20} />, color: '#4ade80', desc: 'Kid-friendly & convenient' },
  { id: 'Luxury', name: 'Luxury & Comfort', icon: <Crown size={20} />, color: '#fbbf24', desc: '5-star spots & relaxation' },
  { id: 'Backpacker', name: 'Backpacker', icon: <Backpack size={20} />, color: '#94a3b8', desc: 'Budget eats & hostels' }
];

export default function TripForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    days: 3,
    interests: '',
    travelStyle: 'Solo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleSelect = (id) => {
    setFormData(prev => ({ ...prev, travelStyle: id }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="animate-fade-in stagger-2" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          <Plane className="icon" size={18} /> Destination
        </label>
        <input 
          type="text" 
          name="destination"
          className="input" 
          placeholder="e.g., Goa, India"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>

      <div className="responsive-grid">
        <div className="form-group">
          <label className="form-label">
            <Wallet className="icon" size={18} /> Budget
          </label>
          <input 
            type="text" 
            name="budget"
            className="input" 
            placeholder="e.g., ₹25000"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <CalendarDays className="icon" size={18} /> Duration (Days)
          </label>
          <input 
            type="number" 
            name="days"
            className="input" 
            placeholder="5"
            min="1" max="30"
            value={formData.days}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* NEW: Iconic Travel Style Selector */}
      <div className="form-group">
        <label className="form-label">
          <Navigation className="icon" size={18} /> Trip Mode
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '12px',
          marginTop: '8px'
        }}>
          {TRAVEL_STYLES.map((style) => (
            <div 
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              style={{
                background: formData.travelStyle === style.id ? `rgba(${formData.travelStyle === 'Solo' ? '96,165,250' : formData.travelStyle === 'Couple' ? '244,114,182' : formData.travelStyle === 'Family' ? '74,222,128' : formData.travelStyle === 'Luxury' ? '251,191,36' : '148,163,184'}, 0.1)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${formData.travelStyle === style.id ? style.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ color: style.color }}>{style.icon}</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>{style.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{style.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: "32px" }}>
        <label className="form-label">
          <Heart className="icon" size={18} /> Interests & Vibe
        </label>
        <textarea 
          name="interests"
          className="input" 
          rows="2"
          placeholder="e.g., Adventure, Sunset, Beach"
          value={formData.interests}
          onChange={handleChange}
          style={{ resize: "vertical" }}
        />
      </div>

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? (
          "Planning your dream journey..."
        ) : (
          <>
            <Sparkles size={20} /> Plan My Journey
          </>
        )}
      </button>
    </form>
  );
}
