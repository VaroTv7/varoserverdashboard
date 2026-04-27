import React from 'react';

/**
 * SettingsPanel v2 — Ajustes del dashboard
 * Includes: scale, view mode, theme, Portainer token, info
 */
const SettingsPanel = ({ scale, onScaleChange, viewMode, onViewModeChange, theme, onThemeChange, portainerToken, onPortainerTokenChange }) => {
  const presets = [
    { label: 'Monitor', value: 1.0 },
    { label: 'TV HD',   value: 1.5 },
    { label: 'TV 4K',   value: 2.2 },
  ];

  const themes = [
    { id: 'mocha',     label: 'Mocha',     desc: 'Oscuro — Catppuccin Mocha' },
    { id: 'macchiato', label: 'Macchiato', desc: 'Oscuro — más cálido' },
    { id: 'latte',     label: 'Latte',     desc: 'Claro — modo día' },
  ];

  return (
    <div className="vs-settings">
      <h2 className="vs-settings-title">Ajustes</h2>

      {/* ─── Visualización ─── */}
      <div className="vs-settings-section">
        <div className="vs-settings-section-title">Visualización</div>

        <div className="vs-settings-field">
          <label className="vs-settings-label">Escala de interfaz</label>
          <div className="vs-settings-desc">
            Ajusta el tamaño de todos los elementos según tu pantalla.
          </div>
          <div className="vs-preset-row">
            {presets.map(p => (
              <button
                key={p.label}
                className={`vs-preset-btn ${Math.abs(scale - p.value) < 0.05 ? 'active' : ''}`}
                onClick={() => onScaleChange(p.value)}
              >{p.label}</button>
            ))}
          </div>
          <div className="vs-settings-slider-row">
            <input type="range" min="0.8" max="3.0" step="0.1" value={scale}
              onChange={e => onScaleChange(parseFloat(e.target.value))} />
            <span className="vs-settings-slider-val">{scale.toFixed(1)}x</span>
          </div>
        </div>

        <div className="vs-settings-field">
          <label className="vs-settings-label">Vista de servicios</label>
          <div className="vs-preset-row">
            <button
              className={`vs-preset-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
            >◫ Grid</button>
            <button
              className={`vs-preset-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => onViewModeChange('compact')}
            >☰ Compacta</button>
          </div>
        </div>
      </div>

      {/* ─── Tema ─── */}
      <div className="vs-settings-section">
        <div className="vs-settings-section-title">Tema</div>
        <div className="vs-settings-field">
          <div className="vs-theme-grid">
            {themes.map(t => (
              <div
                key={t.id}
                className={`vs-theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => onThemeChange(t.id)}
              >
                <div className={`vs-theme-preview theme-${t.id}`}>
                  <div className="vs-theme-bar" />
                  <div className="vs-theme-body">
                    <div className="vs-theme-sidebar" />
                    <div className="vs-theme-content">
                      <div className="vs-theme-card" />
                      <div className="vs-theme-card" />
                    </div>
                  </div>
                </div>
                <div className="vs-theme-label">{t.label}</div>
                <div className="vs-theme-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Integraciones ─── */}
      <div className="vs-settings-section">
        <div className="vs-settings-section-title">Integraciones</div>

        <div className="vs-settings-field">
          <label className="vs-settings-label">Portainer API Token</label>
          <div className="vs-settings-desc">
            Genera un token en Portainer → Mi cuenta → Access tokens. Permite controlar contenedores desde el dashboard.
          </div>
          <input
            className="vs-settings-input"
            type="password"
            placeholder="ptlk_..."
            value={portainerToken}
            onChange={e => onPortainerTokenChange(e.target.value)}
          />
        </div>
      </div>

      {/* ─── Info ─── */}
      <div className="vs-settings-section">
        <div className="vs-settings-section-title">Información</div>
        <div className="vs-settings-field">
          <div className="vs-settings-info-row">
            <span>Versión</span><span>v0.2.0</span>
          </div>
          <div className="vs-settings-info-row">
            <span>Config</span><span>public/config/services.yaml</span>
          </div>
          <div className="vs-settings-info-row">
            <span>Motor</span><span>Vite + React</span>
          </div>
          <div className="vs-settings-info-row">
            <span>Tema</span><span>Catppuccin {theme}</span>
          </div>
          <div className="vs-settings-info-row">
            <span>Fuente</span><span>JetBrains Mono</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
