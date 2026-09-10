// ==================== Interactive 3D Parametric House Plan Viewer ====================
// Real-time 3D rotating architectural house model for all plot dimensions & square footage
// Features: Parametric building generator, glowing wireframe outlines, glass facades,
// floor layer isolation (All, Ground, Upper, Roof, Exploded), Vastu direction compass,
// interactive room telemetry hotspots, and smooth orbit controls.

import * as THREE from 'three';

export class FloorPlan3DViewer {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    this.mountEl = options.mountEl
      ? (typeof options.mountEl === 'string' ? document.querySelector(options.mountEl) : options.mountEl)
      : this.container?.querySelector('.floorplan-canvas-mount');

    this.hudBadgeEl = options.hudBadgeEl
      ? (typeof options.hudBadgeEl === 'string' ? document.querySelector(options.hudBadgeEl) : options.hudBadgeEl)
      : this.container?.querySelector('.floorplan-hud-badge');

    this.detailCardEl = options.detailCardEl
      ? (typeof options.detailCardEl === 'string' ? document.querySelector(options.detailCardEl) : options.detailCardEl)
      : this.container?.querySelector('.floorplan-detail-card');

    // Active plan configuration
    this.planData = {
      width: options.width || 30,
      depth: options.depth || 40,
      sqft: options.sqft || 1200,
      facing: options.facing || 'East',
      bhk: options.bhk || '2 BHK',
      style: options.style || 'Modern Minimalist Facade',
      colorScheme: options.colorScheme || '#38bdf8',
      title: options.title || 'Modern Minimalist Facade with Vastu Alignment',
      vastuScore: options.vastuScore || 98
    };

    this.isRotating = true;
    this.isDestroyed = false;
    this.isInViewport = true;
    this.activeFloorLayer = 'ALL'; // 'ALL', 'GROUND', 'UPPER', 'ROOF', 'EXPLODED'

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationAngle = 0;
    this.targetRotationAngle = 0;

    this.disposables = [];
    this.featureHotspots = [];
    this.raycaster = new THREE.Raycaster();
    this.normalizedPointer = new THREE.Vector2(-999, -999);

    this.init();
  }

  // ==================== Initialize 3D Engine ====================
  init() {
    if (!this.mountEl) return;
    this.setupScene();
    this.createGroundAndCompass();
    this.buildParametricHouse();
    this.createHotspotNodes();
    this.setupEventListeners();
    this.setupObserver();

    this.clock = new THREE.Clock();
    this.animate();

    requestAnimationFrame(() => {
      this.onResize();
    });
  }

  // ==================== Scene & Camera Setup ====================
  setupScene() {
    const rect = this.mountEl.getBoundingClientRect();
    this.width = rect.width || this.mountEl.clientWidth || 920;
    this.height = rect.height || this.mountEl.clientHeight || 540;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060e1d, 0.014);

    const isMobile = window.innerWidth < 768;
    this.cameraDistance = isMobile ? 22 : 17;

    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
    this.camera.position.set(this.cameraDistance * 0.72, this.cameraDistance * 0.55, this.cameraDistance * 0.78);
    this.camera.lookAt(0, 0.6, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.mountEl.innerHTML = '';
    this.mountEl.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    // Master universe pivot group
    this.universeGroup = new THREE.Group();
    this.scene.add(this.universeGroup);

    // Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0x0e223d, 2.0);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    keyLight.position.set(15, 20, 12);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.8);
    rimLight.position.set(-14, 15, -12);
    this.scene.add(rimLight);

    const goldAccentLight = new THREE.DirectionalLight(0xfbbf24, 1.2);
    goldAccentLight.position.set(10, -5, -10);
    this.scene.add(goldAccentLight);
  }

  // ==================== Ground Grid & Vastu Compass Ring ====================
  createGroundAndCompass() {
    if (this.groundGroup) {
      this.universeGroup.remove(this.groundGroup);
    }

    this.groundGroup = new THREE.Group();
    this.groundGroup.position.y = -1.9;
    this.universeGroup.add(this.groundGroup);

    // 1. Futuristic Blueprint Grid
    const gridHelper = new THREE.GridHelper(26, 36, 0x00f2fe, 0x0c2545);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.55;
    this.groundGroup.add(gridHelper);
    this.disposables.push(gridHelper.geometry, gridHelper.material);

    // 2. Outer Vastu Compass Ring
    const ringPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * 8.6, 0.02, Math.sin(theta) * 8.6));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const compassRing = new THREE.Line(ringGeo, ringMat);
    this.groundGroup.add(compassRing);
    this.disposables.push(ringGeo, ringMat);

    // 3. Inner Concentric Ring
    const innerPoints = [];
    for (let i = 0; i <= 32; i++) {
      const theta = (i / 32) * Math.PI * 2;
      innerPoints.push(new THREE.Vector3(Math.cos(theta) * 6.8, 0.02, Math.sin(theta) * 6.8));
    }
    const innerGeo = new THREE.BufferGeometry().setFromPoints(innerPoints);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35
    });
    const innerRing = new THREE.Line(innerGeo, innerMat);
    this.groundGroup.add(innerRing);
    this.disposables.push(innerGeo, innerMat);

    // 4. Plot Boundary Frame (True to scale plot footprint)
    const pw = (this.planData.width / 30) * 5.2;
    const pd = (this.planData.depth / 40) * 6.4;
    const boundaryPoints = [
      new THREE.Vector3(-pw / 2, 0.03, -pd / 2),
      new THREE.Vector3(pw / 2, 0.03, -pd / 2),
      new THREE.Vector3(pw / 2, 0.03, pd / 2),
      new THREE.Vector3(-pw / 2, 0.03, pd / 2),
      new THREE.Vector3(-pw / 2, 0.03, -pd / 2)
    ];
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryMat = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const boundaryLine = new THREE.Line(boundaryGeo, boundaryMat);
    this.groundGroup.add(boundaryLine);
    this.disposables.push(boundaryGeo, boundaryMat);
  }

  // ==================== Parametric 3D House Builder ====================
  buildParametricHouse() {
    if (this.houseGroup) {
      this.universeGroup.remove(this.houseGroup);
    }

    this.houseGroup = new THREE.Group();
    this.universeGroup.add(this.houseGroup);

    const sqft = this.planData.sqft;
    const pw = (this.planData.width / 30) * 4.6;
    const pd = (this.planData.depth / 40) * 5.2;
    const accentColor = new THREE.Color(this.planData.colorScheme || '#38bdf8');

    // Number of levels based on square footage
    this.levels = sqft >= 2400 ? (sqft >= 3500 ? 3 : 2) : (sqft < 800 ? 1 : 2);

    // Shared Architectural Materials
    this.wallMat = new THREE.MeshStandardMaterial({
      color: 0x07152b,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92
    });

    this.upperWallMat = new THREE.MeshStandardMaterial({
      color: 0x0a2040,
      roughness: 0.28,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });

    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: accentColor,
      emissiveIntensity: 0.15,
      roughness: 0.05,
      metalness: 0.92,
      transparent: true,
      opacity: 0.45,
      transmission: 0.65,
      ior: 1.5
    });

    this.slabMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: accentColor,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.9
    });

    this.colMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.85
    });

    this.disposables.push(this.wallMat, this.upperWallMat, this.glassMat, this.slabMat, this.colMat);

    // Create Floor Groups for layer isolation
    this.groundFloorGroup = new THREE.Group();
    this.upperFloorGroup = new THREE.Group();
    this.roofFloorGroup = new THREE.Group();

    this.houseGroup.add(this.groundFloorGroup);
    this.houseGroup.add(this.upperFloorGroup);
    this.houseGroup.add(this.roofFloorGroup);

    const groundH = 1.65;
    const upperH = 1.55;

    // -------------------------------------------------------------
    // Level 1: Ground Floor
    // -------------------------------------------------------------
    const gfW = pw * 0.92;
    const gfD = pd * 0.88;
    const gfGeo = new THREE.BoxGeometry(gfW, groundH, gfD);
    const gfMesh = new THREE.Mesh(gfGeo, this.wallMat);
    gfMesh.position.set(0, -0.9, 0);
    this.groundFloorGroup.add(gfMesh);
    this.addWireframe(gfMesh, gfGeo, 0x00f2fe, 0.85);

    // Front Glass Entrance & Living Facade
    const glassEntranceGeo = new THREE.BoxGeometry(gfW * 0.45, groundH * 0.82, 0.12);
    const glassEntrance = new THREE.Mesh(glassEntranceGeo, this.glassMat);
    glassEntrance.position.set(gfW * 0.18, -0.9, gfD / 2 + 0.06);
    this.groundFloorGroup.add(glassEntrance);
    this.addWireframe(glassEntrance, glassEntranceGeo, accentColor.getHex(), 0.95);

    // Parking Car Porch Slab
    const porchW = gfW * 0.42;
    const porchD = gfD * 0.45;
    const porchSlabGeo = new THREE.BoxGeometry(porchW, 0.12, porchD);
    const porchSlab = new THREE.Mesh(porchSlabGeo, this.slabMat);
    porchSlab.position.set(-gfW * 0.28, -0.1, gfD / 2 + porchD / 2 - 0.2);
    this.groundFloorGroup.add(porchSlab);
    this.addWireframe(porchSlab, porchSlabGeo, 0x38bdf8, 0.9);

    // Porch Corner Column
    const colGeo = new THREE.CylinderGeometry(0.08, 0.08, groundH, 12);
    const colMesh = new THREE.Mesh(colGeo, this.colMat);
    colMesh.position.set(-gfW * 0.44, -0.9, gfD / 2 + porchD - 0.3);
    this.groundFloorGroup.add(colMesh);

    // -------------------------------------------------------------
    // Mid-Band Divider Slab
    // -------------------------------------------------------------
    const midSlabGeo = new THREE.BoxGeometry(pw * 0.96, 0.14, pd * 0.92);
    const midSlab = new THREE.Mesh(midSlabGeo, this.slabMat);
    midSlab.position.set(0, -0.05, 0);
    this.groundFloorGroup.add(midSlab);
    this.addWireframe(midSlab, midSlabGeo, 0x38bdf8, 0.95);

    // -------------------------------------------------------------
    // Level 2: Upper Floor (if multi-level)
    // -------------------------------------------------------------
    if (this.levels >= 2) {
      const ufW = pw * 0.88;
      const ufD = pd * 0.82;
      const ufGeo = new THREE.BoxGeometry(ufW, upperH, ufD);
      const ufMesh = new THREE.Mesh(ufGeo, this.upperWallMat);
      ufMesh.position.set(-pw * 0.04, 0.78, 0);
      this.upperFloorGroup.add(ufMesh);
      this.addWireframe(ufMesh, ufGeo, 0x00f2fe, 0.85);

      // Cantilevered Glass Balcony
      const balcW = ufW * 0.52;
      const balcD = 1.1;
      const balcSlabGeo = new THREE.BoxGeometry(balcW, 0.1, balcD);
      const balcSlab = new THREE.Mesh(balcSlabGeo, this.slabMat);
      balcSlab.position.set(ufW * 0.15, 0.08, ufD / 2 + balcD / 2 - 0.1);
      this.upperFloorGroup.add(balcSlab);
      this.addWireframe(balcSlab, balcSlabGeo, 0x38bdf8, 0.95);

      // Glass Balcony Railing
      const railingGeo = new THREE.BoxGeometry(balcW, 0.65, 0.06);
      const railing = new THREE.Mesh(railingGeo, this.glassMat);
      railing.position.set(ufW * 0.15, 0.42, ufD / 2 + balcD - 0.12);
      this.upperFloorGroup.add(railing);
      this.addWireframe(railing, railingGeo, accentColor.getHex(), 0.9);

      // Upper Floor Glass Ribbon Window
      const winGeo = new THREE.BoxGeometry(ufW * 0.65, 0.75, 0.08);
      const win = new THREE.Mesh(winGeo, this.glassMat);
      win.position.set(-pw * 0.04, 0.85, ufD / 2 + 0.05);
      this.upperFloorGroup.add(win);
      this.addWireframe(win, winGeo, accentColor.getHex(), 0.9);
    }

    // -------------------------------------------------------------
    // Level 3 / Roof: Sky Deck, Solar Panels or Slope Roof
    // -------------------------------------------------------------
    const roofY = this.levels >= 2 ? 1.62 : 0.02;
    const roofSlabGeo = new THREE.BoxGeometry(pw * 0.94, 0.14, pd * 0.88);
    const roofSlab = new THREE.Mesh(roofSlabGeo, this.slabMat);
    roofSlab.position.set(0, roofY, 0);
    this.roofFloorGroup.add(roofSlab);
    this.addWireframe(roofSlab, roofSlabGeo, 0x38bdf8, 0.95);

    // Roof Parapet / Gazebo / Solar Array
    if (this.planData.style?.toLowerCase().includes('slope') || this.planData.style?.toLowerCase().includes('heritage')) {
      // Traditional / South Indian Slope Roof
      const slopeGeo = new THREE.ConeGeometry(pw * 0.55, 1.2, 4);
      const slopeMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.4,
        metalness: 0.6
      });
      const slopeMesh = new THREE.Mesh(slopeGeo, slopeMat);
      slopeMesh.position.set(0, roofY + 0.65, 0);
      slopeMesh.rotation.y = Math.PI / 4;
      this.roofFloorGroup.add(slopeMesh);
      this.addWireframe(slopeMesh, slopeGeo, 0xfbbf24, 0.85);
      this.disposables.push(slopeGeo, slopeMat);
    } else {
      // Modern Sky Deck Pergola / Solar Roof
      const pergolaGeo = new THREE.BoxGeometry(pw * 0.45, 0.7, pd * 0.4);
      const pergolaMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        wireframe: true,
        transparent: true,
        opacity: 0.65
      });
      const pergola = new THREE.Mesh(pergolaGeo, pergolaMat);
      pergola.position.set(pw * 0.15, roofY + 0.42, -pd * 0.12);
      this.roofFloorGroup.add(pergola);
      this.disposables.push(pergolaGeo, pergolaMat);
    }

    // -------------------------------------------------------------
    // Luxury Villa Feature: Swimming Pool Deck (for 4000 sq ft / Luxury plans)
    // -------------------------------------------------------------
    if (sqft >= 3000 || this.planData.style?.toLowerCase().includes('pool') || this.planData.style?.toLowerCase().includes('resort')) {
      const poolW = 2.4;
      const poolD = 3.6;
      const poolGeo = new THREE.BoxGeometry(poolW, 0.08, poolD);
      const poolMat = new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
      });
      const pool = new THREE.Mesh(poolGeo, poolMat);
      pool.position.set(pw / 2 + poolW / 2 + 0.4, -1.86, 0);
      this.groundFloorGroup.add(pool);
      this.addWireframe(pool, poolGeo, 0x22d3ee, 0.95);
      this.disposables.push(poolGeo, poolMat);
    }

    // Apply active floor isolation position
    this.applyFloorIsolation(this.activeFloorLayer);
  }

  // ==================== Wireframe Outlines ====================
  addWireframe(mesh, geometry, colorHex, opacity = 0.85) {
    const wireGeo = new THREE.EdgesGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    mesh.add(wireframe);
    this.disposables.push(wireGeo, wireMat);
  }

  // ==================== Interactive Room / Vastu Hotspots ====================
  createHotspotNodes() {
    this.featureHotspots.forEach(h => {
      if (h.mesh && h.mesh.parent) {
        h.mesh.parent.remove(h.mesh);
      }
    });
    this.featureHotspots = [];

    const pw = (this.planData.width / 30) * 4.6;
    const pd = (this.planData.depth / 40) * 5.2;

    const hotspotsData = [
      {
        id: 'entrance',
        name: 'NE Main Entrance',
        category: 'Vastu Ishanya Gate',
        summary: 'Primary Vastu-compliant entrance channel for positive cosmic energy and daylight.',
        size: '6\' x 8\' Foyer',
        pos: new THREE.Vector3(pw * 0.35, -0.6, pd * 0.46),
        color: 0x38bdf8
      },
      {
        id: 'living',
        name: 'Grand Living Hall',
        category: 'Brahmasthan Center',
        summary: 'Double-height ceiling living & dining space with cross-ventilation.',
        size: `${Math.round(this.planData.width * 0.55)}' x ${Math.round(this.planData.depth * 0.38)}'`,
        pos: new THREE.Vector3(0, -0.6, 0),
        color: 0xa855f7
      },
      {
        id: 'kitchen',
        name: 'SE Modular Kitchen',
        category: 'Agni Fire Quadrant',
        summary: 'Southeast kitchen alignment for optimal culinary health and ventilation.',
        size: `${Math.round(this.planData.width * 0.35)}' x ${Math.round(this.planData.depth * 0.25)}'`,
        pos: new THREE.Vector3(pw * 0.32, -0.6, -pd * 0.34),
        color: 0xf59e0b
      },
      {
        id: 'master',
        name: 'Master Bedroom Suite',
        category: 'SW Nairuthi Power Zone',
        summary: 'Heavy structural quadrant providing maximum master bedroom tranquility and security.',
        size: `${Math.round(this.planData.width * 0.42)}' x ${Math.round(this.planData.depth * 0.32)}'`,
        pos: new THREE.Vector3(-pw * 0.32, 0.8, -pd * 0.32),
        color: 0x10b981
      },
      {
        id: 'balcony',
        name: 'Glass Balcony & Sky Deck',
        category: 'Outdoor Aeration',
        summary: 'Cantilevered glass facade terrace overlooking the front driveway.',
        size: '5\' x 14\' Clear Balcony',
        pos: new THREE.Vector3(pw * 0.15, 0.55, pd * 0.44),
        color: 0x38bdf8
      }
    ];

    hotspotsData.forEach(data => {
      // Pulsing node sphere
      const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.8
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(data.pos);
      nodeMesh.userData = data;

      // Glow halo ring
      const ringGeo = new THREE.RingGeometry(0.22, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(0, 1, 0);
      nodeMesh.add(ringMesh);

      this.houseGroup.add(nodeMesh);
      this.featureHotspots.push({ mesh: nodeMesh, data, ring: ringMesh });
      this.disposables.push(nodeGeo, nodeMat, ringGeo, ringMat);
    });
  }

  // ==================== Floor Layer Isolator ====================
  setFloorLayer(layerName) {
    this.activeFloorLayer = layerName;
    this.applyFloorIsolation(layerName);
  }

  applyFloorIsolation(layer) {
    if (!this.groundFloorGroup || !this.upperFloorGroup || !this.roofFloorGroup) return;

    if (layer === 'EXPLODED') {
      // Explode floors vertically
      this.groundFloorGroup.visible = true;
      this.groundFloorGroup.position.y = 0;

      this.upperFloorGroup.visible = true;
      this.upperFloorGroup.position.y = 1.4;

      this.roofFloorGroup.visible = true;
      this.roofFloorGroup.position.y = 2.8;
    } else if (layer === 'GROUND') {
      this.groundFloorGroup.visible = true;
      this.groundFloorGroup.position.y = 0;

      this.upperFloorGroup.visible = false;
      this.roofFloorGroup.visible = false;
    } else if (layer === 'UPPER') {
      this.groundFloorGroup.visible = false;
      this.upperFloorGroup.visible = true;
      this.upperFloorGroup.position.y = 0;
      this.roofFloorGroup.visible = false;
    } else if (layer === 'ROOF') {
      this.groundFloorGroup.visible = false;
      this.upperFloorGroup.visible = false;
      this.roofFloorGroup.visible = true;
      this.roofFloorGroup.position.y = 0;
    } else {
      // ALL
      this.groundFloorGroup.visible = true;
      this.groundFloorGroup.position.y = 0;

      this.upperFloorGroup.visible = true;
      this.upperFloorGroup.position.y = 0;

      this.roofFloorGroup.visible = true;
      this.roofFloorGroup.position.y = 0;
    }
  }

  // ==================== Update Plan Dynamically ====================
  updatePlan(newPlanData = {}) {
    this.planData = { ...this.planData, ...newPlanData };
    this.createGroundAndCompass();
    this.buildParametricHouse();
    this.createHotspotNodes();
    this.updateHudDisplay();
  }

  updateHudDisplay() {
    if (this.hudBadgeEl) {
      this.hudBadgeEl.innerHTML = `
        <span class="hud-pulse-dot"></span>
        <span>${this.planData.width}' x ${this.planData.depth}' (${this.planData.sqft} Sq Ft) · ${this.planData.facing} Facing · ${this.planData.bhk}</span>
      `;
    }
  }

  // ==================== Event Listeners ====================
  setupEventListeners() {
    if (!this.canvas) return;

    // Drag to Orbit
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.isRotating = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.universeGroup.rotation.y += deltaX * 0.008;
        this.universeGroup.rotation.x = Math.max(-0.4, Math.min(0.6, this.universeGroup.rotation.x + deltaY * 0.005));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Raycasting for hotspots
      const rect = this.canvas.getBoundingClientRect();
      this.normalizedPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.normalizedPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Touch Support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.isRotating = false;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        this.universeGroup.rotation.y += deltaX * 0.01;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Hotspot Click
    this.canvas.addEventListener('click', () => {
      this.checkHotspotClick();
    });

    // Resize
    this.resizeHandler = () => this.onResize();
    window.addEventListener('resize', this.resizeHandler);
  }

  checkHotspotClick() {
    this.raycaster.setFromCamera(this.normalizedPointer, this.camera);
    const meshes = this.featureHotspots.map(h => h.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const data = clickedMesh.userData;
      this.showDetailCard(data);
    }
  }

  showDetailCard(data) {
    if (!this.detailCardEl) return;

    this.detailCardEl.innerHTML = `
      <button class="skill-card-close" id="floorPlanCardClose" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
      <div class="skill-card-header">
        <div class="skill-card-icon" style="border-color:${data.color};color:${data.color}">
          <i class="fas fa-compass"></i>
        </div>
        <div>
          <span class="skill-card-category">${data.category}</span>
          <h3 class="skill-card-title">${data.name}</h3>
        </div>
      </div>
      <p class="skill-card-summary">${data.summary}</p>
      <div style="background:rgba(255,255,255,0.04);padding:10px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);margin-bottom:12px;font-size:0.85rem">
        <div class="flex-between" style="margin-bottom:4px">
          <span style="color:var(--text-muted)">Recommended Size:</span>
          <strong style="color:var(--primary)">${data.size}</strong>
        </div>
        <div class="flex-between">
          <span style="color:var(--text-muted)">Vastu Alignment:</span>
          <strong style="color:var(--gold)"><i class="fas fa-star"></i> 98% Optimal</strong>
        </div>
      </div>
    `;

    this.detailCardEl.classList.remove('hidden');

    this.detailCardEl.querySelector('#floorPlanCardClose')?.addEventListener('click', () => {
      this.detailCardEl.classList.add('hidden');
    });
  }

  setupObserver() {
    if (!this.container) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isInViewport = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.container);
  }

  onResize() {
    if (!this.mountEl || !this.renderer || !this.camera) return;
    const rect = this.mountEl.getBoundingClientRect();
    this.width = rect.width || this.mountEl.clientWidth || 920;
    this.height = rect.height || this.mountEl.clientHeight || 540;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // ==================== Render Loop ====================
  animate() {
    if (this.isDestroyed) return;
    requestAnimationFrame(() => this.animate());

    if (!this.isInViewport) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Auto-rotation
    if (this.isRotating && !this.isDragging) {
      this.universeGroup.rotation.y += delta * 0.28;
    }

    // Pulse hotspots rings
    this.featureHotspots.forEach((h, idx) => {
      if (h.ring) {
        const s = 1.0 + Math.sin(elapsedTime * 3.0 + idx) * 0.15;
        h.ring.scale.set(s, s, s);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  // ==================== Disposal & Cleanup ====================
  dispose() {
    this.isDestroyed = true;
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.resizeHandler);

    this.disposables.forEach(item => {
      if (item.dispose) item.dispose();
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
