import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles, Clock, Compass } from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';

export default function ShowcaseMode({ results, onClose }) {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const currentDay = results.itinerary[currentDayIdx];
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  // Animation for switching days
  useEffect(() => {
    if (!contentRef.current || !imageRef.current) return;
    
    // Reset positions for entry animation
    anime({
      targets: imageRef.current,
      scale: [1.1, 1],
      opacity: [0.6, 1],
      duration: 1200,
      easing: 'easeOutQuart'
    });

    anime({
      targets: contentRef.current.children,
      translateX: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 200 }),
      easing: 'easeOutCubic'
    });
  }, [currentDayIdx]);

  const handleNext = () => {
    setCurrentDayIdx((prev) => (prev + 1) % results.itinerary.length);
  };

  const handlePrev = () => {
    setCurrentDayIdx((prev) => (prev - 1 + results.itinerary.length) % results.itinerary.length);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Photo URL builder (matching TripResults logic for consistency)
  const getPhotoUrl = (keyword) => {
    // Replace spaces and special characters with commas for better tag matching in loremflickr
    const sanitizedDest = (results.destination || "").replace(/[\s\W]+/g, ',');
    const sanitizedKey = (keyword || "").replace(/[\s\W]+/g, ',');
    
    // We want the showcase image to be high quality (landscape)
    const query = `${sanitizedDest},${sanitizedKey},travel,landscape`;
    
    // High-entropy lock unique to this specific day and trip
    const tripSalt = (results._id || results.tripId || results.destination || "").length;
    const lockVal = ((currentDayIdx + 1) * 73) + tripSalt; 
    
    return `https://loremflickr.com/1920/1080/${query}/all?lock=${lockVal}`;
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: '#050505', color: 'white',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Background Cinematic Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img 
          ref={imageRef}
          src={getPhotoUrl(currentDay.theme)} 
          alt={currentDay.theme}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'blur(4px) brightness(0.6)' }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://loremflickr.com/1920/1080/travel,scenic/all?random=${currentDayIdx}`;
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.8) 50%, #050505 100%)' }} />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--primary)', color: 'black', padding: '6px 16px', borderRadius: '100px', fontWeight: 'bold' }}>
            Day {currentDay.day}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 'bold' }}>SHOWCASE MODE</span>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 5, flex: 1, display: 'flex', alignItems: 'center', padding: '0 80px' }}>
        
        {/* Left Side: Large Visual & Navigation */}
        <div style={{ flex: 1.2, position: 'relative', height: '48vh', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img 
            key={currentDayIdx} 
            src={getPhotoUrl(currentDay.theme)} 
            alt={currentDay.theme}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://loremflickr.com/1920/1080/view,panorama/all?random=${currentDayIdx}`;
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
          <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}>
             <h2 style={{ fontSize: '3.5rem', fontWeight: '800', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{currentDay.theme}</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', color: 'var(--primary)' }}>
                <MapPin size={20} />
                <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{results.destination}</span>
             </div>
          </div>
        </div>

        {/* Right Side: Details & Activities */}
        <div ref={contentRef} style={{ flex: 1, paddingLeft: '80px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 'bold', fontSize: '0.85rem' }}>Daily Overview</span>
            {currentDay.buddyTip && (
              <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', fontStyle: 'italic', maxWidth: '500px' }}>
                "{currentDay.buddyTip}"
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.8rem' }}>Major Activities</span>
            {currentDay.activities.slice(0, 3).map((act, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {idx === 0 ? <Clock size={20} color="var(--primary)" /> : 
                   idx === 1 ? <Compass size={20} color="var(--primary)" /> : <Sparkles size={20} color="var(--primary)" />}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '4px' }}>{act.place}</h4>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: '1.4' }}>{act.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ position: 'relative', zIndex: 10, padding: '40px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
           {results.itinerary.map((_, i) => (
             <div 
               key={i} 
               style={{ 
                 width: currentDayIdx === i ? '40px' : '10px', 
                 height: '10px', 
                 background: currentDayIdx === i ? 'var(--primary)' : 'rgba(255,255,255,0.2)', 
                 borderRadius: '100px',
                 transition: 'all 0.4s ease'
               }} 
             />
           ))}
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={handlePrev}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px 30px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button 
            onClick={handleNext}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--primary)', color: 'black', padding: '15px 40px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold', border: 'none' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Next Day <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
