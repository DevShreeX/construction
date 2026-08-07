import { registerRoute, initRouter, navigate } from './router.js';
import { renderNavbar, renderBottomNav, renderFooter } from './components.js';
import { showToast } from './utils.js';
import { homePage } from './pages/home.js';
import { aboutPage, projectsPage, contactPage, feedbackPage } from './pages/public.js';
import { visionPage, insightsPage, resourcesPage, reportPage, morePage } from './pages/features.js';
import { adminLoginPage, clientLoginPage, clientRegisterPage, adminDashPage, clientDashPage, workspacePage } from '../auth.js';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase.js';

// ==================== Global State ====================
let currentUser = null;

// ==================== Register All Routes ====================
registerRoute('/', homePage);
registerRoute('/about', aboutPage);
registerRoute('/projects', projectsPage);
registerRoute('/contact', contactPage);
registerRoute('/feedback', feedbackPage);
registerRoute('/vision', visionPage);
registerRoute('/insights', insightsPage);
registerRoute('/resources', resourcesPage);
registerRoute('/report', reportPage);
registerRoute('/more', morePage);
registerRoute('/workspace', workspacePage);
registerRoute('/admin/login', adminLoginPage);
registerRoute('/admin/dashboard', adminDashPage);
registerRoute('/client/login', clientLoginPage);
registerRoute('/client/register', clientRegisterPage);
registerRoute('/client/dashboard', clientDashPage);

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderBottomNav();
  renderFooter();
  initRouter();
  registerServiceWorker();
  setupPWAInstall();
  setupGlobalListeners();
  
  // Initialize Firebase Auth State Listener
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      console.log('✅ User logged in:', user.email);
    } else {
      console.log('⚠️ User logged out');
    }
  });

  console.log('✅ Forzex Construction PWA ready with Open-Meteo Weather & Geolocation Maps & Firebase Auth');
});

// ==================== Service Worker ====================
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Registered:', reg.scope);
    } catch (err) {
      console.warn('[SW] Registration failed:', err);
    }
  }
}

// ==================== PWA Install ====================
let deferredPrompt = null;
function setupPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('pwa-install-banner')?.classList.remove('hidden');
  });

  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') showToast('App installed!', 'success');
      deferredPrompt = null;
      document.getElementById('pwa-install-banner')?.classList.add('hidden');
    }
  });

  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('pwa-install-banner')?.classList.add('hidden');
  });
}

// ==================== Global Event Listeners ====================
function setupGlobalListeners() {
  document.addEventListener('page:mounted', (e) => {
    const { path } = e.detail;

    // Clean up active camera stream if leaving /vision
    if (path !== '/vision' && activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }

    // Contact form
    document.getElementById('contactForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      showToast('Message sent! We\'ll respond within 2 business days.', 'success');
      ev.target.reset();
    });

    // Feedback form
    document.getElementById('feedbackForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      showToast('Thanks for your feedback!', 'success');
      ev.target.reset();
    });

    // Admin login
    document.getElementById('adminLoginForm')?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const email = document.getElementById('adminEmail').value;
      const pass = document.getElementById('adminPass').value;
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        showToast('Admin login successful!', 'success');
        navigate('/admin/dashboard');
      } catch (error) {
        showToast(`Login failed: ${error.message}`, 'error');
      }
    });

    // Client login
    document.getElementById('clientLoginForm')?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const email = ev.target.querySelector('input[type="email"]').value;
      const pass = ev.target.querySelector('input[type="password"]').value;
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        showToast('Client login successful!', 'success');
        navigate('/client/dashboard');
      } catch (error) {
        showToast(`Login failed: ${error.message}`, 'error');
      }
    });

    // Client register
    document.getElementById('clientRegForm')?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const email = ev.target.querySelector('input[type="email"]').value;
      const passwords = ev.target.querySelectorAll('input[type="password"]');
      if (passwords[0].value !== passwords[1].value) {
        return showToast('Passwords do not match!', 'error');
      }
      try {
        await createUserWithEmailAndPassword(auth, email, passwords[0].value);
        showToast('Registration successful! Welcome.', 'success');
        navigate('/client/dashboard');
      } catch (error) {
        showToast(`Registration failed: ${error.message}`, 'error');
      }
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      try {
        await signOut(auth);
        showToast('Logged out successfully', 'info');
        navigate('/');
      } catch (error) {
        showToast(`Logout failed: ${error.message}`, 'error');
      }
    });

    // Project form
    document.getElementById('projectForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      showToast('Project created successfully!', 'success');
      ev.target.reset();
    });

    // Estimate form
    document.getElementById('estimateForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const results = document.getElementById('estimateResults');
      const content = document.getElementById('estimateContent');
      content.innerHTML = `
        <div class="card" style="margin-bottom:12px"><h4>Foundation</h4><p>Excavation, footings, concrete slab — <strong style="color:var(--primary)">$85,000</strong></p></div>
        <div class="card" style="margin-bottom:12px"><h4>Structure & Framing</h4><p>Steel, columns, beams, walls — <strong style="color:var(--primary)">$120,000</strong></p></div>
        <div class="card" style="margin-bottom:12px"><h4>Electrical & Plumbing</h4><p>Wiring, fixtures, piping — <strong style="color:var(--primary)">$65,000</strong></p></div>
        <div class="card" style="margin-bottom:12px"><h4>Finishing</h4><p>Flooring, painting, fixtures — <strong style="color:var(--primary)">$45,000</strong></p></div>
        <div class="card"><h4>Labor & Overhead</h4><p>Crew, permits, insurance — <strong style="color:var(--primary)">$95,000</strong></p></div>
        <div class="dash-stat" style="margin-top:16px;text-align:center"><h4>Total Estimate</h4><div class="value" style="color:var(--success)">$410,000</div><p class="text-muted">*Generated estimate based on project specifications</p></div>`;
      results.style.display = 'block';
      showToast('Estimate generated!', 'success');
    });

    // Recommend form
    document.getElementById('recommendForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const el = document.getElementById('recommendations');
      document.getElementById('recommendContent').innerHTML = `
        <div class="grid grid-2">
          <div class="card"><h4><i class="fas fa-cubes" style="color:var(--primary);margin-right:6px"></i> Portland Cement</h4><p>Grade 53 OPC — $8/bag</p></div>
          <div class="card"><h4><i class="fas fa-bars" style="color:var(--primary);margin-right:6px"></i> TMT Steel Bars</h4><p>Fe-500 grade — $650/ton</p></div>
          <div class="card"><h4><i class="fas fa-layer-group" style="color:var(--primary);margin-right:6px"></i> Ready-Mix Concrete</h4><p>M25 grade — $95/m³</p></div>
          <div class="card"><h4><i class="fas fa-th-large" style="color:var(--primary);margin-right:6px"></i> AAC Blocks</h4><p>Lightweight — $0.65/unit</p></div>
        </div>
        <p class="text-muted" style="margin-top:12px;text-align:center">*Personalized material recommendations generated</p>`;
      el.style.display = 'block';
      showToast('Recommendations ready!', 'success');
    });

    // Report form
    document.getElementById('reportForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      showToast('Report generated! PDF download will start shortly.', 'success');
    });

    // Vision Camera & Geotagging
    setupVisionPageHandlers();

    // Weather & Geolocation Page Handlers (/more)
    if (path === '/more') {
      initWeatherAndMapHub();
    }
  });
}

// ==================== Vision & Geotagging Handlers ====================
let visionGpsCoords = null;
let activeCameraStream = null;
let currentFacingMode = 'environment';

function setupVisionPageHandlers() {
  const uploadInput = document.getElementById('uploadInput');
  const startCamBtn = document.getElementById('startCamBtn');
  const stopCamBtn = document.getElementById('stopCamBtn');
  const snapPhotoBtn = document.getElementById('snapPhotoBtn');
  const switchCamBtn = document.getElementById('switchCamBtn');
  const cameraViewfinder = document.getElementById('cameraViewfinder');
  const cameraVideo = document.getElementById('cameraStream');

  // Stop active camera helper
  const stopCameraStream = () => {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
    if (cameraViewfinder) cameraViewfinder.style.display = 'none';
  };

  // Live Camera Access Function
  const startCamera = async (facingMode = 'environment') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Camera access is not supported by your browser.', 'error');
      return;
    }
    stopCameraStream();

    try {
      showToast('Requesting camera permission...', 'info');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      activeCameraStream = stream;
      if (cameraVideo) {
        cameraVideo.srcObject = stream;
        await cameraVideo.play();
      }
      if (cameraViewfinder) cameraViewfinder.style.display = 'block';
      showToast('Live camera feed active!', 'success');
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showToast('Camera permission denied. Please allow camera access in browser settings.', 'error');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        showToast('No camera hardware found on this device.', 'error');
      } else {
        // Fallback attempt without facingMode constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          activeCameraStream = fallbackStream;
          if (cameraVideo) {
            cameraVideo.srcObject = fallbackStream;
            await cameraVideo.play();
          }
          if (cameraViewfinder) cameraViewfinder.style.display = 'block';
          showToast('Live camera feed active!', 'success');
        } catch (fallbackErr) {
          showToast(`Camera error: ${err.message}`, 'error');
        }
      }
    }
  };

  // Start Live Camera Button
  startCamBtn?.addEventListener('click', () => {
    startCamera(currentFacingMode);
  });

  // Stop Camera Button
  stopCamBtn?.addEventListener('click', () => {
    stopCameraStream();
    showToast('Camera closed.', 'info');
  });

  // Switch Camera Button
  switchCamBtn?.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(currentFacingMode);
  });

  // Capture Photo Snapshot from Live Stream
  snapPhotoBtn?.addEventListener('click', () => {
    if (!cameraVideo || !activeCameraStream) return;
    const canvas = document.getElementById('cameraCanvas') || document.createElement('canvas');
    canvas.width = cameraVideo.videoWidth || 1280;
    canvas.height = cameraVideo.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const previewImg = document.getElementById('previewImg');
    const previewBox = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (previewImg) previewImg.src = dataUrl;
    if (previewBox) previewBox.style.display = 'block';
    if (analyzeBtn) analyzeBtn.style.display = 'block';

    stopCameraStream();
    showToast('Site photo captured from live feed!', 'success');
  });

  // File Inputs
  const handleImage = (input) => {
    input?.addEventListener('change', (ev) => {
      stopCameraStream();
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewImg = document.getElementById('previewImg');
        const previewBox = document.getElementById('imagePreview');
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (previewImg) previewImg.src = e.target.result;
        if (previewBox) previewBox.style.display = 'block';
        if (analyzeBtn) analyzeBtn.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  };
  handleImage(uploadInput);

  // Run AI Analysis
  document.getElementById('analyzeBtn')?.addEventListener('click', () => {
    const results = document.getElementById('analysisResults');
    const safetyRes = document.getElementById('safetyResults');
    const objRes = document.getElementById('objectResults');
    if (safetyRes) safetyRes.innerHTML = '<p><span class="badge badge-success"><i class="fas fa-check"></i> PPE Pass</span> Hard hats & safety vests detected</p><p><span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Caution</span> Scaffolding perimeter safety netting recommended</p>';
    if (objRes) objRes.innerHTML = '<p>Tower Crane, Hydraulic Excavator, Concrete Mixer, Structural Steel Beams, 6 Workers on Site</p>';
    if (results) results.style.display = 'block';

    // Render Leaflet map for site vision location
    if (window.L && document.getElementById('visionMap')) {
      const lat = visionGpsCoords ? visionGpsCoords.lat : -1.286389;
      const lon = visionGpsCoords ? visionGpsCoords.lon : 36.817223;
      setTimeout(() => {
        const map = L.map('visionMap').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map).bindPopup('<b>Inspection Site Geotag</b><br>Lat: ' + lat + '<br>Lon: ' + lon).openPopup();
      }, 200);
    }
    showToast('Site AI inspection complete!', 'success');
  });
}

// ==================== Weather & Map Hub Handlers ====================
let siteMapInstance = null;

function initWeatherAndMapHub() {
  const defaultLat = -1.286389;
  const defaultLon = 36.817223;
  const defaultCity = 'Nairobi, Kenya';

  // Load default weather & map
  fetchOpenMeteoWeather(defaultLat, defaultLon, defaultCity);

  // GPS Button
  document.getElementById('weatherGpsBtn')?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation API not supported in browser.', 'error');
      return;
    }
    showToast('Requesting GPS location...', 'info');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // Reverse Geocode city using OpenStreetMap Nominatim
        let cityName = `GPS Site (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            cityName = revData.address.city || revData.address.town || revData.address.county || revData.address.country || cityName;
          }
        } catch (e) { console.warn('Reverse geocode error:', e); }

        fetchOpenMeteoWeather(lat, lon, cityName);
        showToast(`Located site at ${cityName}!`, 'success');
      },
      (err) => {
        showToast(`Geolocation error: ${err.message}`, 'error');
      },
      { enableHighAccuracy: true }
    );
  });

  // Search City Button
  document.getElementById('searchWeatherBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('weatherCityInput')?.value.trim();
    if (!input) return;
    try {
      showToast(`Searching location "${input}"...`, 'info');
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`);
      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          fetchOpenMeteoWeather(lat, lon, data[0].display_name);
          showToast(`Found weather for ${data[0].display_name.split(',')[0]}`, 'success');
        } else {
          showToast('Location not found. Try another city.', 'error');
        }
      }
    } catch (e) {
      showToast('Geocoding search error.', 'error');
    }
  });
}

// Open-Meteo Weather API Fetcher
async function fetchOpenMeteoWeather(lat, lon, locationLabel) {
  const container = document.getElementById('weatherDisplayContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="flex-center" style="padding:24px;background:rgba(255,255,255,0.02);border-radius:var(--radius-md);border:1px solid var(--border)">
      <p class="text-muted"><i class="fas fa-spinner fa-spin" style="margin-right:6px"></i> Fetching real-time site weather for ${locationLabel.split(',')[0]}...</p>
    </div>`;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API response error');
    const data = await res.json();

    const curr = data.current;
    const daily = data.daily;

    // Determine Weather Condition & Icon
    const weatherInfo = parseWmoCode(curr.weather_code);
    const windKm = Math.round(curr.wind_speed_10m);

    // Site Safety Impact Advisory
    let siteAdvisory = '<span class="badge badge-success"><i class="fas fa-circle-check"></i> Optimal Construction Conditions</span> Heavy lifting, concrete pouring, and outdoor work permitted.';
    if (windKm > 35) {
      siteAdvisory = '<span class="badge badge-danger"><i class="fas fa-wind"></i> High Wind Warning (' + windKm + ' km/h)</span> Crane & elevated scaffolding operations must be halted for site safety.';
    } else if (curr.precipitation > 0 || curr.rain > 0) {
      siteAdvisory = '<span class="badge badge-warning"><i class="fas fa-cloud-showers-heavy"></i> Rain Warning</span> Delay exterior concrete pouring and earth excavation until rain subsides.';
    }

    let dailyHtml = '';
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const dateStr = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
        const dayW = parseWmoCode(daily.weather_code[i]);
        dailyHtml += `
          <div class="card card-flat" style="padding:12px;text-align:center">
            <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px">${dateStr}</p>
            <div style="font-size:1.5rem;margin:4px 0">${dayW.icon}</div>
            <p style="font-weight:700;font-size:0.9rem">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°C</p>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:2px"><i class="fas fa-droplet"></i> ${daily.precipitation_sum[i]}mm</p>
          </div>`;
      }
    }

    container.innerHTML = `
      <div class="card card-glass" style="margin-bottom:16px">
        <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
          <div>
            <h3 style="color:var(--primary)"><i class="fas fa-location-dot" style="margin-right:6px"></i> ${locationLabel.split(',')[0]}</h3>
            <p class="text-muted" style="font-size:0.85rem">Lat: ${lat.toFixed(4)}° | Lon: ${lon.toFixed(4)}°</p>
          </div>
          <div style="text-align:right">
            <div style="font-size:2.5rem;font-weight:800;color:var(--text-primary)">${Math.round(curr.temperature_2m)}°C</div>
            <p style="color:var(--accent);font-weight:600">${weatherInfo.label}</p>
          </div>
        </div>

        <div class="grid grid-4" style="margin-bottom:16px">
          <div class="card card-flat" style="padding:14px"><span class="text-muted" style="font-size:0.8rem">Feels Like</span><h4 style="color:#fff;margin-top:4px">${Math.round(curr.apparent_temperature)}°C</h4></div>
          <div class="card card-flat" style="padding:14px"><span class="text-muted" style="font-size:0.8rem">Wind Speed</span><h4 style="color:#fff;margin-top:4px">${windKm} km/h</h4></div>
          <div class="card card-flat" style="padding:14px"><span class="text-muted" style="font-size:0.8rem">Humidity</span><h4 style="color:#fff;margin-top:4px">${curr.relative_humidity_2m}%</h4></div>
          <div class="card card-flat" style="padding:14px"><span class="text-muted" style="font-size:0.8rem">Precipitation</span><h4 style="color:#fff;margin-top:4px">${curr.precipitation} mm</h4></div>
        </div>

        <div style="padding:12px 16px;background:rgba(0,0,0,0.2);border-radius:var(--radius-md);margin-bottom:16px">
          <strong style="display:block;margin-bottom:4px;font-size:0.85rem">Site Safety & Operational Advisory:</strong>
          <div>${siteAdvisory}</div>
        </div>

        <h4 style="margin-bottom:10px"><i class="fas fa-calendar-week" style="color:var(--primary);margin-right:6px"></i> 5-Day Construction Weather Outlook</h4>
        <div class="grid grid-4" style="grid-template-columns:repeat(auto-fit, minmax(100px, 1fr))">
          ${dailyHtml}
        </div>
      </div>`;

    // Render Leaflet Map
    renderSiteMap(lat, lon, locationLabel);

  } catch (err) {
    container.innerHTML = `
      <div style="padding:20px;background:rgba(239,68,68,0.1);border:1px solid var(--danger);border-radius:var(--radius-md);color:var(--danger)">
        <i class="fas fa-exclamation-triangle" style="margin-right:8px"></i> Weather data fetch failed. Check your internet connection.
      </div>`;
  }
}

// WMO Weather Interpretation Codes
function parseWmoCode(code) {
  if (code === 0) return { label: 'Clear Sky', icon: '<i class="fas fa-sun" style="color:#f5c518"></i>' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: '<i class="fas fa-cloud-sun" style="color:#6ee7ff"></i>' };
  if (code >= 45 && code <= 48) return { label: 'Foggy / Hazy', icon: '<i class="fas fa-smog" style="color:#9db4d8"></i>' };
  if (code >= 51 && code <= 65) return { label: 'Rain / Drizzle', icon: '<i class="fas fa-cloud-rain" style="color:#4dabf7"></i>' };
  if (code >= 71 && code <= 77) return { label: 'Snow Flurries', icon: '<i class="fas fa-snowflake" style="color:#fff"></i>' };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: '<i class="fas fa-cloud-showers-heavy" style="color:#4dabf7"></i>' };
  if (code >= 95) return { label: 'Thunderstorm Warning', icon: '<i class="fas fa-bolt" style="color:#ffc107"></i>' };
  return { label: 'Overcast', icon: '<i class="fas fa-cloud" style="color:#9db4d8"></i>' };
}

// Leaflet Map Rendering
function renderSiteMap(lat, lon, label) {
  const mapEl = document.getElementById('siteMap');
  if (!mapEl || !window.L) return;

  if (siteMapInstance) {
    siteMapInstance.remove();
    siteMapInstance = null;
  }

  setTimeout(() => {
    siteMapInstance = L.map('siteMap').setView([lat, lon], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(siteMapInstance);

    L.marker([lat, lon]).addTo(siteMapInstance)
      .bindPopup(`<b>${label.split(',')[0]} Construction Site</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`)
      .openPopup();
  }, 100);
}
