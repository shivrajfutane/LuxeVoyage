import React from 'react';

export default function Debug() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'white' }}>LuxeVoyage Debug Mode</h1>
      <p style={{ color: '#ccc' }}>If you can see this, React is successfully loading on Vercel!</p>
      <p style={{ color: '#aaa', fontSize: '12px', marginTop: '20px' }}>
        This means the blank screen bug is caused by a runtime error inside App.jsx or one of its components.
      </p>
    </div>
  );
}
