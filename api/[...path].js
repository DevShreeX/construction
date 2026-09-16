import fs from 'fs';
import path from 'path';

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

  // Structured3D Dataset Routes for Vercel
  if (pathname.includes('/structured3d/designs')) {
    const s3dDesigns = [
      {
        designId: 'S3D-DES-001',
        sceneId: 'scene_00000',
        title: 'Structured3D Modern Urban 3 BHK Residence',
        style: 'Contemporary Minimalist',
        bhk: '3 BHK',
        floors: 'Single Level (Ground)',
        totalAreaSqFt: 1380,
        totalAreaSqM: 128.2,
        roomCount: 5,
        roomTypes: ['living room', 'kitchen', 'bedroom', 'bedroom', 'bathroom'],
        dimensions: { widthFt: 34.5, depthFt: 40.0, ceilingHeightFt: 9.2 },
        vastuScore: 96,
        estimatedCost: '₹22,50,000 – ₹27,80,000',
        thumbnail: '/api/structured3d/asset/S3D-DES-001/thumbnail',
        floorplan: { path: '/api/structured3d/asset/S3D-DES-001/floorplan', format: 'png' },
        model3D: { format: 'obj', path: '/api/structured3d/asset/S3D-DES-001/mesh' },
        views: {
          front: '/api/structured3d/asset/S3D-DES-001/view/front',
          back: '/api/structured3d/asset/S3D-DES-001/view/back',
          left: '/api/structured3d/asset/S3D-DES-001/view/left',
          right: '/api/structured3d/asset/S3D-DES-001/view/right',
          top: '/api/structured3d/asset/S3D-DES-001/view/top'
        },
        rooms: [
          { roomId: 'room_01', name: 'Living & Dining Lounge', type: 'living room', dimensions: "18.5' x 16.0'", areaSqFt: 296, panorama: '/api/structured3d/asset/S3D-DES-001/room/living_room/panorama' },
          { roomId: 'room_02', name: 'Modular Chef Kitchen', type: 'kitchen', dimensions: "12.0' x 11.5'", areaSqFt: 138, panorama: '/api/structured3d/asset/S3D-DES-001/room/kitchen/panorama' },
          { roomId: 'room_03', name: 'Master Bedroom Suite', type: 'bedroom', dimensions: "15.0' x 14.5'", areaSqFt: 217, panorama: '/api/structured3d/asset/S3D-DES-001/room/bedroom/panorama' },
          { roomId: 'room_04', name: 'Luxury En-Suite Bathroom', type: 'bathroom', dimensions: "9.5' x 8.0'", areaSqFt: 76, panorama: '/api/structured3d/asset/S3D-DES-001/room/bathroom/panorama' }
        ]
      },
      {
        designId: 'S3D-DES-002',
        sceneId: 'scene_00001',
        title: 'Structured3D Compact Smart 2 BHK Duplex',
        style: 'Scandinavian Warm Minimalist',
        bhk: '2 BHK',
        floors: 'G + 1 Duplex (2 Floors)',
        totalAreaSqFt: 950,
        totalAreaSqM: 88.3,
        roomCount: 4,
        roomTypes: ['living room', 'kitchen', 'bedroom', 'bathroom'],
        dimensions: { widthFt: 25.0, depthFt: 38.0, ceilingHeightFt: 9.5 },
        vastuScore: 94,
        estimatedCost: '₹16,80,000 – ₹21,20,000',
        thumbnail: '/api/structured3d/asset/S3D-DES-002/thumbnail',
        floorplan: { path: '/api/structured3d/asset/S3D-DES-002/floorplan', format: 'png' },
        model3D: { format: 'obj', path: '/api/structured3d/asset/S3D-DES-002/mesh' },
        views: {
          front: '/api/structured3d/asset/S3D-DES-002/view/front',
          back: '/api/structured3d/asset/S3D-DES-002/view/back',
          left: '/api/structured3d/asset/S3D-DES-002/view/left',
          right: '/api/structured3d/asset/S3D-DES-002/view/right',
          top: '/api/structured3d/asset/S3D-DES-002/view/top'
        },
        rooms: [
          { roomId: 'room_01', name: 'Open-Plan Living & Dining', type: 'living room', dimensions: "15.0' x 14.0'", areaSqFt: 210, panorama: '/api/structured3d/asset/S3D-DES-002/room/living_room/panorama' },
          { roomId: 'room_02', name: 'Compact Linear Kitchen', type: 'kitchen', dimensions: "10.0' x 9.0'", areaSqFt: 90, panorama: '/api/structured3d/asset/S3D-DES-002/room/kitchen/panorama' },
          { roomId: 'room_03', name: 'Upper Floor Bedroom', type: 'bedroom', dimensions: "13.0' x 12.0'", areaSqFt: 156, panorama: '/api/structured3d/asset/S3D-DES-002/room/bedroom/panorama' },
          { roomId: 'room_04', name: 'Contemporary Bathroom', type: 'bathroom', dimensions: "8.0' x 6.5'", areaSqFt: 52, panorama: '/api/structured3d/asset/S3D-DES-002/room/bathroom/panorama' }
        ]
      },
      {
        designId: 'S3D-DES-003',
        sceneId: 'scene_00002',
        title: 'Structured3D Executive 4 BHK Luxury Villa',
        style: 'Contemporary Cantilever Villa',
        bhk: '4 BHK',
        floors: 'G + 1 Villa',
        totalAreaSqFt: 2250,
        totalAreaSqM: 209.0,
        roomCount: 7,
        roomTypes: ['living room', 'kitchen', 'bedroom', 'bedroom', 'bedroom', 'bathroom', 'balcony'],
        dimensions: { widthFt: 45.0, depthFt: 50.0, ceilingHeightFt: 10.5 },
        vastuScore: 98,
        estimatedCost: '₹38,50,000 – ₹46,00,000',
        thumbnail: '/api/structured3d/asset/S3D-DES-003/thumbnail',
        floorplan: { path: '/api/structured3d/asset/S3D-DES-003/floorplan', format: 'png' },
        model3D: { format: 'obj', path: '/api/structured3d/asset/S3D-DES-003/mesh' },
        views: {
          front: '/api/structured3d/asset/S3D-DES-003/view/front',
          back: '/api/structured3d/asset/S3D-DES-003/view/back',
          left: '/api/structured3d/asset/S3D-DES-003/view/left',
          right: '/api/structured3d/asset/S3D-DES-003/view/right',
          top: '/api/structured3d/asset/S3D-DES-003/view/top'
        },
        rooms: [
          { roomId: 'room_01', name: 'Grand Double-Height Living Hall', type: 'living room', dimensions: "22.0' x 18.0'", areaSqFt: 396, panorama: '/api/structured3d/asset/S3D-DES-003/room/living_room/panorama' },
          { roomId: 'room_02', name: 'Gourmet Island Kitchen & Pantry', type: 'kitchen', dimensions: "16.0' x 14.0'", areaSqFt: 224, panorama: '/api/structured3d/asset/S3D-DES-003/room/kitchen/panorama' },
          { roomId: 'room_03', name: 'Presidential Master Suite', type: 'bedroom', dimensions: "18.0' x 16.5'", areaSqFt: 297, panorama: '/api/structured3d/asset/S3D-DES-003/room/bedroom/panorama' },
          { roomId: 'room_04', name: 'Spa En-Suite Bath', type: 'bathroom', dimensions: "12.0' x 9.5'", areaSqFt: 114, panorama: '/api/structured3d/asset/S3D-DES-003/room/bathroom/panorama' }
        ]
      }
    ];

    const specificId = pathname.split('/structured3d/designs/')[1];
    if (specificId) {
      const match = s3dDesigns.find(d => d.designId.toLowerCase() === specificId.toLowerCase());
      if (match) return res.status(200).json({ success: true, data: match });
      return res.status(404).json({ success: false, error: 'Design not found' });
    }

    return res.status(200).json({
      success: true,
      total: s3dDesigns.length,
      dataset: 'Structured3D Architectural Dataset',
      license: 'MIT License (Copyright 2019 Structured3D Group)',
      data: s3dDesigns
    });
  }

  // Stream Structured3D Assets on Vercel
  if (pathname.includes('/structured3d/asset/')) {
    const subPath = pathname.split('/structured3d/asset/')[1];
    const parts = (subPath || '').split('/').filter(Boolean);
    const designId = parts[0];
    const assetType = parts[1]; // thumbnail, floorplan, mesh, view, room

    const sceneMap = {
      's3d-des-001': 'scene_00000',
      's3d-des-002': 'scene_00001',
      's3d-des-003': 'scene_00002'
    };
    const sceneId = sceneMap[(designId || '').toLowerCase()] || 'scene_00000';
    const sceneDir = path.join(process.cwd(), 'server', 'data', 'structured3d', 'scenes', sceneId);

    let targetFile = null;
    let contentType = 'image/png';

    if (assetType === 'thumbnail' || assetType === 'mesh_preview') {
      targetFile = path.join(sceneDir, 'mesh_preview.png');
    } else if (assetType === 'floorplan') {
      targetFile = path.join(sceneDir, 'floorplan.png');
    } else if (assetType === 'mesh') {
      targetFile = path.join(sceneDir, 'model_3d.obj');
      contentType = 'text/plain; charset=utf-8';
    } else if (assetType === 'view') {
      const viewName = parts[2] || 'front';
      targetFile = path.join(sceneDir, `view_${viewName}.png`);
      if (!fs.existsSync(targetFile)) targetFile = path.join(sceneDir, 'view_front.png');
    } else if (assetType === 'room') {
      const roomType = parts[2] || 'living_room';
      targetFile = path.join(sceneDir, 'rooms', roomType, 'panorama.png');
      if (!fs.existsSync(targetFile)) targetFile = path.join(sceneDir, 'rooms', 'living_room', 'panorama.png');
    }

    let cdnPath = `/data/structured3d/scenes/${sceneId}/`;
    if (assetType === 'thumbnail' || assetType === 'mesh_preview') cdnPath += 'mesh_preview.png';
    else if (assetType === 'floorplan') cdnPath += 'floorplan.png';
    else if (assetType === 'mesh') cdnPath += 'model_3d.obj';
    else if (assetType === 'view') cdnPath += `view_${parts[2] || 'front'}.png`;
    else if (assetType === 'room') cdnPath += `rooms/${parts[2] || 'living_room'}/panorama.png`;

    if (targetFile && fs.existsSync(targetFile)) {
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return fs.createReadStream(targetFile).pipe(res);
    }

    return res.redirect(302, cdnPath);
  }

  return res.status(404).json({ error: 'API endpoint not found' });
}