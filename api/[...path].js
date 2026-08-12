const PROJECTS = [
  { id: '1', name: 'Skyline Office Complex', status: 'completed', location: 'Dubai, UAE', budget: 5200000 },
  { id: '2', name: 'Harbor Residential Village', status: 'in-progress', location: 'Nairobi, Kenya', budget: 8500000 },
  { id: '3', name: 'Industrial Logistics Park', status: 'planning', location: 'Addis Ababa, Ethiopia', budget: 15000000 }
];

function json(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let pathname;
  try {
    pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {
    pathname = req.url || '/';
  }

  // On Vercel the catch-all function receives the path relative to the /api
  // mount point (e.g. /health), while the local server uses /api/health.
  // Normalize both forms so the route handling below stays identical.
  if (!pathname.startsWith('/api')) {
    pathname = pathname.startsWith('/') ? `/api${pathname}` : `/api/${pathname}`;
  }

  if (pathname === '/api/health' && req.method === 'GET') {
    return json(res, 200, { status: 'ok', service: 'Forzex Construction API', timestamp: new Date().toISOString() });
  }

  if (pathname === '/api/auth/admin/login' && req.method === 'POST') {
    return json(res, 200, { success: true, role: 'admin', message: 'Admin authenticated successfully' });
  }

  if (pathname === '/api/auth/client/login' && req.method === 'POST') {
    return json(res, 200, { success: true, role: 'client', message: 'Client authenticated successfully' });
  }

  if (pathname === '/api/auth/client/register' && req.method === 'POST') {
    return json(res, 200, { success: true, message: 'Client registration completed' });
  }

  if (pathname === '/api/projects' && req.method === 'GET') {
    return json(res, 200, PROJECTS);
  }

  if (pathname === '/api/projects' && req.method === 'POST') {
    return json(res, 200, { success: true, id: Date.now().toString(36), message: 'Project created successfully' });
  }

  if (pathname === '/api/ai/analyze' && req.method === 'POST') {
    return json(res, 200, {
      safety: [{ label: 'Hard hats', status: 'pass' }, { label: 'Scaffolding', status: 'warning' }],
      objects: ['Crane', 'Excavator', 'Concrete Mixer', 'Steel Beams', 'Workers'],
      progress: { phase: 'Structure', completion: 45 },
      note: 'AI Site Vision Analysis Complete'
    });
  }

  if (pathname === '/api/ai/estimate' && req.method === 'POST') {
    return json(res, 200, {
      breakdown: [
        { category: 'Foundation', cost: 85000 },
        { category: 'Structure', cost: 120000 },
        { category: 'Electrical & Plumbing', cost: 65000 },
        { category: 'Finishing', cost: 45000 },
        { category: 'Labor & Overhead', cost: 95000 }
      ],
      total: 410000,
      note: 'AI Cost Breakdown Generated'
    });
  }

  if (pathname === '/api/ai/recommend' && req.method === 'POST') {
    return json(res, 200, {
      products: [
        { name: 'Portland Cement', spec: 'Grade 53 OPC', price: '$8/bag' },
        { name: 'TMT Steel Bars', spec: 'Fe-500', price: '$650/ton' },
        { name: 'Ready-Mix Concrete', spec: 'M25', price: '$95/m³' },
        { name: 'AAC Blocks', spec: 'Lightweight', price: '$0.65/unit' }
      ]
    });
  }

  if (pathname === '/api/ai/report' && req.method === 'POST') {
    return json(res, 200, { success: true, reportUrl: '#', note: 'Project Report Generated' });
  }

  if ((pathname === '/api/contact' || pathname === '/api/feedback') && req.method === 'POST') {
    return json(res, 200, { success: true, message: 'Received successfully' });
  }

  return json(res, 404, { error: 'API endpoint not found' });
}