export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean;    // space/enter pressed this frame
  dismiss: boolean;   // escape pressed this frame
}

const held: Record<string, boolean> = {};
let actionPressed = false;
let dismissPressed = false;

function onKeyDown(e: KeyboardEvent) {
  const key = e.key.toLowerCase();
  // Prevent page scroll when game is focused
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
    e.preventDefault();
  }
  if (key === ' ' || key === 'enter') {
    actionPressed = true;
  }
  if (key === 'escape') {
    dismissPressed = true;
  }
  held[key] = true;
}

function onKeyUp(e: KeyboardEvent) {
  held[e.key.toLowerCase()] = false;
}

let listening = false;

export function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}

export function stopListening() {
  listening = false;
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
}

export function readInput(): InputState {
  const state: InputState = {
    up: !!(held['w'] || held['arrowup']),
    down: !!(held['s'] || held['arrowdown']),
    left: !!(held['a'] || held['arrowleft']),
    right: !!(held['d'] || held['arrowright']),
    action: actionPressed,
    dismiss: dismissPressed,
  };
  // Clear single-frame flags
  actionPressed = false;
  dismissPressed = false;
  return state;
}

// Mobile touch controls
export function setupMobileControls() {
  const btns = document.querySelectorAll<HTMLButtonElement>('.mobile-btn');
  btns.forEach((btn) => {
    const dir = btn.dataset.dir;
    if (!dir) return;
    const key = dir === 'up' ? 'w' : dir === 'down' ? 's' : dir === 'left' ? 'a' : 'd';
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); held[key] = true; }, { passive: false });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); held[key] = false; }, { passive: false });
    btn.addEventListener('touchcancel', () => { held[key] = false; });
    btn.addEventListener('mousedown', () => { held[key] = true; });
    btn.addEventListener('mouseup', () => { held[key] = false; });
    btn.addEventListener('mouseleave', () => { held[key] = false; });
  });

  const actionBtn = document.getElementById('mobile-action');
  if (actionBtn) {
    actionBtn.addEventListener('touchstart', (e) => { e.preventDefault(); actionPressed = true; }, { passive: false });
    actionBtn.addEventListener('mousedown', () => { actionPressed = true; });
  }
}
