import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, Banknote, Globe2, RefreshCw, Zap } from 'lucide-react';

// Destination city/country → currency code mapping
const DESTINATION_CURRENCY_MAP = {
  // Asia
  'india': 'INR', 'delhi': 'INR', 'mumbai': 'INR', 'goa': 'INR', 'jaipur': 'INR', 'bangalore': 'INR',
  'kerala': 'INR', 'manali': 'INR', 'shimla': 'INR', 'varanasi': 'INR', 'udaipur': 'INR',
  'agra': 'INR', 'kolkata': 'INR', 'chennai': 'INR', 'hyderabad': 'INR', 'pune': 'INR',
  'japan': 'JPY', 'tokyo': 'JPY', 'osaka': 'JPY', 'kyoto': 'JPY',
  'thailand': 'THB', 'bangkok': 'THB', 'phuket': 'THB', 'chiang mai': 'THB',
  'singapore': 'SGD',
  'malaysia': 'MYR', 'kuala lumpur': 'MYR',
  'indonesia': 'IDR', 'bali': 'IDR', 'jakarta': 'IDR',
  'vietnam': 'VND', 'hanoi': 'VND', 'ho chi minh': 'VND',
  'south korea': 'KRW', 'seoul': 'KRW',
  'china': 'CNY', 'beijing': 'CNY', 'shanghai': 'CNY',
  'nepal': 'NPR', 'kathmandu': 'NPR',
  'sri lanka': 'LKR', 'colombo': 'LKR',
  'maldives': 'MVR', 'male': 'MVR',
  'dubai': 'AED', 'abu dhabi': 'AED', 'uae': 'AED',
  'turkey': 'TRY', 'istanbul': 'TRY', 'cappadocia': 'TRY',
  // Europe
  'france': 'EUR', 'paris': 'EUR', 'nice': 'EUR',
  'italy': 'EUR', 'rome': 'EUR', 'venice': 'EUR', 'milan': 'EUR', 'florence': 'EUR',
  'spain': 'EUR', 'barcelona': 'EUR', 'madrid': 'EUR',
  'germany': 'EUR', 'berlin': 'EUR', 'munich': 'EUR',
  'netherlands': 'EUR', 'amsterdam': 'EUR',
  'greece': 'EUR', 'athens': 'EUR', 'santorini': 'EUR',
  'portugal': 'EUR', 'lisbon': 'EUR',
  'austria': 'EUR', 'vienna': 'EUR',
  'ireland': 'EUR', 'dublin': 'EUR',
  'belgium': 'EUR', 'brussels': 'EUR',
  'finland': 'EUR', 'helsinki': 'EUR',
  'uk': 'GBP', 'london': 'GBP', 'edinburgh': 'GBP', 'england': 'GBP', 'scotland': 'GBP',
  'switzerland': 'CHF', 'zurich': 'CHF', 'geneva': 'CHF',
  'sweden': 'SEK', 'stockholm': 'SEK',
  'norway': 'NOK', 'oslo': 'NOK',
  'denmark': 'DKK', 'copenhagen': 'DKK',
  'czech republic': 'CZK', 'prague': 'CZK',
  'hungary': 'HUF', 'budapest': 'HUF',
  'poland': 'PLN', 'warsaw': 'PLN', 'krakow': 'PLN',
  'russia': 'RUB', 'moscow': 'RUB',
  'iceland': 'ISK', 'reykjavik': 'ISK',
  // Americas
  'usa': 'USD', 'new york': 'USD', 'los angeles': 'USD', 'san francisco': 'USD', 'las vegas': 'USD', 'miami': 'USD', 'hawaii': 'USD', 'chicago': 'USD',
  'canada': 'CAD', 'toronto': 'CAD', 'vancouver': 'CAD',
  'mexico': 'MXN', 'cancun': 'MXN', 'mexico city': 'MXN',
  'brazil': 'BRL', 'rio de janeiro': 'BRL', 'sao paulo': 'BRL',
  'argentina': 'ARS', 'buenos aires': 'ARS',
  'colombia': 'COP', 'bogota': 'COP', 'medellin': 'COP',
  'peru': 'PEN', 'lima': 'PEN', 'cusco': 'PEN',
  'chile': 'CLP', 'santiago': 'CLP',
  // Africa & Oceania
  'south africa': 'ZAR', 'cape town': 'ZAR', 'johannesburg': 'ZAR',
  'egypt': 'EGP', 'cairo': 'EGP',
  'morocco': 'MAD', 'marrakech': 'MAD',
  'kenya': 'KES', 'nairobi': 'KES',
  'tanzania': 'TZS',
  'australia': 'AUD', 'sydney': 'AUD', 'melbourne': 'AUD',
  'new zealand': 'NZD', 'auckland': 'NZD',
  'fiji': 'FJD',
};

const CURRENCY_SYMBOLS = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', THB: '฿',
  SGD: 'S$', MYR: 'RM', IDR: 'Rp', VND: '₫', KRW: '₩', CNY: '¥',
  AED: 'د.إ', TRY: '₺', CHF: 'Fr', CAD: 'C$', AUD: 'A$', NZD: 'NZ$',
  BRL: 'R$', MXN: 'Mex$', ZAR: 'R', EGP: 'E£', NPR: 'रू', LKR: 'Rs',
  SEK: 'kr', NOK: 'kr', DKK: 'kr', CZK: 'Kč', HUF: 'Ft', PLN: 'zł',
  RUB: '₽', ARS: 'AR$', COP: 'COL$', PEN: 'S/', CLP: 'CLP$',
  KES: 'KSh', MAD: 'MAD', MVR: 'Rf', ISK: 'kr', FJD: 'FJ$', TZS: 'TSh'
};

const CURRENCY_NAMES = {
  INR: 'Indian Rupee', USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound',
  JPY: 'Japanese Yen', THB: 'Thai Baht', SGD: 'Singapore Dollar',
  MYR: 'Malaysian Ringgit', IDR: 'Indonesian Rupiah', VND: 'Vietnamese Dong',
  KRW: 'South Korean Won', CNY: 'Chinese Yuan', AED: 'UAE Dirham',
  TRY: 'Turkish Lira', CHF: 'Swiss Franc', CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar', NZD: 'New Zealand Dollar', BRL: 'Brazilian Real',
  MXN: 'Mexican Peso', ZAR: 'South African Rand', EGP: 'Egyptian Pound',
  NPR: 'Nepalese Rupee', LKR: 'Sri Lankan Rupee', SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone', DKK: 'Danish Krone', CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint', PLN: 'Polish Złoty', RUB: 'Russian Ruble',
  ARS: 'Argentine Peso', COP: 'Colombian Peso', PEN: 'Peruvian Sol',
  CLP: 'Chilean Peso', KES: 'Kenyan Shilling', MAD: 'Moroccan Dirham',
  MVR: 'Maldivian Rufiyaa', ISK: 'Icelandic Króna', FJD: 'Fijian Dollar',
  TZS: 'Tanzanian Shilling'
};

function detectCurrency(destination) {
  if (!destination) return 'USD';
  const lower = destination.toLowerCase().trim();
  
  // Try exact match first, then partial match
  if (DESTINATION_CURRENCY_MAP[lower]) return DESTINATION_CURRENCY_MAP[lower];
  
  for (const [key, code] of Object.entries(DESTINATION_CURRENCY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return code;
  }
  
  return 'USD'; // Default fallback
}

export default function CurrencyConverter({ destination, budget }) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [direction, setDirection] = useState('from'); // 'from' = INR→foreign, 'to' = foreign→INR
  const [lastUpdated, setLastUpdated] = useState(null);

  // Auto-detect destination currency
  useEffect(() => {
    const detected = detectCurrency(destination);
    setToCurrency(detected);
  }, [destination]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        if (!res.ok) throw new Error('Failed to fetch rates');
        const data = await res.json();
        setRates(data.rates);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setError('Could not fetch live rates. Using estimated values.');
        // Fallback rates (approximate)
        setRates({ USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.78, THB: 0.41, SGD: 0.016, AUD: 0.018, CAD: 0.016, AED: 0.044, INR: 1 });
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  const convert = (val, from, to) => {
    if (!rates || !val) return 0;
    if (from === to) return parseFloat(val);
    const inBase = parseFloat(val); // already in base currency
    return inBase * (rates[to] || 1);
  };

  const convertedAmount = convert(parseFloat(amount) || 0, fromCurrency, toCurrency);
  const rate = rates ? (rates[toCurrency] || 0) : 0;
  const reverseRate = rate > 0 ? (1 / rate) : 0;

  // Parse budget string to number
  const budgetNum = parseFloat(String(budget).replace(/[^0-9.]/g, '')) || 0;
  const budgetConverted = convert(budgetNum, fromCurrency, toCurrency);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const sym = (code) => CURRENCY_SYMBOLS[code] || code;

  return (
    <div className="glass animate-fade-in stagger-3" style={{ padding: '30px', marginBottom: '40px', borderTop: '4px solid #10b981' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Banknote color="#34d399" size={28} />
          <h3 style={{ fontSize: '1.6rem', color: 'white', margin: 0 }}>Currency Converter</h3>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={12} /> Live rates · {lastUpdated}
          </span>
        )}
      </div>

      {/* Auto-detected currency badge */}
      <div style={{ 
        background: 'rgba(16, 185, 129, 0.08)', 
        border: '1px solid rgba(16, 185, 129, 0.2)', 
        borderRadius: '12px', 
        padding: '14px 20px', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Globe2 size={18} color="#34d399" />
        <span style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>
          <strong>{destination}</strong> uses <strong>{CURRENCY_NAMES[toCurrency] || toCurrency}</strong> ({sym(toCurrency)})
        </span>
        <Zap size={14} color="#34d399" style={{ marginLeft: 'auto' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Auto-detected</span>
      </div>

      {error && (
        <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', color: '#fbbf24', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Converter Card */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
        
        {/* From Currency */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>You have</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px', 
              padding: '12px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              minWidth: '100px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{sym(fromCurrency)}</span>
              <span style={{ color: 'white', fontWeight: '600' }}>{fromCurrency}</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: '700',
                fontFamily: 'Outfit, sans-serif',
                outline: 'none',
                textAlign: 'right'
              }}
              placeholder="1000"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <button
            onClick={handleSwap}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#34d399'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'rotate(180deg)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'rotate(0)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; }}
          >
            <ArrowRightLeft size={20} style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>You get</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.2)', 
              borderRadius: '12px', 
              padding: '12px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              minWidth: '100px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{sym(toCurrency)}</span>
              <span style={{ color: '#34d399', fontWeight: '600' }}>{toCurrency}</span>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '12px',
              padding: '14px 16px',
              textAlign: 'right'
            }}>
              <span style={{ color: '#34d399', fontSize: '1.3rem', fontWeight: '700' }}>
                {loading ? '...' : convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
          1 {fromCurrency} = {rate.toFixed(rate < 1 ? 4 : 2)} {toCurrency}
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          1 {toCurrency} = {reverseRate.toFixed(reverseRate < 1 ? 4 : 2)} {fromCurrency}
        </div>
      </div>

      {/* Quick Convert Buttons */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px', display: 'block' }}>Quick Convert</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {quickAmounts.map(qa => (
            <button
              key={qa}
              onClick={() => setAmount(String(qa))}
              style={{
                background: amount === String(qa) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${amount === String(qa) ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '10px',
                padding: '10px 18px',
                color: amount === String(qa) ? '#34d399' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { if (amount !== String(qa)) { e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'; e.currentTarget.style.color = '#6ee7b7'; }}}
              onMouseOut={(e) => { if (amount !== String(qa)) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-main)'; }}}
            >
              {sym(fromCurrency)}{qa.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Breakdown */}
      {budgetNum > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 78, 59, 0.15))', 
          border: '1px solid rgba(16, 185, 129, 0.2)', 
          borderRadius: '16px', 
          padding: '20px 24px' 
        }}>
          <h4 style={{ color: '#6ee7b7', margin: '0 0 16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Banknote size={18} /> Your Trip Budget at {destination}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Budget in {fromCurrency}</div>
              <div style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>{sym(fromCurrency)}{budgetNum.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Spending Power in {toCurrency}</div>
              <div style={{ color: '#34d399', fontSize: '1.4rem', fontWeight: '700' }}>{sym(toCurrency)}{budgetConverted.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
          <div style={{ marginTop: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
            Daily budget ≈ {sym(toCurrency)}{(budgetConverted / (parseInt(budget) || 5)).toLocaleString(undefined, { maximumFractionDigits: 0 })} per day
          </div>
        </div>
      )}
    </div>
  );
}
