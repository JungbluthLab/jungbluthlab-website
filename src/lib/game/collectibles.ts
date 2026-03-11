import { TILE_SIZE } from './constants';

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'shell' | 'brick' | 'star' | 'bottle' | 'compass' | 'feather' | 'anchor' | 'net_float' | 'coin';
  label: string;
  collected: boolean;
}

export const COLLECTIBLES: Collectible[] = [
  { id: 'c1', x: 74, y: 60, type: 'shell', label: 'Oyster Shell', collected: false },
  { id: 'c2', x: 16, y: 80, type: 'brick', label: 'Historic Brick Fragment', collected: false },
  { id: 'c3', x: 85, y: 50, type: 'star', label: 'Sea Star', collected: false },
  { id: 'c4', x: 32, y: 14, type: 'compass', label: 'Old Navy Compass', collected: false },
  { id: 'c5', x: 58, y: 45, type: 'bottle', label: 'Message in a Bottle', collected: false },
  { id: 'c6', x: 12, y: 40, type: 'feather', label: 'Hawk Feather', collected: false },
  { id: 'c7', x: 90, y: 30, type: 'shell', label: 'Moon Snail Shell', collected: false },
  { id: 'c8', x: 40, y: 70, type: 'star', label: 'Bat Star', collected: false },
  { id: 'c9', x: 52, y: 54, type: 'anchor', label: 'Rusty Anchor Link', collected: false },
  { id: 'c10', x: 66, y: 56, type: 'net_float', label: 'Steel Net Float', collected: false },
  { id: 'c11', x: 68, y: 44, type: 'shell', label: 'Abalone Shell', collected: false },
  { id: 'c12', x: 24, y: 28, type: 'coin', label: '1880s Silver Dollar', collected: false },
  { id: 'c13', x: 64, y: 40, type: 'feather', label: 'Egret Feather', collected: false },
  { id: 'c14', x: 42, y: 12, type: 'bottle', label: "Officers' Whiskey Flask", collected: false },
  { id: 'c15', x: 82, y: 52, type: 'compass', label: 'Sextant Fragment', collected: false },
];

const STORAGE_KEY = 'eos-explore-collectibles';

export function loadCollectibles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const ids: string[] = JSON.parse(raw);
    for (const c of COLLECTIBLES) {
      if (ids.includes(c.id)) c.collected = true;
    }
  } catch {}
}

function saveCollectibles() {
  try {
    const ids = COLLECTIBLES.filter(c => c.collected).map(c => c.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function checkCollection(playerX: number, playerY: number): Collectible | null {
  const range = TILE_SIZE * 1.5;
  for (const c of COLLECTIBLES) {
    if (c.collected) continue;
    const cx = c.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = c.y * TILE_SIZE + TILE_SIZE / 2;
    const dist = Math.hypot(playerX - cx, playerY - cy);
    if (dist < range) {
      c.collected = true;
      saveCollectibles();
      return c;
    }
  }
  return null;
}

export function getCollectedCount(): number {
  return COLLECTIBLES.filter(c => c.collected).length;
}

export function getTotalCount(): number {
  return COLLECTIBLES.length;
}

export function getUncollected(): Collectible[] {
  return COLLECTIBLES.filter(c => !c.collected);
}
