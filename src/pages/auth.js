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
        <p class="text-center animate-in" style="margin-top:8px;margin-bottom:36px">Create construction projects, set architectural priorities, and generate AI 3D short video walkthroughs.</p>
        
        <!-- AI 3D Construction Video Generator Card -->
        <div class="card animate-in" style="margin-bottom:28px;background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.35);box-shadow:0 12px 36px rgba(0,0,0,0.6)">
          <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
            <div>
              <h3 style="margin:0;display:flex;align-items:center;gap:8px">
                <i class="fas fa-film" style="color:var(--primary)"></i> 
                AI 3D Construction Short Video Generator
              </h3>
              <p class="text-muted" style="font-size:0.85rem;margin-top:2px">
                Select your architectural choice & rendering priority to generate custom 3D short video walkthroughs.
              </p>
            </div>
            <span class="badge badge-accent" style="padding:6px 14px"><i class="fas fa-brain"></i> AI Neural Render Engine Active</span>
          </div>

          <form id="aiVdoGeneratorForm">
            <div class="form-row">
              <!-- Architectural Choice -->
              <div class="form-group">
                <label class="form-label"><i class="fas fa-building" style="color:var(--gold);margin-right:6px"></i> Selected Architectural Choice</label>
                <select id="vdoChoiceSelect" class="form-select" required>
                  <option value="Commercial High-Rise Tower">🏢 Commercial High-Rise Tower</option>
                  <option value="Residential Luxury Villa Complex">🏡 Residential Luxury Villa Complex</option>
                  <option value="Infrastructure, Bridge & Highway Pass">🛣️ Infrastructure, Bridge & Highway Pass</option>
                  <option value="Industrial Smart Manufacturing Facility">🏬 Industrial Smart Manufacturing Facility</option>
                  <option value="Eco-Friendly Sustainable Resort">🌿 Eco-Friendly Sustainable Resort</option>
                </select>
              </div>

              <!-- Rendering Priority -->
              <div class="form-group">
                <label class="form-label"><i class="fas fa-layer-group" style="color:var(--accent);margin-right:6px"></i> Generation Priority</label>
                <select id="vdoPrioritySelect" class="form-select" required>
                  <option value="High Priority (1080p Fast Render)">⚡ High Priority (1080p Fast Render)</option>
                  <option value="Cinematic Priority (4K Ray-Tracing)">🎬 Cinematic Priority (4K Ray-Tracing)</option>
                  <option value="Structural Priority (Physics & Steel Simulation)">🏗️ Structural Priority (Physics Simulation)</option>
                  <option value="Environmental Priority (Daylight & Solar Shadows)">☀️ Environmental Priority (Daylight Pass)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label"><i class="fas fa-clock" style="color:var(--success);margin-right:6px"></i> Video Format & Length</label>
                <select id="vdoLengthSelect" class="form-select">
                  <option value="Short Cinematic Preview (15 sec)">⏱️ Short Cinematic Preview (15 sec)</option>
                  <option value="Full Architectural Walkthrough (30 sec)">🎥 Full Architectural Walkthrough (30 sec)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label"><i class="fas fa-sliders" style="color:var(--primary);margin-right:6px"></i> Camera Motion</label>
                <select id="vdoCameraMotion" class="form-select">
                  <option value="Aerial Drone Flyover">🚁 Aerial Drone Flyover</option>
                  <option value="360° Orbit Rotation">🔄 360° Orbit Rotation</option>
                  <option value="Interior Ground Walkthrough">🚶 Interior Ground Walkthrough</option>
                </select>
              </div>
            </div>

            <button type="submit" id="generateVdoSubmitBtn" class="btn btn-primary btn-block pulse-btn" style="margin-top:8px">
              <i class="fas fa-wand-magic-sparkles"></i> Generate AI 3D Construction Short Video
            </button>
          </form>

          <!-- AI Loading State Container -->
          <div id="aiVdoLoadingState" style="display:none;margin-top:20px;padding:24px;background:rgba(15,23,42,0.9);border-radius:var(--radius-md);border:1px solid var(--border-glow);text-align:center">
            <div class="loader-spinner" style="margin:0 auto 12px"></div>
            <h4 style="color:var(--primary)" id="aiLoadingText">Generating 3D AI Video Pass...</h4>
            <p class="text-muted" style="font-size:0.85rem;margin-top:4px">Compiling 3D physics, camera flight paths, and architectural daylight shaders.</p>
          </div>

          <!-- AI Generated Short Video Player Container -->
          <div id="aiVdoResultContainer" style="display:none;margin-top:24px;border-radius:var(--radius-md);overflow:hidden;border:2px solid var(--primary);box-shadow:0 8px 32px rgba(56,189,248,0.25)">
            <div class="flex-between" style="padding:12px 16px;background:rgba(15,23,42,0.95);border-bottom:1px solid var(--border)">
              <div>
                <strong style="color:var(--primary)" id="generatedVdoTitle"><i class="fas fa-video"></i> Commercial High-Rise Tower</strong>
                <p class="text-muted" style="font-size:0.8rem;margin:0" id="generatedVdoMeta">Priority: High Priority (1080p Fast Render) | Aerial Drone Flyover</p>
              </div>
              <span class="badge badge-success"><i class="fas fa-check"></i> AI Video Generated</span>
            </div>

            <div style="position:relative;background:#000">
              <video id="workspaceAiVideoPlayer" controls playsinline preload="auto" style="width:100%;max-height:420px;display:block">
                <source id="workspaceVideoSrc" src="/cinematic_video.mp4" type="video/mp4">
                <source src="/final_vdo.mp4" type="video/mp4">
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>
        </div>

        <!-- Create New Project Card -->
        <div class="card animate-in">
          <h3><i class="fas fa-plus-circle" style="color:var(--primary);margin-right:8px"></i> Create New Project</h3>
          <form id="projectForm" style="margin-top:16px">
            <div class="form-group"><label class="form-label">Project Name</label><input class="form-input" placeholder="e.g. Modern Office Complex" required></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Type</label><select class="form-select" required><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Infrastructure</option></select></div>
              <div class="form-group"><label class="form-label">Location</label><input class="form-input" placeholder="City, Country" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Budget (₹ INR)</label><input class="form-input" type="number" placeholder="5000000" required></div>
              <div class="form-group"><label class="form-label">Area (sq ft)</label><input class="form-input" type="number" placeholder="5000" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Start Date</label><input class="form-input" type="date" required></div>
              <div class="form-group"><label class="form-label">End Date</label><input class="form-input" type="date" required></div>
            </div>
            <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" rows="3" placeholder="Project details..." required></textarea></div>
            <button type="submit" class="btn btn-accent btn-block"><i class="fas fa-rocket"></i> Create Project</button>
          </form>
        </div>
      </div>
    </section>`;
}
