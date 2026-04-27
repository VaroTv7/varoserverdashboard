import React, { useState, useEffect, useRef } from 'react';

/**
 * SearchModal — Ctrl+K command palette para buscar servicios
 */
const SearchModal = ({ categories, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Flatten all services with their category info
  const allServices = Object.entries(categories).flatMap(([catKey, cat]) =>
    cat.items.map(item => ({ ...item, category: cat.label, catKey }))
  );

  const filtered = query.trim()
    ? allServices.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.desc.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      )
    : allServices;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      const svc = filtered[selectedIndex];
      if (svc.href && svc.href !== '#') window.open(svc.href, '_blank');
      onClose();
    }
  };

  return (
    <div className="vs-search-overlay" onClick={onClose}>
      <div className="vs-search-modal" onClick={e => e.stopPropagation()}>
        <div className="vs-search-input-row">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14" y2="14" />
          </svg>
          <input
            ref={inputRef}
            className="vs-search-input"
            type="text"
            placeholder="Buscar servicio..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="vs-kbd">ESC</kbd>
        </div>

        <div className="vs-search-results">
          {filtered.length === 0 ? (
            <div className="vs-search-empty">Sin resultados para "{query}"</div>
          ) : (
            filtered.slice(0, 12).map((svc, i) => (
              <div
                key={`${svc.catKey}-${svc.name}`}
                className={`vs-search-result ${i === selectedIndex ? 'active' : ''}`}
                onClick={() => {
                  if (svc.href && svc.href !== '#') window.open(svc.href, '_blank');
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="vs-search-result-icon">
                  {svc.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="vs-search-result-info">
                  <span className="vs-search-result-name">{svc.name}</span>
                  <span className="vs-search-result-desc">{svc.desc}</span>
                </div>
                <span className="vs-search-result-cat">{svc.category}</span>
                <div className={`vs-dot ${svc.status === 'up' ? 'ok' : 'down'}`} />
              </div>
            ))
          )}
        </div>

        <div className="vs-search-footer">
          <span><kbd>↑↓</kbd> navegar</span>
          <span><kbd>↵</kbd> abrir</span>
          <span><kbd>esc</kbd> cerrar</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
