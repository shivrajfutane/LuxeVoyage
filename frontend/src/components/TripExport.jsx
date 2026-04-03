import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, MapPin, Calendar, Wallet, Sparkles, Clock, Loader2, Compass, Star, Plane } from 'lucide-react';

export default function TripExport({ results, onClose }) {
  const cardRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const totalActivities = results.itinerary?.reduce((sum, day) => sum + (day.activities?.length || 0), 0) || 0;
  const days = results.itinerary?.length || 0;

  // Pick top highlights (first activity of each day)
  const highlights = results.itinerary?.slice(0, 4).map(day => ({
    day: day.day,
    theme: day.theme,
    topActivity: day.activities?.[0]?.place || day.activities?.[0]?.description || 'Explore'
  })) || [];

  // Collect unique places for the "places strip"
  const allPlaces = results.itinerary?.flatMap(day => 
    day.activities?.map(a => a.place).filter(Boolean)
  ).slice(0, 6) || [];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      const link = document.createElement('a');
      link.download = `LuxeVoyage-${results.destination?.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      canvas.toBlob(async (blob) => {
        if (navigator.share && blob) {
          const file = new File([blob], `LuxeVoyage-${results.destination}.png`, { type: 'image/png' });
          await navigator.share({ title: `My trip to ${results.destination}`, files: [file] });
        } else {
          const link = document.createElement('a');
          link.download = `LuxeVoyage-${results.destination?.replace(/\s+/g, '-')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        setExporting(false);
      });
    } catch (err) {
      console.error('Share error:', err);
      setExporting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start', padding: '80px 20px', overflow: 'auto'
    }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleDownload} disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 32px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #d4af37, #f1cf5b)',
            color: '#0f172a', border: 'none', fontWeight: '700',
            fontSize: '1rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            transition: 'transform 0.2s', opacity: exporting ? 0.6 : 1,
            boxShadow: '0 4px 24px rgba(212,175,55,0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {exporting ? <Loader2 size={18} className="spin" /> : <Download size={18} />}
          {exporting ? 'Rendering HD...' : 'Download PNG'}
        </button>
        <button onClick={handleShare} disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.08)', color: 'white',
            border: '1px solid rgba(255,255,255,0.15)', fontWeight: '600',
            fontSize: '1rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.2s'
          }}
        >
          <Share2 size={18} /> Share
        </button>
        <button onClick={onClose}
          style={{
            padding: '14px 28px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.08)', fontWeight: '500',
            fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}
        >
          Close
        </button>
      </div>

      {/* ====== THE EXPORTABLE CARD ====== */}
      <div ref={cardRef} style={{
        width: '500px', maxWidth: '100%',
        background: '#0a0a14',
        borderRadius: '28px', overflow: 'hidden',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        position: 'relative'
      }}>

        {/* === HERO SECTION === */}
        <div style={{
          position: 'relative', padding: '40px 32px 32px',
          background: 'linear-gradient(160deg, #131328 0%, #0d1b2a 50%, #1b2838 100%)',
          overflow: 'hidden'
        }}>
          {/* Ambient glow circles */}
          <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          {/* Grid pattern overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

          {/* Top bar: Logo + Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#d4af37" />
                <path d="M12 5.5L13.5 10.5L18.5 12L13.5 13.5L12 18.5L10.5 13.5L5.5 12L10.5 10.5L12 5.5Z" fill="#0a0a14" />
              </svg>
              <span style={{ color: 'rgba(212,175,55,0.8)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>LuxeVoyage</span>
            </div>
            {results.travelStyle && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '100px', padding: '5px 14px',
                color: '#d4af37', fontSize: '0.7rem', fontWeight: '600',
                letterSpacing: '1px', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Compass size={10} /> {results.travelStyle}
              </div>
            )}
          </div>

          {/* Destination */}
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Plane size={13} color="#d4af37" style={{ transform: 'rotate(-45deg)' }} />
              <span style={{ color: 'rgba(212,175,55,0.6)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '3px' }}>Destination</span>
            </div>
            <h2 style={{
              color: 'white', fontSize: '2.6rem', fontWeight: '800',
              margin: 0, lineHeight: 1.05, letterSpacing: '-0.5px'
            }}>
              {results.destination}
            </h2>
          </div>

          {/* Thin gold separator */}
          <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg, #d4af37, rgba(212,175,55,0.2))', borderRadius: '100px', marginTop: '20px' }} />
        </div>

        {/* === STATS ROW === */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(212,175,55,0.04)' }}>
          {[
            { icon: <Calendar size={18} color="#d4af37" />, value: `${days}`, label: 'Days' },
            { icon: <Star size={18} color="#d4af37" />, value: `${totalActivities}`, label: 'Activities' },
            { icon: <Wallet size={18} color="#d4af37" />, value: results.estimatedTotalCost || results.budget || '—', label: 'Budget' }
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '20px 12px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '2px' }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* === DAY HIGHLIGHTS === */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'
          }}>
            <Sparkles size={14} color="#d4af37" />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Journey Highlights</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {highlights.map((h, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.2s'
              }}>
                {/* Day number pill */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: `linear-gradient(135deg, rgba(212,175,55,${0.15 - i * 0.02}), rgba(212,175,55,${0.05}))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#d4af37', fontSize: '0.75rem', fontWeight: '800',
                  border: '1px solid rgba(212,175,55,0.15)', flexShrink: 0,
                  letterSpacing: '-0.5px'
                }}>
                  D{h.day}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem', fontWeight: '600',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: '2px'
                  }}>
                    {h.theme}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <MapPin size={9} />
                    {h.topActivity}
                  </div>
                </div>
                {/* Subtle arrow */}
                <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>›</div>
              </div>
            ))}
          </div>

          {days > 4 && (
            <div style={{ textAlign: 'center', marginTop: '12px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontStyle: 'italic' }}>
              + {days - 4} more day{days - 4 > 1 ? 's' : ''} of adventure
            </div>
          )}
        </div>

        {/* === PLACES STRIP === */}
        {allPlaces.length > 0 && (
          <div style={{ padding: '0 32px 24px' }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px'
            }}>
              {allPlaces.map((place, i) => (
                <span key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '100px', padding: '5px 12px',
                  color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem',
                  fontWeight: '500', whiteSpace: 'nowrap',
                  maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {place}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* === FOOTER === */}
        <div style={{
          padding: '18px 32px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)'
            }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: '500' }}>AI-Planned</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem', letterSpacing: '1px' }}>
            luxevoyage.app
          </span>
        </div>
      </div>
    </div>
  );
}
