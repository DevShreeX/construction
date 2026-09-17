// ==================== 3D House Models Architectural Viewer & Walkthrough Engine ====================
// Interactive WebGL Three.js engine for 20 residential house models.
// Features: Dual-mode loading (GLTF/GLB or distinct procedural architectural models),
// 360° orbit inspection, quick-angle views (Front, Rear, Left, Right, Top, Iso),
// turntable rotation, and smooth room-by-room architectural interior walkthroughs.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class HouseViewer3D {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    this.mountEl = options.mountEl
      ? (typeof options.mountEl === 'string' ? document.querySelector(options.mountEl) : options.mountEl)
      : this.container?.querySelector('.house-canvas-mount');

    this.onRoomChange = options.onRoomChange || null;
    this.onLoadingChange = options.onLoadingChange || null;

    this.isRotating = false;
    this.isDestroyed = false;
    this.isInWalkthrough = false;
    this.currentRoom = null;
    this.currentModelData = null;

    this.disposables = [];
    this.activeTween = null;

    this.init();
  }

  // ==================== Scene & Renderer Setup ====================
  init() {
    if (!this.mountEl) {
      console.warn('[HouseViewer3D] Mount element not found');
      return;
    }

    const rect = this.mountEl.getBoundingClientRect();
    this.width = rect.width || this.mountEl.clientWidth || 960;
    this.height = rect.height || this.mountEl.clientHeight || 560;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x071122);
    this.scene.fog = new THREE.FogExp2(0x071122, 0.012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.2, 1000);
    this.defaultCameraPos = new THREE.Vector3(18, 13, 20);
    this.defaultLookAt = new THREE.Vector3(0, 2.5, 0);
    this.camera.position.copy(this.defaultCameraPos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.mountEl.innerHTML = '';
    this.mountEl.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04; // Never go below ground
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 55;
    this.controls.target.copy(this.defaultLookAt);

    // 5. Lighting
    this.setupLighting();

    // 6. Architectural Ground & Environment
    this.setupGround();

    // 7. Master House Group
    this.houseGroup = new THREE.Group();
    this.scene.add(this.houseGroup);

    // 8. Event Listeners
    this.onWindowResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // 9. Animation Loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    this.animId = requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient light - architectural sky tone
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.4);
    this.scene.add(ambientLight);
    this.disposables.push(ambientLight);

    // Main Sunlight (Warm, sharp shadow)
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    this.sunLight.position.set(24, 32, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 100;
    const d = 26;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);
    this.disposables.push(this.sunLight);

    // Secondary Fill Light (Soft cool reflection)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fillLight.position.set(-20, 18, -16);
    this.scene.add(fillLight);
    this.disposables.push(fillLight);

    // Subtle Ground Bounce Light
    const bounceLight = new THREE.DirectionalLight(0xfef08a, 0.4);
    bounceLight.position.set(0, -10, 0);
    this.scene.add(bounceLight);
    this.disposables.push(bounceLight);
  }

  setupGround() {
    this.groundGroup = new THREE.Group();
    this.scene.add(this.groundGroup);

    // Architectural Ground Grid Plane
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a1628,
      roughness: 0.9,
      metalness: 0.1
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.02;
    groundMesh.receiveShadow = true;
    this.groundGroup.add(groundMesh);

    // Subtle CAD Grid
    const grid = new THREE.GridHelper(60, 60, 0x1e293b, 0x0f172a);
    grid.position.y = 0.01;
    this.groundGroup.add(grid);

    // Paved Driveway and Entrance Base
    const basePlinthGeo = new THREE.BoxGeometry(32, 0.25, 38);
    const basePlinthMat = new THREE.MeshStandardMaterial({
      color: 0x111c30,
      roughness: 0.85
    });
    const basePlinth = new THREE.Mesh(basePlinthGeo, basePlinthMat);
    basePlinth.position.set(0, 0.1, 0);
    basePlinth.receiveShadow = true;
    this.groundGroup.add(basePlinth);

    // Front Paver Walkway
    const walkwayGeo = new THREE.BoxGeometry(8, 0.05, 12);
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7
    });
    const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
    walkway.position.set(0, 0.26, 17);
    walkway.receiveShadow = true;
    this.groundGroup.add(walkway);
  }

  // ==================== Model Loading Pipeline ====================
  async loadHouseModel(modelData) {
    if (!modelData) return;
    this.currentModelData = modelData;
    this.notifyLoading(true, `Loading ${modelData.modelName}...`);

    // Reset walkthrough state
    this.isInWalkthrough = false;
    this.currentRoom = null;

    // Clear previous house model
    this.clearHouseGroup();

    try {
      // Try loading external GLB model if available
      let loadedViaGLTF = false;
      if (modelData.modelFile && !modelData.modelFile.includes('placeholder')) {
        try {
          loadedViaGLTF = await this.tryLoadGLTF(modelData.modelFile);
        } catch (e) {
          // Graceful fallback to procedural generator
          loadedViaGLTF = false;
        }
      }

      // If no valid GLTF file, build high-fidelity architectural procedural model
      if (!loadedViaGLTF) {
        this.buildProceduralHouse(modelData);
      }

      // Smoothly reset camera to default isometric view
      this.resetView();
    } catch (err) {
      console.error('[HouseViewer3D] Error loading model:', err);
    } finally {
      this.notifyLoading(false);
    }
  }

  tryLoadGLTF(url) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          // Normalize bounding box to fit comfortably in viewport
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 16 / (maxDim || 1);
          model.scale.set(scale, scale, scale);

          box.setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.position.y += (box.max.y - box.min.y) / 2;

          this.houseGroup.add(model);
          resolve(true);
        },
        undefined,
        (error) => {
          // Expected when external GLB is a reference placeholder
          resolve(false);
        }
      );
    });
  }

  // ==================== 20 Distinct Architectural Procedural Generators ====================
  buildProceduralHouse(modelData) {
    const params = modelData.proceduralParams || {};
    const archType = params.architecture || 'modern_two_floor';
    const levels = params.levels || 2;
    const w = params.width || 14;
    const d = params.depth || 18;
    const h = params.height || 8.5;

    const wallColor = params.wallColor ? parseInt(params.wallColor.replace('#', '0x')) : 0xf1f5f9;
    const accentColor = params.accentColor ? parseInt(params.accentColor.replace('#', '0x')) : 0x1e293b;
    const woodColor = params.woodColor ? parseInt(params.woodColor.replace('#', '0x')) : 0x9a3412;
    const glassColor = params.glassColor ? parseInt(params.glassColor.replace('#', '0x')) : 0x38bdf8;

    // Materials Palette
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.85,
      metalness: 0.05
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.65,
      metalness: 0.2
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColor,
      roughness: 0.6,
      metalness: 0.05
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: glassColor,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65
    });

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8
    });

    const tileRoofMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Terracotta red
      roughness: 0.8,
      metalness: 0.05
    });

    const metalRoofMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Charcoal standing seam
      roughness: 0.4,
      metalness: 0.6
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });

    // 1. Raised Foundation Plinth
    const plinthHeight = archType === 'coastal_modern' ? 2.5 : 0.6;
    const plinthGeo = new THREE.BoxGeometry(w + 3, plinthHeight, d + 3);
    const plinthMesh = new THREE.Mesh(plinthGeo, accentMat);
    plinthMesh.position.set(0, plinthHeight / 2, 0);
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    this.houseGroup.add(plinthMesh);

    // If coastal modern, add reinforced concrete stilts/piles
    if (archType === 'coastal_modern' || params.hasStilts) {
      this.createCoastalStilts(w, d, plinthHeight, accentMat);
    }

    const groundFloorY = plinthHeight;
    const floorHeight = h / levels;

    // 2. Main Floor Volumes
    for (let lvl = 0; lvl < levels; lvl++) {
      const currentY = groundFloorY + (lvl * floorHeight);
      const isTopLevel = lvl === levels - 1;

      // Slabs
      const slabGeo = new THREE.BoxGeometry(w + 0.8, 0.35, d + 0.8);
      const slabMesh = new THREE.Mesh(slabGeo, floorMat);
      slabMesh.position.set(0, currentY, 0);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      this.houseGroup.add(slabMesh);

      // Floor Main Walls
      const floorWallGroup = new THREE.Group();
      floorWallGroup.position.set(0, currentY + (floorHeight / 2), 0);

      // Handle custom architectural footprints
      if (archType === 'courtyard_house' || params.hasCentralCourtyard) {
        // Quadrangle walls surrounding central courtyard
        this.createCourtyardWalls(w, d, floorHeight, wallMat, accentMat, glassMat, floorWallGroup);
      } else if (archType === 'compact_urban' && lvl === 0) {
        // Ground stilt car garage
        this.createStiltGarage(w, d, floorHeight, wallMat, accentMat, floorWallGroup);
      } else {
        // Standard floor body with architectural window cutouts & glass panels
        this.createFloorVolume(w, d, floorHeight, lvl, levels, archType, wallMat, accentMat, glassMat, woodMat, floorWallGroup);
      }

      this.houseGroup.add(floorWallGroup);

      // Balconies
      if (lvl > 0 && (params.hasBalcony || params.hasDualBalconies || archType === 'modern_two_floor' || archType === 'luxury_contemporary' || archType === 'glass_facade' || archType === 'pool_villa')) {
        this.createCantileverBalcony(w, d, currentY, glassMat, woodMat, accentMat);
      }
    }

    // 3. Roof Structures
    const roofBaseY = groundFloorY + h;
    const roofType = params.roofType || 'flat_terrace';

    if (roofType === 'slope_terracotta_hip' || archType === 'traditional_indian') {
      this.createTerracottaHipRoof(w, d, roofBaseY, tileRoofMat, woodMat);
    } else if (roofType === 'kerala_gables_clay_tiles' || archType === 'traditional_kerala') {
      this.createKeralaGabledRoof(w, d, roofBaseY, tileRoofMat, woodMat);
    } else if (roofType === 'steep_asymmetrical_slope' || archType === 'sloped_roof_modern') {
      this.createAsymmetricalSlopedRoof(w, d, roofBaseY, metalRoofMat, woodMat);
    } else if (roofType === 'solar_panel_green_roof' || archType === 'eco_friendly') {
      this.createEcoSolarRoof(w, d, roofBaseY, accentMat, glassMat);
    } else if (archType === 'high_end_mansion') {
      this.createMansionCrestRoof(w, d, roofBaseY, accentMat, wallMat);
    } else {
      // Flat Contemporary Roof with Party Parapet / Terrace
      this.createFlatContemporaryRoof(w, d, roofBaseY, accentMat, glassMat, woodMat, params.hasRooftopDeck);
    }

    // 4. Distinct Architectural Special Elements
    if (archType === 'traditional_indian' || params.hasWoodenPillars) {
      this.createChettinadPillars(w, d, groundFloorY, woodMat);
    }

    if (archType === 'modern_indian' || params.hasJaliScreen) {
      this.createJaliScreenFacade(w, d, groundFloorY, h, accentMat);
    }

    if (archType === 'pool_villa' || params.hasSwimmingPool) {
      this.createSwimmingPoolComplex(w, d, groundFloorY, waterMat, woodMat);
    }

    if (archType === 'garden_villa' || params.hasPlanters) {
      this.createBiophilicPlanters(w, d, groundFloorY, h);
    }

    if (archType === 'high_end_mansion' || params.hasClassicalColumns) {
      this.createMonumentalColumnsPortico(w, d, groundFloorY, h, wallMat);
    }

    // 5. Interior Walkthrough Rooms & Furniture Placeholders
    this.createInteriorRoomsGeometry(modelData, groundFloorY, floorHeight);
  }

  // ---------- Architectural Building Blocks ----------

  createFloorVolume(w, d, fh, lvl, totalLevels, archType, wallMat, accentMat, glassMat, woodMat, group) {
    const isTop = lvl === totalLevels - 1;
    const isGround = lvl === 0;

    // Main enclosing box walls
    const mainBoxGeo = new THREE.BoxGeometry(w, fh, d);
    const mainBox = new THREE.Mesh(mainBoxGeo, wallMat);
    mainBox.castShadow = true;
    mainBox.receiveShadow = true;
    group.add(mainBox);

    // Front Elevation Architectural Feature (Glass Curtains / Windows)
    if (archType === 'glass_facade' || (archType === 'luxury_contemporary' && isGround)) {
      // Full double-story structural glass curtain wall
      const glassGeo = new THREE.BoxGeometry(w * 0.85, fh * 0.85, 0.2);
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.set(0, 0, (d / 2) + 0.1);
      group.add(glassMesh);

      // Steel Mullions
      for (let i = -3; i <= 3; i++) {
        const mullionGeo = new THREE.BoxGeometry(0.12, fh, 0.25);
        const mullionMesh = new THREE.Mesh(mullionGeo, accentMat);
        mullionMesh.position.set(i * (w * 0.14), 0, (d / 2) + 0.12);
        group.add(mullionMesh);
      }
    } else {
      // Front Living/Balcony Windows
      const winW = w * 0.38;
      const winH = fh * 0.65;
      const winGeo = new THREE.BoxGeometry(winW, winH, 0.2);

      const winLeft = new THREE.Mesh(winGeo, glassMat);
      winLeft.position.set(-w * 0.24, 0, (d / 2) + 0.08);
      group.add(winLeft);

      // Accent wall panel / Stone clad section
      const panelGeo = new THREE.BoxGeometry(w * 0.35, fh, 0.4);
      const panelMesh = new THREE.Mesh(panelGeo, accentMat);
      panelMesh.position.set(w * 0.26, 0, (d / 2) + 0.15);
      panelMesh.castShadow = true;
      group.add(panelMesh);

      // Entrance Door on Ground Floor
      if (isGround) {
        const doorGeo = new THREE.BoxGeometry(2.4, fh * 0.75, 0.25);
        const doorMesh = new THREE.Mesh(doorGeo, woodMat);
        doorMesh.position.set(0, -fh * 0.12, (d / 2) + 0.15);
        doorMesh.castShadow = true;
        group.add(doorMesh);
      }
    }

    // Side Windows
    const sideWinGeo = new THREE.BoxGeometry(0.2, fh * 0.5, d * 0.3);
    const sideWinL = new THREE.Mesh(sideWinGeo, glassMat);
    sideWinL.position.set((-w / 2) - 0.05, 0, 0);
    group.add(sideWinL);

    const sideWinR = new THREE.Mesh(sideWinGeo, glassMat);
    sideWinR.position.set((w / 2) + 0.05, 0, 0);
    group.add(sideWinR);
  }

  createCourtyardWalls(w, d, fh, wallMat, accentMat, glassMat, group) {
    // 4-sided quadrangle surrounding an open central core
    const outerW = w;
    const outerD = d;
    const courtW = w * 0.35;
    const courtD = d * 0.35;

    // North wing
    const northWing = new THREE.Mesh(new THREE.BoxGeometry(outerW, fh, (outerD - courtD) / 2), wallMat);
    northWing.position.set(0, 0, -(courtD / 2 + (outerD - courtD) / 4));
    northWing.castShadow = true;
    northWing.receiveShadow = true;
    group.add(northWing);

    // South wing
    const southWing = new THREE.Mesh(new THREE.BoxGeometry(outerW, fh, (outerD - courtD) / 2), wallMat);
    southWing.position.set(0, 0, courtD / 2 + (outerD - courtD) / 4);
    southWing.castShadow = true;
    southWing.receiveShadow = true;
    group.add(southWing);

    // East wing
    const eastWing = new THREE.Mesh(new THREE.BoxGeometry((outerW - courtW) / 2, fh, courtD), wallMat);
    eastWing.position.set(courtW / 2 + (outerW - courtW) / 4, 0, 0);
    eastWing.castShadow = true;
    eastWing.receiveShadow = true;
    group.add(eastWing);

    // West wing
    const westWing = new THREE.Mesh(new THREE.BoxGeometry((outerW - courtW) / 2, fh, courtD), wallMat);
    westWing.position.set(-(courtW / 2 + (outerW - courtW) / 4), 0, 0);
    westWing.castShadow = true;
    westWing.receiveShadow = true;
    group.add(westWing);

    // Inner Courtyard Glass Sliders
    const courtGlassGeo = new THREE.BoxGeometry(courtW, fh * 0.8, 0.15);
    const courtGlassSouth = new THREE.Mesh(courtGlassGeo, glassMat);
    courtGlassSouth.position.set(0, 0, -(courtD / 2) + 0.1);
    group.add(courtGlassSouth);
  }

  createStiltGarage(w, d, fh, wallMat, accentMat, group) {
    // Open ground parking stilt pillars
    const pillarGeo = new THREE.BoxGeometry(1.2, fh, 1.2);
    const coords = [
      [-w / 2 + 1, (d / 2) - 1],
      [w / 2 - 1, (d / 2) - 1],
      [-w / 2 + 1, -(d / 2) + 1],
      [w / 2 - 1, -(d / 2) + 1],
      [0, (d / 2) - 1]
    ];

    coords.forEach(([px, pz]) => {
      const p = new THREE.Mesh(pillarGeo, accentMat);
      p.position.set(px, 0, pz);
      p.castShadow = true;
      group.add(p);
    });

    // Enclosed Rear Foyer
    const foyerGeo = new THREE.BoxGeometry(w * 0.7, fh, d * 0.4);
    const foyer = new THREE.Mesh(foyerGeo, wallMat);
    foyer.position.set(0, 0, -d * 0.25);
    foyer.castShadow = true;
    group.add(foyer);
  }

  createCantileverBalcony(w, d, floorY, glassMat, woodMat, accentMat) {
    const balW = w * 0.65;
    const balD = 3.5;
    const balGroup = new THREE.Group();
    balGroup.position.set(0, floorY, (d / 2) + (balD / 2));

    // Balcony Base Slab
    const slab = new THREE.Mesh(new THREE.BoxGeometry(balW, 0.3, balD), accentMat);
    slab.castShadow = true;
    balGroup.add(slab);

    // Glass Balustrade Guard
    const frontGuard = new THREE.Mesh(new THREE.BoxGeometry(balW, 1.1, 0.1), glassMat);
    frontGuard.position.set(0, 0.65, balD / 2);
    balGroup.add(frontGuard);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, balD), glassMat);
    sideL.position.set(-balW / 2, 0.65, 0);
    balGroup.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, balD), glassMat);
    sideR.position.set(balW / 2, 0.65, 0);
    balGroup.add(sideR);

    this.houseGroup.add(balGroup);
  }

  createCoastalStilts(w, d, height, mat) {
    const stiltGeo = new THREE.CylinderGeometry(0.45, 0.55, height, 16);
    for (let x = -w / 2 + 1.5; x <= w / 2 - 1.5; x += (w - 3) / 3) {
      for (let z = -d / 2 + 1.5; z <= d / 2 - 1.5; z += (d - 3) / 3) {
        const stilt = new THREE.Mesh(stiltGeo, mat);
        stilt.position.set(x, height / 2, z);
        stilt.castShadow = true;
        this.houseGroup.add(stilt);
      }
    }
  }

  // ---------- Roof Implementations ----------

  createTerracottaHipRoof(w, d, baseY, tileMat, woodMat) {
    // 4-sided sloping hipped clay tile roof
    const roofH = 4.2;
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, baseY, 0);

    // Wooden Eaves Overhang Fascia
    const eavesGeo = new THREE.BoxGeometry(w + 3, 0.35, d + 3);
    const eaves = new THREE.Mesh(eavesGeo, woodMat);
    eaves.position.set(0, 0.15, 0);
    eaves.castShadow = true;
    roofGroup.add(eaves);

    // Hipped Clay Tile Pyramid/Wedge
    const roofGeo = new THREE.ConeGeometry((Math.max(w, d) + 3) * 0.72, roofH, 4);
    const roofMesh = new THREE.Mesh(roofGeo, tileMat);
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.position.set(0, roofH / 2 + 0.3, 0);
    roofMesh.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
    roofMesh.castShadow = true;
    roofGroup.add(roofMesh);

    // Brass Finial
    const finialGeo = new THREE.CylinderGeometry(0.1, 0.3, 1.2, 8);
    const finialMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 });
    const finial = new THREE.Mesh(finialGeo, finialMat);
    finial.position.set(0, roofH + 0.7, 0);
    roofGroup.add(finial);

    this.houseGroup.add(roofGroup);
  }

  createKeralaGabledRoof(w, d, baseY, tileMat, woodMat) {
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, baseY, 0);

    // Base Fascia
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(w + 3.2, 0.35, d + 3.2), woodMat);
    fascia.position.set(0, 0.15, 0);
    roofGroup.add(fascia);

    // Sloped Prism Roof
    const roofH = 4.6;
    const roofMesh = new THREE.Mesh(new THREE.ConeGeometry((Math.max(w, d) + 3) * 0.75, roofH, 4), tileMat);
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.position.set(0, roofH / 2 + 0.3, 0);
    roofMesh.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
    roofMesh.castShadow = true;
    roofGroup.add(roofMesh);

    // Front Ornamental Kerala Gable (Mukhappu)
    const gableGeo = new THREE.ConeGeometry(3.5, 2.2, 3);
    const gable = new THREE.Mesh(gableGeo, woodMat);
    gable.rotation.z = Math.PI;
    gable.rotation.y = Math.PI;
    gable.position.set(0, 2.4, (d / 2) + 1.2);
    roofGroup.add(gable);

    this.houseGroup.add(roofGroup);
  }

  createAsymmetricalSlopedRoof(w, d, baseY, metalMat, woodMat) {
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, baseY, 0);

    // Dramatic single-pitch wedge
    const wedgeGeo = new THREE.CylinderGeometry(0.1, w * 0.65, 4.8, 3);
    const wedge = new THREE.Mesh(wedgeGeo, metalMat);
    wedge.rotation.z = Math.PI / 2;
    wedge.rotation.y = Math.PI / 2;
    wedge.position.set(0, 2.4, 0);
    wedge.scale.set(1, d * 0.18, 1);
    wedge.castShadow = true;
    roofGroup.add(wedge);

    // Clerestory Wood Trim
    const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 0.3, d + 1), woodMat);
    trim.position.set(0, 0.15, 0);
    roofGroup.add(trim);

    this.houseGroup.add(roofGroup);
  }

  createEcoSolarRoof(w, d, baseY, accentMat, glassMat) {
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, baseY, 0);

    // Green Roof Grass Base
    const greenRoofGeo = new THREE.BoxGeometry(w - 0.4, 0.25, d - 0.4);
    const greenRoofMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const greenRoof = new THREE.Mesh(greenRoofGeo, greenRoofMat);
    greenRoof.position.set(0, 0.15, 0);
    roofGroup.add(greenRoof);

    // Photovoltaic Solar Panel Array on Elevated Racks
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.2,
      metalness: 0.8
    });

    const panelGeo = new THREE.BoxGeometry(2.2, 0.08, 3.8);
    for (let x = -w * 0.35; x <= w * 0.35; x += 2.8) {
      for (let z = -d * 0.35; z <= d * 0.15; z += 4.4) {
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.rotation.x = -0.32; // Angled toward sun
        panel.position.set(x, 1.2, z);
        panel.castShadow = true;
        roofGroup.add(panel);
      }
    }

    this.houseGroup.add(roofGroup);
  }

  createMansionCrestRoof(w, d, baseY, accentMat, wallMat) {
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, baseY, 0);

    // Classical Cornice Slabs
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 2, 0.8, d + 2), wallMat);
    cornice.position.set(0, 0.4, 0);
    cornice.castShadow = true;
    roofGroup.add(cornice);

    // Mansard Crest
    const mansard = new THREE.Mesh(new THREE.BoxGeometry(w - 2, 2.5, d - 2), accentMat);
    mansard.position.set(0, 1.8, 0);
    mansard.castShadow = true;
    roofGroup.add(mansard);

    // Rooftop Balusters Line
    const balusterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
    for (let x = -w / 2 + 1; x <= w / 2 - 1; x += 1.8) {
      const b1 = new THREE.Mesh(balusterGeo, wallMat);
      b1.position.set(x, 1.1, (d / 2) + 0.8);
      roofGroup.add(b1);
    }

    this.houseGroup.add(roofGroup);
  }

  createFlatContemporaryRoof(w, d, baseY, accentMat, glassMat, woodMat, isDeck = false) {
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, baseY, 0);

    // Roof Slab
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 0.35, d + 1.2), accentMat);
    slab.position.set(0, 0.15, 0);
    slab.castShadow = true;
    roofGroup.add(slab);

    // Perimeter Glass Parapet
    const parapetH = isDeck ? 1.2 : 0.6;
    const frontP = new THREE.Mesh(new THREE.BoxGeometry(w, parapetH, 0.1), glassMat);
    frontP.position.set(0, parapetH / 2 + 0.3, (d / 2) + 0.4);
    roofGroup.add(frontP);

    const backP = new THREE.Mesh(new THREE.BoxGeometry(w, parapetH, 0.1), glassMat);
    backP.position.set(0, parapetH / 2 + 0.3, -(d / 2) - 0.4);
    roofGroup.add(backP);

    if (isDeck) {
      // Rooftop Pergola Canopy
      const pergolaW = w * 0.45;
      const pergolaD = d * 0.35;
      const pergola = new THREE.Mesh(new THREE.BoxGeometry(pergolaW, 0.2, pergolaD), woodMat);
      pergola.position.set(0, 2.8, -d * 0.15);
      pergola.castShadow = true;
      roofGroup.add(pergola);

      // Support Posts
      const postGeo = new THREE.BoxGeometry(0.2, 2.6, 0.2);
      [[-pergolaW / 2, -pergolaD / 2], [pergolaW / 2, -pergolaD / 2], [-pergolaW / 2, pergolaD / 2], [pergolaW / 2, pergolaD / 2]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(px, 1.4, -d * 0.15 + pz);
        roofGroup.add(post);
      });
    }

    this.houseGroup.add(roofGroup);
  }

  // ---------- Architectural Accents ----------

  createChettinadPillars(w, d, groundY, woodMat) {
    // Carved wooden veranda columns
    const pillarGeo = new THREE.CylinderGeometry(0.25, 0.35, 3.8, 16);
    for (let x = -w * 0.4; x <= w * 0.4; x += w * 0.26) {
      const pillar = new THREE.Mesh(pillarGeo, woodMat);
      pillar.position.set(x, groundY + 1.9, (d / 2) + 2.5);
      pillar.castShadow = true;
      this.houseGroup.add(pillar);
    }
  }

  createJaliScreenFacade(w, d, groundY, h, mat) {
    // Perforated Jaali lattice screen on upper facade
    const jaliGroup = new THREE.Group();
    jaliGroup.position.set(w * 0.22, groundY + (h * 0.65), (d / 2) + 0.4);

    const screenW = w * 0.42;
    const screenH = h * 0.5;

    for (let row = -3; row <= 3; row++) {
      for (let col = -3; col <= 3; col++) {
        const brickGeo = new THREE.BoxGeometry(screenW / 9, screenH / 9, 0.2);
        const brick = new THREE.Mesh(brickGeo, mat);
        brick.position.set(col * (screenW / 8), row * (screenH / 8), 0);
        brick.castShadow = true;
        jaliGroup.add(brick);
      }
    }
    this.houseGroup.add(jaliGroup);
  }

  createSwimmingPoolComplex(w, d, groundY, waterMat, deckMat) {
    const poolGroup = new THREE.Group();
    poolGroup.position.set(w * 0.65, groundY, 0);

    const poolW = 7.5;
    const poolD = 15;

    // Teak Sun Deck
    const deckGeo = new THREE.BoxGeometry(poolW + 3, 0.15, poolD + 3);
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.08, 0);
    deck.receiveShadow = true;
    poolGroup.add(deck);

    // Blue Water Mesh
    const waterGeo = new THREE.BoxGeometry(poolW, 0.2, poolD);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(0, 0.12, 0);
    poolGroup.add(water);

    // Sun Lounger Blocks
    const loungerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    for (let z = -poolD * 0.3; z <= poolD * 0.3; z += 5) {
      const lounger = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 3.2), loungerMat);
      lounger.position.set(-poolW * 0.75, 0.3, z);
      lounger.castShadow = true;
      poolGroup.add(lounger);
    }

    this.houseGroup.add(poolGroup);
  }

  createBiophilicPlanters(w, d, groundY, h) {
    const planterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 });

    // Front Garden Planter Trough
    const trough = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.8, 1.2), planterMat);
    trough.position.set(0, groundY + 0.4, (d / 2) + 3.2);
    trough.castShadow = true;
    this.houseGroup.add(trough);

    // Shrubs inside trough
    for (let x = -w * 0.36; x <= w * 0.36; x += 1.8) {
      const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), foliageMat);
      shrub.position.set(x, groundY + 1.1, (d / 2) + 3.2);
      shrub.castShadow = true;
      this.houseGroup.add(shrub);
    }
  }

  createMonumentalColumnsPortico(w, d, groundY, h, colMat) {
    const porticoGroup = new THREE.Group();
    porticoGroup.position.set(0, groundY, (d / 2) + 2.8);

    // 4 Grand Fluted Columns
    const colGeo = new THREE.CylinderGeometry(0.45, 0.55, h * 0.85, 20);
    const colSpacing = w * 0.28;

    for (let i = -1.5; i <= 1.5; i++) {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(i * colSpacing, (h * 0.85) / 2, 0);
      col.castShadow = true;
      porticoGroup.add(col);
    }

    // Pediment Entablature on Top
    const pediment = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 1.2, 2.2), colMat);
    pediment.position.set(0, h * 0.85 + 0.6, 0);
    pediment.castShadow = true;
    porticoGroup.add(pediment);

    this.houseGroup.add(porticoGroup);
  }

  // ---------- Interior Rooms Geometry ----------
  createInteriorRoomsGeometry(modelData, groundY, floorHeight) {
    const rooms = modelData.rooms || [];
    const roomGroup = new THREE.Group();

    // Material definitions for interior furniture blocks
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });
    const fabricMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 });

    rooms.forEach((room) => {
      const pos = room.cameraPos || [0, 2, 0];
      const rx = pos[0];
      const ry = pos[1] - 0.9;
      const rz = pos[2];

      if (room.type === 'living_room') {
        // Modern Sectional Sofa
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 1.8), fabricMat);
        sofa.position.set(rx, ry + 0.35, rz - 2.5);
        sofa.castShadow = true;
        roomGroup.add(sofa);

        // Coffee Table
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.1), woodMat);
        table.position.set(rx, ry + 0.2, rz - 1.2);
        table.castShadow = true;
        roomGroup.add(table);
      } else if (room.type === 'kitchen') {
        // Modular Kitchen Island
        const island = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.9, 1.4), marbleMat);
        island.position.set(rx, ry + 0.45, rz - 2.2);
        island.castShadow = true;
        roomGroup.add(island);
      } else if (room.type === 'bedroom') {
        // King Size Bed
        const bed = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 3.2), whiteMat);
        bed.position.set(rx, ry + 0.3, rz - 2.8);
        bed.castShadow = true;
        roomGroup.add(bed);

        // Headboard
        const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.3), woodMat);
        headboard.position.set(rx, ry + 0.7, rz - 4.4);
        headboard.castShadow = true;
        roomGroup.add(headboard);
      } else if (room.type === 'bathroom') {
        // Vanity Counter
        const vanity = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 0.8), whiteMat);
        vanity.position.set(rx, ry + 0.42, rz - 1.2);
        vanity.castShadow = true;
        roomGroup.add(vanity);
      } else if (room.type === 'balcony') {
        // Balcony Outdoor Chairs & Coffee Table
        const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), woodMat);
        chair.position.set(rx - 0.9, ry + 0.4, rz - 1.2);
        roomGroup.add(chair);

        const chair2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), woodMat);
        chair2.position.set(rx + 0.9, ry + 0.4, rz - 1.2);
        roomGroup.add(chair2);
      }
    });

    this.houseGroup.add(roomGroup);
  }

  // ==================== Walkthrough Navigation ====================
  transitionToRoom(room) {
    if (!room) return;
    this.isInWalkthrough = true;
    this.currentRoom = room;

    const targetPos = new THREE.Vector3(...room.cameraPos);
    const targetLook = new THREE.Vector3(...room.lookAt);

    this.animateCameraTo(targetPos, targetLook, 1200, () => {
      // Set controls target to the room's interior lookAt point
      this.controls.target.copy(targetLook);
      this.controls.minDistance = 0.5;
      this.controls.maxDistance = 25;
      if (this.onRoomChange) {
        this.onRoomChange(room);
      }
    });
  }

  transitionToExterior() {
    this.isInWalkthrough = false;
    this.currentRoom = null;
    this.resetView(() => {
      if (this.onRoomChange) {
        this.onRoomChange(null);
      }
    });
  }

  // ==================== Camera Angles & Controls ====================
  setCameraAngle(angle) {
    let targetPos, targetLook;
    const d = 24;

    switch (angle) {
      case 'front':
        targetPos = new THREE.Vector3(0, 7.5, d);
        targetLook = new THREE.Vector3(0, 3.5, 0);
        break;
      case 'rear':
        targetPos = new THREE.Vector3(0, 7.5, -d);
        targetLook = new THREE.Vector3(0, 3.5, 0);
        break;
      case 'left':
        targetPos = new THREE.Vector3(-d, 7.5, 0);
        targetLook = new THREE.Vector3(0, 3.5, 0);
        break;
      case 'right':
        targetPos = new THREE.Vector3(d, 7.5, 0);
        targetLook = new THREE.Vector3(0, 3.5, 0);
        break;
      case 'top':
        targetPos = new THREE.Vector3(0, 32, 0.05); // Roof plan bird's eye
        targetLook = new THREE.Vector3(0, 0, 0);
        break;
      case 'iso':
      default:
        targetPos = new THREE.Vector3(18, 13, 20);
        targetLook = new THREE.Vector3(0, 2.5, 0);
        break;
    }

    this.isInWalkthrough = false;
    this.currentRoom = null;
    this.animateCameraTo(targetPos, targetLook, 900);
  }

  toggleRotate() {
    this.isRotating = !this.isRotating;
    return this.isRotating;
  }

  zoomIn() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.addScaledVector(dir, 3.5);
    this.controls.update();
  }

  zoomOut() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.addScaledVector(dir, -3.5);
    this.controls.update();
  }

  resetView(callback) {
    this.isInWalkthrough = false;
    this.currentRoom = null;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 55;
    this.animateCameraTo(this.defaultCameraPos.clone(), this.defaultLookAt.clone(), 900, callback);
  }

  toggleFullscreen(containerEl) {
    const el = containerEl || this.container || this.mountEl;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      return true;
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      return false;
    }
  }

  // Smooth Camera Animation Lerp
  animateCameraTo(targetPos, targetLook, duration = 1000, onComplete = null) {
    const startPos = this.camera.position.clone();
    const startLook = this.controls.target.clone();
    const startTime = performance.now();

    if (this.activeTween) {
      cancelAnimationFrame(this.activeTween);
      this.activeTween = null;
    }

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in out cubic
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startLook, targetLook, ease);
      this.controls.update();

      if (progress < 1) {
        this.activeTween = requestAnimationFrame(step);
      } else {
        this.activeTween = null;
        if (onComplete) onComplete();
      }
    };

    this.activeTween = requestAnimationFrame(step);
  }

  // ==================== Render Loop & Cleanup ====================
  animate() {
    if (this.isDestroyed) return;
    this.animId = requestAnimationFrame(this.animate);

    // Auto-turntable rotation
    if (this.isRotating && !this.isInWalkthrough) {
      this.houseGroup.rotation.y += 0.005;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.mountEl || this.isDestroyed) return;
    const rect = this.mountEl.getBoundingClientRect();
    this.width = rect.width || this.mountEl.clientWidth || 960;
    this.height = rect.height || this.mountEl.clientHeight || 560;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  clearHouseGroup() {
    while (this.houseGroup.children.length > 0) {
      const obj = this.houseGroup.children[0];
      this.houseGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
    this.houseGroup.rotation.set(0, 0, 0);
  }

  notifyLoading(isLoading, message = '') {
    if (this.onLoadingChange) {
      this.onLoadingChange(isLoading, message);
    }
  }

  dispose() {
    this.isDestroyed = true;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.activeTween) cancelAnimationFrame(this.activeTween);

    window.removeEventListener('resize', this.onWindowResize);

    if (this.controls) this.controls.dispose();

    this.clearHouseGroup();

    this.disposables.forEach(d => {
      if (d.dispose) d.dispose();
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
