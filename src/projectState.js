// ==================== Central Connected Project State ====================
// Synchronizes Land -> House Plan -> 3D -> Materials -> Estimation -> Workspace -> Vision -> Insights -> Report

const STORAGE_KEY = 'forzex_active_construction_project';

const DEFAULT_PROJECT = {
  name: 'Skyline Residential Villa Phase 1',
  location: 'Guindy, Chennai, Tamil Nadu',
  land: {
    width: 30,
    length: 40,
    areaSqFt: 1200,
    areaSqM: 111.48,
    usableAreaSqFt: 960,
    builtUpAreaSqFt: 1850,
    facing: 'East',
    shape: 'Rectangular',
    roadDirection: 'East (40ft Road)',
    fsiRatio: '1.54'
  },
  selectedPlan: {
    id: 'plan-1',
    planNumber: 1,
    title: 'Modern Vastu Duplex with Glass Balcony Facade',
    style: 'Modern Minimalist Facade',
    bhk: '3 BHK',
    floors: 'G + 1 Duplex (2 Floors)',
    builtUpAreaSqFt: 1850,
    vastuScore: 98,
    parking: '1 Car Covered',
    image: '/images/house3d/1200sqft_modern_duplex.jpg',
    costMin: 1980000,
    costMax: 2580000,
    costRange: '₹19.80 Lakhs - ₹25.80 Lakhs',
    rooms: [
      { name: 'Living & Dining Hall', size: "16' x 15'" },
      { name: 'Modular Kitchen (SE)', size: "10' x 12'" },
      { name: 'Master Bedroom Suite (SW)', size: "14' x 15' + Bath" },
      { name: 'Bedroom 2 (Guest / Kids)', size: "12' x 13'" },
      { name: 'Covered Car Porch', size: "12' x 16'" }
    ]
  },
  estimation: {
    materialCost: 1420000,
    labourCost: 680000,
    otherCost: 240000,
    totalCost: 2340000,
    materials: [
      { name: 'UltraTech OPC 53 Cement', qty: '540 bags', rate: 420, total: 226800, category: 'Cement' },
      { name: 'Tata Tiscon 550D TMT Steel', qty: '4.56 Tons', rate: 65000, total: 296400, category: 'Steel' },
      { name: 'Red Kiln Bricks / AAC Blocks', qty: '10,200 units', rate: 9.5, total: 96900, category: 'Bricks & Blocks' },
      { name: 'River Sand / M-Sand', qty: '2,160 cu.ft', rate: 58, total: 125280, category: 'Sand' },
      { name: 'Coarse Aggregate (20mm)', qty: '1,620 cu.ft', rate: 45, total: 72900, category: 'Aggregate' },
      { name: 'Kajaria Vitrified Floor Tiles', qty: '980 sq.ft', rate: 85, total: 83300, category: 'Tiles' },
      { name: 'Asian Paints Apex Weatherproof', qty: '210 Liters', rate: 340, total: 71400, category: 'Paint' },
      { name: 'Teak Wood Main & Flush Doors', qty: '8 units', rate: 8500, total: 68000, category: 'Doors & Windows' },
      { name: 'UPVC Sliding Glass Windows', qty: '7 units', rate: 6200, total: 43400, category: 'Doors & Windows' },
      { name: 'Havells Fire-Retardant Wiring & Switches', qty: 'Complete Set', rate: 55000, total: 55000, category: 'Electrical' },
      { name: 'Supreme CPVC & Sanitary Piping', qty: 'Complete Set', rate: 48000, total: 48000, category: 'Plumbing' }
    ]
  },
  progress: 42,
  safety: {
    complianceRate: 87,
    workersDetected: 12,
    violationsCount: 3,
    helmetViolations: 2,
    vestViolations: 1,
    unsafeConditions: 1,
    alerts: [
      { id: 'ALT-1', worker: 'Worker #04', violation: 'No Helmet in Active Column Zone', confidence: 91, time: '10:14 AM', status: 'Open Action' },
      { id: 'ALT-2', worker: 'Worker #09', violation: 'Missing High-Vis Safety Vest', confidence: 88, time: '11:30 AM', status: 'Actioned' },
      { id: 'ALT-3', worker: 'Area #B2', violation: 'Unsecured Scaffold Edge Guard', confidence: 84, time: '02:15 PM', status: 'Open Action' }
    ],
    history: [
      { date: '16/09/2026', project: 'Skyline Residential', media: 'site_column_pour.jpg', objects: '12 Workers, 10 Helmets, 1 Crane', violations: '2 PPE Violations', status: 'Audited' },
      { date: '14/09/2026', project: 'Skyline Residential', media: 'foundation_rebar.mp4', objects: '8 Workers, 8 Helmets', violations: '0 Violations', status: 'Compliant' },
      { date: '10/09/2026', project: 'Skyline Residential', media: 'scaffolding_inspection.jpg', objects: '14 Workers, 11 Helmets', violations: '3 Violations', status: 'Resolved' }
    ]
  },
  delayPrediction: {
    risk: 'Medium',
    expectedDelayDays: 6,
    factors: [
      'Monsoon rain forecast for upcoming 48 hours in coastal belt',
      'Cement batch transit delay (re-routed freight logistics)',
      'Subcontractor electrical crew attendance currently at 80%'
    ]
  },
  tasks: [
    { id: 'T-101', name: 'Boundary Demarcation & Soil Excavation', stage: 'Foundation', assignee: 'K. Ramesh (Site Eng)', status: 'Completed', priority: 'High', due: '2026-08-20' },
    { id: 'T-102', name: 'PCC Foundation & Footing Rebar Laying', stage: 'Foundation', assignee: 'M. Suresh (RCC Lead)', status: 'Completed', priority: 'High', due: '2026-09-02' },
    { id: 'T-103', name: 'Ground Floor Column Casting & Curing', stage: 'Structure', assignee: 'M. Suresh (RCC Lead)', status: 'In Progress', priority: 'High', due: '2026-09-22' },
    { id: 'T-104', name: 'First Floor Slab Shuttering & Steel Binding', stage: 'Structure', assignee: 'A. Kumar (Foreman)', status: 'In Progress', priority: 'Medium', due: '2026-10-05' },
    { id: 'T-105', name: 'External AAC Block Masonry & Lintel Bands', stage: 'Brickwork', assignee: 'T. Murugan', status: 'Not Started', priority: 'Medium', due: '2026-10-25' },
    { id: 'T-106', name: 'Concealed Electrical Conduit & Plumbing Lines', stage: 'Electrical', assignee: 'V. Anand', status: 'Delayed', priority: 'High', due: '2026-09-18' }
  ]
};

class ProjectStateManager {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PROJECT, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read project state from storage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROJECT));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      // Dispatch state update event so other active views can re-render if needed
      window.dispatchEvent(new CustomEvent('project:state-changed', { detail: this.state }));
    } catch (e) {
      console.warn('Could not persist project state to storage:', e);
    }
  }

  getState() {
    return this.state;
  }

  // Update land parameters
  updateLand(width, length, facing = 'East', shape = 'Rectangular', roadDirection = 'East (40ft Road)') {
    const w = parseInt(width) || 30;
    const l = parseInt(length) || 40;
    const areaSqFt = w * l;
    const areaSqM = (areaSqFt * 0.092903).toFixed(2);
    const usableAreaSqFt = Math.round(areaSqFt * 0.8);
    const builtUpAreaSqFt = Math.round(areaSqFt * 1.55);

    this.state.land = {
      width: w,
      length: l,
      areaSqFt,
      areaSqM,
      usableAreaSqFt,
      builtUpAreaSqFt,
      facing,
      shape,
      roadDirection,
      fsiRatio: (builtUpAreaSqFt / areaSqFt).toFixed(2)
    };

    this.saveState();
  }

  // Update chosen house plan
  selectHousePlan(plan) {
    this.state.selectedPlan = {
      id: plan.designId || plan.id,
      designId: plan.designId || plan.id,
      source: plan.source || (plan.designId ? 'Structured3D' : 'ResPlan'),
      floorplanUrl: plan.floorplan?.path || plan.floorplanUrl || null,
      model3dUrl: plan.model3D?.path || plan.model3dUrl || null,
      planNumber: plan.planNumber || 1,
      title: plan.title,
      style: plan.style,
      bhk: plan.bhk,
      floors: plan.floors,
      builtUpAreaSqFt: plan.builtUpAreaSqFt || Math.round((plan.totalAreaSqFt || 1200) * 1.55),
      vastuScore: plan.vastuScore || 96,
      parking: plan.parking || '1 Car Covered',
      image: plan.house3d?.img || plan.thumbnail || plan.image || '/images/house3d/1200sqft_modern_duplex.jpg',
      costMin: plan.costMin || 1950000,
      costMax: plan.costMax || 2600000,
      costRange: plan.costRange || '₹19.50 Lakhs - ₹26.00 Lakhs',
      rooms: plan.rooms || []
    };

    // Auto-update estimation based on selected plan area
    const builtUp = this.state.selectedPlan.builtUpAreaSqFt;
    const matCost = Math.round(builtUp * 1150);
    const labCost = Math.round(builtUp * 550);
    const otherCost = Math.round(builtUp * 180);
    const totalCost = matCost + labCost + otherCost;

    this.state.estimation.materialCost = matCost;
    this.state.estimation.labourCost = labCost;
    this.state.estimation.otherCost = otherCost;
    this.state.estimation.totalCost = totalCost;

    // Recalculate material quantities
    const cementBags = Math.round(builtUp * 0.45);
    const steelTons = parseFloat((builtUp * 0.0038).toFixed(2));
    const bricksCount = Math.round(builtUp * 8.5);

    this.state.estimation.materials = [
      { name: 'UltraTech OPC 53 Cement', qty: `${cementBags.toLocaleString()} bags`, rate: 420, total: cementBags * 420, category: 'Cement' },
      { name: 'Tata Tiscon 550D TMT Steel', qty: `${steelTons} Tons`, rate: 65000, total: Math.round(steelTons * 65000), category: 'Steel' },
      { name: 'Red Kiln Bricks / AAC Blocks', qty: `${bricksCount.toLocaleString()} units`, rate: 9.5, total: Math.round(bricksCount * 9.5), category: 'Bricks & Blocks' },
      { name: 'River Sand / M-Sand', qty: `${Math.round(builtUp * 1.8).toLocaleString()} cu.ft`, rate: 58, total: Math.round(builtUp * 1.8 * 58), category: 'Sand' },
      { name: 'Coarse Aggregate (20mm)', qty: `${Math.round(builtUp * 1.35).toLocaleString()} cu.ft`, rate: 45, total: Math.round(builtUp * 1.35 * 45), category: 'Aggregate' },
      { name: 'Kajaria Vitrified Floor Tiles', qty: `${Math.round(builtUp * 0.8).toLocaleString()} sq.ft`, rate: 85, total: Math.round(builtUp * 0.8 * 85), category: 'Tiles' },
      { name: 'Asian Paints Apex Weatherproof', qty: `${Math.round(builtUp * 0.18).toLocaleString()} Liters`, rate: 340, total: Math.round(builtUp * 0.18 * 340), category: 'Paint' },
      { name: 'Teak Wood Main & Flush Doors', qty: '8 units', rate: 8500, total: 68000, category: 'Doors & Windows' },
      { name: 'UPVC Sliding Glass Windows', qty: '7 units', rate: 6200, total: 43400, category: 'Doors & Windows' },
      { name: 'Havells Fire-Retardant Wiring & Switches', qty: 'Complete Set', rate: 55000, total: 55000, category: 'Electrical' },
      { name: 'Supreme CPVC & Sanitary Piping', qty: 'Complete Set', rate: 48000, total: 48000, category: 'Plumbing' }
    ];

    this.saveState();
  }

  // Add safety alert to project
  addSafetyAlert(alert) {
    this.state.safety.alerts.unshift({
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open Action',
      ...alert
    });
    this.state.safety.violationsCount = this.state.safety.alerts.length;
    this.saveState();
  }

  // Add inspection history
  addInspectionRecord(record) {
    this.state.safety.history.unshift({
      date: new Date().toLocaleDateString('en-GB'),
      project: this.state.name,
      status: 'Audited',
      ...record
    });
    this.saveState();
  }

  // Update tasks
  updateTaskStatus(taskId, newStatus) {
    const t = this.state.tasks.find(x => x.id === taskId);
    if (t) {
      t.status = newStatus;
      // Recompute progress
      const completed = this.state.tasks.filter(x => x.status === 'Completed').length;
      this.state.progress = Math.round((completed / this.state.tasks.length) * 100);
      this.saveState();
    }
  }

  addTask(task) {
    this.state.tasks.push({
      id: `T-${Date.now().toString().slice(-3)}`,
      status: 'Not Started',
      priority: 'Medium',
      ...task
    });
    this.saveState();
  }
}

export const projectState = new ProjectStateManager();
