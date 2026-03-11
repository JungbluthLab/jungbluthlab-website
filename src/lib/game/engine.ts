import { generateMap, generateTrees, type TileGrid, type TreeDef } from './map-data';
import { getVisibleBuildings, countForEra, type BuildingDef } from './buildings';
import { getEra, setEra } from './eras';
import type { EraId } from './constants';
import { createCamera, updateCamera, type CameraState } from './camera';
import { startListening, setupMobileControls, readInput } from './input';
import { createPlayer, updatePlayer, findNearBuilding, type PlayerState } from './player';
import {
  createSeagulls, updateSeagulls, type Seagull,
  createFish, updateFish, type Fish,
  createCrabs, updateCrabs, type Crab,
  createButterflies, updateButterflies, type Butterfly,
  createPerchBirds, updatePerchBirds, type PerchBird,
  createDeer, updateDeer, type Deer,
} from './wildlife';
import { getVisibleNPCs, type NPC } from './npcs';
import { showPopup, hidePopup, isPopupOpen, getDiscoveredCount, getDiscoveredSet, isEraComplete, updateDiscoveryDisplay, setupPopupListeners } from './popup';
import { initRenderer, render } from './renderer';
import { spawnDust, updateParticles } from './particles';
import { initMinimap } from './minimap';
import { isTourActive, startTour, stopTour, updateTour, advanceTourStop } from './tour';
import { loadCollectibles, checkCollection, getCollectedCount, getTotalCount } from './collectibles';

// Game state — initialized lazily inside initGame()
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let running = false;
let started = false;
let waterFrame = 0;
let waterTimer = 0;
let interactionFlash = 0;

let map: TileGrid;
let trees: TreeDef[];
let camera: CameraState;
let player: PlayerState;
let seagulls: Seagull[];
let fish: Fish[];
let crabs: Crab[];
let butterflies: Butterfly[];
let perchBirds: PerchBird[];
let deer: Deer[];
let hillTrees: { x: number; y: number }[];

// NPC dialogue cycling state
let lastNearNPC: string | null = null;
const npcDialogueIndex = new Map<string, number>();

// Tutorial state
const TUTORIAL_STEPS = [
  'Use WASD or Arrow Keys\nto walk around the campus',
  'Press SPACE near a building\nto learn its history',
  'Toggle eras to see how\nthe campus changed over time',
];
let tutorialStep = -1;
let tutorialShown = false;

// Tour button reference
let tourBtn: HTMLButtonElement | null = null;

// Era-cached visible buildings
let cachedEra: EraId | null = null;
let cachedVisible: BuildingDef[] = [];

function getVisible(era: EraId): BuildingDef[] {
  if (era !== cachedEra) {
    cachedEra = era;
    cachedVisible = getVisibleBuildings(era);
  }
  return cachedVisible;
}

function showTutorialStep() {
  const overlay = document.getElementById('game-tutorial');
  const textEl = document.getElementById('tutorial-step-text');
  const dotsEl = document.getElementById('tutorial-dots');
  if (!overlay || !textEl || !dotsEl) return;

  overlay.style.display = 'flex';
  textEl.textContent = TUTORIAL_STEPS[tutorialStep];

  dotsEl.innerHTML = TUTORIAL_STEPS.map((_, i) =>
    `<span style="width:8px;height:8px;border-radius:50%;background:${i === tutorialStep ? '#9333ea' : '#555'};display:inline-block;"></span>`
  ).join('');
}

function advanceTutorial() {
  tutorialStep++;
  if (tutorialStep >= TUTORIAL_STEPS.length) {
    const overlay = document.getElementById('game-tutorial');
    if (overlay) overlay.style.display = 'none';
    tutorialStep = -1;
    tutorialShown = true;
    try { localStorage.setItem('eos-tutorial-done', '1'); } catch {}
    canvas.focus();
  } else {
    showTutorialStep();
  }
}

let resizeTimer: number | null = null;

export function initGame() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  // Set display resolution to match CSS-rendered size
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    // Layout not settled yet — retry shortly
    setTimeout(initGame, 100);
    return;
  }
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;

  ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Generate game world (deferred to here for lazy init)
  map = generateMap();
  trees = generateTrees(map);
  camera = createCamera();
  // Player starts near south Paradise Drive gate, facing east
  player = createPlayer(22, 84);
  seagulls = createSeagulls(5);
  fish = createFish(8);
  crabs = createCrabs(6, map);
  butterflies = createButterflies(4);

  // Perch birds need tree positions from the hillside
  hillTrees = trees.filter(t => t.x < 25 * 16); // hillside trees only
  perchBirds = createPerchBirds(4, hillTrees);
  deer = createDeer(2);

  initMinimap(map);
  initRenderer();
  startListening();
  setupMobileControls();

  // Setup popup close handler
  setupPopupListeners(() => {
    if (isTourActive()) advanceTourStop();
  });

  // Era completion overlay dismiss on click
  const eraCompleteOverlay = document.getElementById('era-complete');
  if (eraCompleteOverlay) {
    eraCompleteOverlay.addEventListener('click', () => {
      eraCompleteOverlay.style.display = 'none';
    });
  }

  // Setup era toggle buttons
  setupEraToggle();

  // Setup start overlay
  setupStartOverlay();

  // Initial discovery display
  const era = getEra();
  updateDiscoveryDisplay(era, countForEra(era));

  // Focus canvas for keyboard input
  canvas.tabIndex = 0;

  // Tutorial event listeners
  const tutOverlay = document.getElementById('game-tutorial');
  if (tutOverlay) {
    tutOverlay.addEventListener('click', () => {
      if (tutorialStep >= 0) advanceTutorial();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (tutorialStep >= 0) {
      e.preventDefault();
      advanceTutorial();
    }
  });

  // Tour button setup
  tourBtn = document.getElementById('tour-btn') as HTMLButtonElement;
  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      if (isTourActive()) {
        stopTour();
        tourBtn!.textContent = 'Guided Tour';
        tourBtn!.classList.remove('bg-lab-600', 'text-white', 'border-lab-600');
        tourBtn!.classList.add('border-gray-600', 'text-gray-400');
      } else {
        startTour();
        tourBtn!.textContent = 'Stop Tour';
        tourBtn!.classList.add('bg-lab-600', 'text-white', 'border-lab-600');
        tourBtn!.classList.remove('border-gray-600', 'text-gray-400');
      }
      canvas.focus();
    });
  }

  // Collectibles init
  loadCollectibles();
  const ccEl = document.getElementById('collectible-count');
  const ctEl = document.getElementById('collectible-total');
  if (ccEl) ccEl.textContent = String(getCollectedCount());
  if (ctEl) ctEl.textContent = String(getTotalCount());

  // Handle resize (debounced)
  window.addEventListener('resize', () => {
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(handleResize, 150);
  });

  // Start game loop
  running = true;
  requestAnimationFrame(gameLoop);
}

function handleResize() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
}

function setupStartOverlay() {
  const overlay = document.getElementById('game-start-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', () => {
    started = true;
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => overlay.remove(), 400);

    // Check if tutorial should show
    if (!tutorialShown) {
      try {
        if (!localStorage.getItem('eos-tutorial-done')) {
          tutorialStep = 0;
          showTutorialStep();
          return; // Don't focus canvas yet
        }
      } catch {}
    }
    canvas.focus();
  });
}

function setupEraToggle() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.era-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const newEra = btn.dataset.era as EraId;
      if (!newEra) return;

      setEra(newEra);
      cachedEra = null; // invalidate cache

      // Update button styles
      buttons.forEach((b) => {
        b.classList.remove('bg-lab-600', 'text-white', 'border-lab-600');
        b.classList.add('border-gray-600', 'text-gray-400');
      });
      btn.classList.add('bg-lab-600', 'text-white', 'border-lab-600');
      btn.classList.remove('border-gray-600', 'text-gray-400');

      // Update discovery display
      updateDiscoveryDisplay(newEra, countForEra(newEra));

      // Close popup if open
      if (isPopupOpen()) hidePopup();

      canvas.focus();
    });
  });

  // Set initial active button (Modern)
  const modernBtn = document.querySelector<HTMLButtonElement>('.era-btn[data-era="modern"]');
  if (modernBtn) {
    modernBtn.classList.add('bg-lab-600', 'text-white', 'border-lab-600');
    modernBtn.classList.remove('border-gray-600', 'text-gray-400');
  }
}

function showEraCelebration(era: EraId, total: number) {
  const overlay = document.getElementById('era-complete');
  const textEl = document.getElementById('era-complete-text');
  if (!overlay || !textEl) return;

  const eraLabels: Record<EraId, string> = {
    codfish: '1880s Codfish',
    navy: '1940s Navy',
    modern: 'Today',
  };

  textEl.textContent = `You discovered all ${total} locations in the ${eraLabels[era]} era!`;
  overlay.style.display = 'flex';

  setTimeout(() => {
    overlay.style.display = 'none';
  }, 4000);
}

function gameLoop() {
  if (!running) return;

  const input = readInput();
  const era = getEra();
  const visibleBuildings = getVisible(era);

  // Update
  if (started && !isPopupOpen() && tutorialStep < 0) {
    if (isTourActive()) {
      const arrivedId = updateTour(player);
      updateCamera(camera, player.x, player.y);
      if (arrivedId) {
        const bld = visibleBuildings.find(b => b.id === arrivedId);
        if (bld) {
          const opened = showPopup(bld, era);
          if (opened) {
            interactionFlash = 15;
            updateDiscoveryDisplay(era, countForEra(era));
            if (isEraComplete(era, countForEra(era))) {
              showEraCelebration(era, countForEra(era));
            }
          }
        }
      }
    } else {
      updatePlayer(player, input, map, visibleBuildings);
      updateCamera(camera, player.x, player.y);
    }

    // Dust particles (runs in both modes)
    if (player.moving) {
      const ptx = Math.floor(player.x / 16);
      const pty = Math.floor(player.y / 16);
      if (ptx >= 0 && pty >= 0 && ptx < map[0].length && pty < map.length) {
        const tile = map[pty][ptx];
        if (tile === 2 || tile === 3) { // ROAD or CONCRETE
          if (Math.random() < 0.3) {
            spawnDust(player.x, player.y + 6);
          }
        }
      }
    }
    updateParticles();

    // Collectible pickup
    if (player.moving) {
      const found = checkCollection(player.x, player.y);
      if (found) {
        const toast = document.getElementById('collectible-toast');
        const toastText = document.getElementById('collectible-toast-text');
        if (toast && toastText) {
          toastText.textContent = found.label;
          toast.style.opacity = '1';
          setTimeout(() => { toast.style.opacity = '0'; }, 2000);
        }
        const ccEl2 = document.getElementById('collectible-count');
        if (ccEl2) ccEl2.textContent = String(getCollectedCount());
      }
    }
  }

  // Reset tour button when tour finishes
  if (!isTourActive() && tourBtn && tourBtn.textContent === 'Stop Tour') {
    tourBtn.textContent = 'Guided Tour';
    tourBtn.classList.remove('bg-lab-600', 'text-white', 'border-lab-600');
    tourBtn.classList.add('border-gray-600', 'text-gray-400');
  }

  updateSeagulls(seagulls);
  updateFish(fish);
  updateCrabs(crabs);
  updateButterflies(butterflies);
  updatePerchBirds(perchBirds, hillTrees);
  updateDeer(deer);

  // Water animation
  waterTimer++;
  if (waterTimer >= 20) {
    waterTimer = 0;
    waterFrame = (waterFrame + 1) % 3;
  }

  // Find nearest building for interaction
  const nearBuilding = started && !isPopupOpen() && tutorialStep < 0
    ? findNearBuilding(player, visibleBuildings)
    : null;

  // Handle interaction
  if (input.action && nearBuilding && !isPopupOpen()) {
    const opened = showPopup(nearBuilding, era);
    if (opened) {
      interactionFlash = 15;
      updateDiscoveryDisplay(era, countForEra(era));
      if (isEraComplete(era, countForEra(era))) {
        showEraCelebration(era, countForEra(era));
      }
    }
  }

  // Handle dismiss
  if (input.dismiss && isPopupOpen()) {
    hidePopup();
    if (isTourActive()) advanceTourStop();
  }

  // Tick interaction flash
  if (interactionFlash > 0) interactionFlash--;

  // Render
  const dCount = getDiscoveredCount(era);
  const dTotal = countForEra(era);
  const visibleNPCs = getVisibleNPCs(era);

  // NPC dialogue cycling
  const NEAR_DIST = 50;
  let currentNearNPC: string | null = null;
  for (const npc of visibleNPCs) {
    const npcContent = npc.eras[era];
    if (!npcContent) continue;
    const nsx = npc.x * 16 + 8;
    const nsy = npc.y * 16 + 8;
    const dist = Math.hypot(player.x - nsx, player.y - nsy);
    if (dist < NEAR_DIST) {
      currentNearNPC = npc.id;
      break;
    }
  }
  if (currentNearNPC && currentNearNPC !== lastNearNPC) {
    const prev = npcDialogueIndex.get(currentNearNPC) ?? -1;
    const npc = visibleNPCs.find(n => n.id === currentNearNPC);
    const content = npc?.eras[era];
    if (content) {
      npcDialogueIndex.set(currentNearNPC, (prev + 1) % content.dialogue.length);
    }
  }
  lastNearNPC = currentNearNPC;

  const discoveredSet = getDiscoveredSet(era);
  render(
    ctx, camera, map, trees, visibleBuildings,
    player, seagulls, nearBuilding, era,
    dCount, dTotal,
    waterFrame,
    interactionFlash,
    fish, crabs, butterflies,
    perchBirds, deer,
    visibleNPCs,
    npcDialogueIndex,
    discoveredSet,
  );

  // Update DOM discovery counter
  updateDiscoveryDisplay(era, dTotal);

  requestAnimationFrame(gameLoop);
}
