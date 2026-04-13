import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Globe, Shield, Users, ArrowRight, Star, Zap, Map, Clock, DollarSign, Cloud, Compass, ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';
import { useAnimeReveal, useCountUp } from '../hooks/useAnime';

const FEATURES = [
  { icon: <Zap size={28} color="#f1cf5b" />, title: 'AI-Crafted Itineraries', desc: 'Groq Llama 3.3 builds day-by-day plans with local context, crowd predictions, and weather-smart routing.' },
  { icon: <Users size={28} color="#a5b4fc" />, title: 'Group Collaboration', desc: 'Vote on activities, split expenses, share packing lists — travel planning as a team sport.' },
  { icon: <Globe size={28} color="#34d399" />, title: '20+ Seasonality Hubs', desc: 'Know the best month to visit any destination — climate, price, and crowd trends at a glance.' },
  { icon: <Shield size={28} color="#fb923c" />, title: 'Travel Intel', desc: 'Emergency numbers, safety scores, phrasebooks, scam alerts, and local etiquette for every country.' },
  { icon: <DollarSign size={28} color="#f472b6" />, title: 'Expense & Currency', desc: 'Real-time currency conversion plus collaborative expense splitting for groups.' },
  { icon: <Map size={28} color="#60a5fa" />, title: 'Booking Hub', desc: 'One-click redirects to hotels, restaurants, and flights — pre-filled with your destination.' },
];


const STEPS = [
  { num: '01', title: 'Describe Your Journey', desc: 'Enter destination, budget, travel style, and dates. The more detail the better.' },
  { num: '02', title: 'AI Builds Your Plan', desc: 'Our AI crafts a weather-smart, crowd-aware itinerary in seconds with real tips.' },
  { num: '03', title: 'Explore & Book', desc: 'Browse your day-by-day plan, invite friends, track expenses, and book with one click.' },
];

export default function LandingPage({ onGetStarted }) {
  const heroRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const featuresRef = useAnimeReveal('.feature-card');
  const stepsRef = useAnimeReveal('.step-card', { delay: anime.stagger(150) });

  // Mouse parallax on orbs
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Hero entrance timeline
  useEffect(() => {
    const tl = anime.timeline({ easing: 'easeOutCubic' });
    tl.add({ targets: '.hero-badge', opacity: [0, 1], translateY: [-20, 0], duration: 600 })
      .add({ targets: '.hero-headline', opacity: [0, 1], translateY: [50, 0], duration: 800 }, '-=200')
      .add({ targets: '.hero-sub', opacity: [0, 1], translateY: [30, 0], duration: 700 }, '-=400')
      .add({ targets: '.hero-ctas', opacity: [0, 1], translateY: [20, 0], duration: 600 }, '-=300');
  }, []);



  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px clamp(24px, 5vw, 48px)',
        background: 'rgba(5,5,5,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="url(#lg1)" />
            <path d="M12 5.5L13.5 10.5L18.5 12L13.5 13.5L12 18.5L10.5 13.5L5.5 12L10.5 10.5L12 5.5Z" fill="#050505" />
            <defs>
              <linearGradient id="lg1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f1cf5b" /><stop offset="0.5" stopColor="#d4af37" /><stop offset="1" stopColor="#b08d28" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
            <span className="text-gradient">Luxe</span><span style={{ color: 'white' }}>Voyage</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div style={{ display: 'none', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Features</a>
          <a href="#how" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>How It Works</a>
          <button onClick={onGetStarted} className="btn" style={{ width: 'auto', padding: '8px 20px', fontSize: '0.9rem' }}>
            Sign In <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0,
            background: 'var(--bg-color)', zIndex: 99, padding: '40px 24px',
            display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: '600' }}>Features</a>
            <a href="#how" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: '600' }}>How It Works</a>
            <button onClick={() => { onGetStarted(); setMobileMenuOpen(false); }} className="btn" style={{ fontSize: '1.2rem' }}>
              Sign In <ArrowRight size={20} />
            </button>
          </div>
        )}

        <style>{`
          @media (min-width: 768px) {
            .desktop-nav { display: flex !important; }
            .mobile-toggle { display: none !important; }
          }
        `}</style>
      </nav>

      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: 'clamp(100px, 15vh, 120px) 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { w: 600, h: 600, top: '-200px', left: '-150px', c1: 'rgba(212,175,55,0.12)', c2: 'transparent', dur: '18s' },
            { w: 500, h: 500, top: '20%', right: '-100px', c1: 'rgba(99,102,241,0.1)', c2: 'transparent', dur: '24s' },
            { w: 400, h: 400, bottom: '-100px', left: '30%', c1: 'rgba(212,175,55,0.08)', c2: 'transparent', dur: '20s' },
          ].map((o, i) => (
            <div key={i} style={{
              position: 'absolute', width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom,
              borderRadius: '50%', background: `radial-gradient(circle, ${o.c1}, ${o.c2})`,
              animation: `floatOrb ${o.dur} ease-in-out infinite alternate`,
              animationDelay: `${i * 3}s`,
            }} />
          ))}
        </div>

        <style>{`
          @keyframes floatOrb { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(calc(var(--mx,0px)*0.4), calc(var(--my,0px)*0.4)) scale(1.05); } }
          @keyframes heroEntrance { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes badgePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); } 50% { box-shadow: 0 0 0 8px rgba(212,175,55,0); } }
        `}</style>

        {/* Badge */}
        <div className="hero-badge" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)',
          padding: '8px 20px', borderRadius: '100px', marginBottom: '32px',
          opacity: 0,
          animation: 'badgePulse 3s ease infinite 0.6s',
          color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600',
        }}>
          <Sparkles size={14} /> Powered by Groq Llama 3.3 — The World's Fastest AI
        </div>

        {/* Headline */}
        <h1 className="hero-headline" style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '800', lineHeight: '1.05',
          letterSpacing: '-2px', marginBottom: '28px', maxWidth: '900px',
          opacity: 0,
        }}>
          <span className="text-gradient" style={{
            background: 'linear-gradient(135deg, #f1cf5b 0%, #d4af37 40%, #f1cf5b 70%, #b08d28 100%)',
            backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', animation: 'shimmer 4s ease infinite',
          }}>AI-Crafted Travel</span>
          <br />
          <span style={{ color: 'white' }}>Perfectly Yours.</span>
        </h1>

        <p className="hero-sub" style={{
          fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: 'var(--text-muted)', maxWidth: '620px',
          lineHeight: '1.7', marginBottom: '40px', opacity: 0,
        }}>
          Tell us where you want to go. Our AI architect builds a weather-smart, crowd-aware,
          day-by-day luxury itinerary — in seconds.
        </p>

        {/* CTAs */}
        <div className="hero-ctas" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
          <button onClick={onGetStarted} className="btn" style={{
            width: 'auto', padding: '18px 40px', fontSize: '1.1rem', borderRadius: '100px',
            boxShadow: '0 0 40px rgba(212,175,55,0.3)',
          }}>
            Start Planning Free <ArrowRight size={20} />
          </button>
          <a href="#features" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '18px 32px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)',
            color: 'white', textDecoration: 'none', fontSize: '1rem', background: 'rgba(255,255,255,0.04)',
            transition: 'all 0.3s',
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
            Explore Features <ChevronDown size={18} />
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', animation: 'floatOrb 2s ease-in-out infinite alternate', opacity: 0.4 }}>
          <ChevronDown size={24} color="var(--primary)" />
        </div>
      </section>


      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>What You Get</div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'white', fontWeight: '700', letterSpacing: '-1px' }}>
              Everything a <span className="text-gradient">luxury traveler</span> needs
            </h2>
          </div>
          <div ref={featuresRef} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
            gap: '24px' 
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card glass" style={{
                padding: '32px', borderRadius: '24px', opacity: 0,
                transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s',
                cursor: 'default',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {f.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: '1.15rem', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={{ padding: '80px 24px', background: 'rgba(212,175,55,0.02)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>The Process</div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', fontWeight: '700', letterSpacing: '-1px' }}>
              From idea to <span className="text-gradient">itinerary</span> in 30 seconds
            </h2>
          </div>
          <div ref={stepsRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="step-card glass" style={{ 
                padding: 'clamp(20px, 4vw, 32px)', borderRadius: '20px', 
                display: 'flex', gap: 'clamp(16px, 4vw, 28px)', alignItems: 'flex-start', opacity: 0,
                flexDirection: 'row'
              }}>
                <div style={{
                  fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', opacity: 0.3,
                  lineHeight: 1, flexShrink: 0, fontVariantNumeric: 'tabular-nums',
                }}>{s.num}</div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.65', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))',
          border: '1px solid rgba(212,175,55,0.25)', borderRadius: 'clamp(20px, 4vw, 32px)', padding: 'clamp(32px, 6vw, 64px) clamp(20px, 5vw, 48px)',
          boxShadow: '0 0 80px rgba(212,175,55,0.08)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✈️</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', color: 'white', letterSpacing: '-1px', marginBottom: '16px' }}>
            Your next adventure<br /><span className="text-gradient">starts here</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '36px', lineHeight: '1.7' }}>
            Join thousands of travelers who plan smarter, travel better, and spend less time worrying.
          </p>
          <button onClick={onGetStarted} className="btn" style={{ width: 'auto', padding: '18px 48px', fontSize: '1.1rem', borderRadius: '100px', boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
            Get Started — It's Free <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ 
        borderTop: '1px solid rgba(255,255,255,0.06)', 
        padding: '40px clamp(24px, 5vw, 48px)', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        flexWrap: 'wrap', gap: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={18} color="var(--primary)" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 LuxeVoyage. All rights reserved.</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Built with ❤️ &amp; Groq AI
        </div>
      </footer>
    </div>
  );
}
