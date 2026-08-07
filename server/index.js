import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ==================== API ROUTES ====================

  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Health Check
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'ok', service: 'Forzex Construction API', timestamp: new Date().toISOString() }));
    }

    // Auth Routes
    if (pathname === '/api/auth/admin/login' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, role: 'admin', message: 'Admin authenticated successfully' }));
    }

    if (pathname === '/api/auth/client/login' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, role: 'client', message: 'Client authenticated successfully' }));
    }

    if (pathname === '/api/auth/client/register' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, message: 'Client registration completed' }));
    }

    // Projects Routes
    if (pathname === '/api/projects' && req.method === 'GET') {
      res.writeHead(200);
      return res.end(JSON.stringify([
        { id: '1', name: 'Skyline Office Complex', status: 'completed', location: 'Dubai, UAE', budget: 5200000 },
        { id: '2', name: 'Harbor Residential Village', status: 'in-progress', location: 'Nairobi, Kenya', budget: 8500000 },
        { id: '3', name: 'Industrial Logistics Park', status: 'planning', location: 'Addis Ababa, Ethiopia', budget: 15000000 }
      ]));
    }

    if (pathname === '/api/projects' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, id: Date.now().toString(36), message: 'Project created successfully' }));
    }

    // AI Routes
    if (pathname === '/api/ai/analyze' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        safety: [{ label: 'Hard hats', status: 'pass' }, { label: 'Scaffolding', status: 'warning' }],
        objects: ['Crane', 'Excavator', 'Concrete Mixer', 'Steel Beams', 'Workers'],
        progress: { phase: 'Structure', completion: 45 },
        note: 'AI Site Vision Analysis Complete'
      }));
    }

    if (pathname === '/api/ai/estimate' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        breakdown: [
          { category: 'Foundation', cost: 85000 },
          { category: 'Structure', cost: 120000 },
          { category: 'Electrical & Plumbing', cost: 65000 },
          { category: 'Finishing', cost: 45000 },
          { category: 'Labor & Overhead', cost: 95000 }
        ],
        total: 410000,
        note: 'AI Cost Breakdown Generated'
      }));
    }

    if (pathname === '/api/ai/recommend' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        products: [
          { name: 'Portland Cement', spec: 'Grade 53 OPC', price: '$8/bag' },
          { name: 'TMT Steel Bars', spec: 'Fe-500', price: '$650/ton' },
          { name: 'Ready-Mix Concrete', spec: 'M25', price: '$95/m³' },
          { name: 'AAC Blocks', spec: 'Lightweight', price: '$0.65/unit' }
        ]
      }));
    }

    if (pathname === '/api/ai/report' && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, reportUrl: '#', note: 'Project Report Generated' }));
    }

    // Contact & Feedback
    if ((pathname === '/api/contact' || pathname === '/api/feedback') && req.method === 'POST') {
      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, message: 'Received successfully' }));
    }

    // Default API 404
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }

  // ==================== STATIC FILE & PWA FRONTEND ROUTING ====================

  let filePath = path.join(ROOT_DIR, pathname);

  // Check if requested file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Check in public directory if requested file exists there
  const publicFilePath = path.join(ROOT_DIR, 'public', pathname);
  if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
    const ext = path.extname(publicFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(publicFilePath).pipe(res);
    return;
  }

  // SPA Fallback: Serve index.html for all client routes
  const indexFile = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexFile).pipe(res);
  } else {
    res.writeHead(404);
    res.end('404 — Index file not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Forzex Construction PWA Server live at: http://localhost:${PORT}`);
  console.log(`🌐 API Endpoints active at: http://localhost:${PORT}/api/health\n`);
});
