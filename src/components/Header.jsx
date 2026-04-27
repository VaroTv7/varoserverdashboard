import React, { useState, useEffect } from 'react';
import { fetchSystemStats, simulateStats } from '../lib/api';

const StatBar = ({ label, value, color }) => (
  <div className="vs-stat">
    <span className="vs-stat-label">{label}</span>
    <div className="vs-stat-track">
      <div className="vs-stat-fill" style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="vs-stat-val" style={{ color }}>{Math.round(value)}%</span>
  </div>
);

const Header = ({ upServices, totalServices, onOpenSearch }) => {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({ cpu: 45, ram: 52, nas: 38, media: 65 });
  const [live, setLive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    const poll = async () => {
      const real = await fetchSystemStats();
      if (real) {
        setStats(real);
        setLive(true);
      } else {
        setStats(s => simulateStats(s));
        setLive(false);
      }
    };
    poll();
    interval = setInterval(poll, live ? 5000 : 3000);
    return () => clearInterval(interval);
  }, [live]);

  const timeStr = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const hostname = window.location.hostname || 'localhost';

  return (
    <header className="vs-header">
      <div className="vs-logo-group">
        <img src="/varoserver-logo.svg" alt="VaroDashboard" className="vs-logo-img" />
        <span className="vs-logo-text">VaroDashboard</span>
      </div>

      <StatBar label="CPU" value={stats.cpu} color="var(--vs-primary)" />
      <StatBar label="RAM" value={stats.ram} color="var(--vs-accent)" />
      <StatBar label="NAS" value={stats.nas} color="var(--vs-ok)" />
      <StatBar label="MEDIA" value={stats.media} color="var(--vs-warn)" />

      <div className="vs-divider" />

      <span className={`vs-nominal ${live ? '' : 'simulated'}`}>
        {live ? '● LIVE' : '○ SIM'}
      </span>
      <span className="vs-header-count">{upServices}/{totalServices} servicios</span>

      <button className="vs-search-trigger" onClick={onOpenSearch}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" /><line x1="11" y1="11" x2="14" y2="14" />
        </svg>
        <span>Buscar</span>
        <kbd className="vs-kbd">⌘K</kbd>
      </button>

      <div className="vs-spacer" />

      <div className="vs-time">
        <div className="vs-time-clock">{timeStr}</div>
        <div className="vs-time-date">{dateStr}</div>
      </div>

      <div className="vs-header-ip">
        <div className="vs-ip-addr">{hostname}</div>
      </div>
    </header>
  );
};

export default Header;
