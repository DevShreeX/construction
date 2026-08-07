// ==================== Toast Notifications ====================
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ==================== LocalStorage Helpers ====================
export function saveData(key, data) {
  try { localStorage.setItem(`forzex_${key}`, JSON.stringify(data)); }
  catch (e) { console.warn('Storage error:', e); }
}

export function loadData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(`forzex_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function removeData(key) {
  localStorage.removeItem(`forzex_${key}`);
}

// ==================== API Client ====================
const API_BASE = '/api';

export async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

export async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

function getAuthHeaders() {
  const token = loadData('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==================== Helpers ====================
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
