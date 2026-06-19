import * as THREE from 'three';

const SLAB_HEIGHT = 0.15;

export function buildPlatform(scene, levelDef) {
  const group = new THREE.Group();
  const toDispose = [];

  const { platform, hole, walls } = levelDef;

  // Slab
  const slabGeo = new THREE.BoxGeometry(platform.width, SLAB_HEIGHT, platform.depth);
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x2a4a6a, roughness: 0.8 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.receiveShadow = true;
  slab.position.y = -SLAB_HEIGHT / 2;
  group.add(slab);
  toDispose.push(slabGeo, slabMat);

  // Hole (dark void)
  const holeGeo = new THREE.CylinderGeometry(hole.radius, hole.radius, SLAB_HEIGHT + 0.02, 32);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const holeMesh = new THREE.Mesh(holeGeo, holeMat);
  holeMesh.position.set(hole.x, -SLAB_HEIGHT / 2, hole.z);
  group.add(holeMesh);
  toDispose.push(holeGeo, holeMat);

  // Hole ring marker
  const rimGeo = new THREE.TorusGeometry(hole.radius + 0.05, 0.04, 8, 32);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x00cc88 });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.set(hole.x, 0.01, hole.z);
  group.add(rimMesh);
  toDispose.push(rimGeo, rimMat);

  // Walls
  for (const w of walls) {
    const wGeo = new THREE.BoxGeometry(w.width, w.height, w.depth);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x3a5a8a });
    const wMesh = new THREE.Mesh(wGeo, wMat);
    wMesh.castShadow = true;
    wMesh.receiveShadow = true;
    wMesh.position.set(w.x, w.height / 2, w.z);
    group.add(wMesh);
    toDispose.push(wGeo, wMat);
  }

  scene.add(group);

  return {
    group,
    dispose() {
      scene.remove(group);
      for (const obj of toDispose) obj.dispose();
    },
  };
}
