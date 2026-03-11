import { TILE_SIZE, PLAYER_SPEED, INTERACT_RANGE, WALKABLE_TILES, DIR } from './constants';
import type { TileGrid } from './map-data';
import type { BuildingDef } from './buildings';
import type { InputState } from './input';

export interface PlayerState {
  x: number; // pixel position (center)
  y: number;
  dir: number;
  frame: number; // animation frame
  frameTimer: number;
  moving: boolean;
}

export function createPlayer(startTileX: number, startTileY: number): PlayerState {
  return {
    x: startTileX * TILE_SIZE + TILE_SIZE / 2,
    y: startTileY * TILE_SIZE + TILE_SIZE / 2,
    dir: DIR.RIGHT,
    frame: 0,
    frameTimer: 0,
    moving: false,
  };
}

/** Update player position with collision detection */
export function updatePlayer(
  p: PlayerState,
  input: InputState,
  map: TileGrid,
  buildings: BuildingDef[],
) {
  let dx = 0, dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;

  p.moving = dx !== 0 || dy !== 0;

  if (p.moving) {
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.SQRT2;
      dx *= inv;
      dy *= inv;
    }

    // Update direction
    if (Math.abs(dx) > Math.abs(dy)) {
      p.dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
    } else {
      p.dir = dy > 0 ? DIR.DOWN : DIR.UP;
    }

    // Try X movement
    const newX = p.x + dx * PLAYER_SPEED;
    if (canMove(newX, p.y, map, buildings)) {
      p.x = newX;
    }

    // Try Y movement
    const newY = p.y + dy * PLAYER_SPEED;
    if (canMove(p.x, newY, map, buildings)) {
      p.y = newY;
    }

    // Walk animation
    p.frameTimer++;
    if (p.frameTimer >= 10) {
      p.frameTimer = 0;
      p.frame = (p.frame + 1) % 2;
    }
  } else {
    p.frame = 0;
    p.frameTimer = 0;
  }
}

/** Collision detection: check if center position is on a walkable tile and not inside a building */
function canMove(cx: number, cy: number, map: TileGrid, buildings: BuildingDef[]): boolean {
  // Check collision box (smaller than sprite for forgiving collision)
  const halfW = 4, halfH = 4;
  const corners = [
    [cx - halfW, cy - halfH],
    [cx + halfW, cy - halfH],
    [cx - halfW, cy + halfH],
    [cx + halfW, cy + halfH],
  ];

  for (const [px, py] of corners) {
    const tx = Math.floor(px / TILE_SIZE);
    const ty = Math.floor(py / TILE_SIZE);
    if (tx < 0 || tx >= map[0].length || ty < 0 || ty >= map.length) return false;
    if (!WALKABLE_TILES.has(map[ty][tx])) return false;
  }

  // Check building footprints
  for (const b of buildings) {
    const bx1 = b.x * TILE_SIZE;
    const by1 = b.y * TILE_SIZE;
    const bx2 = (b.x + b.w) * TILE_SIZE;
    const by2 = (b.y + b.h) * TILE_SIZE;

    if (cx + 4 > bx1 && cx - 4 < bx2 && cy + 4 > by1 && cy - 4 < by2) {
      return false;
    }
  }

  return true;
}

/** Find the nearest interactable building within range */
export function findNearBuilding(p: PlayerState, buildings: BuildingDef[]): BuildingDef | null {
  let closest: BuildingDef | null = null;
  let closestDist = Infinity;

  for (const b of buildings) {
    // Distance from player center to nearest point on building rect
    const bx1 = b.x * TILE_SIZE;
    const by1 = b.y * TILE_SIZE;
    const bx2 = (b.x + b.w) * TILE_SIZE;
    const by2 = (b.y + b.h) * TILE_SIZE;

    const nearX = Math.max(bx1, Math.min(p.x, bx2));
    const nearY = Math.max(by1, Math.min(p.y, by2));

    const dist = Math.hypot(p.x - nearX, p.y - nearY);
    const rangePx = INTERACT_RANGE * TILE_SIZE;

    if (dist < rangePx && dist < closestDist) {
      closestDist = dist;
      closest = b;
    }
  }

  return closest;
}
