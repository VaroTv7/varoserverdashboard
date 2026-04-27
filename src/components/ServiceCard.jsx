import React, { useState } from 'react';

const ServiceCard = ({ item, catColor, isFavorite, onToggleFavorite }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="vs-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => item.href && item.href !== '#' && window.open(item.href, '_blank')}
      style={{
        borderColor: hovered ? `${catColor}50` : undefined,
        boxShadow: hovered ? `var(--vs-shadow-hover), 0 0 0 1px ${catColor}20` : undefined,
      }}
    >
      <div className="vs-card-top">
        <div
          className="vs-card-icon"
          style={{
            background: `${catColor}${hovered ? '20' : '12'}`,
            border: `1px solid ${catColor}${hovered ? '50' : '25'}`,
            color: hovered ? catColor : `${catColor}bb`,
          }}
        >
          {item.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="vs-card-name">{item.name}</div>
          <div className="vs-card-desc">{item.desc}</div>
        </div>
        {/* Favorite star */}
        <button
          className={`vs-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.name); }}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          style={{ opacity: hovered || isFavorite ? 1 : 0 }}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <div className={`vs-dot ${item.status === 'up' ? 'ok' : item.status === 'down' ? 'down' : 'pause'}`} />
      </div>
      <div className="vs-card-bottom">
        <div
          className="vs-port-badge"
          style={{
            color: catColor,
            background: `${catColor}15`,
            border: `1px solid ${catColor}25`,
          }}
        >
          {item.port ? `:${item.port}` : 'polling'}
        </div>
        <span className="vs-card-mem">{item.mem}</span>
      </div>
    </div>
  );
};

export default ServiceCard;
