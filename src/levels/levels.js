// Level data only. No Three.js objects here.
// Walls: x/z = center, width = along X, depth = along Z.
// All positions are in platform-local space (0,0 = platform center).
export const levels = [
  {
    // 1: Open — learn the controls
    platform: { width: 8, depth: 8 },
    ballStart: { x: -2.5, z: 2.5 },
    hole: { x: 2.5, z: -2.5, radius: 0.5 },
    walls: [],
    maxTilt: 0.26,
  },
  {
    // 2: One east-west wall; must go right to pass the gap, then back left to hole
    platform: { width: 8, depth: 8 },
    ballStart: { x: -2.5, z: 2.5 },
    hole: { x: -2.5, z: -2.5, radius: 0.45 },
    walls: [
      { x: -1.0, z: 0, width: 6, depth: 0.3, height: 0.5 },
    ],
    maxTilt: 0.28,
  },
  {
    // 3: S-curve — two offset walls; thread right gap then left gap
    platform: { width: 8, depth: 8 },
    ballStart: { x: -2.5, z: 2.5 },
    hole: { x: 2.5, z: -2.5, radius: 0.42 },
    walls: [
      { x: -1.0, z:  1.0, width: 6, depth: 0.3, height: 0.5 },
      { x:  1.0, z: -1.0, width: 6, depth: 0.3, height: 0.5 },
    ],
    maxTilt: 0.30,
  },
  {
    // 4: Wider walls on larger platform — tighter gaps than level 3
    platform: { width: 9, depth: 9 },
    ballStart: { x: -3.5, z: 3.5 },
    hole: { x: 3.5, z: -3.5, radius: 0.38 },
    walls: [
      { x: -1.0, z:  1.5, width: 7, depth: 0.3, height: 0.5 },
      { x:  1.0, z: -1.5, width: 7, depth: 0.3, height: 0.5 },
    ],
    maxTilt: 0.32,
  },
  {
    // 5: Three-wall zigzag; small hole; steepest tilt
    platform: { width: 9, depth: 9 },
    ballStart: { x: -3.5, z: 3.5 },
    hole: { x: 3.5, z: -3.5, radius: 0.32 },
    walls: [
      { x: -1.0, z:  2.5, width: 7, depth: 0.3, height: 0.5 },
      { x:  1.0, z:  0.0, width: 7, depth: 0.3, height: 0.5 },
      { x: -1.0, z: -2.5, width: 7, depth: 0.3, height: 0.5 },
    ],
    maxTilt: 0.35,
  },
];
