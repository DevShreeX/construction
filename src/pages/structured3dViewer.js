// ==================== Structured3D Architectural Suite & 360° Panorama Viewer ====================
// Interfaces with the Structured3D backend dataset (server/data/structured3d/)
// Provides authentic 360° equirectangular panoramas, multi-angle perspectives, 2D floorplans & 3D rotatable meshes.

import { showToast } from '../utils.js';

export const DEFAULT_STRUCTURED3D_DESIGNS = [
  {
    designId: 'S3D-DES-001',
    sceneId: 'scene_00000',
    title: 'Structured3D Modern Urban 3 BHK Residence',
    style: 'Contemporary Minimalist',
    bhk: '3 BHK',
    floors: 'Single Level (Ground)',
    totalAreaSqFt: 1380,
    totalAreaSqM: 128.2,
    roomCount: 5,
    roomTypes: ['living room', 'kitchen', 'bedroom', 'bedroom', 'bathroom'],
    dimensions: { widthFt: 34.5, depthFt: 40.0, ceilingHeightFt: 9.2 },
    vastuScore: 96,
    estimatedCost: '₹22,50,000 – ₹27,80,000',
    thumbnail: '/api/structured3d/asset/S3D-DES-001/thumbnail',
    floorplan: { path: '/api/structured3d/asset/S3D-DES-001/floorplan', format: 'png' },
    model3D: { format: 'obj', path: '/api/structured3d/asset/S3D-DES-001/mesh' },
    views: {
      front: '/api/structured3d/asset/S3D-DES-001/view/front',
      back: '/api/structured3d/asset/S3D-DES-001/view/back',
      left: '/api/structured3d/asset/S3D-DES-001/view/left',
      right: '/api/structured3d/asset/S3D-DES-001/view/right',
      top: '/api/structured3d/asset/S3D-DES-001/view/top'
    },
    rooms: [
      { roomId: 'room_01', name: 'Living & Dining Lounge', type: 'living_room', dimensions: "18.5' x 16.0'", areaSqFt: 296, panorama: '/api/structured3d/asset/S3D-DES-001/room/living_room/panorama', features: 'Double-aspect windows, engineered vitrified flooring, structured 3D spatial layout' },
      { roomId: 'room_02', name: 'Modular Chef Kitchen', type: 'kitchen', dimensions: "12.0' x 11.5'", areaSqFt: 138, panorama: '/api/structured3d/asset/S3D-DES-001/room/kitchen/panorama', features: 'Quartz countertop, integrated cabinetry, utility wash area' },
      { roomId: 'room_03', name: 'Master Bedroom Suite', type: 'bedroom', dimensions: "15.0' x 14.5'", areaSqFt: 217, panorama: '/api/structured3d/asset/S3D-DES-001/room/bedroom/panorama', features: 'Laminate wood flooring, recessed warm lighting, floor-to-ceiling wardrobe cavity' },
      { roomId: 'room_04', name: 'Luxury En-Suite Bathroom', type: 'bathroom', dimensions: "9.5' x 8.0'", areaSqFt: 76, panorama: '/api/structured3d/asset/S3D-DES-001/room/bathroom/panorama', features: 'Anti-skid marble finish tiles, glass shower partition, wall-hung fixtures' }
    ]
  },
  {
    designId: 'S3D-DES-002',
    sceneId: 'scene_00001',
    title: 'Structured3D Compact Smart 2 BHK Duplex',
    style: 'Scandinavian Warm Minimalist',
    bhk: '2 BHK',
    floors: 'G + 1 Duplex (2 Floors)',
    totalAreaSqFt: 950,
    totalAreaSqM: 88.3,
    roomCount: 4,
    roomTypes: ['living room', 'kitchen', 'bedroom', 'bathroom'],
    dimensions: { widthFt: 25.0, depthFt: 38.0, ceilingHeightFt: 9.5 },
    vastuScore: 94,
    estimatedCost: '₹16,80,000 – ₹21,20,000',
    thumbnail: '/api/structured3d/asset/S3D-DES-002/thumbnail',
    floorplan: { path: '/api/structured3d/asset/S3D-DES-002/floorplan', format: 'png' },
    model3D: { format: 'obj', path: '/api/structured3d/asset/S3D-DES-002/mesh' },
    views: {
      front: '/api/structured3d/asset/S3D-DES-002/view/front',
      back: '/api/structured3d/asset/S3D-DES-002/view/back',
      left: '/api/structured3d/asset/S3D-DES-002/view/left',
      right: '/api/structured3d/asset/S3D-DES-002/view/right',
      top: '/api/structured3d/asset/S3D-DES-002/view/top'
    },
    rooms: [
      { roomId: 'room_01', name: 'Open-Plan Living & Dining', type: 'living_room', dimensions: "15.0' x 14.0'", areaSqFt: 210, panorama: '/api/structured3d/asset/S3D-DES-002/room/living_room/panorama', features: 'Open plan living with direct access to kitchen and foyer' },
      { roomId: 'room_02', name: 'Compact Linear Kitchen', type: 'kitchen', dimensions: "10.0' x 9.0'", areaSqFt: 90, panorama: '/api/structured3d/asset/S3D-DES-002/room/kitchen/panorama', features: 'Granite countertop, high-gloss acrylic cabinetry' },
      { roomId: 'room_03', name: 'Upper Floor Bedroom', type: 'bedroom', dimensions: "13.0' x 12.0'", areaSqFt: 156, panorama: '/api/structured3d/asset/S3D-DES-002/room/bedroom/panorama', features: 'Attached balcony, cross-ventilation, timber louvers' },
      { roomId: 'room_04', name: 'Contemporary Bathroom', type: 'bathroom', dimensions: "8.0' x 6.5'", areaSqFt: 52, panorama: '/api/structured3d/asset/S3D-DES-002/room/bathroom/panorama', features: 'Vitrified matte tiles, compact vanity, premium chrome fittings' }
    ]
  },
  {
    designId: 'S3D-DES-003',
    sceneId: 'scene_00002',
    title: 'Structured3D Executive 4 BHK Luxury Villa',
    style: 'Contemporary Cantilever Villa',
    bhk: '4 BHK',
    floors: 'G + 1 Villa',
    totalAreaSqFt: 2250,
    totalAreaSqM: 209.0,
    roomCount: 7,
    roomTypes: ['living room', 'kitchen', 'bedroom', 'bedroom', 'bedroom', 'bathroom', 'balcony'],
    dimensions: { widthFt: 45.0, depthFt: 50.0, ceilingHeightFt: 10.5 },
    vastuScore: 98,
    estimatedCost: '₹38,50,000 – ₹46,00,000',
    thumbnail: '/api/structured3d/asset/S3D-DES-003/thumbnail',
    floorplan: { path: '/api/structured3d/asset/S3D-DES-003/floorplan', format: 'png' },
    model3D: { format: 'obj', path: '/api/structured3d/asset/S3D-DES-003/mesh' },
    views: {
      front: '/api/structured3d/asset/S3D-DES-003/view/front',
      back: '/api/structured3d/asset/S3D-DES-003/view/back',
      left: '/api/structured3d/asset/S3D-DES-003/view/left',
      right: '/api/structured3d/asset/S3D-DES-003/view/right',
      top: '/api/structured3d/asset/S3D-DES-003/view/top'
    },
    rooms: [
      { roomId: 'room_01', name: 'Grand Double-Height Living Hall', type: 'living_room', dimensions: "22.0' x 18.0'", areaSqFt: 396, panorama: '/api/structured3d/asset/S3D-DES-003/room/living_room/panorama', features: 'Double-height ceiling, Italian marble finish, automated cove lighting' },
      { roomId: 'room_02', name: 'Gourmet Island Kitchen & Pantry', type: 'kitchen', dimensions: "16.0' x 14.0'", areaSqFt: 224, panorama: '/api/structured3d/asset/S3D-DES-003/room/kitchen/panorama', features: 'Central island breakfast counter, dual built-in convection ovens' },
      { roomId: 'room_03', name: 'Presidential Master Suite', type: 'bedroom', dimensions: "18.0' x 16.5'", areaSqFt: 297, panorama: '/api/structured3d/asset/S3D-DES-003/room/bedroom/panorama', features: 'Private walk-in dressing wardrobe, panoramic terrace view' },
      { roomId: 'room_04', name: 'Spa En-Suite Bath', type: 'bathroom', dimensions: "12.0' x 9.5'", areaSqFt: 114, panorama: '/api/structured3d/asset/S3D-DES-003/room/bathroom/panorama', features: 'Freestanding soaking tub, thermostatic rain shower, dual vanity' }
    ]
  }
];

// Render Structured3D Cards
export function renderStructured3dCardsHtml(designs = DEFAULT_STRUCTURED3D_DESIGNS) {
  return designs.map((d, idx) => `
    <div class="card animate-in delay-${(idx % 3) + 1}" style="background:rgba(15,23,42,0.92);border:1px solid rgba(251,191,36,0.3);border-radius:var(--radius-md);overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow-sm);transition:var(--transition)" id="card-${d.designId}">
      
      <!-- Top Image Header with 3D Thumbnail -->
      <div style="position:relative;height:240px;overflow:hidden;background:#000">
        <img src="${d.thumbnail}" alt="${d.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease" class="house-card-main-img" onerror="this.src='/images/house3d/1200sqft_modern_duplex.jpg'">
        <div style="position:absolute;top:12px;left:12px;display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge s3d-glow-badge" style="font-weight:800"><i class="fas fa-tag"></i> ${d.designId}</span>
          <span class="badge badge-gold"><i class="fas fa-star"></i> ${d.vastuScore}% Vastu</span>
        </div>
        <div style="position:absolute;top:12px;right:12px">
          <span class="badge badge-accent">${d.bhk}</span>
        </div>
        <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent, rgba(15,23,42,0.95));padding:12px">
          <div style="font-size:0.8rem;color:var(--gold);font-weight:600">${d.style} · Structured3D Dataset</div>
          <h3 style="margin:2px 0 0;font-size:1.15rem;color:#fff">${d.title}</h3>
        </div>
      </div>

      <!-- Card Body -->
      <div style="padding:18px;display:flex;flex-direction:column;gap:12px;flex:1">
        
        <!-- Dimensions & Areas Pills -->
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:0.8rem">
          <span style="background:rgba(30,41,59,0.8);padding:4px 10px;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <i class="fas fa-ruler" style="color:var(--primary);margin-right:4px"></i> Plot: <strong>${d.dimensions.widthFt}' x ${d.dimensions.depthFt}'</strong> (${d.totalAreaSqFt} Sq Ft)
          </span>
          <span style="background:rgba(30,41,59,0.8);padding:4px 10px;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <i class="fas fa-stairs" style="color:var(--accent);margin-right:4px"></i> <strong>${d.floors}</strong>
          </span>
          <span style="background:rgba(30,41,59,0.8);padding:4px 10px;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <i class="fas fa-arrows-to-dot" style="color:var(--gold);margin-right:4px"></i> Height: <strong>${d.dimensions.ceilingHeightFt} ft</strong>
          </span>
          <span style="background:rgba(30,41,59,0.8);padding:4px 10px;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <i class="fas fa-cube" style="color:var(--success);margin-right:4px"></i> <strong>Wavefront 3D OBJ</strong>
          </span>
        </div>

        <p class="text-muted" style="font-size:0.84rem;line-height:1.5;margin:0">
          Curated from Structured3D indoor architectural database. Includes 2D spatial layouts, multi-angle eye-level views, 3D room mesh, and 360° equirectangular panoramas.
        </p>

        <!-- Room Information Chips -->
        <div style="background:rgba(255,255,255,0.02);padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--border)">
          <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px">Room Information & 360° Panoramas:</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:0.78rem">
            ${d.rooms.map(r => `
              <span style="background:rgba(251,191,36,0.08);color:var(--text-secondary);padding:3px 8px;border-radius:4px;border:1px solid rgba(251,191,36,0.2)">
                <i class="fas fa-vr-cardboard" style="color:var(--gold);font-size:0.7rem;margin-right:4px"></i>${r.name}: <strong style="color:#fff">${r.dimensions}</strong>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Cost & Action Buttons -->
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Est. Construction Cost</div>
            <strong style="color:var(--success);font-size:1.15rem">${d.estimatedCost}</strong>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-secondary btn-sm btn-s3d-suite" data-s3d-id="${d.designId}">
              <i class="fas fa-vr-cardboard" style="color:var(--gold)"></i> View Structured3D Interior & 3D Suite
            </button>
            <button class="btn btn-primary btn-sm btn-select-s3d" data-s3d-id="${d.designId}">
              <i class="fas fa-check-circle"></i> Select This Design
            </button>
          </div>
        </div>

      </div>

    </div>
  `).join('');
}

// Render Structured3D Modal Suite
export function renderStructured3dModalSuite(d) {
  return `
    <div style="padding:28px">
      
      <!-- Modal Header -->
      <div class="flex-between" style="margin-bottom:20px;flex-wrap:wrap;gap:12px;border-bottom:1px solid var(--border);padding-bottom:16px">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:6px;flex-wrap:wrap">
            <span class="badge s3d-glow-badge" style="font-weight:800"><i class="fas fa-tag"></i> Unique Design ID: ${d.designId}</span>
            <span class="badge badge-gold"><i class="fas fa-star"></i> ${d.vastuScore}% Vastu Pure</span>
            <span class="badge badge-accent">${d.bhk}</span>
            <span class="badge badge-success">${d.floors}</span>
            <span class="badge badge-primary"><i class="fas fa-database"></i> Structured3D Scene: ${d.sceneId}</span>
          </div>
          <h2 style="margin:0;font-size:1.6rem;color:#fff">${d.title}</h2>
          <p class="text-muted" style="font-size:0.88rem;margin-top:4px">
            Dimensions: <strong>${d.dimensions.widthFt}' x ${d.dimensions.depthFt}' (${d.totalAreaSqFt} Sq.Ft / ${d.totalAreaSqM} m²)</strong> · Ceiling Height: <strong>${d.dimensions.ceilingHeightFt} ft</strong> · Rooms: <strong>${d.roomCount} Rooms</strong>
          </p>
        </div>

        <button class="btn btn-primary btn-select-s3d-modal" data-s3d-id="${d.designId}" style="padding:10px 24px;font-weight:700">
          <i class="fas fa-check-circle"></i> Select This Design for My Project
        </button>
      </div>

      <!-- Suite Tabs Navigation -->
      <div style="display:flex;gap:8px;border-bottom:1px solid var(--border);margin-bottom:22px;overflow-x:auto;padding-bottom:4px">
        <button class="suite-tab-btn active" data-s3d-tab="pano">
          <i class="fas fa-vr-cardboard" style="color:var(--gold)"></i> 360° Interactive Room Panorama
        </button>
        <button class="suite-tab-btn" data-s3d-tab="perspectives">
          <i class="fas fa-camera"></i> Multi-Angle Perspectives (Front, Back, Left, Right, Top)
        </button>
        <button class="suite-tab-btn" data-s3d-tab="floorplan">
          <i class="fas fa-draw-polygon"></i> 2D Architectural Floor Plan
        </button>
        <button class="suite-tab-btn" data-s3d-tab="mesh">
          <i class="fas fa-cube"></i> 3D Rotatable Mesh Viewer
        </button>
        <button class="suite-tab-btn" data-s3d-tab="specs">
          <i class="fas fa-list-check"></i> Room & Furniture Inventory
        </button>
      </div>

      <!-- ==================== SUB-VIEW 1: 360° INTERACTIVE PANORAMA ==================== -->
      <div id="s3d-subtab-pano" class="suite-tab-content active animate-in">
        
        <!-- Room Switcher Pills -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
          <span style="font-size:0.82rem;color:var(--text-muted);font-weight:700"><i class="fas fa-door-open"></i> SELECT ROOM:</span>
          ${d.rooms.map((r, i) => `
            <button class="s3d-room-pill ${i === 0 ? 'active' : ''}" data-room-type="${r.type}" data-pano-url="${r.panorama}" data-room-name="${r.name}">
              ${r.name} (${r.dimensions})
            </button>
          `).join('')}
        </div>

        <!-- 360° Viewer Container -->
        <div style="position:relative">
          <div id="s3dPanoramaContainer" class="s3d-pano-viewport">
            <canvas id="s3dPanoramaCanvas" style="width:100%;height:100%;display:block"></canvas>
            
            <!-- Watermark HUD -->
            <div style="position:absolute;top:16px;left:16px;background:rgba(15,23,42,0.85);backdrop-filter:blur(6px);padding:6px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);font-size:0.8rem;color:#fff;display:flex;align-items:center;gap:8px">
              <i class="fas fa-vr-cardboard" style="color:var(--gold)"></i>
              <span>Active Room: <strong id="s3dActiveRoomText" style="color:var(--primary)">${d.rooms[0].name}</strong></span>
            </div>

            <!-- Drag Instruction Overlay -->
            <div style="position:absolute;top:16px;right:16px;background:rgba(15,23,42,0.85);backdrop-filter:blur(6px);padding:6px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);font-size:0.75rem;color:var(--text-muted)">
              <i class="fas fa-hand-pointer" style="color:var(--gold)"></i> Click & Drag to Look 360° · Scroll to Zoom
            </div>

            <!-- Auto-Look Badge -->
            <div id="s3dAutoLookBadge" style="display:none;position:absolute;bottom:16px;right:16px;background:rgba(16,185,129,0.9);color:#000;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:99px">
              <i class="fas fa-rotate"></i> AUTO-PANORAMIC LOOK ACTIVE
            </div>
          </div>

          <!-- Panorama Controls Bar -->
          <div style="padding:12px 16px;background:rgba(15,23,42,0.95);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div style="font-size:0.8rem;color:var(--text-muted)">
              <i class="fas fa-camera-retro" style="color:var(--primary);margin-right:6px"></i> Authentic equirectangular 360° photography from Structured3D indoor dataset.
            </div>

            <div style="display:flex;gap:8px">
              <button id="s3dToggleAutoLookBtn" class="btn btn-accent btn-sm">
                <i class="fas fa-rotate"></i> Auto-Look 360°
              </button>
              <button id="s3dResetLookBtn" class="btn btn-outline btn-sm">
                <i class="fas fa-arrows-rotate"></i> Center View
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ==================== SUB-VIEW 2: MULTI-ANGLE PERSPECTIVES ==================== -->
      <div id="s3d-subtab-perspectives" class="suite-tab-content animate-in" style="display:none">
        
        <div style="position:relative;background:#000;border-radius:var(--radius-md);overflow:hidden;border:1px solid rgba(56,189,248,0.3)">
          
          <div id="s3dPerspectiveViewport" style="height:460px;width:100%;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden">
            <img id="s3dPerspectiveImg" src="${d.views.front}" alt="${d.title} Front View" style="width:100%;height:100%;object-fit:cover;transition:opacity 0.3s ease">
            
            <div style="position:absolute;top:16px;left:16px;background:rgba(15,23,42,0.85);backdrop-filter:blur(6px);padding:6px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);font-size:0.8rem;color:#fff;display:flex;align-items:center;gap:8px">
              <i class="fas fa-compass" style="color:var(--gold)"></i>
              <span>Perspective: <strong id="s3dActiveAngleText" style="color:var(--primary)">FRONT ELEVATION VIEW</strong></span>
            </div>
          </div>

          <!-- Multi-Angle View Buttons -->
          <div style="padding:14px 18px;background:rgba(15,23,42,0.95);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-primary btn-sm s3d-angle-btn active" data-view="front" data-src="${d.views.front}"><i class="fas fa-arrow-up"></i> Front View</button>
              <button class="btn btn-outline btn-sm s3d-angle-btn" data-view="back" data-src="${d.views.back}"><i class="fas fa-arrow-down"></i> Back View</button>
              <button class="btn btn-outline btn-sm s3d-angle-btn" data-view="left" data-src="${d.views.left}"><i class="fas fa-arrow-left"></i> Left Side</button>
              <button class="btn btn-outline btn-sm s3d-angle-btn" data-view="right" data-src="${d.views.right}"><i class="fas fa-arrow-right"></i> Right Side</button>
              <button class="btn btn-outline btn-sm s3d-angle-btn" data-view="top" data-src="${d.views.top}"><i class="fas fa-crosshairs"></i> Top / Plan View</button>
            </div>

            <div style="font-size:0.8rem;color:var(--text-muted)">
              <i class="fas fa-shield-halved" style="color:var(--success)"></i> Calibrated camera perspectives
            </div>
          </div>

        </div>

      </div>

      <!-- ==================== SUB-VIEW 3: 2D ARCHITECTURAL FLOOR PLAN ==================== -->
      <div id="s3d-subtab-floorplan" class="suite-tab-content animate-in" style="display:none">
        
        <div class="grid grid-2" style="gap:20px;align-items:start">
          <!-- Floor Plan Image -->
          <div style="background:#030712;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border);padding:14px;text-align:center">
            <img src="${d.floorplan.path}" alt="${d.title} Floor Plan" style="max-width:100%;height:auto;max-height:440px;object-fit:contain;border-radius:var(--radius-sm)">
            <div style="margin-top:10px;font-size:0.8rem;color:var(--text-muted)">
              Structured3D 2D Vector Boundary & Room Segmentation Plan
            </div>
          </div>

          <!-- Floor Plan Specs & Room Breakdown -->
          <div class="card" style="background:rgba(15,23,42,0.85);border:1px solid var(--border);padding:20px">
            <h4 style="margin:0 0 14px;color:var(--primary);display:flex;align-items:center;gap:8px">
              <i class="fas fa-ruler-combined"></i> Spatial Layout & Dimensions Breakdown
            </h4>

            <div style="display:flex;flex-direction:column;gap:10px;font-size:0.86rem">
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span>Total Carpet Area:</span>
                <strong>${d.totalAreaSqFt} Sq.Ft (${d.totalAreaSqM} m²)</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span>Building Footprint:</span>
                <strong>${d.dimensions.widthFt} ft (W) x ${d.dimensions.depthFt} ft (D)</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span>Clear Ceiling Height:</span>
                <strong>${d.dimensions.ceilingHeightFt} ft</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span>Vastu Compliance Score:</span>
                <strong style="color:var(--gold)">${d.vastuScore}% Vastu Pure</strong>
              </div>
            </div>

            <h5 style="margin:16px 0 10px;color:#fff;font-size:0.86rem">Room Inventory (${d.rooms.length} Defined Rooms):</h5>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${d.rooms.map(r => `
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;padding:6px 10px;background:rgba(30,41,59,0.5);border-radius:4px">
                  <span><i class="fas fa-check" style="color:var(--success);margin-right:6px"></i><strong>${r.name}</strong></span>
                  <span style="color:var(--text-secondary)">${r.dimensions} (${r.areaSqFt} Sq.Ft)</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- ==================== SUB-VIEW 4: 3D ROTATABLE MESH VIEWER ==================== -->
      <div id="s3d-subtab-mesh" class="suite-tab-content animate-in" style="display:none">
        
        <div style="position:relative">
          <div id="s3dMeshContainer" class="s3d-mesh-viewport">
            <canvas id="s3dMeshCanvas" style="width:100%;height:100%;display:block"></canvas>

            <!-- 3D Mesh HUD -->
            <div style="position:absolute;top:16px;left:16px;background:rgba(15,23,42,0.85);backdrop-filter:blur(6px);padding:6px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);font-size:0.8rem;color:#fff;display:flex;align-items:center;gap:8px">
              <i class="fas fa-cube" style="color:var(--primary)"></i>
              <span>Format: <strong>Wavefront OBJ (${d.designId})</strong></span>
            </div>

            <div style="position:absolute;top:16px;right:16px;background:rgba(15,23,42,0.85);backdrop-filter:blur(6px);padding:6px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);font-size:0.75rem;color:var(--text-muted)">
              <i class="fas fa-arrows-rotate" style="color:var(--primary)"></i> Drag to Orbit 360° · Right Click to Pan · Scroll to Zoom
            </div>

            <!-- Auto-Rotate Badge -->
            <div id="s3dMeshAutoBadge" style="display:none;position:absolute;bottom:16px;right:16px;background:rgba(16,185,129,0.9);color:#000;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:99px">
              <i class="fas fa-rotate"></i> 3D AUTO-ORBITING
            </div>
          </div>

          <!-- 3D Controls Bar -->
          <div style="padding:12px 16px;background:rgba(15,23,42,0.95);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div style="font-size:0.8rem;color:var(--text-muted)">
              <i class="fas fa-cube" style="color:var(--primary);margin-right:6px"></i> Interactive Three.js WebGL rendering of ${d.sceneId} geometry.
            </div>

            <div style="display:flex;gap:8px">
              <button id="s3dToggleMeshRotateBtn" class="btn btn-accent btn-sm">
                <i class="fas fa-rotate"></i> Auto Orbit
              </button>
              <button id="s3dResetMeshCamBtn" class="btn btn-outline btn-sm">
                <i class="fas fa-arrows-rotate"></i> Reset Camera
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ==================== SUB-VIEW 5: INTERIOR SPECIFICATIONS ==================== -->
      <div id="s3d-subtab-specs" class="suite-tab-content animate-in" style="display:none">
        
        <div class="grid grid-2" style="gap:16px">
          ${d.rooms.map(r => `
            <div class="card" style="background:rgba(15,23,42,0.85);border:1px solid var(--border);padding:18px">
              <h4 style="color:var(--gold);margin-bottom:10px;display:flex;align-items:center;gap:8px">
                <i class="fas fa-door-open"></i> ${r.name}
              </h4>
              <div style="font-size:0.84rem;display:flex;flex-direction:column;gap:6px">
                <div><strong>📐 Dimensions:</strong> ${r.dimensions}</div>
                <div><strong>📏 Area:</strong> ${r.areaSqFt} Sq.Ft</div>
                <div><strong>✨ Features & Finishes:</strong> ${r.features}</div>
                <div><strong>📷 Panorama:</strong> <span style="color:var(--primary)">Available in 360° Tour</span></div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>

      <!-- Modal Footer -->
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <span style="font-size:0.8rem;color:var(--text-muted)">Estimated Construction Cost:</span>
          <strong style="color:var(--success);font-size:1.2rem;margin-left:6px">${d.estimatedCost}</strong>
        </div>

        <button class="btn btn-primary btn-select-s3d-modal" data-s3d-id="${d.designId}" style="padding:10px 28px;font-weight:700">
          <i class="fas fa-check-circle"></i> Select This Structured3D Design for My Project
        </button>
      </div>

    </div>
  `;
}

// Interactive 360° Panorama Viewer using Three.js (with canvas fallback)
export function initStructured3dPanorama(container, canvas, initialPanoUrl) {
  if (typeof THREE === 'undefined' || !canvas) {
    console.warn('Three.js not loaded or canvas missing, using canvas fallback for 360 panorama');
    return setupCanvasPanoramaFallback(container, canvas, initialPanoUrl);
  }

  try {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Inverted sphere geometry for equirectangular projection
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    let currentTexture = textureLoader.load(initialPanoUrl);
    const material = new THREE.MeshBasicMaterial({ map: currentTexture });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let lon = 0;
    let onPointerDownLon = 0;
    let lat = 0;
    let onPointerDownLat = 0;
    let phi = 0;
    let theta = 0;
    let isAutoLooking = false;
    let animationId = null;

    function onPointerDown(event) {
      if (event.isPrimary === false) return;
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false || !isUserInteracting) return;
      lon = (onPointerDownPointerX - event.clientX) * 0.15 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat;
    }

    function onPointerUp(event) {
      if (event.isPrimary === false) return;
      isUserInteracting = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    }

    function onWheel(event) {
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
      camera.updateProjectionMatrix();
      event.preventDefault();
    }

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('wheel', onWheel, { passive: false });

    function animate() {
      animationId = requestAnimationFrame(animate);

      if (isAutoLooking && !isUserInteracting) {
        lon += 0.12;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.cos(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return {
      loadPanorama(newUrl) {
        textureLoader.load(newUrl, (tex) => {
          material.map = tex;
          material.needsUpdate = true;
        });
      },
      toggleAutoLook() {
        isAutoLooking = !isAutoLooking;
        return isAutoLooking;
      },
      resetView() {
        lon = 0;
        lat = 0;
        camera.fov = 75;
        camera.updateProjectionMatrix();
      },
      destroy() {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('wheel', onWheel);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      }
    };
  } catch (err) {
    console.error('Three.js WebGL error:', err);
    return setupCanvasPanoramaFallback(container, canvas, initialPanoUrl);
  }
}

// Fallback Canvas 2D Panorama Drag Viewer
function setupCanvasPanoramaFallback(container, canvas, initialPanoUrl) {
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = initialPanoUrl;

  let offset = 0;
  let isDragging = false;
  let startX = 0;
  let isAutoLooking = false;
  let animId = null;

  img.onload = () => {
    draw();
  };

  function draw() {
    if (!canvas || !ctx || !img.complete) return;
    canvas.width = container.clientWidth || 800;
    canvas.height = container.clientHeight || 480;

    const sw = img.naturalWidth || 2048;
    const sh = img.naturalHeight || 1024;
    const viewWidth = sw * 0.45;

    let sx = (offset % sw + sw) % sw;
    ctx.drawImage(img, sx, 0, Math.min(viewWidth, sw - sx), sh, 0, 0, (Math.min(viewWidth, sw - sx) / viewWidth) * canvas.width, canvas.height);
    if (sx + viewWidth > sw) {
      const rest = (sx + viewWidth) - sw;
      ctx.drawImage(img, 0, 0, rest, sh, ((sw - sx) / viewWidth) * canvas.width, 0, (rest / viewWidth) * canvas.width, canvas.height);
    }
  }

  container.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offset -= (e.clientX - startX) * 2;
    startX = e.clientX;
    draw();
  });

  function autoStep() {
    if (isAutoLooking) {
      offset += 1.5;
      draw();
    }
    animId = requestAnimationFrame(autoStep);
  }
  autoStep();

  return {
    loadPanorama(newUrl) {
      img.src = newUrl;
    },
    toggleAutoLook() {
      isAutoLooking = !isAutoLooking;
      return isAutoLooking;
    },
    resetView() {
      offset = 0;
      draw();
    },
    destroy() {
      if (animId) cancelAnimationFrame(animId);
    }
  };
}

// 3D Rotatable Mesh Viewer using Three.js OBJLoader or Procedural Geometry
export function initStructured3dMesh(container, canvas, meshUrl, sceneId) {
  if (typeof THREE === 'undefined' || !canvas) {
    console.warn('Three.js not available for 3D mesh rendering');
    return { toggleAutoRotate: () => false, resetCamera: () => {}, destroy: () => {} };
  }

  try {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1329);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(20, 15, 25);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight.position.set(20, 30, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xfbbf24, 0.4);
    fillLight.position.set(-20, 15, -15);
    scene.add(fillLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Controls
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 + 0.05;
      controls.minDistance = 5;
      controls.maxDistance = 60;
    }

    // Load OBJ Model or Create Architectural Room Mesh
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    if (typeof THREE.OBJLoader !== 'undefined') {
      const loader = new THREE.OBJLoader();
      loader.load(
        meshUrl,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x93c5fd,
                roughness: 0.4,
                metalness: 0.1,
                wireframe: false
              });
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          // Center and scale model
          const box = new THREE.Box3().setFromObject(obj);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 14 / maxDim;
          obj.scale.set(scale, scale, scale);
          obj.position.sub(center.multiplyScalar(scale));
          obj.position.y += (size.y * scale) / 2;
          meshGroup.add(obj);
        },
        undefined,
        (err) => {
          console.warn('Could not load OBJ directly, building architectural representation:', err);
          buildArchitecturalFallbackMesh(meshGroup, sceneId);
        }
      );
    } else {
      buildArchitecturalFallbackMesh(meshGroup, sceneId);
    }

    let isAutoRotating = false;
    let animationId = null;

    function animate() {
      animationId = requestAnimationFrame(animate);
      if (controls) {
        controls.autoRotate = isAutoRotating;
        controls.autoRotateSpeed = 2.0;
        controls.update();
      } else if (isAutoRotating) {
        meshGroup.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return {
      toggleAutoRotate() {
        isAutoRotating = !isAutoRotating;
        return isAutoRotating;
      },
      resetCamera() {
        camera.position.set(20, 15, 25);
        if (controls) controls.target.set(0, 4, 0);
      },
      destroy() {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        if (controls) controls.dispose();
        renderer.dispose();
      }
    };
  } catch (err) {
    console.error('Three.js Mesh error:', err);
    return { toggleAutoRotate: () => false, resetCamera: () => {}, destroy: () => {} };
  }
}

// Procedural Architectural Mesh Fallback
function buildArchitecturalFallbackMesh(group, sceneId) {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true });
  const solidWallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

  // Main Floor
  const floorGeo = new THREE.BoxGeometry(16, 0.4, 18);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = 0.2;
  group.add(floor);

  // Exterior Walls
  const wallH = 6;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, wallH, 0.4), solidWallMat);
  backWall.position.set(0, wallH / 2 + 0.4, -9);
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, 18), solidWallMat);
  leftWall.position.set(-8, wallH / 2 + 0.4, 0);
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, 18), wallMat);
  rightWall.position.set(8, wallH / 2 + 0.4, 0);
  group.add(rightWall);

  // Interior Partitions
  const partWall = new THREE.Mesh(new THREE.BoxGeometry(8, wallH, 0.3), solidWallMat);
  partWall.position.set(-4, wallH / 2 + 0.4, 0);
  group.add(partWall);

  const partWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 9), wallMat);
  partWall2.position.set(0, wallH / 2 + 0.4, -4.5);
  group.add(partWall2);
}
