export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const url = req.url || '';
  const pathname = url.split('?')[0];

  // Health Check
  if (pathname.endsWith('/health') || pathname === '/api/health') {
    return res.status(200).json({
      status: 'ok',
      service: 'Forzex Construction API',
      timestamp: new Date().toISOString()
    });
  }

  // Auth Routes
  if (pathname.includes('/auth/admin/login')) {
    return res.status(200).json({ success: true, role: 'admin', message: 'Admin authenticated successfully' });
  }
  if (pathname.includes('/auth/client/login')) {
    return res.status(200).json({ success: true, role: 'client', message: 'Client authenticated successfully' });
  }
  if (pathname.includes('/auth/client/register')) {
    return res.status(200).json({ success: true, message: 'Client registration completed' });
  }

  // Projects Routes
  if (pathname.endsWith('/projects') || pathname === '/api/projects') {
    if (req.method === 'GET') {
      return res.status(200).json([
        { id: '1', name: 'Skyline Office Complex', status: 'completed', location: 'Dubai, UAE', budget: 5200000 },
        { id: '2', name: 'Harbor Residential Village', status: 'in-progress', location: 'Nairobi, Kenya', budget: 8500000 },
        { id: '3', name: 'Industrial Logistics Park', status: 'planning', location: 'Addis Ababa, Ethiopia', budget: 15000000 }
      ]);
    }
    if (req.method === 'POST') {
      return res.status(200).json({ success: true, id: Date.now().toString(36), message: 'Project created successfully' });
    }
  }

  // AI Routes
  if (pathname.includes('/ai/analyze')) {
    return res.status(200).json({
      safety: [{ label: 'Hard hats', status: 'pass' }, { label: 'Scaffolding', status: 'warning' }],
      objects: ['Crane', 'Excavator', 'Concrete Mixer', 'Steel Beams', 'Workers'],
      progress: { phase: 'Structure', completion: 45 },
      note: 'AI Site Vision Analysis Complete'
    });
  }

  if (pathname.includes('/ai/estimate')) {
    return res.status(200).json({
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

  if (pathname.includes('/ai/recommend')) {
    return res.status(200).json({
      products: [
        { name: 'Portland Cement', spec: 'Grade 53 OPC', price: '$8/bag' },
        { name: 'TMT Steel Bars', spec: 'Fe-500', price: '$650/ton' },
        { name: 'Ready-Mix Concrete', spec: 'M25', price: '$95/m³' },
        { name: 'AAC Blocks', spec: 'Lightweight', price: '$0.65/unit' }
      ]
    });
  }

  if (pathname.includes('/ai/report')) {
    return res.status(200).json({ success: true, reportUrl: '#', note: 'Project Report Generated' });
  }

  // Contact & Feedback
  if (pathname.includes('/contact') || pathname.includes('/feedback')) {
    return res.status(200).json({ success: true, message: 'Received successfully' });
  }

  return res.status(404).json({ error: 'API endpoint not found' });
}