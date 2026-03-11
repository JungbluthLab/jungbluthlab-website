import { MAP_W, MAP_H, TILE } from './constants';

export type TileGrid = number[][];

export interface TreeDef {
  x: number; // pixel x
  y: number; // pixel y
  size: number; // canopy radius 3-6
}

// Simple seeded pseudo-random for deterministic generation
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function fillRect(grid: TileGrid, x1: number, y1: number, x2: number, y2: number, tile: number) {
  for (let y = Math.max(0, y1); y < Math.min(MAP_H, y2); y++) {
    for (let x = Math.max(0, x1); x < Math.min(MAP_W, x2); x++) {
      grid[y][x] = tile;
    }
  }
}

export function generateMap(): TileGrid {
  // Initialize with water
  const grid: TileGrid = [];
  for (let y = 0; y < MAP_H; y++) {
    grid[y] = new Array(MAP_W).fill(TILE.WATER);
  }

  // ── Main landmass (peninsula narrowing northward) ──
  // North tip (narrow)
  fillRect(grid, 30, 3, 44, 8, TILE.GRASS);
  // Upper bluff
  fillRect(grid, 24, 8, 50, 15, TILE.GRASS);
  // North campus
  fillRect(grid, 18, 15, 54, 25, TILE.GRASS);
  // Mid-north campus
  fillRect(grid, 14, 25, 58, 38, TILE.GRASS);
  // Central campus
  fillRect(grid, 10, 38, 60, 55, TILE.GRASS);
  // South campus
  fillRect(grid, 8, 55, 62, 72, TILE.GRASS);
  // South gate area
  fillRect(grid, 8, 72, 54, 85, TILE.GRASS);
  // Paradise Drive tail
  fillRect(grid, 10, 85, 42, 92, TILE.GRASS);

  // Carve water for irregular coastline
  // NE coast indent
  fillRect(grid, 50, 15, 58, 30, TILE.WATER);
  // SE coast indent (south of slab)
  fillRect(grid, 56, 72, 62, 82, TILE.WATER);

  // ── The Slab (concrete wharf on eastern waterfront) ──
  fillRect(grid, 52, 36, 84, 68, TILE.CONCRETE);

  // Pier/wharf extending east into the bay
  fillRect(grid, 80, 44, 96, 60, TILE.CONCRETE);

  // ── Hillside (steep western slope) ──
  fillRect(grid, 8, 25, 20, 85, TILE.HILL_GRASS);
  fillRect(grid, 14, 15, 22, 25, TILE.HILL_GRASS);

  // ── Roads ──
  // Paradise Drive (curves along SW edge)
  fillRect(grid, 12, 24, 15, 82, TILE.ROAD);
  // Curves southeast at bottom toward south gate (3150)
  fillRect(grid, 15, 82, 22, 88, TILE.ROAD);
  // Short spur at top toward north gate (3152)
  fillRect(grid, 14, 22, 18, 24, TILE.ROAD);

  // North gate road (3152): E from gate to upper campus
  fillRect(grid, 15, 26, 33, 28, TILE.ROAD);

  // South gate road (3150): NE diagonal from gate to campus center
  // "The two paved main roadways merge near Building 11"
  fillRect(grid, 16, 76, 22, 79, TILE.ROAD);
  fillRect(grid, 20, 68, 23, 76, TILE.ROAD);
  fillRect(grid, 23, 60, 26, 68, TILE.ROAD);
  fillRect(grid, 26, 54, 30, 60, TILE.ROAD);

  // Main N-S campus spine connecting the two gate roads
  fillRect(grid, 30, 28, 33, 56, TILE.ROAD);

  // E-W slab access: campus center to slab (at Bldg 36 level)
  fillRect(grid, 33, 50, 52, 52, TILE.ROAD);

  // Road along slab south edge
  fillRect(grid, 40, 60, 56, 62, TILE.ROAD);

  // ── Angel Island (visible in bay to the east) ──
  fillRect(grid, 100, 20, 116, 40, TILE.HILL_GRASS);
  fillRect(grid, 103, 17, 113, 20, TILE.HILL_GRASS);
  fillRect(grid, 103, 40, 113, 43, TILE.HILL_GRASS);

  // ── Bridge to Angel Island ──
  // Road bridge from east edge of slab (x=84) to Angel Island (x=100) at y=38-39
  fillRect(grid, 84, 38, 100, 40, TILE.ROAD);

  // Small path loop on Angel Island
  fillRect(grid, 103, 30, 106, 38, TILE.ROAD);
  fillRect(grid, 106, 28, 112, 30, TILE.ROAD);
  fillRect(grid, 112, 30, 114, 38, TILE.ROAD);

  // ── Sand borders (where land meets water) ──
  addSandBorder(grid);

  return grid;
}

function addSandBorder(grid: TileGrid) {
  const landTypes = new Set([TILE.GRASS, TILE.HILL_GRASS, TILE.CONCRETE, TILE.ROAD]);
  // Collect tiles to change (don't modify while iterating)
  const toSand: [number, number][] = [];

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (grid[y][x] !== TILE.WATER) continue;
      let nearLand = false;
      for (let dy = -1; dy <= 1 && !nearLand; dy++) {
        for (let dx = -1; dx <= 1 && !nearLand; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < MAP_H && nx >= 0 && nx < MAP_W && landTypes.has(grid[ny][nx])) {
            nearLand = true;
          }
        }
      }
      if (nearLand) toSand.push([y, x]);
    }
  }
  for (const [y, x] of toSand) {
    grid[y][x] = TILE.SAND;
  }
}

/** Generate decorative tree positions on hillside tiles */
export function generateTrees(grid: TileGrid): TreeDef[] {
  const rand = seededRand(42);
  const trees: TreeDef[] = [];

  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      if (grid[ty][tx] !== TILE.HILL_GRASS) continue;
      // ~25% chance of tree on hillside tiles
      if (rand() > 0.25) continue;

      // Skip Angel Island interior (just edge trees)
      if (tx > 100) {
        if (rand() > 0.15) continue;
      }

      trees.push({
        x: tx * 16 + 4 + Math.floor(rand() * 8),
        y: ty * 16 + 4 + Math.floor(rand() * 8),
        size: 3 + Math.floor(rand() * 4), // canopy radius 3-6
      });
    }
  }

  // Add scattered campus trees (on grass near buildings)
  for (let ty = 20; ty < 80; ty++) {
    for (let tx = 22; tx < 55; tx++) {
      if (grid[ty][tx] !== TILE.GRASS) continue;
      if (rand() > 0.04) continue; // ~4% chance
      trees.push({
        x: tx * 16 + 4 + Math.floor(rand() * 8),
        y: ty * 16 + 4 + Math.floor(rand() * 8),
        size: 3 + Math.floor(rand() * 3),
      });
    }
  }

  return trees;
}
