// ==================== Home Page ====================
export function homePage() {
  return `
    <section class="hero">
      <div class="hero-content animate-in">
        <h1>Build Smarter with <span class="text-accent">Forzex</span></h1>
        <p>AI-powered construction management platform for modern builders. Track projects, analyze sites, estimate costs — all in one place.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" data-route="/admin/login"><i class="fas fa-shield-halved"></i> Company Admin</a>
          <a class="btn btn-outline btn-lg" data-route="/client/login"><i class="fas fa-user"></i> Client Portal</a>
        </div>
      </div>
    </section>

    <!-- Interactive 3D Skill Sphere Showcase Section -->
    <section class="section skill-sphere-home-section" id="skills">
      <div class="container" style="max-width: 1200px;">
        <div class="skill-sphere-header animate-in">
          <div class="skill-hud-badge">
            <span class="hud-pulse-dot"></span>
            <span class="hud-badge-text">✧ AI-Powered Smart Construction</span>
          </div>
          <h2 class="text-center" style="margin-top: 14px; margin-bottom: 8px;">3D Smart Construction House & Intelligence Network</h2>
          <p class="text-center" style="color: var(--text-muted); max-width: 820px; margin: 0 auto 28px;">
            <strong style="color:var(--primary)">Design • Build • Analyze • Manage</strong> — Explore an interactive 3D smart architectural model surrounded by AI risk analysis, interior design, material optimization, and project progress telemetry.
          </p>
        </div>

        <!-- 3D Construction House Viewport Wrapper -->
        <div class="skill-sphere-viewport-wrapper" id="skillSphereViewport">
          <!-- 3D Canvas Mount Point -->
          <div id="skillSphereCanvasMount" class="skill-canvas-mount"></div>

          <!-- Dynamic SVG Conduits Layer -->
          <svg id="skillLinesSvg" class="skill-lines-svg" aria-hidden="true"></svg>

          <!-- Glassmorphism Labels Overlay -->
          <div id="skillLabelsOverlay" class="skill-labels-overlay"></div>

          <!-- Viewport Interaction Guide -->
          <div class="skill-viewport-guide">
            <span><i class="fas fa-mouse-pointer"></i> Move Cursor to Inspect 3D House</span>
            <span class="guide-divider">•</span>
            <span><i class="fas fa-hand-pointer"></i> Hover Node to Trace Conduits</span>
            <span class="guide-divider">•</span>
            <span><i class="fas fa-circle-info"></i> Click Node to Inspect Telemetry</span>
          </div>

          <!-- Interactive HUD Detail Drawer Card -->
          <div id="skillDetailCard" class="skill-detail-card hidden" aria-live="polite">
            <button id="skillCardCloseBtn" class="skill-card-close" aria-label="Close detail card">
              <i class="fas fa-times"></i>
            </button>
            <div class="skill-card-header">
              <div class="skill-card-icon" id="cardSkillIcon">
                <i class="fas fa-brain"></i>
              </div>
              <div>
                <span class="skill-card-category" id="cardSkillCategory">Category</span>
                <h3 class="skill-card-title" id="cardSkillTitle">Skill Name</h3>
              </div>
            </div>
            
            <p class="skill-card-summary" id="cardSkillSummary">Summary description...</p>
            
            <div class="skill-card-meter-box">
              <div class="flex-between" style="font-size:0.85rem;margin-bottom:6px">
                <span style="color:var(--text-muted)">Mastery Level: <strong id="cardSkillLevel" style="color:#fff">Senior</strong></span>
                <span id="cardSkillPct" style="font-weight:700;color:var(--primary)">95%</span>
              </div>
              <div class="skill-card-bar-track">
                <div id="cardSkillProgressBar" class="skill-card-bar-fill"></div>
              </div>
            </div>

            <div class="skill-card-tags-box">
              <span class="skill-card-sublabel">Core Competencies:</span>
              <div id="cardSkillTags" class="skill-card-tags"></div>
            </div>

            <div class="skill-card-connections-box">
              <span class="skill-card-sublabel">Interconnected Nodes:</span>
              <div id="cardSkillConnections" class="skill-card-connections"></div>
            </div>
          </div>

          <!-- 2D Fallback Layout (Displayed if WebGL is unavailable) -->
          <div id="skillFallbackLayout" class="skill-fallback-layout hidden">
            <div class="fallback-header">
              <i class="fas fa-circle-nodes"></i>
              <h3>Interactive Skills Roster</h3>
              <p>2D High-Performance Fallback Mode</p>
            </div>
            <div class="fallback-grid" id="skillFallbackGrid"></div>
          </div>
        </div>

        <div class="text-center" style="margin-top: 24px;">
          <a class="btn btn-outline" data-route="/skills">
            <i class="fas fa-cube" style="margin-right: 6px;"></i> Launch Fullscreen 3D House View <i class="fas fa-arrow-right" style="margin-left: 6px;"></i>
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="text-center animate-in" style="margin-bottom:40px">Our Services</h2>
        <div class="grid grid-4">
          <div class="service-card animate-in delay-1">
            <div class="service-icon"><i class="fas fa-pencil-ruler"></i></div>
            <h3>Design & Planning</h3>
            <p>Expert architectural design and comprehensive project planning for optimal results.</p>
          </div>
          <div class="service-card animate-in delay-2">
            <div class="service-icon"><i class="fas fa-helmet-safety"></i></div>
            <h3>Safety Management</h3>
            <p>Rigorous safety protocols compliant with all international construction standards.</p>
          </div>
          <div class="service-card animate-in delay-3">
            <div class="service-icon"><i class="fas fa-chart-bar"></i></div>
            <h3>Project Tracking</h3>
            <p>Real-time monitoring and reporting of progress and resource allocation.</p>
          </div>
          <div class="service-card animate-in delay-4">
            <div class="service-icon"><i class="fas fa-leaf"></i></div>
            <h3>Sustainable Building</h3>
            <p>Eco-friendly practices and LEED certification assistance for green projects.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2 class="text-center" style="margin-bottom:40px">AI-Powered Features</h2>
        <div class="grid grid-3">
          <div class="card animate-in delay-1" style="cursor:pointer" data-route="/vision">
            <div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-camera"></i></div>
            <h3>AI Site Camera</h3>
            <p>Analyze construction sites with Google Vision AI for safety hazards, progress tracking, and object detection.</p>
          </div>
          <div class="card animate-in delay-2" style="cursor:pointer" data-route="/insights">
            <div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-calculator"></i></div>
            <h3>AI Estimation</h3>
            <p>Generate detailed cost estimates powered by OpenAI with itemized breakdowns and material calculations.</p>
          </div>
          <div class="card animate-in delay-3" style="cursor:pointer" data-route="/resources">
            <div style="font-size:2rem;color:var(--primary);margin-bottom:12px"><i class="fas fa-boxes-stacked"></i></div>
            <h3>Smart Recommendations</h3>
            <p>Get AI-powered product and material recommendations tailored to your project requirements.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-4">
          <div class="stat-card animate-in delay-1">
            <div class="stat-value">250+</div>
            <div class="stat-label">Projects Completed</div>
          </div>
          <div class="stat-card animate-in delay-2">
            <div class="stat-value">50+</div>
            <div class="stat-label">Active Clients</div>
          </div>
          <div class="stat-card animate-in delay-3">
            <div class="stat-value">12+</div>
            <div class="stat-label">Years Experience</div>
          </div>
          <div class="stat-card animate-in delay-4">
            <div class="stat-value">98%</div>
            <div class="stat-label">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container" style="max-width:900px">
        <h2 class="text-center" style="margin-bottom:12px">Contact Us</h2>
        <p class="text-center" style="margin-bottom:32px">For professional enquiries, partnerships, or support.</p>
        <div class="grid grid-2">
          <div>
            <h4 style="margin-bottom:8px"><i class="fas fa-building" style="margin-right:6px"></i> Tamil Nadu Regional HQ</h4>
            <p style="margin-bottom:16px">Forzex Construction<br>GST Road, Guindy, Chennai<br>Tamil Nadu 600032, India</p>
            <h4 style="margin-bottom:8px"><i class="fas fa-phone" style="margin-right:6px"></i> Contact</h4>
            <p>Email: info@forzexconstruction.com<br>Phone: +91 44 2250 0000<br>Mon–Sat 09:00–18:00 IST</p>
          </div>
          <div class="card">
            <form id="contactForm">
              <div class="form-group"><input class="form-input" placeholder="Your name" required></div>
              <div class="form-group"><input class="form-input" type="email" placeholder="Email address" required></div>
              <div class="form-group"><textarea class="form-textarea" rows="4" placeholder="Your message" required></textarea></div>
              <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>`;
}
