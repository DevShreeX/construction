// ==================== Indian Floor Plans & MakeMyHouse Architectural Engine ====================
// Inspired by IndianFloorPlans.com & MakeMyHouse.com search dimensions, 3D elevations & Vastu principles

export function generate10IndianFloorPlans(sqft = 1200, facing = 'East', bhkPref = 'Auto', width = 30, depth = 40) {
  const sqftNum = parseInt(sqft) || (parseInt(width) * parseInt(depth)) || 1200;
  const widthNum = parseInt(width) || 30;
  const depthNum = parseInt(depth) || 40;
  
  // Base cost estimate factor: ₹1,650 to ₹2,150 per sq ft for construction
  const baseCostMin = Math.round(sqftNum * 1650);
  const baseCostMax = Math.round(sqftNum * 2150);

  // Helper currency formatter
  const formatINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Determine BHK based on sqft if auto
  const getBhk = (index) => {
    if (bhkPref !== 'Auto') return bhkPref;
    if (sqftNum < 700) return index % 2 === 0 ? '1 BHK' : '2 BHK Compact';
    if (sqftNum < 1300) return index % 3 === 0 ? '2 BHK' : (index % 3 === 1 ? '3 BHK Compact' : '2 BHK + Study');
    if (sqftNum < 2200) return index % 2 === 0 ? '3 BHK Luxury' : '4 BHK Villa';
    return '4 BHK Duplex';
  };

  // 10 distinct architectural layout & 3D elevation templates (MakeMyHouse style)
  const templates = [
    {
      id: 'plan-1',
      title: 'Option 1: Modern Minimalist Facade with Vastu Alignment',
      style: 'Modern Minimalist Facade',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 98,
      facing: facing === 'Any' ? 'East' : facing,
      highlight: '3D Glass Balcony Facade + Kitchen SE, Master SW, Main Door NE',
      elevationPreviewBg: 'linear-gradient(135deg, #0f172a, #1e293b)',
      advantages: ['MakeMyHouse Top Rated Layout', 'High daylight & cross wind circulation', 'Dedicated Puja alcove'],
      rooms: [
        { name: 'Living & Dining Hall', size: `${Math.round(widthNum * 0.55)}' x ${Math.round(depthNum * 0.38)}'` },
        { name: 'Master Bedroom Suite', size: `${Math.round(widthNum * 0.45)}' x ${Math.round(depthNum * 0.32)}' (Attached Bath)` },
        { name: 'Bedroom 2 / Guest', size: `${Math.round(widthNum * 0.4)}' x ${Math.round(depthNum * 0.3)}'` },
        { name: 'SE Modular Kitchen', size: `${Math.round(widthNum * 0.35)}' x ${Math.round(depthNum * 0.25)}'` },
        { name: 'Car Parking Garage', size: `${Math.round(widthNum * 0.45)}' x ${Math.round(depthNum * 0.35)}'` }
      ],
      costRange: `${formatINR(baseCostMin)} - ${formatINR(baseCostMax)}`,
      colsCount: Math.max(8, Math.round(sqftNum / 120)),
      colorScheme: '#38bdf8'
    },
    {
      id: 'plan-2',
      title: 'Option 2: Contemporary Glass Elevation Villa Layout',
      style: 'Glass Elevation Contemporary',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 94,
      facing: 'North',
      highlight: 'Double-height ceiling hall with floor-to-ceiling glass elevation',
      elevationPreviewBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      advantages: ['Ultra-modern kerb appeal', 'Spacious open-plan kitchen island', 'Low maintenance materials'],
      rooms: [
        { name: 'Grand Living Room', size: `${Math.round(widthNum * 0.6)}' x ${Math.round(depthNum * 0.4)}'` },
        { name: 'Open Kitchen & Island', size: `${Math.round(widthNum * 0.4)}' x ${Math.round(depthNum * 0.25)}'` },
        { name: 'Master Suite', size: `14' x 15' with Walk-in Closet` },
        { name: 'Bed 2 / Kids Room', size: `12' x 13'` },
        { name: 'Front Glass Terrace', size: `6' x 14'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.06))} - ${formatINR(Math.round(baseCostMax * 1.09))}`,
      colsCount: Math.max(8, Math.round(sqftNum / 115)),
      colorScheme: '#a855f7'
    },
    {
      id: 'plan-3',
      title: 'Option 3: Traditional Heritage Slope Roof Elevation',
      style: 'South Indian Slope Roof',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 97,
      facing: 'East',
      highlight: 'Terracotta mangalore tile slope roof with courtyard (Brahmasthan)',
      elevationPreviewBg: 'linear-gradient(135deg, #064e3b, #047857)',
      advantages: ['Natural thermal insulation (3°C cooler)', '100% Vastu Brahmasthan clearance', 'Chettinad wooden pillar veranda'],
      rooms: [
        { name: 'Central Courtyard', size: `10' x 10' Open Skylight` },
        { name: 'Formal Living Room', size: `14' x 16'` },
        { name: 'Master Bedroom', size: `13' x 15'` },
        { name: 'Bedroom 2', size: `12' x 13'` },
        { name: 'Traditional Kitchen', size: `10' x 12'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.1))} - ${formatINR(Math.round(baseCostMax * 1.13))}`,
      colsCount: Math.max(10, Math.round(sqftNum / 110)),
      colorScheme: '#4ade80'
    },
    {
      id: 'plan-4',
      title: 'Option 4: Dual-Balcony High Density Urban Plan',
      style: 'Urban High Density',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 91,
      facing: 'West',
      highlight: 'Zero passage area waste + dual front and rear balconies',
      elevationPreviewBg: 'linear-gradient(135deg, #451a03, #78350f)',
      advantages: ['100% space utilization efficiency', 'Dual wind tunnel ventilation', 'Built-in lofts for storage'],
      rooms: [
        { name: 'Living & Dining Area', size: `15' x 18'` },
        { name: 'Master Bedroom', size: `12' x 14'` },
        { name: 'Children Bedroom', size: `11' x 12'` },
        { name: 'Modular Kitchen', size: `9' x 11'` },
        { name: 'Front Balcony', size: `5' x 15'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 0.95))} - ${formatINR(Math.round(baseCostMax * 0.98))}`,
      colsCount: Math.max(8, Math.round(sqftNum / 125)),
      colorScheme: '#f59e0b'
    },
    {
      id: 'plan-5',
      title: 'Option 5: G+1 Duplex Villa with Private Sky Deck',
      style: 'Luxury G+1 Duplex',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 95,
      facing: 'North-East',
      highlight: 'Internal teakwood spiral staircase & Master bedroom balcony',
      elevationPreviewBg: 'linear-gradient(135deg, #831843, #be185d)',
      advantages: ['Upper floor privacy for bedrooms', 'Terrace gazebo & green lawn space', 'Dedicated home theater room'],
      rooms: [
        { name: 'Ground Floor Living', size: `16' x 22'` },
        { name: 'First Floor Family Lounge', size: `14' x 16'` },
        { name: 'Master Bedroom Suite', size: `15' x 16'` },
        { name: 'Bedroom 2 & 3', size: `12' x 14' Each` },
        { name: 'Roof Terrace Garden', size: `20' x 25'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.18))} - ${formatINR(Math.round(baseCostMax * 1.25))}`,
      colsCount: Math.max(12, Math.round(sqftNum / 100)),
      colorScheme: '#ec4899'
    },
    {
      id: 'plan-6',
      title: 'Option 6: Stilt Parking + Independent Residence Plan',
      style: 'Stilt+1 Metropolitan',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 92,
      facing: 'South',
      highlight: 'Ground stilt parking for 2 cars & 4 two-wheelers + upper residence',
      elevationPreviewBg: 'linear-gradient(135deg, #164e63, #0891b2)',
      advantages: ['Solves narrow plot parking constraints', 'High safety & security raised floor', 'Future floor expansion ready'],
      rooms: [
        { name: 'Ground Stilt Parking', size: `18' x 35'` },
        { name: 'First Floor Hall', size: `15' x 20'` },
        { name: 'Master Bedroom', size: `13' x 14'` },
        { name: 'Guest Room', size: `11' x 12'` },
        { name: 'Semi-Open Utility Terrace', size: `10' x 15'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.12))} - ${formatINR(Math.round(baseCostMax * 1.15))}`,
      colsCount: Math.max(10, Math.round(sqftNum / 105)),
      colorScheme: '#06b6d4'
    },
    {
      id: 'plan-7',
      title: 'Option 7: Rental Portion Ground + Owner Residence Plan',
      style: 'Multi-family Income Generator',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 93,
      facing: 'East',
      highlight: 'Independent 1BHK unit on Ground floor for passive rental income',
      elevationPreviewBg: 'linear-gradient(135deg, #064e3b, #059669)',
      advantages: ['Generates monthly rental income', 'Separate electricity & water meters', 'Private owner entrance from side staircase'],
      rooms: [
        { name: 'Ground Rental 1BHK Unit', size: `550 sq ft Complete Unit` },
        { name: 'Upper Owner 2BHK Residence', size: `650 sq ft Complete Unit` },
        { name: 'Dual Parking Bays', size: `12' x 16'` },
        { name: 'Common Stairwell', size: `6' x 12'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.08))} - ${formatINR(Math.round(baseCostMax * 1.12))}`,
      colsCount: Math.max(12, Math.round(sqftNum / 100)),
      colorScheme: '#10b981'
    },
    {
      id: 'plan-8',
      title: 'Option 8: Eco-Green Solar Passive House Plan',
      style: 'Sustainable Solar Passive',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 96,
      facing: 'South-East',
      highlight: 'Solar panel roof orientation + fly-ash brick thermal insulation',
      elevationPreviewBg: 'linear-gradient(135deg, #365314, #65a30d)',
      advantages: ['Cuts electricity bills by 60%', 'Rainwater harvesting tank built-in', 'Thermal comfort all seasons'],
      rooms: [
        { name: 'Naturally Lit Living Room', size: `15' x 16'` },
        { name: 'Solar Kitchen & Dining', size: `11' x 14'` },
        { name: 'Eco Master Bedroom', size: `12' x 14'` },
        { name: 'Rooftop Solar Deck', size: `Full Roof Coverage` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.04))} - ${formatINR(Math.round(baseCostMax * 1.06))}`,
      colsCount: Math.max(8, Math.round(sqftNum / 120)),
      colorScheme: '#84cc16'
    },
    {
      id: 'plan-9',
      title: 'Option 9: Low-Budget Smart Steel-Concrete Modular Plan',
      style: 'Cost-Optimized Budget Smart',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 89,
      facing: 'North-West',
      highlight: 'Standardized column grid reducing construction cost by 15%',
      elevationPreviewBg: 'linear-gradient(135deg, #881337, #e11d48)',
      advantages: ['Fastest completion time (under 4 months)', 'Minimal material wastage', 'Strong structural RCC frame'],
      rooms: [
        { name: 'Compact Living Room', size: `13' x 15'` },
        { name: 'Smart Dining & Kitchenette', size: `10' x 12'` },
        { name: 'Master Bedroom', size: `11' x 13'` },
        { name: 'Bedroom 2', size: `10' x 11'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 0.88))} - ${formatINR(Math.round(baseCostMax * 0.92))}`,
      colsCount: Math.max(8, Math.round(sqftNum / 130)),
      colorScheme: '#f43f5e'
    },
    {
      id: 'plan-10',
      title: 'Option 10: Luxury Villa with Swimming Pool & Wooden Deck',
      style: 'High-End Luxury Resort Villa',
      plotRatio: `${widthNum}' x ${depthNum}'`,
      vastuScore: 97,
      facing: 'East',
      highlight: 'Private lap pool, wooden deck lounge, and glass elevation facade',
      elevationPreviewBg: 'linear-gradient(135deg, #311b92, #512da8)',
      advantages: ['Resort style living experience', 'Spacious master suite with bath tub', 'Smart home automation ready'],
      rooms: [
        { name: 'Double Height Living Room', size: `18' x 24'` },
        { name: 'Private Lap Pool & Deck', size: `12' x 25'` },
        { name: 'Master Presidential Suite', size: `16' x 18'` },
        { name: 'Guest Villa Rooms', size: `14' x 15' Each` },
        { name: 'Modular German Kitchen', size: `12' x 15'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.35))} - ${formatINR(Math.round(baseCostMax * 1.48))}`,
      colsCount: Math.max(14, Math.round(sqftNum / 90)),
      colorScheme: '#6366f1'
    }
  ];

  return templates.map((t, idx) => ({
    ...t,
    bhk: getBhk(idx),
    totalAreaSqFt: sqftNum,
    plotWidth: widthNum,
    plotDepth: depthNum,
    estimatedDays: Math.round(110 + (sqftNum / 15)),
    svgBlueprint: generateSvgBlueprint(t, sqftNum, widthNum, depthNum),
    svg3dElevation: generate3dElevationSvg(t, widthNum, depthNum),
    svgStructuralGrid: generateStructuralGridSvg(t, widthNum, depthNum)
  }));
}

// Generate 2D Architectural SVG Blueprint
function generateSvgBlueprint(template, sqft, width, depth) {
  const color = template.colorScheme || '#38bdf8';
  return `
    <svg viewBox="0 0 400 280" width="100%" height="220" style="background:#090d16;border-radius:8px;border:1px solid rgba(255,255,255,0.1)">
      <defs>
        <pattern id="grid-${template.id}" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.07)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="400" height="280" fill="url(#grid-${template.id})" />

      <rect x="25" y="25" width="350" height="230" fill="none" stroke="${color}" stroke-width="3.5" rx="4" />
      <rect x="29" y="29" width="342" height="222" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="4,4" />

      <rect x="35" y="35" width="200" height="130" fill="rgba(56,189,248,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="135" y="95" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">LIVING & DINING</text>
      <text x="135" y="112" fill="${color}" font-size="10" text-anchor="middle">${Math.round(width * 0.55)}' x ${Math.round(depth * 0.38)}'</text>

      <rect x="245" y="35" width="120" height="130" fill="rgba(168,85,247,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="305" y="95" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">MASTER BED</text>
      <text x="305" y="112" fill="#a855f7" font-size="10" text-anchor="middle">${Math.round(width * 0.45)}' x ${Math.round(depth * 0.32)}'</text>

      <rect x="35" y="173" width="130" height="72" fill="rgba(74,222,128,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="100" y="210" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">SE KITCHEN</text>

      <rect x="173" y="173" width="192" height="72" fill="rgba(245,158,11,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="269" y="210" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">BED 2 / PUJA</text>

      <circle cx="360" cy="45" r="14" fill="#0f172a" stroke="${color}" stroke-width="1.5" />
      <text x="360" y="42" fill="#ef4444" font-size="8" font-weight="bold" text-anchor="middle">N</text>
      <text x="360" y="53" fill="${color}" font-size="7" text-anchor="middle">${template.facing.substring(0,1)}</text>

      <path d="M 120 25 L 140 25 A 20 20 0 0 1 120 45 Z" fill="none" stroke="#eab308" stroke-width="2" />
      <text x="135" y="20" fill="#eab308" font-size="9" font-weight="bold" text-anchor="middle">MAIN ENTRY (${template.facing})</text>
    </svg>
  `;
}

// Generate 3D Front Elevation Render SVG (MakeMyHouse Style)
function generate3dElevationSvg(template, width, depth) {
  const color = template.colorScheme || '#38bdf8';
  return `
    <svg viewBox="0 0 400 280" width="100%" height="220" style="background:${template.elevationPreviewBg};border-radius:8px;border:1px solid rgba(255,255,255,0.15)">
      <!-- Ground Horizon & Paving -->
      <rect x="0" y="230" width="400" height="50" fill="#0f172a" />
      <line x1="0" y1="230" x2="400" y2="230" stroke="${color}" stroke-width="2" />

      <!-- Building Mass - Ground Floor -->
      <rect x="60" y="110" width="280" height="120" fill="rgba(30,41,59,0.9)" stroke="${color}" stroke-width="2" rx="4" />

      <!-- Building Mass - First Floor Villa Deck -->
      <rect x="75" y="30" width="250" height="80" fill="rgba(15,23,42,0.95)" stroke="#fff" stroke-width="1.5" rx="3" />

      <!-- Glass Balcony Railing -->
      <rect x="75" y="90" width="250" height="20" fill="rgba(56,189,248,0.25)" stroke="${color}" stroke-width="1" />
      <line x1="75" y1="90" x2="325" y2="90" stroke="${color}" stroke-width="2" />

      <!-- Main Entrance Wooden Doors -->
      <rect x="175" y="150" width="50" height="80" fill="#78350f" stroke="#f59e0b" stroke-width="1.5" rx="2" />
      <circle cx="215" cy="190" r="3" fill="#fbbf24" />

      <!-- Large Architectural Glass Windows -->
      <rect x="85" y="45" width="60" height="40" fill="rgba(56,189,248,0.3)" stroke="#fff" stroke-width="1.5" />
      <rect x="255" y="45" width="60" height="40" fill="rgba(56,189,248,0.3)" stroke="#fff" stroke-width="1.5" />

      <!-- Warm Facade LED Spotlights -->
      <circle cx="100" cy="120" r="4" fill="#fef08a" />
      <circle cx="300" cy="120" r="4" fill="#fef08a" />

      <text x="200" y="20" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">${template.style.toUpperCase()}</text>
      <text x="200" y="260" fill="${color}" font-size="10" font-weight="bold" text-anchor="middle">3D FRONT ELEVATION ARCHITECTURAL FACADE</text>
    </svg>
  `;
}

// Generate Structural Engineering Grid SVG
function generateStructuralGridSvg(template, width, depth) {
  const color = template.colorScheme || '#38bdf8';
  return `
    <svg viewBox="0 0 400 280" width="100%" height="220" style="background:#050811;border-radius:8px;border:1px solid rgba(255,255,255,0.1)">
      <!-- Structural Grid Axes -->
      <line x1="60" y1="20" x2="60" y2="260" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="160" y1="20" x2="160" y2="260" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="260" y1="20" x2="260" y2="260" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="340" y1="20" x2="340" y2="260" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />

      <line x1="20" y1="50" x2="380" y2="50" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="20" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="20" y1="230" x2="380" y2="230" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,4" />

      <!-- RCC Columns (Nodes) -->
      ${[
        {x:60,y:50},{x:160,y:50},{x:260,y:50},{x:340,y:50},
        {x:60,y:140},{x:160,y:140},{x:260,y:140},{x:340,y:140},
        {x:60,y:230},{x:160,y:230},{x:260,y:230},{x:340,y:230}
      ].map(c => `<rect x="${c.x-6}" y="${c.y-6}" width="12" height="12" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>`).join('')}

      <!-- Beams Connection Lines -->
      <line x1="60" y1="50" x2="340" y2="50" stroke="#38bdf8" stroke-width="2" />
      <line x1="60" y1="140" x2="340" y2="140" stroke="#38bdf8" stroke-width="2" />
      <line x1="60" y1="230" x2="340" y2="230" stroke="#38bdf8" stroke-width="2" />

      <text x="200" y="30" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">RCC COLUMN & BEAM STRUCTURAL LAYOUT</text>
      <text x="200" y="255" fill="#38bdf8" font-size="10" text-anchor="middle">${template.colsCount} Columns (9" x 12") · Fe-550 Steel · M25 Concrete Grade</text>
    </svg>
  `;
}

// ==================== Floor Plans Page Template ====================
export function floorPlansPage() {
  const initialWidth = 30;
  const initialDepth = 40;
  const initialSqFt = 1200;
  const initialPlans = generate10IndianFloorPlans(initialSqFt, 'East', 'Auto', initialWidth, initialDepth);

  return `
    <section class="section">
      <div class="container">
        
        <!-- Header Banner (MakeMyHouse Style) -->
        <div style="text-align:center;max-width:880px;margin:0 auto 36px">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);border-radius:99px;margin-bottom:16px">
            <i class="fas fa-house-chimney" style="color:var(--primary)"></i>
            <span style="color:var(--primary);font-weight:700;font-size:0.85rem">MAKEMYHOUSE ARCHITECTURAL & DESIGN SERVICES</span>
          </div>
          <h1 style="font-size:2.2rem;margin-bottom:12px;letter-spacing:-0.5px">
            Online House Plans, 3D Elevation & Structural Drawings <br>
            <span style="background:linear-gradient(135deg,var(--primary),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent">Search By Plot Dimensions & Vastu Direction</span>
          </h1>
          <p class="text-muted" style="font-size:1.02rem;line-height:1.6">
            Search by plot dimension (Width x Length in Ft), Vastu direction, or BHK configuration. Get <strong>10 executable Indian floor plan blueprints, 3D front elevations, and RCC structural drawings</strong> tailored for your exact land plot.
          </p>
        </div>

        <!-- MakeMyHouse Dimension & Direction Control Panel -->
        <div class="card" style="background:rgba(15,23,42,0.92);border:1px solid var(--border-glow);padding:28px;margin-bottom:36px;box-shadow:0 12px 36px rgba(0,0,0,0.5)">
          <form id="floorPlanFilterForm">
            
            <!-- Quick Preset Dimensions Buttons (MakeMyHouse Popular Sizes) -->
            <div style="margin-bottom:20px">
              <label class="form-label" style="display:flex;justify-content:space-between;align-items:center">
                <span><i class="fas fa-ruler-combined" style="color:var(--primary);margin-right:6px"></i> Search by Popular Plot Dimensions (Ft):</span>
                <strong style="color:var(--gold);font-size:1.05rem" id="sqftDisplayValue">30 ft x 40 ft (1200 Sq Ft)</strong>
              </label>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="15" data-depth="40">15 x 40 (600 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="20" data-depth="40">20 x 40 (800 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="20" data-depth="50">20 x 50 (1000 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="25" data-depth="50">25 x 50 (1250 SqFt)</button>
                <button type="button" class="btn btn-primary btn-sm dim-preset-btn active" data-width="30" data-depth="40">30 x 40 (1200 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="30" data-depth="50">30 x 50 (1500 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="35" data-depth="60">35 x 60 (2100 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="40" data-depth="60">40 x 60 (2400 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="50" data-depth="60">50 x 60 (3000 SqFt)</button>
                <button type="button" class="btn btn-ghost btn-sm dim-preset-btn" data-width="50" data-depth="80">50 x 80 (4000 SqFt)</button>
              </div>
            </div>

            <!-- Custom Dimension Inputs Grid -->
            <div class="grid grid-5" style="gap:14px;align-items:end">
              
              <div class="form-group" style="margin:0">
                <label class="form-label">Frontage Width (Ft)</label>
                <input type="number" id="inputPlotWidth" class="form-input" value="30" min="10" max="200" placeholder="e.g. 30">
              </div>

              <div class="form-group" style="margin:0">
                <label class="form-label">Plot Depth (Ft)</label>
                <input type="number" id="inputPlotDepth" class="form-input" value="40" min="10" max="300" placeholder="e.g. 40">
              </div>

              <div class="form-group" style="margin:0">
                <label class="form-label"><i class="fas fa-compass" style="color:var(--gold);margin-right:6px"></i> 8 Vastu Directions</label>
                <select id="inputFacing" class="form-select">
                  <option value="East">East (Kithchen SE / Entry NE)</option>
                  <option value="North">North (Kubera Money Corner)</option>
                  <option value="South">South (High Privacy Villa)</option>
                  <option value="West">West (Sunset Terrace View)</option>
                  <option value="North-East">North-East (Eeshanya Pure Vastu)</option>
                  <option value="South-East">South-East (Agneya Fire Zone)</option>
                  <option value="North-West">North-West (Vayavya Guest)</option>
                  <option value="South-West">South-West (Nairutya Master)</option>
                  <option value="Any">Any Facing Direction</option>
                </select>
              </div>

              <div class="form-group" style="margin:0">
                <label class="form-label"><i class="fas fa-bed" style="color:var(--accent);margin-right:6px"></i> Bedrooms (BHK)</label>
                <select id="inputBhk" class="form-select">
                  <option value="Auto">Auto Match</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK Villa</option>
                </select>
              </div>

              <div>
                <button type="submit" class="btn btn-primary btn-block pulse-btn" style="padding:13px;font-size:0.92rem">
                  <i class="fas fa-search"></i> Search 10 Plans
                </button>
              </div>

            </div>

          </form>
        </div>

        <!-- MakeMyHouse Architectural Drawings Switcher & Results Header -->
        <div class="flex-between" style="margin-bottom:24px;flex-wrap:wrap;gap:14px">
          <div>
            <h3 style="margin:0;display:flex;align-items:center;gap:8px">
              <i class="fas fa-building" style="color:var(--primary)"></i> 
              <span id="resultsHeaderTitle">10 Executable House Plans for 30 ft x 40 ft (1200 Sq Ft)</span>
            </h3>
            <p class="text-muted" style="font-size:0.85rem;margin-top:2px">
              Includes 2D Floor Plan Blueprint, 3D Elevation Render, and Structural Engineering Grid for every option.
            </p>
          </div>

          <!-- Drawing View Mode Switcher Buttons -->
          <div style="display:flex;gap:6px;background:rgba(15,23,42,0.8);padding:4px;border-radius:var(--radius-md);border:1px solid var(--border)">
            <button class="btn btn-primary btn-sm view-mode-btn active" data-view-mode="2d">
              <i class="fas fa-layer-group"></i> 2D Blueprint
            </button>
            <button class="btn btn-ghost btn-sm view-mode-btn" data-view-mode="3d">
              <i class="fas fa-cube"></i> 3D Elevation
            </button>
            <button class="btn btn-ghost btn-sm view-mode-btn" data-view-mode="structural">
              <i class="fas fa-table-cells"></i> Structural Grid
            </button>
          </div>
        </div>

        <!-- 10 Plans Grid Container -->
        <div class="grid grid-2" id="floorPlansGridContainer" style="gap:24px;margin-bottom:40px">
          ${renderPlansListHtml(initialPlans, '2d')}
        </div>

      </div>
    </section>
  `;
}

// Render the 10 Floor Plan Cards HTML with viewMode (2d, 3d, or structural)
export function renderPlansListHtml(plans, currentViewMode = '2d') {
  return plans.map((plan, idx) => {
    let renderGraphic = plan.svgBlueprint;
    let modeTitle = '2D ARCHITECTURAL BLUEPRINT SCHEMATIC';
    if (currentViewMode === '3d') {
      renderGraphic = plan.svg3dElevation;
      modeTitle = '3D FRONT ELEVATION ARCHITECTURAL FACADE';
    } else if (currentViewMode === 'structural') {
      renderGraphic = plan.svgStructuralGrid;
      modeTitle = 'RCC COLUMN & BEAM STRUCTURAL ENGINEERING LAYOUT';
    }

    return `
      <div class="card animate-in delay-${(idx % 3) + 1}" style="padding:22px;background:rgba(15,23,42,0.88);border:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between;gap:16px;position:relative;overflow:hidden">
        
        <!-- Top Badge & Header -->
        <div>
          <div class="flex-between" style="margin-bottom:10px;flex-wrap:wrap;gap:8px">
            <span class="badge badge-primary" style="font-size:0.78rem">Option ${idx + 1} of 10</span>
            <div style="display:flex;gap:6px">
              <span class="badge badge-gold" style="font-size:0.75rem"><i class="fas fa-star"></i> ${plan.vastuScore}% Vastu</span>
              <span class="badge badge-accent" style="font-size:0.75rem">${plan.bhk}</span>
            </div>
          </div>

          <h3 style="margin:0 0 6px;font-size:1.15rem;color:var(--text-primary)">${plan.title}</h3>
          <p class="text-muted" style="font-size:0.82rem;margin-bottom:12px">
            <i class="fas fa-ruler-combined" style="color:var(--primary);margin-right:4px"></i> <strong>Plot Dimensions:</strong> ${plan.plotWidth}' x ${plan.plotDepth}' (${plan.totalAreaSqFt} Sq Ft) · <strong>Facing:</strong> ${plan.facing}
          </p>
        </div>

        <!-- Dynamic Graphic Container (2D Blueprint / 3D Elevation / Structural Grid) -->
        <div style="position:relative">
          <div style="position:absolute;top:10px;left:10px;z-index:2;background:rgba(9,13,22,0.88);padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.15);font-size:0.72rem;color:var(--primary);font-weight:700">
            <i class="fas fa-drafting-compass" style="margin-right:4px"></i> ${modeTitle}
          </div>
          ${renderGraphic}
        </div>

        <!-- Room Specs & Advantages -->
        <div style="padding:12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border)">
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">
            <strong style="color:var(--gold)"><i class="fas fa-lightbulb" style="margin-right:4px"></i> Special Feature:</strong> ${plan.highlight}
          </div>
          <div style="font-size:0.78rem;color:var(--text-secondary);display:grid;grid-template-columns:1fr 1fr;gap:6px">
            <div><i class="fas fa-clock" style="color:var(--primary);margin-right:4px"></i> <strong>Est. Days:</strong> ${plan.estimatedDays} days</div>
            <div><i class="fas fa-cubes" style="color:var(--accent);margin-right:4px"></i> <strong>RCC Columns:</strong> ${plan.colsCount} Columns</div>
          </div>
        </div>

        <!-- Price Quote & Action Buttons -->
        <div style="padding-top:10px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <span class="text-muted" style="font-size:0.75rem;display:block">Est. Construction Cost</span>
            <strong style="color:var(--success);font-size:1.1rem">${plan.costRange}</strong>
          </div>

          <div style="display:flex;gap:8px">
            <a class="btn btn-primary btn-sm select-plan-btn" data-route="/workspace" data-plan-title="${plan.title}" style="font-size:0.82rem">
              <i class="fas fa-check-circle"></i> Select Plan
            </a>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

// Setup Interactive Handlers for the Floor Plans Page
export function setupFloorPlanPageHandlers() {
  const form = document.getElementById('floorPlanFilterForm');
  if (!form) return;

  const widthInput = document.getElementById('inputPlotWidth');
  const depthInput = document.getElementById('inputPlotDepth');
  const facingSelect = document.getElementById('inputFacing');
  const bhkSelect = document.getElementById('inputBhk');
  const sqftDisplay = document.getElementById('sqftDisplayValue');
  const gridContainer = document.getElementById('floorPlansGridContainer');
  const resultsHeader = document.getElementById('resultsHeaderTitle');
  const dimPresetBtns = document.querySelectorAll('.dim-preset-btn');
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');

  let activeViewMode = '2d';

  // Handle dimension preset buttons click
  dimPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dimPresetBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      dimPresetBtns.forEach(b => b.classList.add('btn-ghost'));
      btn.classList.remove('btn-ghost');
      btn.classList.add('active', 'btn-primary');

      const w = parseInt(btn.getAttribute('data-width')) || 30;
      const d = parseInt(btn.getAttribute('data-depth')) || 40;
      
      widthInput.value = w;
      depthInput.value = d;
      
      updateSqFtDisplay(w, d);
      triggerGeneratePlans();
    });
  });

  // Handle custom width/depth inputs
  const updateDimensionText = () => {
    const w = parseInt(widthInput.value) || 30;
    const d = parseInt(depthInput.value) || 40;
    updateSqFtDisplay(w, d);
  };

  widthInput?.addEventListener('input', updateDimensionText);
  depthInput?.addEventListener('input', updateDimensionText);

  function updateSqFtDisplay(w, d) {
    const totalSqFt = w * d;
    if (sqftDisplay) {
      sqftDisplay.textContent = `${w} ft x ${d} ft (${totalSqFt} Sq Ft)`;
    }
  }

  // Handle view mode switcher (2D, 3D, Structural)
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      viewModeBtns.forEach(b => b.classList.add('btn-ghost'));
      btn.classList.remove('btn-ghost');
      btn.classList.add('active', 'btn-primary');

      activeViewMode = btn.getAttribute('data-view-mode') || '2d';
      triggerGeneratePlans();
    });
  });

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerGeneratePlans();
  });

  function triggerGeneratePlans() {
    const w = parseInt(widthInput.value) || 30;
    const d = parseInt(depthInput.value) || 40;
    const totalSqFt = w * d;
    const facing = facingSelect.value;
    const bhk = bhkSelect.value;

    const newPlans = generate10IndianFloorPlans(totalSqFt, facing, bhk, w, d);

    if (resultsHeader) {
      resultsHeader.textContent = `10 Executable House Plans for ${w} ft x ${d} ft (${totalSqFt} Sq Ft) · ${facing} Facing`;
    }

    if (gridContainer) {
      gridContainer.innerHTML = renderPlansListHtml(newPlans, activeViewMode);
    }
  }
}
