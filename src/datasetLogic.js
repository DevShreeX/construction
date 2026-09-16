// ==================== Dataset Logic & Interactive Handlers ====================
import { showToast } from './utils.js';

let allMaterials = [];
let materialsSummary = null;
let pmAnalytics = null;
let allTasks = [];
let allForms = [];

// State
let matCurrentCategory = 'all';
let matCurrentBrand = 'all';
let matSearchQuery = '';
let matCurrentSort = 'name';
let matCurrentPage = 1;
const matPageSize = 12;

let taskSearchQuery = '';
let taskStatusFilter = 'all';
let taskGroupFilter = 'all';
let taskCurrentPage = 1;
const taskPageSize = 15;

let formSearchQuery = '';
let formGroupFilter = 'all';
let formCurrentPage = 1;
const formPageSize = 15;

let activeBOQItems = [];

// ==================== Initialize Dataset Hub Page ====================
export async function initDatasetHub() {
  setupTabSwitching();
  await loadDatasetSources();
  setupMaterialsUI();
  setupPMTasksUI();
  setupPMFormsUI();
  setupBOQCalculator();
}

// ==================== Load Data Sources ====================
async function loadDatasetSources() {
  try {
    // 1. Fetch Materials
    const matRes = await fetch('/api/dataset/materials?limit=600')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    if (matRes && matRes.data) {
      allMaterials = matRes.data;
    } else {
      // Direct static fallback
      const fallbackRes = await fetch('/data/materials.json');
      allMaterials = await fallbackRes.json();
    }

    // 2. Fetch Summary & Analytics
    const [summaryRes, analyticsRes] = await Promise.allSettled([
      fetch('/api/dataset/materials/summary').then(r => r.ok ? r.json() : fetch('/data/materials_summary.json').then(r => r.json())),
      fetch('/api/dataset/analytics').then(r => r.ok ? r.json() : fetch('/data/pm_analytics.json').then(r => r.json()))
    ]);

    if (summaryRes.status === 'fulfilled') materialsSummary = summaryRes.value;
    if (analyticsRes.status === 'fulfilled') pmAnalytics = analyticsRes.value;

    // 3. Fetch Tasks Sample / All
    const tasksRes = await fetch('/api/dataset/pm-tasks?limit=600')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    if (tasksRes && tasksRes.data) {
      allTasks = tasksRes.data;
    } else {
      const fallback = await fetch('/data/pm_tasks_sample.json');
      allTasks = await fallback.json();
    }

    // 4. Fetch Forms Sample / All
    const formsRes = await fetch('/api/dataset/pm-forms?limit=600')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    if (formsRes && formsRes.data) {
      allForms = formsRes.data;
    } else {
      const fallback = await fetch('/data/pm_forms_sample.json');
      allForms = await fallback.json();
    }

    console.log(`✅ Loaded dataset state: ${allMaterials.length} materials, ${allTasks.length} tasks, ${allForms.length} forms`);
  } catch (err) {
    console.error('Error loading dataset:', err);
    showToast('Could not load some dataset files. Using cached assets.', 'warning');
  }
}

// ==================== Tab Switching ====================
function setupTabSwitching() {
  const tabBtns = document.querySelectorAll('.dataset-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.dataset-tab-content').forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
      });

      const activeContent = document.getElementById(`tab-${tabId}`);
      if (activeContent) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active');
      }
    });
  });
}

// ==================== Materials UI Logic ====================
function setupMaterialsUI() {
  // Populate Brand Dropdown
  const brandSelect = document.getElementById('matBrandSelect');
  if (brandSelect && materialsSummary?.brands) {
    brandSelect.innerHTML = `<option value="all">All Brands (${materialsSummary.brands.length} Brands)</option>` +
      materialsSummary.brands.map(b => `<option value="${b}">${b}</option>`).join('');
  }

  // Populate Category Pills
  const catPillsContainer = document.getElementById('matCategoryPills');
  if (catPillsContainer && materialsSummary?.categoryBreakdown) {
    catPillsContainer.innerHTML = `
      <button class="cat-pill active" data-cat="all">All (${allMaterials.length})</button>
      ${materialsSummary.categoryBreakdown.map(c => `
        <button class="cat-pill" data-cat="${c.category}">${c.category} (${c.count})</button>
      `).join('')}
    `;

    catPillsContainer.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        catPillsContainer.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        matCurrentCategory = pill.getAttribute('data-cat');
        matCurrentPage = 1;
        renderMaterialsGrid();
      });
    });
  }

  // Search Input
  const searchInput = document.getElementById('matSearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        matSearchQuery = e.target.value.toLowerCase().trim();
        matCurrentPage = 1;
        renderMaterialsGrid();
      }, 250);
    });
  }

  // Brand Select
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      matCurrentBrand = e.target.value;
      matCurrentPage = 1;
      renderMaterialsGrid();
    });
  }

  // Sort Select
  const sortSelect = document.getElementById('matSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      matCurrentSort = e.target.value;
      renderMaterialsGrid();
    });
  }

  // Pagination buttons
  const prevBtn = document.getElementById('matPrevBtn');
  const nextBtn = document.getElementById('matNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (matCurrentPage > 1) {
        matCurrentPage--;
        renderMaterialsGrid();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredMaterials();
      const totalPages = Math.ceil(filtered.length / matPageSize) || 1;
      if (matCurrentPage < totalPages) {
        matCurrentPage++;
        renderMaterialsGrid();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
  }

  // Modal close handler
  const modal = document.getElementById('materialModal');
  const closeBtn = document.getElementById('closeMatModalBtn');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  renderMaterialsGrid();
}

function getFilteredMaterials() {
  let list = allMaterials.filter(m => {
    if (matSearchQuery) {
      const match = m.name.toLowerCase().includes(matSearchQuery) ||
                    m.brand.toLowerCase().includes(matSearchQuery) ||
                    m.category.toLowerCase().includes(matSearchQuery) ||
                    m.specification.toLowerCase().includes(matSearchQuery) ||
                    m.subCategory.toLowerCase().includes(matSearchQuery);
      if (!match) return false;
    }
    if (matCurrentCategory !== 'all' && m.category.toLowerCase() !== matCurrentCategory.toLowerCase()) {
      return false;
    }
    if (matCurrentBrand !== 'all' && m.brand.toLowerCase() !== matCurrentBrand.toLowerCase()) {
      return false;
    }
    return true;
  });

  if (matCurrentSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (matCurrentSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (matCurrentSort === 'rating') {
    list.sort((a, b) => (b.qualityRating + b.durabilityRating) - (a.qualityRating + a.durabilityRating));
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

function renderMaterialsGrid() {
  const grid = document.getElementById('materialsCardGrid');
  const countText = document.getElementById('matFilteredCountText');
  const pagination = document.getElementById('matPagination');
  const pageIndicator = document.getElementById('matPageIndicator');
  const prevBtn = document.getElementById('matPrevBtn');
  const nextBtn = document.getElementById('matNextBtn');

  if (!grid) return;

  const filtered = getFilteredMaterials();
  const total = filtered.length;
  const totalPages = Math.ceil(total / matPageSize) || 1;

  if (countText) {
    countText.textContent = `Showing ${total} of ${allMaterials.length} Materials`;
  }

  if (total === 0) {
    grid.innerHTML = `
      <div class="text-center" style="grid-column:1/-1;padding:48px 16px;background:rgba(15,23,42,0.5);border-radius:var(--radius-md);border:1px dashed var(--border)">
        <i class="fas fa-boxes-stacked" style="font-size:3rem;color:var(--text-muted);margin-bottom:12px"></i>
        <h3>No materials match your filters</h3>
        <p style="color:var(--text-secondary);margin-top:6px">Try clearing search terms or selecting 'All' categories.</p>
      </div>
    `;
    if (pagination) pagination.style.display = 'none';
    return;
  }

  const offset = (matCurrentPage - 1) * matPageSize;
  const pageItems = filtered.slice(offset, offset + matPageSize);

  grid.innerHTML = pageItems.map(m => `
    <div class="material-product-card">
      <div class="mat-card-img-wrap">
        <img src="${m.imageUrl}" alt="${m.name}" loading="lazy" class="mat-card-img" onerror="this.src='https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'">
        <span class="mat-badge-cat">${m.category}</span>
        <span class="mat-badge-brand">${m.brand}</span>
      </div>
      <div class="mat-card-body">
        <div class="mat-card-title" title="${m.name}">${m.name}</div>
        <div class="mat-card-spec">
          <span><i class="fas fa-certificate" style="color:var(--gold)"></i> ${m.specification || 'IS Standard'}</span>
          <span><i class="fas fa-box" style="color:var(--primary)"></i> ${m.packSize || m.unit}</span>
        </div>
        
        <div class="mat-price-row">
          <div>
            <div class="mat-price-val">₹ ${m.price.toLocaleString('en-IN')}</div>
            <div class="mat-price-sub">per ${m.unit} (Indicative)</div>
          </div>
          <div style="text-align:right">
            <div style="color:var(--gold);font-size:0.85rem">
              ${'★'.repeat(m.qualityRating)}${'☆'.repeat(Math.max(0, 5 - m.qualityRating))}
            </div>
            <span class="badge badge-outline" style="font-size:0.75rem;padding:2px 6px">Durability ${m.durabilityRating}/5</span>
          </div>
        </div>

        <div class="mat-card-actions">
          <button class="btn btn-outline btn-sm btn-mat-detail" data-id="${m.id}" style="flex:1">
            <i class="fas fa-circle-info"></i> Details
          </button>
          <button class="btn btn-primary btn-sm btn-mat-add" data-id="${m.id}" style="flex:1">
            <i class="fas fa-plus"></i> Add to BOQ
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach Card Click Handlers
  grid.querySelectorAll('.btn-mat-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = allMaterials.find(x => x.id === id);
      if (item) showMaterialModal(item);
    });
  });

  grid.querySelectorAll('.btn-mat-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = allMaterials.find(x => x.id === id);
      if (item) {
        showToast(`Added ${item.name} to Project BOQ!`, 'success');
      }
    });
  });

  // Update Pagination
  if (pagination) {
    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    if (pageIndicator) pageIndicator.textContent = `Page ${matCurrentPage} of ${totalPages} (${total} items)`;
    if (prevBtn) prevBtn.disabled = matCurrentPage <= 1;
    if (nextBtn) nextBtn.disabled = matCurrentPage >= totalPages;
  }
}

function showMaterialModal(m) {
  const modal = document.getElementById('materialModal');
  const body = document.getElementById('materialModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:18px">
      <img src="${m.imageUrl}" style="width:160px;height:140px;object-fit:cover;border-radius:var(--radius-md);border:1px solid var(--border)" alt="${m.name}">
      <div style="flex:1;min-width:220px">
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <span class="badge badge-primary">${m.category}</span>
          <span class="badge badge-accent">${m.brand}</span>
        </div>
        <h3 style="margin-bottom:6px;font-size:1.3rem">${m.name}</h3>
        <div style="font-size:1.4rem;font-weight:800;color:var(--gold);margin-bottom:4px">
          ₹ ${m.price.toLocaleString('en-IN')} <span style="font-size:0.85rem;color:var(--text-muted)">/ ${m.unit}</span>
        </div>
        <p style="font-size:0.8rem;color:var(--text-muted)">Reference Range: ₹${m.minPrice} – ₹${m.maxPrice}</p>
      </div>
    </div>

    <div class="grid grid-2" style="gap:12px;margin-bottom:18px;font-size:0.9rem">
      <div style="background:rgba(30,41,59,0.6);padding:10px 14px;border-radius:var(--radius-sm)">
        <strong>IS Specification:</strong> ${m.specification || 'IS 269 / Certified'}
      </div>
      <div style="background:rgba(30,41,59,0.6);padding:10px 14px;border-radius:var(--radius-sm)">
        <strong>Grade / Sub-Category:</strong> ${m.subCategory || m.grade || 'Standard'}
      </div>
      <div style="background:rgba(30,41,59,0.6);padding:10px 14px;border-radius:var(--radius-sm)">
        <strong>Pack / Size:</strong> ${m.packSize || m.size || 'Standard'}
      </div>
      <div style="background:rgba(30,41,59,0.6);padding:10px 14px;border-radius:var(--radius-sm)">
        <strong>Supplier Region:</strong> ${m.supplierLocation || 'India'}
      </div>
    </div>

    <div style="margin-bottom:14px">
      <h4 style="font-size:0.95rem;color:var(--primary);margin-bottom:4px"><i class="fas fa-hard-hat"></i> Recommended Application:</h4>
      <p style="font-size:0.85rem;color:var(--text-secondary)">${m.application || 'Residential, commercial, and structural applications.'}</p>
    </div>

    <div style="margin-bottom:18px">
      <h4 style="font-size:0.95rem;color:var(--success);margin-bottom:4px"><i class="fas fa-check-circle"></i> Key Advantages:</h4>
      <p style="font-size:0.85rem;color:var(--text-secondary)">${m.advantages || 'Tested high compressive strength and durability compliance.'}</p>
    </div>

    <div class="flex-between" style="border-top:1px solid var(--border);padding-top:14px">
      <a href="${m.productUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        <i class="fas fa-arrow-up-right-from-square"></i> Manufacturer Page
      </a>
      <button id="modalAddToBoqBtn" class="btn btn-accent btn-sm">
        <i class="fas fa-plus"></i> Add to Project Estimate
      </button>
    </div>
  `;

  document.getElementById('modalAddToBoqBtn')?.addEventListener('click', () => {
    showToast(`Added ${m.name} to Project Schedule`, 'success');
    modal.style.display = 'none';
  });

  modal.style.display = 'flex';
}

// ==================== PM Tasks UI Logic ====================
function setupPMTasksUI() {
  // Render KPI values from pmAnalytics if available
  if (pmAnalytics?.summary) {
    const s = pmAnalytics.summary;
    const totalEl = document.getElementById('kpiTotalTasks');
    const rateEl = document.getElementById('kpiResolutionRate');
    const safetyEl = document.getElementById('kpiSafetyObs');
    const overdueEl = document.getElementById('kpiOverdueTasks');

    if (totalEl) totalEl.textContent = s.totalTasks.toLocaleString();
    if (rateEl) rateEl.textContent = `${s.taskResolutionRate}%`;
    if (safetyEl) safetyEl.textContent = s.safetyObservations.toLocaleString();
    if (overdueEl) overdueEl.textContent = s.overdueTasks.toLocaleString();
  }

  // Render Task Groups Visual Bars
  const taskGroupBars = document.getElementById('taskGroupBars');
  if (taskGroupBars && pmAnalytics?.taskGroups) {
    const groups = Object.entries(pmAnalytics.taskGroups).sort((a, b) => b[1] - a[1]);
    const total = groups.reduce((acc, [, v]) => acc + v, 0) || 1;

    taskGroupBars.innerHTML = groups.map(([grp, count]) => {
      const pct = ((count / total) * 100).toFixed(1);
      let color = 'var(--primary)';
      if (grp === 'Safety') color = 'var(--gold)';
      else if (grp === 'Quality') color = 'var(--success)';
      else if (grp === 'Site Management') color = 'var(--accent)';

      return `
        <div>
          <div class="flex-between" style="font-size:0.85rem;margin-bottom:4px">
            <span><strong>${grp}</strong></span>
            <span style="color:var(--text-muted)">${count.toLocaleString()} tasks (${pct}%)</span>
          </div>
          <div style="height:8px;background:rgba(255,255,255,0.08);border-radius:var(--radius-full);overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${color};border-radius:var(--radius-full);transition:width 0.6s ease"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Top Causes
  const taskCauseList = document.getElementById('taskCauseList');
  if (taskCauseList && pmAnalytics?.topCauses) {
    taskCauseList.innerHTML = pmAnalytics.topCauses.slice(0, 5).map(c => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(30,41,59,0.5);border-radius:var(--radius-sm);font-size:0.85rem;border-left:3px solid var(--warning)">
        <span style="font-weight:600;color:var(--text-primary)">${c.cause}</span>
        <span class="badge badge-outline" style="font-size:0.8rem">${c.count.toLocaleString()} cases (${c.percentage}%)</span>
      </div>
    `).join('');
  }

  // Filter Event Listeners
  const searchInput = document.getElementById('taskSearchInput');
  const statusFilter = document.getElementById('taskStatusFilter');
  const groupFilter = document.getElementById('taskGroupFilter');

  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        taskSearchQuery = e.target.value.toLowerCase().trim();
        taskCurrentPage = 1;
        renderTasksTable();
      }, 250);
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      taskStatusFilter = e.target.value;
      taskCurrentPage = 1;
      renderTasksTable();
    });
  }

  if (groupFilter) {
    groupFilter.addEventListener('change', (e) => {
      taskGroupFilter = e.target.value;
      taskCurrentPage = 1;
      renderTasksTable();
    });
  }

  // Task Pagination
  const prevBtn = document.getElementById('taskPrevBtn');
  const nextBtn = document.getElementById('taskNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (taskCurrentPage > 1) {
        taskCurrentPage--;
        renderTasksTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredTasks();
      const totalPages = Math.ceil(filtered.length / taskPageSize) || 1;
      if (taskCurrentPage < totalPages) {
        taskCurrentPage++;
        renderTasksTable();
      }
    });
  }

  renderTasksTable();
}

function getFilteredTasks() {
  return allTasks.filter(t => {
    if (taskSearchQuery) {
      const match = t.ref.toLowerCase().includes(taskSearchQuery) ||
                    t.description.toLowerCase().includes(taskSearchQuery) ||
                    t.location.toLowerCase().includes(taskSearchQuery) ||
                    t.cause.toLowerCase().includes(taskSearchQuery);
      if (!match) return false;
    }
    if (taskStatusFilter !== 'all' && t.status.toLowerCase() !== taskStatusFilter.toLowerCase()) {
      return false;
    }
    if (taskGroupFilter !== 'all' && t.taskGroup.toLowerCase() !== taskGroupFilter.toLowerCase()) {
      return false;
    }
    return true;
  });
}

function renderTasksTable() {
  const tbody = document.getElementById('pmTasksTableBody');
  const pageIndicator = document.getElementById('taskPageIndicator');
  const prevBtn = document.getElementById('taskPrevBtn');
  const nextBtn = document.getElementById('taskNextBtn');

  if (!tbody) return;

  const filtered = getFilteredTasks();
  const total = filtered.length;
  const totalPages = Math.ceil(total / taskPageSize) || 1;
  const offset = (taskCurrentPage - 1) * taskPageSize;
  const pageItems = filtered.slice(offset, offset + taskPageSize);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px;color:var(--text-muted)">No matching PM tasks found.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(t => {
    let statusBadge = '<span class="badge badge-outline">Closed</span>';
    if (t.status === 'Open' || t.status.includes('Ongoing')) statusBadge = '<span class="badge badge-warning">Open</span>';
    else if (t.status.includes('EHS Good') || t.status.includes('Complete')) statusBadge = '<span class="badge badge-success">Verified</span>';
    else if (t.isOverdue) statusBadge = '<span class="badge badge-danger">Overdue</span>';

    return `
      <tr>
        <td><strong>${t.ref}</strong></td>
        <td>${statusBadge}</td>
        <td><span class="badge badge-primary" style="font-size:0.75rem">${t.taskGroup}</span></td>
        <td>${t.priority || 'Normal'}</td>
        <td style="color:var(--warning);font-size:0.8rem">${t.cause ? t.cause.replace('JPC - ', '') : '—'}</td>
        <td style="max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.description}">${t.description}</td>
        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-dim)" title="${t.location}">${t.location}</td>
      </tr>
    `;
  }).join('');

  if (pageIndicator) pageIndicator.textContent = `Page ${taskCurrentPage} of ${totalPages} (${total} tasks)`;
  if (prevBtn) prevBtn.disabled = taskCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = taskCurrentPage >= totalPages;
}

// ==================== PM Forms UI Logic ====================
function setupPMFormsUI() {
  const searchInput = document.getElementById('formSearchInput');
  const groupFilter = document.getElementById('formGroupFilter');

  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        formSearchQuery = e.target.value.toLowerCase().trim();
        formCurrentPage = 1;
        renderFormsTable();
      }, 250);
    });
  }

  if (groupFilter) {
    groupFilter.addEventListener('change', (e) => {
      formGroupFilter = e.target.value;
      formCurrentPage = 1;
      renderFormsTable();
    });
  }

  const prevBtn = document.getElementById('formPrevBtn');
  const nextBtn = document.getElementById('formNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (formCurrentPage > 1) {
        formCurrentPage--;
        renderFormsTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredForms();
      const totalPages = Math.ceil(filtered.length / formPageSize) || 1;
      if (formCurrentPage < totalPages) {
        formCurrentPage++;
        renderFormsTable();
      }
    });
  }

  renderFormsTable();
}

function getFilteredForms() {
  return allForms.filter(f => {
    if (formSearchQuery) {
      const match = f.ref.toLowerCase().includes(formSearchQuery) ||
                    f.name.toLowerCase().includes(formSearchQuery) ||
                    f.location.toLowerCase().includes(formSearchQuery);
      if (!match) return false;
    }
    if (formGroupFilter !== 'all' && f.formGroup.toLowerCase() !== formGroupFilter.toLowerCase()) {
      return false;
    }
    return true;
  });
}

function renderFormsTable() {
  const tbody = document.getElementById('pmFormsTableBody');
  const pageIndicator = document.getElementById('formPageIndicator');
  const prevBtn = document.getElementById('formPrevBtn');
  const nextBtn = document.getElementById('formNextBtn');

  if (!tbody) return;

  const filtered = getFilteredForms();
  const total = filtered.length;
  const totalPages = Math.ceil(total / formPageSize) || 1;
  const offset = (formCurrentPage - 1) * formPageSize;
  const pageItems = filtered.slice(offset, offset + formPageSize);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px;color:var(--text-muted)">No matching PM forms found.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(f => `
    <tr>
      <td><strong>${f.ref}</strong></td>
      <td><span class="badge ${f.status.includes('Open') ? 'badge-warning' : 'badge-success'}">${f.status}</span></td>
      <td style="max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${f.name}">${f.name}</td>
      <td>${f.type}</td>
      <td><span class="badge badge-primary" style="font-size:0.75rem">${f.formGroup}</span></td>
      <td><strong>${f.openActions}</strong> / ${f.totalActions}</td>
      <td style="color:var(--text-muted)">${f.created}</td>
    </tr>
  `).join('');

  if (pageIndicator) pageIndicator.textContent = `Page ${formCurrentPage} of ${totalPages} (${total} forms)`;
  if (prevBtn) prevBtn.disabled = formCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = formCurrentPage >= totalPages;
}

// ==================== Smart BOQ Calculator Logic ====================
function setupBOQCalculator() {
  const form = document.getElementById('boqCalculatorForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    computeBOQ();
  });

  const exportBtn = document.getElementById('boqExportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportBOQCsv);
  }

  const printBtn = document.getElementById('boqPrintBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => { window.print(); });
  }

  // Initial computation
  computeBOQ();
}

function computeBOQ() {
  const areaInput = document.getElementById('boqArea');
  const gradeInput = document.getElementById('boqGrade');
  const area = parseFloat(areaInput?.value) || 1800;
  const grade = gradeInput?.value || 'premium';

  // Civil Engineering Empirical Thumb Rules
  const cementBags = Math.round(area * 0.45);
  const steelTons = parseFloat((area * 0.0038).toFixed(2));
  const bricksUnits = Math.round(area * 8.5);
  const sandCuFt = Math.round(area * 1.8);
  const aggregateCuFt = Math.round(area * 1.35);
  const paintLiters = Math.round(area * 0.18);
  const tilesSqFt = Math.round(area * 0.82);

  // Cross-reference live items from our 570 materials catalog!
  const cementItem = allMaterials.find(m => m.category === 'Cement' && (grade === 'luxury' ? m.brand === 'UltraTech' : true)) || { name: 'UltraTech OPC 53 Standard', price: 420, brand: 'UltraTech' };
  const steelItem = allMaterials.find(m => m.category === 'Steel') || { name: 'Tata Tiscon 500D TMT', price: 68000, brand: 'Tata Tiscon' };
  const bricksItem = allMaterials.find(m => m.category === 'Bricks & Blocks') || { name: 'Red Clay Kiln Bricks', price: 9.5, brand: 'Standard' };
  const sandItem = allMaterials.find(m => m.category === 'Sand') || { name: 'River Sand / M-Sand', price: 62, brand: 'M-Sand Certified' };
  const aggregateItem = allMaterials.find(m => m.category === 'Aggregate') || { name: '20mm Blue Metal Stone', price: 48, brand: 'Standard' };
  const paintItem = allMaterials.find(m => m.category === 'Paint') || { name: 'Asian Paints Apex Weatherproof', price: 340, brand: 'Asian Paints' };
  const tilesItem = allMaterials.find(m => m.category === 'Tiles') || { name: 'Kajaria Vitrified Floor Tiles', price: 85, brand: 'Kajaria' };

  // Calculate Subtotals
  const cementCost = Math.round(cementBags * cementItem.price);
  const steelCost = Math.round(steelTons * 65000); // TMT per ton
  const bricksCost = Math.round(bricksUnits * (bricksItem.price > 100 ? 9.5 : bricksItem.price));
  const sandCost = Math.round(sandCuFt * 58);
  const aggregateCost = Math.round(aggregateCuFt * 45);
  const paintCost = Math.round(paintLiters * (paintItem.price > 1000 ? 340 : paintItem.price));
  const tilesCost = Math.round(tilesSqFt * (tilesItem.price > 500 ? 82 : tilesItem.price));

  activeBOQItems = [
    { item: 'Cement (OPC 53 Bags)', qty: `${cementBags.toLocaleString()} bags`, brand: cementItem.name, subtotal: cementCost },
    { item: 'Structural Steel (TMT)', qty: `${steelTons} Metric Tons`, brand: steelItem.name, subtotal: steelCost },
    { item: 'Bricks / AAC Blocks', qty: `${bricksUnits.toLocaleString()} units`, brand: bricksItem.name, subtotal: bricksCost },
    { item: 'River Sand / M-Sand', qty: `${sandCuFt.toLocaleString()} cu.ft`, brand: sandItem.name, subtotal: sandCost },
    { item: 'Coarse Aggregate (20mm)', qty: `${aggregateCuFt.toLocaleString()} cu.ft`, brand: aggregateItem.name, subtotal: aggregateCost },
    { item: 'Interior & Exterior Paint', qty: `${paintLiters.toLocaleString()} Liters`, brand: paintItem.name, subtotal: paintCost },
    { item: 'Vitrified Flooring Tiles', qty: `${tilesSqFt.toLocaleString()} sq.ft`, brand: tilesItem.name, subtotal: tilesCost }
  ];

  const totalCost = activeBOQItems.reduce((acc, c) => acc + c.subtotal, 0);
  const perSqFt = Math.round(totalCost / area);

  // Update UI Elements
  const totalCostEl = document.getElementById('boqTotalCost');
  const perSqFtEl = document.getElementById('boqPerSqFt');
  const badgeEl = document.getElementById('boqGradeBadge');
  const tableBody = document.getElementById('boqItemsTableBody');

  if (totalCostEl) totalCostEl.textContent = `₹ ${totalCost.toLocaleString('en-IN')}`;
  if (perSqFtEl) perSqFtEl.textContent = `₹ ${perSqFt.toLocaleString('en-IN')} / sq.ft`;
  if (badgeEl) badgeEl.textContent = `${grade.toUpperCase()} Grade`;

  if (tableBody) {
    tableBody.innerHTML = activeBOQItems.map(row => `
      <tr>
        <td><strong>${row.item}</strong></td>
        <td>${row.qty}</td>
        <td style="color:var(--primary)">${row.brand}</td>
        <td style="font-weight:700;color:var(--gold)">₹ ${row.subtotal.toLocaleString('en-IN')}</td>
      </tr>
    `).join('');
  }
}

function exportBOQCsv() {
  if (activeBOQItems.length === 0) return;
  const headers = ['Material Item', 'Calculated Quantity', 'Recommended Brand', 'Subtotal (INR)'];
  const rows = activeBOQItems.map(r => `"${r.item}","${r.qty}","${r.brand}",${r.subtotal}`);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Forzex_Construction_BOQ_Estimate.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('BOQ CSV Schedule downloaded successfully!', 'success');
}
