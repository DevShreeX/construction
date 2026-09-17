// ==================== 3D House Models & Walkthrough Section ====================
// Section featuring 20 distinct residential house designs, interactive Three.js 3D viewer,
// quick camera angles, turntable controls, and smooth room-by-room architectural walkthroughs.

import { HouseViewer3D } from '../components/houseModels/HouseViewer3D.js';
import { showToast } from '../utils.js';

let activeHouseViewer = null;
let allHouseModels = [];
let selectedModel = null;

export async function houseModelsPage() {
  // Load models dataset
  if (!allHouseModels || allHouseModels.length === 0) {
    try {
      const res = await fetch('/data/houseModels.json');
      if (res.ok) {
        allHouseModels = await res.json();
      }
    } catch (e) {
      console.warn('Could not load /data/houseModels.json, fallback to API:', e);
    }

    if (!allHouseModels || allHouseModels.length === 0) {
      try {
        const res2 = await fetch('/api/house-models');
        if (res2.ok) {
          const json = await res2.json();
          allHouseModels = json.data || [];
        }
      } catch (err) {
        console.error('Failed to load house models from API:', err);
      }
    }
  }

  return `
    <div class="house-models-page">
      <!-- Section Header -->
      <section class="section house-hero-section">
        <div class="container text-center">
          <div class="house-badge-pill">
            <i class="fas fa-cube text-accent"></i> Real-Time Three.js Architectural Engine
          </div>
          <h1 class="house-page-title">3D House Models</h1>
          <p class="house-page-subtitle">
            Browse 20 distinct residential architectural house designs. Inspect full exterior 3D geometry with 360° rotation and experience room-by-room interior walkthroughs.
          </p>

          <div class="house-kpi-bar">
            <div class="house-kpi-item">
              <span class="house-kpi-val">20</span>
              <span class="house-kpi-lbl">Architectural Models</span>
            </div>
            <div class="house-kpi-divider"></div>
            <div class="house-kpi-item">
              <span class="house-kpi-val">1–3</span>
              <span class="house-kpi-lbl">Floor Options</span>
            </div>
            <div class="house-kpi-divider"></div>
            <div class="house-kpi-item">
              <span class="house-kpi-val">850–6,200</span>
              <span class="house-kpi-lbl">Built-Up Sq Ft</span>
            </div>
            <div class="house-kpi-divider"></div>
            <div class="house-kpi-item">
              <span class="house-kpi-val">100%</span>
              <span class="house-kpi-lbl">Interactive 3D</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Filter & Search Toolbar -->
      <section class="house-filter-section">
        <div class="container">
          <div class="house-filter-wrapper">
            <!-- Search Input -->
            <div class="house-search-box">
              <i class="fas fa-search"></i>
              <input type="text" id="houseSearchInput" placeholder="Search by house name, style, or features (e.g., Villa, Kerala, Pool)...">
            </div>

            <!-- Category Pills -->
            <div class="house-category-pills" id="houseCategoryPills">
              <button class="cat-pill active" data-filter="all">All (20)</button>
              <button class="cat-pill" data-filter="modern">Modern Villas (7)</button>
              <button class="cat-pill" data-filter="traditional">Traditional & Indian (4)</button>
              <button class="cat-pill" data-filter="luxury">Luxury & Mansions (4)</button>
              <button class="cat-pill" data-filter="compact">Compact Urban (2)</button>
              <button class="cat-pill" data-filter="eco">Eco & Special (3)</button>
            </div>

            <!-- Secondary Select Dropdowns -->
            <div class="house-secondary-filters">
              <div class="select-group">
                <label><i class="fas fa-layer-group"></i> Floors:</label>
                <select id="houseFloorFilter">
                  <option value="all">All Floors</option>
                  <option value="1">1 Floor (Ground)</option>
                  <option value="2">2 Floors (G + 1)</option>
                  <option value="3">3 Floors (G + 2)</option>
                </select>
              </div>

              <div class="select-group">
                <label><i class="fas fa-bed"></i> Bedrooms:</label>
                <select id="houseBhkFilter">
                  <option value="all">All BHKs</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div class="select-group">
                <label><i class="fas fa-sort"></i> Sort By:</label>
                <select id="houseSortFilter">
                  <option value="featured">Featured Order</option>
                  <option value="area-asc">Area: Low to High</option>
                  <option value="area-desc">Area: High to Low</option>
                  <option value="name">House Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 20 House Models Grid -->
      <section class="section house-grid-section">
        <div class="container">
          <div class="house-grid-header flex-between">
            <span class="house-results-count" id="houseResultsCount">Showing 20 of 20 House Models</span>
            <span class="house-hint-text"><i class="fas fa-mouse-pointer"></i> Click "View 3D" to open interactive 3D model & walkthrough</span>
          </div>

          <div class="house-cards-grid" id="houseCardsGrid">
            ${renderHouseCardsHtml(allHouseModels)}
          </div>
        </div>
      </section>

      <!-- Dedicated Interactive 3D Viewer Studio Modal / Viewport -->
      <div id="houseViewerModal" class="house-viewer-modal hidden">
        <div class="house-modal-backdrop" id="houseModalBackdrop"></div>
        <div class="house-modal-content">
          <!-- Top Studio Header -->
          <div class="house-studio-header">
            <div class="house-studio-title-box">
              <div class="house-studio-badges">
                <span class="badge badge-primary" id="modalHouseStyle">Modern Style</span>
                <span class="badge badge-accent" id="modalHouseFloors">2 Floors</span>
                <span class="badge badge-success"><i class="fas fa-circle-check"></i> Three.js 3D WebGL</span>
              </div>
              <h2 id="modalHouseName" class="house-studio-title">House Model Name</h2>
              <div class="house-studio-quick-metrics" id="modalHouseMetrics">
                <span><i class="fas fa-ruler-combined"></i> 2,400 sq ft</span>
                <span><i class="fas fa-bed"></i> 4 Beds</span>
                <span><i class="fas fa-bath"></i> 4 Baths</span>
                <span class="text-gold"><i class="fas fa-tag"></i> ₹48,00,000</span>
              </div>
            </div>

            <div class="house-studio-actions">
              <button class="btn btn-outline btn-sm" id="btnDownloadBrochure">
                <i class="fas fa-download"></i> Spec Sheet
              </button>
              <button class="btn btn-ghost btn-sm house-modal-close-btn" id="btnCloseViewerModal" aria-label="Close 3D Viewer">
                <i class="fas fa-times"></i> Close Viewer
              </button>
            </div>
          </div>

          <!-- Studio Main Body (Two Columns: 3D Viewport + Architectural Dossier) -->
          <div class="house-studio-body">
            <!-- 3D Canvas Viewport Column -->
            <div class="house-viewport-container" id="houseViewportContainer">
              <!-- Three.js Canvas Mount Element -->
              <div class="house-canvas-mount" id="houseCanvasMount"></div>

              <!-- Sleek Architectural Loading Overlay -->
              <div class="house-loader-overlay hidden" id="houseLoaderOverlay">
                <div class="loader-spinner"></div>
                <p id="houseLoaderMessage">Loading Architectural Model...</p>
              </div>

              <!-- Top-Left Architectural Angle Bar -->
              <div class="house-angle-controls">
                <button class="angle-btn active" data-angle="iso" title="Isometric 3D Perspective">
                  <i class="fas fa-cube"></i> Iso
                </button>
                <button class="angle-btn" data-angle="front" title="Front Elevation">Front</button>
                <button class="angle-btn" data-angle="rear" title="Rear Elevation">Rear</button>
                <button class="angle-btn" data-angle="left" title="Left Elevation">Left</button>
                <button class="angle-btn" data-angle="right" title="Right Elevation">Right</button>
                <button class="angle-btn" data-angle="top" title="Top Bird's Eye Roof Plan">
                  <i class="fas fa-compass"></i> Top
                </button>
              </div>

              <!-- Floating CAD Tools (Rotate, Zoom, Reset, Fullscreen) -->
              <div class="house-cad-toolbar">
                <button class="cad-btn" id="btnToggleRotate" title="Toggle Auto Turntable Rotation">
                  <i class="fas fa-sync-alt"></i> <span>Rotate</span>
                </button>
                <button class="cad-btn" id="btnZoomIn" title="Zoom In">
                  <i class="fas fa-search-plus"></i>
                </button>
                <button class="cad-btn" id="btnZoomOut" title="Zoom Out">
                  <i class="fas fa-search-minus"></i>
                </button>
                <button class="cad-btn" id="btnResetView" title="Reset Default View">
                  <i class="fas fa-undo"></i> <span>Reset</span>
                </button>
                <button class="cad-btn" id="btnToggleWalkthrough" title="Enter Room Walkthrough Mode">
                  <i class="fas fa-walking"></i> <span>Walkthrough</span>
                </button>
                <button class="cad-btn" id="btnToggleFullscreen" title="Toggle Fullscreen">
                  <i class="fas fa-expand"></i>
                </button>
              </div>

              <!-- Active Room Telemetry HUD (Shown when in a room) -->
              <div class="house-room-hud hidden" id="houseRoomHud">
                <div class="hud-badge"><i class="fas fa-door-open"></i> <span id="hudRoomName">Living Room</span></div>
                <div class="hud-area"><span id="hudRoomArea">320</span> sq ft</div>
                <p class="hud-desc" id="hudRoomDesc">Modern living space with natural daylight.</p>
              </div>

              <!-- Bottom Room Walkthrough Navigation Dock -->
              <div class="house-walkthrough-dock">
                <div class="dock-label">
                  <i class="fas fa-street-view text-primary"></i> <strong>Room Walkthrough:</strong>
                </div>
                <div class="dock-room-buttons" id="dockRoomButtons">
                  <!-- Dynamically populated room buttons -->
                </div>
                <button class="dock-exit-btn" id="btnExitWalkthrough" title="Return to Full Exterior 3D View">
                  <i class="fas fa-home"></i> Exterior
                </button>
              </div>
            </div>

            <!-- Side Architectural & Construction Specs Drawer -->
            <div class="house-specs-drawer">
              <div class="specs-section">
                <h3 class="specs-title"><i class="fas fa-info-circle text-primary"></i> Architectural Concept</h3>
                <p class="specs-desc" id="modalHouseDesc">Detailed description of the architectural model...</p>
              </div>

              <div class="specs-section">
                <h3 class="specs-title"><i class="fas fa-calculator text-gold"></i> Estimated Construction Cost</h3>
                <div class="cost-highlight-box">
                  <div class="cost-main" id="modalHouseCost">₹45,80,000 – ₹54,00,000</div>
                  <div class="cost-sqft" id="modalHouseCostSqft">Avg ₹2,050 / sq ft</div>
                </div>
                <div class="cost-breakdown-table">
                  <div class="cost-row"><span>Civil Structure:</span> <strong id="modalCostCivil">₹26,50,000</strong></div>
                  <div class="cost-row"><span>Finishing & Carpentry:</span> <strong id="modalCostFinishing">₹13,80,000</strong></div>
                  <div class="cost-row"><span>MEP (Electrical & Plumbing):</span> <strong id="modalCostMep">₹7,20,000</strong></div>
                  <div class="cost-row"><span>Landscape & Exterior:</span> <strong id="modalCostLandscape">₹3,50,000</strong></div>
                </div>
              </div>

              <div class="specs-section">
                <h3 class="specs-title"><i class="fas fa-ruler-combined text-accent"></i> Space Planning Specifications</h3>
                <div class="specs-grid-2">
                  <div class="spec-cell">
                    <span class="label">Plot Size:</span>
                    <strong id="modalSpecPlot">35' x 55'</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Built-Up Area:</span>
                    <strong id="modalSpecArea">2,350 sq ft</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Floors:</span>
                    <strong id="modalSpecFloors">G + 1 (2 Floors)</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Facing:</span>
                    <strong id="modalSpecFacing">North Facing</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Bedrooms:</span>
                    <strong id="modalSpecBeds">4 BHK</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Bathrooms:</span>
                    <strong id="modalSpecBaths">4 Attached</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Parking:</span>
                    <strong id="modalSpecParking">2 Covered Bays</strong>
                  </div>
                  <div class="spec-cell">
                    <span class="label">Vastu Score:</span>
                    <strong id="modalSpecVastu" class="text-success">96% Compliant</strong>
                  </div>
                </div>
              </div>

              <div class="specs-section">
                <h3 class="specs-title"><i class="fas fa-check-circle text-success"></i> Key Engineering Highlights</h3>
                <ul class="specs-feature-list" id="modalFeatureList">
                  <!-- Populated dynamically -->
                </ul>
              </div>

              <!-- Inquire Action -->
              <div class="specs-cta-box">
                <button class="btn btn-primary btn-block" id="btnInquireHouse">
                  <i class="fas fa-hard-hat"></i> Inquire Construction for this Model
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== Render HTML for 20 House Cards ====================
function renderHouseCardsHtml(models) {
  if (!models || models.length === 0) {
    return `
      <div class="empty-state text-center" style="grid-column: 1 / -1; padding: 48px;">
        <i class="fas fa-home" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
        <h3>No house models found</h3>
        <p>Try adjusting your search criteria or category filter.</p>
      </div>`;
  }

  return models.map((m, index) => {
    // Determine category indicator
    const floorLabel = m.floors === 1 ? '1 Floor' : `${m.floors} Floors`;

    return `
      <div class="house-card animate-in" data-model-id="${m.modelId}" data-index="${index}">
        <!-- Preview Image Container -->
        <div class="house-card-preview-wrap">
          <img 
            src="${m.thumbnail}" 
            alt="${m.modelName}" 
            class="house-card-img"
            loading="lazy"
            onerror="this.onerror=null; this.src='/images/house3d/1200sqft_modern_duplex.jpg';">
          <div class="house-card-overlay">
            <button class="btn btn-primary btn-sm btn-open-3d" data-model-id="${m.modelId}">
              <i class="fas fa-cube"></i> View 3D
            </button>
          </div>
          <div class="house-card-badge-top">
            <span class="badge badge-primary">${floorLabel}</span>
            <span class="badge badge-elevated">${m.bedrooms} BHK</span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="house-card-content">
          <div class="house-card-style-tag">${m.style}</div>
          <h3 class="house-card-title">${m.modelName}</h3>
          
          <div class="house-card-specs-row">
            <div class="spec-item" title="Built-Up Area">
              <i class="fas fa-ruler-combined"></i>
              <span>${m.builtUpAreaSqFt.toLocaleString('en-IN')} sq ft</span>
            </div>
            <div class="spec-item" title="Bedrooms">
              <i class="fas fa-bed"></i>
              <span>${m.bedrooms} Beds</span>
            </div>
            <div class="spec-item" title="Bathrooms">
              <i class="fas fa-bath"></i>
              <span>${m.bathrooms} Baths</span>
            </div>
          </div>

          <p class="house-card-desc">${truncateText(m.description, 110)}</p>

          <div class="house-card-footer flex-between">
            <div class="cost-box">
              <span class="cost-lbl">Est. Construction</span>
              <span class="cost-val">${m.estimatedCost}</span>
            </div>
            <button class="btn btn-primary btn-sm btn-open-3d" data-model-id="${m.modelId}">
              <i class="fas fa-cube"></i> View 3D
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function truncateText(text, maxLen = 110) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

// ==================== Page Lifecycle & Event Handlers ====================
export function setupHouseModelsPageHandlers() {
  // 1. Check if modelId passed in URL query param (e.g. /house-models?id=house-01)
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id') || urlParams.get('model');
  if (targetId && allHouseModels.length > 0) {
    const found = allHouseModels.find(m => m.modelId === targetId);
    if (found) {
      setTimeout(() => openHouseViewerModal(found), 250);
    }
  }

  // 2. Click handler on "View 3D" cards
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-open-3d') || e.target.closest('.house-card-preview-wrap');
    if (trigger) {
      e.preventDefault();
      const modelId = trigger.getAttribute('data-model-id') || trigger.closest('.house-card')?.getAttribute('data-model-id');
      const model = allHouseModels.find(m => m.modelId === modelId);
      if (model) {
        openHouseViewerModal(model);
      }
    }
  });

  // 3. Search & Filters
  const searchInput = document.getElementById('houseSearchInput');
  const floorFilter = document.getElementById('houseFloorFilter');
  const bhkFilter = document.getElementById('houseBhkFilter');
  const sortFilter = document.getElementById('houseSortFilter');
  const catPills = document.querySelectorAll('#houseCategoryPills .cat-pill');

  let activeCategory = 'all';

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const fl = floorFilter?.value || 'all';
    const bhk = bhkFilter?.value || 'all';
    const sort = sortFilter?.value || 'featured';

    let filtered = allHouseModels.filter(m => {
      // Search text
      if (q) {
        const matches = m.modelName.toLowerCase().includes(q) ||
          m.style.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category Pill
      if (activeCategory === 'modern' && !m.modelName.toLowerCase().includes('modern') && !m.modelName.toLowerCase().includes('contemporary')) return false;
      if (activeCategory === 'traditional' && !m.modelName.toLowerCase().includes('traditional') && !m.modelName.toLowerCase().includes('kerala') && !m.modelName.toLowerCase().includes('courtyard')) return false;
      if (activeCategory === 'luxury' && !m.modelName.toLowerCase().includes('luxury') && !m.modelName.toLowerCase().includes('mansion') && !m.modelName.toLowerCase().includes('premium')) return false;
      if (activeCategory === 'compact' && !m.modelName.toLowerCase().includes('compact') && !m.modelName.toLowerCase().includes('minimalist')) return false;
      if (activeCategory === 'eco' && !m.modelName.toLowerCase().includes('eco') && !m.modelName.toLowerCase().includes('coastal') && !m.modelName.toLowerCase().includes('garden') && !m.modelName.toLowerCase().includes('pool')) return false;

      // Floors
      if (fl !== 'all' && String(m.floors) !== String(fl)) return false;

      // BHK
      if (bhk !== 'all') {
        if (bhk === '5' && m.bedrooms < 5) return false;
        if (bhk !== '5' && String(m.bedrooms) !== String(bhk)) return false;
      }

      return true;
    });

    // Sorting
    if (sort === 'area-asc') filtered.sort((a, b) => a.builtUpAreaSqFt - b.builtUpAreaSqFt);
    else if (sort === 'area-desc') filtered.sort((a, b) => b.builtUpAreaSqFt - a.builtUpAreaSqFt);
    else if (sort === 'name') filtered.sort((a, b) => a.modelName.localeCompare(b.modelName));

    const gridEl = document.getElementById('houseCardsGrid');
    const countEl = document.getElementById('houseResultsCount');
    if (gridEl) gridEl.innerHTML = renderHouseCardsHtml(filtered);
    if (countEl) countEl.textContent = `Showing ${filtered.length} of ${allHouseModels.length} House Models`;
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (floorFilter) floorFilter.addEventListener('change', applyFilters);
  if (bhkFilter) bhkFilter.addEventListener('change', applyFilters);
  if (sortFilter) sortFilter.addEventListener('change', applyFilters);

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  // 4. Modal Close Handlers
  const closeBtn = document.getElementById('btnCloseViewerModal');
  const backdrop = document.getElementById('houseModalBackdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeHouseViewerModal);
  if (backdrop) backdrop.addEventListener('click', closeHouseViewerModal);

  // 5. 3D Viewer Toolbar Handlers
  const btnRotate = document.getElementById('btnToggleRotate');
  if (btnRotate) {
    btnRotate.addEventListener('click', () => {
      if (activeHouseViewer) {
        const isRotating = activeHouseViewer.toggleRotate();
        btnRotate.classList.toggle('active', isRotating);
        showToast(isRotating ? 'Turntable auto-rotation active' : 'Auto-rotation paused', 'info');
      }
    });
  }

  const btnZoomIn = document.getElementById('btnZoomIn');
  if (btnZoomIn) btnZoomIn.addEventListener('click', () => activeHouseViewer?.zoomIn());

  const btnZoomOut = document.getElementById('btnZoomOut');
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => activeHouseViewer?.zoomOut());

  const btnReset = document.getElementById('btnResetView');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      activeHouseViewer?.resetView();
      updateAngleButtons('iso');
      hideRoomHud();
    });
  }

  const btnWalkthrough = document.getElementById('btnToggleWalkthrough');
  if (btnWalkthrough) {
    btnWalkthrough.addEventListener('click', () => {
      if (!selectedModel || !selectedModel.rooms || selectedModel.rooms.length === 0) return;
      // Enter the first interior room (Living Room)
      const firstRoom = selectedModel.rooms[0];
      activeHouseViewer?.transitionToRoom(firstRoom);
      highlightRoomButton(firstRoom.id);
      showRoomHud(firstRoom);
      showToast(`Entering ${firstRoom.name} Walkthrough`, 'info');
    });
  }

  const btnExitWalk = document.getElementById('btnExitWalkthrough');
  if (btnExitWalk) {
    btnExitWalk.addEventListener('click', () => {
      activeHouseViewer?.transitionToExterior();
      clearRoomButtonsHighlight();
      hideRoomHud();
      showToast('Switched to Exterior 3D View', 'info');
    });
  }

  const btnFullscreen = document.getElementById('btnToggleFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      const container = document.getElementById('houseViewportContainer');
      activeHouseViewer?.toggleFullscreen(container);
    });
  }

  // 6. Camera Quick-Angles
  document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const angle = btn.getAttribute('data-angle');
      if (activeHouseViewer) {
        activeHouseViewer.setCameraAngle(angle);
        updateAngleButtons(angle);
        hideRoomHud();
      }
    });
  });

  // 7. Spec Brochure / Inquire Buttons
  const btnBrochure = document.getElementById('btnDownloadBrochure');
  if (btnBrochure) {
    btnBrochure.addEventListener('click', () => {
      showToast(`Generating architectural dossier for ${selectedModel?.modelName || 'selected model'}...`, 'success');
    });
  }

  const btnInquire = document.getElementById('btnInquireHouse');
  if (btnInquire) {
    btnInquire.addEventListener('click', () => {
      showToast(`Construction quote requested for ${selectedModel?.modelName}. Our team will review your requirements.`, 'success');
    });
  }
}

// ==================== Open 3D Viewer Modal & Load Model ====================
export function openHouseViewerModal(model) {
  selectedModel = model;
  const modal = document.getElementById('houseViewerModal');
  if (!modal) return;

  // 1. Populate UI fields
  document.getElementById('modalHouseName').textContent = model.modelName;
  document.getElementById('modalHouseStyle').textContent = model.style;
  document.getElementById('modalHouseFloors').textContent = model.floorsText || `${model.floors} Floors`;
  document.getElementById('modalHouseDesc').textContent = model.description;
  document.getElementById('modalHouseCost').textContent = model.estimatedCost;
  document.getElementById('modalHouseCostSqft').textContent = `Avg ${model.costPerSqFt || '₹2,100 / sq ft'}`;

  // Cost breakdown
  const bd = model.costBreakdown || {};
  document.getElementById('modalCostCivil').textContent = bd.civilStructure || '₹25,00,000';
  document.getElementById('modalCostFinishing').textContent = bd.finishingCarpentry || '₹14,00,000';
  document.getElementById('modalCostMep').textContent = bd.mepElectricalPlumbing || '₹7,00,000';
  document.getElementById('modalCostLandscape').textContent = bd.landscapeExt || '₹3,50,000';

  // Space specs
  document.getElementById('modalSpecPlot').textContent = model.plotSize;
  document.getElementById('modalSpecArea').textContent = `${model.builtUpAreaSqFt} sq ft (${model.builtUpAreaSqM || ''} m²)`;
  document.getElementById('modalSpecFloors').textContent = model.floorsText || `${model.floors} Floors`;
  document.getElementById('modalSpecFacing').textContent = `${model.facing || 'East'} Facing`;
  document.getElementById('modalSpecBeds').textContent = `${model.bedrooms} BHK (${model.bedrooms} Bedrooms)`;
  document.getElementById('modalSpecBaths').textContent = `${model.bathrooms} Bathrooms`;
  document.getElementById('modalSpecParking').textContent = model.parking || 'Covered Car Bay';
  document.getElementById('modalSpecVastu').textContent = `${model.vastuScore || 96}% Vastu Compliant`;

  // Quick metrics in header
  const metricsEl = document.getElementById('modalHouseMetrics');
  if (metricsEl) {
    metricsEl.innerHTML = `
      <span><i class="fas fa-ruler-combined text-primary"></i> ${model.builtUpAreaSqFt} sq ft</span>
      <span><i class="fas fa-bed text-accent"></i> ${model.bedrooms} Beds</span>
      <span><i class="fas fa-bath text-secondary"></i> ${model.bathrooms} Baths</span>
      <span class="text-gold"><i class="fas fa-tag"></i> ${model.estimatedCost}</span>
    `;
  }

  // Feature list
  const featureList = document.getElementById('modalFeatureList');
  if (featureList) {
    const features = model.architecturalFeatures || [
      'High structural integrity RCC framed engineering',
      'Continuous cross-ventilation and natural daylight optimization',
      'Premium acoustic glass windows and thermal insulation'
    ];
    featureList.innerHTML = features.map(f => `<li><i class="fas fa-check text-success"></i> <span>${f}</span></li>`).join('');
  }

  // Build Room Walkthrough Buttons
  buildWalkthroughButtons(model.rooms || []);

  // Show Modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // 2. Initialize or Update 3D Engine
  const mount = document.getElementById('houseCanvasMount');
  if (mount) {
    if (!activeHouseViewer) {
      activeHouseViewer = new HouseViewer3D({
        mountEl: mount,
        container: document.getElementById('houseViewportContainer'),
        onRoomChange: (room) => {
          if (room) {
            highlightRoomButton(room.id);
            showRoomHud(room);
          } else {
            clearRoomButtonsHighlight();
            hideRoomHud();
          }
        },
        onLoadingChange: (isLoading, msg) => {
          const loader = document.getElementById('houseLoaderOverlay');
          const txt = document.getElementById('houseLoaderMessage');
          if (loader) loader.classList.toggle('hidden', !isLoading);
          if (txt && msg) txt.textContent = msg;
        }
      });
    }

    // Load the selected 3D house model
    activeHouseViewer.loadHouseModel(model);
    updateAngleButtons('iso');
  }
}

// Build room walkthrough buttons dock
function buildWalkthroughButtons(rooms) {
  const container = document.getElementById('dockRoomButtons');
  if (!container) return;

  const roomIcons = {
    living_room: 'fa-couch',
    kitchen: 'fa-utensils',
    bedroom: 'fa-bed',
    bathroom: 'fa-bath',
    balcony: 'fa-umbrella-beach',
    backyard: 'fa-tree'
  };

  container.innerHTML = rooms.map(r => {
    const icon = roomIcons[r.type] || 'fa-door-open';
    return `
      <button class="room-dock-btn" data-room-id="${r.id}" title="${r.name} (${r.areaSqFt || ''} sq ft)">
        <i class="fas ${icon}"></i> <span>${r.name}</span>
      </button>
    `;
  }).join('');

  // Attach click listener for each room
  container.querySelectorAll('.room-dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const roomId = btn.getAttribute('data-room-id');
      const room = rooms.find(r => r.id === roomId);
      if (room && activeHouseViewer) {
        activeHouseViewer.transitionToRoom(room);
        highlightRoomButton(roomId);
        showRoomHud(room);
      }
    });
  });
}

function highlightRoomButton(roomId) {
  document.querySelectorAll('.room-dock-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-room-id') === roomId);
  });
}

function clearRoomButtonsHighlight() {
  document.querySelectorAll('.room-dock-btn').forEach(b => b.classList.remove('active'));
}

function showRoomHud(room) {
  const hud = document.getElementById('houseRoomHud');
  if (!hud) return;
  document.getElementById('hudRoomName').textContent = room.name;
  document.getElementById('hudRoomArea').textContent = room.areaSqFt || '240';
  document.getElementById('hudRoomDesc').textContent = room.description || '';
  hud.classList.remove('hidden');
}

function hideRoomHud() {
  const hud = document.getElementById('houseRoomHud');
  if (hud) hud.classList.add('hidden');
}

function updateAngleButtons(activeAngle) {
  document.querySelectorAll('.angle-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-angle') === activeAngle);
  });
}

export function closeHouseViewerModal() {
  const modal = document.getElementById('houseViewerModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';

  if (activeHouseViewer) {
    activeHouseViewer.resetView();
  }
}

export function disposeHouseViewer() {
  if (activeHouseViewer) {
    activeHouseViewer.dispose();
    activeHouseViewer = null;
  }
}
