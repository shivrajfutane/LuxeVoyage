import React, { useState } from 'react';
import { Hotel, Utensils, Plane, ExternalLink, Star, Search, MapPin, Coffee, Wifi, Car, Dumbbell } from 'lucide-react';

const HOTEL_TIERS = [
  {
    tier: 'Budget',
    priceRange: '$20 – $60 / night',
    stars: 2,
    desc: 'Clean, well-located stays ideal for backpackers and budget travelers.',
    color: '#34d399',
    platforms: [
      { name: 'Booking.com', urlFn: d => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(d)}&nflt=price%3D0-60`, badge: 'Free cancellation' },
      { name: 'Hostelworld', urlFn: d => `https://www.hostelworld.com/search?search_keywords=${encodeURIComponent(d)}`, badge: 'Best for hostels' },
      { name: 'Agoda', urlFn: d => `https://www.agoda.com/en-in/search?city=${encodeURIComponent(d)}`, badge: 'Asia deals' },
    ],
    amenities: ['Free WiFi', 'Breakfast option', 'Prime location'],
    icon: <MapPin size={20} color="#34d399" />,
  },
  {
    tier: 'Mid-Range',
    priceRange: '$60 – $150 / night',
    stars: 3,
    desc: 'Comfortable hotels with great amenities, perfect for most travelers.',
    color: '#f1cf5b',
    platforms: [
      { name: 'Booking.com', urlFn: d => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(d)}&nflt=price%3D60-150`, badge: 'Most popular' },
      { name: 'Expedia', urlFn: d => `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(d)}`, badge: 'Bundle discounts' },
      { name: 'Hotels.com', urlFn: d => `https://www.hotels.com/search?destination=${encodeURIComponent(d)}`, badge: 'Earn free nights' },
    ],
    amenities: ['Pool', 'Restaurant', 'Room service', 'Gym'],
    icon: <Wifi size={20} color="#f1cf5b" />,
  },
  {
    tier: 'Luxury',
    priceRange: '$150+ / night',
    stars: 5,
    desc: 'World-class properties with 5-star service, spas, and premium experiences.',
    color: '#c084fc',
    platforms: [
      { name: 'Booking.com', urlFn: d => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(d)}&nflt=class%3D5`, badge: '5-star selection' },
      { name: 'Airbnb Luxe', urlFn: d => `https://www.airbnb.com/s/${encodeURIComponent(d)}/homes?room_type=Entire+home%2Fapt`, badge: 'Unique villas' },
      { name: 'Mr & Mrs Smith', urlFn: () => `https://www.mrandmrssmith.com/`, badge: 'Boutique luxury' },
    ],
    amenities: ['Spa', 'Fine dining', 'Concierge', 'Pool & gym'],
    icon: <Star size={20} color="#c084fc" />,
  },
];

const RESTAURANT_PLATFORMS = [
  { name: 'TripAdvisor', icon: '🌟', desc: 'Top-rated local restaurants with verified traveler reviews.', color: '#00AA6C', urlFn: d => `https://www.tripadvisor.com/Search?q=restaurants+in+${encodeURIComponent(d)}` },
  { name: 'Google Maps', icon: '📍', desc: 'Explore nearby restaurants, read reviews, and get directions.', color: '#4285F4', urlFn: d => `https://www.google.com/maps/search/restaurants+in+${encodeURIComponent(d)}` },
  { name: 'Yelp', icon: '⭐', desc: 'Find hidden gems with honest community recommendations.', color: '#D32323', urlFn: d => `https://www.yelp.com/search?find_desc=restaurants&find_loc=${encodeURIComponent(d)}` },
  { name: 'Zomato', icon: '🍽️', desc: 'Food discovery, delivery and dine-in experiences.', color: '#E23744', urlFn: d => `https://www.zomato.com/search?q=${encodeURIComponent(d)}` },
];

const FLIGHT_PLATFORMS = [
  { name: 'Google Flights', icon: '✈️', desc: 'Best-in-class flight comparison with price calendars and fare alerts.', color: '#4285F4', badge: 'Best overall', urlFn: d => `https://www.google.com/flights?q=flights+to+${encodeURIComponent(d)}` },
  { name: 'Skyscanner', icon: '🔵', desc: 'Compare millions of routes. Flexible date search included.', color: '#0770E3', badge: 'Price predictor', urlFn: d => `https://www.skyscanner.net/flights-to/${encodeURIComponent(d).toLowerCase()}/` },
  { name: 'Kayak', icon: '🛶', desc: 'Comprehensive deals on flights, hotels, and car rentals.', color: '#FF690F', badge: 'Bundle deals', urlFn: () => `https://www.kayak.com/flights` },
  { name: 'MakeMyTrip', icon: '🇮🇳', desc: 'Best deals for Indian travelers — domestic and international.', color: '#E8192C', badge: 'India favorite', urlFn: () => `https://www.makemytrip.com/flights/` },
  { name: 'EaseMyTrip', icon: '✅', desc: 'Zero booking fee flights. Great cashback offers.', color: '#3399FF', badge: 'Zero fees', urlFn: () => `https://www.easemytrip.com/` },
  { name: 'Cleartrip', icon: '🌐', desc: 'Fast booking experience with competitive fares.', color: '#FF5900', badge: 'Fast checkout', urlFn: () => `https://www.cleartrip.com/` },
];

const TABS = [
  { id: 'hotels', label: 'Hotels', icon: <Hotel size={16} /> },
  { id: 'restaurants', label: 'Restaurants', icon: <Utensils size={16} /> },
  { id: 'flights', label: 'Flights', icon: <Plane size={16} /> },
];

function StarRow({ count, color }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} fill={i < count ? color : 'transparent'} color={i < count ? color : 'rgba(255,255,255,0.2)'} />
      ))}
    </div>
  );
}

export default function BookingHub({ destination, budget, duration }) {
  const [activeTab, setActiveTab] = useState('hotels');
  const dest = destination || 'your destination';

  return (
    <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
      {/* Header */}
      <div className="glass" style={{ padding: '28px 32px', marginBottom: '28px', borderLeft: '6px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
          <div style={{ background: 'rgba(212,175,55,0.12)', padding: '10px', borderRadius: '12px' }}>
            <Search size={22} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Booking Hub</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', marginTop: '2px' }}>
              Hotels, restaurants &amp; flights for <strong style={{ color: 'var(--primary)' }}>{dest}</strong> — curated by tier, one click to book.
            </p>
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 22px', borderRadius: '100px',
            background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === tab.id ? '#0f172a' : 'var(--text-main)',
            border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
            fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            fontSize: '0.9rem', transition: 'all 0.25s ease',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ========= HOTELS ========= */}
      {activeTab === 'hotels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {HOTEL_TIERS.map((tier, i) => (
            <div key={i} className="glass" style={{ padding: '28px', borderRadius: '20px', borderLeft: `4px solid ${tier.color}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: `rgba(255,255,255,0.05)`, padding: '10px', borderRadius: '12px' }}>{tier.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ color: 'white', margin: 0, fontSize: '1.15rem' }}>{tier.tier}</h3>
                      <StarRow count={tier.stars} color={tier.color} />
                    </div>
                    <div style={{ color: tier.color, fontWeight: '700', fontSize: '1rem' }}>{tier.priceRange}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {tier.amenities.map((a, j) => (
                    <span key={j} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem' }}>{a}</span>
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>{tier.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {tier.platforms.map((p, j) => (
                  <a key={j} href={p.urlFn(dest)} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', borderRadius: '14px',
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
                    textDecoration: 'none', color: 'white', transition: 'all 0.25s ease',
                    cursor: 'pointer',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = tier.color; e.currentTarget.style.background = `rgba(255,255,255,0.06)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{p.name}</div>
                      <div style={{ color: tier.color, fontSize: '0.75rem', marginTop: '2px' }}>{p.badge}</div>
                    </div>
                    <ExternalLink size={16} color="var(--text-muted)" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========= RESTAURANTS ========= */}
      {activeTab === 'restaurants' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {RESTAURANT_PLATFORMS.map((p, i) => (
            <a key={i} href={p.urlFn(dest)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="glass" style={{
                padding: '28px', borderRadius: '20px', height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
                borderTop: `3px solid ${p.color}`,
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${p.color}40`; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{p.icon}</div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>{p.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '20px' }}>{p.desc}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  color: p.color, fontWeight: '600', fontSize: '0.85rem',
                }}>
                  Find in {dest} <ExternalLink size={14} />
                </div>
              </div>
            </a>
          ))}
          {/* Pro tip card */}
          <div className="glass" style={{ padding: '28px', borderRadius: '20px', background: 'rgba(212,175,55,0.04)', borderTop: '3px solid var(--primary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💡</div>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>Local Tips</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Ask your AI itinerary for <strong style={{ color: 'white' }}>specific restaurant names</strong> — the Buddy Tips in your day cards often include local favourites not found on major platforms.
            </p>
          </div>
        </div>
      )}

      {/* ========= FLIGHTS ========= */}
      {activeTab === 'flights' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {FLIGHT_PLATFORMS.map((p, i) => (
              <a key={i} href={p.urlFn(dest)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className="glass" style={{
                  padding: '26px', borderRadius: '20px',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
                  borderLeft: `4px solid ${p.color}`,
                }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px ${p.color}40`; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{p.icon}</span>
                      <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '700', margin: 0 }}>{p.name}</h3>
                    </div>
                    <span style={{ background: `${p.color}22`, color: p.color, padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{p.badge}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: p.color, fontWeight: '600', fontSize: '0.82rem' }}>
                    Search flights to {dest} <ExternalLink size={13} />
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="glass" style={{ marginTop: '20px', padding: '20px 24px', borderRadius: '16px', background: 'rgba(99,102,241,0.06)', borderLeft: '4px solid #818cf8', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem' }}>🎯</span>
            <div>
              <strong style={{ color: '#a5b4fc' }}>Pro tip:</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '6px' }}>
                Use Google Flights' <em>Price Calendar</em> to find the cheapest day to fly. Booking 6–8 weeks ahead typically saves 15–25%.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
