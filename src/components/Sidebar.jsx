import React from 'react';

// ─── Category metadata ───
const CAT_META = {
  'Media & Ocio':    { color: '#fab387', icon: '▶' },
  'Suite *arr':      { color: '#cba6f7', icon: '⬡' },
  'Custom Apps':     { color: '#f5c2e7', icon: '◇' },
  'Gaming':          { color: '#f9e2af', icon: '◈' },
  'Smart Home':      { color: '#a6e3a1', icon: '⌂' },
  'Control Center':  { color: '#89b4fa', icon: '⚙' },
  'Monitoring':      { color: '#94e2d5', icon: '◉' },
  'Productivity':    { color: '#74c7ec', icon: '▣' },
};
const getColor = (key) => CAT_META[key]?.color || '#cba6f7';
const getIcon  = (key) => CAT_META[key]?.icon  || '●';

const NavItem = ({ label, icon, color, count, active, onClick, badge }) => (
  <div
    className={`vs-nav-item ${active ? 'active' : ''}`}
    onClick={onClick}
    style={active ? { color, borderColor: `${color}30`, background: `${color}12` } : undefined}
  >
    <span className="vs-nav-icon" style={{ color: active ? color : undefined }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge > 0 && <span className="vs-nav-badge">{badge}</span>}
    {count !== undefined && <span className="vs-nav-count">{count}</span>}
  </div>
);

const Sidebar = ({ categories, activeCategory, onCategoryChange, totalServices, favCount, notifCount }) => (
  <nav className="vs-sidebar">
    <NavItem
      label="Todos los servicios"
      icon="◉"
      color="#cba6f7"
      count={totalServices}
      active={activeCategory === 'all'}
      onClick={() => onCategoryChange('all')}
    />

    {favCount > 0 && (
      <NavItem
        label="Favoritos"
        icon="★"
        color="#f9e2af"
        count={favCount}
        active={activeCategory === '__favorites'}
        onClick={() => onCategoryChange('__favorites')}
      />
    )}

    <div className="vs-divider-h" />

    {Object.entries(categories).map(([key, cat]) => (
      <NavItem
        key={key}
        label={cat.label}
        icon={getIcon(key)}
        color={getColor(key)}
        count={cat.items.length}
        active={activeCategory === key}
        onClick={() => onCategoryChange(key)}
      />
    ))}

    <div className="vs-divider-h" style={{ marginTop: 'auto' }} />

    {/* Notifications */}
    <NavItem
      label="Notificaciones"
      icon="🔔"
      color="#fab387"
      active={activeCategory === '__notifications'}
      onClick={() => onCategoryChange('__notifications')}
      badge={notifCount}
    />

    {/* Settings */}
    <NavItem
      label="Ajustes"
      icon="⚙"
      color="#6c7086"
      active={activeCategory === '__settings'}
      onClick={() => onCategoryChange('__settings')}
    />
  </nav>
);

export { getColor, getIcon };
export default Sidebar;
