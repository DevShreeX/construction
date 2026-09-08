// ==================== Centralized Construction Features Configuration ====================
// Defines the 12 intelligent construction features surrounding the 3D Smart House
// Harmonized with the Forzex Construction architectural engineering color system

export const FEATURE_CATEGORIES = {
  ALL: 'All Capabilities',
  ARCH_DESIGN: 'Architecture & Design',
  AI_ANALYTICS: 'AI & Analytics',
  MATERIALS_COST: 'Materials & Cost',
  SITE_SAFETY: 'Site & Operations'
};

export const CONSTRUCTION_FEATURES = [
  {
    id: 'ai-analysis',
    name: 'AI Construction Analysis',
    shortName: 'AI Analysis',
    category: FEATURE_CATEGORIES.AI_ANALYTICS,
    categoryType: 'ai',
    color: '#60a5fa',
    glowColor: '#93c5fd',
    colorHex: 0x60a5fa,
    orbitAngle: Math.PI / 2, // 90 deg (top center)
    radiusX: 7.2,
    radiusY: 5.6,
    elevation: 3.4,
    icon: 'fa-brain',
    level: 'Generative BIM & Neural Risk Engine',
    metric: '98.5% Accuracy',
    summary: 'Neural network analyzing construction requirements, geotechnical soil survey data, structural load tolerances, and automated regulatory compliance.',
    specialFeature: 'neural-flow',
    tags: ['Risk Modeling', 'Structural Health', 'Regulatory Checks', 'BIM Intelligence'],
    connectedBuildingZone: 'roof',
    connections: ['smart-architecture', 'interior-design', 'cost-estimation', 'delay-prediction']
  },
  {
    id: 'smart-architecture',
    name: 'Smart Architecture',
    shortName: 'Smart Architecture',
    category: FEATURE_CATEGORIES.ARCH_DESIGN,
    categoryType: 'design',
    color: '#38bdf8',
    glowColor: '#7dd3fc',
    colorHex: 0x38bdf8,
    orbitAngle: Math.PI * 0.68, // ~122 deg
    radiusX: 7.4,
    radiusY: 5.4,
    elevation: 2.4,
    icon: 'fa-drafting-compass',
    level: 'Parametric CAD & Solar Daylight Engine',
    metric: 'Vastu Score: 98/100',
    summary: 'Intelligent spatial design providing parametric blueprints, structural column alignments, passive solar daylight engineering, and natural ventilation cross-paths.',
    specialFeature: 'structural-highlight',
    tags: ['Parametric CAD', 'Vastu Orientation', 'Daylight Modeling', 'Ventilation Paths'],
    connectedBuildingZone: 'upper-cantilever',
    connections: ['ai-analysis', 'interior-design', 'land-measurement']
  },
  {
    id: 'interior-design',
    name: 'Interior Designing',
    shortName: 'Interior Design',
    category: FEATURE_CATEGORIES.ARCH_DESIGN,
    categoryType: 'design',
    color: '#7dd3fc',
    glowColor: '#bae6fd',
    colorHex: 0x7dd3fc,
    orbitAngle: Math.PI * 0.32, // ~58 deg
    radiusX: 7.4,
    radiusY: 5.4,
    elevation: 2.3,
    icon: 'fa-couch',
    level: 'Volumetric Space Zoning & Illumination',
    metric: '3D Walkthrough Ready',
    summary: 'Photorealistic room zoning, modular kitchen layouts, false-ceiling ambient lighting simulation, and customized material mood boards.',
    specialFeature: 'interior-glow',
    tags: ['Modular Kitchens', 'Living Room Layouts', 'Ambient Lighting', 'Material Palettes'],
    connectedBuildingZone: 'interior',
    connections: ['ai-analysis', 'painting', 'materials']
  },
  {
    id: 'materials',
    name: 'Material Recommendation',
    shortName: 'Materials',
    category: FEATURE_CATEGORIES.MATERIALS_COST,
    categoryType: 'materials',
    color: '#34d399',
    glowColor: '#6ee7b7',
    colorHex: 0x34d399,
    orbitAngle: Math.PI * 0.14, // ~25 deg
    radiusX: 7.6,
    radiusY: 5.2,
    elevation: 1.3,
    icon: 'fa-boxes-stacked',
    level: 'AI Quality, Sourcing & Carbon Index',
    metric: 'IS 456 Compliant',
    summary: 'AI recommendations for grade-53 OPC cement, Fe-550D TMT rebars, AAC thermal blocks, and eco-certified structural building components.',
    specialFeature: 'material-cubes',
    tags: ['TMT Fe-550D Steel', 'OPC 53 Cement', 'AAC Lightweight Blocks', 'Eco Insulation'],
    connectedBuildingZone: 'walls',
    connections: ['interior-design', 'material-tracking', 'cost-estimation'],
    materialList: [
      { name: 'OPC 53 Grade Cement', spec: 'UltraTech / ACC High Early Strength', color: '#94a3b8', badge: 'IS 12269' },
      { name: 'Fe-550D TMT Steel', spec: 'Tata Tiscon Super-Ductile Earthquake Grade', color: '#38bdf8', badge: 'IS 1786' },
      { name: 'AAC Lightweight Blocks', spec: 'Autoclaved Aerated 600x200x150mm', color: '#cbd5e1', badge: 'Thermal R-2.4' },
      { name: 'Tempered Low-E Glass', spec: 'Double-glazed Solar Acoustic Panes', color: '#38bdf8', badge: 'SHGC 0.28' },
      { name: 'M-Sand Fine Aggregate', spec: 'Manufactured River-Sand Substitute Zone-II', color: '#fbbf24', badge: 'IS 383' },
      { name: 'Vitrified Floor Tiles', spec: 'GVT 1200x600mm Scratch & Slip Resistant', color: '#60a5fa', badge: 'PEI-V Rated' }
    ]
  },
  {
    id: 'painting',
    name: 'Painting Recommendation',
    shortName: 'Painting',
    category: FEATURE_CATEGORIES.ARCH_DESIGN,
    categoryType: 'design',
    color: '#fbbf24',
    glowColor: '#fde047',
    colorHex: 0xfbbf24,
    orbitAngle: -Math.PI * 0.05, // -9 deg
    radiusX: 7.8,
    radiusY: 5.0,
    elevation: 0.1,
    icon: 'fa-palette',
    level: 'Architectural Exterior Finishes & Nano-Coat',
    metric: '10-Year Weather Guard',
    summary: 'Exterior elastomeric UV coatings, natural timber stains, weather-resistant clay sealants, and curated architectural exterior finishes.',
    specialFeature: 'color-palette',
    tags: ['Weatherproof Exterior', 'Natural Timber Stain', 'Clay Sealant', 'Reflective Topcoat'],
    connectedBuildingZone: 'exterior-facade',
    connections: ['interior-design', 'materials', 'project-progress'],
    colorSwatches: [
      { name: 'Classic Earth Brick', hex: '#8d684e', accent: '#d6cfc7', desc: 'Warm natural clay brick facade' },
      { name: 'Scandinavian Cedar', hex: '#a8815c', accent: '#b8926d', desc: 'Horizontal warm timber plank siding' },
      { name: 'Modern Slate Grey', hex: '#4a515a', accent: '#64748b', desc: 'Contemporary muted slate finish' },
      { name: 'Architectural White', hex: '#f1f5f9', accent: '#38bdf8', desc: 'Timeless crisp mineral stucco coat' },
      { name: 'Nordic Charcoal', hex: '#334155', accent: '#94a3b8', desc: 'Modern deep charcoal timber cladding' },
      { name: 'Honed Limestone', hex: '#d8c8b4', accent: '#bfae99', desc: 'Warm natural limestone masonry' }
    ]
  },
  {
    id: 'cost-estimation',
    name: 'Cost Estimation',
    shortName: 'Cost Estimation',
    category: FEATURE_CATEGORIES.MATERIALS_COST,
    categoryType: 'analytics',
    color: '#818cf8',
    glowColor: '#a5b4fc',
    colorHex: 0x818cf8,
    orbitAngle: -Math.PI * 0.24, // -43 deg
    radiusX: 7.5,
    radiusY: 5.3,
    elevation: -1.1,
    icon: 'fa-calculator',
    level: 'Dynamic Itemized Bill of Quantities',
    metric: '₹1,850 / sq.ft Avg',
    summary: 'Automated Bill of Quantities (BOQ) with itemized cement, steel, labor, and finishing budgets synchronized with live regional spot rates.',
    specialFeature: 'cost-breakdown',
    tags: ['Automated BOQ', 'Labor Rate Index', 'Stage Budgets', 'Contingency Margins'],
    connectedBuildingZone: 'foundation-slab',
    connections: ['materials', 'material-tracking', 'project-progress'],
    costBreakdown: [
      { item: 'Substructure & Foundation Plinth', cost: '₹5,80,000', pct: 20 },
      { item: 'RCC Superstructure & Columns', cost: '₹8,40,000', pct: 29 },
      { item: 'Brickwork & Timber Siding Walls', cost: '₹5,20,000', pct: 18 },
      { item: 'Roofing, Shingles & Gable Trusses', cost: '₹4,30,000', pct: 15 },
      { item: 'Plumbing, Electrical & Smart Finishes', cost: '₹5,10,000', pct: 18 }
    ],
    totalEstimate: '₹28,80,000'
  },
  {
    id: 'land-measurement',
    name: 'Land Area Measurement',
    shortName: 'Land Measurement',
    category: FEATURE_CATEGORIES.SITE_SAFETY,
    categoryType: 'construction',
    color: '#38bdf8',
    glowColor: '#7dd3fc',
    colorHex: 0x38bdf8,
    orbitAngle: Math.PI * 0.88, // ~158 deg
    radiusX: 7.6,
    radiusY: 5.2,
    elevation: 1.1,
    icon: 'fa-ruler-combined',
    level: 'Computer Vision Drone & Plot Survey',
    metric: '1,200 sq.ft (30\' × 40\')',
    summary: 'Aerial boundary detection, automated square footage calculation, setback compliance checks, contour slope elevation, and plot frontage metrics.',
    specialFeature: 'blueprint-grid',
    tags: ['Drone Acreage', 'Setback Offsets', 'Slope Analysis', 'Perimeter Coordinates'],
    connectedBuildingZone: 'ground-plane',
    connections: ['smart-architecture', 'worker-tracking', 'safety-monitoring'],
    landTelemetry: {
      plotDimensions: '30 ft × 40 ft (1,200 sq.ft / 111.48 m²)',
      builtUpArea: '1,850 sq.ft (G+1 Residential Villa)',
      groundCoverage: '62.5% (Within 70% Municipal Limit)',
      frontSetback: '5.0 ft Clearance',
      sideSetbacks: '3.0 ft Left / 3.0 ft Right',
      rearSetback: '4.0 ft Garden Clearance'
    }
  },
  {
    id: 'worker-tracking',
    name: 'Worker Tracking',
    shortName: 'Worker Tracking',
    category: FEATURE_CATEGORIES.SITE_SAFETY,
    categoryType: 'construction',
    color: '#f59e0b',
    glowColor: '#fbbf24',
    colorHex: 0xf59e0b,
    orbitAngle: Math.PI * 1.05, // 189 deg
    radiusX: 7.8,
    radiusY: 5.0,
    elevation: 0.1,
    icon: 'fa-users-gear',
    level: 'Biometric Check-in & Workforce Telemetry',
    metric: '24 Active Crew on Site',
    summary: 'Real-time on-site workforce monitoring, specialized trade attendance logs (masons, electricians, riggers), and worker productivity indexes.',
    specialFeature: 'workforce-hud',
    tags: ['Biometric Check-in', 'Crew Distribution', 'Masons & Riggers', 'Productivity Index'],
    connectedBuildingZone: 'ground-floor-door',
    connections: ['safety-monitoring', 'land-measurement', 'project-progress'],
    workforceData: [
      { trade: 'RCC Structural Masons', active: 8, total: 8, status: 'On Site' },
      { trade: 'Steel Rebar Riggers', active: 6, total: 6, status: 'On Site' },
      { trade: 'Electricians & Technicians', active: 4, total: 4, status: 'On Site' },
      { trade: 'Carpenters & Glaziers', active: 3, total: 4, status: 'Active' },
      { trade: 'Safety Officer & Site Lead', active: 3, total: 3, status: 'Inspecting' }
    ]
  },
  {
    id: 'material-tracking',
    name: 'Material Tracking',
    shortName: 'Material Tracking',
    category: FEATURE_CATEGORIES.MATERIALS_COST,
    categoryType: 'materials',
    color: '#2dd4bf',
    glowColor: '#5eead4',
    colorHex: 0x2dd4bf,
    orbitAngle: -Math.PI * 0.44, // -79 deg
    radiusX: 7.2,
    radiusY: 5.5,
    elevation: -2.1,
    icon: 'fa-truck-ramp-box',
    level: 'Live Inventory, Weighbridge & RFID',
    metric: 'Stock: 450 Cement Bags',
    summary: 'Live inventory tracking for cement silos, TMT rebar bundles, sand trucks, brick palettes, and automated low-stock dispatch triggers.',
    specialFeature: 'stock-gauge',
    tags: ['Cement Stock Alert', 'Steel Rebar Tonnage', 'Batch Testing Certs', 'Dispatched Orders'],
    connectedBuildingZone: 'foundation-slab',
    connections: ['materials', 'cost-estimation', 'project-progress'],
    inventoryStock: [
      { item: 'OPC 53 Cement', current: '450 Bags', threshold: '100 Bags', status: 'Optimal' },
      { item: 'Fe-550D TMT Steel', current: '8.4 Tons', threshold: '2.0 Tons', status: 'Optimal' },
      { item: 'Zone-II M-Sand', current: '22 Tons', threshold: '5 Tons', status: 'Adequate' },
      { item: 'AAC Blocks (600mm)', current: '1,800 Pcs', threshold: '400 Pcs', status: 'Optimal' }
    ]
  },
  {
    id: 'project-progress',
    name: 'Project Progress',
    shortName: 'Project Progress',
    category: FEATURE_CATEGORIES.SITE_SAFETY,
    categoryType: 'construction',
    color: '#10b981',
    glowColor: '#34d399',
    colorHex: 0x10b981,
    orbitAngle: -Math.PI * 0.62, // -112 deg
    radiusX: 6.9,
    radiusY: 5.7,
    elevation: -2.5,
    icon: 'fa-bars-progress',
    level: '6-Stage Milestone Synchronization',
    metric: 'Overall: 68% Complete',
    summary: 'Real-time construction phase tracking: Foundation (100%), Superstructure (100%), Walls (75%), Roofing (40%), and Electrical/Plumbing (20%).',
    specialFeature: 'progress-milestones',
    tags: ['Foundation (100%)', 'Superstructure (100%)', 'Brickwork (75%)', 'Roofing (40%)'],
    connectedBuildingZone: 'structural-columns',
    connections: ['cost-estimation', 'material-tracking', 'safety-monitoring'],
    milestones: [
      { stage: 'Foundation & Plinth', progress: 100, status: 'Completed', icon: 'fa-check-circle' },
      { stage: 'RCC Frame & Columns', progress: 100, status: 'Completed', icon: 'fa-check-circle' },
      { stage: 'Brickwork & Walls', progress: 75, status: 'Active (Floor 1 Done)', icon: 'fa-spinner' },
      { stage: 'Roofing & Gables', progress: 40, status: 'Framing Erected', icon: 'fa-hammer' },
      { stage: 'Interior & Lighting', progress: 20, status: 'Conduiting Done', icon: 'fa-bolt' },
      { stage: 'Exterior Painting', progress: 10, status: 'Primer Scheduled', icon: 'fa-paint-roller' }
    ]
  },
  {
    id: 'safety-monitoring',
    name: 'Safety Monitoring',
    shortName: 'Safety Monitoring',
    category: FEATURE_CATEGORIES.SITE_SAFETY,
    categoryType: 'safety',
    color: '#f87171',
    glowColor: '#fca5a5',
    colorHex: 0xf87171,
    orbitAngle: -Math.PI * 0.82, // -147 deg
    radiusX: 7.4,
    radiusY: 5.4,
    elevation: -1.3,
    icon: 'fa-shield-halved',
    level: 'Zero-Accident Protocol & Computer Vision AI',
    metric: 'Safety Score: 99.2%',
    summary: 'Automated PPE compliance (hard hats, harnesses, high-vis vests), perimeter laser geofencing around hazard zones, and OSHA safety compliance logs.',
    specialFeature: 'safety-beacon',
    tags: ['PPE Vision AI', 'Fall Hazard Fencing', 'Scaffolding Check', 'Zero Incident Goal'],
    connectedBuildingZone: 'balcony-railing',
    connections: ['worker-tracking', 'project-progress', 'delay-prediction'],
    safetyIndicators: [
      { zone: 'Scaffolding Perimeter Guard', status: 'Secure (Safety Harness Active)', level: 'Safe' },
      { zone: 'Entryway Hard Hat Vision AI', status: '100% PPE Compliance Detected', level: 'Safe' },
      { zone: 'Material Hoist Clearance Zone', status: 'Clearance Active (Audio Warning)', level: 'Warning' }
    ]
  },
  {
    id: 'delay-prediction',
    name: 'Delay Prediction',
    shortName: 'Delay Prediction',
    category: FEATURE_CATEGORIES.AI_ANALYTICS,
    categoryType: 'ai',
    color: '#93c5fd',
    glowColor: '#bfdbfe',
    colorHex: 0x93c5fd,
    orbitAngle: -Math.PI * 0.95, // -171 deg
    radiusX: 7.7,
    radiusY: 5.1,
    elevation: -0.5,
    icon: 'fa-clock-rotate-left',
    level: 'Predictive Scheduling & Critical Path CPM',
    metric: 'Risk Level: Low (2 Days Buffer)',
    summary: 'Predictive machine learning correlating concrete curing weather windows, supply chain logistics lead times, and on-site workforce availability.',
    specialFeature: 'delay-gauge',
    tags: ['Weather Risk Matrix', 'Supply Lead Time', 'Critical Path (CPM)', 'Buffer Optimization'],
    connectedBuildingZone: 'foundation-slab',
    connections: ['safety-monitoring', 'ai-analysis', 'project-progress'],
    delayFactors: [
      { factor: 'Monsoon Rainfall Window', impact: '0 Days (Waterproofing Ready)', risk: 'Low' },
      { factor: 'Ready-Mix Concrete Dispatch', impact: '+1 Day (Transit Buffer)', risk: 'Medium' },
      { factor: 'TMT Steel Supply Lead Time', impact: '0 Days (Stocked on Site)', risk: 'Low' }
    ]
  }
];

export function getFeatureById(id) {
  return CONSTRUCTION_FEATURES.find(f => f.id === id);
}
