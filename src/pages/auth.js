// ==================== Auth Pages ====================

export function adminLoginPage() {
  return `
    <section class="section flex-center" style="min-height:80vh">
      <div class="card animate-in" style="max-width:460px;width:100%">
        <div class="text-center" style="margin-bottom:24px">
          <div style="font-size:2.5rem;color:var(--primary);margin-bottom:8px"><i class="fas fa-shield-halved"></i></div>
          <h2 style="margin-bottom:4px">Admin Login</h2>
          <p>Company portal for Forzex administrators.</p>
        </div>
        <form id="adminLoginForm">
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="adminEmail" placeholder="admin@forzex.com" required></div>
          <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" id="adminPass" required></div>
          <button type="submit" class="btn btn-accent btn-block" style="margin-top:8px"><i class="fas fa-sign-in-alt"></i> Sign In</button>
        </form>
        <p style="text-align:center;margin-top:16px;font-size:0.9rem">Client? <a data-route="/client/login" style="color:var(--primary);cursor:pointer">Login here instead</a></p>
      </div>
    </section>`;
}

export function clientLoginPage() {
  return `
    <section class="section flex-center" style="min-height:80vh">
      <div class="card animate-in" style="max-width:460px;width:100%">
        <div class="text-center" style="margin-bottom:24px">
          <div style="font-size:2.5rem;color:var(--primary);margin-bottom:8px"><i class="fas fa-user-circle"></i></div>
          <h2 style="margin-bottom:4px">Client Login</h2>
          <p>Access your projects and documents.</p>
        </div>
        <form id="clientLoginForm">
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="you@example.com" required></div>
          <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" required></div>
          <button type="submit" class="btn btn-accent btn-block" style="margin-top:8px"><i class="fas fa-sign-in-alt"></i> Sign In</button>
        </form>
        <p style="text-align:center;margin-top:16px;font-size:0.9rem">New client? <a data-route="/client/register" style="color:var(--primary);cursor:pointer">Register here</a></p>
        <p style="text-align:center;margin-top:8px;font-size:0.9rem">Admin? <a data-route="/admin/login" style="color:var(--primary);cursor:pointer">Admin login</a></p>
      </div>
    </section>`;
}

export function clientRegisterPage() {
  return `
    <section class="section flex-center" style="min-height:80vh">
      <div class="card animate-in" style="max-width:600px;width:100%">
        <h2 style="text-align:left;margin-bottom:4px">Client Registration</h2>
        <p style="margin-bottom:24px">Join Forzex to submit project requests and track progress.</p>
        <form id="clientRegForm">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" placeholder="Jane Doe" required></div>
            <div class="form-group"><label class="form-label">Phone</label><input class="form-input" type="tel" placeholder="+254 700 000 000" required></div>
          </div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="jane@example.com" required></div>
          <div class="form-group"><label class="form-label">Company / Project</label><input class="form-input" placeholder="Company name" required></div>
          <div class="form-group"><label class="form-label">Service Interest</label><select class="form-select" required><option value="">Select</option><option>Design & Planning</option><option>Construction Management</option><option>Site Safety & Inspection</option><option>Consultation</option></select></div>
          <div class="form-group"><label class="form-label">Project Details</label><textarea class="form-textarea" rows="3" placeholder="Describe your project..." required></textarea></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" required><span class="form-hint">Min 8 chars, 1 uppercase, 1 number</span></div>
            <div class="form-group"><label class="form-label">Confirm Password</label><input class="form-input" type="password" required></div>
          </div>
          <button type="submit" class="btn btn-accent btn-block"><i class="fas fa-user-plus"></i> Register</button>
        </form>
        <p style="text-align:center;margin-top:16px;font-size:0.9rem">Already registered? <a data-route="/client/login" style="color:var(--primary);cursor:pointer">Login here</a></p>
      </div>
    </section>`;
}

export function adminDashPage() {
  return `
    <section class="section">
      <div class="container">
        <div class="flex-between" style="margin-bottom:32px;flex-wrap:wrap;gap:12px">
          <div><span class="badge badge-primary" style="margin-bottom:8px">Admin Portal</span><h1>Dashboard</h1></div>
          <div style="display:flex;gap:8px"><a class="btn btn-primary btn-sm" data-route="/workspace"><i class="fas fa-plus"></i> New Project</a><button class="btn btn-ghost btn-sm" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button></div>
        </div>
        <div class="grid grid-4" style="margin-bottom:32px">
          <div class="dash-stat"><h4>Active Projects</h4><div class="value">12</div><div class="trend trend-up">+3 this month</div></div>
          <div class="dash-stat"><h4>Total Clients</h4><div class="value">48</div><div class="trend trend-up">+5 new</div></div>
          <div class="dash-stat"><h4>Revenue</h4><div class="value">₹20.4 Cr</div><div class="trend trend-up">+12%</div></div>
          <div class="dash-stat"><h4>Pending</h4><div class="value">3</div><div class="trend">Approvals needed</div></div>
        </div>
        <div class="grid grid-2">
          <div class="card"><h3>Recent Projects</h3><ul class="feature-list" style="margin-top:12px"><li><strong style="color:var(--primary)">Skyline Office</strong> — In Progress (78%)</li><li><strong style="color:var(--primary)">Harbor Village</strong> — In Progress (65%)</li><li><strong style="color:var(--primary)">Logistics Park</strong> — Planning Phase</li></ul></div>
          <div class="card"><h3>Quick Actions</h3><ul class="feature-list" style="margin-top:12px"><li style="cursor:pointer" data-route="/workspace"><i class="fas fa-plus" style="color:var(--primary);margin-right:8px"></i>Create Project</li><li style="cursor:pointer" data-route="/report"><i class="fas fa-file-pdf" style="color:var(--primary);margin-right:8px"></i>Generate Report</li><li style="cursor:pointer" data-route="/vision"><i class="fas fa-camera" style="color:var(--primary);margin-right:8px"></i>Site Analysis</li></ul></div>
        </div>
      </div>
    </section>`;
}

export function clientDashPage() {
  return `
    <section class="section">
      <div class="container">
        <div class="flex-between" style="margin-bottom:32px;flex-wrap:wrap;gap:12px">
          <div><h1>My Dashboard</h1><p>Welcome back! Here's your project overview.</p></div>
          <button class="btn btn-ghost btn-sm" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
        <div class="grid grid-3" style="margin-bottom:32px">
          <div class="dash-stat"><h4>My Projects</h4><div class="value">2</div></div>
          <div class="dash-stat"><h4>Overall Progress</h4><div class="value">65%</div></div>
          <div class="dash-stat"><h4>Messages</h4><div class="value">4</div><div class="trend">Unread</div></div>
        </div>
        <div class="card"><h3>Your Projects</h3>
          <div class="grid grid-2" style="margin-top:16px">
            <div class="card card-flat"><h4>Harbor Residential Village</h4><p style="margin-top:4px">Status: <span class="badge badge-warning">In Progress</span></p><div style="background:var(--border);border-radius:99px;height:8px;margin-top:12px"><div style="width:65%;height:100%;background:var(--primary);border-radius:99px"></div></div><p class="text-muted" style="margin-top:6px;font-size:0.85rem">65% complete</p></div>
            <div class="card card-flat"><h4>New Office Renovation</h4><p style="margin-top:4px">Status: <span class="badge badge-primary">Planning</span></p><div style="background:var(--border);border-radius:99px;height:8px;margin-top:12px"><div style="width:10%;height:100%;background:var(--primary);border-radius:99px"></div></div><p class="text-muted" style="margin-top:6px;font-size:0.85rem">10% complete</p></div>
          </div>
        </div>
      </div>
    </section>`;
}

export function workspacePage() {
  return `
    <section class="section">
      <div class="container" style="max-width:950px">
        <h1 class="text-center animate-in">Project Workspace & AI Visualization Studio</h1>
        <p class="text-center animate-in" style="margin-top:8px;margin-bottom:36px">Enter your project specifications below. Our AI engine will create your project and generate a custom 3D construction short video based on your input.</p>

        <!-- Create New Project & AI Construction Video Generator Card -->
        <div class="card animate-in" style="background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.35);box-shadow:0 12px 36px rgba(0,0,0,0.6)">
          <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
            <div>
              <h3 style="margin:0;display:flex;align-items:center;gap:8px">
                <i class="fas fa-rocket" style="color:var(--primary)"></i> 
                Create New Project & Generate AI 3D Short Video
              </h3>
              <p class="text-muted" style="font-size:0.85rem;margin-top:2px">
                Provide your project details to create your project entry and generate a matching 3D short video walkthrough.
              </p>
            </div>
            <span class="badge badge-accent" style="padding:6px 14px"><i class="fas fa-wand-magic-sparkles"></i> Content-Based AI Video</span>
          </div>

          <form id="projectForm" style="margin-top:16px">
            <div class="form-group">
              <label class="form-label">Project Name</label>
              <input class="form-input" id="projName" placeholder="e.g. Skyline Commercial Tower & Tech Park" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Project Type & Architecture</label>
                <select class="form-select" id="projType" required>
                  <option value="">Select Type</option>
                  <option value="Commercial High-Rise Complex">🏢 Commercial High-Rise Complex</option>
                  <option value="Residential Luxury Villa & Apartments">🏡 Residential Luxury Villa & Apartments</option>
                  <option value="Industrial Smart Factory & Warehouse">🏬 Industrial Smart Factory & Warehouse</option>
                  <option value="Infrastructure Highway & Bridge Pass">🛣️ Infrastructure Highway & Bridge Pass</option>
                  <option value="Eco-Friendly Green Building Resort">🌿 Eco-Friendly Green Building Resort</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Location</label>
                <input class="form-input" id="projLocation" placeholder="e.g. Guindy, Chennai, Tamil Nadu" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Budget (₹ INR)</label>
                <input class="form-input" type="number" id="projBudget" placeholder="75000000" required>
              </div>
              <div class="form-group">
                <label class="form-label">Plot / Built-up Area (sq ft)</label>
                <input class="form-input" type="number" id="projArea" placeholder="12500" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label"><i class="fas fa-layer-group" style="color:var(--accent);margin-right:6px"></i> AI Rendering Priority</label>
                <select id="projPriority" class="form-select">
                  <option value="High Priority (1080p Fast Render)">⚡ High Priority (1080p Fast Render)</option>
                  <option value="Cinematic Priority (4K Ray-Tracing)">🎬 Cinematic Priority (4K Ray-Tracing)</option>
                  <option value="Structural Priority (Physics & Steel Simulation)">🏗️ Structural Priority (Physics Simulation)</option>
                  <option value="Environmental Priority (Daylight & Solar Shadows)">☀️ Environmental Priority (Daylight Pass)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Estimated Start Date</label>
                <input class="form-input" type="date" id="projStartDate" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Project Requirements & Design Vision</label>
              <textarea class="form-textarea" id="projDesc" rows="3" placeholder="Specify structural details, facade style, daylight passes..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block pulse-btn" style="font-size:1.05rem;padding:16px">
              <i class="fas fa-wand-magic-sparkles"></i> Create Project & Generate Custom AI 3D Short Video
            </button>
          </form>

          <!-- AI Rendering Status Loader -->
          <div id="projectAiLoading" style="display:none;margin-top:24px;padding:28px;background:rgba(15,23,42,0.9);border-radius:var(--radius-md);border:1px solid var(--border-glow);text-align:center">
            <div class="loader-spinner" style="margin:0 auto 14px"></div>
            <h4 style="color:var(--primary)" id="projectAiLoadingTitle">AI Neural Engine Compiling 3D Construction Video...</h4>
            <p class="text-muted" style="font-size:0.85rem;margin-top:6px" id="projectAiLoadingSub">Processing project specs, structural physics, and camera flight passes...</p>
          </div>

          <!-- Created Project & Generated Video Display Container -->
          <div id="projectResultCard" style="display:none;margin-top:28px;border-radius:var(--radius-md);overflow:hidden;border:2px solid var(--primary);box-shadow:0 12px 40px rgba(56,189,248,0.3)">
            <div style="padding:20px;background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));border-bottom:1px solid var(--border)">
              <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:12px">
                <h3 style="margin:0;color:var(--primary)" id="createdProjTitle">
                  <i class="fas fa-building"></i> Skyline Commercial Tower
                </h3>
                <span class="badge badge-success" style="font-size:0.85rem"><i class="fas fa-circle-check"></i> Project Created & Video Ready</span>
              </div>

              <div class="grid grid-4" style="gap:12px;margin-top:12px">
                <div class="card card-flat" style="padding:10px 14px">
                  <span class="text-muted" style="font-size:0.75rem">Location</span>
                  <strong style="display:block;color:#fff;font-size:0.9rem" id="createdProjLoc">Chennai, Tamil Nadu</strong>
                </div>
                <div class="card card-flat" style="padding:10px 14px">
                  <span class="text-muted" style="font-size:0.75rem">Budget</span>
                  <strong style="display:block;color:var(--gold);font-size:0.9rem" id="createdProjBudget">₹7,50,00,000</strong>
                </div>
                <div class="card card-flat" style="padding:10px 14px">
                  <span class="text-muted" style="font-size:0.75rem">Built-up Area</span>
                  <strong style="display:block;color:var(--accent);font-size:0.9rem" id="createdProjArea">12,500 sq ft</strong>
                </div>
                <div class="card card-flat" style="padding:10px 14px">
                  <span class="text-muted" style="font-size:0.75rem">Priority</span>
                  <strong style="display:block;color:var(--success);font-size:0.9rem" id="createdProjPriority">High Priority</strong>
                </div>
              </div>

              <p style="margin-top:12px;font-size:0.85rem;color:var(--text-secondary)" id="createdProjDesc">
                <em>"Project description details..."</em>
              </p>
            </div>

            <!-- Custom AI Generated Construction Video Player -->
            <div style="position:relative;background:#000">
              <div class="flex-between" style="padding:10px 16px;background:rgba(0,0,0,0.85);position:absolute;top:0;left:0;right:0;z-index:10">
                <span style="color:var(--primary);font-weight:700;font-size:0.85rem">
                  <i class="fas fa-play-circle" style="margin-right:6px"></i> AI GENERATED 3D SHORT VIDEO WALKTHROUGH
                </span>
                <span class="badge badge-primary" style="font-size:0.75rem">1080p HD Video Pass</span>
              </div>
              
              <video id="projectAiVideoPlayer" controls playsinline preload="auto" style="width:100%;max-height:450px;display:block;padding-top:40px">
                <source id="projectVideoSrc" src="/cinematic_video.mp4" type="video/mp4">
                <source src="/final_vdo.mp4" type="video/mp4">
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>
        </div>

      </div>
    </section>`;
}
