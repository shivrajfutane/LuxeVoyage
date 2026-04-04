import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Clock, MapPin, Wallet, Calendar, Navigation, Image as ImageIcon, 
  Share2, CheckCircle, ListTodo, Route, DollarSign, Heart, 
  UserPlus, Users, Sparkles, Banknote, Download, Shield, 
  AlertCircle, Hotel, CloudRain, Sun, Cloud, Thermometer, Zap, Lock 
} from 'lucide-react';
import ExpenseTracker from './ExpenseTracker';
import PackingList from './PackingList';
import RouteMap from './RouteMap';
import CurrencyConverter from './CurrencyConverter';
import TripExport from './TripExport';
import TravelIntel from './TravelIntel';
import Seasonality from './Seasonality';
import BookingHub from './BookingHub';
import TravelVault from './TravelVault';
import ShowcaseMode from './ShowcaseMode';
import anime from 'animejs/lib/anime.es.js';
import { useAnimeReveal } from '../hooks/useAnime';
import { API_BASE_URL } from '../config';

const RealImage = ({ keyword, destination, width, height, isBanner, dayNumber, tripId, imageQuery }) => {
  const sanitizedDest = (destination || "").replace(/[\s\W]+/g, ' ');
  const sanitizedKey = (keyword || "").replace(/[\s\W]+/g, ' ');
  const sanitizedQuery = (imageQuery || "").replace(/[\s\W]+/g, ' ');
  
  // Strategy: "Visual Reality" - Use Pollinations AI for 100% unique, stunning scenery
  // This avoids the 'same pic' fallback issued by stock photo services
  const focus = sanitizedQuery || `${sanitizedKey} in ${sanitizedDest}`;
  const prompt = isBanner 
    ? `Professional travel photography of ${focus}, cinematic lighting, wide angle, 4k` 
    : `Scenery of ${focus}, travel vlog style, detailed, vibrant`;

  // Seed ensures same activity = same image, but different activities = different images
  const tripSalt = (tripId || destination || "voyage").length;
  const seed = (dayNumber * 773) + tripSalt + (keyword?.length || 0) + (isBanner ? 1000 : 0);
  
  const src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

  return (
    <div className="image-container shimmer" style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#0f172a" }}>
      <img 
        src={src} 
        alt={keyword} 
        className="real-travel-image"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: 'transform 0.6s ease, opacity 0.5s ease' }}
        loading="lazy"
        onLoad={(e) => e.target.parentElement.classList.remove('shimmer')}
        onError={(e) => {
          e.target.parentElement.classList.remove('shimmer');
          e.target.src = `https://loremflickr.com/${width}/${height}/travel,view?random=${Math.random()}`;
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      />
      <div className="image-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', pointerEvents: 'none' }} />
    </div>
  );
};

export default function TripResults({ results, user, onUpdate, isSharedView, onAuthRequired }) {
  // CRITICAL: Prevent early processing crashes (Blank Page fix)
  if (!results || !results.itinerary || !Array.isArray(results.itinerary)) {
    return (
      <div className="glass" style={{ padding: '80px', textAlign: 'center', margin: '40px auto', maxWidth: '800px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Exploring Destinations...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Our AI is finalizing your luxury routes. Please wait a moment.</p>
        <button onClick={() => window.location.reload()} className="btn" style={{ width: 'auto', marginTop: '24px' }}>Retry Connection</button>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [focusedActivityKey, setFocusedActivityKey] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const tabContentRef = useRef(null);
  const dayCardsRef = useAnimeReveal('.day-card');

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, scrollLeft: 0, hasMoved: false });
  const prevTripId = useRef(null);

  // Weather simulation for the itinerary
  const weatherData = useMemo(() => {
    const destLower = (results?.destination || "").toLowerCase();
    const isRainyCity = ['london', 'seattle', 'amsterdam', 'paris'].some(c => destLower.includes(c));
    const isHotCity = ['dubai', 'miami', 'goa', 'cancun'].some(c => destLower.includes(c));
    
    return results.itinerary.map((day, i) => {
      let condition = 'Sunny';
      let temp = isHotCity ? 30 + (i % 3) : isRainyCity ? 12 + (i % 4) : 20 + (i % 5);
      
      if (isRainyCity && (i === 1 || i === 3)) condition = 'Rainy';
      else if (i % 2 === 0) condition = 'Cloudy';
      
      return { day: day?.day || i+1, condition, temp };
    });
  }, [results?.itinerary, results?.destination]);

  const showWeatherAlert = useMemo(() => {
    return weatherData.some(d => d.condition === 'Rainy');
  }, [weatherData]);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragInfo.current = {
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
      hasMoved: false
    };
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragInfo.current.startX) * 2;
    if (Math.abs(x - dragInfo.current.startX) > 5) {
      dragInfo.current.hasMoved = true;
    }
    scrollRef.current.scrollLeft = dragInfo.current.scrollLeft - walk;
  };

  const switchTab = (tab) => {
    if (dragInfo.current.hasMoved) {
      dragInfo.current.hasMoved = false;
      return;
    }
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTimeout(() => {
      if (tabContentRef.current) {
        anime({
          targets: tabContentRef.current,
          opacity: [0, 1],
          translateY: [16, 0],
          translateX: [10, 0],
          duration: 400,
          easing: 'easeOutCubic',
        });
      }
    }, 10);
  };

  // Smart Sync Engine: Automatic Real-Time Updates
  useEffect(() => {
    const tripId = results?._id || results?.tripId;
    if (!tripId) return;

    const syncInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`);
        if (!response.ok) return;
        const updatedData = await response.json();
        // Only update parent if data has actually changed to prevent render loops
        if (JSON.stringify(updatedData.packingList) !== JSON.stringify(results.packingList) || 
            JSON.stringify(updatedData.expenses) !== JSON.stringify(results.expenses) ||
            JSON.stringify(updatedData.vault) !== JSON.stringify(results.vault) ||
            JSON.stringify(updatedData.collaborators) !== JSON.stringify(results.collaborators)) {
          if (onUpdate) onUpdate(updatedData);
        }
      } catch (err) {
        console.warn('Sync heartbeat failed:', err);
      }
    }, 4000); // 4-second heartbeat for balance between speed and performance

    return () => clearInterval(syncInterval);
  }, [results?._id, results?.tripId, onUpdate]);

  // Sync-Safe Entrance Reveal (Once per trip load)
  useEffect(() => {
    const currentId = results?._id || results?.tripId;
    if (results?.itinerary?.length && dayCardsRef.current && prevTripId.current !== currentId) {
      anime({
        targets: dayCardsRef.current.querySelectorAll('.day-card'),
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 600,
        easing: 'easeOutCubic',
        delay: anime.stagger(120),
      });
      prevTripId.current = currentId;
    }
  }, [results?._id, results?.tripId, dayCardsRef]);

  const isOwner = user && user.id === results.userId?.toString();
  const isCollaborator = user && results.collaborators?.some(c => c.userId?.toString() === user.id);
  const canInteract = isOwner || isCollaborator;

  const handleJoin = async () => {
    if (!user) {
      if (onAuthRequired) return onAuthRequired();
      return alert("Please log in to join this journey!");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${results._id || results.tripId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: user.name })
      });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error("Join Error:", err);
    }
  };

  const handleVote = async (dayIdx, actIdx) => {
    if (!canInteract) {
      if (onAuthRequired) return onAuthRequired();
      return alert("You must join the journey to vote!");
    }
    const activityId = `${dayIdx}-${actIdx}`;
    setVotingId(activityId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${results._id || results.tripId}/activities/${dayIdx}/${actIdx}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error("Vote Error:", err);
    } finally {
      setTimeout(() => setVotingId(null), 600);
    }
  };

  const handleCopyLink = () => {
    const tripId = results.tripId || results._id;
    if (!tripId) {
      alert("Error: To share trips, MongoDB must be connected.");
      return;
    }
    const publicUrl = `${window.location.origin}/trip/${tripId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };


  return (
    <div style={{ opacity: 1 }}>
      {showShowcase && <ShowcaseMode results={results} onClose={() => setShowShowcase(false)} />}
      
      <div className="glass" style={{ padding: "30px", marginBottom: "30px", overflow: 'hidden' }}>
        <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "8px", display: "flex", flexWrap: 'wrap', alignItems: "center", gap: "12px" }}>
          <MapPin color="var(--primary)" size={32} />
          {results.destination}
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
            {!isOwner && !isCollaborator && (
              <button 
                onClick={handleJoin}
                style={{ 
                  background: 'var(--primary)', color: 'black', border: 'none', 
                  padding: '10px 20px', borderRadius: '100px', fontSize: '0.9rem', 
                  fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                  cursor: 'pointer', transition: 'all 0.3s'
                }}
              >
                <UserPlus size={16} /> Join Journey
              </button>
            )}
            <button 
              onClick={() => setShowShowcase(true)}
              style={{ 
                background: 'rgba(212,175,55,0.1)', 
                border: '1px solid rgba(212,175,55,0.3)', color: 'var(--primary)', 
                padding: '10px 20px', borderRadius: '100px', fontSize: '0.9rem', 
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <Sparkles size={16} /> Showcase
            </button>
          </div>
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
           <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                 width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', 
                 marginRight: '10px', boxShadow: '0 0 10px #10b981', 
                 animation: 'pulse 2s infinite' 
              }} />
              <Users size={14} color="var(--primary)" style={{ marginRight: '8px' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>TRAVELLERS:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {results.collaborators && results.collaborators.map((c, i) => (
                  <div key={i} title={c.name} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {(c.name || "U").charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
           </div>
           <button onClick={handleCopyLink} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>+ INVITE FRIENDS</button>
        </div>
        
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "20px" }}>
           <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "150px" }}>
              <Wallet size={20} color="#a5b4fc" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Est. Cost</span>
                <span style={{ fontWeight: "600" }}>{results.estimatedTotalCost}</span>
              </div>
           </div>
           <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "150px" }}>
              <Calendar size={20} color="#fbcfe8" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Duration</span>
                <span style={{ fontWeight: "600" }}>{results.itinerary.length} Days</span>
              </div>
           </div>
        </div>
      </div>

      <div style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'var(--surface)',
        backdropFilter: 'blur(40px)', padding: '15px 24px', borderBottom: '1px solid var(--surface-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div 
          ref={scrollRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
          className="hide-scrollbar" 
          style={{ 
            display: 'flex', gap: '12px', overflowX: 'auto', flex: 1, cursor: isDragging ? 'grabbing' : 'grab',
            WebkitOverflowScrolling: 'touch',
            maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)'
          }}
        >
          {[ 
            { id: 'itinerary', label: 'Itinerary', icon: <Route size={16} /> },
            { id: 'expenses', label: 'Expenses', icon: <DollarSign size={16} /> },
            { id: 'packing', label: 'Packing List', icon: <ListTodo size={16} /> },

            { id: 'currency', label: 'Currency', icon: <Banknote size={16} /> },
            { id: 'booking', label: 'Booking Hub', icon: <Hotel size={16} /> },
            { id: 'intel', label: 'Travel Intel', icon: <Shield size={16} /> },
            { id: 'seasonality', label: 'Seasonality', icon: <Calendar size={16} /> }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => switchTab(tab.id)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
                background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
                color: activeTab === tab.id ? 'black' : 'white', 
                borderRadius: '100px', padding: '10px 20px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <button className="btn" onClick={() => setShowExport(true)} style={{ width: 'auto', fontSize: '0.85rem' }}>Export</button>
      </div>

      <div ref={tabContentRef}>
        {activeTab === 'expenses' && <ExpenseTracker trip={results} isSharedView={isSharedView} />}
        {activeTab === 'packing' && <PackingList trip={results} user={user} isSharedView={isSharedView} onUpdate={onUpdate} />}

        {activeTab === 'currency' && <CurrencyConverter destination={results.destination} budget={results.budget} />}
        {activeTab === 'booking' && <BookingHub destination={results.destination} budget={results.budget} duration={results.itinerary?.length} />}
        {activeTab === 'intel' && <TravelIntel destination={results.destination} />}
        {activeTab === 'seasonality' && <Seasonality destination={results.destination} />}
        
        {activeTab === 'itinerary' && (
          <React.Fragment>
            <RouteMap results={results} activeDayIndex={activeDayIndex} focusedActivityIndex={focusedActivityKey?.startsWith(`${activeDayIndex}-`) ? parseInt(focusedActivityKey.split('-')[1]) : null} />
            
            <div className="itinerary-timeline">
              {showWeatherAlert && (
                <div style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', padding: '16px', borderRadius: '16px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <CloudRain color="#60a5fa" />
                  <div>
                      <h4 style={{ margin: 0, color: 'white' }}>AI Weather Guard</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Recommended: Bring an umbrella for Day 2!</p>
                  </div>
                </div>
              )}

              {results.itinerary.map((day, idx) => {
                const dayWeather = weatherData[idx];
                return (
                  <div key={idx} className="day-card glass" style={{ marginBottom: idx === results.itinerary.length -1 ? 0 : '40px', padding: 0, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', padding: '5px 12px', borderRadius: '20px', display: 'flex', gap: '8px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
                      {dayWeather.condition === 'Sunny' ? <Sun size={14} color="#fbbf24" /> : dayWeather.condition === 'Rainy' ? <CloudRain size={14} color="#60a5fa" /> : <Cloud size={14} color="#94a3b8" />}
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{dayWeather.temp}°C</span>
                    </div>
                    
                    <div style={{ height: '180px', position: 'relative' }}>
                      <RealImage 
                        keyword={day.theme} 
                        destination={results.destination} 
                        width={800} height={200} 
                        isBanner={true} 
                        dayNumber={idx + 1} 
                        tripId={results._id || results.tripId}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a, transparent)' }} />
                      <h3 style={{ position: 'absolute', bottom: '15px', left: '20px', margin: 0, color: 'white' }}>Day {day.day}: {day.theme}</h3>
                    </div>

                    <div style={{ padding: '20px' }}>
                      {day.activities.map((act, i) => (
                        <div 
                          key={i} 
                          className="activity-item"
                          style={{ 
                            display: 'flex', gap: '20px', marginBottom: '20px', 
                            background: 'rgba(255,255,255,0.015)', padding: '15px', 
                            borderRadius: 'var(--radius-md)', border: '1px solid rgba(212,175,55,0.03)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.03)';
                          }}
                        >
                          <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                            <RealImage 
                              keyword={act.place} 
                              destination={results.destination} 
                              width={150} height={150} 
                              isBanner={false} 
                              dayNumber={(idx + 1) * 10 + (i + 1)} 
                              tripId={results._id || results.tripId}
                              imageQuery={act.imageQuery}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{act.place}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{act.description}</p>
                            <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{act.time}</span>
                              <span style={{ fontSize: '0.75rem', color: '#fbcfe8' }}>{act.cost}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        {showExport && <TripExport results={results} onClose={() => setShowExport(false)} />}
        <button className="btn" onClick={handleCopyLink} style={{ width: 'auto' }}>
           {copied ? 'Link Copied!' : 'Share Trip'}
        </button>
      </div>
    </div>
  );
}
