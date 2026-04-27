import React from 'react';

/**
 * NotificationPanel — Panel de alertas del sistema
 */
const NotificationPanel = ({ notifications, onDismiss, onClear }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="vs-settings">
        <h2 className="vs-settings-title">Notificaciones</h2>
        <div className="vs-notif-empty">
          <div className="vs-notif-empty-icon">✓</div>
          <div className="vs-notif-empty-text">Sin alertas pendientes</div>
          <div className="vs-notif-empty-sub">Todos los sistemas funcionan con normalidad</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vs-settings">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--vs-sp-6)' }}>
        <h2 className="vs-settings-title" style={{ marginBottom: 0, flex: 1 }}>
          Notificaciones
          <span className="vs-notif-badge">{notifications.length}</span>
        </h2>
        <button className="vs-preset-btn" onClick={onClear} style={{ flex: 'none', padding: 'var(--vs-sp-1) var(--vs-sp-3)' }}>
          Limpiar todo
        </button>
      </div>

      <div className="vs-notif-list">
        {notifications.map(n => (
          <div key={n.id} className={`vs-notif-item vs-notif-${n.type}`}>
            <div className="vs-notif-icon">
              {n.type === 'error' ? '✕' : n.type === 'warn' ? '⚠' : 'ℹ'}
            </div>
            <div className="vs-notif-content">
              <div className="vs-notif-title">{n.title}</div>
              <div className="vs-notif-text">{n.message}</div>
              <div className="vs-notif-time">{n.time}</div>
            </div>
            <button className="vs-notif-dismiss" onClick={() => onDismiss(n.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
