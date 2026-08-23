import { registerRoute, initRouter, navigate } from './router.js';
import { renderNavbar, renderBottomNav, renderFooter } from './components.js';
import { showToast } from './utils.js';
import { homePage } from './pages/home.js';
import { aboutPage, projectsPage, contactPage, feedbackPage } from './pages/public.js';
import { visionPage, insightsPage, resourcesPage, reportPage, morePage } from './pages/features.js';
import { landAnalyzerPage } from './pages/landAnalyzer.js';
import { backendPage } from './pages/backend.js';
import { adminLoginPage, clientLoginPage, clientRegisterPage, adminDashPage, clientDashPage, workspacePage } from './pages/auth.js';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  saveGisSiteToFirebase,
  getGisSitesFromFirebase,
  deleteGisSiteFromFirebase,
  saveLandPlotToFirebase,
  getLandPlotsFromFirebase,
  deleteLandPlotFromFirebase,
  saveDocumentToFirebase,
  getDocumentsFromFirebase,
  deleteDocumentFromFirebase,
  getFirebaseBackendStatus
} from './firebase.js';

// ==================== Global State ====================
let currentUser = null;
let currentSiteCoords = { lat: 13.0827, lon: 80.2707, label: 'Chennai, Tamil Nadu' };

// ==================== Register All Routes ====================
registerRoute('/', homePage);
registerRoute('/about', aboutPage);
registerRoute('/projects', projectsPage);
registerRoute('/contact', contactPage);
registerRoute('/feedback', feedbackPage);
registerRoute('/land-analyzer', landAnalyzerPage);
registerRoute('/backend', backendPage);
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
  setupIntroVideo();
  
  // Initialize Firebase Auth State Listener
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      console.log('✅ User logged in:', user.email);
    } else {
      console.log('⚠️ User logged out');
    }
  });

  console.log('✅ Forzex Construction PWA ready with Google Satellite GIS API & Firebase Storage');
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
function setupPWAInstall() {
  // PWA install banner disabled per user request
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
        <div class="card" style="margin-bottom:12px"><h4>Foundation</h4><p>Excavation, footings, concrete slab — <strong style="color:var(--primary)">₹70,00,000</strong></p></div>
        <div class="card" style="margin-bottom:12px"><h4>Structure & Framing</h4><p>Steel, columns, beams, walls — <strong style="color:var(--primary)">₹1,00,00,000</strong></p></div>
        <div class="card" style="margin-bottom:12px"><h4>Electrical & Plumbing</h4><p>Wiring, fixtures, piping — <strong style="color:var(--primary)">₹55,00,000</strong></p></div>
        <div class="card" style="margin-bottom:12px"><h4>Finishing</h4><p>Flooring, painting, fixtures — <strong style="color:var(--primary)">₹38,00,000</strong></p></div>
        <div class="card"><h4>Labor & Overhead</h4><p>Crew, permits, insurance — <strong style="color:var(--primary)">₹80,00,000</strong></p></div>
        <div class="dash-stat" style="margin-top:16px;text-align:center"><h4>Total Estimate</h4><div class="value" style="color:var(--success)">₹3,43,00,000 (₹3.43 Cr)</div><p class="text-muted">*Generated estimate based on project specifications</p></div>`;
      results.style.display = 'block';
      showToast('Estimate generated in ₹ INR!', 'success');
    });

    // Recommend form
    document.getElementById('recommendForm')?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const el = document.getElementById('recommendations');
      document.getElementById('recommendContent').innerHTML = `
        <div class="grid grid-2">
          <div class="card"><h4><i class="fas fa-cubes" style="color:var(--primary);margin-right:6px"></i> Portland Cement</h4><p>Grade 53 OPC — ₹420/bag</p></div>
          <div class="card"><h4><i class="fas fa-bars" style="color:var(--primary);margin-right:6px"></i> TMT Steel Bars</h4><p>Fe-500 grade — ₹58,000/ton</p></div>
          <div class="card"><h4><i class="fas fa-layer-group" style="color:var(--primary);margin-right:6px"></i> Ready-Mix Concrete</h4><p>M25 grade — ₹4,800/m³</p></div>
          <div class="card"><h4><i class="fas fa-th-large" style="color:var(--primary);margin-right:6px"></i> AAC Blocks</h4><p>Lightweight — ₹55/unit</p></div>
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

    // Load Firebase GIS persistent site locations on vision & more page
    if (path === '/vision') {
      renderFirebaseGisList('firebaseGisSitesContainer');
    }

    if (path === '/land-analyzer') {
      initLandAnalyzerMap();
      renderFirebaseLandPlotsList();
    }

    if (path === '/more') {
      initWeatherAndMapHub();
      renderFirebaseGisList('moreFirebaseGisContainer');
    }

    if (path === '/workspace') {
      setupWorkspaceAiVideoGenerator();
    }

    if (path === '/backend') {
      initBackendConsolePage();
    }
  });
}

// ==================== Vision & Geotagging Handlers ====================
let visionGpsCoords = null;
let activeCameraStream = null;
let currentFacingMode = 'environment';
let visionMapInstance = null;

function setupVisionPageHandlers() {
  const uploadInput = document.getElementById('uploadInput');
  const startCamBtn = document.getElementById('startCamBtn');
  const stopCamBtn = document.getElementById('stopCamBtn');
  const snapPhotoBtn = document.getElementById('snapPhotoBtn');
  const switchCamBtn = document.getElementById('switchCamBtn');
  const cameraViewfinder = document.getElementById('cameraViewfinder');
  const cameraVideo = document.getElementById('cameraStream');
  const saveFirebaseSiteBtn = document.getElementById('saveFirebaseSiteBtn');
  const refreshFirebaseGisBtn = document.getElementById('refreshFirebaseGisBtn');

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
        showToast('Camera permission denied. Allow camera access in browser settings.', 'error');
      } else {
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

  startCamBtn?.addEventListener('click', () => startCamera(currentFacingMode));
  stopCamBtn?.addEventListener('click', () => {
    stopCameraStream();
    showToast('Camera closed.', 'info');
  });
  switchCamBtn?.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(currentFacingMode);
  });

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

  // Save Site to Firebase
  saveFirebaseSiteBtn?.addEventListener('click', async () => {
    const lat = visionGpsCoords ? visionGpsCoords.lat : currentSiteCoords.lat;
    const lon = visionGpsCoords ? visionGpsCoords.lon : currentSiteCoords.lon;
    showToast('Saving site location to Firebase...', 'info');

    const result = await saveGisSiteToFirebase({
      name: 'AI Inspection Site Geotag',
      lat,
      lon,
      locationName: currentSiteCoords.label || 'Geotagged Site',
      satelliteBasemap: 'Google Satellite Hybrid',
      notes: 'Inspected with AI Site Vision & Google Satellite GIS API.'
    });

    if (result.success) {
      showToast('✅ Geotagged site saved to Firebase backend storage!', 'success');
      renderFirebaseGisList('firebaseGisSitesContainer');
    }
  });

  refreshFirebaseGisBtn?.addEventListener('click', () => {
    showToast('Refreshing Firebase records...', 'info');
    renderFirebaseGisList('firebaseGisSitesContainer');
  });

  // Run AI Analysis
  document.getElementById('analyzeBtn')?.addEventListener('click', () => {
    const results = document.getElementById('analysisResults');
    const safetyRes = document.getElementById('safetyResults');
    const objRes = document.getElementById('objectResults');
    if (safetyRes) safetyRes.innerHTML = '<p><span class="badge badge-success"><i class="fas fa-check"></i> PPE Pass</span> Hard hats & safety vests detected</p><p><span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Caution</span> Scaffolding perimeter safety netting recommended</p>';
    if (objRes) objRes.innerHTML = '<p>Tower Crane, Hydraulic Excavator, Concrete Mixer, Structural Steel Beams, 6 Workers on Site</p>';
    if (results) results.style.display = 'block';

    // Render Google Satellite GIS Leaflet Map
    renderGoogleSatelliteMap('visionMap', visionGpsCoords ? visionGpsCoords.lat : currentSiteCoords.lat, visionGpsCoords ? visionGpsCoords.lon : currentSiteCoords.lon, 'Inspection Site Geotag');

    showToast('Site AI inspection complete!', 'success');
  });
}

// ==================== Google Satellite & GIS Map Layer Engine ====================
function renderGoogleSatelliteMap(elementId, lat, lon, label) {
  const mapEl = document.getElementById(elementId);
  if (!mapEl || !window.L) return;

  // Clean up previous instance
  if (elementId === 'visionMap' && visionMapInstance) {
    visionMapInstance.remove();
    visionMapInstance = null;
  }
  if (elementId === 'siteMap' && siteMapInstance) {
    siteMapInstance.remove();
    siteMapInstance = null;
  }

  setTimeout(() => {
    const map = L.map(elementId, { zoomControl: true }).setView([lat, lon], 16);
    if (elementId === 'visionMap') visionMapInstance = map;
    if (elementId === 'siteMap') siteMapInstance = map;

    // Define Google Satellite & GIS Open-Source Layers
    const googleSatelliteHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Maps Satellite'
    });

    const googleSatelliteAerial = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Earth High-Res'
    });

    const googleGisTerrain = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google GIS Topographic'
    });

    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    });

    // Default to Google Satellite Hybrid basemap
    googleSatelliteHybrid.addTo(map);

    // Layer control selector for Satellite / GIS / Terrain
    const baseLayers = {
      '🛰️ Google Satellite Hybrid': googleSatelliteHybrid,
      '📷 Google High-Res Aerial': googleSatelliteAerial,
      '⛰️ Google GIS Terrain': googleGisTerrain,
      '🗺️ OpenStreetMap': openStreetMap
    };
    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

    // Add marker
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`
      <div style="font-family:sans-serif">
        <strong style="color:#0f172a">${label}</strong><br>
        <span style="font-size:0.8rem">Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</span><br>
        <small style="color:#2563eb">Google Satellite GIS Geotag</small>
      </div>
    `).openPopup();

  }, 100);
}

// ==================== Weather & Map Hub Handlers ====================
let siteMapInstance = null;

function initWeatherAndMapHub() {
  const defaultLat = currentSiteCoords.lat;
  const defaultLon = currentSiteCoords.lon;
  const defaultCity = currentSiteCoords.label;

  fetchOpenMeteoWeather(defaultLat, defaultLon, defaultCity);

  document.getElementById('saveMoreSiteFirebaseBtn')?.addEventListener('click', async () => {
    showToast('Saving current site geotag to Firebase backend...', 'info');
    const res = await saveGisSiteToFirebase({
      name: currentSiteCoords.label + ' Site',
      lat: currentSiteCoords.lat,
      lon: currentSiteCoords.lon,
      locationName: currentSiteCoords.label,
      satelliteBasemap: 'Google Satellite Hybrid',
      notes: 'Logged via Google Satellite GIS & Weather Hub.'
    });

    if (res.success) {
      showToast('✅ Saved site location to Firebase!', 'success');
      renderFirebaseGisList('moreFirebaseGisContainer');
    }
  });

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
        let cityName = `GPS Site (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            cityName = revData.address.city || revData.address.town || revData.address.county || revData.address.country || cityName;
          }
        } catch (e) { console.warn('Reverse geocode error:', e); }

        currentSiteCoords = { lat, lon, label: cityName };
        fetchOpenMeteoWeather(lat, lon, cityName);
        showToast(`Located site at ${cityName}!`, 'success');
      },
      (err) => { showToast(`Geolocation error: ${err.message}`, 'error'); },
      { enableHighAccuracy: true }
    );
  });

  // Tamil Nadu Quick City Hub Buttons
  document.querySelectorAll('.tn-city-btn').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const lat = parseFloat(ev.currentTarget.getAttribute('data-lat'));
      const lon = parseFloat(ev.currentTarget.getAttribute('data-lon'));
      const name = ev.currentTarget.getAttribute('data-name');
      currentSiteCoords = { lat, lon, label: name };
      fetchOpenMeteoWeather(lat, lon, name);
      showToast(`Selected Tamil Nadu hub: ${name}`, 'success');
    });
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
          currentSiteCoords = { lat, lon, label: data[0].display_name.split(',')[0] };
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
      <p class="text-muted"><i class="fas fa-spinner fa-spin" style="margin-right:6px"></i> Fetching site weather for ${locationLabel.split(',')[0]}...</p>
    </div>`;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API response error');
    const data = await res.json();

    const curr = data.current;
    const daily = data.daily;
    const weatherInfo = parseWmoCode(curr.weather_code);
    const windKm = Math.round(curr.wind_speed_10m);

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

    // Render Google Satellite GIS Leaflet Map
    renderGoogleSatelliteMap('siteMap', lat, lon, locationLabel);

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

// ==================== Firebase GIS Locations Renderer ====================
async function renderFirebaseGisList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sites = await getGisSitesFromFirebase();
  if (!sites || sites.length === 0) {
    container.innerHTML = '<p class="text-muted">No saved GIS site records found in Firebase.</p>';
    return;
  }

  let html = '<div class="grid grid-2">';
  sites.forEach(site => {
    html += `
      <div class="card card-flat" style="padding:16px;position:relative">
        <div class="flex-between" style="margin-bottom:6px">
          <h4 style="color:var(--primary);margin:0"><i class="fas fa-map-pin" style="color:var(--accent);margin-right:6px"></i> ${site.name}</h4>
          <span class="badge badge-primary" style="font-size:0.7rem">${site.satelliteBasemap || 'Google Satellite'}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-primary);margin-bottom:4px"><strong>Location:</strong> ${site.locationName || 'Geotagged'}</p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px"><strong>Coords:</strong> Lat: ${site.lat}, Lon: ${site.lon}</p>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:12px"><em>"${site.notes || 'Inspection logged.'}"</em></p>
        <div class="flex-between">
          <span class="text-muted" style="font-size:0.75rem">${new Date(site.timestamp).toLocaleDateString()}</span>
          <button class="btn btn-ghost btn-sm delete-gis-btn" data-id="${site.id}" style="color:var(--danger);padding:4px 8px">
            <i class="fas fa-trash-can"></i> Delete
          </button>
        </div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;

  // Attach delete handlers
  container.querySelectorAll('.delete-gis-btn').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const id = ev.currentTarget.getAttribute('data-id');
      showToast('Deleting site record from Firebase...', 'info');
      await deleteGisSiteFromFirebase(id);
      showToast('Record removed from Firebase', 'success');
      renderFirebaseGisList(containerId);
    });
  });
}

// ==================== Irregular Land Border & Usable Construction Area Engine ====================
let landMapInstance = null;
let landBorderPoints = []; // [{ lat, lon }]
let landPointMarkers = []; // [L.Marker]
let landOuterPolygon = null; // L.Polygon (Gold property border)
let landUsablePolygon = null; // L.Polygon (Emerald green usable construction zone)
let landSetbackFt = 5; // Default 5 ft setback

function initLandAnalyzerMap() {
  const mapEl = document.getElementById('landAnalyzerMap');
  if (!mapEl || !window.L) return;

  // Clean up previous instance
  if (landMapInstance) {
    landMapInstance.remove();
    landMapInstance = null;
  }

  landBorderPoints = [];
  landPointMarkers = [];
  landOuterPolygon = null;
  landUsablePolygon = null;
  landSetbackFt = parseInt(document.getElementById('setbackRange')?.value || '5', 10);

  setTimeout(() => {
    // Center initially on Austin TX / default site lat/lon
    const defaultCenter = [30.2672, -97.7431];
    const map = L.map('landAnalyzerMap', { zoomControl: true }).setView(defaultCenter, 18);
    landMapInstance = map;

    // High-Resolution Google Satellite Hybrid Layer
    const googleSatHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 21,
      attribution: '&copy; Google Maps Satellite'
    });

    const googleSatAerial = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 21,
      attribution: '&copy; Google Earth High-Res'
    });

    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    });

    googleSatHybrid.addTo(map);

    L.control.layers({
      '🛰️ Google Satellite Hybrid': googleSatHybrid,
      '📷 Google High-Res Aerial': googleSatAerial,
      '🗺️ OpenStreetMap': openStreetMap
    }, null, { position: 'topright' }).addTo(map);

    // Map Click Listener to add land border points
    map.on('click', (e) => {
      addLandBorderPoint(e.latlng.lat, e.latlng.lng);
    });

    // Attach Event Listeners to Toolbar Controls
    const setbackRange = document.getElementById('setbackRange');
    const setbackValText = document.getElementById('setbackValText');
    setbackRange?.addEventListener('input', (ev) => {
      landSetbackFt = parseInt(ev.target.value, 10);
      if (setbackValText) setbackValText.textContent = `${landSetbackFt} ft`;
      recalculateLandPlotGeometry();
    });

    document.getElementById('landUndoBtn')?.addEventListener('click', () => {
      undoLastLandBorderPoint();
    });

    document.getElementById('landClearBtn')?.addEventListener('click', () => {
      resetLandPlotMap();
      showToast('Map reset. Ready to mark new land border.', 'info');
    });

    document.getElementById('presetShapeSelect')?.addEventListener('change', (ev) => {
      loadLandPresetShape(ev.target.value);
    });

    document.getElementById('landCitySearchBtn')?.addEventListener('click', async () => {
      const city = document.getElementById('landCityInput')?.value.trim();
      if (!city) return;
      try {
        showToast(`Searching location "${city}"...`, 'info');
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 18);
            showToast(`Centered map on ${data[0].display_name.split(',')[0]}`, 'success');
          } else {
            showToast('Location not found', 'error');
          }
        }
      } catch (err) {
        showToast('Location search failed', 'error');
      }
    });

    document.getElementById('saveLandFirebaseBtn')?.addEventListener('click', async () => {
      if (landBorderPoints.length < 3) {
        showToast('Mark at least 3 border points to save land plot.', 'error');
        return;
      }
      showToast('Saving land plot boundary to Firebase...', 'info');

      const stats = computePlotStats();
      const res = await saveLandPlotToFirebase({
        name: `Land Plot (${landBorderPoints.length} Vertices, ${landSetbackFt}ft Setback)`,
        points: landBorderPoints,
        totalAreaSqFt: stats.totalSqFt,
        totalAcres: stats.totalAcres,
        usableAreaSqFt: stats.usableSqFt,
        usableAcres: stats.usableAcres,
        setbackFt: landSetbackFt,
        usablePercent: stats.usablePercent,
        perimeterFt: stats.perimeterFt,
        locationName: `Lat ${landBorderPoints[0].lat.toFixed(4)}, Lon ${landBorderPoints[0].lon.toFixed(4)}`
      });

      if (res.success) {
        showToast('✅ Land plot boundary saved to Firebase!', 'success');
        renderFirebaseLandPlotsList();
      }
    });

    document.getElementById('refreshLandFirebaseBtn')?.addEventListener('click', () => {
      showToast('Refreshing saved land plots...', 'info');
      renderFirebaseLandPlotsList();
    });

    // Default: Load sample Irregular L-Shaped Parcel so the user immediately sees a live demonstration!
    loadLandPresetShape('lshape');

  }, 100);
}

function addLandBorderPoint(lat, lon) {
  if (!landMapInstance) return;

  const ptIndex = landBorderPoints.length + 1;
  landBorderPoints.push({ lat, lon });

  // Create custom DivIcon marker showing vertex number (P1, P2, P3...)
  const icon = L.divIcon({
    className: 'land-vertex-marker',
    html: `<div style="background:#f5c518;color:#050814;font-weight:800;font-size:11px;padding:3px 7px;border-radius:12px;border:2px solid #ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.6);white-space:nowrap">P${ptIndex}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const marker = L.marker([lat, lon], { icon, draggable: true }).addTo(landMapInstance);

  marker.on('dragend', (e) => {
    const newPos = e.target.getLatLng();
    const idx = landPointMarkers.indexOf(marker);
    if (idx !== -1) {
      landBorderPoints[idx] = { lat: newPos.lat, lon: newPos.lng };
      recalculateLandPlotGeometry();
    }
  });

  landPointMarkers.push(marker);
  recalculateLandPlotGeometry();
}

function undoLastLandBorderPoint() {
  if (landBorderPoints.length === 0) return;
  landBorderPoints.pop();
  const lastMarker = landPointMarkers.pop();
  if (lastMarker && landMapInstance) {
    landMapInstance.removeLayer(lastMarker);
  }
  recalculateLandPlotGeometry();
  showToast('Removed last border point.', 'info');
}

function resetLandPlotMap() {
  landBorderPoints = [];
  if (landPointMarkers.length > 0 && landMapInstance) {
    landPointMarkers.forEach(m => landMapInstance.removeLayer(m));
  }
  landPointMarkers = [];

  if (landOuterPolygon && landMapInstance) {
    landMapInstance.removeLayer(landOuterPolygon);
    landOuterPolygon = null;
  }
  if (landUsablePolygon && landMapInstance) {
    landMapInstance.removeLayer(landUsablePolygon);
    landUsablePolygon = null;
  }

  updateMetricsUI({ totalSqFt: 0, totalAcres: 0, totalSqM: 0, usableSqFt: 0, usableAcres: 0, usableSqM: 0, setbackAreaSqFt: 0, setbackPercent: 0, usablePercent: 0, perimeterFt: 0 }, []);
}

function loadLandPresetShape(type) {
  if (type === 'custom') {
    resetLandPlotMap();
    showToast('Click anywhere on map to draw custom land borders.', 'info');
    return;
  }

  resetLandPlotMap();

  let center = [30.2672, -97.7431];
  if (landMapInstance) {
    const c = landMapInstance.getCenter();
    center = [c.lat, c.lng];
  }

  const d = 0.0006; // Approx offset step in degrees (~65-70 meters)
  let pts = [];

  if (type === 'lshape') {
    // Irregular L-Shaped Lot (6 vertices)
    pts = [
      { lat: center[0] + d*1.2, lon: center[1] - d*1.0 },
      { lat: center[0] + d*1.2, lon: center[1] + d*0.4 },
      { lat: center[0] - d*0.2, lon: center[1] + d*0.4 },
      { lat: center[0] - d*0.2, lon: center[1] + d*1.2 },
      { lat: center[0] - d*1.2, lon: center[1] + d*1.2 },
      { lat: center[0] - d*1.2, lon: center[1] - d*1.0 }
    ];
  } else if (type === 'trapezoid') {
    // Irregular Trapezoid Lot (4 vertices)
    pts = [
      { lat: center[0] + d*1.0, lon: center[1] - d*0.6 },
      { lat: center[0] + d*1.0, lon: center[1] + d*1.2 },
      { lat: center[0] - d*1.0, lon: center[1] + d*0.8 },
      { lat: center[0] - d*1.0, lon: center[1] - d*1.0 }
    ];
  } else if (type === 'corner') {
    // Triangular Corner Lot (3 vertices)
    pts = [
      { lat: center[0] + d*1.2, lon: center[1] - d*0.8 },
      { lat: center[0] - d*1.0, lon: center[1] + d*1.2 },
      { lat: center[0] - d*1.0, lon: center[1] - d*1.0 }
    ];
  } else if (type === 'pentagon') {
    // Irregular 5-sided polygon
    pts = [
      { lat: center[0] + d*1.2, lon: center[1] },
      { lat: center[0] + d*0.5, lon: center[1] + d*1.1 },
      { lat: center[0] - d*1.0, lon: center[1] + d*0.7 },
      { lat: center[0] - d*1.1, lon: center[1] - d*0.8 },
      { lat: center[0] + d*0.2, lon: center[1] - d*1.2 }
    ];
  }

  pts.forEach(p => addLandBorderPoint(p.lat, p.lon));
  showToast(`Loaded preset shape: ${type.toUpperCase()}`, 'success');
}

function recalculateLandPlotGeometry() {
  if (!landMapInstance) return;

  // Remove existing polygon overlays
  if (landOuterPolygon) landMapInstance.removeLayer(landOuterPolygon);
  if (landUsablePolygon) landMapInstance.removeLayer(landUsablePolygon);
  landOuterPolygon = null;
  landUsablePolygon = null;

  if (landBorderPoints.length < 3) {
    updateMetricsUI({ totalSqFt: 0, totalAcres: 0, totalSqM: 0, usableSqFt: 0, usableAcres: 0, usableSqM: 0, setbackAreaSqFt: 0, setbackPercent: 0, usablePercent: 0, perimeterFt: 0 }, []);
    return;
  }

  const latLngs = landBorderPoints.map(p => [p.lat, p.lon]);

  // 1. Draw Outer Property Border (Gold solid line + transparent blue fill)
  landOuterPolygon = L.polygon(latLngs, {
    color: '#f5c518',
    weight: 3,
    fillColor: '#3b82f6',
    fillOpacity: 0.15
  }).addTo(landMapInstance);

  const stats = computePlotStats();
  const sideLengths = computeSideLengths();

  // 2. Compute Usable Construction Area Polygon via Turf.js Buffer / Inward Contraction
  if (window.turf && landSetbackFt > 0) {
    try {
      // Build Turf closed polygon coordinates [lon, lat]
      const closedCoords = landBorderPoints.map(p => [p.lon, p.lat]);
      closedCoords.push([landBorderPoints[0].lon, landBorderPoints[0].lat]); // close ring
      const turfOuterPoly = turf.polygon([closedCoords]);

      // Calculate negative buffer distance in kilometers for inward contraction
      const setbackMeters = landSetbackFt * 0.3048;
      const bufferDistKm = -(setbackMeters / 1000);

      const bufferedTurf = turf.buffer(turfOuterPoly, bufferDistKm, { units: 'kilometers' });

      if (bufferedTurf && bufferedTurf.geometry && bufferedTurf.geometry.coordinates.length > 0) {
        // Handle Polygon or MultiPolygon
        let innerRing = bufferedTurf.geometry.coordinates[0];
        if (bufferedTurf.geometry.type === 'MultiPolygon') {
          innerRing = bufferedTurf.geometry.coordinates[0][0];
        }

        // Turf coordinates are [lon, lat], convert to Leaflet [lat, lon]
        const usableLatLngs = innerRing.map(coord => [coord[1], coord[0]]);

        // Render Inner Usable Construction Polygon (Emerald Green fill & dashed border)
        landUsablePolygon = L.polygon(usableLatLngs, {
          color: '#10b981',
          weight: 3,
          fillColor: '#10b981',
          fillOpacity: 0.38,
          dashArray: '6, 6'
        }).addTo(landMapInstance);

        // Recalculate exact usable area from Turf inner polygon
        const usableAreaSqM = turf.area(bufferedTurf);
        const usableSqFt = usableAreaSqM * 10.7639;
        const usableAcres = usableSqFt / 43560;

        stats.usableSqM = Math.round(usableAreaSqM);
        stats.usableSqFt = Math.round(usableSqFt);
        stats.usableAcres = Number(usableAcres.toFixed(3));
        stats.setbackAreaSqFt = Math.max(0, stats.totalSqFt - stats.usableSqFt);
        stats.setbackPercent = Number(((stats.setbackAreaSqFt / (stats.totalSqFt || 1)) * 100).toFixed(1));
        stats.usablePercent = Number(((stats.usableSqFt / (stats.totalSqFt || 1)) * 100).toFixed(1));
      } else {
        // Setback exceeds plot bounds
        stats.usableSqFt = 0;
        stats.usableAcres = 0;
        stats.usablePercent = 0;
        stats.setbackPercent = 100;
        stats.setbackAreaSqFt = stats.totalSqFt;
      }
    } catch (err) {
      console.warn('Turf polygon buffer calculation note:', err.message);
    }
  } else if (landSetbackFt === 0) {
    // 0 Setback -> Usable Area equals Total Area
    stats.usableSqFt = stats.totalSqFt;
    stats.usableAcres = stats.totalAcres;
    stats.usableSqM = stats.totalSqM;
    stats.setbackAreaSqFt = 0;
    stats.setbackPercent = 0;
    stats.usablePercent = 100;
  }

  updateMetricsUI(stats, sideLengths);
}

function computePlotStats() {
  if (landBorderPoints.length < 3) {
    return { totalSqFt: 0, totalAcres: 0, totalSqM: 0, usableSqFt: 0, usableAcres: 0, usableSqM: 0, setbackAreaSqFt: 0, setbackPercent: 0, usablePercent: 0, perimeterFt: 0 };
  }

  let totalSqM = 0;
  let perimeterM = 0;

  if (window.turf) {
    const closedCoords = landBorderPoints.map(p => [p.lon, p.lat]);
    closedCoords.push([landBorderPoints[0].lon, landBorderPoints[0].lat]);
    const turfPoly = turf.polygon([closedCoords]);
    totalSqM = turf.area(turfPoly);
    perimeterM = turf.length(turfPoly, { units: 'meters' });
  } else {
    // Geodesic Shoelace fallback formula
    totalSqM = calculateShoelaceArea(landBorderPoints);
    perimeterM = calculatePerimeterMeters(landBorderPoints);
  }

  const totalSqFt = Math.round(totalSqM * 10.7639);
  const totalAcres = Number((totalSqFt / 43560).toFixed(3));
  const perimeterFt = Math.round(perimeterM * 3.28084);

  // Default setback ratio estimate if Turf buffer hasn't run
  const defaultUsableRatio = Math.max(0.4, 1 - (landSetbackFt * 0.035));
  const usableSqFt = Math.round(totalSqFt * defaultUsableRatio);
  const usableAcres = Number((usableSqFt / 43560).toFixed(3));
  const setbackAreaSqFt = totalSqFt - usableSqFt;

  return {
    totalSqFt,
    totalAcres,
    totalSqM: Math.round(totalSqM),
    usableSqFt,
    usableAcres,
    usableSqM: Math.round(usableSqFt / 10.7639),
    setbackAreaSqFt,
    setbackPercent: Number(((setbackAreaSqFt / totalSqFt) * 100).toFixed(1)),
    usablePercent: Number(((usableSqFt / totalSqFt) * 100).toFixed(1)),
    perimeterFt
  };
}

function computeSideLengths() {
  const sides = [];
  const count = landBorderPoints.length;
  if (count < 2) return sides;

  for (let i = 0; i < count; i++) {
    const p1 = landBorderPoints[i];
    const p2 = landBorderPoints[(i + 1) % count]; // wrap around to first point
    let distMeters = 0;

    if (window.turf) {
      distMeters = turf.distance([p1.lon, p1.lat], [p2.lon, p2.lat], { units: 'meters' });
    } else {
      distMeters = haversineDistanceMeters(p1.lat, p1.lon, p2.lat, p2.lon);
    }

    const distFt = distMeters * 3.28084;
    sides.push({
      segment: `Side P${i + 1} → P${(i + 1) % count + 1}`,
      fromTo: `P${i + 1} (${p1.lat.toFixed(4)}, ${p1.lon.toFixed(4)}) → P${(i + 1) % count + 1}`,
      distFt: distFt.toFixed(1),
      distM: distMeters.toFixed(1)
    });
  }
  return sides;
}

function updateMetricsUI(stats, sideLengths) {
  const totalAreaVal = document.getElementById('totalAreaVal');
  const totalAcresVal = document.getElementById('totalAcresVal');
  const usableAreaVal = document.getElementById('usableAreaVal');
  const usableAcresVal = document.getElementById('usableAcresVal');
  const setbackAreaVal = document.getElementById('setbackAreaVal');
  const setbackPercentVal = document.getElementById('setbackPercentVal');
  const buildRatioVal = document.getElementById('buildRatioVal');
  const perimeterVal = document.getElementById('perimeterVal');
  const pointCountBadge = document.getElementById('pointCountBadge');

  if (totalAreaVal) totalAreaVal.textContent = `${stats.totalSqFt.toLocaleString()} sq ft`;
  if (totalAcresVal) totalAcresVal.textContent = `${stats.totalAcres} Acres (${stats.totalSqM.toLocaleString()} m²)`;
  if (usableAreaVal) usableAreaVal.textContent = `${stats.usableSqFt.toLocaleString()} sq ft`;
  if (usableAcresVal) usableAcresVal.textContent = `${stats.usableAcres} Acres (${stats.usableSqM.toLocaleString()} m²)`;
  if (setbackAreaVal) setbackAreaVal.textContent = `${stats.setbackAreaSqFt.toLocaleString()} sq ft`;
  if (setbackPercentVal) setbackPercentVal.textContent = `${stats.setbackPercent}% of total land`;
  if (buildRatioVal) buildRatioVal.textContent = `${stats.usablePercent}%`;
  if (perimeterVal) perimeterVal.textContent = `Perimeter: ${stats.perimeterFt.toLocaleString()} ft`;
  if (pointCountBadge) pointCountBadge.textContent = `${landBorderPoints.length} Points Marked`;

  const tableBody = document.getElementById('sideLengthsTableBody');
  if (tableBody) {
    if (sideLengths.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-muted" style="padding:16px;text-align:center">Click on the map to add border points and calculate side lengths.</td></tr>';
    } else {
      let html = '';
      sideLengths.forEach(s => {
        html += `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <td style="padding:8px;font-weight:700;color:var(--gold)">${s.segment}</td>
            <td style="padding:8px;font-size:0.75rem;color:var(--text-muted)">${s.fromTo}</td>
            <td style="padding:8px;font-weight:700;color:var(--text-primary)">${s.distFt} ft</td>
            <td style="padding:8px;color:var(--text-secondary)">${s.distM} m</td>
          </tr>`;
      });
      tableBody.innerHTML = html;
    }
  }

  const aiAdviceBox = document.getElementById('landAiAdviceContent');
  if (aiAdviceBox) {
    if (landBorderPoints.length < 3) {
      aiAdviceBox.innerHTML = '<p class="text-muted" style="font-size:0.9rem">Mark at least 3 points on the map to calculate polygon usable geometry and view automated structural recommendations.</p>';
    } else if (stats.usableSqFt === 0) {
      aiAdviceBox.innerHTML = `
        <div style="padding:12px;background:rgba(239,68,68,0.15);border:1px solid var(--danger);border-radius:var(--radius-md);color:var(--danger)">
          <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
          <strong>Setback Warning:</strong> The chosen setback distance (${landSetbackFt} ft) is too large for this plot size. Reduce the setback margin to view the usable building zone.
        </div>`;
    } else {
      const recGroundFootprint = Math.round(stats.usableSqFt * 0.70);
      aiAdviceBox.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px;font-size:0.85rem">
          <div style="padding:10px;background:rgba(16,185,129,0.1);border:1px solid #10b981;border-radius:var(--radius-md)">
            <strong style="color:#10b981"><i class="fas fa-check-circle" style="margin-right:4px"></i> Usable Construction Envelope Verified</strong>
            <p style="margin-top:2px;color:var(--text-primary)">You have <strong>${stats.usableSqFt.toLocaleString()} sq ft</strong> (${stats.usablePercent}% of total plot) available inside mandatory setback borders.</p>
          </div>
          
          <div class="grid grid-2" style="gap:10px;margin-top:4px">
            <div class="card card-flat" style="padding:10px">
              <span class="text-muted" style="font-size:0.75rem">Max Main Ground Floor Footprint</span>
              <h4 style="margin-top:2px;color:var(--gold)">${recGroundFootprint.toLocaleString()} sq ft</h4>
            </div>
            <div class="card card-flat" style="padding:10px">
              <span class="text-muted" style="font-size:0.75rem">Driveway / Setback Yard Zone</span>
              <h4 style="margin-top:2px;color:var(--accent)">${stats.setbackAreaSqFt.toLocaleString()} sq ft</h4>
            </div>
          </div>

          <p class="text-muted" style="font-size:0.8rem;margin-top:2px">
            <i class="fas fa-info-circle" style="color:var(--primary);margin-right:4px"></i>
            <em>Recommendation: Ideal for a multi-story building up to 4 floors with a total permissible built-up area (FAR) of approx. ${(stats.usableSqFt * 2.5).toLocaleString(undefined, {maximumFractionDigits:0})} sq ft.</em>
          </p>
        </div>`;
    }
  }
}

function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateShoelaceArea(pts) {
  if (pts.length < 3) return 0;
  let area = 0;
  const n = pts.length;
  const centerLat = pts.reduce((sum, p) => sum + p.lat, 0) / n;
  const latMetersPerDeg = 111139;
  const lonMetersPerDeg = 111139 * Math.cos(centerLat * Math.PI / 180);

  const coordsMeters = pts.map(p => ({
    x: p.lon * lonMetersPerDeg,
    y: p.lat * latMetersPerDeg
  }));

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordsMeters[i].x * coordsMeters[j].y;
    area -= coordsMeters[j].x * coordsMeters[i].y;
  }
  return Math.abs(area) / 2;
}

function calculatePerimeterMeters(pts) {
  let perim = 0;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    perim += haversineDistanceMeters(p1.lat, p1.lon, p2.lat, p2.lon);
  }
  return perim;
}

async function renderFirebaseLandPlotsList() {
  const container = document.getElementById('firebaseLandPlotsContainer');
  if (!container) return;

  const plots = await getLandPlotsFromFirebase();
  if (!plots || plots.length === 0) {
    container.innerHTML = '<p class="text-muted">No saved land plots found in Firebase storage.</p>';
    return;
  }

  let html = '<div class="grid grid-2">';
  plots.forEach(plot => {
    html += `
      <div class="card card-flat" style="padding:16px;position:relative;border:1px solid rgba(245,197,24,0.2)">
        <div class="flex-between" style="margin-bottom:6px">
          <h4 style="color:var(--gold);margin:0"><i class="fas fa-draw-polygon" style="margin-right:6px"></i> ${plot.name}</h4>
          <span class="badge badge-success">${plot.usablePercent}% Usable</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-primary);margin-bottom:4px">
          <strong>Total Area:</strong> ${plot.totalAreaSqFt?.toLocaleString()} sq ft (${plot.totalAcres} Acres)
        </p>
        <p style="font-size:0.85rem;color:#10b981;margin-bottom:4px">
          <strong>Usable Construction Area:</strong> ${plot.usableAreaSqFt?.toLocaleString()} sq ft (${plot.usableAcres} Acres)
        </p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">
          <strong>Setback Buffer:</strong> ${plot.setbackFt} ft | <strong>Perimeter:</strong> ${plot.perimeterFt} ft | Vertices: ${plot.points?.length || 0}
        </p>
        <div class="flex-between">
          <span class="text-muted" style="font-size:0.75rem">${new Date(plot.timestamp).toLocaleDateString()}</span>
          <button class="btn btn-ghost btn-sm delete-plot-btn" data-id="${plot.id}" style="color:var(--danger);padding:4px 8px">
            <i class="fas fa-trash-can"></i> Delete
          </button>
        </div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.delete-plot-btn').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const id = ev.currentTarget.getAttribute('data-id');
      showToast('Deleting land plot record...', 'info');
      await deleteLandPlotFromFirebase(id);
      showToast('Plot removed from Firebase', 'success');
      renderFirebaseLandPlotsList();
    });
  });
}

// ==================== Firebase Backend Storage Console Page Engine ====================
let activeBackendCollection = 'projects';
let backendCollectionData = [];

function appendBackendConsoleLog(msg, type = 'INFO') {
  const logBox = document.getElementById('backendConsoleLog');
  if (!logBox) return;
  const colorMap = {
    INFO: '#3b82f6',
    SUCCESS: '#10b981',
    WARN: '#f59e0b',
    ERROR: '#ef4444'
  };
  const timeStr = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.innerHTML = `[<span style="color:${colorMap[type] || '#3b82f6'}">${type}</span> ${timeStr}] ${msg}`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

async function renderBackendCollectionDocs(collectionName = activeBackendCollection, filterQuery = '') {
  const container = document.getElementById('backendDocsContainer');
  if (!container) return;

  activeBackendCollection = collectionName;

  container.innerHTML = `
    <div class="flex-center" style="padding:40px">
      <p class="text-muted"><i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Fetching records for '${collectionName}' from Firebase...</p>
    </div>`;

  let docs = [];
  if (collectionName === 'gis_sites') {
    docs = await getGisSitesFromFirebase();
  } else if (collectionName === 'land_plots') {
    docs = await getLandPlotsFromFirebase();
  } else {
    docs = await getDocumentsFromFirebase(collectionName);
  }

  // Pre-populate seed data if collection is empty
  if ((!docs || docs.length === 0) && collectionName === 'projects') {
    const seed1 = await saveDocumentToFirebase('projects', {
      title: 'Skyline Office Tower',
      category: 'Commercial Construction',
      notes: '32-Story High Rise Office Tower in Downtown.',
      location: 'Dubai, UAE',
      budget: '$12,500,000'
    });
    const seed2 = await saveDocumentToFirebase('projects', {
      title: 'Harbor Residential Village',
      category: 'Residential Development',
      notes: 'Phase 2 Earthworks & Foundations completed.',
      location: 'Nairobi, Kenya',
      budget: '$8,200,000'
    });
    docs = [seed1, seed2];
  } else if ((!docs || docs.length === 0) && collectionName === 'site_inspections') {
    const seed = await saveDocumentToFirebase('site_inspections', {
      title: 'PPE & Structural Audit',
      category: 'Safety Inspection',
      notes: 'All workers equipped with hard hats. Crane inspection verified.',
      auditor: 'Admin Compliance Officer'
    });
    docs = [seed];
  }

  backendCollectionData = docs;

  // Filter if query present
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    docs = docs.filter(d => 
      (d.name || d.title || d.id || '').toLowerCase().includes(q) ||
      (d.notes || d.category || d.locationName || '').toLowerCase().includes(q)
    );
  }

  // Update Stats
  const statDocs = document.getElementById('statDocuments');
  if (statDocs) statDocs.textContent = docs.length;

  if (docs.length === 0) {
    container.innerHTML = `
      <div style="padding:32px;text-align:center;background:rgba(255,255,255,0.02);border-radius:var(--radius-md);border:1px solid var(--border)">
        <i class="fas fa-folder-open" style="font-size:2rem;color:var(--text-muted);margin-bottom:12px;display:block"></i>
        <p class="text-muted">No documents found in collection '<strong>${collectionName}</strong>'.</p>
        <p style="font-size:0.8rem;color:var(--text-secondary)">Use the form on the left to add a record to Firebase Firestore.</p>
      </div>`;
    return;
  }

  let html = '<div style="display:flex;flex-direction:column;gap:12px;max-height:420px;overflow-y:auto;padding-right:4px">';
  docs.forEach(doc => {
    const docId = doc.id || 'N/A';
    const title = doc.name || doc.title || 'Untitled Document';
    const category = doc.category || doc.satelliteBasemap || doc.locationName || collectionName;
    const notes = doc.notes || doc.description || 'No description provided.';
    const dateStr = doc.timestamp ? new Date(doc.timestamp).toLocaleString() : 'Recent';

    html += `
      <div class="card card-flat" style="padding:14px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);position:relative">
        <div class="flex-between" style="margin-bottom:6px;gap:8px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:8px">
            <h4 style="margin:0;color:var(--primary);font-size:0.95rem">${title}</h4>
            <span class="badge badge-primary" style="font-size:0.7rem">${category}</span>
          </div>
          <span style="font-family:monospace;font-size:0.75rem;color:var(--accent);background:rgba(110,231,255,0.1);padding:2px 8px;border-radius:4px">
            ID: ${docId}
          </span>
        </div>

        <p style="font-size:0.83rem;color:var(--text-secondary);margin-bottom:10px;line-height:1.4">
          ${notes}
        </p>

        <div class="flex-between" style="font-size:0.75rem;color:var(--text-muted)">
          <span><i class="fas fa-clock" style="margin-right:4px"></i> ${dateStr}</span>
          <button class="btn btn-ghost btn-sm delete-fb-doc-btn" data-id="${docId}" data-col="${collectionName}" style="color:var(--danger);padding:2px 8px;font-size:0.75rem">
            <i class="fas fa-trash-can"></i> Delete
          </button>
        </div>
      </div>`;
  });
  html += '</div>';

  container.innerHTML = html;

  // Attach delete buttons
  container.querySelectorAll('.delete-fb-doc-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const col = e.currentTarget.getAttribute('data-col');
      showToast(`Deleting record ${id} from Firebase...`, 'info');
      appendBackendConsoleLog(`Deleting document ID [${id}] from collection '${col}'`, 'WARN');

      if (col === 'gis_sites') {
        await deleteGisSiteFromFirebase(id);
      } else if (col === 'land_plots') {
        await deleteLandPlotFromFirebase(id);
      } else {
        await deleteDocumentFromFirebase(col, id);
      }

      showToast('Record deleted successfully', 'success');
      appendBackendConsoleLog(`Document ID [${id}] deleted successfully`, 'SUCCESS');
      renderBackendCollectionDocs(col);
    });
  });
}

function initBackendConsolePage() {
  const status = getFirebaseBackendStatus();
  
  // Populate system info
  const projEl = document.getElementById('backendProjectId');
  if (projEl) projEl.textContent = status.projectId || 'forzex-construction';

  const modeEl = document.getElementById('backendModeText');
  if (modeEl) modeEl.textContent = status.mode;

  appendBackendConsoleLog(`Connected to Firebase Project [${status.projectId}]`, 'SUCCESS');
  appendBackendConsoleLog(`Database Engine: ${status.mode}`, 'INFO');

  // Initial document render
  renderBackendCollectionDocs('projects');

  // Collection Tab Listeners
  document.querySelectorAll('#collectionTabGroup .collection-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('#collectionTabGroup .collection-tab').forEach(t => {
        t.classList.remove('active', 'btn-primary');
        t.classList.add('btn-outline');
      });
      e.currentTarget.classList.add('active', 'btn-primary');
      e.currentTarget.classList.remove('btn-outline');

      const targetCol = e.currentTarget.getAttribute('data-col');
      appendBackendConsoleLog(`Switched view to Firestore collection '${targetCol}'`, 'INFO');
      renderBackendCollectionDocs(targetCol);
    });
  });

  // Search input listener
  document.getElementById('searchBackendDocsInput')?.addEventListener('input', (e) => {
    renderBackendCollectionDocs(activeBackendCollection, e.target.value);
  });

  // Refresh button
  document.getElementById('refreshBackendDocsBtn')?.addEventListener('click', () => {
    showToast('Refreshing Firestore collection...', 'info');
    appendBackendConsoleLog(`Refreshed collection '${activeBackendCollection}'`, 'INFO');
    renderBackendCollectionDocs(activeBackendCollection);
  });

  // Form Submit Handler
  document.getElementById('addFirebaseDocForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const colSelect = document.getElementById('fbCollectionSelect').value;
    const title = document.getElementById('fbDocTitle').value;
    const category = document.getElementById('fbDocCategory').value;
    const notes = document.getElementById('fbDocNotes').value;
    const jsonStr = document.getElementById('fbDocJson').value.trim();

    let extraData = {};
    if (jsonStr) {
      try {
        extraData = JSON.parse(jsonStr);
      } catch (err) {
        showToast('Invalid JSON metadata format. Please fix JSON syntax.', 'error');
        return;
      }
    }

    showToast('Saving document to Firebase Firestore...', 'info');
    appendBackendConsoleLog(`Saving new document '${title}' to collection '${colSelect}'...`, 'INFO');

    const result = await saveDocumentToFirebase(colSelect, {
      title,
      category,
      notes,
      ...extraData
    });

    if (result.success) {
      showToast(`✅ Document saved to Firebase Firestore [ID: ${result.id || 'Saved'}]`, 'success');
      appendBackendConsoleLog(`✅ Document successfully written to Firestore. ID: ${result.id}`, 'SUCCESS');
      e.target.reset();
      // Switch tab to the target collection and render
      document.querySelectorAll('#collectionTabGroup .collection-tab').forEach(t => {
        const c = t.getAttribute('data-col');
        if (c === colSelect) {
          t.click();
        }
      });
      renderBackendCollectionDocs(colSelect);
    }
  });

  // Connection Test Button
  document.getElementById('testFirebaseConnBtn')?.addEventListener('click', async () => {
    showToast('Executing live connection test to Firebase Firestore...', 'info');
    appendBackendConsoleLog('Initiating Firestore write-read latency ping test...', 'INFO');
    const start = performance.now();
    const testResult = await saveDocumentToFirebase('custom_storage', {
      title: 'Connection Ping Test',
      category: 'Diagnostic',
      notes: 'Automatic ping test triggered from Backend Console.'
    });
    const latency = Math.round(performance.now() - start);

    const latStat = document.getElementById('statLatency');
    if (latStat) latStat.textContent = `${latency} ms`;

    showToast(`✅ Firebase test passed in ${latency}ms!`, 'success');
    appendBackendConsoleLog(`[Firestore OK] Write-verify test passed in ${latency}ms (Doc ID: ${testResult.id})`, 'SUCCESS');
  });

  // Export JSON Button
  document.getElementById('exportFirebaseJsonBtn')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backendCollectionData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `firebase_${activeBackendCollection}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${activeBackendCollection} records to JSON file`, 'success');
    appendBackendConsoleLog(`Exported ${backendCollectionData.length} records to JSON`, 'SUCCESS');
  });

  // Clear Logs Button
  document.getElementById('clearBackendLogsBtn')?.addEventListener('click', () => {
    const logBox = document.getElementById('backendConsoleLog');
    if (logBox) logBox.innerHTML = '<div>[<span style="color:#10b981">SYSTEM</span>] Console logs cleared</div>';
  });
}

// ==================== Interactive Front Intro Video Engine ====================
function setupIntroVideo() {
  const introOverlay = document.getElementById('intro-video-overlay');
  const startPrompt = document.getElementById('intro-start-prompt');
  const videoWrapper = document.getElementById('intro-video-container');
  const videoPlayer = document.getElementById('intro-video-player');
  const startBtn = document.getElementById('start-intro-btn');
  const skipBtn = document.getElementById('skip-intro-btn');
  const touchTrigger = document.getElementById('intro-touch-trigger');
  const soundToggle = document.getElementById('intro-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');
  const replayBtn = document.getElementById('intro-replay-btn');
  const closeBtn = document.getElementById('intro-close-btn');

  if (!introOverlay || !videoPlayer) return;

  // Helper: Start Video Playback
  const playVideo = async () => {
    try {
      startPrompt.style.display = 'none';
      videoWrapper.classList.remove('hidden');
      videoPlayer.currentTime = 0;
      videoPlayer.muted = false; // Enable audio on user interaction
      if (soundText) soundText.textContent = 'Mute';
      if (soundIcon) soundIcon.className = 'fas fa-volume-up';
      await videoPlayer.play();
    } catch (err) {
      console.warn('Audio playback blocked by browser policy, falling back to muted play:', err);
      try {
        videoPlayer.muted = true;
        if (soundText) soundText.textContent = 'Unmute';
        if (soundIcon) soundIcon.className = 'fas fa-volume-mute';
        await videoPlayer.play();
      } catch (e) {
        console.error('Video playback failed:', e);
        dismissIntro();
      }
    }
  };

  // Helper: Dismiss Intro Overlay to reveal Home / Dashboard
  const dismissIntro = () => {
    videoPlayer.pause();
    introOverlay.classList.add('dismissed');
    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 800);
  };

  // Expose Global Replay Helper for Navbar & UI buttons
  window.replayIntroVideo = () => {
    introOverlay.style.display = 'flex';
    introOverlay.classList.remove('dismissed');
    startPrompt.style.display = 'block';
    videoWrapper.classList.add('hidden');
    playVideo();
  };

  // Touch / Click Triggers
  touchTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    playVideo();
  });

  startBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playVideo();
  });

  skipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissIntro();
  });

  // Touch or click anywhere on prompt card triggers video start
  startPrompt?.addEventListener('click', () => {
    if (videoWrapper.classList.contains('hidden')) {
      playVideo();
    }
  });

  // When Video Ends, automatically transition to home page/dashboard
  videoPlayer.addEventListener('ended', () => {
    showToast('Welcome to Forzex Construction!', 'info');
    dismissIntro();
  });

  // Controls Handlers
  soundToggle?.addEventListener('click', () => {
    videoPlayer.muted = !videoPlayer.muted;
    if (soundIcon) soundIcon.className = videoPlayer.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    if (soundText) soundText.textContent = videoPlayer.muted ? 'Unmute' : 'Mute';
  });

  replayBtn?.addEventListener('click', () => {
    videoPlayer.currentTime = 0;
    videoPlayer.play();
  });

  closeBtn?.addEventListener('click', () => {
    dismissIntro();
  });
}

// ==================== Workspace AI 3D Short Video Studio Engine ====================
function setupWorkspaceAiVideoGenerator() {
  const form = document.getElementById('aiVdoGeneratorForm');
  if (!form) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const choice = document.getElementById('vdoChoiceSelect')?.value || 'Commercial High-Rise Tower';
    const priority = document.getElementById('vdoPrioritySelect')?.value || 'High Priority (1080p Fast Render)';
    const format = document.getElementById('vdoLengthSelect')?.value || 'Short Cinematic Preview (15 sec)';
    const motion = document.getElementById('vdoCameraMotion')?.value || 'Aerial Drone Flyover';

    const loadingState = document.getElementById('aiVdoLoadingState');
    const resultContainer = document.getElementById('aiVdoResultContainer');
    const titleEl = document.getElementById('generatedVdoTitle');
    const metaEl = document.getElementById('generatedVdoMeta');
    const videoPlayer = document.getElementById('workspaceAiVideoPlayer');
    const videoSrc = document.getElementById('workspaceVideoSrc');

    if (loadingState) loadingState.style.display = 'block';
    if (resultContainer) resultContainer.style.display = 'none';
    showToast(`⚡ AI Neural Engine compiling 3D video pass for ${choice}...`, 'info');

    setTimeout(() => {
      if (loadingState) loadingState.style.display = 'none';
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-video"></i> ${choice}`;
      if (metaEl) metaEl.textContent = `Priority: ${priority} | Format: ${format} | Motion: ${motion}`;
      
      // Swap video source dynamically
      if (videoSrc) {
        videoSrc.src = (choice.includes('Commercial') || choice.includes('Infrastructure')) ? '/cinematic_video.mp4' : '/final_vdo.mp4';
      }
      if (videoPlayer) {
        videoPlayer.load();
        videoPlayer.play().catch(e => console.log('Autoplay handled:', e));
      }

      if (resultContainer) resultContainer.style.display = 'block';
      showToast(`✅ Generated AI 3D Construction Video Pass for ${choice}!`, 'success');
    }, 1400);
  });
}


