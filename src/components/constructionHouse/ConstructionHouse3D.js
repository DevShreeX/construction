// ==================== Interactive 3D Smart Construction House Engine ====================
// Futuristic architectural wireframe smart house visualization with 12 intelligent feature nodes,
// real-time 3D feature reactions, glowing wireframe outlines, blueprint HUD, and responsive telemetry.

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
    this.isInViewport = true; // Always true initially so rendering starts immediately
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

    // Interactive feature reaction elements
    this.wallMaterials = [];
    this.interiorLight = null;
    this.interiorFurnitureGroup = null;
    this.materialCubesGroup = null;
    this.neuralNetworkGroup = null;
    this.landMeasurementGroup = null;
    this.safetyZoneGroup = null;
    this.edgeTracerMesh = null;

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
    this.createBlueprintGroundAndCompass();
    this.createFuturisticSmartHouse();
    this.createBlueprintDimensionAnnotations();
    this.createCADTrihedron();
    this.createFeatureNodes();
    this.createHouseConduits();
    this.createDataPulseSystem();
    this.createConstructionDataParticles();
    this.createEdgeTracerSystem();
    this.createSpecialReactionSystems();
    this.createHtmlLabels();
    this.setupEventListeners();
    this.setupIntersectionObserver();

    this.clock = new THREE.Clock();
    this.animate();

    // Trigger an initial resize pass after DOM paints
    requestAnimationFrame(() => {
      this.onResize();
    });
  }

  // ==================== Scene & Isometric Perspective Camera ====================
  setupScene() {
    const rect = this.mountEl.getBoundingClientRect();
    this.width = rect.width || this.mountEl.clientWidth || 920;
    this.height = rect.height || this.mountEl.clientHeight || 680;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const cameraDistance = isMobile ? 22 : (isTablet ? 19 : 16.5);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050c1a, 0.012);

    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 1000);
    this.camera.position.set(cameraDistance * 0.76, cameraDistance * 0.58, cameraDistance * 0.84);
    this.camera.lookAt(0, 0.4, 0);

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

    // Master universe pivot group for mouse parallax & tilt
    this.universeGroup = new THREE.Group();
    this.scene.add(this.universeGroup);

    // Architectural Key, Rim & Sky Lights
    const ambientLight = new THREE.AmbientLight(0x0f2444, 1.8);
    this.scene.add(ambientLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x00f2fe, 2.2);
    cyanKeyLight.position.set(16, 22, 14);
    this.scene.add(cyanKeyLight);

    const purpleRimLight = new THREE.DirectionalLight(0xa855f7, 1.8);
    purpleRimLight.position.set(-15, 14, -14);
    this.scene.add(purpleRimLight);

    const softFillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    softFillLight.position.set(0, -10, 10);
    this.scene.add(softFillLight);
  }

  // ==================== Blueprint Ground Disc & Compass ====================
  createBlueprintGroundAndCompass() {
    this.groundGroup = new THREE.Group();
    this.groundGroup.position.y = -1.95;
    this.universeGroup.add(this.groundGroup);

    // 1. Futuristic Blueprint Grid
    const gridHelper = new THREE.GridHelper(24, 36, 0x00f2fe, 0x0c2545);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    this.groundGroup.add(gridHelper);
    this.disposables.push(gridHelper.geometry, gridHelper.material);

    // 2. Glowing Circular Blueprint Compass Ring
    const ringPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * 8.2, 0.02, Math.sin(theta) * 8.2));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const compassRing = new THREE.Line(ringGeo, ringMat);
    this.groundGroup.add(compassRing);
    this.disposables.push(ringGeo, ringMat);

    // Inner tick ring
    const innerPoints = [];
    for (let i = 0; i <= 32; i++) {
      const theta = (i / 32) * Math.PI * 2;
      innerPoints.push(new THREE.Vector3(Math.cos(theta) * 6.5, 0.02, Math.sin(theta) * 6.5));
    }
    const innerGeo = new THREE.BufferGeometry().setFromPoints(innerPoints);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.groundGroup.add(new THREE.Line(innerGeo, innerMat));
    this.disposables.push(innerGeo, innerMat);

    // Compass Cardinal Labels (N, S, E, W)
    const addMarker = (text, x, z) => {
      const sprite = this.createCADTextSprite(text, 32, '#00f2fe');
      sprite.position.set(x, 0.2, z);
      sprite.scale.set(1.2, 0.6, 1);
      this.groundGroup.add(sprite);
    };
    addMarker('N (0°)', 0, -8.7);
    addMarker('S (180°)', 0, 8.7);
    addMarker('E (90°)', 8.7, 0);
    addMarker('W (270°)', -8.7, 0);

    // 3. Concrete Plinth / Foundation Slab with Cyan Edge
    const plinthGeo = new THREE.BoxGeometry(7.8, 0.35, 6.6);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x091932,
      roughness: 0.3,
      metalness: 0.85
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(-0.2, 0.18, -0.2);
    this.groundGroup.add(plinth);
    this.addWireframeEdges(plinth, plinthGeo, 0x00f2fe, 0.7);
    this.disposables.push(plinthGeo, plinthMat);

    // 4. Paver Walkway & Futuristic Landscaping Strip
    const lawnGeo = new THREE.BoxGeometry(8.0, 0.08, 0.9);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      emissive: 0x047857,
      emissiveIntensity: 0.25,
      roughness: 0.6
    });
    const lawn1 = new THREE.Mesh(lawnGeo, lawnMat);
    lawn1.position.set(-0.2, 0.24, 3.25);
    this.groundGroup.add(lawn1);
    this.addWireframeEdges(lawn1, lawnGeo, 0x10b981, 0.6);
    this.disposables.push(lawnGeo, lawnMat);

    // Holographic corner landscaping shrub
    const shrubGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const shrubMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.4,
      wireframe: true
    });
    const shrub = new THREE.Mesh(shrubGeo, shrubMat);
    shrub.position.set(-3.6, 0.55, 3.1);
    this.groundGroup.add(shrub);
    this.disposables.push(shrubGeo, shrubMat);
  }

  // ==================== Futuristic Architectural Smart House ====================
  createFuturisticSmartHouse() {
    this.houseGroup = new THREE.Group();
    this.universeGroup.add(this.houseGroup);

    // Materials Palette
    // 1. Dark Navy Obsidian Structural Facade
    this.facadeMat = new THREE.MeshStandardMaterial({
      color: 0x07152b,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92
    });
    this.wallMaterials.push(this.facadeMat);

    // 2. Second floor accent cladding
    this.upperFacadeMat = new THREE.MeshStandardMaterial({
      color: 0x0a2142,
      roughness: 0.25,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    this.wallMaterials.push(this.upperFacadeMat);

    // 3. Futuristic Tinted Glass (Semi-Transparent Curtain Wall)
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.12,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.45,
      transmission: 0.6,
      ior: 1.5
    });

    // 4. White / Cyan Architectural Trims & Structural Frames
    const structuralFrameMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.9
    });

    // 5. Roof Slate Slopes
    this.roofMat = new THREE.MeshStandardMaterial({
      color: 0x0b1a30,
      roughness: 0.3,
      metalness: 0.75
    });

    this.disposables.push(this.facadeMat, this.upperFacadeMat, this.glassMat, structuralFrameMat, this.roofMat);

    const groundH = 1.65;
    const upperH = 1.55;

    // -------------------------------------------------------------
    // 1. Ground Floor (Dark Obsidian Body with Cyan Wireframe)
    // -------------------------------------------------------------
    const gfMainGeo = new THREE.BoxGeometry(5.2, groundH, 3.4);
    const gfMain = new THREE.Mesh(gfMainGeo, this.facadeMat);
    gfMain.position.set(-0.3, -0.9, -0.4);
    this.houseGroup.add(gfMain);
    this.addWireframeEdges(gfMain, gfMainGeo, 0x00f2fe, 0.85);

    const gfFrontGeo = new THREE.BoxGeometry(2.6, groundH, 1.8);
    const gfFront = new THREE.Mesh(gfFrontGeo, this.facadeMat);
    gfFront.position.set(1.0, -0.9, 1.3);
    this.houseGroup.add(gfFront);
    this.addWireframeEdges(gfFront, gfFrontGeo, 0x00f2fe, 0.85);

    // -------------------------------------------------------------
    // 2. Mid-Band Floor Slab (Glowing Divider Ribbon)
    // -------------------------------------------------------------
    const band1Geo = new THREE.BoxGeometry(5.35, 0.14, 3.55);
    const band1 = new THREE.Mesh(band1Geo, structuralFrameMat);
    band1.position.set(-0.3, -0.05, -0.4);
    this.houseGroup.add(band1);
    this.addWireframeEdges(band1, band1Geo, 0x38bdf8, 0.95);

    const band2Geo = new THREE.BoxGeometry(2.75, 0.14, 1.95);
    const band2 = new THREE.Mesh(band2Geo, structuralFrameMat);
    band2.position.set(1.0, -0.05, 1.3);
    this.houseGroup.add(band2);
    this.addWireframeEdges(band2, band2Geo, 0x38bdf8, 0.95);

    // -------------------------------------------------------------
    // 3. Upper Story & Cantilevered Balcony
    // -------------------------------------------------------------
    const ufMainGeo = new THREE.BoxGeometry(5.0, upperH, 3.3);
    const ufMain = new THREE.Mesh(ufMainGeo, this.upperFacadeMat);
    ufMain.position.set(-0.3, 0.78, -0.4);
    this.houseGroup.add(ufMain);
    this.addWireframeEdges(ufMain, ufMainGeo, 0x00f2fe, 0.85);

    const ufFrontGeo = new THREE.BoxGeometry(2.5, upperH, 1.8);
    const ufFront = new THREE.Mesh(ufFrontGeo, this.upperFacadeMat);
    ufFront.position.set(1.0, 0.78, 1.3);
    this.houseGroup.add(ufFront);
    this.addWireframeEdges(ufFront, ufFrontGeo, 0x00f2fe, 0.85);

    // Cantilevered Upper Terrace Balcony
    const balconyFloorGeo = new THREE.BoxGeometry(2.4, 0.12, 1.1);
    const balconyFloor = new THREE.Mesh(balconyFloorGeo, structuralFrameMat);
    balconyFloor.position.set(-1.6, -0.05, 1.6);
    this.houseGroup.add(balconyFloor);
    this.addWireframeEdges(balconyFloor, balconyFloorGeo, 0x00f2fe, 0.9);

    // Balcony Glowing Glass Railing
    const balconyGlassGeo = new THREE.BoxGeometry(2.35, 0.7, 0.06);
    const balconyGlass = new THREE.Mesh(balconyGlassGeo, this.glassMat);
    balconyGlass.position.set(-1.6, 0.35, 2.12);
    this.houseGroup.add(balconyGlass);
    this.addWireframeEdges(balconyGlass, balconyGlassGeo, 0x38bdf8, 0.9);

    const balconySideGlassGeo = new THREE.BoxGeometry(0.06, 0.7, 1.05);
    const balconySideGlass = new THREE.Mesh(balconySideGlassGeo, this.glassMat);
    balconySideGlass.position.set(-2.75, 0.35, 1.6);
    this.houseGroup.add(balconySideGlass);
    this.addWireframeEdges(balconySideGlass, balconySideGlassGeo, 0x38bdf8, 0.9);

    // Structural Steel Support Columns (Ground to Balcony)
    const columnGeo = new THREE.CylinderGeometry(0.06, 0.06, groundH, 12);
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.3,
      metalness: 0.9
    });
    const col1 = new THREE.Mesh(columnGeo, columnMat);
    col1.position.set(-2.7, -0.9, 2.1);
    this.houseGroup.add(col1);

    const col2 = new THREE.Mesh(columnGeo, columnMat);
    col2.position.set(-0.5, -0.9, 2.1);
    this.houseGroup.add(col2);

    this.disposables.push(
      gfMainGeo, gfFrontGeo, band1Geo, band2Geo, ufMainGeo, ufFrontGeo,
      balconyFloorGeo, balconyGlassGeo, balconySideGlassGeo, columnGeo, columnMat
    );

    // -------------------------------------------------------------
    // 4. Cross-Gable Pitched Roofs with Glowing Ridge Lines
    // -------------------------------------------------------------
    const createTriangleGableWall = (width, height, mat) => {
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2, 0);
      shape.lineTo(width / 2, 0);
      shape.lineTo(0, height);
      shape.closePath();
      const extrudeSettings = { depth: 0.12, bevelEnabled: false };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    // Left Gable Wall
    const leftGableGeo = createTriangleGableWall(3.3, 1.65, this.upperFacadeMat);
    const leftGable = new THREE.Mesh(leftGableGeo, this.upperFacadeMat);
    leftGable.position.set(-2.85, 1.55, 1.25);
    leftGable.rotation.y = Math.PI / 2;
    this.houseGroup.add(leftGable);
    this.addWireframeEdges(leftGable, leftGableGeo, 0x00f2fe, 0.85);

    // Front Gable Wall
    const frontGableGeo = createTriangleGableWall(2.5, 1.25, this.upperFacadeMat);
    const frontGable = new THREE.Mesh(frontGableGeo, this.upperFacadeMat);
    frontGable.position.set(1.0, 1.55, 2.15);
    this.houseGroup.add(frontGable);
    this.addWireframeEdges(frontGable, frontGableGeo, 0x00f2fe, 0.85);

    // Main Longitudinal Roof Pitched Planes (45° pitch)
    const mainRoofSlopeLen = 2.45;
    const mainRoofLen = 5.6;

    // South/Front Slope
    const slope1Geo = new THREE.BoxGeometry(mainRoofLen, 0.08, mainRoofSlopeLen);
    const slope1 = new THREE.Mesh(slope1Geo, this.roofMat);
    slope1.position.set(-0.3, 2.38, 0.42);
    slope1.rotation.x = Math.PI / 4;
    this.houseGroup.add(slope1);
    this.addWireframeEdges(slope1, slope1Geo, 0x00f2fe, 0.85);

    // North/Back Slope
    const slope2 = new THREE.Mesh(slope1Geo, this.roofMat);
    slope2.position.set(-0.3, 2.38, -1.22);
    slope2.rotation.x = -Math.PI / 4;
    this.houseGroup.add(slope2);
    this.addWireframeEdges(slope2, slope1Geo, 0x00f2fe, 0.85);

    // Front Projecting Gable Slopes (Intersecting valley at 107.5°)
    const frontRoofSlopeLen = 1.95;
    const frontRoofLen = 2.8;
    const fSlopeGeo = new THREE.BoxGeometry(frontRoofLen, 0.08, frontRoofSlopeLen);

    // East Slope of Front Gable
    const fSlopeE = new THREE.Mesh(fSlopeGeo, this.roofMat);
    fSlopeE.position.set(1.68, 2.18, 1.3);
    fSlopeE.rotation.z = -Math.PI / 4;
    fSlopeE.rotation.y = Math.PI / 2;
    this.houseGroup.add(fSlopeE);
    this.addWireframeEdges(fSlopeE, fSlopeGeo, 0x00f2fe, 0.85);

    // West Slope of Front Gable
    const fSlopeW = new THREE.Mesh(fSlopeGeo, this.roofMat);
    fSlopeW.position.set(0.32, 2.18, 1.3);
    fSlopeW.rotation.z = Math.PI / 4;
    fSlopeW.rotation.y = Math.PI / 2;
    this.houseGroup.add(fSlopeW);
    this.addWireframeEdges(fSlopeW, fSlopeGeo, 0x00f2fe, 0.85);

    // Glowing Roof Ridge Beam
    const ridgePoints = [
      new THREE.Vector3(-3.1, 3.25, -0.4),
      new THREE.Vector3(2.5, 3.25, -0.4)
    ];
    const ridgeGeo = new THREE.BufferGeometry().setFromPoints(ridgePoints);
    const ridgeMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
    this.houseGroup.add(new THREE.Line(ridgeGeo, ridgeMat));

    // Valley line
    const valleyPoints = [
      new THREE.Vector3(1.0, 2.8, 1.3),
      new THREE.Vector3(1.0, 2.8, -0.4)
    ];
    const valleyGeo = new THREE.BufferGeometry().setFromPoints(valleyPoints);
    this.houseGroup.add(new THREE.Line(valleyGeo, ridgeMat));

    this.disposables.push(leftGableGeo, frontGableGeo, slope1Geo, fSlopeGeo, ridgeGeo, ridgeMat, valleyGeo);

    // -------------------------------------------------------------
    // 5. Transparent Architectural Windows with Interior Glow
    // -------------------------------------------------------------
    this.windowFrames = [];
    const addSmartWindow = (x, y, z, w, h, isRotY = false) => {
      const frameGeo = new THREE.BoxGeometry(w, h, 0.08);
      const frame = new THREE.Mesh(frameGeo, structuralFrameMat);
      frame.position.set(x, y, z);
      if (isRotY) frame.rotation.y = Math.PI / 2;

      const glassGeo = new THREE.BoxGeometry(w - 0.12, h - 0.12, 0.1);
      const glass = new THREE.Mesh(glassGeo, this.glassMat);
      frame.add(glass);
      this.addWireframeEdges(frame, frameGeo, 0x00f2fe, 0.9);

      this.houseGroup.add(frame);
      this.windowFrames.push(frame);
      this.disposables.push(frameGeo, glassGeo);
    };

    // Ground Floor Windows
    addSmartWindow(2.0, -0.75, 2.22, 0.9, 1.0);
    addSmartWindow(2.32, -0.75, -0.4, 0.9, 1.0, true);
    addSmartWindow(-2.82, -0.75, 0.2, 0.85, 0.9, true);

    // Upper Floor Windows
    addSmartWindow(0.45, 0.95, 2.22, 0.75, 0.95);
    addSmartWindow(1.55, 0.95, 2.22, 0.75, 0.95);
    addSmartWindow(-2.82, 0.95, -0.4, 1.6, 0.85, true);
    addSmartWindow(2.22, 0.95, -0.4, 0.8, 0.9, true);

    // Balcony French Sliding Doors
    addSmartWindow(-1.6, 0.9, 1.28, 1.8, 1.2);

    // -------------------------------------------------------------
    // 6. Recessed Modern Entrance Door & Concrete Steps
    // -------------------------------------------------------------
    const doorGeo = new THREE.BoxGeometry(0.85, 1.45, 0.06);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
      roughness: 0.4
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(-0.15, -0.85, 2.05);
    this.houseGroup.add(door);
    this.addWireframeEdges(door, doorGeo, 0x38bdf8, 0.8);

    // Steps
    for (let s = 0; s < 3; s++) {
      const stepGeo = new THREE.BoxGeometry(1.2 - s * 0.15, 0.12, 0.35);
      const step = new THREE.Mesh(stepGeo, structuralFrameMat);
      step.position.set(-0.15, -1.6 + s * 0.12, 2.35 + (2 - s) * 0.25);
      this.houseGroup.add(step);
      this.addWireframeEdges(step, stepGeo, 0x00f2fe, 0.7);
      this.disposables.push(stepGeo);
    }
    this.disposables.push(doorGeo, doorMat);

    // -------------------------------------------------------------
    // 7. Interior Visible Rooms & Ambient Illumination
    // -------------------------------------------------------------
    this.interiorLight = new THREE.PointLight(0x38bdf8, 1.5, 8.0);
    this.interiorLight.position.set(0.5, 0.5, 0.2);
    this.houseGroup.add(this.interiorLight);

    // Interior Room Silhouettes
    this.interiorFurnitureGroup = new THREE.Group();
    this.houseGroup.add(this.interiorFurnitureGroup);

    // Living Room Sofa Silhouette
    const sofaGeo = new THREE.BoxGeometry(1.2, 0.38, 0.55);
    const furnitureMat = new THREE.MeshStandardMaterial({
      color: 0x0f3460,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.2,
      roughness: 0.5
    });
    const sofa = new THREE.Mesh(sofaGeo, furnitureMat);
    sofa.position.set(1.0, -1.4, 0.8);
    this.interiorFurnitureGroup.add(sofa);

    // Coffee Table
    const tableGeo = new THREE.BoxGeometry(0.7, 0.22, 0.4);
    const table = new THREE.Mesh(tableGeo, furnitureMat);
    table.position.set(1.0, -1.5, 0.1);
    this.interiorFurnitureGroup.add(table);

    // Modern Cantilevered Staircase
    for (let st = 0; st < 8; st++) {
      const treadGeo = new THREE.BoxGeometry(0.8, 0.05, 0.22);
      const tread = new THREE.Mesh(treadGeo, furnitureMat);
      tread.position.set(-1.8, -1.4 + st * 0.2, -0.8 + st * 0.18);
      this.interiorFurnitureGroup.add(tread);
      this.disposables.push(treadGeo);
    }

    // Upper Floor Bed Silhouette
    const bedGeo = new THREE.BoxGeometry(1.4, 0.35, 1.5);
    const bed = new THREE.Mesh(bedGeo, furnitureMat);
    bed.position.set(0.4, 0.3, -0.6);
    this.interiorFurnitureGroup.add(bed);

    this.disposables.push(sofaGeo, tableGeo, bedGeo, furnitureMat);

    // Attachment coordinate points for 3D conduits
    this.houseAttachmentPoints = {
      'roof': new THREE.Vector3(1.0, 2.8, 1.3),
      'upper-cantilever': new THREE.Vector3(-1.6, 1.2, 1.6),
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

  // Helper to add glowing wireframe edges
  addWireframeEdges(mesh, geometry, colorHex = 0x00f2fe, opacity = 0.85) {
    const edgesGeo = new THREE.EdgesGeometry(geometry, 25);
    const edgesMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending
    });
    const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    mesh.add(wireframe);
    this.disposables.push(edgesGeo, edgesMat);
    return wireframe;
  }

  // ==================== Blueprint Dimension Annotations ====================
  createBlueprintDimensionAnnotations() {
    this.cadAnnotationsGroup = new THREE.Group();
    this.universeGroup.add(this.cadAnnotationsGroup);

    // 1. Front Dimension Line: L = 8.65m
    const frontDimY = -1.75;
    const frontDimZ = 4.3;
    const pFrontL = new THREE.Vector3(-2.9, frontDimY, frontDimZ);
    const pFrontR = new THREE.Vector3(2.9, frontDimY, frontDimZ);

    this.createDimensionLineWithArrows(pFrontL, pFrontR, 0x00f2fe);
    const labelL = this.createCADTextSprite('L = 8.65m (Frontage)', 24, '#00f2fe');
    labelL.position.set(0, frontDimY + 0.35, frontDimZ);
    labelL.scale.set(2.8, 0.8, 1);
    this.cadAnnotationsGroup.add(labelL);

    // 2. Left Side Height Dimension Line: H = 3.20m
    const sideDimX = -4.3;
    const pSideBottom = new THREE.Vector3(sideDimX, -1.8, 0);
    const pSideTop = new THREE.Vector3(sideDimX, 1.4, 0);

    this.createDimensionLineWithArrows(pSideBottom, pSideTop, 0x38bdf8);
    const labelH1 = this.createCADTextSprite('H = 3.20m (Eaves)', 24, '#38bdf8');
    labelH1.position.set(sideDimX - 0.2, -0.2, 0);
    labelH1.scale.set(2.6, 0.8, 1);
    this.cadAnnotationsGroup.add(labelH1);

    // Vertical Coordinate Arrow
    const arrowZ = this.createCADTextSprite('+Z Axis', 24, '#38bdf8');
    arrowZ.position.set(sideDimX, 2.0, 0);
    arrowZ.scale.set(1.4, 0.7, 1);
    this.cadAnnotationsGroup.add(arrowZ);

    // 3. Front Right Roof Apex Height: H = 2.90m
    const rightDimX = 3.9;
    const pRightBottom = new THREE.Vector3(rightDimX, 0.0, 1.3);
    const pRightTop = new THREE.Vector3(rightDimX, 2.9, 1.3);

    this.createDimensionLineWithArrows(pRightBottom, pRightTop, 0xa855f7);
    const labelH2 = this.createCADTextSprite('H = 2.90m (Ridge)', 24, '#a855f7');
    labelH2.position.set(rightDimX + 0.3, 1.45, 1.3);
    labelH2.scale.set(2.6, 0.8, 1);
    this.cadAnnotationsGroup.add(labelH2);

    // 4. Roof Pitch Annotation: Roof Pitch: 45°
    const pitchLabel = this.createCADTextSprite('Roof Pitch: 45°', 24, '#00f2fe');
    pitchLabel.position.set(2.6, 3.4, -0.4);
    pitchLabel.scale.set(2.8, 0.8, 1);
    this.cadAnnotationsGroup.add(pitchLabel);

    // 5. Roof Valley Angle Callout: A = 107.5°
    const angleLabel = this.createCADTextSprite('Valley A = 107.5°', 24, '#00f2fe');
    angleLabel.position.set(0.35, 1.65, 1.35);
    angleLabel.scale.set(2.6, 0.8, 1);
    this.cadAnnotationsGroup.add(angleLabel);

    // CAD curved arc
    const arcPoints = [];
    for (let a = 0; a <= 20; a++) {
      const ang = Math.PI * 0.15 + (a / 20) * Math.PI * 0.45;
      arcPoints.push(new THREE.Vector3(Math.cos(ang) * 0.8 + 0.2, Math.sin(ang) * 0.6 + 1.25, 1.3));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 1.5 });
    this.cadAnnotationsGroup.add(new THREE.Line(arcGeo, arcMat));
    this.disposables.push(arcGeo, arcMat);
  }

  createDimensionLineWithArrows(pA, pB, colorHex = 0x00f2fe) {
    const points = [pA, pB];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 1.5 });
    const line = new THREE.Line(lineGeo, lineMat);
    this.cadAnnotationsGroup.add(line);

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

  createCADTextSprite(text, fontSize = 26, textColor = '#00f2fe') {
    const canvas = document.createElement('canvas');
    canvas.width = 380;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(7, 18, 38, 0.75)';
    ctx.roundRect(4, 4, 372, 88, 12);
    ctx.fill();

    ctx.strokeStyle = `${textColor}55`;
    ctx.lineWidth = 2;
    ctx.roundRect(4, 4, 372, 88, 12);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = `600 ${fontSize}px "Outfit", "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 190, 48);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    this.disposables.push(texture, material);
    return sprite;
  }

  // ==================== CAD 3D Coordinate Trihedron ====================
  createCADTrihedron() {
    this.trihedronGroup = new THREE.Group();
    this.trihedronGroup.position.set(-6.2, -2.2, 5.2);
    this.universeGroup.add(this.trihedronGroup);

    const len = 1.3;
    const xGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(len, 0, 0)]);
    const xMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    this.trihedronGroup.add(new THREE.Line(xGeo, xMat));

    const yGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -len)]);
    const yMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    this.trihedronGroup.add(new THREE.Line(yGeo, yMat));

    const zGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, len, 0)]);
    const zMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
    this.trihedronGroup.add(new THREE.Line(zGeo, zMat));

    const lX = this.createCADTextSprite('X', 22, '#ef4444');
    lX.position.set(len + 0.25, 0, 0);
    lX.scale.set(0.7, 0.45, 1);
    this.trihedronGroup.add(lX);

    const lY = this.createCADTextSprite('Y', 22, '#10b981');
    lY.position.set(0, 0, -len - 0.25);
    lY.scale.set(0.7, 0.45, 1);
    this.trihedronGroup.add(lY);

    const lZ = this.createCADTextSprite('Z', 22, '#00f2fe');
    lZ.position.set(0, len + 0.25, 0);
    lZ.scale.set(0.7, 0.45, 1);
    this.trihedronGroup.add(lZ);

    this.disposables.push(xGeo, yGeo, zGeo, xMat, yMat, zMat);
  }

  // ==================== 12 Floating Construction Feature Nodes ====================
  createFeatureNodes() {
    this.nodesGroup = new THREE.Group();
    this.universeGroup.add(this.nodesGroup);

    CONSTRUCTION_FEATURES.forEach((feature, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.userData = { feature, index: idx, id: feature.id };

      const angle = feature.orbitAngle;
      const x = Math.cos(angle) * (feature.radiusX || 7.6);
      const z = Math.sin(angle) * (feature.radiusY || 5.4);
      const y = (feature.elevation || 0) * 1.12;

      nodeGroup.position.set(x, y, z);
      nodeGroup.userData.basePos = new THREE.Vector3(x, y, z);
      nodeGroup.userData.floatOffset = idx * 0.55;

      // 1. Core Glowing Sphere
      const sphereGeo = new THREE.SphereGeometry(0.35, 16, 14);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: feature.colorHex,
        emissive: feature.colorHex,
        emissiveIntensity: 0.95,
        roughness: 0.2,
        metalness: 0.8
      });
      const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
      coreSphere.userData = { featureId: feature.id, isRaycastTarget: true };
      nodeGroup.add(coreSphere);
      this.disposables.push(sphereGeo, sphereMat);

      // 2. Outer Wireframe Shell (Icosahedron)
      const shellGeo = new THREE.IcosahedronGeometry(0.54, 1);
      const shellWire = new THREE.WireframeGeometry(shellGeo);
      const shellMat = new THREE.LineBasicMaterial({
        color: feature.colorHex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const shellMesh = new THREE.LineSegments(shellWire, shellMat);
      nodeGroup.add(shellMesh);
      this.disposables.push(shellGeo, shellWire, shellMat);

      // 3. Neon Gyro Ring
      const gyroPoints = [];
      for (let i = 0; i <= 32; i++) {
        const theta = (i / 32) * Math.PI * 2;
        gyroPoints.push(new THREE.Vector3(Math.cos(theta) * 0.68, Math.sin(theta) * 0.68, 0));
      }
      const gyroGeo = new THREE.BufferGeometry().setFromPoints(gyroPoints);
      const gyroMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      });
      const gyroRing = new THREE.LineLoop(gyroGeo, gyroMat);
      gyroRing.rotation.x = Math.PI / 3;
      gyroRing.rotation.y = (idx % 3) * 0.45;
      nodeGroup.add(gyroRing);
      this.disposables.push(gyroGeo, gyroMat);

      // 4. Local Neon Point Light
      const light = new THREE.PointLight(feature.colorHex, 1.4, 5.5);
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

  // ==================== Conduits Connecting Nodes to House ====================
  createHouseConduits() {
    this.conduitsGroup = new THREE.Group();
    this.universeGroup.add(this.conduitsGroup);

    this.featureNodeMeshes.forEach((nodeItem) => {
      const feature = nodeItem.feature;
      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: feature.colorHex,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
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

  // ==================== Animated Data Pulse System ====================
  createDataPulseSystem() {
    this.dataPacketsGroup = new THREE.Group();
    this.universeGroup.add(this.dataPacketsGroup);

    const count = 20;
    const packetGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = 0.0;
      colors[i * 3 + 1] = 0.95;
      colors[i * 3 + 2] = 1.0;

      this.dataPackets.push({
        conduitIndex: i % (this.houseConnectionLines.length || 1),
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.4
      });
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    packetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const packetMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    this.packetPointsMesh = new THREE.Points(packetGeo, packetMat);
    this.dataPacketsGroup.add(this.packetPointsMesh);
    this.disposables.push(packetGeo, packetMat);
  }

  // ==================== Background Construction Data Particles ====================
  createConstructionDataParticles() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 300 : 700;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x00f2fe);
    const purple = new THREE.Color(0xa855f7);
    const gold = new THREE.Color(0xfbbf24);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36 - 2;

      const pick = Math.random();
      const c = pick < 0.5 ? cyan : (pick < 0.8 ? purple : gold);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particlesSystem = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particlesSystem);
    this.disposables.push(particleGeo, particleMat);
  }

  // ==================== Edge Tracer Pulse System ====================
  createEdgeTracerSystem() {
    const tracerCount = 12;
    const tracerGeo = new THREE.BufferGeometry();
    const tracerPositions = new Float32Array(tracerCount * 3);

    for (let i = 0; i < tracerCount * 3; i++) {
      tracerPositions[i] = 0;
    }
    tracerGeo.setAttribute('position', new THREE.BufferAttribute(tracerPositions, 3));

    const tracerMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.32,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.edgeTracerMesh = new THREE.Points(tracerGeo, tracerMat);
    this.houseGroup.add(this.edgeTracerMesh);
    this.disposables.push(tracerGeo, tracerMat);

    this.perimeterWaypoints = [
      new THREE.Vector3(-2.8, -0.05, -2.0),
      new THREE.Vector3(2.3, -0.05, -2.0),
      new THREE.Vector3(2.3, -0.05, 2.2),
      new THREE.Vector3(-0.3, -0.05, 2.2),
      new THREE.Vector3(-2.8, -0.05, 1.3),
      new THREE.Vector3(-2.8, 1.55, 1.3),
      new THREE.Vector3(0.0, 3.25, -0.4),
      new THREE.Vector3(2.5, 2.38, 0.4)
    ];

    this.tracers = [];
    for (let t = 0; t < tracerCount; t++) {
      this.tracers.push({
        progress: t / tracerCount,
        speed: 0.18 + Math.random() * 0.1
      });
    }
  }

  // ==================== Special Interactive Feature 3D Systems ====================
  createSpecialReactionSystems() {
    // 1. AI Neural-Network Effect around top node
    this.neuralNetworkGroup = new THREE.Group();
    this.neuralNetworkGroup.position.set(0, 4.0, 0);
    this.neuralNetworkGroup.visible = false;
    this.universeGroup.add(this.neuralNetworkGroup);

    const nnNodes = 14;
    const nnPoints = [];
    for (let i = 0; i < nnNodes; i++) {
      nnPoints.push(new THREE.Vector3(
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 3.0
      ));
    }
    const nnGeo = new THREE.BufferGeometry().setFromPoints(nnPoints);
    const nnMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.35,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.neuralNetworkGroup.add(new THREE.Points(nnGeo, nnMat));

    const lineIndices = [];
    for (let i = 0; i < nnNodes; i++) {
      for (let j = i + 1; j < nnNodes; j++) {
        if (nnPoints[i].distanceTo(nnPoints[j]) < 2.2) {
          lineIndices.push(nnPoints[i], nnPoints[j]);
        }
      }
    }
    const nnLinesGeo = new THREE.BufferGeometry().setFromPoints(lineIndices);
    const nnLinesMat = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.neuralNetworkGroup.add(new THREE.LineSegments(nnLinesGeo, nnLinesMat));
    this.disposables.push(nnGeo, nnMat, nnLinesGeo, nnLinesMat);

    // 2. Material Recommendation: Floating 3D Material Indicators
    this.materialCubesGroup = new THREE.Group();
    this.materialCubesGroup.visible = false;
    this.universeGroup.add(this.materialCubesGroup);

    const materials = [
      { name: 'OPC 53 Cement', color: 0x94a3b8, pos: new THREE.Vector3(3.2, 0.5, 2.5) },
      { name: 'Fe-550D Steel', color: 0x38bdf8, pos: new THREE.Vector3(3.4, 1.8, 1.0) },
      { name: 'AAC Blocks', color: 0xcbd5e1, pos: new THREE.Vector3(-3.4, 0.4, 2.2) },
      { name: 'Smart Glass', color: 0x00f2fe, pos: new THREE.Vector3(-3.2, 1.8, 0.8) },
      { name: 'Weather Coating', color: 0xf59e0b, pos: new THREE.Vector3(0, 3.8, 2.4) },
      { name: 'Vitrified Tiles', color: 0xa855f7, pos: new THREE.Vector3(0, -1.2, 3.6) }
    ];

    materials.forEach(mat => {
      const cGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
      const cMat = new THREE.MeshStandardMaterial({
        color: mat.color,
        emissive: mat.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const cube = new THREE.Mesh(cGeo, cMat);
      cube.position.copy(mat.pos);
      this.addWireframeEdges(cube, cGeo, 0xffffff, 0.9);

      const label = this.createCADTextSprite(mat.name, 20, '#ffffff');
      label.position.set(mat.pos.x, mat.pos.y + 0.4, mat.pos.z);
      label.scale.set(1.6, 0.5, 1);

      this.materialCubesGroup.add(cube);
      this.materialCubesGroup.add(label);
      this.disposables.push(cGeo, cMat);
    });

    // 3. Land Area Measurement: Digital Ground Plot Grid & Boundary
    this.landMeasurementGroup = new THREE.Group();
    this.landMeasurementGroup.position.y = -1.92;
    this.landMeasurementGroup.visible = false;
    this.universeGroup.add(this.landMeasurementGroup);

    const boundaryPts = [
      new THREE.Vector3(-4.5, 0.05, -3.8),
      new THREE.Vector3(4.5, 0.05, -3.8),
      new THREE.Vector3(4.5, 0.05, 4.2),
      new THREE.Vector3(-4.5, 0.05, 4.2),
      new THREE.Vector3(-4.5, 0.05, -3.8)
    ];
    const bGeo = new THREE.BufferGeometry().setFromPoints(boundaryPts);
    const bMat = new THREE.LineBasicMaterial({
      color: 0x84cc16,
      linewidth: 2,
      blending: THREE.AdditiveBlending
    });
    this.landMeasurementGroup.add(new THREE.Line(bGeo, bMat));

    const plotLabel = this.createCADTextSprite('Plot: 1,200 sq.ft (30\' × 40\')', 24, '#84cc16');
    plotLabel.position.set(0, 0.35, 4.8);
    plotLabel.scale.set(3.2, 0.85, 1);
    this.landMeasurementGroup.add(plotLabel);
    this.disposables.push(bGeo, bMat);

    // 4. Safety Monitoring: Warning Perimeters & Beacons
    this.safetyZoneGroup = new THREE.Group();
    this.safetyZoneGroup.visible = false;
    this.universeGroup.add(this.safetyZoneGroup);

    const beaconGeo = new THREE.RingGeometry(0.8, 1.0, 32);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const beacon1 = new THREE.Mesh(beaconGeo, beaconMat);
    beacon1.rotation.x = Math.PI / 2;
    beacon1.position.set(-1.6, 0.02, 2.1);
    this.safetyZoneGroup.add(beacon1);

    const safetyLabel = this.createCADTextSprite('⚡ Hazard Zone Laser Geofence', 22, '#ef4444');
    safetyLabel.position.set(-1.6, 1.2, 2.1);
    safetyLabel.scale.set(2.8, 0.75, 1);
    this.safetyZoneGroup.add(safetyLabel);
    this.disposables.push(beaconGeo, beaconMat);
  }

  // ==================== Glassmorphism HTML Telemetry Labels ====================
  createHtmlLabels() {
    if (!this.labelsOverlay) return;
    this.labelsOverlay.innerHTML = '';
    this.htmlLabelElements.clear();

    CONSTRUCTION_FEATURES.forEach((feature) => {
      const label = document.createElement('div');
      label.className = `skill-glass-label feature-${feature.id}`;
      label.setAttribute('tabindex', '0');
      label.setAttribute('role', 'button');
      label.setAttribute('aria-label', `Inspect ${feature.name}`);
      label.dataset.featureId = feature.id;

      label.innerHTML = `
        <span class="label-dot" style="background-color:${feature.color};box-shadow:0 0 12px ${feature.glowColor}"></span>
        <span class="label-text">${feature.shortName || feature.name}</span>
        <span class="label-icon"><i class="fas ${feature.icon}"></i></span>
      `;

      label.addEventListener('mouseenter', () => this.handleFeatureHover(feature.id));
      label.addEventListener('mouseleave', () => this.handleFeatureHover(null));

      label.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleFeatureSelect(feature.id);
      });

      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleFeatureSelect(feature.id);
        }
      });

      this.labelsOverlay.appendChild(label);
      this.htmlLabelElements.set(feature.id, label);
    });
  }

  // ==================== 3D to 2D Label Projection & Conduits ====================
  updateLabelsAndConduits() {
    if (!this.labelsOverlay || !this.camera) return;

    const overlayRect = this.labelsOverlay.getBoundingClientRect();
    const w = overlayRect.width || this.width || 920;
    const h = overlayRect.height || this.height || 680;

    const labelCoords = [];
    const svgLinesHtml = [];

    const worldPos = new THREE.Vector3();
    const screenPos = new THREE.Vector3();

    this.featureNodeMeshes.forEach((nodeItem) => {
      const feature = nodeItem.feature;
      const labelEl = this.htmlLabelElements.get(feature.id);
      if (!labelEl) return;

      const isVisibleCategory = this.activeCategory === 'ALL' || feature.category === this.activeCategory;
      if (!isVisibleCategory) {
        labelEl.style.display = 'none';
        return;
      } else {
        labelEl.style.display = 'flex';
      }

      nodeItem.group.getWorldPosition(worldPos);
      screenPos.copy(worldPos).project(this.camera);

      if (screenPos.z > 1) {
        labelEl.style.opacity = '0';
        return;
      }

      const pxX = ((screenPos.x * 0.5) + 0.5) * w;
      const pxY = ((-screenPos.y * 0.5) + 0.5) * h;

      const angle = feature.orbitAngle;
      const pushDistX = Math.cos(angle) * 38;
      const pushDistY = -Math.sin(angle) * 28;

      let labelX = pxX + pushDistX;
      let labelY = pxY + pushDistY;

      labelX = Math.max(85, Math.min(w - 95, labelX));
      labelY = Math.max(40, Math.min(h - 45, labelY));

      labelCoords.push({ id: feature.id, nodeX: pxX, nodeY: pxY, labelX, labelY, color: feature.color });

      labelEl.style.transform = `translate3d(${labelX}px, ${labelY}px, 0) translate(-50%, -50%)`;
      labelEl.style.opacity = (this.hoveredFeatureId && this.hoveredFeatureId !== feature.id) ? '0.4' : '1';
    });

    if (this.svgLinesEl) {
      labelCoords.forEach((coord) => {
        const isHovered = this.hoveredFeatureId === coord.id;
        const isSelected = this.selectedFeatureId === coord.id;
        const strokeColor = isHovered || isSelected ? coord.color : 'rgba(0, 242, 254, 0.4)';
        const strokeWidth = isHovered || isSelected ? 2.2 : 1.0;
        const strokeDash = isHovered ? 'none' : '3,3';

        svgLinesHtml.push(`
          <line 
            x1="${coord.nodeX}" y1="${coord.nodeY}" 
            x2="${coord.labelX}" y2="${coord.labelY}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeWidth}" 
            stroke-dasharray="${strokeDash}"
          />
        `);
      });
      this.svgLinesEl.innerHTML = svgLinesHtml.join('');
    }
  }

  // ==================== Interactions & Real-Time Feature Reactions ====================
  handleFeatureHover(featureId) {
    if (this.hoveredFeatureId === featureId) return;
    this.hoveredFeatureId = featureId;

    this.featureNodeMeshes.forEach((nodeItem) => {
      const isThis = nodeItem.feature.id === featureId;
      const isConnected = featureId && nodeItem.feature.connections.includes(featureId);

      if (isThis) {
        nodeItem.core.scale.set(1.45, 1.45, 1.45);
        nodeItem.core.material.emissiveIntensity = 2.2;
        nodeItem.shell.scale.set(1.5, 1.5, 1.5);
        nodeItem.shell.material.opacity = 1.0;
        nodeItem.light.intensity = 3.2;
      } else if (isConnected) {
        nodeItem.core.scale.set(1.15, 1.15, 1.15);
        nodeItem.core.material.emissiveIntensity = 1.35;
        nodeItem.shell.material.opacity = 0.85;
        nodeItem.light.intensity = 1.8;
      } else {
        nodeItem.core.scale.set(1.0, 1.0, 1.0);
        nodeItem.core.material.emissiveIntensity = featureId ? 0.35 : 0.95;
        nodeItem.shell.scale.set(1.0, 1.0, 1.0);
        nodeItem.shell.material.opacity = featureId ? 0.25 : 0.85;
        nodeItem.light.intensity = featureId ? 0.4 : 1.4;
      }
    });

    this.houseConnectionLines.forEach((conn) => {
      const isThis = conn.featureId === featureId;
      conn.material.opacity = isThis ? 1.0 : (featureId ? 0.1 : 0.35);
    });

    this.htmlLabelElements.forEach((el, id) => {
      el.classList.toggle('hovered', id === featureId);
    });
  }

  handleFeatureSelect(featureId) {
    this.selectedFeatureId = this.selectedFeatureId === featureId ? null : featureId;

    this.htmlLabelElements.forEach((el, id) => {
      el.classList.toggle('selected', id === this.selectedFeatureId);
    });

    this.update3DSpecialReactions(this.selectedFeatureId);

    if (this.selectedFeatureId) {
      const feature = getFeatureById(this.selectedFeatureId);
      if (feature) {
        this.displayDetailCard(feature);
      }
    } else {
      this.hideDetailCard();
    }
  }

  update3DSpecialReactions(featureId) {
    if (this.neuralNetworkGroup) {
      this.neuralNetworkGroup.visible = (featureId === 'ai-analysis');
    }

    if (this.interiorLight) {
      this.interiorLight.intensity = (featureId === 'interior-design') ? 3.8 : 1.5;
      this.interiorLight.color.setHex((featureId === 'interior-design') ? 0x00f2fe : 0x38bdf8);
    }

    if (this.materialCubesGroup) {
      this.materialCubesGroup.visible = (featureId === 'materials' || featureId === 'material-tracking');
    }

    if (this.landMeasurementGroup) {
      this.landMeasurementGroup.visible = (featureId === 'land-measurement');
    }

    if (this.safetyZoneGroup) {
      this.safetyZoneGroup.visible = (featureId === 'safety-monitoring');
    }

    if (this.wallMaterials) {
      const isPainting = featureId === 'painting';
      this.wallMaterials.forEach(mat => {
        mat.emissive = new THREE.Color(isPainting ? 0xf59e0b : 0x000000);
        mat.emissiveIntensity = isPainting ? 0.35 : 0.0;
      });
    }
  }

  // ==================== Specialized Detail Telemetry Card ====================
  displayDetailCard(feature) {
    if (!this.detailCardEl) return;

    const iconEl = this.detailCardEl.querySelector('#cardSkillIcon');
    const categoryEl = this.detailCardEl.querySelector('#cardSkillCategory');
    const titleEl = this.detailCardEl.querySelector('#cardSkillTitle');
    const summaryEl = this.detailCardEl.querySelector('#cardSkillSummary');
    const levelEl = this.detailCardEl.querySelector('#cardSkillLevel');
    const pctEl = this.detailCardEl.querySelector('#cardSkillPct');
    const progressEl = this.detailCardEl.querySelector('#cardSkillProgressBar');
    const tagsEl = this.detailCardEl.querySelector('#cardSkillTags');
    const connEl = this.detailCardEl.querySelector('#cardSkillConnections');

    if (iconEl) {
      iconEl.innerHTML = `<i class="fas ${feature.icon}"></i>`;
      iconEl.style.backgroundColor = `${feature.color}22`;
      iconEl.style.color = feature.color;
      iconEl.style.borderColor = feature.color;
    }
    if (categoryEl) categoryEl.textContent = feature.category;
    if (titleEl) {
      titleEl.textContent = feature.name;
      titleEl.style.color = feature.color;
    }
    if (summaryEl) summaryEl.textContent = feature.summary;
    if (levelEl) levelEl.textContent = feature.level;
    if (pctEl) pctEl.textContent = feature.metric;
    if (progressEl) {
      progressEl.style.width = '100%';
      progressEl.style.backgroundColor = feature.color;
      progressEl.style.boxShadow = `0 0 14px ${feature.glowColor}`;
    }

    if (tagsEl) {
      let customWidget = '';

      if (feature.id === 'painting' && feature.colorSwatches) {
        customWidget = `
          <div class="swatch-preview-box" style="width:100%;margin-bottom:10px">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:6px">Live Facade Finish Simulator:</span>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${feature.colorSwatches.map(s => `
                <button class="paint-swatch-btn" data-color="${s.hex}" style="background:${s.hex};border:2px solid ${s.accent};width:32px;height:32px;border-radius:6px;cursor:pointer" title="${s.name} - ${s.desc}"></button>
              `).join('')}
            </div>
          </div>
        `;
      }
      else if (feature.id === 'cost-estimation' && feature.costBreakdown) {
        customWidget = `
          <div style="width:100%;font-size:0.78rem;background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.08)">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#fff;font-weight:700">
              <span>Total Estimated BOQ</span>
              <span style="color:${feature.color}">${feature.totalEstimate}</span>
            </div>
            ${feature.costBreakdown.map(c => `
              <div class="flex-between" style="margin-bottom:4px;color:var(--text-muted)">
                <span>${c.item}</span>
                <strong style="color:#fff">${c.cost}</strong>
              </div>
            `).join('')}
          </div>
        `;
      }
      else if (feature.id === 'land-measurement' && feature.landTelemetry) {
        customWidget = `
          <div style="width:100%;font-size:0.78rem;background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.08)">
            <div class="flex-between" style="margin-bottom:4px"><span>Plot Dimensions</span><strong style="color:${feature.color}">${feature.landTelemetry.plotDimensions}</strong></div>
            <div class="flex-between" style="margin-bottom:4px"><span>Built-Up Area</span><strong style="color:#fff">${feature.landTelemetry.builtUpArea}</strong></div>
            <div class="flex-between" style="margin-bottom:4px"><span>Ground Coverage</span><strong style="color:#fff">${feature.landTelemetry.groundCoverage}</strong></div>
            <div class="flex-between" style="margin-bottom:4px"><span>Front Setback</span><strong style="color:#fff">${feature.landTelemetry.frontSetback}</strong></div>
          </div>
        `;
      }
      else if (feature.id === 'project-progress' && feature.milestones) {
        customWidget = `
          <div style="width:100%;font-size:0.78rem;background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.08)">
            ${feature.milestones.map(m => `
              <div style="margin-bottom:6px">
                <div class="flex-between">
                  <span><i class="fas ${m.icon}" style="margin-right:4px;color:${feature.color}"></i> ${m.stage}</span>
                  <strong style="color:#fff">${m.progress}%</strong>
                </div>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.1);border-radius:999px;margin-top:2px">
                  <div style="width:${m.progress}%;height:100%;background:${feature.color};border-radius:999px"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      else if (feature.id === 'safety-monitoring' && feature.safetyIndicators) {
        customWidget = `
          <div style="width:100%;font-size:0.78rem;background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.08)">
            ${feature.safetyIndicators.map(s => `
              <div class="flex-between" style="margin-bottom:4px">
                <span>${s.zone}</span>
                <span class="badge" style="background:${s.level === 'Safe' ? '#10b98122' : '#ef444422'};color:${s.level === 'Safe' ? '#10b981' : '#ef4444'}">${s.status}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
      else if (feature.id === 'worker-tracking' && feature.workforceData) {
        customWidget = `
          <div style="width:100%;font-size:0.78rem;background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.08)">
            ${feature.workforceData.map(w => `
              <div class="flex-between" style="margin-bottom:4px">
                <span>${w.trade}</span>
                <strong style="color:${feature.color}">${w.active} Active</strong>
              </div>
            `).join('')}
          </div>
        `;
      }

      const tagsHtml = feature.tags.map(t => `<span class="skill-tag">${t}</span>`).join('');
      tagsEl.innerHTML = customWidget + tagsHtml;

      tagsEl.querySelectorAll('.paint-swatch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const colHex = btn.dataset.color;
          if (this.wallMaterials) {
            this.wallMaterials.forEach(mat => {
              mat.color.setStyle(colHex);
            });
          }
        });
      });
    }

    if (connEl) {
      connEl.innerHTML = feature.connections.map(cId => {
        const cFeat = getFeatureById(cId);
        return cFeat ? `<button class="skill-conn-pill" data-target="${cFeat.id}" style="border-color:${cFeat.color};color:#fff">${cFeat.shortName || cFeat.name}</button>` : '';
      }).join('');

      connEl.querySelectorAll('.skill-conn-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = btn.dataset.target;
          if (target) this.handleFeatureSelect(target);
        });
      });
    }

    this.detailCardEl.classList.remove('hidden');
    this.detailCardEl.classList.add('active');
  }

  hideDetailCard() {
    if (!this.detailCardEl) return;
    this.detailCardEl.classList.remove('active');
    setTimeout(() => {
      if (!this.selectedFeatureId) {
        this.detailCardEl.classList.add('hidden');
      }
    }, 300);
  }

  setCategoryFilter(category) {
    this.activeCategory = category;

    this.featureNodeMeshes.forEach((nodeItem) => {
      const match = category === 'ALL' || nodeItem.feature.category === category;
      nodeItem.group.visible = match;
    });

    this.houseConnectionLines.forEach((conn) => {
      const match = category === 'ALL' || conn.nodeItem.feature.category === category;
      conn.mesh.visible = match;
    });

    this.updateLabelsAndConduits();
  }

  // ==================== Event Listeners ====================
  setupEventListeners() {
    this.onMouseMove = (e) => {
      if (!this.mountEl) return;
      const rect = this.mountEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.mouse.targetX = (x / rect.width) * 2 - 1;
      this.mouse.targetY = -(y / rect.height) * 2 + 1;

      this.normalizedPointer.x = this.mouse.targetX;
      this.normalizedPointer.y = this.mouse.targetY;

      if (this.camera) {
        this.raycaster.setFromCamera(this.normalizedPointer, this.camera);
        const targets = this.featureNodeMeshes.map(n => n.core);
        const intersects = this.raycaster.intersectObjects(targets);

        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.featureId;
          this.handleFeatureHover(hitId);
        } else {
          this.handleFeatureHover(null);
        }
      }
    };

    this.onCanvasClick = () => {
      if (this.camera) {
        this.raycaster.setFromCamera(this.normalizedPointer, this.camera);
        const targets = this.featureNodeMeshes.map(n => n.core);
        const intersects = this.raycaster.intersectObjects(targets);

        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.featureId;
          this.handleFeatureSelect(hitId);
        } else {
          this.handleFeatureSelect(null);
        }
      }
    };

    this.onResize = () => {
      if (!this.mountEl || !this.renderer || !this.camera) return;
      const rect = this.mountEl.getBoundingClientRect();
      const w = rect.width || this.mountEl.clientWidth || 920;
      const h = rect.height || this.mountEl.clientHeight || 680;
      if (w <= 0 || h <= 0) return;

      this.width = w;
      this.height = h;

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const cameraDistance = isMobile ? 22 : (isTablet ? 19 : 16.5);

      this.camera.position.set(cameraDistance * 0.76, cameraDistance * 0.58, cameraDistance * 0.84);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      this.updateLabelsAndConduits();
    };

    this.mountEl.addEventListener('mousemove', this.onMouseMove);
    this.mountEl.addEventListener('click', this.onCanvasClick);
    window.addEventListener('resize', this.onResize);

    const closeBtn = this.detailCardEl?.querySelector('#skillCardCloseBtn') || this.detailCardEl?.querySelector('.skill-card-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleFeatureSelect(null);
      });
    }

    const filterBtns = this.container?.querySelectorAll('.skill-filter-btn');
    if (filterBtns) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setCategoryFilter(btn.dataset.category);
        });
      });
    }

    const rotateBtn = this.container?.querySelector('#skillRotateToggleBtn');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        this.isRotating = !this.isRotating;
        rotateBtn.classList.toggle('paused', !this.isRotating);
        const span = rotateBtn.querySelector('span');
        if (span) span.textContent = this.isRotating ? 'Orbit: Active' : 'Orbit: Paused';
      });
    }

    const resetBtn = this.container?.querySelector('#skillResetCamBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.mouse.targetX = 0;
        this.mouse.targetY = 0;
        this.mouse.x = 0;
        this.mouse.y = 0;
      });
    }
  }

  // ==================== Intersection Observer ====================
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Keep active if intersecting or partially visible
        this.isInViewport = entry.isIntersecting || entry.intersectionRatio > 0;
      });
    }, { threshold: [0, 0.1] });

    if (this.container) {
      this.observer.observe(this.container);
    } else if (this.mountEl) {
      this.observer.observe(this.mountEl);
    }
  }

  // ==================== Animation Loop ====================
  animate() {
    if (this.isDestroyed) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (!this.isInViewport) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (this.universeGroup) {
      this.universeGroup.rotation.y = this.mouse.x * 0.28;
      this.universeGroup.rotation.x = -this.mouse.y * 0.15;
    }

    // Slow Continuous CAD House Axial Rotation
    if (this.isRotating && !this.reducedMotion) {
      if (this.houseGroup) {
        this.houseGroup.rotation.y += delta * 0.1;
      }
      if (this.cadAnnotationsGroup) {
        this.cadAnnotationsGroup.rotation.y += delta * 0.1;
      }
      if (this.groundGroup) {
        this.groundGroup.rotation.y += delta * 0.06;
      }
      if (this.nodesGroup) {
        this.nodesGroup.rotation.y += delta * 0.05;
      }
    }

    // Floating Motion of Feature Nodes & Gyro Spins
    this.featureNodeMeshes.forEach((nodeItem) => {
      const offset = nodeItem.group.userData.floatOffset || 0;
      const basePos = nodeItem.group.userData.basePos;

      const floatY = Math.sin(elapsedTime * 1.5 + offset) * 0.16;
      const floatZ = Math.cos(elapsedTime * 1.2 + offset) * 0.12;
      nodeItem.group.position.y = basePos.y + floatY;
      nodeItem.group.position.z = basePos.z + floatZ;

      nodeItem.shell.rotation.x += delta * 0.45;
      nodeItem.shell.rotation.y += delta * 0.55;
      nodeItem.gyro.rotation.z += delta * 0.75;
    });

    // Animate Edge Tracers Along House Perimeter
    if (this.edgeTracerMesh && this.perimeterWaypoints && this.perimeterWaypoints.length > 1) {
      const posArray = this.edgeTracerMesh.geometry.attributes.position.array;
      const totalSegs = this.perimeterWaypoints.length;

      this.tracers.forEach((tracer, i) => {
        tracer.progress = (tracer.progress + delta * tracer.speed) % 1.0;
        const exactIndex = tracer.progress * totalSegs;
        const idxA = Math.floor(exactIndex) % totalSegs;
        const idxB = (idxA + 1) % totalSegs;
        const segProgress = exactIndex - Math.floor(exactIndex);

        const pA = this.perimeterWaypoints[idxA];
        const pB = this.perimeterWaypoints[idxB];

        posArray[i * 3] = THREE.MathUtils.lerp(pA.x, pB.x, segProgress);
        posArray[i * 3 + 1] = THREE.MathUtils.lerp(pA.y, pB.y, segProgress);
        posArray[i * 3 + 2] = THREE.MathUtils.lerp(pA.z, pB.z, segProgress);
      });
      this.edgeTracerMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Windows Emissive Breathing
    if (this.glassMat) {
      this.glassMat.emissiveIntensity = 0.12 + Math.sin(elapsedTime * 2.0) * 0.06;
    }

    // Spin Neural Network Particles if active
    if (this.neuralNetworkGroup && this.neuralNetworkGroup.visible) {
      this.neuralNetworkGroup.rotation.y += delta * 0.35;
    }

    // Spin Material Indicator Cubes if active
    if (this.materialCubesGroup && this.materialCubesGroup.visible) {
      this.materialCubesGroup.rotation.y += delta * 0.2;
    }

    // Update Conduits Connecting Nodes to House Targets
    const pNode = new THREE.Vector3();
    const pHouse = new THREE.Vector3();

    this.houseConnectionLines.forEach((conn) => {
      conn.nodeItem.group.getWorldPosition(pNode);

      const targetOffset = this.houseAttachmentPoints[conn.targetZoneKey] || new THREE.Vector3(0, 0, 0);
      if (this.houseGroup) {
        this.houseGroup.localToWorld(pHouse.copy(targetOffset));
      } else {
        pHouse.copy(targetOffset);
      }

      this.conduitsGroup.worldToLocal(pNode);
      this.conduitsGroup.worldToLocal(pHouse);

      const positions = conn.geometry.attributes.position.array;
      positions[0] = pNode.x;
      positions[1] = pNode.y;
      positions[2] = pNode.z;
      positions[3] = pHouse.x;
      positions[4] = pHouse.y;
      positions[5] = pHouse.z;
      conn.geometry.attributes.position.needsUpdate = true;
    });

    // Update Traveling Data Packets (Node -> House)
    if (this.packetPointsMesh && this.houseConnectionLines.length > 0) {
      const packetPositions = this.packetPointsMesh.geometry.attributes.position.array;

      this.dataPackets.forEach((packet, i) => {
        packet.progress += delta * packet.speed;
        if (packet.progress > 1.0) {
          packet.progress = 0;
          packet.conduitIndex = Math.floor(Math.random() * this.houseConnectionLines.length);
        }

        const conn = this.houseConnectionLines[packet.conduitIndex];
        if (conn) {
          conn.nodeItem.group.getWorldPosition(pNode);
          const targetOffset = this.houseAttachmentPoints[conn.targetZoneKey] || new THREE.Vector3(0, 0, 0);
          this.houseGroup.localToWorld(pHouse.copy(targetOffset));

          this.dataPacketsGroup.worldToLocal(pNode);
          this.dataPacketsGroup.worldToLocal(pHouse);

          const px = THREE.MathUtils.lerp(pNode.x, pHouse.x, packet.progress);
          const py = THREE.MathUtils.lerp(pNode.y, pHouse.y, packet.progress);
          const pz = THREE.MathUtils.lerp(pNode.z, pHouse.z, packet.progress);

          packetPositions[i * 3] = px;
          packetPositions[i * 3 + 1] = py;
          packetPositions[i * 3 + 2] = pz;
        }
      });
      this.packetPointsMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Drift Background Construction Particles
    if (this.particlesSystem) {
      this.particlesSystem.rotation.y += delta * 0.015;
    }

    // Render WebGL Frame
    this.renderer.render(this.scene, this.camera);

    // Project 3D Nodes to 2D HTML Glassmorphism Labels
    this.updateLabelsAndConduits();
  }

  // ==================== 2D Fallback ====================
  render2DFallback() {
    if (!this.fallbackEl) return;
    this.fallbackEl.classList.remove('hidden');
    if (this.mountEl) this.mountEl.style.display = 'none';

    const grid = this.fallbackEl.querySelector('#skillFallbackGrid') || this.fallbackEl.querySelector('.fallback-grid');
    if (!grid) return;

    grid.innerHTML = CONSTRUCTION_FEATURES.map(f => `
      <div class="fallback-skill-card" style="border-top: 3px solid ${f.color}">
        <div class="flex-between">
          <span style="font-weight:700;color:#fff">${f.name}</span>
          <span style="color:${f.color}"><i class="fas ${f.icon}"></i></span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin:8px 0">${f.summary}</p>
        <span class="badge" style="background:${f.color}22;color:${f.color}">${f.metric}</span>
      </div>
    `).join('');
  }

  // ==================== Cleanup & Disposal (Both dispose and destroy) ====================
  dispose() {
    this.destroy();
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.mountEl) {
      this.mountEl.removeEventListener('mousemove', this.onMouseMove);
      this.mountEl.removeEventListener('click', this.onCanvasClick);
    }
    window.removeEventListener('resize', this.onResize);

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
    this.htmlLabelElements.clear();
  }
}
