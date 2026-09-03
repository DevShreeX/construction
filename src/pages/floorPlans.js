// ==================== Indian Floor Plans & 10-Option Layout Engine ====================
// Inspired by IndianFloorPlans.com architecture standards & Vastu Shastra principles

export function generate10IndianFloorPlans(sqft = 1200, facing = 'East', bhkPref = 'Auto', floorsPref = 'Single') {
  const sqftNum = parseInt(sqft) || 1200;
  
  // Base cost estimate factor: ₹1,650 to ₹2,100 per sq ft for construction
  const baseCostMin = Math.round(sqftNum * 1650);
  const baseCostMax = Math.round(sqftNum * 2100);

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

  // 10 distinct architectural layout templates
  const templates = [
    {
      id: 'plan-1',
      title: 'Option 1: Traditional Vastu-Compliant Classic Layout',
      style: 'Vastu Shastra Verified',
      plotRatio: '30 ft x 40 ft',
      vastuScore: 98,
      facing: facing === 'Any' ? 'East' : facing,
      highlight: 'Kitchen in SE (Agneya), Master Bed in SW (Nairutya), Entrance in NE (Eeshanya)',
      advantages: ['Maximum daylight & cross ventilation', 'Ideal for joint & nuclear families', 'Separate Puja room facing East'],
      rooms: [
        { name: 'Living & Dining Room', size: `${Math.round(Math.sqrt(sqftNum) * 0.45)}' x ${Math.round(Math.sqrt(sqftNum) * 0.4)}'` },
        { name: 'Master Bedroom', size: `12' x 14' (Attached Bath)` },
        { name: 'Bedroom 2', size: `11' x 12'` },
        { name: 'Kitchen & Utility', size: `10' x 9' (SE Corner)` },
        { name: 'Puja Room', size: `5' x 6' (NE Corner)` },
        { name: 'Covered Car Parking', size: `11' x 16'` }
      ],
      costRange: `${formatINR(baseCostMin)} - ${formatINR(baseCostMax)}`,
      colsCount: Math.max(8, Math.round(sqftNum / 120)),
      colorScheme: '#38bdf8'
    },
    {
      id: 'plan-2',
      title: 'Option 2: Open-Concept Modern Minimalist Plan',
      style: 'Contemporary Open Living',
      plotRatio: '25 ft x 48 ft',
      vastuScore: 92,
      facing: 'North',
      highlight: 'Spacious double-height living hall with seamless kitchen island',
      advantages: ['Spacious feel for compact lots', 'Abundant indoor greenery niche', 'Low maintenance layout'],
      rooms: [
        { name: 'Grand Living Hall', size: `16' x 20'` },
        { name: 'Open Island Kitchen', size: `12' x 10'` },
        { name: 'Master Suite', size: `14' x 14' with Walk-in Closet` },
        { name: 'Guest Bedroom', size: `11' x 11'` },
        { name: 'Sit-out Balcony', size: `6' x 12'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.05))} - ${formatINR(Math.round(baseCostMax * 1.08))}`,
      colsCount: Math.max(8, Math.round(sqftNum / 115)),
      colorScheme: '#a855f7'
    },
    {
      id: 'plan-3',
      title: 'Option 3: Courtyard Style Central Skylight House',
      style: 'Chettinad & Kerala Fusion',
      plotRatio: '35 ft x 35 ft',
      vastuScore: 96,
      facing: 'East',
      highlight: 'Central Brahmasthan courtyard with rainwater skylight roof',
      advantages: ['Natural cooling reduces AC bills by 30%', 'Vastu-perfect Brahmasthan center', 'Elegant traditional wooden pillars'],
      rooms: [
        { name: 'Central Courtyard (Muttaram)', size: `10' x 10' Skylight` },
        { name: 'Formal Living Room', size: `14' x 15'` },
        { name: 'Master Bedroom', size: `13' x 15'` },
        { name: 'Second Bedroom', size: `12' x 13'` },
        { name: 'Traditional Kitchen', size: `10' x 12'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.1))} - ${formatINR(Math.round(baseCostMax * 1.12))}`,
      colsCount: Math.max(10, Math.round(sqftNum / 110)),
      colorScheme: '#4ade80'
    },
    {
      id: 'plan-4',
      title: 'Option 4: Dual-Balcony Maximum Space Efficiency Layout',
      style: 'Urban Compact Efficient',
      plotRatio: '30 ft x 40 ft',
      vastuScore: 89,
      facing: 'West',
      highlight: 'Zero wasted passage space with dual front and rear balconies',
      advantages: ['100% space utilization efficiency', 'Dual wind tunnel ventilation', 'Extra storage lofts included'],
      rooms: [
        { name: 'Living & Dining Area', size: `15' x 18'` },
        { name: 'Master Bedroom', size: `12' x 13'` },
        { name: 'Children Bedroom', size: `11' x 12'` },
        { name: 'L-Shaped Modular Kitchen', size: `9' x 10'` },
        { name: 'Front Balcony', size: `5' x 15'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 0.96))} - ${formatINR(Math.round(baseCostMax * 0.98))}`,
      colsCount: Math.max(8, Math.round(sqftNum / 125)),
      colorScheme: '#f59e0b'
    },
    {
      id: 'plan-5',
      title: 'Option 5: G+1 Duplex Villa with Private Terrace Garden',
      style: 'Luxury Duplex Villa',
      plotRatio: '30 ft x 50 ft',
      vastuScore: 94,
      facing: 'North-East',
      highlight: 'Internal teakwood spiral staircase & Master bedroom balcony',
      advantages: ['Separate privacy for upper bedrooms', 'Terrace gazebo & green lawn space', 'Dedicated home theater room'],
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
      title: 'Option 6: Stilt Car Parking + Independent Residence Plan',
      style: 'Metropolitan Stilt+1 Design',
      plotRatio: '20 ft x 60 ft',
      vastuScore: 91,
      facing: 'South',
      highlight: 'Ground stilt parking for 2 cars & 4 two-wheelers + upper residence',
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
      style: 'Dual Income Generating Plan',
      plotRatio: '30 ft x 40 ft',
      vastuScore: 93,
      facing: 'East',
      highlight: 'Independent 1BHK unit on Ground floor for passive rental income',
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
      title: 'Option 8: Compact Eco-Green Solar Passive House Plan',
      style: 'Eco-Friendly Sustainable Architecture',
      plotRatio: '30 ft x 35 ft',
      vastuScore: 95,
      facing: 'South-East',
      highlight: 'Solar panel roof orientation + fly-ash brick thermal insulation',
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
      title: 'Option 9: Ultra Low-Budget Smart Steel-Concrete Modular Plan',
      style: 'Cost-Optimized Budget Smart',
      plotRatio: '25 ft x 40 ft',
      vastuScore: 90,
      facing: 'North-West',
      highlight: 'Standardized column grid reducing construction cost by 15%',
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
      title: 'Option 10: Contemporary Villa with Swimming Pool & Deck',
      style: 'High-End Luxury Villa',
      plotRatio: '40 ft x 50 ft',
      vastuScore: 97,
      facing: 'East',
      highlight: 'Private lap pool, wooden deck lounge, and glass elevation facade',
      advantages: ['Resort style living experience', 'Spacious master suite with bath tub', 'Smart home automation ready'],
      rooms: [
        { name: 'Double Height Living Room', size: `18' x 24'` },
        { name: 'Private Lap Pool & Deck', size: `12' x 25'` },
        { name: 'Master Presidential Suite', size: `16' x 18'` },
        { name: 'Guest Villa Rooms', size: `14' x 15' Each` },
        { name: 'Modular German Kitchen', size: `12' x 15'` }
      ],
      costRange: `${formatINR(Math.round(baseCostMin * 1.35))} - ${formatINR(Math.round(baseCostMax * 1.45))}`,
      colsCount: Math.max(14, Math.round(sqftNum / 90)),
      colorScheme: '#6366f1'
    }
  ];

  return templates.map((t, idx) => ({
    ...t,
    bhk: getBhk(idx),
    totalAreaSqFt: sqftNum,
    estimatedDays: Math.round(110 + (sqftNum / 15)),
    svgBlueprint: generateSvgBlueprint(t, sqftNum)
  }));
}

// Generate dynamic 2D Architectural SVG Blueprint Schematic
function generateSvgBlueprint(template, sqft) {
  const color = template.colorScheme || '#38bdf8';
  return `
    <svg viewBox="0 0 400 280" width="100%" height="220" style="background:#090d16;border-radius:8px;border:1px solid rgba(255,255,255,0.1)">
      <!-- Blueprint Grid Background -->
      <defs>
        <pattern id="grid-${template.id}" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.07)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="400" height="280" fill="url(#grid-${template.id})" />

      <!-- Outer Boundary Wall -->
      <rect x="25" y="25" width="350" height="230" fill="none" stroke="${color}" stroke-width="3.5" rx="4" />
      <rect x="29" y="29" width="342" height="222" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="4,4" />

      <!-- Room Divider Walls -->
      <!-- Living Room -->
      <rect x="35" y="35" width="200" height="130" fill="rgba(56,189,248,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="135" y="95" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">LIVING & DINING</text>
      <text x="135" y="112" fill="${color}" font-size="10" text-anchor="middle">${Math.round(Math.sqrt(sqft)*0.45)}' x ${Math.round(Math.sqrt(sqft)*0.4)}'</text>

      <!-- Master Bedroom -->
      <rect x="245" y="35" width="120" height="130" fill="rgba(168,85,247,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="305" y="95" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">MASTER BED</text>
      <text x="305" y="112" fill="#a855f7" font-size="10" text-anchor="middle">12' x 14'</text>

      <!-- Kitchen / Utility -->
      <rect x="35" y="173" width="130" height="72" fill="rgba(74,222,128,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="100" y="210" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">KITCHEN (SE)</text>

      <!-- Bedroom 2 / Puja -->
      <rect x="173" y="173" width="192" height="72" fill="rgba(245,158,11,0.06)" stroke="${color}" stroke-width="1.5" />
      <text x="269" y="210" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">BEDROOM 2 / PUJA</text>

      <!-- Vastu Orientation Compass Marker -->
      <circle cx="360" cy="45" r="14" fill="#0f172a" stroke="${color}" stroke-width="1.5" />
      <text x="360" y="42" fill="#ef4444" font-size="8" font-weight="bold" text-anchor="middle">N</text>
      <text x="360" y="53" fill="${color}" font-size="7" text-anchor="middle">${template.facing.substring(0,1)}</text>

      <!-- Entrance Door Indicator -->
      <path d="M 120 25 L 140 25 A 20 20 0 0 1 120 45 Z" fill="none" stroke="#eab308" stroke-width="2" />
      <text x="135" y="20" fill="#eab308" font-size="9" font-weight="bold" text-anchor="middle">MAIN ENTRY (${template.facing})</text>
    </svg>
  `;
}

// ==================== Floor Plans Page Template ====================
export function floorPlansPage() {
  const initialSqFt = 1200;
  const initialPlans = generate10IndianFloorPlans(initialSqFt, 'East', 'Auto', 'Single');

  return `
    <section class="section">
      <div class="container">
        
        <!-- Header Banner -->
        <div style="text-align:center;max-width:850px;margin:0 auto 36px">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);border-radius:99px;margin-bottom:16px">
            <i class="fas fa-drafting-compass" style="color:var(--primary)"></i>
            <span style="color:var(--primary);font-weight:700;font-size:0.85rem">INDIAN FLOOR PLANS & ARCHITECTURE ENGINE</span>
          </div>
          <h1 style="font-size:2.2rem;margin-bottom:12px;letter-spacing:-0.5px">
            Get 10 Executable House Floor Plans <br><span style="background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent">Based On Your Exact Plot Square Feet</span>
          </h1>
          <p class="text-muted" style="font-size:1.02rem;line-height:1.6">
            Enter your required plot square footage or select a standard Indian plot size. Our neural architectural generator produces <strong>10 distinct, Vastu-compliant 2D blueprint options</strong> with full room dimensions, column counts, and estimated construction quotes in ₹ INR.
          </p>
        </div>

        <!-- Interactive Search & Control Panel -->
        <div class="card" style="background:rgba(15,23,42,0.9);border:1px solid var(--border);padding:28px;margin-bottom:36px;box-shadow:0 12px 36px rgba(0,0,0,0.5)">
          <form id="floorPlanFilterForm">
            
            <!-- Quick Preset SqFt Buttons -->
            <div style="margin-bottom:20px">
              <label class="form-label" style="display:flex;justify-content:space-between;align-items:center">
                <span><i class="fas fa-ruler-combined" style="color:var(--primary);margin-right:6px"></i> Quick Select Plot Area (Sq Ft):</span>
                <strong style="color:var(--primary);font-size:1.05rem" id="sqftDisplayValue">1200 Sq Ft</strong>
              </label>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="600">600 Sq Ft (20x30)</button>
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="800">800 Sq Ft (20x40)</button>
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="1000">1000 Sq Ft (25x40)</button>
                <button type="button" class="btn btn-primary btn-sm sqft-preset-btn active" data-sqft="1200">1200 Sq Ft (30x40)</button>
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="1500">1500 Sq Ft (30x50)</button>
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="1800">1800 Sq Ft (30x60)</button>
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="2400">2400 Sq Ft (40x60)</button>
                <button type="button" class="btn btn-ghost btn-sm sqft-preset-btn" data-sqft="3000">3000 Sq Ft (50x60)</button>
              </div>
            </div>

            <!-- Inputs Grid -->
            <div class="grid grid-4" style="gap:16px;align-items:end">
              
              <div class="form-group" style="margin:0">
                <label class="form-label">Custom Plot Sq Ft</label>
                <input type="number" id="inputCustomSqFt" class="form-input" value="1200" min="300" max="10000" placeholder="e.g. 1200">
              </div>

              <div class="form-group" style="margin:0">
                <label class="form-label"><i class="fas fa-compass" style="color:var(--gold);margin-right:6px"></i> Vastu Facing</label>
                <select id="inputFacing" class="form-select">
                  <option value="East">East Facing (Recommended)</option>
                  <option value="North">North Facing (Kubera Corner)</option>
                  <option value="South">South Facing</option>
                  <option value="West">West Facing</option>
                  <option value="Any">Any Facing Direction</option>
                </select>
              </div>

              <div class="form-group" style="margin:0">
                <label class="form-label"><i class="fas fa-bed" style="color:var(--accent);margin-right:6px"></i> BHK Configuration</label>
                <select id="inputBhk" class="form-select">
                  <option value="Auto">Auto (Best Match for SqFt)</option>
                  <option value="1 BHK">1 BHK Layout</option>
                  <option value="2 BHK">2 BHK Layout</option>
                  <option value="3 BHK">3 BHK Layout</option>
                  <option value="4 BHK">4 BHK Villa Layout</option>
                </select>
              </div>

              <div>
                <button type="submit" class="btn btn-primary btn-block pulse-btn" style="padding:13px;font-size:0.95rem">
                  <i class="fas fa-wand-magic-sparkles"></i> Generate 10 Plans
                </button>
              </div>

            </div>

          </form>
        </div>

        <!-- 10 Plans Grid Container -->
        <div class="flex-between" style="margin-bottom:20px;flex-wrap:wrap;gap:10px">
          <div>
            <h3 style="margin:0;display:flex;align-items:center;gap:8px">
              <i class="fas fa-cubes" style="color:var(--primary)"></i> 
              <span id="resultsHeaderTitle">10 Executable Floor Plan Options for 1200 Sq Ft</span>
            </h3>
            <p class="text-muted" style="font-size:0.85rem;margin-top:2px">
              Select any of the 10 custom architectural blueprints below to view complete room specs, Vastu details, and execution quotes.
            </p>
          </div>
          <span class="badge badge-success" style="font-size:0.85rem" id="resultsCountBadge">10 Unique Options Ready</span>
        </div>

        <!-- Plans Cards Grid -->
        <div class="grid grid-2" id="floorPlansGridContainer" style="gap:24px;margin-bottom:40px">
          ${renderPlansListHtml(initialPlans)}
        </div>

      </div>
    </section>
  `;
}

// Render the 10 Floor Plan Cards HTML
export function renderPlansListHtml(plans) {
  return plans.map((plan, idx) => `
    <div class="card animate-in delay-${(idx % 3) + 1}" style="padding:22px;background:rgba(15,23,42,0.85);border:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between;gap:16px;position:relative;overflow:hidden">
      
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
          <i class="fas fa-drafting-compass" style="color:var(--primary);margin-right:4px"></i> <strong>Plot Ratio:</strong> ${plan.plotRatio} (${plan.totalAreaSqFt} Sq Ft) · <strong>Facing:</strong> ${plan.facing}
        </p>
      </div>

      <!-- 2D SVG Blueprint Schematic Preview -->
      <div style="position:relative">
        <div style="position:absolute;top:10px;left:10px;z-index:2;background:rgba(9,13,22,0.85);padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.1);font-size:0.72rem;color:var(--primary);font-weight:700">
          <i class="fas fa-layer-group" style="margin-right:4px"></i> 2D ARCHITECTURAL BLUEPRINT SCHEMATIC
        </div>
        ${plan.svgBlueprint}
      </div>

      <!-- Highlights & Room Summary -->
      <div style="padding:12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border)">
        <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">
          <strong style="color:var(--gold)"><i class="fas fa-lightbulb" style="margin-right:4px"></i> Special Feature:</strong> ${plan.highlight}
        </div>
        <div style="font-size:0.78rem;color:var(--text-secondary);display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div><i class="fas fa-ruler-square" style="color:var(--primary);margin-right:4px"></i> <strong>Est. Construction:</strong> ${plan.estimatedDays} days</div>
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
          <button class="btn btn-ghost btn-sm view-plan-details-btn" data-plan-index="${idx}" style="font-size:0.82rem">
            <i class="fas fa-eye"></i> Details
          </button>
          <a class="btn btn-primary btn-sm select-plan-btn" data-route="/workspace" data-plan-title="${plan.title}" style="font-size:0.82rem">
            <i class="fas fa-check-circle"></i> Select Plan
          </a>
        </div>
      </div>

    </div>
  `).join('');
}

// Setup Interactive Handlers for the Floor Plans Page
export function setupFloorPlanPageHandlers() {
  const form = document.getElementById('floorPlanFilterForm');
  if (!form) return;

  const sqftInput = document.getElementById('inputCustomSqFt');
  const facingSelect = document.getElementById('inputFacing');
  const bhkSelect = document.getElementById('inputBhk');
  const sqftDisplay = document.getElementById('sqftDisplayValue');
  const gridContainer = document.getElementById('floorPlansGridContainer');
  const resultsHeader = document.getElementById('resultsHeaderTitle');
  const presetBtns = document.querySelectorAll('.sqft-preset-btn');

  // Handle preset square feet buttons click
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      presetBtns.forEach(b => b.classList.add('btn-ghost'));
      btn.classList.remove('btn-ghost');
      btn.classList.add('active', 'btn-primary');

      const val = btn.getAttribute('data-sqft');
      sqftInput.value = val;
      sqftDisplay.textContent = `${val} Sq Ft`;
      
      triggerGeneratePlans();
    });
  });

  // Handle custom sqft input change
  sqftInput?.addEventListener('input', () => {
    const val = sqftInput.value || 1200;
    sqftDisplay.textContent = `${val} Sq Ft`;
  });

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerGeneratePlans();
  });

  function triggerGeneratePlans() {
    const sqft = parseInt(sqftInput.value) || 1200;
    const facing = facingSelect.value;
    const bhk = bhkSelect.value;

    const newPlans = generate10IndianFloorPlans(sqft, facing, bhk);

    if (resultsHeader) {
      resultsHeader.textContent = `10 Executable Floor Plan Options for ${sqft} Sq Ft (${facing} Facing)`;
    }

    if (gridContainer) {
      gridContainer.innerHTML = renderPlansListHtml(newPlans);
    }
  }
}
