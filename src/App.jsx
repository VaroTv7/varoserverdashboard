import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar, { getColor, getIcon } from './components/Sidebar';
import ServiceCard from './components/ServiceCard';
import ServiceCardCompact from './components/ServiceCardCompact';
import SettingsPanel from './components/SettingsPanel';
import SearchModal from './components/SearchModal';
import NotificationPanel from './components/NotificationPanel';
import { fetchUptimeStatus } from './lib/api';
import yaml from 'js-yaml';

// ─── localStorage keys ───
const KEYS = {
  scale: 'vs-scale',
  cat: 'vs-cat',
  view: 'vs-view',
  theme: 'vs-theme',
  favs: 'vs-favorites',
  portainer: 'vs-portainer-token',
};

function load(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

/**
 * Parse Homepage-compatible services.yaml
 */
function parseServicesYaml(raw) {
  const data = yaml.load(raw);
  const categories = {};
  data.forEach(catObj => {
    const catName = Object.keys(catObj)[0];
    const services = catObj[catName];
    categories[catName] = {
      label: catName,
      items: services.map(svcObj => {
        const name = Object.keys(svcObj)[0];
        const d = svcObj[name];
        let port = null;
        if (d.href) { const m = d.href.match(/:(\d+)/); if (m) port = m[1]; }
        return { name, desc: d.description || '', port, href: d.href || '#', status: 'up', ico: d.icon || '', mem: '~' };
      }),
    };
  });
  return categories;
}

function App() {
  // ─── State ───
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(() => load(KEYS.cat, 'all'));
  const [scale, setScale] = useState(() => parseFloat(load(KEYS.scale, '1')));
  const [viewMode, setViewMode] = useState(() => load(KEYS.view, 'grid'));
  const [theme, setTheme] = useState(() => load(KEYS.theme, 'mocha'));
  const [favorites, setFavorites] = useState(() => loadJson(KEYS.favs, []));
  const [portainerToken, setPortainerToken] = useState(() => load(KEYS.portainer, ''));
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ─── Load config ───
  useEffect(() => {
    fetch('/config/services.yaml')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(text => setCategories(parseServicesYaml(text)))
      .catch(err => setError(err.message));
  }, []);

  // ─── Scale → :root ───
  useEffect(() => {
    document.documentElement.style.setProperty('--vs-scale', scale);
    localStorage.setItem(KEYS.scale, scale.toString());
  }, [scale]);

  // ─── Theme → :root ───
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEYS.theme, theme);
  }, [theme]);

  // ─── Persist preferences ───
  useEffect(() => { if (!activeCategory.startsWith('__')) localStorage.setItem(KEYS.cat, activeCategory); }, [activeCategory]);
  useEffect(() => { localStorage.setItem(KEYS.view, viewMode); }, [viewMode]);
  useEffect(() => { localStorage.setItem(KEYS.favs, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(KEYS.portainer, portainerToken); }, [portainerToken]);

  // ─── Uptime Kuma polling ───
  useEffect(() => {
    if (!categories) return;
    const poll = async () => {
      const statusMap = await fetchUptimeStatus();
      if (!statusMap) return;
      setCategories(prev => {
        const updated = { ...prev };
        const newNotifs = [];
        Object.keys(updated).forEach(catKey => {
          updated[catKey] = {
            ...updated[catKey],
            items: updated[catKey].items.map(item => {
              // Try matching by name
              const newStatus = statusMap[item.name] || statusMap[item.name.toLowerCase()] || item.status;
              if (newStatus === 'down' && item.status === 'up') {
                newNotifs.push({
                  id: Date.now() + Math.random(),
                  type: 'error',
                  title: `${item.name} caído`,
                  message: `El servicio ${item.name} no responde`,
                  time: new Date().toLocaleTimeString('es-ES'),
                });
              }
              return { ...item, status: newStatus };
            })
          };
        });
        if (newNotifs.length > 0) setNotifications(n => [...newNotifs, ...n]);
        return updated;
      });
    };
    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [categories !== null]);

  // ─── Ctrl+K ───
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ─── Favorites ───
  const toggleFavorite = useCallback((name) => {
    setFavorites(f => f.includes(name) ? f.filter(n => n !== name) : [...f, name]);
  }, []);

  // ─── Notifications ───
  const dismissNotif = (id) => setNotifications(n => n.filter(x => x.id !== id));
  const clearNotifs = () => setNotifications([]);

  // ─── Error / Loading states ───
  if (error) return (
    <div style={{ padding: '40px', color: 'var(--vs-error)', fontFamily: 'var(--vs-font)' }}>
      <h2>Error cargando configuración</h2>
      <p style={{ marginTop: '10px', color: 'var(--vs-overlay)' }}>
        No se pudo leer <code>/config/services.yaml</code>: {error}
      </p>
    </div>
  );

  if (!categories) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--vs-overlay)', fontFamily: 'var(--vs-font)', fontSize: 'var(--vs-fs-base)' }}>
      Cargando servicios...
    </div>
  );

  const totalServices = Object.values(categories).reduce((a, c) => a + c.items.length, 0);
  const upServices = Object.values(categories).reduce((a, c) => a + c.items.filter(i => i.status === 'up').length, 0);

  // Build visible sections
  const isSettings = activeCategory === '__settings';
  const isNotifications = activeCategory === '__notifications';
  const isFavorites = activeCategory === '__favorites';

  let visibleCategories;
  if (isFavorites) {
    // Build a virtual "Favorites" category
    const favItems = Object.values(categories).flatMap(c => c.items).filter(i => favorites.includes(i.name));
    visibleCategories = favItems.length > 0 ? [['__favorites', { label: 'Favoritos', items: favItems }]] : [];
  } else if (activeCategory === 'all' || isSettings || isNotifications) {
    visibleCategories = Object.entries(categories);
  } else {
    visibleCategories = Object.entries(categories).filter(([k]) => k === activeCategory);
  }

  const CardComponent = viewMode === 'compact' ? ServiceCardCompact : ServiceCard;

  return (
    <>
      <Header
        upServices={upServices}
        totalServices={totalServices}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="vs-body-wrap">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          totalServices={totalServices}
          favCount={favorites.length}
          notifCount={notifications.length}
        />

        <main className="vs-main">
          {isSettings ? (
            <SettingsPanel
              scale={scale} onScaleChange={setScale}
              viewMode={viewMode} onViewModeChange={setViewMode}
              theme={theme} onThemeChange={setTheme}
              portainerToken={portainerToken} onPortainerTokenChange={setPortainerToken}
            />
          ) : isNotifications ? (
            <NotificationPanel
              notifications={notifications}
              onDismiss={dismissNotif}
              onClear={clearNotifs}
            />
          ) : (
            <>
              {/* Favorites section at top when viewing all */}
              {activeCategory === 'all' && favorites.length > 0 && (
                <section className="vs-section">
                  <div className="vs-section-head">
                    <span className="vs-section-icon" style={{ color: '#f9e2af' }}>★</span>
                    <span className="vs-section-title">Favoritos</span>
                    <div className="vs-section-line" />
                    <span className="vs-section-count">{favorites.length} pinned</span>
                  </div>
                  <div className={viewMode === 'compact' ? 'vs-list' : 'vs-grid'}>
                    {Object.values(categories)
                      .flatMap(c => c.items)
                      .filter(i => favorites.includes(i.name))
                      .map(item => (
                        <CardComponent
                          key={`fav-${item.name}`}
                          item={item}
                          catColor="#f9e2af"
                          isFavorite={true}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                </section>
              )}

              {visibleCategories.map(([key, cat]) => (
                <section key={key} className="vs-section">
                  <div className="vs-section-head">
                    <span className="vs-section-icon" style={{ color: getColor(key) }}>{getIcon(key)}</span>
                    <span className="vs-section-title">{cat.label}</span>
                    <div className="vs-section-line" />
                    <span className="vs-section-count">
                      {cat.items.filter(i => i.status === 'up').length}/{cat.items.length} up
                    </span>
                  </div>
                  <div className={viewMode === 'compact' ? 'vs-list' : 'vs-grid'}>
                    {cat.items.map(item => (
                      <CardComponent
                        key={item.name}
                        item={item}
                        catColor={getColor(key)}
                        isFavorite={favorites.includes(item.name)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </main>
      </div>

      {searchOpen && (
        <SearchModal
          categories={categories}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}

export default App;
