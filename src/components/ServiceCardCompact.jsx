import React from 'react';

/**
 * ServiceCardCompact — Vista lista compacta
 */
const ServiceCardCompact = ({ item, catColor }) => (
  <div
    className="vs-card-compact"
    onClick={() => item.href && item.href !== '#' && window.open(item.href, '_blank')}
  >
    <div
      className="vs-card-compact-icon"
      style={{ background: `${catColor}12`, border: `1px solid ${catColor}25`, color: `${catColor}bb` }}
    >
      {item.name.slice(0, 2).toUpperCase()}
    </div>
    <span className="vs-card-compact-name">{item.name}</span>
    <span className="vs-card-compact-desc">{item.desc}</span>
    <span className="vs-card-compact-port" style={{ color: catColor, borderColor: `${catColor}25`, background: `${catColor}10` }}>
      {item.port ? `:${item.port}` : '—'}
    </span>
    <div className={`vs-dot ${item.status === 'up' ? 'ok' : 'down'}`} />
  </div>
);

export default ServiceCardCompact;
