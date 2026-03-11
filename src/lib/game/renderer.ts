import {
  TILE_SIZE, V_WIDTH, V_HEIGHT, TILE, DIR,
  PALETTES, type EraId, type Palette,
} from './constants';
import type { TileGrid, TreeDef } from './map-data';
import type { BuildingDef } from './buildings';
import type { CameraState } from './camera';
import type { PlayerState } from './player';
import type { Seagull, Fish, Crab, Butterfly } from './wildlife';
import type { NPC } from './npcs';
import { drawMinimap } from './minimap';
import { getParticles } from './particles';
import { getUncollected } from './collectibles';

let offCanvas: HTMLCanvasElement;
let offCtx: CanvasRenderingContext2D;
let _interactionFlash = 0;

export function initRenderer() {
  offCanvas = document.createElement('canvas');
  offCanvas.width = V_WIDTH;
  offCanvas.height = V_HEIGHT;
  offCtx = offCanvas.getContext('2d')!;
}

export function render(
  displayCtx: CanvasRenderingContext2D,
  cam: CameraState,
  map: TileGrid,
  trees: TreeDef[],
  buildings: BuildingDef[],
  player: PlayerState,
  seagulls: Seagull[],
  nearBuilding: BuildingDef | null,
  era: EraId,
  discoveredCount: number,
  totalCount: number,
  waterFrame: number,
  interactionFlash: number,
  fish: Fish[],
  crabs: Crab[],
  butterflies: Butterfly[],
  npcs: NPC[],
  npcDialogueIndex: Map<string, number>,
  discoveredSet: Set<string>,
) {
  _interactionFlash = interactionFlash;
  const pal = PALETTES[era];
  const ctx = offCtx;

  // Clear
  ctx.fillStyle = pal.water[0];
  ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

  // Visible tile range
  const startTX = Math.floor(cam.x / TILE_SIZE);
  const startTY = Math.floor(cam.y / TILE_SIZE);
  const endTX = startTX + Math.ceil(V_WIDTH / TILE_SIZE) + 1;
  const endTY = startTY + Math.ceil(V_HEIGHT / TILE_SIZE) + 1;

  // ── Terrain ──
  for (let ty = startTY; ty <= endTY; ty++) {
    for (let tx = startTX; tx <= endTX; tx++) {
      if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[0].length) continue;
      const tile = map[ty][tx];
      const sx = Math.floor(tx * TILE_SIZE - cam.x);
      const sy = Math.floor(ty * TILE_SIZE - cam.y);

      switch (tile) {
        case TILE.WATER:
          drawWater(ctx, sx, sy, tx, ty, waterFrame, pal);
          break;
        case TILE.GRASS:
          ctx.fillStyle = ((tx + ty) & 1) ? pal.grass : pal.grassAlt;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          break;
        case TILE.HILL_GRASS:
          ctx.fillStyle = ((tx + ty) & 1) ? pal.hillGrass : pal.hillGrassAlt;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          break;
        case TILE.ROAD:
          ctx.fillStyle = pal.road;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          // Road center line — detect orientation from neighbors
          if ((tx + ty) % 4 < 2) {
            ctx.fillStyle = pal.roadLine;
            const hasRoadAbove = ty > 0 && map[ty - 1]?.[tx] === TILE.ROAD;
            const hasRoadBelow = ty < map.length - 1 && map[ty + 1]?.[tx] === TILE.ROAD;
            const isVertical = hasRoadAbove || hasRoadBelow;
            if (isVertical) {
              ctx.fillRect(sx + 7, sy, 2, TILE_SIZE);
            } else {
              ctx.fillRect(sx, sy + 7, TILE_SIZE, 2);
            }
          }
          break;
        case TILE.CONCRETE:
          ctx.fillStyle = ((tx + ty) & 1) ? pal.concrete : pal.concreteAlt;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          break;
        case TILE.SAND:
          ctx.fillStyle = pal.sand;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          // Shoreline foam animation
          {
            const foamPhase = (tx * 3 + ty * 7 + waterFrame * 5) % 16;
            if (foamPhase < 6) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
              const foamX = sx + (foamPhase % 3) * 2;
              ctx.fillRect(foamX, sy + 4 + (foamPhase % 4), 8, 2);
            }
          }
          break;
      }
    }
  }

  // ── Collectibles (sparkle animation) ──
  const sparkle = Math.floor(Date.now() / 300) % 3;
  for (const c of getUncollected()) {
    const csx = Math.floor(c.x * TILE_SIZE + TILE_SIZE / 2 - cam.x);
    const csy = Math.floor(c.y * TILE_SIZE + TILE_SIZE / 2 - cam.y);
    if (csx < -10 || csx > V_WIDTH + 10 || csy < -10 || csy > V_HEIGHT + 10) continue;

    switch (c.type) {
      case 'shell':
        ctx.fillStyle = '#f5e6d0';
        ctx.fillRect(csx - 2, csy - 1, 4, 3);
        ctx.fillStyle = '#dcc8a8';
        ctx.fillRect(csx - 1, csy, 2, 1);
        break;
      case 'brick':
        ctx.fillStyle = '#b44';
        ctx.fillRect(csx - 3, csy - 1, 6, 3);
        ctx.fillStyle = '#933';
        ctx.fillRect(csx, csy - 1, 1, 3);
        break;
      case 'star':
        ctx.fillStyle = '#ff8844';
        ctx.fillRect(csx - 2, csy - 2, 5, 5);
        ctx.fillStyle = '#ffaa66';
        ctx.fillRect(csx - 1, csy - 1, 3, 3);
        break;
      case 'bottle':
        ctx.fillStyle = '#88cc88';
        ctx.fillRect(csx - 1, csy - 3, 2, 6);
        ctx.fillStyle = '#aa8855';
        ctx.fillRect(csx - 1, csy - 4, 2, 2);
        break;
      case 'compass':
        ctx.fillStyle = '#c0a060';
        ctx.fillRect(csx - 2, csy - 2, 5, 5);
        ctx.fillStyle = '#cc3333';
        ctx.fillRect(csx, csy - 1, 1, 2);
        break;
      case 'feather':
        ctx.fillStyle = '#ddd';
        ctx.fillRect(csx, csy - 3, 1, 6);
        ctx.fillStyle = '#ccc';
        ctx.fillRect(csx - 1, csy - 2, 1, 4);
        ctx.fillRect(csx + 1, csy - 2, 1, 4);
        break;
    }

    if (sparkle === 0) {
      ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
      ctx.fillRect(csx + 3, csy - 4, 1, 1);
    } else if (sparkle === 1) {
      ctx.fillStyle = 'rgba(255, 255, 200, 0.4)';
      ctx.fillRect(csx - 4, csy - 2, 1, 1);
    }
  }

  // ── Trees behind player (lower y = further away) ──
  const playerScreenY = player.y;
  for (const tree of trees) {
    if (tree.y > playerScreenY) continue; // draw these after player
    const sx = Math.floor(tree.x - cam.x);
    const sy = Math.floor(tree.y - cam.y);
    if (sx < -20 || sx > V_WIDTH + 20 || sy < -20 || sy > V_HEIGHT + 20) continue;
    drawTree(ctx, sx, sy, tree.size, pal);
  }

  // ── Buildings (sorted by y for overlap) ──
  const sortedBuildings = [...buildings].sort((a, b) => a.y - b.y);
  for (const b of sortedBuildings) {
    const bx = Math.floor(b.x * TILE_SIZE - cam.x);
    const by = Math.floor(b.y * TILE_SIZE - cam.y);
    const bw = b.w * TILE_SIZE;
    const bh = b.h * TILE_SIZE;
    if (bx + bw < 0 || bx > V_WIDTH || by + bh < 0 || by > V_HEIGHT) continue;

    const isHighlighted = nearBuilding === b;
    const content = b.eras[era];
    drawBuilding(ctx, bx, by, bw, bh, b, content.style, pal, isHighlighted);

    // Building label
    if (b.number) {
      ctx.fillStyle = '#fff';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.number, bx + bw / 2, by - 2);
    }

    // Ambient building effects
    const tick = Date.now() * 0.003;
    if (b.id === 'bldg53' || b.id === 'bldg39') {
      // Flag on Bay Conf Center and NERR Admin
      const flagX = bx + bw - 4;
      const flagY = by - 4;
      ctx.fillStyle = '#888';
      ctx.fillRect(flagX, flagY, 1, 8);
      const wave = Math.sin(tick + b.x) * 2;
      ctx.fillStyle = b.id === 'bldg53' ? '#cc3333' : '#3366cc';
      ctx.fillRect(flagX + 1, flagY + Math.floor(wave), 5, 3);
    }
    if (b.id === 'bldg22') {
      // Smoke from power plant chimney
      for (let i = 0; i < 3; i++) {
        const smokeY = by - 8 - i * 4 + Math.sin(tick + i * 2) * 1.5;
        const smokeX = bx + bw / 2 + Math.sin(tick * 0.7 + i) * 2;
        const alpha = 0.3 - i * 0.08;
        ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
        ctx.fillRect(Math.floor(smokeX), Math.floor(smokeY), 3 - i * 0.5, 2);
      }
    }
  }

  // NPCs
  for (const npc of npcs) {
    const npcContent = npc.eras[era];
    if (!npcContent) continue;
    const nsx = Math.floor(npc.x * 16 + 8 - cam.x);
    const nsy = Math.floor(npc.y * 16 + 8 - cam.y);
    if (nsx < -20 || nsx > V_WIDTH + 20 || nsy < -20 || nsy > V_HEIGHT + 20) continue;

    const ox = nsx - 5;
    const oy = nsy - 8;

    ctx.fillStyle = npcContent.shirtColor;
    ctx.fillRect(ox + 2, oy + 5, 6, 6);

    ctx.fillStyle = npcContent.skinColor;
    ctx.fillRect(ox + 2, oy + 1, 6, 5);

    if (npcContent.hatColor) {
      ctx.fillStyle = npcContent.hatColor;
      ctx.fillRect(ox + 1, oy, 8, 2);
    } else {
      ctx.fillStyle = '#4a3020';
      ctx.fillRect(ox + 2, oy, 6, 2);
    }

    ctx.fillStyle = '#3a3a5a';
    ctx.fillRect(ox + 2, oy + 11, 3, 3);
    ctx.fillRect(ox + 5, oy + 11, 3, 3);

    // Dialogue bubble when player is nearby
    const dist = Math.hypot(nsx - Math.floor(player.x - cam.x), nsy - Math.floor(player.y - cam.y));
    if (dist < 50) {
      const idx = npcDialogueIndex.get(npc.id) ?? 0;
      const text = npcContent.dialogue[idx];
      ctx.font = '5px monospace';
      const tw = Math.min(ctx.measureText(text).width + 6, 80);
      const bubbleX = nsx - tw / 2;
      const bubbleY = oy - 14;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(bubbleX, bubbleY, tw, 10);
      ctx.fillRect(nsx - 1, bubbleY + 10, 3, 2);
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(text, nsx, bubbleY + 7, tw - 4);
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(npcContent.label, nsx, oy - 2);
  }

  // ── Player ──
  drawPlayer(ctx, Math.floor(player.x - cam.x), Math.floor(player.y - cam.y), player.dir, player.frame);

  // Dust particles
  for (const p of getParticles()) {
    const psx = Math.floor(p.x - cam.x);
    const psy = Math.floor(p.y - cam.y);
    if (psx < 0 || psx > V_WIDTH || psy < 0 || psy > V_HEIGHT) continue;
    const alpha = p.life / p.maxLife * 0.5;
    ctx.fillStyle = `rgba(180, 170, 150, ${alpha})`;
    ctx.fillRect(psx, psy, Math.ceil(p.size), Math.ceil(p.size));
  }

  // ── Trees in front of player (higher y = closer) ──
  for (const tree of trees) {
    if (tree.y <= playerScreenY) continue;
    const sx = Math.floor(tree.x - cam.x);
    const sy = Math.floor(tree.y - cam.y);
    if (sx < -20 || sx > V_WIDTH + 20 || sy < -20 || sy > V_HEIGHT + 20) continue;
    drawTree(ctx, sx, sy, tree.size, pal);
  }

  // ── Seagulls (always on top) ──
  for (const gull of seagulls) {
    const sx = Math.floor(gull.x - cam.x);
    const sy = Math.floor(gull.y - cam.y);
    if (sx < -10 || sx > V_WIDTH + 10 || sy < -10 || sy > V_HEIGHT + 10) continue;
    drawSeagull(ctx, sx, sy, gull.wingFrame);
  }

  // Fish jumping
  for (const f of fish) {
    if (f.jumpPhase === 0) continue;
    const fsx = Math.floor(f.x - cam.x);
    const fsy = Math.floor(f.y - cam.y);
    if (fsx < -10 || fsx > V_WIDTH + 10 || fsy < -10 || fsy > V_HEIGHT + 10) continue;
    const arc = f.jumpPhase <= 5 ? -(f.jumpPhase * 2) : -((10 - f.jumpPhase) * 2);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(fsx - 1, fsy + arc, 3, 2);
    ctx.fillRect(fsx - 2, fsy + arc + 1, 1, 1);
    if (f.jumpPhase <= 2 || f.jumpPhase >= 9) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(fsx - 2, fsy, 5, 1);
    }
  }

  // Crabs
  for (const c of crabs) {
    const csx = Math.floor(c.x - cam.x);
    const csy = Math.floor(c.y - cam.y);
    if (csx < -10 || csx > V_WIDTH + 10 || csy < -10 || csy > V_HEIGHT + 10) continue;
    ctx.fillStyle = '#cc5533';
    ctx.fillRect(csx - 2, csy, 5, 3);
    const clawY = c.clawFrame === 0 ? -1 : 0;
    ctx.fillRect(csx - 4, csy + clawY, 2, 2);
    ctx.fillRect(csx + 5, csy + clawY, 2, 2);
    ctx.fillStyle = '#aa4422';
    ctx.fillRect(csx - 3, csy + 2, 1, 1);
    ctx.fillRect(csx + 5, csy + 2, 1, 1);
  }

  // Butterflies
  for (const b of butterflies) {
    const bsx = Math.floor(b.x - cam.x);
    const bsy = Math.floor(b.y - cam.y);
    if (bsx < -10 || bsx > V_WIDTH + 10 || bsy < -10 || bsy > V_HEIGHT + 10) continue;
    ctx.fillStyle = '#333';
    ctx.fillRect(bsx, bsy, 1, 3);
    ctx.fillStyle = b.color;
    const wingSpread = b.wingFrame === 0 ? 2 : b.wingFrame === 1 ? 1 : 0;
    ctx.fillRect(bsx - 2, bsy - wingSpread, 2, 2);
    ctx.fillRect(bsx + 1, bsy - wingSpread, 2, 2);
  }

  // ── Interaction hint ──
  if (nearBuilding) {
    const bx = Math.floor(nearBuilding.x * TILE_SIZE - cam.x);
    const by = Math.floor(nearBuilding.y * TILE_SIZE - cam.y);
    const bw = nearBuilding.w * TILE_SIZE;

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE', bx + bw / 2, by - 10);
  }

  // ── HUD: Discovery counter ──
  const hudText = `${discoveredCount}/${totalCount}`;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(V_WIDTH - 80, 4, 76, 14);
  ctx.fillStyle = '#FFD700';
  ctx.font = '7px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(hudText + ' found', V_WIDTH - 6, 14);

  // Gold star when era is 100% complete
  if (discoveredCount >= totalCount && totalCount > 0) {
    ctx.fillStyle = '#FFD700';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('\u2605', V_WIDTH - 80, 14);
  }

  // ── Minimap ──
  drawMinimap(ctx, player, buildings, cam, discoveredSet, npcs, era);

  // ── Blit to display canvas ──
  displayCtx.imageSmoothingEnabled = false;
  displayCtx.drawImage(offCanvas, 0, 0, displayCtx.canvas.width, displayCtx.canvas.height);
}

// ── Drawing helpers ──

function drawWater(ctx: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number, frame: number, pal: Palette) {
  const idx = ((tx + ty * 3 + frame) % 3 + 3) % 3;
  ctx.fillStyle = pal.water[idx];
  ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);

  // Wave highlight
  const waveOffset = (tx * 7 + ty * 13 + frame * 2) % 16;
  if (waveOffset < 4) {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(sx + waveOffset * 2, sy + 6, 6, 2);
  }
}

function drawTree(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, pal: Palette) {
  // Trunk
  ctx.fillStyle = pal.treeTrunk;
  ctx.fillRect(sx - 1, sy, 2, size + 2);

  // Canopy (simple circle approximation with rects)
  const r = size;
  ctx.fillStyle = pal.treeFoliage[0];
  ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
  // Lighter inner
  ctx.fillStyle = pal.treeFoliage[1];
  ctx.fillRect(sx - r + 2, sy - r + 1, r * 2 - 4, r * 2 - 3);
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  bx: number, by: number, bw: number, bh: number,
  building: BuildingDef,
  style: string | undefined,
  pal: Palette,
  isHighlighted: boolean,
) {
  // Highlight glow (pulsing)
  if (isHighlighted) {
    const pulse = 0.2 + Math.sin(Date.now() * 0.006) * 0.1;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  }

  // Interaction flash overlay
  if (isHighlighted && _interactionFlash > 0) {
    const alpha = _interactionFlash / 15 * 0.4;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  }

  // Wall
  let wallColor = pal.wall;
  let roofColor = pal.roof;

  switch (style) {
    case 'brick':
      wallColor = '#8B4513';
      roofColor = '#5a3010';
      break;
    case 'science':
      wallColor = '#e8e8e8';
      roofColor = '#aaaaaa';
      break;
    case 'landmark':
      wallColor = '#c0c0c0';
      roofColor = '#888888';
      break;
    case 'boat':
      // Draw boat shape instead
      drawBoat(ctx, bx, by, bw, bh, pal);
      return;
    case 'feature':
      drawFeature(ctx, bx, by, bw, bh, pal);
      return;
    case 'wood':
      wallColor = '#8B7355';
      roofColor = '#6B4226';
      break;
  }

  ctx.fillStyle = wallColor;
  ctx.fillRect(bx, by, bw, bh);

  // Roof (top strip)
  ctx.fillStyle = roofColor;
  ctx.fillRect(bx, by, bw, 4);

  // Door
  ctx.fillStyle = pal.door;
  const doorW = Math.min(6, bw / 3);
  ctx.fillRect(bx + bw / 2 - doorW / 2, by + bh - 8, doorW, 8);

  // Windows
  ctx.fillStyle = pal.windowColor;
  const winCount = Math.max(1, Math.floor(bw / 18));
  const winSpacing = bw / (winCount + 1);
  for (let i = 1; i <= winCount; i++) {
    const wx = bx + i * winSpacing - 3;
    ctx.fillRect(wx, by + 8, 5, 5);
    // Window frame
    if (bh > 24) {
      ctx.fillRect(wx, by + 18, 5, 5);
    }
  }

  // Water tower special shape
  if (style === 'landmark') {
    // Cylindrical top
    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(bx + 4, by - 6, bw - 8, 10);
    ctx.fillStyle = '#888888';
    ctx.fillRect(bx + 2, by - 8, bw - 4, 4);
    // Legs
    ctx.fillStyle = '#666666';
    ctx.fillRect(bx + 4, by + 4, 3, bh - 4);
    ctx.fillRect(bx + bw - 7, by + 4, 3, bh - 4);
  }
}

function drawBoat(ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number, pal: Palette) {
  // Hull
  ctx.fillStyle = '#654321';
  ctx.fillRect(bx + 2, by + bh / 2, bw - 4, bh / 2);
  // Deck
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(bx + 4, by + bh / 2 - 2, bw - 8, 4);
  // Mast/cabin
  ctx.fillStyle = '#fff';
  ctx.fillRect(bx + bw / 2 - 1, by, 2, bh / 2);
}

function drawFeature(ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number, pal: Palette) {
  // Generic feature: dashed border, semi-transparent fill
  ctx.fillStyle = 'rgba(180, 160, 120, 0.5)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = 'rgba(180, 160, 120, 0.8)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
  ctx.setLineDash([]);
}

function drawSeagull(ctx: CanvasRenderingContext2D, sx: number, sy: number, wingFrame: number) {
  ctx.fillStyle = '#ffffff';
  // Body
  ctx.fillRect(sx - 1, sy, 3, 2);
  // Wings
  const wingY = wingFrame === 0 ? -2 : wingFrame === 1 ? -1 : 0;
  ctx.fillRect(sx - 4, sy + wingY, 3, 1);
  ctx.fillRect(sx + 2, sy + wingY, 3, 1);
}

function drawPlayer(ctx: CanvasRenderingContext2D, sx: number, sy: number, dir: number, frame: number) {
  // Draw a 14x16 pixel scientist centered at (sx, sy)
  const ox = sx - 7;
  const oy = sy - 8;

  // Lab coat body (white with purple trim)
  ctx.fillStyle = '#f0f0f0'; // white coat
  ctx.fillRect(ox + 3, oy + 5, 8, 7);

  // Purple accent (collar/pocket)
  ctx.fillStyle = '#9333ea'; // lab-600
  ctx.fillRect(ox + 4, oy + 5, 6, 2);

  // Head (skin tone)
  ctx.fillStyle = '#deb887';
  ctx.fillRect(ox + 4, oy + 1, 6, 5);

  // Hair
  ctx.fillStyle = '#4a3020';
  if (dir === DIR.UP) {
    ctx.fillRect(ox + 4, oy, 6, 3);
  } else {
    ctx.fillRect(ox + 4, oy, 6, 2);
    // Eyes
    ctx.fillStyle = '#333';
    if (dir === DIR.LEFT) {
      ctx.fillRect(ox + 4, oy + 3, 2, 1);
    } else if (dir === DIR.RIGHT) {
      ctx.fillRect(ox + 8, oy + 3, 2, 1);
    } else {
      ctx.fillRect(ox + 5, oy + 3, 1, 1);
      ctx.fillRect(ox + 8, oy + 3, 1, 1);
    }
  }

  // Legs
  ctx.fillStyle = '#3a3a5a';
  if (frame === 0) {
    ctx.fillRect(ox + 4, oy + 12, 3, 4);
    ctx.fillRect(ox + 7, oy + 12, 3, 4);
  } else {
    ctx.fillRect(ox + 3, oy + 12, 3, 4);
    ctx.fillRect(ox + 8, oy + 12, 3, 4);
  }

  // Shoes
  ctx.fillStyle = '#222';
  if (frame === 0) {
    ctx.fillRect(ox + 4, oy + 15, 3, 1);
    ctx.fillRect(ox + 7, oy + 15, 3, 1);
  } else {
    ctx.fillRect(ox + 3, oy + 15, 3, 1);
    ctx.fillRect(ox + 8, oy + 15, 3, 1);
  }
}
