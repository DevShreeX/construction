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
            <h4 style="margin-bottom:8px"><i class="fas fa-building" style="margin-right:6px"></i> Office</h4>
            <p style="margin-bottom:16px">Forzex Construction<br>123 Construction Avenue<br>Nairobi, Kenya</p>
            <h4 style="margin-bottom:8px"><i class="fas fa-phone" style="margin-right:6px"></i> Contact</h4>
            <p>Email: info@forzexconstruction.com<br>Phone: +254 700 000 000<br>Mon–Fri 09:00–18:00</p>
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
