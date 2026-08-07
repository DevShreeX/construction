// ==================== Client-Side Router ====================
const routes = {};
let currentPath = '';

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path, pushState = true) {
  // Check auth route guards if needed
  if (currentPath === path) return;
  currentPath = path;

  if (pushState) {
    window.history.pushState({ path }, '', path);
  }

  const content = document.getElementById('page-content');
  if (!content) return;

  // Fade out
  content.style.opacity = '0';
  content.style.transform = 'translateY(12px)';

  setTimeout(async () => {
    // Find matching route
    const handler = findRoute(path);
    if (handler) {
      try {
        const html = await handler(getRouteParams(path));
        content.innerHTML = html;
        // Re-attach any page-specific event listeners
        const initEvent = new CustomEvent('page:mounted', { detail: { path } });
        document.dispatchEvent(initEvent);
      } catch (err) {
        console.error('Route error:', err);
        content.innerHTML = errorPage();
      }
    } else {
      content.innerHTML = notFoundPage();
    }

    // Fade in
    requestAnimationFrame(() => {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
      content.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav
    updateActiveNav(path);
  }, 200);
}

function findRoute(path) {
  if (routes[path]) return routes[path];
  // Check parameterized routes like /project/:id
  for (const pattern of Object.keys(routes)) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:([^/]+)/g, '([^/]+)') + '$');
      if (regex.test(path)) return routes[pattern];
    }
  }
  return null;
}

function getRouteParams(path) {
  for (const pattern of Object.keys(routes)) {
    if (pattern.includes(':')) {
      const paramNames = [...pattern.matchAll(/:([^/]+)/g)].map(m => m[1]);
      const regex = new RegExp('^' + pattern.replace(/:([^/]+)/g, '([^/]+)') + '$');
      const match = path.match(regex);
      if (match) {
        const params = {};
        paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        return params;
      }
    }
  }
  return {};
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-links a, .bottom-nav a').forEach(link => {
    const href = link.getAttribute('data-route');
    link.classList.toggle('active', href === path || (href !== '/' && path.startsWith(href)));
  });

  // Set page-specific background key on document.body
  const pageKey = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');
  document.body.setAttribute('data-page', pageKey);
}

function notFoundPage() {
  return `
    <div class="section flex-center" style="min-height:60vh">
      <div class="text-center">
        <h1 style="font-size:5rem;color:var(--primary);margin-bottom:12px">404</h1>
        <h2>Page Not Found</h2>
        <p style="margin:16px 0 28px">The page you're looking for doesn't exist.</p>
        <a class="btn btn-primary" data-route="/" onclick="event.preventDefault()">Go Home</a>
      </div>
    </div>`;
}

function errorPage() {
  return `
    <div class="section flex-center" style="min-height:60vh">
      <div class="text-center">
        <h1 style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i></h1>
        <h2>Something Went Wrong</h2>
        <p style="margin:16px 0 28px">Please try again later.</p>
        <a class="btn btn-primary" data-route="/" onclick="event.preventDefault()">Go Home</a>
      </div>
    </div>`;
}

// ==================== Initialize Router ====================
export function initRouter() {
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const path = e.state?.path || window.location.pathname;
    navigate(path, false);
  });

  // Intercept link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-route]');
    if (link) {
      e.preventDefault();
      navigate(link.getAttribute('data-route'));
    }
  });

  // Navigate to current URL
  const initialPath = window.location.pathname === '' ? '/' : window.location.pathname;
  navigate(initialPath, false);
}
