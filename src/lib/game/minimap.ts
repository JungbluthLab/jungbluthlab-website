// src/lib/game/minimap.ts
import { MAP_W, MAP_H, TILE, TILE_SIZE, V_WIDTH, V_HEIGHT } from './constants';
import type { EraId } from './constants';
import type { TileGrid } from './map-data';
import type { BuildingDef } from './buildings';
import type { PlayerState } from './player';
import type { CameraState } from './camera';
import type { NPC } from './npcs';

const MM_W = 72;
const MM_H = 60;
const MM_X = 4;
const MM_Y = 4;
const MM_SCALE_X = MM_W / MAP_W;
const MM_SCALE_Y = MM_H / MAP_H;

let mmCanvas: HTMLCanvasElement | null = null;

export function initMinimap(map: TileGrid) {
  mmCanvas = document.createElement('canvas');
  mmCanvas.width = MM_W;
  mmCanvas.height = MM_H;
  const ctx = mmCanvas.getContext('2d')!;

  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      const tile = map[ty][tx];
      const px = Math.floor(tx * MM_SCALE_X);
      const py = Math.floor(ty * MM_SCALE_Y);

      switch (tile) {
        case TILE.WATER: ctx.fillStyle = '#1a5a9a'; break;
        case TILE.GRASS: ctx.fillStyle = '#3a6632'; break;
        case TILE.HILL_GRASS: ctx.fillStyle = '#2a5528'; break;
        case TILE.ROAD: ctx.fillStyle = '#666'; break;
        case TILE.CONCRETE: ctx.fillStyle = '#888'; break;
        case TILE.SAND: ctx.fillStyle = '#c4b87a'; break;
        default: ctx.fillStyle = '#1a5a9a';
      }
      ctx.fillRect(px, py, Math.ceil(MM_SCALE_X), Math.ceil(MM_SCALE_Y));
    }
  }
}

export function drawMinimap(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  buildings: BuildingDef[],
  cam: CameraState,
  discoveredSet: Set<string>,
  npcs: NPC[],
  era: EraId,
) {
  if (!mmCanvas) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(MM_X - 1, MM_Y - 1, MM_W + 2, MM_H + 2);

  ctx.drawImage(mmCanvas, MM_X, MM_Y);

  for (const b of buildings) {
    const bx = MM_X + Math.floor((b.x + b.w / 2) * MM_SCALE_X);
    const by = MM_Y + Math.floor((b.y + b.h / 2) * MM_SCALE_Y);
    ctx.fillStyle = discoveredSet.has(b.id) ? '#4ade80' : '#d4a04a';
    ctx.fillRect(bx, by, 2, 2);
  }

  // NPC dots
  ctx.fillStyle = '#00e5ff';
  for (const npc of npcs) {
    const npcContent = npc.eras[era];
    if (!npcContent) continue;
    const nx = MM_X + Math.floor(npc.x * MM_SCALE_X);
    const ny = MM_Y + Math.floor(npc.y * MM_SCALE_Y);
    ctx.fillRect(nx, ny, 1, 1);
  }

  const playerTX = player.x / TILE_SIZE;
  const playerTY = player.y / TILE_SIZE;
  const px = MM_X + Math.floor(playerTX * MM_SCALE_X);
  const py = MM_Y + Math.floor(playerTY * MM_SCALE_Y);

  if (Math.floor(Date.now() / 400) % 2 === 0) {
    ctx.fillStyle = '#ff4444';
  } else {
    ctx.fillStyle = '#ffffff';
  }
  ctx.fillRect(px - 1, py - 1, 3, 3);

  const vx = MM_X + Math.floor((cam.x / TILE_SIZE) * MM_SCALE_X);
  const vy = MM_Y + Math.floor((cam.y / TILE_SIZE) * MM_SCALE_Y);
  const vw = Math.floor((V_WIDTH / TILE_SIZE) * MM_SCALE_X);
  const vh = Math.floor((V_HEIGHT / TILE_SIZE) * MM_SCALE_Y);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(vx + 0.5, vy + 0.5, vw, vh);
}
