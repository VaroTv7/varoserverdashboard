<p align="center">
  <img src="public/varoserver-logo.svg" alt="VaroDashboard" width="120" />
</p>

<h1 align="center">VaroDashboard</h1>

<p align="center">
  A premium, self-hosted homelab dashboard with Catppuccin aesthetics and adaptive TV/Monitor/Mobile scaling.
  <br />
  Drop-in replacement for <a href="https://github.com/gethomepage/homepage">Homepage</a> — reads the same <code>services.yaml</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Catppuccin-Mocha-cba6f7?style=flat-square" alt="Catppuccin" />
  <img src="https://img.shields.io/badge/Vite-React-61dafb?style=flat-square&logo=react" alt="Vite + React" />
  <img src="https://img.shields.io/badge/Font-JetBrains%20Mono-brightgreen?style=flat-square" alt="JetBrains Mono" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT" />
  <img src="https://img.shields.io/badge/version-v0.2.0-cba6f7?style=flat-square" alt="v0.2.0" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Catppuccin Themes** | Mocha (dark), Macchiato (warm dark), Latte (light) |
| 📺 **TV Scaling** | Monitor / TV HD / TV 4K presets + fine slider (0.8x–3.0x) |
| 🔍 **Quick Search** | `Ctrl+K` command palette with keyboard navigation |
| 📋 **Homepage Compatible** | Reads the same `services.yaml` — zero migration |
| ⚡ **Ultra-light** | Vite + React, ~150KB bundle, <300ms load |
| ★ **Favorites** | Pin important services to the top |
| 🔔 **Notifications** | Alerts when a service goes down (via Uptime Kuma) |
| 📊 **Live Metrics** | CPU/RAM/Disk via Glances API, with simulated fallback |
| 🐳 **Docker Controls** | Portainer API integration for container management |
| ☰ **Compact View** | Toggle between grid and list layouts |
| 💾 **Persistence** | Category, scale, theme, favorites saved to localStorage |

## 🚀 Quick Start

### Development

```bash
git clone https://github.com/VaroTv7/varoserverdashboard.git
cd varoserverdashboard
npm install
npm run dev
# Open http://localhost:5173/
```

### Docker (recommended for production)

```bash
git clone https://github.com/VaroTv7/varoserverdashboard.git
cd varoserverdashboard
docker compose up -d --build
# Dashboard runs on port 3080
```

### Ubuntu Server + Nginx

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Clone and build
cd /opt
sudo git clone https://github.com/VaroTv7/varoserverdashboard.git
cd varoserverdashboard
sudo npm ci && sudo npm run build

# Serve with Nginx
sudo cp nginx.conf /etc/nginx/sites-available/dashboard
sudo ln -sf /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 📋 Configuration

Edit `public/config/services.yaml` using the same syntax as [Homepage](https://github.com/gethomepage/homepage):

```yaml
- Media:
    - Jellyfin:
        icon: sh-jellyfin.svg
        href: http://your-server:8096
        description: Movies & TV Shows

- Infrastructure:
    - Portainer:
        icon: sh-portainer.svg
        href: http://your-server:9000
        description: Docker Management
```

Save and refresh the browser. **No rebuild needed in dev mode.**
For production, run `npm run build` after editing.

## 🔌 Integrations

VaroDashboard auto-detects services on the same host:

| Service | What it provides | Default port |
|---------|-----------------|--------------|
| **Uptime Kuma** | Real service status (up/down) | 3001 |
| **Glances** | Live CPU/RAM/Disk metrics | 61208 |
| **Portainer** | Container control (restart/stop) | 9000 |

If a service isn't reachable, the dashboard gracefully falls back to simulated data (indicated by "SIM" in the header).

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open quick search |
| `↑ ↓` | Navigate search results |
| `Enter` | Open selected service |
| `Escape` | Close search / modal |

---

## 🎨 Design System

### Colors — Catppuccin

| Role | Mocha | Macchiato | Latte |
|------|-------|-----------|-------|
| Background | `#1e1e2e` | `#24273a` | `#eff1f5` |
| Primary | `#cba6f7` | `#c6a0f6` | `#8839ef` |
| Accent | `#89b4fa` | `#8aadf4` | `#1e66f5` |
| Success | `#a6e3a1` | `#a6da95` | `#40a02b` |
| Warning | `#fab387` | `#f5a97f` | `#fe640b` |
| Error | `#f38ba8` | `#ed8796` | `#d20f39` |

### Typography

All UI uses **JetBrains Mono** (300–700 weight). Base size: `13px × scale factor`.

### Scaling System

All dimensions use `calc(Xpx * var(--vs-scale))`. The `--vs-scale` CSS variable is set on `:root` via JavaScript, enabling real-time scaling of fonts, spacing, icons, and cards simultaneously.

---

## 📁 Project Structure

```
varoserverdashboard/
├── public/
│   ├── config/
│   │   └── services.yaml          ← Your service config (edit here)
│   └── varoserver-logo.svg         ← Constellation V logo
├── src/
│   ├── components/
│   │   ├── Header.jsx              ← Top bar (stats, clock, search)
│   │   ├── Sidebar.jsx             ← Category navigation + favorites
│   │   ├── ServiceCard.jsx         ← Service card (grid view)
│   │   ├── ServiceCardCompact.jsx  ← Service card (compact list view)
│   │   ├── SearchModal.jsx         ← Command palette (Ctrl+K)
│   │   ├── NotificationPanel.jsx   ← Alert panel
│   │   └── SettingsPanel.jsx       ← Settings (scale, view, theme, APIs)
│   ├── lib/
│   │   └── api.js                  ← API integrations (Uptime Kuma, Glances, Portainer)
│   ├── index.css                   ← Design system + themes
│   ├── App.jsx                     ← Main orchestrator
│   └── main.jsx                    ← Entry point
├── Dockerfile                       ← Multi-stage build (Node → Nginx)
├── docker-compose.yml               ← Production deployment
├── nginx.conf                       ← SPA routing config
└── package.json
```

## 📜 License

MIT — [VaroTv7](https://github.com/VaroTv7)
