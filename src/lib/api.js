/**
 * API integrations for VaroDashboard
 * 
 * Connects to real services on your homelab network.
 * Falls back to simulated data when services are unreachable.
 * 
 * Configure your server IP below or via the Settings panel.
 */

const SERVER_IP = window.location.hostname || 'localhost';

const ENDPOINTS = {
  uptimeKuma: `http://${SERVER_IP}:3001`,
  glances:    `http://${SERVER_IP}:61208`,
  portainer:  `http://${SERVER_IP}:9000`,
};

/**
 * Fetch with timeout and graceful fallback
 */
async function safeFetch(url, options = {}, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

// ─── Uptime Kuma ───
export async function fetchUptimeStatus() {
  const data = await safeFetch(`${ENDPOINTS.uptimeKuma}/api/status-page/default`);
  if (!data) return null;

  const statusMap = {};
  if (data.publicGroupList) {
    data.publicGroupList.forEach(group => {
      group.monitorList?.forEach(monitor => {
        statusMap[monitor.name] = monitor.status === 1 ? 'up' : monitor.status === 0 ? 'down' : 'pending';
      });
    });
  }
  return statusMap;
}

// ─── Glances ───
export async function fetchSystemStats() {
  const [cpu, mem, disk] = await Promise.all([
    safeFetch(`${ENDPOINTS.glances}/api/4/cpu`),
    safeFetch(`${ENDPOINTS.glances}/api/4/mem`),
    safeFetch(`${ENDPOINTS.glances}/api/4/fs`),
  ]);

  if (!cpu && !mem) return null;

  const disks = Array.isArray(disk) ? disk : [];

  return {
    cpu: cpu?.total ?? 0,
    ram: mem ? (mem.used / mem.total) * 100 : 0,
    nas: disks.find(d => d.mnt_point?.includes('nas'))?.percent ?? 0,
    media: disks.find(d => d.mnt_point?.includes('media'))?.percent ?? 0,
    ramUsed: mem ? `${(mem.used / 1024 / 1024 / 1024).toFixed(1)}GB` : '—',
    ramTotal: mem ? `${(mem.total / 1024 / 1024 / 1024).toFixed(0)}GB` : '—',
  };
}

// ─── Portainer ───
export async function fetchContainers(apiToken) {
  if (!apiToken) return null;

  const endpoints = await safeFetch(`${ENDPOINTS.portainer}/api/endpoints`, {
    headers: { 'X-API-Key': apiToken }
  });
  if (!endpoints || endpoints.length === 0) return null;

  const endpointId = endpoints[0].Id;
  const containers = await safeFetch(
    `${ENDPOINTS.portainer}/api/endpoints/${endpointId}/docker/containers/json?all=true`,
    { headers: { 'X-API-Key': apiToken } }
  );

  if (!containers) return null;

  return containers.map(c => ({
    id: c.Id,
    name: c.Names?.[0]?.replace('/', '') || 'unknown',
    state: c.State,
    status: c.Status,
    image: c.Image,
  }));
}

export async function restartContainer(apiToken, containerId) {
  if (!apiToken) return false;
  const endpoints = await safeFetch(`${ENDPOINTS.portainer}/api/endpoints`, {
    headers: { 'X-API-Key': apiToken }
  });
  if (!endpoints || endpoints.length === 0) return false;

  const endpointId = endpoints[0].Id;
  const res = await safeFetch(
    `${ENDPOINTS.portainer}/api/endpoints/${endpointId}/docker/containers/${containerId}/restart`,
    { method: 'POST', headers: { 'X-API-Key': apiToken } },
    10000
  );
  return res !== null;
}

// ─── Simulated fallback data ───
export function simulateStats(prev) {
  return {
    cpu: Math.max(15, Math.min(90, (prev?.cpu ?? 45) + (Math.random() - 0.5) * 6)),
    ram: Math.max(35, Math.min(80, (prev?.ram ?? 52) + (Math.random() - 0.5) * 2)),
    nas: prev?.nas ?? 38,
    media: prev?.media ?? 65,
    ramUsed: prev?.ramUsed ?? '—',
    ramTotal: prev?.ramTotal ?? '—',
  };
}
