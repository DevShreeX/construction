const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const datasetDir = path.join(baseDir, 'dataset');
const publicDataDir = path.join(baseDir, 'public', 'data');

if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  function parseLine(line) {
    const row = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    row.push(cur.trim());
    return row;
  }

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length >= 2) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = vals[idx] !== undefined ? vals[idx] : '';
      });
      rows.push(obj);
    }
  }
  return { headers, rows };
}

console.log('--- Processing Construction Materials ---');
const rawMaterials = JSON.parse(fs.readFileSync(path.join(datasetDir, 'construction_materials_600.json'), 'utf8'));

// Enrich & sanitize materials
const materials = rawMaterials.map(m => ({
  id: m.Material_ID,
  category: m.Category || 'General',
  subCategory: m.Sub_Category || '',
  brand: m.Brand || 'Standard',
  name: m.Product_Name || `${m.Brand} ${m.Sub_Category || m.Category}`,
  imageUrl: m.Image_URL || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80',
  productUrl: m.Product_Page_URL || '#',
  specification: m.Specification || m.Grade || 'Standard',
  grade: m.Grade || '',
  size: m.Size || 'Standard',
  thickness: m.Thickness || '',
  colour: m.Colour || '',
  unit: m.Unit || 'Unit',
  packSize: m.Pack_Size || 'Standard',
  price: Number(m.Price_INR) || 0,
  minPrice: Number(m.Min_Price_INR) || Number(m.Price_INR) || 0,
  maxPrice: Number(m.Max_Price_INR) || Number(m.Price_INR) || 0,
  qualityRating: Number(m.Quality_Rating) || 4,
  durabilityRating: Number(m.Durability_Rating) || 4,
  application: m.Application || 'General Construction',
  advantages: m.Advantages || 'Tested for durability',
  disadvantages: m.Disadvantages || 'Verify supplier availability',
  availability: m.Availability || 'Available in India',
  supplierLocation: m.Supplier_Location || 'India',
  priceType: m.Price_Type || 'Reference Market Rate',
  updatedDate: m.Updated_Date || '2026-09-16'
}));

const categories = [...new Set(materials.map(m => m.category))].sort();
const brands = [...new Set(materials.map(m => m.brand))].sort();

const materialsSummary = {
  total: materials.length,
  categoriesCount: categories.length,
  brandsCount: brands.length,
  categories,
  brands,
  priceRange: {
    min: Math.min(...materials.map(m => m.price)),
    max: Math.max(...materials.map(m => m.price))
  },
  categoryBreakdown: categories.map(cat => {
    const catItems = materials.filter(m => m.category === cat);
    return {
      category: cat,
      count: catItems.length,
      avgPrice: Math.round(catItems.reduce((acc, c) => acc + c.price, 0) / catItems.length),
      brands: [...new Set(catItems.map(c => c.brand))]
    };
  })
};

fs.writeFileSync(path.join(publicDataDir, 'materials.json'), JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'materials_summary.json'), JSON.stringify(materialsSummary, null, 2));
console.log(`Saved ${materials.length} materials & summary to public/data.`);

console.log('--- Processing PM Tasks CSV ---');
const tasksContent = fs.readFileSync(path.join(datasetDir, 'Construction_Data_PM_Tasks_All_Projects.csv'), 'utf8');
const { rows: rawTasks } = parseCSV(tasksContent);

const taskStatusCounts = {};
const taskGroupCounts = {};
const taskPriorityCounts = {};
const taskCauseCounts = {};
const projectCounts = {};
let overdueTasksCount = 0;
let imageTasksCount = 0;

const sanitizedTasks = rawTasks.map((t, idx) => {
  const status = t.Status || 'Open';
  const group = t['Task Group'] || 'General';
  const priority = t.Priority || 'Normal';
  const cause = t.Cause || '';
  const proj = t.project || 'Project 1328';
  const isOverdue = String(t.OverDue).toLowerCase() === 'true';
  const hasImages = String(t.Images).toLowerCase() === 'true';

  taskStatusCounts[status] = (taskStatusCounts[status] || 0) + 1;
  taskGroupCounts[group] = (taskGroupCounts[group] || 0) + 1;
  taskPriorityCounts[priority] = (taskPriorityCounts[priority] || 0) + 1;
  if (cause) taskCauseCounts[cause] = (taskCauseCounts[cause] || 0) + 1;
  if (proj) projectCounts[proj] = (projectCounts[proj] || 0) + 1;
  if (isOverdue) overdueTasksCount++;
  if (hasImages) imageTasksCount++;

  return {
    id: t.Ref || `T-${idx + 1}`,
    ref: t.Ref,
    status,
    location: t.Location || 'Site General Area',
    description: t.Description || 'Inspection task',
    created: t.Created || '14/09/2020',
    type: t.Type || 'Inspection',
    package: t['To Package'] || 'General Contractor',
    priority,
    cause,
    project: proj,
    taskGroup: group,
    isOverdue,
    hasImages
  };
});

console.log('--- Processing PM Forms CSV ---');
const formsContent = fs.readFileSync(path.join(datasetDir, 'Construction_Data_PM_Forms_All_Projects.csv'), 'utf8');
const { rows: rawForms } = parseCSV(formsContent);

const formStatusCounts = {};
const formGroupCounts = {};
const formTypeCounts = {};
let openActionsTotal = 0;
let totalActionsSum = 0;

const sanitizedForms = rawForms.map((f, idx) => {
  const status = f.Status || 'Open';
  const group = f['Report Forms Group'] || 'Site Management';
  const type = f.Type || 'Inspection';
  const openActions = parseInt(f['Open Actions'], 10) || 0;
  const totalActions = parseInt(f['Total Actions'], 10) || 0;

  formStatusCounts[status] = (formStatusCounts[status] || 0) + 1;
  formGroupCounts[group] = (formGroupCounts[group] || 0) + 1;
  formTypeCounts[type] = (formTypeCounts[type] || 0) + 1;
  openActionsTotal += openActions;
  totalActionsSum += totalActions;

  return {
    id: f.Ref || `F-${idx + 1}`,
    ref: f.Ref,
    status,
    location: f.Location || 'Site General Area',
    name: f.Name || 'Daily Report / Form',
    created: f.Created || '15/09/2020',
    type,
    openActions,
    totalActions,
    project: f.Project || 'Project 1328',
    formGroup: group,
    reportStatus: f['Report Forms Status'] || status
  };
});

// Calculate Top Causes
const topCauses = Object.entries(taskCauseCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([cause, count]) => ({
    cause: cause.replace('JPC - ', ''),
    count,
    percentage: ((count / sanitizedTasks.length) * 100).toFixed(1)
  }));

const pmAnalytics = {
  summary: {
    totalTasks: sanitizedTasks.length,
    totalForms: sanitizedForms.length,
    totalActions: totalActionsSum,
    openActions: openActionsTotal,
    overdueTasks: overdueTasksCount,
    taskResolutionRate: (((sanitizedTasks.length - overdueTasksCount) / sanitizedTasks.length) * 100).toFixed(1),
    safetyObservations: sanitizedTasks.filter(t => t.status === 'EHS Good Observation').length,
    closedTasks: sanitizedTasks.filter(t => t.status.toLowerCase().includes('closed') || t.status === 'Complete').length,
    openTasks: sanitizedTasks.filter(t => t.status.toLowerCase().includes('open')).length
  },
  taskGroups: taskGroupCounts,
  formGroups: formGroupCounts,
  formTypes: formTypeCounts,
  topCauses,
  projects: projectCounts
};

// Write analytics
fs.writeFileSync(path.join(publicDataDir, 'pm_analytics.json'), JSON.stringify(pmAnalytics, null, 2));

// For fast interactive UI loading, save sample subsets for immediate instant search & preview (e.g. 500 tasks & 500 forms)
// while full arrays are queryable via server API or full data loader
fs.writeFileSync(path.join(publicDataDir, 'pm_tasks_sample.json'), JSON.stringify(sanitizedTasks.slice(0, 600), null, 2));
fs.writeFileSync(path.join(publicDataDir, 'pm_forms_sample.json'), JSON.stringify(sanitizedForms.slice(0, 600), null, 2));

// Also write full index for local API server
fs.writeFileSync(path.join(publicDataDir, 'pm_tasks_all.json'), JSON.stringify(sanitizedTasks));
fs.writeFileSync(path.join(publicDataDir, 'pm_forms_all.json'), JSON.stringify(sanitizedForms));

console.log(`✅ Pre-indexing complete!
  - Materials: ${materials.length} items
  - PM Tasks: ${sanitizedTasks.length} items
  - PM Forms: ${sanitizedForms.length} items
  - PM Analytics JSON generated.`);
