import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, Lock, Plus, Trash2, AlertCircle, 
  FileText, CreditCard, Landmark, LifeBuoy, Zap, Eye, EyeOff, Loader2, ShieldAlert, CheckCircle2
} from 'lucide-react';
import anime from 'animejs';
import { API_BASE_URL } from '../config';

export default function GlobalVault({ userId }) {
  const [vaultData, setVaultData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showValues, setShowValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', category: 'Travel', value: '', note: '', expiry: '', isCritical: false
  });

  useEffect(() => {
    if (userId) fetchVault();
  }, [userId]);

  useEffect(() => {
    if (!fetchLoading) {
      anime({
        targets: '.vault-card',
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
        duration: 1000
      });
    }
  }, [fetchLoading]);

  const fetchVault = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}/vault`);
      if (!response.ok) throw new Error('Vault fetch failed');
      const data = await response.json();
      setVaultData(data || []);
    } catch (err) {
      console.error('Vault Fetch Error:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const toggleValue = (id) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}/vault`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updated = await response.json();
      setVaultData(updated);
      setShowAdd(false);
      setFormData({ title: '', category: 'Travel', value: '', note: '', expiry: '', isCritical: false });
    } catch (err) {
      console.error('Add Document Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Remove this document from your profile vault?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}/vault/${docId}`, {
        method: 'DELETE'
      });
      const updated = await response.json();
      setVaultData(updated);
    } catch (err) {
      console.error('Delete Document Error:', err);
    }
  };

  const criticalDocs = useMemo(() => vaultData.filter(d => d.isCritical), [vaultData]);
  const vaultHealth = useMemo(() => {
    if (vaultData.length === 0) return 0;
    const score = (vaultData.length / 5) * 100;
    return Math.min(score, 100).toFixed(0);
  }, [vaultData]);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Identity': return <ShieldCheck size={20} color="#60a5fa" />;
      case 'Financial': return <CreditCard size={20} color="#10b981" />;
      case 'Emergency': return <LifeBuoy size={20} color="#ef4444" />;
      default: return <FileText size={20} color="var(--primary)" />;
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" style={{ margin: '0 auto' }} />
        <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>Accessing secure identity vaults...</p>
      </div>
    );
  }

  return (
    <div className="vault-section" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Security Dashboard Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '30px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 color="#10b981" size={18} />
              <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>SECURITY STATUS</span>
            </div>
            <span style={{ color: '#10b981', fontWeight: '900', fontSize: '1.2rem' }}>{vaultHealth}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${vaultHealth}%`, height: '100%', background: '#10b981', boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }} />
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {vaultData.length < 3 ? 'Enhance your profile security by adding primary identification and insurance documents.' : 'Your global travel identity is synchronized and encrypted.'}
          </p>
        </div>

        <div className="glass" style={{ padding: '30px', borderLeft: '4px solid #60a5fa', background: 'rgba(96, 165, 250, 0.02)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Lock size={18} color="#60a5fa" />
              <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>ENCRYPTION LEVEL</span>
           </div>
           <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '5px' }}>AES-256 Bit</div>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bank-grade security protocol active for all sensitive identity markers.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '40px', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <ShieldAlert color="var(--primary)" size={24} />
            </div>
            <h3 style={{ fontSize: '1.6rem', color: 'white', margin: 0, fontWeight: '700' }}>Global Document Locker</h3>
          </div>
          <button className="btn" onClick={() => setShowAdd(!showAdd)} style={{ width: 'auto', padding: '12px 28px', borderRadius: '100px', display: 'flex', gap: '10px', alignItems: 'center', background: showAdd ? 'rgba(255,255,255,0.05)' : 'var(--primary)' }}>
            {showAdd ? 'Cancel' : <><Plus size={18} /> Add Secure Document</>}
          </button>
        </div>

        {showAdd && (
          <form className="glass" onSubmit={handleAdd} style={{ padding: '30px', marginBottom: '40px', background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
              <div className="form-group">
                <label className="form-label">Document Title</label>
                <input className="input" placeholder="e.g. Passport (Global)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Travel">Travel / Logistics</option>
                  <option value="Identity">Identity</option>
                  <option value="Financial">Financial / Insurance</option>
                  <option value="Emergency">Emergency Contact</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Confidential Value</label>
                <input className="input" placeholder="SSN, ID, Policy #" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
               <input type="checkbox" id="critical" checked={formData.isCritical} onChange={e => setFormData({...formData, isCritical: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
               <label htmlFor="critical" style={{ fontSize: '0.95rem', color: 'white' }}>Pin to Emergency Dashboard</label>
            </div>
            <button className="btn" type="submit" disabled={loading} style={{ marginTop: '30px', height: '54px', fontSize: '1.1rem' }}>
              {loading ? <span style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /> Securing...</span> : 'Seal & Store Encrypted'}
            </button>
          </form>
        )}

        {vaultData.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {vaultData.map(doc => (
              <div key={doc._id} className="glass vault-card" style={{ padding: '24px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
                        {getCategoryIcon(doc.category)}
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>{doc.title}</span>
                   </div>
                   <button onClick={() => handleDelete(doc._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5 }}>
                      <Trash2 size={16} />
                   </button>
                </div>
                
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '15px', border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <span style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '1.1rem',
                    color: showValues[doc._id] ? 'white' : 'transparent', 
                    textShadow: showValues[doc._id] ? 'none' : '0 0 10px rgba(255,255,255,0.6)',
                    transition: 'all 0.3s ease'
                  }}>
                    {doc.value}
                  </span>
                  <button onClick={() => toggleValue(doc._id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex' }}>
                    {showValues[doc._id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '100px' }}>{doc.category}</div>
                  {doc.isCritical && <Zap size={14} color="#ef4444" className="animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <ShieldCheck size={40} style={{ opacity: 0.3 }} color="var(--primary)" />
            </div>
            <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1.2rem' }}>No Secured Documents</h4>
            <p style={{ margin: 0, opacity: 0.6 }}>Store your travel identity papers here for encrypted universal access across all journeys.</p>
          </div>
        )}
      </div>
    </div>
  );
}
