// ==================== Construction Dataset Intelligence & Field Ops Hub ====================

export function datasetHubPage() {
  return `
    <section class="section" style="padding-top:24px">
      <div class="container" style="max-width:1300px">
        
        <!-- Hero Header -->
        <div class="text-center animate-in" style="margin-bottom:28px">
          <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.3);padding:6px 16px;border-radius:var(--radius-full);margin-bottom:14px">
            <span style="width:8px;height:8px;background:var(--primary);border-radius:50%;display:inline-block;animation:pulse 1.5s infinite"></span>
            <span style="font-size:0.85rem;font-weight:600;color:var(--primary);letter-spacing:0.5px">INTEGRATED CONSTRUCTION DATASET</span>
          </div>
          <h1 style="font-size:2.4rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:10px">
            Construction Intelligence & Field Operations Hub
          </h1>
          <p style="max-width:850px;margin:0 auto 20px;color:var(--text-secondary);font-size:1.05rem">
            Comprehensive real-world construction analytics: <strong>570 Certified Building Materials</strong> with live market pricing, <strong>12,445 PM Field Operations Tasks</strong>, and <strong>10,254 Site Diary & Quality Forms</strong>.
          </p>

          <!-- Executive Quick Stat Badges -->
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:24px">
            <div class="dataset-stat-pill">
              <i class="fas fa-boxes-stacked" style="color:var(--gold)"></i>
              <span><strong>570</strong> Materials Catalog (19 Categories & 57 Brands)</span>
            </div>
            <div class="dataset-stat-pill">
              <i class="fas fa-list-check" style="color:var(--primary)"></i>
              <span><strong>12,445</strong> PM Field Tasks (85.2% Resolution Rate)</span>
            </div>
            <div class="dataset-stat-pill">
              <i class="fas fa-clipboard-check" style="color:var(--success)"></i>
              <span><strong>10,254</strong> PM Forms & Daily Site Diaries</span>
            </div>
            <div class="dataset-stat-pill">
              <i class="fas fa-bolt" style="color:#a855f7"></i>
              <span>REST API Active at <code>/api/dataset/*</code></span>
            </div>
          </div>
        </div>

        <!-- Main Tab Navigation Bar -->
        <div class="dataset-tabs-wrapper animate-in">
          <button class="dataset-tab-btn active" data-tab="materials">
            <i class="fas fa-cubes"></i> Materials Catalog (570)
          </button>
          <button class="dataset-tab-btn" data-tab="pm-tasks">
            <i class="fas fa-shield-halved"></i> PM Tasks & Safety (12,445)
          </button>
          <button class="dataset-tab-btn" data-tab="pm-forms">
            <i class="fas fa-file-signature"></i> PM Forms & Site Diary (10,254)
          </button>
          <button class="dataset-tab-btn" data-tab="bom-calculator">
            <i class="fas fa-calculator"></i> Smart BOQ Cost Calculator
          </button>
        </div>

        <!-- ==================== TAB 1: MATERIALS CATALOG EXPLORER ==================== -->
        <div id="tab-materials" class="dataset-tab-content active animate-in">
          
          <!-- Filters & Search Toolbar -->
          <div class="card" style="margin-bottom:20px;background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.25)">
            <div class="grid grid-3" style="gap:14px;align-items:end">
              <div>
                <label class="form-label" style="font-size:0.85rem;color:var(--text-secondary)">🔍 Instant Search</label>
                <input type="text" id="matSearchInput" class="form-input" placeholder="Search by name, brand, grade (e.g. UltraTech, Fe-500, Asian Paints, M25)..." style="font-size:0.9rem">
              </div>
              <div>
                <label class="form-label" style="font-size:0.85rem;color:var(--text-secondary)">🏷️ Brand Filter</label>
                <select id="matBrandSelect" class="form-select" style="font-size:0.9rem">
                  <option value="all">All Brands (57 Brands)</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size:0.85rem;color:var(--text-secondary)">⚡ Sort Order</label>
                <select id="matSortSelect" class="form-select" style="font-size:0.9rem">
                  <option value="name">Product Name (A - Z)</option>
                  <option value="price-asc">Price: Low to High (₹)</option>
                  <option value="price-desc">Price: High to Low (₹)</option>
                  <option value="rating">Quality & Durability Rating</option>
                </select>
              </div>
            </div>

            <!-- Category Pills Bar -->
            <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <span style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);font-weight:600">Categories</span>
                <span id="matFilteredCountText" style="font-size:0.85rem;color:var(--primary);font-weight:600">Showing 570 Materials</span>
              </div>
              <div id="matCategoryPills" class="category-pills-scroll">
                <button class="cat-pill active" data-cat="all">All (570)</button>
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>

          <!-- Materials Grid -->
          <div id="materialsCardGrid" class="grid grid-3" style="gap:18px;margin-bottom:24px">
            <div class="text-center" style="grid-column:1/-1;padding:40px">
              <div class="loader-spinner" style="margin:0 auto 12px"></div>
              <p>Loading construction materials catalog...</p>
            </div>
          </div>

          <!-- Pagination Bar -->
          <div id="matPagination" class="pagination-bar" style="display:none">
            <button id="matPrevBtn" class="btn btn-outline btn-sm"><i class="fas fa-chevron-left"></i> Prev</button>
            <span id="matPageIndicator" style="font-size:0.9rem;font-weight:600;color:var(--text-secondary)">Page 1 of 24</span>
            <button id="matNextBtn" class="btn btn-outline btn-sm">Next <i class="fas fa-chevron-right"></i></button>
          </div>

        </div>

        <!-- ==================== TAB 2: PM FIELD OPERATIONS & SAFETY TASKS ==================== -->
        <div id="tab-pm-tasks" class="dataset-tab-content animate-in" style="display:none">
          
          <!-- Key KPI Dashboard Grid -->
          <div class="grid grid-4" style="gap:14px;margin-bottom:22px">
            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(56,189,248,0.15);color:var(--primary)"><i class="fas fa-tasks"></i></div>
              <div>
                <div class="kpi-label">Total PM Tasks</div>
                <div class="kpi-value" id="kpiTotalTasks">12,445</div>
                <div class="kpi-sub">Across All Construction Sites</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(16,185,129,0.15);color:var(--success)"><i class="fas fa-check-double"></i></div>
              <div>
                <div class="kpi-label">Resolution Rate</div>
                <div class="kpi-value" id="kpiResolutionRate">85.2%</div>
                <div class="kpi-sub" style="color:var(--success)">10,500+ Closed & Actioned</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(251,191,36,0.15);color:var(--gold)"><i class="fas fa-eye"></i></div>
              <div>
                <div class="kpi-label">EHS Safety Observations</div>
                <div class="kpi-value" id="kpiSafetyObs">3,343</div>
                <div class="kpi-sub">Proactive Site Precautions</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(244,63,94,0.15);color:var(--danger)"><i class="fas fa-clock"></i></div>
              <div>
                <div class="kpi-label">Overdue Tasks</div>
                <div class="kpi-value" id="kpiOverdueTasks" style="color:var(--danger)">830</div>
                <div class="kpi-sub" style="color:var(--danger)">6.7% Require Priority Closure</div>
              </div>
            </div>
          </div>

          <!-- Analytics Charts Section -->
          <div class="grid grid-2" style="gap:18px;margin-bottom:22px">
            <!-- Task Group Distribution -->
            <div class="card" style="background:rgba(15,23,42,0.85);border:1px solid var(--border)">
              <h3 style="font-size:1.1rem;margin-bottom:14px;display:flex;align-items:center;gap:8px">
                <i class="fas fa-chart-pie" style="color:var(--primary)"></i> Task Group Distribution
              </h3>
              <div id="taskGroupBars" style="display:flex;flex-direction:column;gap:12px">
                <!-- Populated via JS -->
              </div>
            </div>

            <!-- Top 5 Risk & Cause Factors -->
            <div class="card" style="background:rgba(15,23,42,0.85);border:1px solid var(--border)">
              <h3 style="font-size:1.1rem;margin-bottom:14px;display:flex;align-items:center;gap:8px">
                <i class="fas fa-triangle-exclamation" style="color:var(--warning)"></i> Top Safety & Quality Root Causes
              </h3>
              <div id="taskCauseList" style="display:flex;flex-direction:column;gap:10px">
                <!-- Populated via JS -->
              </div>
            </div>
          </div>

          <!-- Filterable Interactive Task Log Table -->
          <div class="card" style="background:rgba(15,23,42,0.9);border:1px solid var(--border);overflow:hidden">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
              <div>
                <h3 style="margin:0;font-size:1.15rem"><i class="fas fa-table-list" style="color:var(--primary);margin-right:8px"></i> Field Tasks Log</h3>
                <p class="text-muted" style="font-size:0.85rem;margin:2px 0 0">Live filterable records from 12,445 PM items.</p>
              </div>
              
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <input type="text" id="taskSearchInput" class="form-input" placeholder="Search task description / ref..." style="width:220px;padding:8px 12px;font-size:0.85rem">
                <select id="taskStatusFilter" class="form-select" style="width:160px;padding:8px 12px;font-size:0.85rem">
                  <option value="all">All Statuses</option>
                  <option value="Closed">Closed</option>
                  <option value="Open">Open</option>
                  <option value="EHS Good Observation">EHS Good Observation</option>
                  <option value="Open / Ongoing Works">Ongoing Works</option>
                </select>
                <select id="taskGroupFilter" class="form-select" style="width:160px;padding:8px 12px;font-size:0.85rem">
                  <option value="all">All Groups</option>
                  <option value="Safety">Safety</option>
                  <option value="Site Management">Site Management</option>
                  <option value="Quality">Quality</option>
                  <option value="Design Team">Design Team</option>
                </select>
              </div>
            </div>

            <!-- Table Container -->
            <div style="overflow-x:auto">
              <table class="dataset-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Status</th>
                    <th>Group</th>
                    <th>Priority</th>
                    <th>Root Cause</th>
                    <th>Description</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody id="pmTasksTableBody">
                  <!-- Rows populated dynamically -->
                </tbody>
              </table>
            </div>

            <!-- Task Pagination -->
            <div class="pagination-bar" style="margin-top:16px">
              <button id="taskPrevBtn" class="btn btn-outline btn-sm"><i class="fas fa-chevron-left"></i> Prev</button>
              <span id="taskPageIndicator" style="font-size:0.9rem;font-weight:600;color:var(--text-secondary)">Page 1</span>
              <button id="taskNextBtn" class="btn btn-outline btn-sm">Next <i class="fas fa-chevron-right"></i></button>
            </div>
          </div>

        </div>

        <!-- ==================== TAB 3: PM FORMS & DAILY SITE DIARY ==================== -->
        <div id="tab-pm-forms" class="dataset-tab-content animate-in" style="display:none">
          
          <div class="grid grid-3" style="gap:16px;margin-bottom:22px">
            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(56,189,248,0.15);color:var(--primary)"><i class="fas fa-folder-open"></i></div>
              <div>
                <div class="kpi-label">Total PM Forms</div>
                <div class="kpi-value">10,254</div>
                <div class="kpi-sub">Verified Site Inspections</div>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(16,185,129,0.15);color:var(--success)"><i class="fas fa-stamp"></i></div>
              <div>
                <div class="kpi-label">Completed & Signed Off</div>
                <div class="kpi-value" style="color:var(--success)">7,980+</div>
                <div class="kpi-sub">Reviewed by Project Management</div>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon" style="background:rgba(251,191,36,0.15);color:var(--gold)"><i class="fas fa-spinner"></i></div>
              <div>
                <div class="kpi-label">Open / Ongoing Work Plans</div>
                <div class="kpi-value" style="color:var(--gold)">1,789</div>
                <div class="kpi-sub">Active Subcontractor Forms</div>
              </div>
            </div>
          </div>

          <!-- Forms Table Card -->
          <div class="card" style="background:rgba(15,23,42,0.9);border:1px solid var(--border);overflow:hidden">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
              <div>
                <h3 style="margin:0;font-size:1.15rem"><i class="fas fa-clipboard-list" style="color:var(--primary);margin-right:8px"></i> Daily Work Plans & Inspection Forms</h3>
                <p class="text-muted" style="font-size:0.85rem;margin:2px 0 0">Site Diary logs, Quality control inspections and contractor check-offs.</p>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <input type="text" id="formSearchInput" class="form-input" placeholder="Search form name / ref..." style="width:220px;padding:8px 12px;font-size:0.85rem">
                <select id="formGroupFilter" class="form-select" style="width:160px;padding:8px 12px;font-size:0.85rem">
                  <option value="all">All Groups</option>
                  <option value="Site Management">Site Management</option>
                  <option value="Quality">Quality</option>
                  <option value="Safety">Safety</option>
                  <option value="Subcontractor">Subcontractor</option>
                </select>
              </div>
            </div>

            <div style="overflow-x:auto">
              <table class="dataset-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Status</th>
                    <th>Form Name</th>
                    <th>Inspection Type</th>
                    <th>Group</th>
                    <th>Open Actions</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody id="pmFormsTableBody">
                  <!-- Populated via JS -->
                </tbody>
              </table>
            </div>

            <div class="pagination-bar" style="margin-top:16px">
              <button id="formPrevBtn" class="btn btn-outline btn-sm"><i class="fas fa-chevron-left"></i> Prev</button>
              <span id="formPageIndicator" style="font-size:0.9rem;font-weight:600;color:var(--text-secondary)">Page 1</span>
              <button id="formNextBtn" class="btn btn-outline btn-sm">Next <i class="fas fa-chevron-right"></i></button>
            </div>
          </div>

        </div>

        <!-- ==================== TAB 4: SMART BOQ COST CALCULATOR ==================== -->
        <div id="tab-bom-calculator" class="dataset-tab-content animate-in" style="display:none">
          <div class="grid grid-2" style="gap:20px">
            
            <!-- Calculator Input Form -->
            <div class="card" style="background:rgba(15,23,42,0.9);border:1px solid rgba(56,189,248,0.3)">
              <h3 style="font-size:1.2rem;margin-bottom:8px">
                <i class="fas fa-calculator" style="color:var(--gold);margin-right:8px"></i> Automated Bill of Quantities (BOQ)
              </h3>
              <p class="text-muted" style="font-size:0.85rem;margin-bottom:20px">
                Enter your project footprint. The system calculates exact structural quantities using civil engineering thumb rules and maps them directly to items in the <strong>570 materials catalog</strong>.
              </p>

              <form id="boqCalculatorForm">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Total Built-Up Area (sq.ft)</label>
                    <input type="number" id="boqArea" class="form-input" value="1800" min="200" max="100000" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Number of Floors</label>
                    <select id="boqFloors" class="form-select">
                      <option value="1">Ground Floor (G)</option>
                      <option value="2" selected>G + 1 (2 Floors)</option>
                      <option value="3">G + 2 (3 Floors)</option>
                      <option value="4">G + 3 (4 Floors)</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Structure Type</label>
                    <select id="boqType" class="form-select">
                      <option value="residential">Residential Villa / Independent House</option>
                      <option value="apartment">Multi-Storey Apartment</option>
                      <option value="commercial">Commercial Complex / Office</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Quality & Specification Grade</label>
                    <select id="boqGrade" class="form-select">
                      <option value="standard">Standard Quality (Economy)</option>
                      <option value="premium" selected>Premium Certified (Recommended)</option>
                      <option value="luxury">Luxury High-End Grade</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block" style="padding:14px;font-weight:700">
                  <i class="fas fa-wand-magic-sparkles"></i> Compute Project Bill of Quantities & Cost
                </button>
              </form>
            </div>

            <!-- Live BOQ Summary Card -->
            <div class="card" style="background:rgba(15,23,42,0.9);border:1px solid rgba(16,185,129,0.3)">
              <div class="flex-between" style="margin-bottom:12px">
                <h3 style="margin:0;font-size:1.15rem;color:var(--success)">
                  <i class="fas fa-file-invoice-dollar"></i> Estimated Material Cost
                </h3>
                <span class="badge badge-success" id="boqGradeBadge">Premium Grade</span>
              </div>

              <div style="background:rgba(10,19,41,0.6);border-radius:var(--radius-md);padding:18px;margin-bottom:18px;border:1px solid var(--border)">
                <div class="flex-between" style="margin-bottom:6px">
                  <span style="color:var(--text-secondary);font-size:0.9rem">Total Estimated Cost:</span>
                  <span id="boqTotalCost" style="font-size:1.6rem;font-weight:800;color:var(--gold)">₹ 26,45,000</span>
                </div>
                <div class="flex-between" style="font-size:0.85rem;color:var(--text-muted)">
                  <span>Cost per sq.ft:</span>
                  <span id="boqPerSqFt" style="font-weight:600;color:var(--primary)">₹ 1,469 / sq.ft</span>
                </div>
              </div>

              <!-- Itemized Material Table -->
              <div style="max-height:260px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:16px">
                <table class="dataset-table" style="font-size:0.85rem">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Qty</th>
                      <th>Brand Pick</th>
                      <th>Subtotal (₹)</th>
                    </tr>
                  </thead>
                  <tbody id="boqItemsTableBody">
                    <!-- Populated via JS -->
                  </tbody>
                </table>
              </div>

              <div style="display:flex;gap:10px">
                <button id="boqExportCsvBtn" class="btn btn-outline btn-sm btn-block"><i class="fas fa-file-csv"></i> Download CSV</button>
                <button id="boqPrintBtn" class="btn btn-accent btn-sm btn-block"><i class="fas fa-print"></i> Print BOM Schedule</button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Detailed Material Specification Modal -->
    <div id="materialModal" class="modal-overlay" style="display:none">
      <div class="modal-content" style="max-width:650px;background:#0f172a;border:1px solid var(--primary);box-shadow:var(--shadow-lg);border-radius:var(--radius-lg);padding:24px;position:relative">
        <button id="closeMatModalBtn" class="modal-close-btn">&times;</button>
        <div id="materialModalBody">
          <!-- Populated on click -->
        </div>
      </div>
    </div>
  `;
}
