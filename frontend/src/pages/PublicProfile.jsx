import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Globe, Clock, Compass, Wallet, Heart, MapPin, Map as MapIcon, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PublicProfile() {
  const { userId } = useParams();
  const [nomad, setNomad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user/${userId}/public`)
      .then(res => {
        if (!res.ok) throw new Error('Nomad not found');
        return res.json();
      })
      .then(data => {
        setNomad(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white' }}>
      <div className="animate-pulse" style={{ textAlign: 'center' }}>
        <h2 style={{ letterSpacing: '4px', textTransform: 'uppercase' }}>Scanning Travel Vaults...</h2>
      </div>
    </div>
  );

  if (error || !nomad) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white', padding: '20px' }}>
      <Award size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
      <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Identity Not Found</h2>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '400px' }}>This nomad's passport might be private or doesn't exist.</p>
      <Link to="/" className="btn" style={{ marginTop: '30px', width: 'auto', padding: '12px 30px' }}>Back to LuxeVoyage</Link>
    </div>
  );

  const joinYear = nomad.createdAt ? new Date(nomad.createdAt).getFullYear() : '2026';
  const interests = nomad.preferences?.interests || [];

  return (
    <div style={{ minHeight: '100vh', background: '#050505', padding: '60px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Public Nomad ID Card */}
        <div className="glass" style={{ padding: '60px', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Subtle Background Accent */}
          <div style={{ 
            position: 'absolute', top: '-100px', right: '-100px', 
            width: '400px', height: '400px', 
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: '50px', alignItems: 'center', flexWrap: 'wrap' }}>
              
              {/* Profile Photo */}
              <div style={{ 
                width: '180px', height: '180px', borderRadius: '50%', 
                border: '4px solid rgba(212, 175, 55, 0.3)', padding: '6px',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.1)'
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                  {nomad.profilePhoto ? (
                    <img src={nomad.profilePhoto} alt={nomad.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={80} color="var(--primary)" />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                   <div style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', padding: '5px 15px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1.5px' }}>VERIFIED NOMAD</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Clock size={16} /> Joined {joinYear}
                   </div>
                </div>
                <h1 style={{ fontSize: '4rem', color: 'white', margin: 0, fontWeight: '900', lineHeight: '1' }}>{nomad.name}</h1>
                <p style={{ color: 'var(--primary)', margin: '15px 0 0', fontSize: '1.2rem', fontWeight: '500', opacity: 0.9 }}>
                  {nomad.preferences?.travelStyle || 'Global Voyager'} • {nomad.preferences?.budgetTier || 'Premium Nomad'}
                </p>
              </div>
            </div>

            {/* Public Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '60px' }}>
               <div className="glass" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white' }}>{nomad.stats.journeys}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: 'bold', marginTop: '5px' }}>JOURNEYS</div>
               </div>
               <div className="glass" style={{ padding: '30px', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--primary)' }}>{nomad.stats.miles}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: 'bold', marginTop: '5px' }}>TRAVEL MILES</div>
               </div>
               <div className="glass" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white' }}>{nomad.stats.continents}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: 'bold', marginTop: '5px' }}>CONTINENTS</div>
               </div>
            </div>

            {/* Persona Section */}
            <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '40px' }}>
               <div>
                  <h3 style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapIcon size={20} color="var(--primary)" /> Travel Mission
                  </h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                    {nomad.preferences?.bio || "This nomad hasn't crafted their travel mission yet, but is actively exploring the world's most luxurious destinations."}
                  </p>
               </div>
               <div>
                  <h3 style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Heart size={20} color="var(--primary)" /> Interest Core
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                     {interests.length > 0 ? interests.map(i => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem' }}>{i}</span>
                     )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Exploring all passions...</span>}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
           <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Inspired by this nomad's journey?</p>
           <Link to="/" className="btn" style={{ background: 'var(--primary)', color: '#0f172a', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 40px', fontSize: '1.1rem', width: 'auto' }}>
             <Sparkles size={20} /> Create Your Own Travel Identity
           </Link>
        </div>
      </div>
    </div>
  );
}
