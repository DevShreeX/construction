// ==================== Architectural CAD 3D Smart Construction House Engine ====================
// Precision-modeled after the reference architectural CAD drawing:
// 45° Pitch Cross-Gable Roof with Valley (A = 107.5°), Horizontal Timber Wood Siding,
// Textured Earthy Clay Brick Ground Floor, Concrete Plinth, Paver Patio & Lawn Base,
// and CAD Dimension Overlays (L = 8.65m, H = 3.20m, H = 2.90m, Roof Pitch: 45°, Compass & XYZ Trihedron)

import * as THREE from 'three';
import { CONSTRUCTION_FEATURES, getFeatureById } from './constructionFeaturesData.js';

export class ConstructionHouse3D {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    this.mountEl = options.mountEl
      ? (typeof options.mountEl === 'string' ? document.querySelector(options.mountEl) : options.mountEl)
      : this.container?.querySelector('.skill-canvas-mount');

    this.labelsOverlay = options.labelsOverlay
      ? (typeof options.labelsOverlay === 'string' ? document.querySelector(options.labelsOverlay) : options.labelsOverlay)
      : this.container?.querySelector('.skill-labels-overlay');

    this.svgLinesEl = options.svgLinesEl
      ? (typeof options.svgLinesEl === 'string' ? document.querySelector(options.svgLinesEl) : options.svgLinesEl)
      : this.container?.querySelector('.skill-lines-svg');

    this.detailCardEl = options.detailCardEl
      ? (typeof options.detailCardEl === 'string' ? document.querySelector(options.detailCardEl) : options.detailCardEl)
      : this.container?.querySelector('.skill-detail-card');

    this.fallbackEl = options.fallbackEl
      ? (typeof options.fallbackEl === 'string' ? document.querySelector(options.fallbackEl) : options.fallbackEl)
      : this.container?.querySelector('.skill-fallback-layout');

    this.activeCategory = options.initialCategory || 'ALL';
    this.isRotating = true;
    this.isDestroyed = false;
    this.isInViewport = true;
    this.hoveredFeatureId = null;
    this.selectedFeatureId = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.normalizedPointer = new THREE.Vector2(-999, -999);
    this.raycaster = new THREE.Raycaster();

    this.featureNodeMeshes = [];
    this.houseConnectionLines = [];
    this.dataPackets = [];
    this.htmlLabelElements = new Map();
    this.disposables = [];
    this.interactiveHouseMaterials = [];

    // User-customizable exterior materials
    this.brickWallMeshes = [];
    this.woodWallMeshes = [];
    this.roofMeshes = [];

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      this.isRotating = false;
    }

    this.init();
  }

  // ==================== WebGL Detection & Init ====================
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!this.checkWebGLSupport()) {
      console.warn('[ConstructionHouse3D] WebGL unavailable, falling back to 2D UI.');
      this.render2DFallback();
      return;
    }

    if (!this.mountEl) {
      console.error('[ConstructionHouse3D] Mount container element not found.');
      return;
    }

    this.setupScene();
    this.createProceduralTextures();
    this.createCADGroundAndCompass();
    this.createArchitecturalHouseModel();
    this.createCADDimensionAnnotations();
    this.createCADTrihedron();
    this.createFeatureNodes();
    this.createHouseConduits();
    this.createDataPulseSystem();
    this.createAtmosphericParticles();
    this.createHtmlLabels();
    this.setupEventListeners();
    this.setupIntersectionObserver();

    this.clock = new THREE.Clock();
    this.animate();
  }

  // ==================== Scene & Isometric Perspective Camera ====================
  setupScene() {
    this.width = this.mountEl.clientWidth || 920;
    this.height = this.mountEl.clientHeight || 680;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const cameraDistance = isMobile ? 21 : (isTablet ? 18.5 : 16.0);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060f1e, 0.011);

    // Isometric-angled perspective camera matching the CAD reference (azimuth ~36°, elevation ~30°)
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
    this.camera.position.set(cameraDistance * 0.76, cameraDistance * 0.56, cameraDistance * 0.84);
    this.camera.lookAt(0, 0.4, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.mountEl.innerHTML = '';
    this.mountEl.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    // Master universe pivot group for mouse parallax & tilt
    this.universeGroup = new THREE.Group();
    this.scene.add(this.universeGroup);

    // Realistic Architectural Lighting (Clean warm sunlight + sky fill daylight)
    // Avoids garish neon cyan/purple light floods
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 1.15);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    sunLight.position.set(15, 22, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0004;
    this.scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xdbeafe, 0.8);
    skyFill.position.set(-14, 12, -12);
    this.scene.add(skyFill);

    const groundBounce = new THREE.DirectionalLight(0x64748b, 0.4);
    groundBounce.position.set(0, -10, 8);
    this.scene.add(groundBounce);
  }

  // ==================== Procedural High-Res Canvas Textures ====================
  createProceduralTextures() {
    // 1. Earthy Tan Clay Brick (Running-Bond)
    this.brickTexture = this.generateBrickTexture();
    // 2. Warm Natural Cedar Wood Siding (Horizontal Planks)
    this.woodSidingTexture = this.generateWoodSidingTexture();
    // 3. Architectural Slate Grey Shingles (45° Cross-Gable Shingles)
    this.roofShingleTexture = this.generateRoofShingleTexture();
    // 4. Concrete Pavers (Patio Walkway)
    this.paverTexture = this.generatePaverTexture();
    // 5. Natural Lawn Turf
    this.grassTexture = this.generateGrassTexture();
  }

  generateBrickTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Sand/Lime mortar background
    ctx.fillStyle = '#d8d1c7';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 32;
    const cols = 8;
    const brickH = 512 / rows;
    const brickW = 512 / cols;
    const mortar = 2.4;

    const brickTones = [
      '#8e684d', '#977054', '#7f593f', '#a1795b',
      '#886248', '#926b4f', '#775239', '#9a7356'
    ];

    for (let r = 0; r < rows; r++) {
      const y = r * brickH + mortar / 2;
      const h = brickH - mortar;
      const offset = (r % 2) * (brickW / 2);

      for (let c = -1; c <= cols + 1; c++) {
        const x = c * brickW + offset + mortar / 2;
        const w = brickW - mortar;

        const tone = brickTones[(r * 7 + c * 13 + 3) % brickTones.length];
        ctx.fillStyle = tone;
        ctx.fillRect(x, y, w, h);

        // Brick surface grain
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(x, y + h - 2, w, 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x, y, w, 2);
      }
    }

    // Micro-speckle noise for realistic masonry texture
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.5) * 14;
      d[i] = Math.min(255, Math.max(0, d[i] + noise));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 2.5);
    return texture;
  }

  generateWoodSidingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Natural warm timber cedar
    ctx.fillStyle = '#aa835d';
    ctx.fillRect(0, 0, 512, 512);

    const planks = 28;
    const plankH = 512 / planks;
    const plankColors = ['#a9815a', '#b38d67', '#9e7852', '#ba936c', '#98724d'];

    for (let i = 0; i < planks; i++) {
      const y = i * plankH;
      ctx.fillStyle = plankColors[i % plankColors.length];
      ctx.fillRect(0, y, 512, plankH);

      // Fine horizontal grain streaks
      for (let g = 0; g < 3; g++) {
        const gy = y + 2 + Math.random() * (plankH - 4);
        ctx.fillStyle = 'rgba(90, 60, 35, 0.12)';
        ctx.fillRect(0, gy, 512, 1);
      }

      // Horizontal plank overlap shadow and highlight
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, y + plankH - 2, 512, 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fillRect(0, y, 512, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  generateRoofShingleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Slate base
    ctx.fillStyle = '#3a4048';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 24;
    const cols = 16;
    const rowH = 512 / rows;
    const colW = 512 / cols;

    const slateTones = ['#4e555f', '#444b54', '#555d67', '#3d434b', '#59616c', '#495059'];

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const offset = (r % 2) * (colW / 2);

      for (let c = -1; c <= cols + 1; c++) {
        const x = c * colW + offset;
        const tone = slateTones[(r * 5 + c * 11) % slateTones.length];
        ctx.fillStyle = tone;
        ctx.fillRect(x + 1, y + 1, colW - 2, rowH - 2);

        // Shingle drop shadow (creates overlapping 3D appearance)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(x, y + rowH - 2.5, colW, 2.5);

        // Shingle top subtle bevel
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(x + 1, y + 1, colW - 2, 1);

        // Vertical seam between shingles
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x + colW - 1.5, y + 1, 1.5, rowH - 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  generatePaverTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, 256, 256);

    const pavers = 8;
    const size = 256 / pavers;
    const tones = ['#94a3b8', '#8898ac', '#a2b1c2', '#7e8e9e'];

    for (let r = 0; r < pavers; r++) {
      for (let c = 0; c < pavers; c++) {
        ctx.fillStyle = tones[(r * 3 + c * 7) % tones.length];
        ctx.fillRect(c * size + 1.5, r * size + 1.5, size - 3, size - 3);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(c * size + 1.5, (r + 1) * size - 2.5, size - 3, 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  generateGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#4c7838';
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.fillStyle = Math.random() > 0.5 ? '#5d9145' : '#3d612d';
      ctx.fillRect(x, y, 1.5, 2.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }

  // ==================== CAD Blueprint Ground Disc & Compass ====================
  createCADGroundAndCompass() {
    this.groundGroup = new THREE.Group();
    this.groundGroup.position.y = -1.95;
    this.universeGroup.add(this.groundGroup);

    // 1. Subtle CAD Blueprint Grid on Dark Slate
    const gridHelper = new THREE.GridHelper(26, 36, 0x334155, 0x1e293b);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    this.groundGroup.add(gridHelper);
    this.disposables.push(gridHelper.geometry, gridHelper.material);

    // 2. CAD Compass Outer & Inner Rings
    const ringPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * 8.4, 0.02, Math.sin(theta) * 8.4));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.45
    });
    const compassRing = new THREE.Line(ringGeo, ringMat);
    this.groundGroup.add(compassRing);
    this.disposables.push(ringGeo, ringMat);

    // Cardinal Labels (N, S, E, W)
    const addCardinal = (text, x, z) => {
      const sprite = this.createCADTextSprite(text, 22, '#cbd5e1', false);
      sprite.position.set(x, 0.15, z);
      sprite.scale.set(0.9, 0.5, 1);
      this.groundGroup.add(sprite);
    };
    addCardinal('N', 0, -8.9);
    addCardinal('S', 0, 8.9);
    addCardinal('E', 8.9, 0);
    addCardinal('W', -8.9, 0);

    // 3. Concrete Foundation Plinth / Slab (Light Architectural Concrete)
    const plinthGeo = new THREE.BoxGeometry(8.0, 0.35, 6.8);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.8,
      metalness: 0.08
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(-0.2, 0.18, -0.2);
    plinth.receiveShadow = true;
    this.groundGroup.add(plinth);
    this.disposables.push(plinthGeo, plinthMat);

    // 4. Paver Walkway & Natural Lawn Strips (Matches Reference Image)
    // Paver walkway in front of entrance and extending along front edge
    const walkwayGeo = new THREE.BoxGeometry(4.2, 0.06, 2.2);
    const walkwayMat = new THREE.MeshStandardMaterial({
      map: this.paverTexture,
      roughness: 0.85,
      metalness: 0.05
    });
    const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
    walkway.position.set(0.2, 0.37, 2.8);
    walkway.receiveShadow = true;
    this.groundGroup.add(walkway);
    this.disposables.push(walkwayGeo, walkwayMat);

    // Side walkway strip
    const sideWalkwayGeo = new THREE.BoxGeometry(1.6, 0.06, 4.4);
    const sideWalkway = new THREE.Mesh(sideWalkwayGeo, walkwayMat);
    sideWalkway.position.set(3.0, 0.37, 0.8);
    sideWalkway.receiveShadow = true;
    this.groundGroup.add(sideWalkway);
    this.disposables.push(sideWalkwayGeo);

    // Lawn grass strip along the front
    const lawnGeo = new THREE.BoxGeometry(7.6, 0.08, 0.95);
    const lawnMat = new THREE.MeshStandardMaterial({
      map: this.grassTexture,
      roughness: 0.9,
      metalness: 0.0
    });
    const lawnFront = new THREE.Mesh(lawnGeo, lawnMat);
    lawnFront.position.set(-0.2, 0.28, 3.4);
    lawnFront.receiveShadow = true;
    this.groundGroup.add(lawnFront);
    this.disposables.push(lawnGeo, lawnMat);

    // Lawn curb concrete border
    const curbGeo = new THREE.BoxGeometry(7.8, 0.12, 0.12);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const curbFront = new THREE.Mesh(curbGeo, curbMat);
    curbFront.position.set(-0.2, 0.35, 3.9);
    this.groundGroup.add(curbFront);
    this.disposables.push(curbGeo, curbMat);

    // Natural Organic Shrub / Bush on the left corner
    this.createCornerBush(-3.5, 0.5, 2.8);
  }

  createCornerBush(x, y, z) {
    const bushGroup = new THREE.Group();
    bushGroup.position.set(x, y, z);
    const bushMat = new THREE.MeshStandardMaterial({
      color: 0x3d662c,
      roughness: 0.9,
      metalness: 0.0
    });

    const sphereCoords = [
      [0, 0, 0, 0.42],
      [0.22, 0.12, -0.1, 0.35],
      [-0.18, 0.08, 0.15, 0.32],
      [0.1, -0.08, 0.2, 0.3],
      [-0.15, 0.16, -0.15, 0.28]
    ];

    sphereCoords.forEach(([sx, sy, sz, radius]) => {
      const geo = new THREE.SphereGeometry(radius, 10, 8);
      const mesh = new THREE.Mesh(geo, bushMat);
      mesh.position.set(sx, sy, sz);
      mesh.castShadow = true;
      bushGroup.add(mesh);
      this.disposables.push(geo);
    });

    this.groundGroup.add(bushGroup);
    this.disposables.push(bushMat);
  }

  // ==================== Authentic 3D Architectural House Model ====================
  createArchitecturalHouseModel() {
    this.houseGroup = new THREE.Group();
    this.universeGroup.add(this.houseGroup);

    // Materials Palette matching the CAD reference image:
    // 1. Brick Ground Floor
    this.brickMat = new THREE.MeshStandardMaterial({
      map: this.brickTexture,
      roughness: 0.82,
      metalness: 0.05
    });
    this.interactiveHouseMaterials.push(this.brickMat);

    // 2. Upper Timber / Cedar Wood Siding
    this.woodSidingMat = new THREE.MeshStandardMaterial({
      map: this.woodSidingTexture,
      roughness: 0.76,
      metalness: 0.08
    });
    this.interactiveHouseMaterials.push(this.woodSidingMat);

    // 3. Roof Slate Shingles (Grey Tiles)
    this.roofMat = new THREE.MeshStandardMaterial({
      map: this.roofShingleTexture,
      roughness: 0.7,
      metalness: 0.12
    });
    this.interactiveHouseMaterials.push(this.roofMat);

    // 4. White Architectural Trim / Moldings / Casings
    this.whiteTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.1
    });

    // 5. Architectural Glass (Reflective dark casement panes)
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.92,
      transparent: true,
      opacity: 0.65,
      transmission: 0.35,
      ior: 1.5
    });

    // 6. Modern Entrance Door
    this.doorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.25
    });

    this.disposables.push(this.brickMat, this.woodSidingMat, this.roofMat, this.whiteTrimMat, this.glassMat, this.doorMat);

    const groundFloorH = 1.65;
    const upperFloorH = 1.55;

    // -------------------------------------------------------------
    // 1. Ground Floor (Textured Brick Facade)
    // -------------------------------------------------------------
    // Main Body Block (Left/Depth Wing)
    const gfMainGeo = new THREE.BoxGeometry(5.2, groundFloorH, 3.4);
    const gfMain = new THREE.Mesh(gfMainGeo, this.brickMat);
    gfMain.position.set(-0.3, -0.9, -0.4);
    gfMain.castShadow = true;
    gfMain.receiveShadow = true;
    this.houseGroup.add(gfMain);
    this.brickWallMeshes.push(gfMain);

    // Front Projecting Gable Wing Ground Floor (Right-Front Wing)
    const gfFrontGeo = new THREE.BoxGeometry(2.6, groundFloorH, 1.8);
    const gfFront = new THREE.Mesh(gfFrontGeo, this.brickMat);
    gfFront.position.set(1.0, -0.9, 1.3);
    gfFront.castShadow = true;
    gfFront.receiveShadow = true;
    this.houseGroup.add(gfFront);
    this.brickWallMeshes.push(gfFront);

    // -------------------------------------------------------------
    // 2. Horizontal White Frieze / Belt Course Board (Separates Brick & Timber)
    // -------------------------------------------------------------
    const belt1Geo = new THREE.BoxGeometry(5.35, 0.12, 3.55);
    const belt1 = new THREE.Mesh(belt1Geo, this.whiteTrimMat);
    belt1.position.set(-0.3, -0.05, -0.4);
    belt1.castShadow = true;
    this.houseGroup.add(belt1);

    const belt2Geo = new THREE.BoxGeometry(2.75, 0.12, 1.95);
    const belt2 = new THREE.Mesh(belt2Geo, this.whiteTrimMat);
    belt2.position.set(1.0, -0.05, 1.3);
    belt2.castShadow = true;
    this.houseGroup.add(belt2);

    // -------------------------------------------------------------
    // 3. Upper Story (Horizontal Timber Wood Siding)
    // -------------------------------------------------------------
    // Main Upper Floor Block
    const ufMainGeo = new THREE.BoxGeometry(5.0, upperFloorH, 3.3);
    const ufMain = new THREE.Mesh(ufMainGeo, this.woodSidingMat);
    ufMain.position.set(-0.3, 0.78, -0.4);
    ufMain.castShadow = true;
    ufMain.receiveShadow = true;
    this.houseGroup.add(ufMain);
    this.woodWallMeshes.push(ufMain);

    // Front Projecting Gable Upper Floor
    const ufFrontGeo = new THREE.BoxGeometry(2.5, upperFloorH, 1.8);
    const ufFront = new THREE.Mesh(ufFrontGeo, this.woodSidingMat);
    ufFront.position.set(1.0, 0.78, 1.3);
    ufFront.castShadow = true;
    ufFront.receiveShadow = true;
    this.houseGroup.add(ufFront);
    this.woodWallMeshes.push(ufFront);

    // Triangular Gable Pediments (Left Main Gable & Front Cross Gable)
    const createTriangleGableWall = (width, height, mat) => {
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2, 0);
      shape.lineTo(width / 2, 0);
      shape.lineTo(0, height);
      shape.closePath();
      const extrudeSettings = { depth: 0.14, bevelEnabled: false };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    // Left Main Gable Wall (Pitched 45°)
    const leftGableGeo = createTriangleGableWall(3.3, 1.65, this.woodSidingMat);
    const leftGable = new THREE.Mesh(leftGableGeo, this.woodSidingMat);
    leftGable.position.set(-2.85, 1.55, 1.25);
    leftGable.rotation.y = Math.PI / 2;
    leftGable.castShadow = true;
    this.houseGroup.add(leftGable);
    this.woodWallMeshes.push(leftGable);

    // Front Gable Wall (Pitched 45°)
    const frontGableGeo = createTriangleGableWall(2.5, 1.25, this.woodSidingMat);
    const frontGable = new THREE.Mesh(frontGableGeo, this.woodSidingMat);
    frontGable.position.set(1.0, 1.55, 2.15);
    frontGable.castShadow = true;
    this.houseGroup.add(frontGable);
    this.woodWallMeshes.push(frontGable);

    // -------------------------------------------------------------
    // 4. 45° Pitch Cross-Gable Roof with Authentic Valley (A = 107.5°)
    // -------------------------------------------------------------
    const mainRoofSlopeLen = 2.45;
    const mainRoofLen = 5.6;
    const slopeGeo = new THREE.BoxGeometry(mainRoofLen, 0.10, mainRoofSlopeLen);

    // South/Front Slope of Main Longitudinal Roof (45° pitch)
    const slope1 = new THREE.Mesh(slopeGeo, this.roofMat);
    slope1.position.set(-0.3, 2.38, 0.42);
    slope1.rotation.x = Math.PI / 4;
    slope1.castShadow = true;
    slope1.receiveShadow = true;
    this.houseGroup.add(slope1);
    this.roofMeshes.push(slope1);

    // North/Back Slope of Main Longitudinal Roof (45° pitch)
    const slope2 = new THREE.Mesh(slopeGeo, this.roofMat);
    slope2.position.set(-0.3, 2.38, -1.22);
    slope2.rotation.x = -Math.PI / 4;
    slope2.castShadow = true;
    slope2.receiveShadow = true;
    this.houseGroup.add(slope2);
    this.roofMeshes.push(slope2);

    // Front Projecting Gable Slopes (Intersecting valley at 90° layout, 107.5° dihedral angle)
    const frontRoofSlopeLen = 1.95;
    const frontRoofLen = 2.8;
    const fSlopeGeo = new THREE.BoxGeometry(frontRoofLen, 0.10, frontRoofSlopeLen);

    // East Slope of Front Gable
    const fSlopeE = new THREE.Mesh(fSlopeGeo, this.roofMat);
    fSlopeE.position.set(1.68, 2.18, 1.3);
    fSlopeE.rotation.z = -Math.PI / 4;
    fSlopeE.rotation.y = Math.PI / 2;
    fSlopeE.castShadow = true;
    fSlopeE.receiveShadow = true;
    this.houseGroup.add(fSlopeE);
    this.roofMeshes.push(fSlopeE);

    // West Slope of Front Gable
    const fSlopeW = new THREE.Mesh(fSlopeGeo, this.roofMat);
    fSlopeW.position.set(0.32, 2.18, 1.3);
    fSlopeW.rotation.z = Math.PI / 4;
    fSlopeW.rotation.y = Math.PI / 2;
    fSlopeW.castShadow = true;
    fSlopeW.receiveShadow = true;
    this.houseGroup.add(fSlopeW);
    this.roofMeshes.push(fSlopeW);

    // White Bargeboards & Fascia Trim along the roof rakes
    this.createRoofTrims();

    // -------------------------------------------------------------
    // 5. Casement Windows with White Trim & Mullions
    // -------------------------------------------------------------
    this.windowFrames = [];
    // Ground Floor Windows
    // Front right window (on projecting brick wing)
    this.addCasementWindow(2.0, -0.75, 2.22, 0.95, 1.05, false, 2, 2);
    // Front right side window
    this.addCasementWindow(2.32, -0.75, 0.5, 0.85, 1.0, true, 2, 2);
    // Left side ground floor window
    this.addCasementWindow(-2.82, -0.75, 0.2, 0.85, 0.9, true, 2, 2);

    // Upper Floor Windows (Horizontal Timber Wood Siding)
    // Front gable upper double-window
    this.addCasementWindow(0.45, 0.95, 2.22, 0.78, 0.95, false, 2, 2);
    // Front gable upper single-window
    this.addCasementWindow(1.55, 0.95, 2.22, 0.78, 0.95, false, 2, 2);
    // Left side upper floor wide 3-pane window
    this.addCasementWindow(-2.82, 0.95, -0.4, 1.6, 0.85, true, 3, 2);
    // Right side upper floor window
    this.addCasementWindow(2.22, 0.95, -0.4, 0.8, 0.9, true, 2, 2);

    // -------------------------------------------------------------
    // 6. Recessed Modern Entrance Door & Concrete Steps
    // -------------------------------------------------------------
    // Recessed entry alcove door
    const doorGeo = new THREE.BoxGeometry(0.85, 1.45, 0.08);
    const door = new THREE.Mesh(doorGeo, this.doorMat);
    door.position.set(-0.15, -0.85, 2.05);
    this.houseGroup.add(door);

    // Door white casing surround
    const doorTrimGeo = new THREE.BoxGeometry(0.95, 1.55, 0.04);
    const doorTrim = new THREE.Mesh(doorTrimGeo, this.whiteTrimMat);
    doorTrim.position.set(-0.15, -0.85, 2.02);
    this.houseGroup.add(doorTrim);

    // Sidelight glass pane
    const sideLightGeo = new THREE.BoxGeometry(0.24, 1.35, 0.06);
    const sideLight = new THREE.Mesh(sideLightGeo, this.glassMat);
    sideLight.position.set(0.32, -0.85, 2.06);
    this.houseGroup.add(sideLight);

    // Concrete Entrance Porch Steps (3-tier cantilevered)
    for (let s = 0; s < 3; s++) {
      const stepGeo = new THREE.BoxGeometry(1.3 - s * 0.18, 0.12, 0.38);
      const stepMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.75 });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(-0.15, -1.6 + s * 0.12, 2.35 + (2 - s) * 0.26);
      step.receiveShadow = true;
      this.houseGroup.add(step);
      this.disposables.push(stepGeo, stepMat);
    }

    // -------------------------------------------------------------
    // 7. Interior Warm Illumination (Glows softly through windows)
    // -------------------------------------------------------------
    this.interiorLight = new THREE.PointLight(0xffeedd, 1.6, 9.0);
    this.interiorLight.position.set(0.5, 0.5, 0.2);
    this.houseGroup.add(this.interiorLight);

    // Register all disposables
    this.disposables.push(
      gfMainGeo, gfFrontGeo, belt1Geo, belt2Geo, ufMainGeo, ufFrontGeo,
      leftGableGeo, frontGableGeo, slopeGeo, fSlopeGeo, doorGeo, doorTrimGeo, sideLightGeo
    );

    // Attachment coordinates for feature conduits
    this.houseAttachmentPoints = {
      'roof': new THREE.Vector3(1.0, 3.2, 1.3),
      'upper-cantilever': new THREE.Vector3(-1.6, 1.4, 1.6),
      'interior': new THREE.Vector3(1.0, 0.6, 1.2),
      'walls': new THREE.Vector3(2.3, -0.4, 0.5),
      'exterior-facade': new THREE.Vector3(-2.8, 0.8, -0.4),
      'foundation-slab': new THREE.Vector3(-0.2, -1.8, 2.4),
      'ground-plane': new THREE.Vector3(-3.2, -1.9, 2.2),
      'ground-floor-door': new THREE.Vector3(-0.15, -0.8, 2.05),
      'structural-columns': new THREE.Vector3(2.2, -0.8, 2.2),
      'balcony-railing': new THREE.Vector3(-1.6, 0.6, 2.1)
    };
  }

  createRoofTrims() {
    // White bargeboard fascia trim along front gable rakes
    const rakeLen = 1.85;
    const rakeGeo = new THREE.BoxGeometry(rakeLen, 0.08, 0.14);

    const rakeE = new THREE.Mesh(rakeGeo, this.whiteTrimMat);
    rakeE.position.set(1.68, 2.22, 2.25);
    rakeE.rotation.z = -Math.PI / 4;
    rakeE.rotation.y = Math.PI / 2;
    this.houseGroup.add(rakeE);

    const rakeW = new THREE.Mesh(rakeGeo, this.whiteTrimMat);
    rakeW.position.set(0.32, 2.22, 2.25);
    rakeW.rotation.z = Math.PI / 4;
    rakeW.rotation.y = Math.PI / 2;
    this.houseGroup.add(rakeW);

    this.disposables.push(rakeGeo);
  }

  addCasementWindow(x, y, z, w, h, isRotY = false, cols = 2, rows = 2) {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(x, y, z);
    if (isRotY) frameGroup.rotation.y = Math.PI / 2;

    // Outer white casing frame
    const frameGeo = new THREE.BoxGeometry(w, h, 0.08);
    const frame = new THREE.Mesh(frameGeo, this.whiteTrimMat);
    frameGroup.add(frame);

    // Sill (bottom projecting white ledge)
    const sillGeo = new THREE.BoxGeometry(w + 0.14, 0.06, 0.12);
    const sill = new THREE.Mesh(sillGeo, this.whiteTrimMat);
    sill.position.set(0, -h / 2 - 0.02, 0.02);
    frameGroup.add(sill);

    // Reflective glass pane
    const glassGeo = new THREE.BoxGeometry(w - 0.12, h - 0.12, 0.04);
    const glass = new THREE.Mesh(glassGeo, this.glassMat);
    frameGroup.add(glass);

    // Mullion dividers (white crossbars)
    if (cols > 1) {
      const vertMullionGeo = new THREE.BoxGeometry(0.03, h - 0.12, 0.05);
      const vertMullion = new THREE.Mesh(vertMullionGeo, this.whiteTrimMat);
      frameGroup.add(vertMullion);
      this.disposables.push(vertMullionGeo);
    }
    if (rows > 1) {
      const horizMullionGeo = new THREE.BoxGeometry(w - 0.12, 0.03, 0.05);
      const horizMullion = new THREE.Mesh(horizMullionGeo, this.whiteTrimMat);
      frameGroup.add(horizMullion);
      this.disposables.push(horizMullionGeo);
    }

    this.houseGroup.add(frameGroup);
    this.windowFrames.push(frameGroup);
    this.disposables.push(frameGeo, sillGeo, glassGeo);
  }

  // ==================== CAD Dimension Overlays (Exact Reference Image) ====================
  createCADDimensionAnnotations() {
    this.cadAnnotationsGroup = new THREE.Group();
    this.universeGroup.add(this.cadAnnotationsGroup);

    // 1. Front Dimension Line: L = 8.65m
    const frontY = -1.72;
    const frontZ = 4.3;
    const pFrontL = new THREE.Vector3(-2.9, frontY, frontZ);
    const pFrontR = new THREE.Vector3(2.9, frontY, frontZ);
    this.createDimensionLine(pFrontL, pFrontR, 0xffffff);

    const labelL = this.createCADTextSprite('L = 8.65m', 24, '#ffffff');
    labelL.position.set(0, frontY + 0.35, frontZ);
    labelL.scale.set(2.4, 0.75, 1);
    this.cadAnnotationsGroup.add(labelL);

    // 2. Left Side Ground Dimension Line: H = 3.20m
    const sideX = -4.3;
    const pSide1 = new THREE.Vector3(sideX, -1.72, -1.8);
    const pSide2 = new THREE.Vector3(sideX, -1.72, 1.8);
    this.createDimensionLine(pSide1, pSide2, 0xffffff);

    const labelSide = this.createCADTextSprite('H = 3.20m', 24, '#ffffff');
    labelSide.position.set(sideX, -1.35, 0);
    labelSide.scale.set(2.4, 0.75, 1);
    this.cadAnnotationsGroup.add(labelSide);

    // 3. Side Vertical Eaves Height: H = 3.20m with Vertical Arrow & "Z"
    const pVertB = new THREE.Vector3(sideX, -1.72, -0.1);
    const pVertT = new THREE.Vector3(sideX, 1.55, -0.1);
    this.createDimensionLine(pVertB, pVertT, 0xffffff);

    const labelH1 = this.createCADTextSprite('H = 3.20m', 24, '#ffffff');
    labelH1.position.set(sideX - 0.25, -0.1, -0.1);
    labelH1.scale.set(2.4, 0.75, 1);
    this.cadAnnotationsGroup.add(labelH1);

    const labelZ = this.createCADTextSprite('Z', 24, '#ffffff', false);
    labelZ.position.set(sideX, 2.1, -0.1);
    labelZ.scale.set(0.7, 0.5, 1);
    this.cadAnnotationsGroup.add(labelZ);

    // 4. Roof Apex Height: H = 2.90m (Right side vertical dimension)
    const rightX = 3.9;
    const pRightB = new THREE.Vector3(rightX, 0.0, 1.3);
    const pRightT = new THREE.Vector3(rightX, 2.9, 1.3);
    this.createDimensionLine(pRightB, pRightT, 0xffffff);

    const labelH2 = this.createCADTextSprite('H = 2.90m', 24, '#ffffff');
    labelH2.position.set(rightX + 0.35, 1.45, 1.3);
    labelH2.scale.set(2.4, 0.75, 1);
    this.cadAnnotationsGroup.add(labelH2);

    // 5. Roof Pitch Annotation: Roof Pitch: 45°
    const pitchLabel = this.createCADTextSprite('Roof Pitch: 45°', 24, '#ffffff');
    pitchLabel.position.set(2.6, 3.45, -0.4);
    pitchLabel.scale.set(2.7, 0.75, 1);
    this.cadAnnotationsGroup.add(pitchLabel);

    // 6. Roof Valley Angle Callout: A = 107.5°
    const angleLabel = this.createCADTextSprite('A = 107.5°', 24, '#ffffff');
    angleLabel.position.set(0.35, 1.65, 1.35);
    angleLabel.scale.set(2.4, 0.75, 1);
    this.cadAnnotationsGroup.add(angleLabel);

    // Curved Valley Angle Arc with double arrows
    const arcPoints = [];
    for (let a = 0; a <= 20; a++) {
      const ang = Math.PI * 0.15 + (a / 20) * Math.PI * 0.45;
      arcPoints.push(new THREE.Vector3(Math.cos(ang) * 0.8 + 0.2, Math.sin(ang) * 0.6 + 1.25, 1.3));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5 });
    this.cadAnnotationsGroup.add(new THREE.Line(arcGeo, arcMat));
    this.disposables.push(arcGeo, arcMat);
  }

  createDimensionLine(pA, pB, colorHex = 0xffffff) {
    const points = [pA, pB];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 1.5 });
    const line = new THREE.Line(lineGeo, lineMat);
    this.cadAnnotationsGroup.add(line);

    // CAD Arrowheads / Extension Ticks at both ends
    const dir = new THREE.Vector3().subVectors(pB, pA).normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(0.22);

    const tick1Geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3().copy(pA).add(perp),
      new THREE.Vector3().copy(pA).sub(perp)
    ]);
    const tick2Geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3().copy(pB).add(perp),
      new THREE.Vector3().copy(pB).sub(perp)
    ]);
    this.cadAnnotationsGroup.add(new THREE.Line(tick1Geo, lineMat));
    this.cadAnnotationsGroup.add(new THREE.Line(tick2Geo, lineMat));
    this.disposables.push(lineGeo, tick1Geo, tick2Geo, lineMat);
  }

  createCADTextSprite(text, fontSize = 24, textColor = '#ffffff', hasBackground = true) {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    if (hasBackground) {
      // Subtle architectural dark slate badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.roundRect(4, 4, 352, 82, 10);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.roundRect(4, 4, 352, 82, 10);
      ctx.stroke();
    }

    ctx.fillStyle = textColor;
    ctx.font = `600 ${fontSize}px "Inter", -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 180, 45);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    this.disposables.push(texture, material);
    return sprite;
  }

  // ==================== CAD 3D Coordinate Trihedron (Bottom Left) ====================
  createCADTrihedron() {
    this.trihedronGroup = new THREE.Group();
    this.trihedronGroup.position.set(-6.2, -2.2, 5.2);
    this.universeGroup.add(this.trihedronGroup);

    const len = 1.25;
    // X-Axis (Red)
    const xGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(len, 0, 0)]);
    const xMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    this.trihedronGroup.add(new THREE.Line(xGeo, xMat));

    // Y-Axis (Green)
    const yGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -len)]);
    const yMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    this.trihedronGroup.add(new THREE.Line(yGeo, yMat));

    // Z-Axis (Blue/Cyan)
    const zGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, len, 0)]);
    const zMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    this.trihedronGroup.add(new THREE.Line(zGeo, zMat));

    // Axis Labels
    const addAxisLabel = (text, color, pos) => {
      const sprite = this.createCADTextSprite(text, 22, color, false);
      sprite.position.copy(pos);
      sprite.scale.set(0.65, 0.45, 1);
      this.trihedronGroup.add(sprite);
    };
    addAxisLabel('X-Axis', '#ef4444', new THREE.Vector3(len + 0.35, 0, 0));
    addAxisLabel('Y-Axis', '#10b981', new THREE.Vector3(0, 0, -len - 0.35));
    addAxisLabel('Z-Axis', '#38bdf8', new THREE.Vector3(0, len + 0.35, 0));

    this.disposables.push(xGeo, yGeo, zGeo, xMat, yMat, zMat);
  }

  // ==================== 12 Floating Feature Nodes & Conduits ====================
  createFeatureNodes() {
    this.nodesGroup = new THREE.Group();
    this.universeGroup.add(this.nodesGroup);

    CONSTRUCTION_FEATURES.forEach((feature, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.userData = { feature, index: idx, id: feature.id };

      const angle = feature.orbitAngle;
      const x = Math.cos(angle) * (feature.radiusX || 7.6);
      const z = Math.sin(angle) * (feature.radiusY || 5.4);
      const y = (feature.elevation || 0) * 1.1;

      nodeGroup.position.set(x, y, z);
      nodeGroup.userData.basePos = new THREE.Vector3(x, y, z);
      nodeGroup.userData.floatOffset = idx * 0.55;

      // 1. Sleek Core Sphere (Frosted Glass / Tech Metal)
      const sphereGeo = new THREE.SphereGeometry(0.32, 16, 14);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: feature.colorHex,
        emissive: feature.colorHex,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.8
      });
      const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
      coreSphere.userData = { featureId: feature.id, isRaycastTarget: true };
      nodeGroup.add(coreSphere);
      this.disposables.push(sphereGeo, sphereMat);

      // 2. Subtle Outer Icosahedron Ring
      const shellGeo = new THREE.IcosahedronGeometry(0.48, 1);
      const shellWire = new THREE.WireframeGeometry(shellGeo);
      const shellMat = new THREE.LineBasicMaterial({
        color: feature.colorHex,
        transparent: true,
        opacity: 0.45
      });
      const shellMesh = new THREE.LineSegments(shellWire, shellMat);
      nodeGroup.add(shellMesh);
      this.disposables.push(shellGeo, shellWire, shellMat);

      // 3. Thin White Gyro Ring
      const gyroPoints = [];
      for (let i = 0; i <= 32; i++) {
        const theta = (i / 32) * Math.PI * 2;
        gyroPoints.push(new THREE.Vector3(Math.cos(theta) * 0.62, Math.sin(theta) * 0.62, 0));
      }
      const gyroGeo = new THREE.BufferGeometry().setFromPoints(gyroPoints);
      const gyroMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35
      });
      const gyroRing = new THREE.LineLoop(gyroGeo, gyroMat);
      gyroRing.rotation.x = Math.PI / 3;
      gyroRing.rotation.y = (idx % 3) * 0.45;
      nodeGroup.add(gyroRing);
      this.disposables.push(gyroGeo, gyroMat);

      // 4. Soft Local Point Light
      const light = new THREE.PointLight(feature.colorHex, 0.9, 4.5);
      nodeGroup.add(light);

      this.nodesGroup.add(nodeGroup);
      this.featureNodeMeshes.push({
        group: nodeGroup,
        core: coreSphere,
        shell: shellMesh,
        gyro: gyroRing,
        light: light,
        feature: feature
      });
    });
  }

  createHouseConduits() {
    this.conduitsGroup = new THREE.Group();
    this.universeGroup.add(this.conduitsGroup);

    this.featureNodeMeshes.forEach((nodeItem) => {
      const feature = nodeItem.feature;
      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Delicate, subtle CAD telemetry line in soft sky blue / feature tint
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.28
      });

      const lineMesh = new THREE.Line(lineGeo, lineMat);
      this.conduitsGroup.add(lineMesh);
      this.disposables.push(lineGeo, lineMat);

      this.houseConnectionLines.push({
        mesh: lineMesh,
        geometry: lineGeo,
        material: lineMat,
        nodeItem: nodeItem,
        featureId: feature.id,
        targetZoneKey: feature.connectedBuildingZone || 'foundation-slab'
      });
    });
  }

  createDataPulseSystem() {
    this.dataPacketsGroup = new THREE.Group();
    this.universeGroup.add(this.dataPacketsGroup);

    const count = 18;
    const packetGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Soft Sky Blue & Gold pulses
      colors[i * 3] = 0.22;
      colors[i * 3 + 1] = 0.74;
      colors[i * 3 + 2] = 0.97;

      this.dataPackets.push({
        conduitIndex: i % (this.houseConnectionLines.length || 1),
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.35
      });
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    packetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const packetMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.packetPointsMesh = new THREE.Points(packetGeo, packetMat);
    this.dataPacketsGroup.add(this.packetPointsMesh);
    this.disposables.push(packetGeo, packetMat);
  }

  createAtmosphericParticles() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 200 : 450;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const softBlue = new THREE.Color(0x38bdf8);
    const slateLight = new THREE.Color(0x94a3b8);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36 - 2;

      const c = Math.random() > 0.5 ? softBlue : slateLight;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.particlesSystem = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particlesSystem);
    this.disposables.push(particleGeo, particleMat);
  }

  // ==================== HTML Labels Overlay ====================
  createHtmlLabels() {
    if (!this.labelsOverlay) return;
    this.labelsOverlay.innerHTML = '';
    this.htmlLabelElements.clear();

    CONSTRUCTION_FEATURES.forEach((feature) => {
      const labelEl = document.createElement('div');
      labelEl.className = `skill-glass-label feature-${feature.id}`;
      labelEl.dataset.featureId = feature.id;
      labelEl.dataset.category = feature.category;

      labelEl.innerHTML = `
        <span class="label-dot" style="background-color: ${feature.color};"></span>
        <span class="label-text">${feature.name}</span>
        <i class="fa-solid ${feature.icon || 'fa-cube'} label-icon"></i>
      `;

      labelEl.addEventListener('mouseenter', () => this.handleFeatureHover(feature.id));
      labelEl.addEventListener('mouseleave', () => this.handleFeatureUnhover());
      labelEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleFeatureSelect(feature.id);
      });

      this.labelsOverlay.appendChild(labelEl);
      this.htmlLabelElements.set(feature.id, labelEl);
    });
  }

  // ==================== Interactive Reactions & Exterior Finish Swatches ====================
  handleFeatureHover(featureId) {
    this.hoveredFeatureId = featureId;
    this.highlightConduitsAndNodes(featureId);

    const el = this.htmlLabelElements.get(featureId);
    if (el) el.classList.add('hovered');

    this.triggerFeatureReaction(featureId, true);
  }

  handleFeatureUnhover() {
    if (this.hoveredFeatureId) {
      const el = this.htmlLabelElements.get(this.hoveredFeatureId);
      if (el) el.classList.remove('hovered');
    }
    this.hoveredFeatureId = null;
    this.highlightConduitsAndNodes(this.selectedFeatureId);

    if (!this.selectedFeatureId) {
      this.resetFeatureReactions();
    }
  }

  handleFeatureSelect(featureId) {
    if (this.selectedFeatureId === featureId) {
      this.deselectFeature();
      return;
    }

    if (this.selectedFeatureId) {
      const prevEl = this.htmlLabelElements.get(this.selectedFeatureId);
      if (prevEl) prevEl.classList.remove('selected');
    }

    this.selectedFeatureId = featureId;
    const el = this.htmlLabelElements.get(featureId);
    if (el) el.classList.add('selected');

    this.highlightConduitsAndNodes(featureId);
    this.triggerFeatureReaction(featureId, false);
    this.renderDetailDrawer(featureId);
  }

  deselectFeature() {
    if (this.selectedFeatureId) {
      const prevEl = this.htmlLabelElements.get(this.selectedFeatureId);
      if (prevEl) prevEl.classList.remove('selected');
    }
    this.selectedFeatureId = null;
    this.highlightConduitsAndNodes(null);
    this.resetFeatureReactions();
    this.closeDetailDrawer();
  }

  triggerFeatureReaction(featureId, isHover = false) {
    const feature = getFeatureById(featureId);
    if (!feature) return;

    // 1. Interior Designing: warm interior room glow
    if (featureId === 'interior-design') {
      if (this.interiorLight) {
        this.interiorLight.intensity = isHover ? 2.8 : 3.6;
      }
    } else {
      if (this.interiorLight) this.interiorLight.intensity = 1.6;
    }

    // 2. Smart Architecture: Highlight CAD dimension lines
    if (featureId === 'smart-architecture') {
      if (this.cadAnnotationsGroup) {
        this.cadAnnotationsGroup.scale.set(1.04, 1.04, 1.04);
      }
    } else {
      if (this.cadAnnotationsGroup) {
        this.cadAnnotationsGroup.scale.set(1, 1, 1);
      }
    }
  }

  resetFeatureReactions() {
    if (this.interiorLight) this.interiorLight.intensity = 1.6;
    if (this.cadAnnotationsGroup) this.cadAnnotationsGroup.scale.set(1, 1, 1);
  }

  // Interactive Exterior Finishes (Painting Feature Customizer)
  applyExteriorFinish(hexColor, finishType) {
    if (finishType === 'brick' || !finishType) {
      this.brickWallMeshes.forEach(mesh => {
        mesh.material.color.set(hexColor);
      });
    }
    if (finishType === 'wood' || finishType === 'all') {
      this.woodWallMeshes.forEach(mesh => {
        mesh.material.color.set(hexColor);
      });
    }
  }

  // ==================== Detail Drawer UI ====================
  renderDetailDrawer(featureId) {
    if (!this.detailCardEl) return;
    const feature = getFeatureById(featureId);
    if (!feature) return;

    let customContent = '';

    // 1. Painting Recommendation: Interactive exterior finish swatches
    if (feature.id === 'painting' && feature.colorSwatches) {
      customContent = `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="skill-card-sublabel">Select Exterior Architectural Finish:</div>
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            ${feature.colorSwatches.map((swatch, sIdx) => `
              <button class="paint-swatch-btn" data-hex="${swatch.hex}" data-type="${sIdx === 0 ? 'brick' : 'wood'}" title="${swatch.name} - ${swatch.desc}" style="
                width: 38px; height: 38px; border-radius: 8px; background: ${swatch.hex};
                border: 2px solid ${swatch.accent}; cursor: pointer; position: relative;
              "></button>
            `).join('')}
          </div>
          <div id="active-finish-desc" style="font-size: 0.76rem; color: #94a3b8; margin-top: 8px;">
            Click a swatch to apply live architectural finish to the 3D house.
          </div>
        </div>
      `;
    }

    // 2. Cost Estimation: Itemized BOQ
    if (feature.id === 'cost-estimation' && feature.costBreakdown) {
      customContent = `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="skill-card-sublabel">Itemized BOQ (Total: ${feature.totalEstimate}):</div>
          <div style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
            ${feature.costBreakdown.map(b => `
              <div style="display: flex; justify-content: space-between; color: #cbd5e1;">
                <span>${b.item}</span>
                <strong style="color: #818cf8;">${b.cost}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 3. Land Area Measurement
    if (feature.id === 'land-measurement' && feature.landTelemetry) {
      customContent = `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="skill-card-sublabel">Plot Survey Telemetry:</div>
          <div style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 5px; margin-top: 6px; color: #cbd5e1;">
            <div><strong>Plot Area:</strong> ${feature.landTelemetry.plotDimensions}</div>
            <div><strong>Built-up Area:</strong> ${feature.landTelemetry.builtUpArea}</div>
            <div><strong>Coverage:</strong> ${feature.landTelemetry.groundCoverage}</div>
            <div><strong>Setbacks:</strong> Front ${feature.landTelemetry.frontSetback} | Rear ${feature.landTelemetry.rearSetback}</div>
          </div>
        </div>
      `;
    }

    // 4. Project Progress Milestones
    if (feature.id === 'project-progress' && feature.milestones) {
      customContent = `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="skill-card-sublabel">Construction Milestones:</div>
          <div style="font-size: 0.76rem; display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
            ${feature.milestones.slice(0, 4).map(m => `
              <div>
                <div style="display: flex; justify-content: space-between; color: #cbd5e1;">
                  <span>${m.stage}</span>
                  <span style="color: #10b981;">${m.progress}%</span>
                </div>
                <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 99px; margin-top: 2px;">
                  <div style="width: ${m.progress}%; height: 100%; background: #10b981; border-radius: 99px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    this.detailCardEl.innerHTML = `
      <button class="skill-card-close" aria-label="Close details">&times;</button>
      <div class="skill-card-header">
        <div class="skill-card-icon" style="background: ${feature.color}20; color: ${feature.color}; border-color: ${feature.color}40;">
          <i class="fa-solid ${feature.icon}"></i>
        </div>
        <div>
          <span class="skill-card-category">${feature.category}</span>
          <h3 class="skill-card-title">${feature.name}</h3>
        </div>
      </div>

      <div class="skill-card-summary">${feature.summary}</div>

      <div class="skill-card-meter-box">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">${feature.level}</span>
          <strong style="color: ${feature.color};">${feature.metric}</strong>
        </div>
        <div class="skill-card-bar-track">
          <div class="skill-card-bar-fill" style="width: 88%; background: ${feature.color};"></div>
        </div>
      </div>

      <div class="skill-card-sublabel">Core Disciplines</div>
      <div class="skill-card-tags">
        ${feature.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
      </div>

      ${customContent}
    `;

    this.detailCardEl.classList.remove('hidden');
    this.detailCardEl.classList.add('active');

    // Close button
    const closeBtn = this.detailCardEl.querySelector('.skill-card-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deselectFeature();
      });
    }

    // Paint swatch clicks
    const swatchBtns = this.detailCardEl.querySelectorAll('.paint-swatch-btn');
    swatchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hex = btn.dataset.hex;
        const type = btn.dataset.type;
        this.applyExteriorFinish(hex, type);
        const descEl = this.detailCardEl.querySelector('#active-finish-desc');
        if (descEl) descEl.textContent = `Applied finish: ${btn.getAttribute('title')}`;
      });
    });
  }

  closeDetailDrawer() {
    if (!this.detailCardEl) return;
    this.detailCardEl.classList.remove('active');
    this.detailCardEl.classList.add('hidden');
  }

  highlightConduitsAndNodes(activeId) {
    this.houseConnectionLines.forEach(line => {
      if (!activeId) {
        line.material.opacity = 0.28;
      } else if (line.featureId === activeId) {
        line.material.opacity = 0.85;
      } else {
        line.material.opacity = 0.12;
      }
    });

    this.featureNodeMeshes.forEach(node => {
      if (!activeId) {
        node.core.scale.set(1, 1, 1);
        node.gyro.material.opacity = 0.35;
      } else if (node.feature.id === activeId) {
        node.core.scale.set(1.25, 1.25, 1.25);
        node.gyro.material.opacity = 0.85;
      } else {
        node.core.scale.set(0.85, 0.85, 0.85);
        node.gyro.material.opacity = 0.15;
      }
    });
  }

  // ==================== Category Filtering ====================
  filterByCategory(category) {
    this.activeCategory = category;

    this.featureNodeMeshes.forEach((nodeItem) => {
      const feat = nodeItem.feature;
      const isVisible = (category === 'ALL' || feat.category === category);
      nodeItem.group.visible = isVisible;

      const labelEl = this.htmlLabelElements.get(feat.id);
      if (labelEl) {
        labelEl.style.display = isVisible ? 'flex' : 'none';
      }
    });

    this.houseConnectionLines.forEach((conduit) => {
      const feat = getFeatureById(conduit.featureId);
      conduit.mesh.visible = (category === 'ALL' || feat?.category === category);
    });

    if (this.selectedFeatureId) {
      const selFeat = getFeatureById(this.selectedFeatureId);
      if (category !== 'ALL' && selFeat?.category !== category) {
        this.deselectFeature();
      }
    }
  }

  // ==================== Event Listeners & Interaction ====================
  setupEventListeners() {
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onPointerDownBound = this.onPointerDown.bind(this);
    this.onPointerUpBound = this.onPointerUp.bind(this);
    this.onResizeBound = this.onResize.bind(this);

    window.addEventListener('mousemove', this.onMouseMoveBound, { passive: true });
    window.addEventListener('resize', this.onResizeBound, { passive: true });

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', this.onPointerDownBound);
      this.canvas.addEventListener('pointerup', this.onPointerUpBound);
    }
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window) || !this.mountEl) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isInViewport = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.mountEl);
  }

  onMouseMove(e) {
    if (!this.mountEl) return;
    const rect = this.mountEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.mouse.targetX = (x / rect.width) * 2 - 1;
    this.mouse.targetY = -(y / rect.height) * 2 + 1;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      this.normalizedPointer.x = (x / rect.width) * 2 - 1;
      this.normalizedPointer.y = -(y / rect.height) * 2 + 1;
    }
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
  }

  onPointerUp(e) {
    if (!this.isDragging) return;
    const dx = Math.abs(e.clientX - this.dragStartX);
    const dy = Math.abs(e.clientY - this.dragStartY);
    this.isDragging = false;

    // Clean click without drag
    if (dx < 6 && dy < 6) {
      this.checkRaycastHit();
    }
  }

  checkRaycastHit() {
    if (!this.camera || !this.nodesGroup) return;
    this.raycaster.setFromCamera(this.normalizedPointer, this.camera);

    const targets = [];
    this.featureNodeMeshes.forEach(n => {
      if (n.group.visible) targets.push(n.core);
    });

    const intersects = this.raycaster.intersectObjects(targets, false);
    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const featId = hitObj.userData.featureId;
      if (featId) this.handleFeatureSelect(featId);
    } else {
      // Clicked empty ground
      this.deselectFeature();
    }
  }

  onResize() {
    if (!this.mountEl || !this.renderer || !this.camera) return;
    this.width = this.mountEl.clientWidth;
    this.height = this.mountEl.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // ==================== Render Loop & Animation ====================
  animate() {
    if (this.isDestroyed) return;
    requestAnimationFrame(this.animate.bind(this));

    if (!this.isInViewport) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Mouse parallax lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    if (this.universeGroup) {
      // Gentle CAD architectural orbit & mouse tilt
      if (this.isRotating && !this.reducedMotion) {
        this.universeGroup.rotation.y = elapsedTime * 0.04 + this.mouse.x * 0.25;
        this.universeGroup.rotation.x = this.mouse.y * 0.12;
      } else {
        this.universeGroup.rotation.y = this.mouse.x * 0.35;
        this.universeGroup.rotation.x = this.mouse.y * 0.15;
      }
    }

    // 1. Floating animation for 12 feature nodes
    this.featureNodeMeshes.forEach((nodeItem) => {
      if (!nodeItem.group.visible) return;
      const t = elapsedTime * 1.5 + nodeItem.group.userData.floatOffset;
      const floatY = Math.sin(t) * 0.14;
      nodeItem.group.position.y = nodeItem.group.userData.basePos.y + floatY;

      // Spin inner gyro ring
      nodeItem.gyro.rotation.z += 0.015;
      nodeItem.shell.rotation.y += 0.008;
    });

    // 2. Update dynamic CAD conduits
    this.updateHouseConduits();

    // 3. Update traveling data packets
    this.updateDataPackets(delta);

    // 4. Update HTML badge screen positions
    this.updateHtmlLabelPositions();

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  updateHouseConduits() {
    if (!this.houseAttachmentPoints || !this.houseConnectionLines) return;

    this.houseConnectionLines.forEach((conduit) => {
      if (!conduit.mesh.visible) return;

      const nodeGroup = conduit.nodeItem.group;
      const nodePos = nodeGroup.position;

      const zoneKey = conduit.targetZoneKey;
      const housePoint = this.houseAttachmentPoints[zoneKey] || this.houseAttachmentPoints['foundation-slab'];

      const posAttr = conduit.geometry.attributes.position;
      posAttr.setXYZ(0, nodePos.x, nodePos.y, nodePos.z);
      posAttr.setXYZ(1, housePoint.x, housePoint.y, housePoint.z);
      posAttr.needsUpdate = true;
    });
  }

  updateDataPackets(delta) {
    if (!this.packetPointsMesh || !this.dataPackets.length) return;

    const posAttr = this.packetPointsMesh.geometry.attributes.position;

    this.dataPackets.forEach((packet, idx) => {
      const conduit = this.houseConnectionLines[packet.conduitIndex];
      if (!conduit || !conduit.mesh.visible) return;

      packet.progress += delta * packet.speed;
      if (packet.progress > 1.0) packet.progress = 0.0;

      const pStart = conduit.nodeItem.group.position;
      const zoneKey = conduit.targetZoneKey;
      const pEnd = this.houseAttachmentPoints[zoneKey] || this.houseAttachmentPoints['foundation-slab'];

      const curX = THREE.MathUtils.lerp(pStart.x, pEnd.x, packet.progress);
      const curY = THREE.MathUtils.lerp(pStart.y, pEnd.y, packet.progress);
      const curZ = THREE.MathUtils.lerp(pStart.z, pEnd.z, packet.progress);

      posAttr.setXYZ(idx, curX, curY, curZ);
    });

    posAttr.needsUpdate = true;
  }

  updateHtmlLabelPositions() {
    if (!this.htmlLabelElements.size || !this.camera || !this.mountEl) return;

    const rect = this.mountEl.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    const tempV = new THREE.Vector3();

    this.featureNodeMeshes.forEach((nodeItem) => {
      const labelEl = this.htmlLabelElements.get(nodeItem.feature.id);
      if (!labelEl || !nodeItem.group.visible) return;

      // Get world position of node
      nodeItem.group.getWorldPosition(tempV);
      tempV.y += 0.55; // position badge slightly above node core

      // Project 3D vector to 2D screen coordinates
      tempV.project(this.camera);

      // Behind camera check
      if (tempV.z > 1.0) {
        labelEl.style.opacity = '0';
        labelEl.style.pointerEvents = 'none';
        return;
      }

      const screenX = (tempV.x * halfW) + halfW;
      const screenY = -(tempV.y * halfH) + halfH;

      labelEl.style.left = `${screenX}px`;
      labelEl.style.top = `${screenY}px`;
      labelEl.style.opacity = '1';
      labelEl.style.pointerEvents = 'auto';
    });
  }

  // ==================== 2D Fallback ====================
  render2DFallback() {
    if (!this.fallbackEl) return;
    this.fallbackEl.classList.remove('hidden');
    if (this.mountEl) this.mountEl.style.display = 'none';

    const grid = this.fallbackEl.querySelector('.fallback-grid');
    if (grid) {
      grid.innerHTML = CONSTRUCTION_FEATURES.map(f => `
        <div class="fallback-skill-card">
          <div style="color: ${f.color}; font-size: 1.5rem; margin-bottom: 8px;">
            <i class="fa-solid ${f.icon}"></i>
          </div>
          <h4 style="font-size: 1.1rem; margin-bottom: 6px;">${f.name}</h4>
          <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px;">${f.summary}</p>
          <span style="font-size: 0.75rem; color: ${f.color}; font-weight: 600;">${f.metric}</span>
        </div>
      `).join('');
    }
  }

  // ==================== Cleanup & Disposal ====================
  destroy() {
    this.isDestroyed = true;

    if (this.observer) this.observer.disconnect();

    window.removeEventListener('mousemove', this.onMouseMoveBound);
    window.removeEventListener('resize', this.onResizeBound);

    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.onPointerDownBound);
      this.canvas.removeEventListener('pointerup', this.onPointerUpBound);
    }

    this.disposables.forEach(item => {
      if (item && typeof item.dispose === 'function') {
        item.dispose();
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
