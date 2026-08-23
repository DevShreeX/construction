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
      <div class="container" style="max-width:900px">
        <h1 class="text-center animate-in">Project Workspace</h1>
        <p class="text-center animate-in" style="margin-top:8px;margin-bottom:36px">Create and manage construction projects.</p>
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
