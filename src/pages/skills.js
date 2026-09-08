// ==================== Standalone 3D Skills Universe Page ====================
import { SKILL_CATEGORIES } from '../components/skillSphere/skillsData.js';

export function skillsPage() {
  return `
    <section class="skill-sphere-page-section">
      <div class="skill-universe-container">
        <!-- HUD Header -->
        <div class="skill-hud-header">
          <div class="skill-hud-top-row">
            <div class="skill-hud-badge">
              <span class="hud-pulse-dot"></span>
              <span class="hud-badge-text">✧ AI-Powered Smart Construction</span>
            </div>
            
            <div class="skill-hud-controls">
              <button id="skillRotateToggleBtn" class="hud-btn" title="Toggle Auto-Rotation">
                <i class="fas fa-arrows-rotate"></i> <span>Orbit: Active</span>
              </button>
              <button id="skillResetCamBtn" class="hud-btn" title="Reset Viewpoint">
                <i class="fas fa-crosshairs"></i> <span>Reset View</span>
              </button>
            </div>
          </div>

          <h1 class="skill-hud-headline">3D Smart Construction House Ecosystem</h1>
          <p class="skill-hud-subtitle">
            <strong style="color:var(--primary)">Design • Build • Analyze • Manage</strong> — A real-time 3D architectural command center connecting AI analysis, parametric architecture, materials, and project tracking to a futuristic smart house.
          </p>

          <!-- Category Filter Pills -->
          <div class="skill-category-filters" id="skillCategoryFilters">
            <button class="skill-filter-btn active" data-category="ALL">All Features (12)</button>
            <button class="skill-filter-btn" data-category="${SKILL_CATEGORIES.ARCH_DESIGN}">Architecture & Design</button>
            <button class="skill-filter-btn" data-category="${SKILL_CATEGORIES.AI_ANALYTICS}">AI & Analytics</button>
            <button class="skill-filter-btn" data-category="${SKILL_CATEGORIES.MATERIALS_COST}">Materials & Cost</button>
            <button class="skill-filter-btn" data-category="${SKILL_CATEGORIES.SITE_SAFETY}">Site & Operations</button>
          </div>
        </div>

        <!-- 3D Construction House Canvas Viewport -->
        <div class="skill-sphere-viewport-wrapper" id="skillSphereViewport">
          <!-- WebGL Canvas will be injected here -->
          <div id="skillSphereCanvasMount" class="skill-canvas-mount"></div>

          <!-- SVG Dynamic Connecting Lines Layer -->
          <svg id="skillLinesSvg" class="skill-lines-svg" aria-hidden="true"></svg>

          <!-- HTML Glassmorphism Labels Container -->
          <div id="skillLabelsOverlay" class="skill-labels-overlay"></div>

          <!-- Interaction Prompt Guide -->
          <div class="skill-viewport-guide">
            <span><i class="fas fa-mouse-pointer"></i> Move Cursor to Inspect 3D House</span>
            <span class="guide-divider">•</span>
            <span><i class="fas fa-hand-pointer"></i> Hover Node to Trace Conduits</span>
            <span class="guide-divider">•</span>
            <span><i class="fas fa-circle-info"></i> Click Node for Interactive Telemetry</span>
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
      </div>
    </section>
  `;
}
