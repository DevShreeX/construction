// ==================== About Page ====================
export function aboutPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <h1 class="text-center animate-in">About <span class="text-accent">Forzex</span> Construction</h1>
        <p class="text-center animate-in" style="font-size:1.1rem;margin-top:12px;margin-bottom:48px">Building the future with innovation, integrity, and AI-powered intelligence.</p>

        <div class="card animate-in" style="margin-bottom:32px">
          <h3 style="color:var(--primary);margin-bottom:12px">Our Mission</h3>
          <p>Forzex Construction is a full-service construction management platform that brings together project planning, AI-powered site analysis, cost estimation, and real-time tracking. We empower builders, developers, and clients with cutting-edge tools to deliver projects safely, on time, and within budget.</p>
        </div>

        <div class="grid grid-2" style="margin-bottom:40px">
          <div class="card animate-in delay-1">
            <h3><i class="fas fa-eye" style="color:var(--primary);margin-right:8px"></i> Vision</h3>
            <p>To be the leading AI-integrated construction platform in Africa and beyond, transforming how buildings are planned, built, and managed.</p>
          </div>
          <div class="card animate-in delay-2">
            <h3><i class="fas fa-bullseye" style="color:var(--primary);margin-right:8px"></i> Values</h3>
            <p>Safety first. Client transparency. Sustainable practices. Technological innovation. We hold ourselves to the highest standards in every project we undertake.</p>
          </div>
        </div>

        <h2 class="text-center" style="margin-bottom:32px">What We Offer</h2>
        <ul class="feature-list animate-in">
          <li><strong style="color:var(--primary)">AI Site Camera</strong> — Analyze construction site photos for safety hazards, progress, and compliance using Google Vision AI.</li>
          <li><strong style="color:var(--primary)">Smart Estimation</strong> — Get detailed, AI-generated cost breakdowns tailored to your project type, location, and materials.</li>
          <li><strong style="color:var(--primary)">Land Detection</strong> — Upload terrain photos and receive soil suitability and topography assessments.</li>
          <li><strong style="color:var(--primary)">Project Workspace</strong> — Create and track projects from planning through completion with milestone management.</li>
          <li><strong style="color:var(--primary)">Report Generation</strong> — Auto-generate professional PDF reports with charts, photos, and AI insights.</li>
          <li><strong style="color:var(--primary)">Client & Admin Portals</strong> — Separate dashboards for company admins and clients with role-based access control.</li>
        </ul>

        <div class="grid grid-4" style="margin-top:48px">
          <div class="stat-card animate-in delay-1"><div class="stat-value">250+</div><div class="stat-label">Projects Delivered</div></div>
          <div class="stat-card animate-in delay-2"><div class="stat-value">50+</div><div class="stat-label">Happy Clients</div></div>
          <div class="stat-card animate-in delay-3"><div class="stat-value">12+</div><div class="stat-label">Years of Excellence</div></div>
          <div class="stat-card animate-in delay-4"><div class="stat-value">98%</div><div class="stat-label">On-Time Delivery</div></div>
        </div>
      </div>
    </section>`;
}

// ==================== Projects Page ====================
export function projectsPage() {
  return `
    <section class="section">
      <div class="container">
        <h1 class="text-center animate-in">Featured Projects</h1>
        <p class="text-center animate-in" style="margin-top:8px;margin-bottom:40px">Selected showcase projects highlighting our expertise and capabilities.</p>
        <div class="grid grid-3">
          <div class="project-card animate-in delay-1">
            <div class="project-thumb" style="background:linear-gradient(135deg,#1a2540,#0f1b30)">
              <span class="badge badge-success">Completed</span>
              <h3 style="color:#fff">Skyline Office Complex</h3>
            </div>
            <div class="project-body">
              <p style="color:var(--primary);font-size:0.9rem;margin-bottom:8px"><i class="fas fa-map-marker-alt"></i> Dubai, UAE</p>
              <p>State-of-the-art mixed-use office with sustainable systems and smart building tech.</p>
              <div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
                <span class="text-muted" style="font-size:0.85rem">50,000 sq ft</span>
                <span style="color:var(--primary);font-weight:700">$5.2M</span>
              </div>
            </div>
          </div>
          <div class="project-card animate-in delay-2">
            <div class="project-thumb" style="background:linear-gradient(135deg,#f093fb,#f5576c)">
              <span class="badge badge-warning">In Progress</span>
              <h3 style="color:#fff">Harbor Residential Village</h3>
            </div>
            <div class="project-body">
              <p style="color:var(--primary);font-size:0.9rem;margin-bottom:8px"><i class="fas fa-map-marker-alt"></i> Nairobi, Kenya</p>
              <p>Luxury residential development with community gardens and sustainability features.</p>
              <div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
                <span class="text-muted" style="font-size:0.85rem">75,000 sq ft</span>
                <span style="color:var(--primary);font-weight:700">$8.5M</span>
              </div>
            </div>
          </div>
          <div class="project-card animate-in delay-3">
            <div class="project-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe)">
              <span class="badge badge-primary">Planning</span>
              <h3 style="color:#fff">Industrial Logistics Park</h3>
            </div>
            <div class="project-body">
              <p style="color:var(--primary);font-size:0.9rem;margin-bottom:8px"><i class="fas fa-map-marker-alt"></i> Addis Ababa, Ethiopia</p>
              <p>Large-scale logistics infrastructure improving storage and movement efficiency.</p>
              <div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
                <span class="text-muted" style="font-size:0.85rem">120,000 sq ft</span>
                <span style="color:var(--primary);font-weight:700">$15M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

// ==================== Contact Page ====================
export function contactPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <h1 class="text-center animate-in">Get in Touch</h1>
        <p class="text-center animate-in" style="margin-top:8px;margin-bottom:40px">We'd love to hear from you. Reach out for project enquiries or partnerships.</p>
        <div class="grid grid-2">
          <div class="animate-in delay-1">
            <div class="card" style="margin-bottom:16px">
              <h4><i class="fas fa-building" style="margin-right:8px"></i> Office</h4>
              <p style="margin-top:8px">123 Construction Avenue<br>Nairobi, Kenya</p>
            </div>
            <div class="card" style="margin-bottom:16px">
              <h4><i class="fas fa-envelope" style="margin-right:8px"></i> Email</h4>
              <p style="margin-top:8px">info@forzexconstruction.com</p>
            </div>
            <div class="card">
              <h4><i class="fas fa-phone" style="margin-right:8px"></i> Phone</h4>
              <p style="margin-top:8px">+254 700 000 000<br>Mon–Fri 09:00–18:00</p>
            </div>
          </div>
          <div class="card animate-in delay-2">
            <h3 style="margin-bottom:16px">Send a Message</h3>
            <form id="contactForm">
              <div class="form-group"><label class="form-label">Name</label><input class="form-input" placeholder="Your name" required></div>
              <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="you@example.com" required></div>
              <div class="form-group"><label class="form-label">Subject</label><input class="form-input" placeholder="Project enquiry" required></div>
              <div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" placeholder="Tell us about your project..." required></textarea></div>
              <button type="submit" class="btn btn-primary btn-block">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>`;
}

// ==================== Feedback Page ====================
export function feedbackPage() {
  return `
    <section class="section flex-center" style="min-height:70vh">
      <div class="card animate-in" style="max-width:600px;width:100%">
        <h2 style="color:var(--primary);text-align:left;margin-bottom:4px">Feedback</h2>
        <p style="margin-bottom:24px">We value your feedback — tell us what you think about Forzex features and improvements.</p>
        <form id="feedbackForm">
          <div class="form-group"><label class="form-label">Name</label><input class="form-input" placeholder="Your name" required></div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="you@example.com" required></div>
          <div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" placeholder="How can we improve?" required></textarea></div>
          <div style="display:flex;gap:12px">
            <button type="submit" class="btn btn-accent">Send Feedback</button>
            <a class="btn btn-ghost" data-route="/">Back to Home</a>
          </div>
        </form>
      </div>
    </section>`;
}
