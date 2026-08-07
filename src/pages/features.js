// ==================== AI Feature & Location/Weather Pages ====================

export function visionPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <div class="text-center animate-in">
          <span class="badge badge-primary" style="margin-bottom:12px">AI Powered</span>
          <h1>AI Site Camera & Geotagging</h1>
          <p style="margin-top:8px;margin-bottom:36px">Analyze construction site photos with live camera stream AI vision and precise GPS geotagging.</p>
        </div>
        
        <div class="card animate-in">
          <h3><i class="fas fa-camera" style="color:var(--primary);margin-right:8px"></i> Capture or Upload Site Inspection</h3>
          <p style="margin-bottom:16px">Use your device's live camera feed or upload a photo. Log exact GPS coordinates for compliance.</p>
          
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
            <button id="startCamBtn" class="btn btn-primary"><i class="fas fa-video"></i> Start Live Camera</button>
            <label class="btn btn-outline" style="cursor:pointer;margin:0"><i class="fas fa-upload"></i> Upload Image<input type="file" accept="image/*" id="uploadInput" style="display:none"></label>
          </div>

          <!-- Live Webcam Viewfinder Container -->
          <div id="cameraViewfinder" style="display:none;position:relative;background:#000;border-radius:var(--radius-md);overflow:hidden;margin-bottom:20px;border:2px solid var(--primary);box-shadow:0 8px 32px rgba(110,231,255,0.2)">
            <video id="cameraStream" autoplay playsinline style="width:100%;max-height:450px;object-fit:cover;display:block"></video>
            <canvas id="cameraCanvas" style="display:none"></canvas>
            
            <!-- Camera Viewfinder Overlay Controls -->
            <div style="position:absolute;bottom:16px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:16px;z-index:10;padding:0 16px">
              <button id="snapPhotoBtn" class="btn btn-accent" style="border-radius:50px;padding:12px 28px;font-weight:700;box-shadow:0 4px 20px rgba(0,0,0,0.5)">
                <i class="fas fa-circle-dot" style="font-size:1.2rem;margin-right:6px"></i> Capture Photo
              </button>
              <button id="switchCamBtn" class="btn btn-outline" style="background:rgba(0,0,0,0.6);border-radius:50%;width:44px;height:44px;padding:0;display:flex;align-items:center;justify-content:center" title="Switch Camera">
                <i class="fas fa-arrows-rotate"></i>
              </button>
              <button id="stopCamBtn" class="btn btn-danger" style="background:rgba(239,68,68,0.8);border-radius:50%;width:44px;height:44px;padding:0;display:flex;align-items:center;justify-content:center" title="Close Camera">
                <i class="fas fa-xmark"></i>
              </button>
            </div>
            
            <!-- Live Viewfinder Frame Overlay -->
            <div style="position:absolute;top:16px;left:16px;color:#fff;font-size:0.8rem;background:rgba(0,0,0,0.6);padding:4px 10px;border-radius:var(--radius-sm);display:flex;align-items:center;gap:6px">
              <span style="width:8px;height:8px;background:#ef4444;border-radius:50%;display:inline-block;animation:pulse 1s infinite"></span> LIVE CAMERA
            </div>
          </div>

          <div id="gpsStatus" style="display:none;margin-bottom:16px;padding:10px 14px;background:rgba(110,231,255,0.1);border:1px solid var(--accent);border-radius:var(--radius-md);font-size:0.9rem">
            <i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:8px"></i>
            <span id="gpsCoordsText">Detecting site coordinates...</span>
          </div>

          <div id="imagePreview" style="display:none;border-radius:var(--radius-md);overflow:hidden;margin-bottom:16px;border:1px solid var(--border)">
            <img id="previewImg" style="width:100%;max-height:400px;object-fit:cover" alt="Site preview">
          </div>

          <button id="analyzeBtn" class="btn btn-accent btn-block" style="display:none"><i class="fas fa-brain"></i> Run AI Site Analysis</button>
        </div>

        <div id="analysisResults" style="display:none;margin-top:24px">
          <div class="grid grid-2">
            <div class="card"><h4><i class="fas fa-shield-halved" style="color:var(--success)"></i> Safety Protocol Check</h4><div id="safetyResults" style="margin-top:12px"></div></div>
            <div class="card"><h4><i class="fas fa-cubes" style="color:var(--primary)"></i> Equipment & Materials Detected</h4><div id="objectResults" style="margin-top:12px"></div></div>
          </div>
          <div class="card" style="margin-top:16px">
            <h4><i class="fas fa-map-location-dot" style="color:var(--gold)"></i> Geotagged Site Location</h4>
            <div id="visionMap" style="height:250px;width:100%;border-radius:var(--radius-md);margin-top:12px;border:1px solid var(--border)"></div>
          </div>
        </div>
      </div>
    </section>`;
}

export function insightsPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:1000px">
        <div class="text-center animate-in">
          <span class="badge badge-primary" style="margin-bottom:12px">AI Powered</span>
          <h1>Project Insights & Estimation</h1>
          <p style="margin-top:8px;margin-bottom:36px">Detailed AI-driven cost breakdowns and smart material recommendations tailored to your construction project.</p>
        </div>
        
        <div class="grid grid-2">
          <!-- Cost Estimation -->
          <div class="card animate-in">
            <h3 style="margin-bottom:16px"><i class="fas fa-calculator" style="color:var(--primary);margin-right:8px"></i> Cost Estimation</h3>
            <form id="estimateForm">
              <div class="form-row">
                <div class="form-group"><label class="form-label">Project Type</label><select class="form-select" id="estType" required><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select></div>
                <div class="form-group"><label class="form-label">Area (sq ft)</label><input class="form-input" type="number" id="estArea" placeholder="5000" required></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="estLocation" placeholder="City, Country" required></div>
                <div class="form-group"><label class="form-label">Floors</label><input class="form-input" type="number" id="estFloors" placeholder="3" required></div>
              </div>
              <div class="form-group"><label class="form-label">Quality Grade</label><select class="form-select"><option>Standard</option><option>Premium</option><option>Luxury</option></select></div>
              <div class="form-group"><label class="form-label">Special Notes</label><textarea class="form-textarea" rows="2" placeholder="Additional requirements..."></textarea></div>
              <button type="submit" class="btn btn-accent btn-block"><i class="fas fa-brain"></i> Generate Cost Estimate</button>
            </form>
          </div>

          <!-- Material Recommendations -->
          <div class="card animate-in delay-1">
            <h3 style="margin-bottom:16px"><i class="fas fa-boxes-stacked" style="color:var(--gold);margin-right:8px"></i> Material Recommendations</h3>
            <form id="recommendForm">
              <div class="form-row">
                <div class="form-group"><label class="form-label">Project Type</label><select class="form-select" required><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select></div>
                <div class="form-group"><label class="form-label">Budget Tier</label><select class="form-select" required><option value="">Select</option><option>$50K–$200K</option><option>$200K–$1M</option><option>$1M+</option></select></div>
              </div>
              <div class="form-group"><label class="form-label">Construction Phase</label><select class="form-select" required><option value="">Select</option><option>Foundation</option><option>Structure</option><option>Electrical</option><option>Finishing</option><option>All</option></select></div>
              <div class="form-group"><label class="form-label">Requirements</label><textarea class="form-textarea" rows="4" placeholder="Eco-friendly, fire-rated, high durability..."></textarea></div>
              <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-clipboard-list"></i> Get Material List</button>
            </form>
          </div>
        </div>

        <div id="estimateResults" style="display:none;margin-top:24px"><div id="estimateContent"></div></div>
        <div id="recommendations" style="display:none;margin-top:24px"><div id="recommendContent"></div></div>
      </div>
    </section>`;
}

export function resourcesPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <div class="text-center animate-in">
          <span class="badge badge-primary" style="margin-bottom:12px">AI Powered</span>
          <h1>Product & Material Recommendations</h1>
          <p style="margin-top:8px;margin-bottom:36px">Smart AI suggestions for structural materials, machinery, and equipment.</p>
        </div>
        <div class="card animate-in">
          <form id="recommendForm">
            <div class="form-row">
              <div class="form-group"><label class="form-label">Project Type</label><select class="form-select" required><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select></div>
              <div class="form-group"><label class="form-label">Budget Tier</label><select class="form-select" required><option value="">Select</option><option>$50K–$200K</option><option>$200K–$1M</option><option>$1M+</option></select></div>
            </div>
            <div class="form-group"><label class="form-label">Construction Phase</label><select class="form-select" required><option value="">Select</option><option>Foundation</option><option>Structure</option><option>Electrical</option><option>Finishing</option><option>All</option></select></div>
            <div class="form-group"><label class="form-label">Requirements</label><textarea class="form-textarea" rows="3" placeholder="Eco-friendly, fire-rated, high durability..."></textarea></div>
            <button type="submit" class="btn btn-accent btn-block"><i class="fas fa-boxes-stacked"></i> Get AI Recommendations</button>
          </form>
        </div>
        <div id="recommendations" style="display:none;margin-top:24px"><div id="recommendContent"></div></div>
      </div>
    </section>`;
}

export function reportPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <div class="text-center animate-in">
          <span class="badge badge-primary" style="margin-bottom:12px">AI Powered</span>
          <h1>Generate Site Report</h1>
          <p style="margin-top:8px;margin-bottom:36px">Automated professional progress and site condition reports.</p>
        </div>
        <div class="card animate-in">
          <form id="reportForm">
            <div class="form-group"><label class="form-label">Select Project</label><select class="form-select" required><option value="">Choose Project</option><option>Skyline Office Complex</option><option>Harbor Residential Village</option><option>Industrial Logistics Park</option></select></div>
            <div class="form-group"><label class="form-label">Report Type</label><select class="form-select" required><option>Progress & Safety Audit</option><option>Financial Overview</option><option>Weather & Environmental Risk</option><option>Full Project Dossier</option></select></div>
            <div class="form-row"><div class="form-group"><label class="form-label">From</label><input class="form-input" type="date"></div><div class="form-group"><label class="form-label">To</label><input class="form-input" type="date"></div></div>
            <button type="submit" class="btn btn-accent btn-block"><i class="fas fa-file-pdf"></i> Generate PDF Report</button>
          </form>
        </div>
      </div>
    </section>`;
}

export function morePage() {
  return `
    <section class="section">
      <div class="container">
        <h1 class="text-center animate-in">Site Weather & Location Features</h1>
        <p class="text-center animate-in" style="margin-top:8px;margin-bottom:40px">Real-time open-source weather forecasting, GPS site positioning, and site safety impact analysis.</p>
        
        <!-- Live Weather & Interactive Map Hub -->
        <div class="card animate-in" style="margin-bottom:32px">
          <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
            <div>
              <h3><i class="fas fa-cloud-sun-rain" style="color:var(--accent);margin-right:8px"></i> Construction Site Weather & Geolocation</h3>
              <p class="text-muted">Open-source weather prediction powered by Open-Meteo & OpenStreetMap GPS API.</p>
            </div>
            <button id="weatherGpsBtn" class="btn btn-primary btn-sm">
              <i class="fas fa-location-crosshairs"></i> Use My GPS Location
            </button>
          </div>

          <div class="form-row" style="margin-bottom:16px">
            <div class="form-group">
              <label class="form-label">City Search</label>
              <div style="display:flex;gap:8px">
                <input class="form-input" id="weatherCityInput" placeholder="Enter city (e.g. London, Nairobi, Dubai)">
                <button id="searchWeatherBtn" class="btn btn-outline"><i class="fas fa-search"></i> Search</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Custom Coordinates (Lat, Lon)</label>
              <div style="display:flex;gap:8px">
                <input class="form-input" id="customLatInput" placeholder="Latitude (e.g. -1.286389)">
                <input class="form-input" id="customLonInput" placeholder="Longitude (e.g. 36.817223)">
              </div>
            </div>
          </div>

          <!-- Live Weather Display Container -->
          <div id="weatherDisplayContainer">
            <div class="flex-center" style="padding:24px;background:rgba(255,255,255,0.02);border-radius:var(--radius-md);border:1px solid var(--border)">
              <p class="text-muted"><i class="fas fa-spinner fa-spin" style="margin-right:6px"></i> Loading live weather data...</p>
            </div>
          </div>

          <!-- Interactive Leaflet Map for Construction Site Location -->
          <div style="margin-top:24px">
            <h4 style="margin-bottom:8px"><i class="fas fa-map" style="color:var(--primary);margin-right:6px"></i> Interactive Site Map & GIS Layer</h4>
            <div id="siteMap" style="height:320px;width:100%;border-radius:var(--radius-md);border:1px solid var(--border);z-index:1"></div>
          </div>
        </div>

        <h2 class="text-center" style="margin-bottom:24px">Quick Feature Access</h2>
        <div class="grid grid-3">
          <div class="card animate-in delay-1" style="cursor:pointer" data-route="/vision"><div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-camera"></i></div><h3>AI Site Camera</h3><p>Analyze site photos for safety & GPS tagging.</p></div>
          <div class="card animate-in delay-2" style="cursor:pointer" data-route="/insights"><div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-calculator"></i></div><h3>AI Estimation</h3><p>Generate detailed cost breakdowns.</p></div>
          <div class="card animate-in delay-3" style="cursor:pointer" data-route="/resources"><div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-boxes-stacked"></i></div><h3>Recommendations</h3><p>Smart material suggestions.</p></div>
          <div class="card animate-in delay-1" style="cursor:pointer" data-route="/report"><div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-file-pdf"></i></div><h3>Reports</h3><p>Professional project reports.</p></div>
          <div class="card animate-in delay-2" style="cursor:pointer" data-route="/projects"><div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-building"></i></div><h3>Projects</h3><p>Browse our portfolio.</p></div>
          <div class="card animate-in delay-3" style="cursor:pointer" data-route="/feedback"><div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-comment-dots"></i></div><h3>Feedback</h3><p>Share your thoughts.</p></div>
        </div>
      </div>
    </section>`;
}
