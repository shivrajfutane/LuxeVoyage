import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Lock, Plus, Trash2, AlertCircle, 
  FileText, CreditCard, Landmark, LifeBuoy, Zap, Eye, EyeOff
} from 'lucide-react';

export default function TravelVault({ trip, onUpdate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showValues, setShowValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Travel', value: '', note: '', expiry: '', isCritical: false
  });

  const vaultData = trip.vault || [];

  const toggleValue = (id) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tripId = trip._id || trip.tripId;
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/vault`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
      setShowAdd(false);
      setFormData({ title: '', category: 'Travel', value: '', note: '', expiry: '', isCritical: false });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Remove this document from the secure vault?")) return;
    try {
      const tripId = trip._id || trip.tripId;
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/vault/${docId}`, {
        method: 'DELETE'
      });
      const updated = await response.json();
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const criticalDocs = useMemo(() => vaultData.filter(d => d.isCritical), [vaultData]);
  const vaultHealth = useMemo(() => {
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

  return (
    <div className="animate-fade-in stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Vault Status & Emergency Pulse */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>VAULT HEALTH</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{vaultHealth}% SECURE</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${vaultHealth}%`, height: '100%', background: '#10b981', boxShadow: '0 0 10px #10b981aa' }} />
          </div>
          <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {vaultData.length < 3 ? '⚠️ Add your Passport and Insurance info for 100% readiness.' : '✅ Essential travel documentation is synced.'}
          </p>
        </div>

        {criticalDocs.length > 0 && (
          <div className="glass" style={{ padding: '24px', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Zap size={18} color="#ef4444" className="animate-pulse" />
              <span style={{ fontSize: '0.96rem', fontWeight: 'bold', color: 'white' }}>EMERGENCY PULSE</span>
            </div>
            {criticalDocs.map(doc => (
              <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{doc.title}:</span>
                <span style={{ color: 'white', fontWeight: '600', fontFamily: 'monospace' }}>{doc.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock color="var(--primary)" size={24} />
            <h3 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>Secure Document Locker</h3>
          </div>
          <button className="btn" onClick={() => setShowAdd(!showAdd)} style={{ width: 'auto', padding: '10px 20px', borderRadius: '100px' }}>
            {showAdd ? 'Cancel' : <><Plus size={18} /> Store Document</>}
          </button>
        </div>

        {showAdd && (
          <form className="glass" onSubmit={handleAdd} style={{ padding: '24px', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Document Title</label>
                <input className="input" placeholder="e.g. Passport Copy" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
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
                <label className="form-label">Value / ID Number</label>
                <input className="input" placeholder="Secret Value" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
               <input type="checkbox" id="critical" checked={formData.isCritical} onChange={e => setFormData({...formData, isCritical: e.target.checked})} />
               <label htmlFor="critical" style={{ fontSize: '0.9rem', color: 'white' }}>Pin to Emergency Pulse (Critical Info)</label>
            </div>
            <button className="btn" type="submit" disabled={loading} style={{ marginTop: '20px' }}>
              {loading ? 'Securing...' : 'Encrypt & Store'}
            </button>
          </form>
        )}

        {vaultData.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {vaultData.map(doc => (
              <div key={doc._id} className="glass" style={{ padding: '20px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {getCategoryIcon(doc.category)}
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>{doc.title}</span>
                   </div>
                   <button onClick={() => handleDelete(doc._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                   </button>
                </div>
                
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <span style={{ fontFamily: 'monospace', color: showValues[doc._id] ? 'white' : 'transparent', textShadow: showValues[doc._id] ? 'none' : '0 0 8px rgba(255,255,255,0.5)' }}>
                    {doc.value}
                  </span>
                  <button onClick={() => toggleValue(doc._id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                    {showValues[doc._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {doc.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            No documents secured yet. Your travel vault is empty.
          </div>
        )}
      </div>
    </div>
  );
}
