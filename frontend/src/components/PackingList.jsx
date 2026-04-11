import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, Square, Package, ListTodo, 
  UserPlus, UserMinus, Trash2, Zap, User 
} from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';
import { API_BASE_URL } from '../config';

export default function PackingList({ trip, user, isSharedView, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const packingData = trip.packingList || [];

  useEffect(() => {
    if (packingData.length > 0 && listRef.current) {
      anime({
        targets: listRef.current.querySelectorAll('.packing-item'),
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.98, 1],
        delay: anime.stagger(60),
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
      });
    }
  }, [packingData.length]);

  const handleGenerate = async () => {
    if (isSharedView) return;
    setLoading(true);
    try {
      const tripId = trip._id || trip.tripId;
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/packing/generate`, { method: 'POST' });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error('Generation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (itemId) => {
    if (isSharedView) return;
    try {
      const tripId = trip._id || trip.tripId;
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/packing/${itemId}/toggle`, { method: 'PATCH' });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) { console.error('Toggle Error:', err); }
  };

  const handleClaim = async (itemId) => {
    if (!user) return alert("Please log in to claim items!");
    try {
      const tripId = trip._id || trip.tripId;
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/packing/${itemId}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id || user._id, userName: user.name })
      });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) { console.error("Claim Error:", err); }
  };

  const handleUnclaim = async (itemId) => {
    try {
      const tripId = trip._id || trip.tripId;
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/packing/${itemId}/unclaim`, { method: 'PATCH' });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) { console.error("Unclaim Error:", err); }
  };

  return (
    <div style={{ opacity: 1 }}>
      <div className="glass" style={{ padding: 'clamp(20px, 5vw, 30px)', marginBottom: '30px', borderTop: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
            <div style={{ padding: '10px', background: 'rgba(241, 207, 91, 0.1)', borderRadius: '12px', flexShrink: 0 }}>
              <Package color="var(--primary)" size={24} />
            </div>
            <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: 'white', margin: 0 }}>Packing Checklist</h3>
          </div>
          <button 
            onClick={handleGenerate} 
            disabled={loading || packingData.length > 0} 
            className="btn" 
            style={{ width: 'auto', background: 'var(--primary)', color: 'black', padding: '10px 20px', fontWeight: 'bold', fontSize: '0.9rem' }}
          >
            {loading ? <Zap className="animate-pulse" size={18} /> : packingData.length > 0 ? 'List Ready ✅' : 'Generate List'}
          </button>
        </div>
      </div>

      {packingData.length > 0 ? (
        <div className="glass" style={{ padding: '30px' }}>
          <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {packingData.map(item => {
              const isClaimedByMe = item.assignedTo?.toString() === (user?.id?.toString() || user?._id?.toString());
              
              return (
                <div 
                  key={item._id} 
                  className="packing-item"
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                    background: item.isPacked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
                    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                    opacity: 0,
                    transition: 'background 0.3s, border 0.3s, opacity 0.4s',
                    filter: item.isPacked ? 'grayscale(0.5)' : 'none'
                  }}
                >
                  <div onClick={() => handleToggle(item._id)} style={{ cursor: 'pointer', flexShrink: 0, padding: '4px' }}>
                    {item.isPacked ? <CheckSquare color="var(--primary)" size={20} /> : <Square color="rgba(255,255,255,0.2)" size={20} />}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      color: item.isPacked ? 'var(--text-muted)' : 'white', 
                      textDecoration: item.isPacked ? 'line-through' : 'none', 
                      fontWeight: '500', fontSize: '0.95rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {item.item}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.category} 
                      {item.assigneeName && (
                        <span style={{ marginLeft: '8px', color: isClaimedByMe ? 'var(--primary)' : '#818cf8', fontWeight: 'bold' }}>
                          • {isClaimedByMe ? 'You' : item.assigneeName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {!item.assignedTo ? (
                      <button 
                        onClick={() => handleClaim(item._id)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <UserPlus size={12} /> Claim
                      </button>
                    ) : isClaimedByMe ? (
                      <button 
                        onClick={() => handleUnclaim(item._id)}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <UserMinus size={12} /> Drop
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>The AI is ready to draft your personalized packing strategy.</p>
        </div>
      )}
    </div>
  );
}
