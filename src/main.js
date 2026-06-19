import './style.css';
import * as THREE from 'three';
import { createScene } from './scene.js';
import { buildPlatform } from './platform.js';
import { createBall, BALL_RADIUS } from './ball.js';
import { updateTilt, stepBall, checkWinLose } from './physics.js';
import { initInput } from './input.js';
import { levels } from './levels/levels.js';

// ── DOM ────────────────────────────────────────────────────────────────────
const canvas       = document.querySelector('#canvas');
const overlay      = document.querySelector('#overlay');
const overlayTitle = document.querySelector('#overlay-title');
const overlayMsg   = document.querySelector('#overlay-msg');
const overlayBtn   = document.querySelector('#overlay-btn');
const levelDots    = document.querySelector('#level-dots');
const levelDisplay = document.querySelector('#level-display');

// ── Scene ──────────────────────────────────────────────────────────────────
const { scene, camera, renderer } = createScene(canvas);
const clock = new THREE.Clock(false);
const keys  = initInput();

// ── State ──────────────────────────────────────────────────────────────────
let currentLevel = 0;
let platform = null;
let ball = null;
let tilt = { x: 0, z: 0 };
// 'idle' | 'playing' | 'win' | 'lose'
let gameState = 'idle';

// ── Dots ───────────────────────────────────────────────────────────────────
function renderDots(active) {
  levelDots.innerHTML = '';
  for (let i = 0; i < levels.length; i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i < active ? ' done' : i === active ? ' current' : '');
    levelDots.appendChild(d);
  }
}

// ── Level management ───────────────────────────────────────────────────────
function loadLevel(index) {
  if (ball)     ball.dispose();
  if (platform) platform.dispose();

  const def = levels[index];
  platform = buildPlatform(scene, def);
  ball     = createBall(platform.group, def.ballStart.x, def.ballStart.z);
  tilt.x   = 0;
  tilt.z   = 0;
  gameState = 'playing';

  levelDisplay.textContent = `Level ${index + 1} / ${levels.length}`;
  renderDots(index);
  hideOverlay();
  clock.start();
}

// ── Overlay ────────────────────────────────────────────────────────────────
function showOverlay(title, msg, btnLabel) {
  overlayTitle.textContent = title;
  overlayMsg.textContent   = msg;
  overlayBtn.textContent   = btnLabel;
  overlay.classList.add('visible');
}

function hideOverlay() {
  overlay.classList.remove('visible');
}

overlayBtn.addEventListener('click', () => {
  if (gameState === 'idle' || gameState === 'lose') {
    loadLevel(currentLevel);
  } else if (gameState === 'win') {
    currentLevel++;
    if (currentLevel >= levels.length) {
      currentLevel = 0;
      renderDots(-1);
      gameState = 'idle';
      showOverlay('Complete', 'All levels cleared.', 'Play again');
    } else {
      loadLevel(currentLevel);
    }
  }
});

// ── Game loop ──────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);

  if (gameState === 'playing') {
    const def = levels[currentLevel];

    updateTilt(tilt, keys, def.maxTilt, dt);
    platform.group.rotation.x = tilt.x;
    platform.group.rotation.z = tilt.z;

    stepBall(ball.state, tilt, def.walls, dt);

    ball.mesh.position.set(ball.state.x, BALL_RADIUS, ball.state.z);

    // Rolling: sphere rotates proportional to linear velocity
    ball.mesh.rotation.z -= (ball.state.vx / BALL_RADIUS) * dt;
    ball.mesh.rotation.x += (ball.state.vz / BALL_RADIUS) * dt;

    const result = checkWinLose(ball.state, def.hole, def.platform);
    if (result === 'win') {
      gameState = 'win';
      ball.mesh.visible = false;
      const isLast = currentLevel + 1 >= levels.length;
      setTimeout(() => {
        renderDots(isLast ? levels.length : currentLevel + 1);
        showOverlay(
          isLast ? 'Complete' : 'Level clear',
          isLast ? 'All levels cleared.' : `Next up: level ${currentLevel + 2}`,
          isLast ? 'Play again' : 'Next level',
        );
      }, 300);
    } else if (result === 'lose') {
      gameState = 'lose';
      ball.mesh.visible = false;
      setTimeout(() => showOverlay('Off the edge', 'Ball left the platform.', 'Try again'), 300);
    }
  }

  renderer.render(scene, camera);
}

// ── Init ───────────────────────────────────────────────────────────────────
renderDots(0);
showOverlay('Tilt Maze', 'Arrow keys tilt the platform. Roll the ball into the ring.', 'Play');
animate();
