import { BALL_RADIUS } from './ball.js';

// ── Constants ──────────────────────────────────────────────────────────────
const GRAVITY = 9.8;          // units/s²
const FRICTION = 0.40;        // fraction of velocity remaining after 1 second
const MAX_SPEED = 7;          // units/s — caps speed to prevent tunneling
export const TILT_SPEED = 0.8; // radians/s

// ── Tilt ───────────────────────────────────────────────────────────────────

/**
 * Update platform tilt angles based on held keys.
 * tilt.x  — rotation around X axis (positive → back rises, front dips → ball rolls toward -Z)
 * tilt.z  — rotation around Z axis (negative → right dips → ball rolls toward +X)
 */
export function updateTilt(tilt, keys, maxTilt, dt) {
  const d = TILT_SPEED * dt;
  if (keys.ArrowRight) tilt.z = Math.max(-maxTilt, tilt.z - d);
  if (keys.ArrowLeft)  tilt.z = Math.min( maxTilt, tilt.z + d);
  if (keys.ArrowUp)    tilt.x = Math.max(-maxTilt, tilt.x - d);
  if (keys.ArrowDown)  tilt.x = Math.min( maxTilt, tilt.x + d);
}

// ── Ball step ──────────────────────────────────────────────────────────────

export function stepBall(state, tilt, walls, dt) {
  // Gravity component along each platform axis from tilt:
  //   tilt.z > 0 → left side up → ball slides left (-X) → ax = -g*sin(tilt.z)
  //   tilt.x < 0 → front dips  → ball slides forward (-Z) → az = g*sin(tilt.x) but sign:
  //   positive tilt.x → ball slides +Z; negative tilt.x → -Z
  state.vx += -GRAVITY * Math.sin(tilt.z) * dt;
  state.vz +=  GRAVITY * Math.sin(tilt.x) * dt;

  // Frame-rate independent friction: v(t) = v0 * FRICTION^t
  const fr = Math.pow(FRICTION, dt);
  state.vx *= fr;
  state.vz *= fr;

  // Speed cap
  const spd = Math.sqrt(state.vx * state.vx + state.vz * state.vz);
  if (spd > MAX_SPEED) {
    state.vx = (state.vx / spd) * MAX_SPEED;
    state.vz = (state.vz / spd) * MAX_SPEED;
  }

  state.x += state.vx * dt;
  state.z += state.vz * dt;

  for (const w of walls) resolveWall(state, w);
}

// Sphere-vs-AABB collision using closest-point method.
function resolveWall(state, wall) {
  const halfW = wall.width / 2;
  const halfD = wall.depth / 2;

  // Closest point on wall AABB to ball center
  const cx = Math.max(wall.x - halfW, Math.min(state.x, wall.x + halfW));
  const cz = Math.max(wall.z - halfD, Math.min(state.z, wall.z + halfD));

  const dx = state.x - cx;
  const dz = state.z - cz;
  const distSq = dx * dx + dz * dz;

  if (distSq >= BALL_RADIUS * BALL_RADIUS) return;

  if (distSq < 1e-8) {
    // Ball center is inside wall — push out along axis of least penetration
    const ox = halfW + BALL_RADIUS - Math.abs(state.x - wall.x);
    const oz = halfD + BALL_RADIUS - Math.abs(state.z - wall.z);
    if (ox < oz) {
      state.x += ox * Math.sign(state.x - wall.x || 1);
      state.vx = 0;
    } else {
      state.z += oz * Math.sign(state.z - wall.z || 1);
      state.vz = 0;
    }
    return;
  }

  const dist = Math.sqrt(distSq);
  const nx = dx / dist;
  const nz = dz / dist;
  const overlap = BALL_RADIUS - dist;

  // Push ball out
  state.x += nx * overlap;
  state.z += nz * overlap;

  // Cancel velocity component toward wall
  const vDotN = state.vx * nx + state.vz * nz;
  if (vDotN < 0) {
    state.vx -= vDotN * nx;
    state.vz -= vDotN * nz;
  }
}

// ── Win / lose ─────────────────────────────────────────────────────────────

export function checkWinLose(state, hole, platform) {
  const dx = state.x - hole.x;
  const dz = state.z - hole.z;
  if (dx * dx + dz * dz < hole.radius * hole.radius) return 'win';

  const hw = platform.width / 2;
  const hd = platform.depth / 2;
  if (Math.abs(state.x) > hw || Math.abs(state.z) > hd) return 'lose';

  return null;
}
