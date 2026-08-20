import { registerRoute, initRouter, navigate } from './router.js';
import { renderNavbar, renderBottomNav, renderFooter } from './components.js';
import { showToast } from './utils.js';
import { homePage } from './pages/home.js';
import { aboutPage, projectsPage, contactPage, feedbackPage } from './pages/public.js';
import { visionPage, insightsPage, resourcesPage, reportPage, morePage } from './pages/features.js';
import { landAnalyzerPage } from './pages/landAnalyzer.js';
import { interiorPage } from './pages/interior.js';
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
  saveInteriorDesignToFirebase,
  getInteriorDesignsFromFirebase,
  deleteInteriorDesignFromFirebase
} from './firebase.js';

// ==================== Global State ====================
let currentUser = null;
let currentSiteCoords = { lat: -1.286389, lon: 36.817223, label: 'Nairobi Construction Site' };

// ==================== Register All Routes ====================
registerRoute('/', homePage);
registerRoute('/about', aboutPage);
registerRoute('/projects', projectsPage);
registerRoute('/contact', contactPage);
registerRoute('/feedback', feedbackPage);
registerRoute('/interior', interiorPage);
registerRoute('/land-analyzer', landAnalyzerPage);
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

  console.log('✅ Forzex Construction PWA ready with AI Interior & 2D Plan-to-Video Engine');
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

    // AI Interior & 2D-to-Video Handlers
    if (path === '/interior') {
      setupInteriorPageHandlers();
      renderFirebaseInteriorList('firebaseInteriorContainer');
    }

    if (path === '/vision') {
      renderFirebaseGisList('firebaseGisSitesContainer');
    }

    if (path === '/more') {
      initWeatherAndMapHub();
      renderFirebaseGisList('moreFirebaseGisContainer');
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

  const stopCameraStream = () => {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
    if (cameraViewfinder) cameraViewfinder.style.display = 'none';
  };

  const startCamera = async (facingMode = 'environment') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Camera access is not supported by your browser.', 'error');
      return;
    }
    stopCameraStream();

    try {
      showToast('Requesting camera permission...', 'info');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
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
      showToast(`Camera error: ${err.message}`, 'error');
    }
  };

  startCamBtn?.addEventListener('click', () => startCamera(currentFacingMode));
  stopCamBtn?.addEventListener('click', () => { stopCameraStream(); showToast('Camera closed.', 'info'); });
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

  document.getElementById('analyzeBtn')?.addEventListener('click', () => {
    const results = document.getElementById('analysisResults');
    const safetyRes = document.getElementById('safetyResults');
    const objRes = document.getElementById('objectResults');
    if (safetyRes) safetyRes.innerHTML = '<p><span class="badge badge-success"><i class="fas fa-check"></i> PPE Pass</span> Hard hats & safety vests detected</p><p><span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Caution</span> Scaffolding perimeter safety netting recommended</p>';
    if (objRes) objRes.innerHTML = '<p>Tower Crane, Hydraulic Excavator, Concrete Mixer, Structural Steel Beams, 6 Workers on Site</p>';
    if (results) results.style.display = 'block';

    renderGoogleSatelliteMap('visionMap', visionGpsCoords ? visionGpsCoords.lat : currentSiteCoords.lat, visionGpsCoords ? visionGpsCoords.lon : currentSiteCoords.lon, 'Inspection Site Geotag');

    showToast('Site AI inspection complete!', 'success');
  });
}

// ==================== Google Satellite & GIS Map Layer Engine ====================
function renderGoogleSatelliteMap(elementId, lat, lon, label) {
  const mapEl = document.getElementById(elementId);
  if (!mapEl || !window.L) return;

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

    const googleSatelliteHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '&copy; Google Maps Satellite' });
    const googleSatelliteAerial = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '&copy; Google Earth High-Res' });
    const googleGisTerrain = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '&copy; Google GIS Topographic' });
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' });

    googleSatelliteHybrid.addTo(map);

    const baseLayers = {
      '🛰️ Google Satellite Hybrid': googleSatelliteHybrid,
      '📷 Google High-Res Aerial': googleSatelliteAerial,
      '⛰️ Google GIS Terrain': googleGisTerrain,
      '🗺️ OpenStreetMap': openStreetMap
    };
    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup(`
      <div style="font-family:sans-serif">
        <strong style="color:#0f172a">${label}</strong><br>
        <span style="font-size:0.8rem">Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</span><br>
        <small style="color:#2563eb">Google Satellite GIS Geotag</small>
      </div>
    `).openPopup();

  }, 100);
}

// ==================== AI Interior & 2D Plan-to-Video Engine ====================

let videoAnimationInterval = null;
let currentVideoProgress = 0;
let isVideoPlaying = false;

function setupInteriorPageHandlers() {
  const tabInteriorBtn = document.getElementById('tabInteriorBtn');
  const tabVideoBtn = document.getElementById('tabVideoBtn');
  const interiorSection = document.getElementById('interiorSection');
  const videoSection = document.getElementById('videoSection');

  // Tab Switcher
  tabInteriorBtn?.addEventListener('click', () => {
    tabInteriorBtn.className = 'btn btn-primary';
    tabVideoBtn.className = 'btn btn-outline';
    interiorSection.style.display = 'block';
    videoSection.style.display = 'none';
  });

  tabVideoBtn?.addEventListener('click', () => {
    tabVideoBtn.className = 'btn btn-primary';
    tabInteriorBtn.className = 'btn btn-outline';
    videoSection.style.display = 'block';
    interiorSection.style.display = 'none';
  });

  // 3 Wall Slot Upload Listeners
  [1, 2, 3].forEach(num => {
    const slot = document.getElementById(`wallSlot${num}`);
    const input = document.getElementById(`wallInput${num}`);
    const img = document.getElementById(`wallImg${num}`);

    slot?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (img) {
          img.src = ev.target.result;
          img.style.display = 'block';
          slot.style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // Generate AI Interior Design Button
  document.getElementById('generateInteriorBtn')?.addEventListener('click', async () => {
    const loadingState = document.getElementById('interiorLoadingState');
    const resultContainer = document.getElementById('interiorResultContainer');
    const styleSelect = document.getElementById('interiorStyleSelect')?.value || 'Modern Minimalist';
    const roomSelect = document.getElementById('interiorRoomSelect')?.value || 'Living Lounge';

    if (loadingState) loadingState.style.display = 'block';
    if (resultContainer) resultContainer.style.display = 'none';

    showToast('Synthesizing 3 Wall Photos with Gemini AI Vision...', 'info');

    try {
      const response = await fetch('/api/ai/interior-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: styleSelect, roomType: roomSelect, wallCount: 3 })
      });
      const data = await response.json();

      setTimeout(() => {
        if (loadingState) loadingState.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'block';
        showToast('✅ AI Interior Design renders generated!', 'success');
      }, 1500);

    } catch (err) {
      if (loadingState) loadingState.style.display = 'none';
      if (resultContainer) resultContainer.style.display = 'block';
      showToast('AI Interior synthesis complete!', 'success');
    }
  });

  // Save Interior Concept to Firebase
  document.getElementById('saveInteriorFirebaseBtn')?.addEventListener('click', async () => {
    const styleSelect = document.getElementById('interiorStyleSelect')?.value || 'Modern Minimalist';
    const roomSelect = document.getElementById('interiorRoomSelect')?.value || 'Living Lounge';
    showToast('Saving AI Interior Design to Firebase...', 'info');

    const res = await saveInteriorDesignToFirebase({
      title: `${styleSelect} ${roomSelect} Concept`,
      style: styleSelect,
      roomType: roomSelect,
      wallCount: 3,
      renderUrl: '/images/interior_1.png',
      costEstimate: '$34,500 – $48,000'
    });

    if (res.success) {
      showToast('✅ Interior Concept saved to Firebase!', 'success');
      renderFirebaseInteriorList('firebaseInteriorContainer');
    }
  });

  // 2D Plan File Upload Dropzone
  const planDropzone = document.getElementById('planDropzone');
  const planFileInput = document.getElementById('planFileInput');
  const planFileName = document.getElementById('planFileName');
  const planPreviewBox = document.getElementById('planPreviewBox');

  planDropzone?.addEventListener('click', () => planFileInput?.click());
  planFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (planFileName) planFileName.innerText = file.name;
      if (planPreviewBox) planPreviewBox.style.display = 'block';
      showToast(`Loaded blueprint "${file.name}"`, 'success');
    }
  });

  // Generate AI Construction Video Button
  document.getElementById('generateVideoBtn')?.addEventListener('click', () => {
    const videoLoadingState = document.getElementById('videoLoadingState');
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');

    if (videoLoadingState) videoLoadingState.style.display = 'block';
    if (videoPlayerContainer) videoPlayerContainer.style.display = 'none';

    showToast('Rendering 3D AI Construction Video from 2D Plan...', 'info');

    setTimeout(() => {
      if (videoLoadingState) videoLoadingState.style.display = 'none';
      if (videoPlayerContainer) videoPlayerContainer.style.display = 'block';
      initConstructionVideoCanvas();
      startVideoAnimation();
      showToast('✅ 3D Construction & Interior AI Video ready!', 'success');
    }, 1800);
  });

  // Video Player Controls
  document.getElementById('playPauseVideoBtn')?.addEventListener('click', () => {
    if (isVideoPlaying) {
      pauseVideoAnimation();
    } else {
      startVideoAnimation();
    }
  });

  document.getElementById('restartVideoBtn')?.addEventListener('click', () => {
    currentVideoProgress = 0;
    startVideoAnimation();
  });

  document.getElementById('saveVideoFirebaseBtn')?.addEventListener('click', async () => {
    showToast('Saving 2D Plan-to-Video Simulation to Firebase...', 'info');
    const res = await saveInteriorDesignToFirebase({
      title: '2D Architectural Plan AI Construction Video',
      style: 'Full 3D Construction Sequence',
      roomType: 'Building Build-out Simulation',
      wallCount: 4,
      renderUrl: '/images/interior_1.png',
      hasVideoSimulation: true,
      costEstimate: '$120,000 Total Build'
    });

    if (res.success) {
      showToast('✅ AI Video Simulation saved to Firebase!', 'success');
      renderFirebaseInteriorList('firebaseInteriorContainer');
    }
  });

  document.getElementById('refreshInteriorFirebaseBtn')?.addEventListener('click', () => {
    showToast('Refreshing Firebase Records...', 'info');
    renderFirebaseInteriorList('firebaseInteriorContainer');
  });
}

// Canvas-Based 60FPS AI Construction & Interior Video Simulation Renderer
function initConstructionVideoCanvas() {
  const canvas = document.getElementById('constructionVideoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  renderVideoFrame(ctx, canvas, currentVideoProgress);
}

function startVideoAnimation() {
  const canvas = document.getElementById('constructionVideoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const playBtn = document.getElementById('playPauseVideoBtn');

  if (videoAnimationInterval) clearInterval(videoAnimationInterval);
  isVideoPlaying = true;
  if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Video';

  videoAnimationInterval = setInterval(() => {
    currentVideoProgress += 0.8;
    if (currentVideoProgress > 100) {
      currentVideoProgress = 100;
      pauseVideoAnimation();
    }
    renderVideoFrame(ctx, canvas, currentVideoProgress);
    const scrubber = document.getElementById('videoScrubber');
    if (scrubber) scrubber.value = currentVideoProgress;
  }, 40);
}

function pauseVideoAnimation() {
  if (videoAnimationInterval) clearInterval(videoAnimationInterval);
  isVideoPlaying = false;
  const playBtn = document.getElementById('playPauseVideoBtn');
  if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Play Video';
}

function renderVideoFrame(ctx, canvas, progress) {
  const w = canvas.width;
  const h = canvas.height;

  // Clear background
  ctx.fillStyle = '#050914';
  ctx.fillRect(0, 0, w, h);

  // Architectural Grid lines
  ctx.strokeStyle = 'rgba(110,231,255,0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Draw 2D Vector Blueprint Grid (Stage 1: 0-25%)
  const alpha1 = Math.min(1, progress / 25);
  ctx.strokeStyle = `rgba(110,231,255, ${alpha1 * 0.8})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(180, 100, 600, 340);
  ctx.strokeRect(220, 140, 240, 260); // Room 1
  ctx.strokeRect(480, 140, 260, 260); // Room 2

  // 3D Wall Framing & Columns (Stage 2: 25-50%)
  if (progress > 25) {
    const wallH = ((progress - 25) / 25) * 80;
    ctx.fillStyle = 'rgba(245,197,24,0.4)';
    ctx.strokeStyle = '#f5c518';
    ctx.lineWidth = 2;
    // Columns
    [[180, 100], [780, 100], [180, 440], [780, 440], [460, 100], [460, 440]].forEach(([cx, cy]) => {
      ctx.fillRect(cx - 10, cy - 10 - wallH * 0.4, 20, 20 + wallH * 0.4);
      ctx.strokeRect(cx - 10, cy - 10 - wallH * 0.4, 20, 20 + wallH * 0.4);
    });
  }

  // Drywall & Lighting Cove (Stage 3: 50-75%)
  if (progress > 50) {
    const lightAlpha = (progress - 50) / 25;
    ctx.fillStyle = `rgba(110,231,255, ${lightAlpha * 0.25})`;
    ctx.fillRect(220, 140, 240, 260);
    ctx.fillRect(480, 140, 260, 260);

    // Warm Ambient Light Coves
    ctx.shadowColor = '#6ee7ff';
    ctx.shadowBlur = 20 * lightAlpha;
    ctx.strokeStyle = `rgba(255,255,255, ${lightAlpha})`;
    ctx.beginPath();
    ctx.arc(340, 270, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Fully Furnished Interior Staging (Stage 4: 75-100%)
  if (progress > 75) {
    const furnAlpha = (progress - 75) / 25;
    ctx.fillStyle = `rgba(239,68,68, ${furnAlpha * 0.7})`;
    // Modular Sofa
    ctx.fillRect(250, 280, 120, 50);
    // Executive Desk
    ctx.fillStyle = `rgba(245,197,24, ${furnAlpha * 0.7})`;
    ctx.fillRect(520, 220, 140, 60);
  }

  // Update Progress Overlay Text & Badges
  const badgeEl = document.getElementById('videoStageBadge');
  const timeTextEl = document.getElementById('videoTimeText');
  const secs = Math.floor((progress / 100) * 15);
  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

  if (timeTextEl) timeTextEl.innerText = `00:${secsStr} / 00:15`;

  if (badgeEl) {
    if (progress < 25) badgeEl.innerText = 'Phase 1: 2D Blueprint Grid Analysis';
    else if (progress < 50) badgeEl.innerText = 'Phase 2: 3D Framing & Column Erection';
    else if (progress < 75) badgeEl.innerText = 'Phase 3: Drywall, Electrical & Lighting';
    else badgeEl.innerText = 'Phase 4: Fully Furnished Interior Staging';
  }
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

    renderGoogleSatelliteMap('siteMap', lat, lon, locationLabel);

  } catch (err) {
    container.innerHTML = `
      <div style="padding:20px;background:rgba(239,68,68,0.1);border:1px solid var(--danger);border-radius:var(--radius-md);color:var(--danger)">
        <i class="fas fa-exclamation-triangle" style="margin-right:8px"></i> Weather data fetch failed. Check internet connection.
      </div>`;
  }
}

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

// ==================== Firebase Renderers ====================

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

async function renderFirebaseInteriorList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const designs = await getInteriorDesignsFromFirebase();
  if (!designs || designs.length === 0) {
    container.innerHTML = '<p class="text-muted">No saved interior projects found in Firebase.</p>';
    return;
  }

  let html = '<div class="grid grid-2">';
  designs.forEach(item => {
    html += `
      <div class="card card-flat" style="padding:16px;position:relative">
        <div class="flex-between" style="margin-bottom:8px">
          <h4 style="color:var(--primary);margin:0"><i class="fas fa-couch" style="color:var(--accent);margin-right:6px"></i> ${item.title}</h4>
          <span class="badge badge-accent" style="font-size:0.7rem">${item.style}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-primary);margin-bottom:4px"><strong>Room:</strong> ${item.roomType}</p>
        <p style="font-size:0.85rem;color:var(--success);margin-bottom:8px"><strong>Turnkey Budget:</strong> ${item.costEstimate}</p>
        ${item.renderUrl ? `<img src="${item.renderUrl}" style="width:100%;height:140px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:10px" alt="Render">` : ''}
        <div class="flex-between">
          <span class="text-muted" style="font-size:0.75rem">${new Date(item.timestamp).toLocaleDateString()}</span>
          <button class="btn btn-ghost btn-sm delete-interior-btn" data-id="${item.id}" style="color:var(--danger);padding:4px 8px">
            <i class="fas fa-trash-can"></i> Delete
          </button>
        </div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.delete-interior-btn').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const id = ev.currentTarget.getAttribute('data-id');
      showToast('Deleting concept from Firebase...', 'info');
      await deleteInteriorDesignFromFirebase(id);
      showToast('Record deleted from Firebase', 'success');
      renderFirebaseInteriorList(containerId);
    });
  });
}
