// ==================== Navbar Component ====================
export function renderNavbar() {
  const el = document.getElementById('navbar');
  el.className = 'navbar';
  el.innerHTML = `
    <div class="container flex-between">
      <div class="nav-logo" data-route="/">
        <img src="/images/logo.png" alt="Forzex Logo" style="height: 42px; width: 42px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); box-shadow: 0 0 14px rgba(56, 189, 248, 0.6); transition: transform 0.3s ease;">
        <span style="font-weight: 800; font-size: 1.35rem; color: #ffffff; letter-spacing: -0.5px; margin-left: 4px;">Forzex Construction</span>
      </div>
      <div class="nav-links" id="navLinks">
        <a data-route="/">Home</a>
        <a data-route="/workspace">Workspace</a>
        <a data-route="/floor-plans"><i class="fas fa-drafting-compass" style="margin-right:4px;color:var(--primary)"></i> House Plans</a>
        <a data-route="/land-analyzer"><i class="fas fa-draw-polygon" style="margin-right:4px;color:var(--gold)"></i> Land Plot</a>
        <a data-route="/vision">Vision</a>
        <a data-route="/insights">Insights</a>
        <a data-route="/report">Report</a>
        <a data-route="/more">More</a>
      </div>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">
        <i class="fas fa-bars"></i>
      </button>
    </div>`;

  // Mobile toggle
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Close menu on nav
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-route]') && e.target.closest('.nav-links')) {
      document.getElementById('navLinks').classList.remove('open');
    }
  });
}

// ==================== Bottom Nav Component ====================
export function renderBottomNav() {
  const el = document.getElementById('bottom-nav');
  el.className = 'bottom-nav';
  el.innerHTML = `
    <a data-route="/"><i class="fas fa-home"></i><span>Home</span></a>
    <a data-route="/floor-plans"><i class="fas fa-drafting-compass"></i><span>Plans</span></a>
    <a data-route="/workspace"><i class="fas fa-briefcase"></i><span>Work</span></a>
    <a data-route="/land-analyzer"><i class="fas fa-draw-polygon"></i><span>Land</span></a>
    <a data-route="/vision"><i class="fas fa-camera"></i><span>Vision</span></a>
    <a data-route="/more"><i class="fas fa-ellipsis-h"></i><span>More</span></a>`;
}

// ==================== Footer Component ====================
export function renderFooter() {
  const el = document.getElementById('app-footer');
  el.className = 'app-footer';
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <strong style="display: flex; align-items: center; gap: 8px;">
            <img src="/images/logo.png" alt="Forzex Logo" style="height: 28px; width: auto; border-radius: 50%;">
            Forzex Construction
          </strong>
          <p>Professional construction management delivering safe, efficient projects across residential, commercial and infrastructure sectors.</p>
        </div>
        <div>
          <div class="footer-links">
            <a data-route="/">Home</a>
            <a data-route="/projects">Projects</a>
            <a data-route="/about">About</a>
            <a data-route="/contact">Contact</a>
            <a data-route="/feedback">Feedback</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Forzex Construction. All rights reserved.</span>
        <div class="footer-social">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>`;
}
