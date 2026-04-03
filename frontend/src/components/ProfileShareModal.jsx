import React, { useRef, useState } from 'react';
import { X, Copy, Download, Share2, CheckCircle, Sparkles, Award, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ProfileShareModal({ user, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/profile/${user.id || user._id}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#050505',
        borderRadius: 24
      });
      const link = document.createElement('a');
      link.download = `nomad-passport-${user.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate card:', err);
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} 
      />
      
      <div className="glass animate-slide-up" style={{ 
        position: 'relative', width: '100%', maxWidth: '600px', 
        background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '32px', padding: '40px', overflow: 'hidden'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ color: 'white', marginBottom: '10px', fontSize: '1.8rem', fontWeight: '800' }}>Share Your Nomad Identity</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Generate your official LuxeVoyage passport card and share your journey with the world.</p>

        {/* The Card Preview (This is what we'll export) */}
        <div style={{ marginBottom: '30px', perspective: '1000px' }}>
          <div 
            ref={cardRef}
            style={{ 
              background: 'linear-gradient(135deg, #0f172a 0%, #050505 100%)',
              padding: '30px', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.3)',
              position: 'relative', overflow: 'hidden', width: '100%', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', gap: '20px'
            }}
          >
             {/* Decorative Background */}
             <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '50%', filter: 'blur(50px)' }} />

             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--primary)', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                   {user.profilePhoto ? <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Award size={40} color="var(--primary)" />}
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px' }}>PASSPORT ISSUED</div>
                   <div style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800' }}>{user.name}</div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Gold Tier Global Nomad</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '2rem', fontWeight: '900' }}>LV</div>
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px' }}>NOMAD INTERESTS</div>
                   <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: '600' }}>{user.preferences?.interests?.[0] || 'Global Exploration'} & More</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TRAVEL STYLE</div>
                   <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: '600' }}>{user.preferences?.travelStyle || 'Balanced Nomad'}</div>
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                   <div>
                      <div style={{ fontSize: '1.2rem', color: 'white', fontWeight: '800' }}>{user.stats?.journeys || '0'}</div>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>JOURNEYS</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '1.2rem', color: 'white', fontWeight: '800' }}>{user.stats?.miles || '0k'}</div>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>MILES</div>
                   </div>
                </div>
                <div style={{ opacity: 0.5 }}>
                   <div style={{ fontSize: '0.6rem', color: 'white', fontWeight: 'bold' }}>LUXEVOYAGE.TRAVEL</div>
                </div>
             </div>
          </div>
        </div>

        {/* Sharing Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', 
            background: 'rgba(255,255,255,0.03)', padding: '5px 5px 5px 20px', 
            borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'
          }}>
             <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{shareUrl}</span>
             <button 
                onClick={copyToClipboard}
                style={{ 
                  background: copied ? '#10b981' : 'var(--primary)', color: copied ? 'white' : '#0f172a',
                  border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s'
                }}
             >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
             </button>
          </div>

          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="btn"
            style={{ 
              width: '100%', padding: '18px', background: 'rgba(255,255,255,0.05)', 
              color: 'white', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}
          >
            {downloading ? <Sparkles className="animate-spin" size={20} /> : <Download size={20} />}
            {downloading ? 'Generating Passport Card...' : 'Download Nomad Passport Card'}
          </button>
        </div>
      </div>
    </div>
  );
}
