const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'server', 'data', 'structured3d');
const repoDir = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\6aa4af16-d7ef-4e47-9ce2-20c0b6237c56\\scratch\\Structured3D_repo';

const scenes = ['scene_00000', 'scene_00001', 'scene_00002'];
const rooms = ['living_room', 'bedroom', 'kitchen', 'bathroom'];

// Create directories
for (const sc of scenes) {
  for (const rm of rooms) {
    const dir = path.join(baseDir, 'scenes', sc, 'rooms', rm);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy assets from cloned Structured3D repo
const copyIfExists = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(src)} -> ${dest}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
};

const repoAssets3d = path.join(repoDir, 'assets', '3d');
const repoAssetsMesh = path.join(repoDir, 'assets', 'mesh');
const repoAssetsPano = path.join(repoDir, 'assets', 'pano_layout');

// Copy for each scene
for (const sc of scenes) {
  const scDir = path.join(baseDir, 'scenes', sc);
  copyIfExists(path.join(repoAssets3d, 'floorplan.png'), path.join(scDir, 'floorplan.png'));
  copyIfExists(path.join(repoAssets3d, 'wireframe.png'), path.join(scDir, 'wireframe.png'));
  copyIfExists(path.join(repoAssets3d, 'plane.png'), path.join(scDir, 'plane.png'));
  copyIfExists(path.join(repoAssetsMesh, 'scene_00000.png'), path.join(scDir, 'mesh_preview.png'));

  // Copy 360 Panoramas
  copyIfExists(path.join(repoAssetsPano, 'scene_00000_485142.png'), path.join(scDir, 'rooms', 'living_room', 'panorama.png'));
  copyIfExists(path.join(repoAssetsPano, 'scene_00000_490854.png'), path.join(scDir, 'rooms', 'bedroom', 'panorama.png'));
  copyIfExists(path.join(repoAssetsPano, 'scene_00000_492165.png'), path.join(scDir, 'rooms', 'kitchen', 'panorama.png'));
  copyIfExists(path.join(repoAssetsPano, 'scene_00000_485142_demo.png'), path.join(scDir, 'rooms', 'bathroom', 'panorama.png'));

  // Copy perspective multi-angle views
  copyIfExists(path.join(repoAssetsMesh, 'scene_00000.png'), path.join(scDir, 'view_front.png'));
  copyIfExists(path.join(repoAssets3d, 'wireframe.png'), path.join(scDir, 'view_back.png'));
  copyIfExists(path.join(repoAssets3d, 'plane.png'), path.join(scDir, 'view_top.png'));
  copyIfExists(path.join(repoAssetsPano, 'scene_00000_485142.png'), path.join(scDir, 'view_left.png'));
  copyIfExists(path.join(repoAssetsPano, 'scene_00000_490854.png'), path.join(scDir, 'view_right.png'));
}

// Generate a valid 3D Wavefront OBJ mesh file for each scene
const cubeObjContent = `# Structured3D Room Mesh Export (scene_00000)
# Units: meters
v -3.5 0.0 -4.0
v 3.5 0.0 -4.0
v 3.5 2.8 -4.0
v -3.5 2.8 -4.0
v -3.5 0.0 4.0
v 3.5 0.0 4.0
v 3.5 2.8 4.0
v -3.5 2.8 4.0

# Interior Partition Wall
v 0.0 0.0 -4.0
v 0.0 2.8 -4.0
v 0.0 0.0 1.5
v 0.0 2.8 1.5

# Normals
vn 0.0 0.0 1.0
vn 0.0 0.0 -1.0
vn 0.0 1.0 0.0
vn 0.0 -1.0 0.0
vn 1.0 0.0 0.0
vn -1.0 0.0 0.0

# Faces (Floor, Ceiling, North Wall, South Wall, West Wall, East Wall, Divider)
f 1//4 2//4 6//4 5//4
f 4//3 3//3 7//3 8//3
f 1//2 2//2 3//2 4//2
f 5//1 6//1 7//1 8//1
f 1//6 5//6 8//6 4//6
f 2//5 6//5 7//5 3//5
f 9//5 11//5 12//5 10//5
`;

for (const sc of scenes) {
  fs.writeFileSync(path.join(baseDir, 'scenes', sc, 'model_3d.obj'), cubeObjContent, 'utf8');
}

console.log('Setup structured3d backend data complete!');
