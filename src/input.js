const PREVENT = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']);

export function initInput() {
  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (PREVENT.has(e.key)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
  return keys;
}
