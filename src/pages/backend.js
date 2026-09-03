// ==================== Firebase Backend Storage Console Page ====================

export function backendPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:1100px">
        <!-- Hero & Header Section -->
        <div class="text-center animate-in" style="margin-bottom:32px">
          <span class="badge badge-primary" style="margin-bottom:12px;font-size:0.85rem">
            <i class="fas fa-server" style="margin-right:6px;color:var(--accent)"></i> Backend Architecture & Cloud DB
          </span>
          <h1 style="font-size:2.4rem;font-weight:800;letter-spacing:-0.5px">
            Firebase Backend Storage Console
          </h1>
          <p style="margin-top:10px;margin-bottom:20px;max-width:760px;margin-left:auto;margin-right:auto;color:var(--text-secondary)">
            Manage live Firebase Cloud Firestore collections, run database CRUD operations, monitor authentication status, and manage persistent storage across construction projects.
          </p>

          <!-- Live Status Pills -->
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:16px" id="backendStatusPills">
            <span class="badge badge-success" style="padding:8px 16px;font-size:0.85rem">
              <i class="fas fa-database" style="margin-right:6px"></i> Firebase Firestore: Connected
            </span>
            <span class="badge badge-primary" style="padding:8px 16px;font-size:0.85rem">
              <i class="fas fa-shield-halved" style="margin-right:6px"></i> Auth Engine: Active
            </span>
            <span class="badge badge-accent" style="padding:8px 16px;font-size:0.85rem">
              <i class="fas fa-hard-drive" style="margin-right:6px"></i> Persistent Backup: Ready
            </span>
          </div>
        </div>

        <!-- System Architecture Card -->
        <div class="card card-glass animate-in" style="margin-bottom:28px">
          <div class="flex-between" style="flex-wrap:wrap;gap:16px">
            <div style="display:flex;align-items:center;gap:16px">
              <div style="width:52px;height:52px;border-radius:14px;background:rgba(245,197,24,0.15);display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:var(--gold);border:1px solid rgba(245,197,24,0.3)">
                <i class="fas fa-fire"></i>
              </div>
              <div>
                <h3 style="margin:0;font-size:1.25rem">Firebase Firestore Backend System</h3>
                <p class="text-muted" style="margin:4px 0 0;font-size:0.88rem">Project ID: <strong id="backendProjectId" style="color:var(--accent)">forzex-construction</strong> | Mode: <span id="backendModeText" class="badge badge-primary" style="font-size:0.75rem">Cloud Firestore</span></p>
              </div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button id="testFirebaseConnBtn" class="btn btn-outline btn-sm">
                <i class="fas fa-plug-circle-check"></i> Test Connection
              </button>
              <button id="exportFirebaseJsonBtn" class="btn btn-primary btn-sm">
                <i class="fas fa-download"></i> Export DB JSON
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Stats Row -->
        <div class="grid grid-4" style="margin-bottom:28px">
          <div class="dash-stat animate-in">
            <h4>Collections</h4>
            <div class="value" style="color:var(--accent)" id="statCollections">6</div>
            <div class="trend trend-up"><i class="fas fa-layer-group"></i> Active collections</div>
          </div>
          <div class="dash-stat animate-in delay-1">
            <h4>Floor Plan API</h4>
            <div class="value" style="color:var(--gold)">Active</div>
            <div class="trend trend-up"><i class="fas fa-drafting-compass"></i> 10-Plan Generator</div>
          </div>
          <div class="dash-stat animate-in delay-2">
            <h4>Storage Status</h4>
            <div class="value" style="color:var(--success)" id="statStorage">100%</div>
            <div class="trend"><i class="fas fa-check-circle"></i> Operational</div>
          </div>
          <div class="dash-stat animate-in delay-3">
            <h4>Sync Latency</h4>
            <div class="value" style="color:var(--gold)" id="statLatency">12 ms</div>
            <div class="trend"><i class="fas fa-bolt"></i> Real-time sync</div>
          </div>
        </div>

        <!-- Indian Floor Plans API Engine Backend Card -->
        <div class="card card-glass animate-in" style="margin-bottom:28px;border:1px solid rgba(56,189,248,0.3)">
          <div class="flex-between" style="flex-wrap:wrap;gap:16px">
            <div style="display:flex;align-items:center;gap:16px">
              <div style="width:52px;height:52px;border-radius:14px;background:rgba(56,189,248,0.15);display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:var(--primary);border:1px solid rgba(56,189,248,0.3)">
                <i class="fas fa-drafting-compass"></i>
              </div>
              <div>
                <h3 style="margin:0;font-size:1.2rem">Indian Floor Plans Backend API Service</h3>
                <p class="text-muted" style="margin:4px 0 0;font-size:0.85rem">Reference: <strong style="color:var(--gold)">IndianFloorPlans.com</strong> | Output: <span class="badge badge-success" style="font-size:0.75rem">10 Executable Blueprint JSON Options</span></p>
              </div>
            </div>
            <div>
              <a data-route="/floor-plans" class="btn btn-primary btn-sm">
                <i class="fas fa-eye"></i> Launch Floor Plan Studio
              </a>
            </div>
          </div>
        </div>

        <!-- Main Workspace Section: Document Management & Collection Explorer -->
        <div class="grid grid-3" style="grid-template-columns: 1fr 2fr; gap:24px; margin-bottom:32px">
          
          <!-- Left Column: Add Document Form -->
          <div class="card animate-in">
            <h3 style="margin-bottom:16px;font-size:1.15rem">
              <i class="fas fa-plus-circle" style="color:var(--accent);margin-right:8px"></i> Add Document to Firebase
            </h3>
            <form id="addFirebaseDocForm">
              <div class="form-group">
                <label class="form-label">Target Collection</label>
                <select class="form-select" id="fbCollectionSelect" required>
                  <option value="projects">projects</option>
                  <option value="gis_sites">gis_sites</option>
                  <option value="land_plots">land_plots</option>
                  <option value="site_inspections">site_inspections</option>
                  <option value="custom_storage">custom_storage</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Document Title / Name</label>
                <input class="form-input" id="fbDocTitle" placeholder="e.g. Foundation Audit Log" required>
              </div>

              <div class="form-group">
                <label class="form-label">Category / Type</label>
                <input class="form-input" id="fbDocCategory" placeholder="e.g. Structural, Geotag, Commercial" required>
              </div>

              <div class="form-group">
                <label class="form-label">Notes & Description</label>
                <textarea class="form-textarea" id="fbDocNotes" rows="3" placeholder="Enter document details..." required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Custom JSON Metadata (Optional)</label>
                <textarea class="form-textarea" id="fbDocJson" rows="3" placeholder='{"status": "approved", "priority": "high"}' style="font-family:monospace;font-size:0.85rem"></textarea>
              </div>

              <button type="submit" class="btn btn-accent btn-block">
                <i class="fas fa-cloud-arrow-up"></i> Save to Firebase Firestore
              </button>
            </form>
          </div>

          <!-- Right Column: Collection Viewer & Records Table -->
          <div class="card animate-in delay-1">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:20px">
              <div>
                <h3 style="margin:0;font-size:1.15rem">
                  <i class="fas fa-folder-open" style="color:var(--primary);margin-right:8px"></i> Firestore Document Explorer
                </h3>
                <p class="text-muted" style="font-size:0.82rem;margin:2px 0 0">Showing live database records for target collection.</p>
              </div>

              <!-- Collection Filter Tabs -->
              <div style="display:flex;gap:6px;flex-wrap:wrap" id="collectionTabGroup">
                <button class="btn btn-primary btn-sm collection-tab active" data-col="projects">projects</button>
                <button class="btn btn-outline btn-sm collection-tab" data-col="gis_sites">gis_sites</button>
                <button class="btn btn-outline btn-sm collection-tab" data-col="land_plots">land_plots</button>
                <button class="btn btn-outline btn-sm collection-tab" data-col="site_inspections">inspections</button>
                <button class="btn btn-outline btn-sm collection-tab" data-col="custom_storage">custom</button>
              </div>
            </div>

            <!-- Search Bar & Refresh -->
            <div class="flex-between" style="gap:12px;margin-bottom:16px">
              <input class="form-input" id="searchBackendDocsInput" placeholder="🔍 Search records in collection..." style="max-width:320px">
              <button id="refreshBackendDocsBtn" class="btn btn-outline btn-sm">
                <i class="fas fa-rotate"></i> Refresh
              </button>
            </div>

            <!-- Documents Container -->
            <div id="backendDocsContainer" style="min-height:260px">
              <div class="flex-center" style="padding:40px">
                <p class="text-muted"><i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Loading Firestore records...</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Lower Grid: Firebase Configuration Viewer & Live Log Console -->
        <div class="grid grid-2" style="gap:24px">
          
          <!-- Environment & Credentials Info -->
          <div class="card animate-in delay-2">
            <h3 style="margin-bottom:16px;font-size:1.1rem">
              <i class="fas fa-key" style="color:var(--gold);margin-right:8px"></i> Firebase Environment Credentials
            </h3>
            
            <div style="display:flex;flex-direction:column;gap:10px;font-size:0.85rem">
              <div class="flex-between" style="padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)">
                <span class="text-muted">API Key Configured:</span>
                <span id="envApiKeyStatus" class="badge badge-success">Loaded</span>
              </div>
              <div class="flex-between" style="padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)">
                <span class="text-muted">Auth Domain:</span>
                <span id="envAuthDomain" style="color:var(--text-primary);font-family:monospace">forzex-construction.firebaseapp.com</span>
              </div>
              <div class="flex-between" style="padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)">
                <span class="text-muted">Storage Bucket:</span>
                <span id="envStorageBucket" style="color:var(--text-primary);font-family:monospace">forzex-construction.appspot.com</span>
              </div>
              <div class="flex-between" style="padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)">
                <span class="text-muted">Firestore Rules:</span>
                <span class="badge badge-primary">Read / Write Enabled</span>
              </div>
            </div>
          </div>

          <!-- Real-Time Event Log & Terminal Console -->
          <div class="card animate-in delay-3" style="background:#070d19;border:1px solid rgba(110,231,255,0.2)">
            <div class="flex-between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:1.1rem;color:var(--accent)">
                <i class="fas fa-terminal" style="margin-right:8px"></i> Live Firebase Console Log
              </h3>
              <button id="clearBackendLogsBtn" class="btn btn-ghost btn-sm" style="font-size:0.75rem;padding:2px 8px">Clear</button>
            </div>
            
            <div id="backendConsoleLog" style="height:150px;overflow-y:auto;background:#030712;border-radius:var(--radius-sm);padding:12px;font-family:monospace;font-size:0.8rem;color:#6ee7ff;line-height:1.6;border:1px solid rgba(255,255,255,0.05)">
              <div>[<span style="color:#10b981">SYSTEM</span>] Firebase Backend Storage Initialized</div>
              <div>[<span style="color:#3b82f6">INFO</span>] Listening for Firestore CRUD operations...</div>
            </div>
          </div>

        </div>

      </div>
    </section>`;
}
