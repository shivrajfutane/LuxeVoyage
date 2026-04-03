import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div id="ghost">
        <div id="gold-ghost">
          <div id="pupil" />
          <div id="pupil1" />
          <div id="eye" />
          <div id="eye1" />
          <div id="top0" />
          <div id="top1" />
          <div id="top2" />
          <div id="top3" />
          <div id="top4" />
          <div id="st0" />
          <div id="st1" />
          <div id="st2" />
          <div id="st3" />
          <div id="st4" />
          <div id="st5" />
          <div id="an1" />
          <div id="an2" />
          <div id="an3" />
          <div id="an4" />
          <div id="an5" />
          <div id="an6" />
          <div id="an7" />
          <div id="an8" />
          <div id="an9" />
          <div id="an10" />
          <div id="an11" />
          <div id="an12" />
          <div id="an13" />
          <div id="an14" />
          <div id="an15" />
          <div id="an16" />
          <div id="an17" />
          <div id="an18" />
        </div>
        <div id="shadow" />
      </div>
      
      <div className="loader-text-container">
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          AI is crafting your perfect itinerary...
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>
          Searching elite travel vaults (10-15s)
        </p>
      </div>
    </div>
  );
}

export default Loader;
