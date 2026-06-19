import * as THREE from 'three';

export const BALL_RADIUS = 0.25;

export function createBall(group, startX, startZ) {
  const geo = new THREE.SphereGeometry(BALL_RADIUS, 24, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0xe05020, roughness: 0.4, metalness: 0.3 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.position.set(startX, BALL_RADIUS, startZ);
  group.add(mesh);

  return {
    mesh,
    state: { x: startX, z: startZ, vx: 0, vz: 0 },
    dispose() {
      group.remove(mesh);
      geo.dispose();
      mat.dispose();
    },
  };
}
