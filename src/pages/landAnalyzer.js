// ==================== Irregular Land Border & Usable Construction Area Page ====================

export function landAnalyzerPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:1150px">
        <!-- Header Banner -->
        <div class="text-center animate-in">
          <span class="badge badge-primary" style="margin-bottom:12px">
            <i class="fas fa-draw-polygon" style="margin-right:6px;color:var(--gold)"></i> GIS Spatial Boundary Engine
          </span>
          <h1>Irregular Land Border & Usable Construction Area</h1>
          <p style="margin-top:8px;margin-bottom:24px;max-width:850px;margin-left:auto;margin-right:auto">
            Mark boundary points ($P_1, P_2, \\dots, P_n$) for any regular or irregular plot of land. The app automatically calculates the outer plot border, side lengths, total acreage, applies customizable setback buffers, and visualizes the exact usable land area for construction.
          </p>

        </div>

        <!-- Main Workspace Grid -->
        <div class="grid" style="grid-template-columns: 1fr; gap: 24px;">
          
          <!-- Interactive Map & Controls Card -->
          <div class="card animate-in">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
              <div>
                <h3 style="margin:0;display:flex;align-items:center;gap:8px">
                  <i class="fas fa-map-marked-alt" style="color:var(--primary)"></i> 
                  Interactive Land Boundary Plotter
                </h3>
                <p class="text-muted" style="font-size:0.85rem;margin-top:2px">
                  Click on the satellite map below to mark land border points in sequence.
                </p>
              </div>

              <!-- Map Quick Actions Toolbar -->
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button id="landUndoBtn" class="btn btn-outline btn-sm" title="Undo last point">
                  <i class="fas fa-undo"></i> Undo Point
                </button>
                <button id="landClearBtn" class="btn btn-danger btn-sm" style="background:rgba(239,68,68,0.2);color:var(--danger);border:1px solid var(--danger)">
                  <i class="fas fa-trash-can"></i> Reset Map
                </button>
                <button id="saveLandFirebaseBtn" class="btn btn-accent btn-sm">
                  <i class="fas fa-cloud-arrow-up"></i> Save Plot to Firebase
                </button>
              </div>
            </div>

            <!-- Control Bar Row -->
            <div class="card card-flat" style="padding:16px;margin-bottom:16px;background:rgba(15,23,42,0.8);border:1px solid var(--border)">
              <div class="grid grid-3" style="gap:16px;align-items:center">
                
                <!-- Setback Slider -->
                <div>
                  <div class="flex-between" style="margin-bottom:6px">
                    <label class="form-label" style="margin:0;font-size:0.85rem">
                      <i class="fas fa-arrows-left-right-to-line" style="color:var(--accent);margin-right:6px"></i> 
                      Setback Margin: <strong id="setbackValText" style="color:var(--gold)">5 ft</strong>
                    </label>
                    <span class="text-muted" style="font-size:0.75rem">(Front/Sides/Rear)</span>
                  </div>
                  <input type="range" id="setbackRange" min="0" max="30" step="1" value="5" style="width:100%;accent-color:var(--gold);cursor:pointer">
                </div>

                <!-- Presets Dropdown -->
                <div>
                  <label class="form-label" style="margin-bottom:6px;font-size:0.85rem">
                    <i class="fas fa-shapes" style="color:var(--primary);margin-right:6px"></i> Load Irregular Plot Presets
                  </label>
                  <select id="presetShapeSelect" class="form-select" style="padding:8px 12px;font-size:0.85rem">
                    <option value="custom">✏️ Custom Click Mode (Click Map)</option>
                    <option value="lshape">📐 Irregular L-Shaped Parcel</option>
                    <option value="trapezoid">🔷 Irregular Trapezoid Lot</option>
                    <option value="corner">📐 Triangular Corner Plot</option>
                    <option value="pentagon">🛑 Irregular 5-Sided Polygon</option>
                  </select>
                </div>

                <!-- Location Search Bar -->
                <div>
                  <label class="form-label" style="margin-bottom:6px;font-size:0.85rem">
                    <i class="fas fa-search-location" style="color:var(--success);margin-right:6px"></i> Fly To Location / City
                  </label>
                  <div style="display:flex;gap:6px">
                    <input id="landCityInput" class="form-input" placeholder="e.g. Austin, Nairobi, Mumbai" style="padding:8px 12px;font-size:0.85rem">
                    <button id="landCitySearchBtn" class="btn btn-primary btn-sm"><i class="fas fa-search"></i></button>
                  </div>
                </div>

              </div>
            </div>

            <!-- Map Container -->
            <div style="position:relative">
              <div id="landAnalyzerMap" style="height:480px;width:100%;border-radius:var(--radius-md);border:1px solid var(--border);z-index:1"></div>
              
              <!-- Map Instruction Tooltip Overlay -->
              <div style="position:absolute;bottom:16px;left:16px;z-index:10;background:rgba(7,16,33,0.85);backdrop-filter:blur(10px);padding:10px 16px;border-radius:var(--radius-md);border:1px solid rgba(110,231,255,0.3);font-size:0.8rem;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.5)">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="width:10px;height:10px;background:var(--gold);border-radius:50%;display:inline-block"></span> 
                  <strong style="color:var(--gold)">Outer Gold Line:</strong> Property Border
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="width:10px;height:10px;background:#10b981;border-radius:50%;display:inline-block"></span> 
                  <strong style="color:#10b981">Green Zone:</strong> Usable Construction Land
                </div>
              </div>
            </div>

          </div>

          <!-- Live Metrics & Analysis Cards Grid -->
          <div class="grid grid-4 animate-in delay-1" id="landMetricsGrid">
            
            <div class="dash-stat" style="border-left:4px solid var(--gold)">
              <h4><i class="fas fa-vector-square" style="color:var(--gold)"></i> Total Plot Land Area</h4>
              <div class="value" id="totalAreaVal" style="color:var(--gold)">0 sq ft</div>
              <div class="trend" id="totalAcresVal" style="color:var(--text-muted)">0.000 Acres (0 m²)</div>
            </div>

            <div class="dash-stat" style="border-left:4px solid #10b981;background:linear-gradient(135deg, rgba(16,185,129,0.1), rgba(17,24,39,0.9))">
              <h4><i class="fas fa-building-circle-check" style="color:#10b981"></i> Usable Construction Area</h4>
              <div class="value" id="usableAreaVal" style="color:#10b981">0 sq ft</div>
              <div class="trend" id="usableAcresVal" style="color:var(--text-muted)">0.000 Acres (0 m²)</div>
            </div>

            <div class="dash-stat" style="border-left:4px solid var(--danger)">
              <h4><i class="fas fa-shield-halved" style="color:var(--danger)"></i> Setback Margin Buffer Area</h4>
              <div class="value" id="setbackAreaVal" style="color:var(--danger)">0 sq ft</div>
              <div class="trend" id="setbackPercentVal" style="color:var(--text-muted)">0% of land</div>
            </div>

            <div class="dash-stat" style="border-left:4px solid var(--accent)">
              <h4><i class="fas fa-chart-pie" style="color:var(--accent)"></i> Build Efficiency Ratio</h4>
              <div class="value" id="buildRatioVal" style="color:var(--accent)">0%</div>
              <div class="trend" id="perimeterVal" style="color:var(--text-muted)">Perimeter: 0 ft</div>
            </div>

          </div>

          <!-- Detailed Breakdown & Side Lengths Table -->
          <div class="grid grid-2 animate-in delay-2">
            
            <!-- Side Lengths & Border Vertices Table -->
            <div class="card">
              <div class="flex-between" style="margin-bottom:12px">
                <h4 style="margin:0"><i class="fas fa-ruler-horizontal" style="color:var(--primary);margin-right:6px"></i> Border Side Lengths & Vertices</h4>
                <span class="badge badge-primary" id="pointCountBadge">0 Points Marked</span>
              </div>
              <div style="overflow-x:auto;max-height:260px;overflow-y:auto">
                <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border);text-align:left;color:var(--text-muted)">
                      <th style="padding:8px">Segment</th>
                      <th style="padding:8px">From → To</th>
                      <th style="padding:8px">Distance (ft)</th>
                      <th style="padding:8px">Distance (m)</th>
                    </tr>
                  </thead>
                  <tbody id="sideLengthsTableBody">
                    <tr><td colspan="4" class="text-muted" style="padding:16px;text-align:center">Click on the map to add border points and calculate side lengths.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- AI Construction Recommendation Card -->
            <div class="card">
              <h4 style="margin-bottom:12px"><i class="fas fa-brain" style="color:var(--gold);margin-right:6px"></i> AI Construction & Footprint Recommendations</h4>
              <div id="landAiAdviceContent">
                <p class="text-muted" style="font-size:0.9rem">Mark at least 3 points on the map to calculate polygon usable geometry and view automated structural recommendations.</p>
              </div>
            </div>

          </div>

          <!-- Firebase Saved Plot Boundaries -->
          <div class="card animate-in delay-3" style="margin-top:12px">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
              <h3><i class="fas fa-database" style="color:var(--accent);margin-right:8px"></i> Firebase Saved Land Plot Records</h3>
              <button id="refreshLandFirebaseBtn" class="btn btn-outline btn-sm"><i class="fas fa-arrows-rotate"></i> Refresh DB</button>
            </div>
            <div id="firebaseLandPlotsContainer">
              <p class="text-muted" style="font-size:0.9rem">Loading saved land plots from Firebase storage...</p>
            </div>
          </div>

        </div>
      </div>
    </section>`;
}
