import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, Plus, Trash2, PieChart, AlertTriangle, 
  ArrowRightLeft, User, Utensils, Car, Hotel, 
  Ticket, ShoppingBag, MoreHorizontal, Activity, Zap
} from 'lucide-react';
import useUser from '../hooks/useUser';
import { API_BASE_URL } from '../config';

const CATEGORIES = [
  { id: 'Food', icon: <Utensils size={14} />, color: '#fb7185' }, 
  { id: 'Transport', icon: <Car size={14} />, color: '#60a5fa' },
  { id: 'Lodging', icon: <Hotel size={14} />, color: '#818cf8' },
  { id: 'Activities', icon: <Ticket size={14} />, color: '#34d399' },
  { id: 'Shopping', icon: <ShoppingBag size={14} />, color: '#f472b6' },
  { id: 'Other', icon: <MoreHorizontal size={14} />, color: '#94a3b8' }
];

export default function ExpenseTracker({ trip, isSharedView }) {
  const { user: currentUser } = useUser();
  const [expenses, setExpenses] = useState(trip.expenses || []);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Robust Numeric Extraction for calculations (Prevents "₹1" balance error)
  const totalBudget = useMemo(() => {
    const raw = trip.budget || trip.estimatedTotalCost || "0";
    const numericOnly = raw.toString().replace(/[^0-9]/g, "");
    const parsed = parseInt(numericOnly, 10);
    return isNaN(parsed) || parsed === 0 ? 1 : parsed; // Safety fallback to 1 to avoid division by zero
  }, [trip.budget, trip.estimatedTotalCost]);

  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const remaining = totalBudget - totalSpent;
  const percentSpent = Math.min((totalSpent / totalBudget) * 100, 100);

  // Category Aggregation logic for the Visual Charts
  const categorySpending = useMemo(() => {
    const stats = {};
    CATEGORIES.forEach(c => stats[c.id] = 0);
    expenses.forEach(exp => {
      const catId = exp.category || 'Other';
      // Safety: Only map to existing CATEGORIES or Other
      const resolvedId = CATEGORIES.find(c => c.id === catId) ? catId : 'Other';
      stats[resolvedId] = (stats[resolvedId] || 0) + exp.amount;
    });
    return stats;
  }, [expenses]);

  // Budget Health Pulse Indicator (Healthy, Moderate, Risky)
  const getBudgetHealth = () => {
    if (percentSpent > 90) return { label: 'RISKY', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' };
    if (percentSpent > 60) return { label: 'MODERATE', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
    return { label: 'HEALTHY', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' };
  };
  const health = getBudgetHealth();

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (isSharedView) return;
    setError('');
    const parsedAmount = parseFloat(amount);
    if (!title || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please check your input.");
      return;
    }
    setLoading(true);
    try {
      const payload = { 
        title, amount: parsedAmount, category,
        paidBy: currentUser?.id || currentUser?._id, 
        payerName: currentUser?.name || 'Participant'
      };
      console.log('Sending Expense Payload:', payload);

      const tripId = trip.tripId || trip._id;
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to log expense');
      const updatedTrip = await response.json();
      setExpenses(updatedTrip.expenses);
      setTitle(''); setAmount('');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleDeleteExpense = async (id) => {
    if (isSharedView) return;
    try {
      const tripId = trip.tripId || trip._id;
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/expenses/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      const updatedTrip = await response.json();
      setExpenses(updatedTrip.expenses);
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="animate-fade-in stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Visual Analytics Dashboard */}
      <div className="glass" style={{ padding: '30px', borderTop: `4px solid ${health.color}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChart color="var(--primary)" size={24} />
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.4rem' }}>Smart Analytics</h3>
            </div>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Detailed breakdown of your journey's spending</p>
          </div>
          <div style={{
            background: health.color, color: 'black', padding: '6px 14px', borderRadius: '100px',
            fontSize: '0.75rem', fontWeight: 'bold', boxShadow: `0 0 20px ${health.glow}`,
            display: 'flex', alignItems: 'center', gap: '6px',
            animation: 'pulse 2s infinite ease-in-out'
          }}>
            <Activity size={14} /> {health.label}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          {/* Spend Meter Card */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Budget Allocated vs Spent</span>
                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold' }}>{percentSpent.toFixed(1)}%</span>
             </div>
             <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ height: '100%', width: `${percentSpent}%`, background: health.color, transition: 'width 1s ease-out' }} />
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                   <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Cost</span>
                   <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{totalSpent.toLocaleString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{remaining < 0 ? 'Exceeded By' : 'Safe Balance'}</span>
                   <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: remaining < 0 ? '#ef4444' : '#10b981' }}>₹{Math.abs(remaining).toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* New Distribution Breakdown Card */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
             {CATEGORIES.map(cat => {
               const val = categorySpending[cat.id];
               const pct = totalSpent > 0 ? (val / totalSpent) * 100 : 0;
               if (pct === 0) return null;
               return (
                 <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                          {cat.icon} {cat.id}
                       </div>
                       <span style={{ color: 'var(--text-muted)' }}>₹{val.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                       <div style={{ height: '100%', width: `${pct}%`, background: cat.color }} />
                    </div>
                 </div>
               );
             })}
             {!totalSpent && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start adding expenses to see breakdown</div>}
          </div>
        </div>
      </div>

      {/* Add Expense Form Integrated with Categories */}
      <div className="glass" style={{ padding: '30px' }}>
        {!isSharedView && (
          <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Description" className="input" value={title} onChange={e=>setTitle(e.target.value)} style={{ flex: 2, minWidth: '200px' }} />
            <input type="number" placeholder="Cost (₹)" className="input" value={amount} onChange={e=>setAmount(e.target.value)} style={{ flex: 1, minWidth: '120px' }} />
            <select className="input" value={category} onChange={e=>setCategory(e.target.value)} style={{ flex: 1, minWidth: '150px', background: '#0f172a', cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
            <button type="submit" className="btn" disabled={loading} style={{ width: '60px', background: 'var(--primary)', color: 'black' }}><Plus size={20} /></button>
          </form>
        )}
        
        {/* Updated List of Expenses with Detailed Categorization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {expenses.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '20px' }}>No entries found</p> : 
          expenses.map(exp => {
            const cat = CATEGORIES.find(c => c.id === (exp.category || 'Other')) || CATEGORIES.find(c=>c.id==='Other');
            return (
              <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', color: cat?.color }}><Zap size={18} /></div>
                   <div>
                      <div style={{ color: 'white', fontWeight: 'bold' }}>{exp.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.category || 'General'} • Logged by {exp.payerName}</div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{exp.amount.toLocaleString()}</span>
                   {!isSharedView && <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer', opacity: 0.5 }} onClick={()=>handleDeleteExpense(exp._id)} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
