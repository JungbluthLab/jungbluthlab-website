// Tile size in virtual pixels
export const TILE_SIZE = 16;

// Map dimensions in tiles
export const MAP_W = 120;
export const MAP_H = 100;

// Virtual (offscreen) canvas resolution — 3:2 aspect ratio
export const V_WIDTH = 384;
export const V_HEIGHT = 256;

// Player
export const PLAYER_SPEED = 1.6;
export const INTERACT_RANGE = 2.5; // tiles

// Tile types
export const TILE = {
  WATER: 0,
  GRASS: 1,
  ROAD: 2,
  CONCRETE: 3,
  SAND: 4,
  HILL_GRASS: 5,
} as const;

export type EraId = 'codfish' | 'navy' | 'modern';

export const WALKABLE_TILES = new Set([
  TILE.GRASS, TILE.ROAD, TILE.CONCRETE, TILE.SAND, TILE.HILL_GRASS,
]);

// Direction constants
export const DIR = { DOWN: 0, UP: 1, LEFT: 2, RIGHT: 3 } as const;

// Per-era color palettes
export interface Palette {
  grass: string;
  grassAlt: string;
  hillGrass: string;
  hillGrassAlt: string;
  road: string;
  roadLine: string;
  concrete: string;
  concreteAlt: string;
  sand: string;
  water: [string, string, string];
  treeFoliage: [string, string];
  treeTrunk: string;
  wall: string;
  roof: string;
  door: string;
  windowColor: string;
}

export const PALETTES: Record<EraId, Palette> = {
  modern: {
    grass: '#4a7c3f',
    grassAlt: '#427335',
    hillGrass: '#3a6632',
    hillGrassAlt: '#33592b',
    road: '#6b6b6b',
    roadLine: '#8a8a4a',
    concrete: '#9a9a9a',
    concreteAlt: '#909090',
    sand: '#d4c89a',
    water: ['#1a6bc4', '#1e78d8', '#2285e8'],
    treeFoliage: ['#2d5a27', '#3a7a32'],
    treeTrunk: '#5a3a1a',
    wall: '#b8a88c',
    roof: '#7a6a52',
    door: '#4a3520',
    windowColor: '#87CEEB',
  },
  navy: {
    grass: '#3a6632',
    grassAlt: '#33592b',
    hillGrass: '#2e5528',
    hillGrassAlt: '#274a22',
    road: '#555555',
    roadLine: '#777740',
    concrete: '#808080',
    concreteAlt: '#767676',
    sand: '#bbb88a',
    water: ['#1a5a9a', '#1e66aa', '#2272bb'],
    treeFoliage: ['#1e4a1a', '#2a6624'],
    treeTrunk: '#4a2a12',
    wall: '#6a7a8a',
    roof: '#4a5a6a',
    door: '#3a3a3a',
    windowColor: '#7ab8d8',
  },
  codfish: {
    grass: '#6a7a4a',
    grassAlt: '#60703f',
    hillGrass: '#5a6a3a',
    hillGrassAlt: '#506030',
    road: '#8a7a5a',
    roadLine: '#9a8a60',
    concrete: '#9a8a6a',
    concreteAlt: '#907f60',
    sand: '#c4b87a',
    water: ['#3a6a8a', '#4a7a9a', '#5a8aaa'],
    treeFoliage: ['#4a6a3a', '#5a7a4a'],
    treeTrunk: '#6a4a2a',
    wall: '#9a8a6a',
    roof: '#7a6a4a',
    door: '#5a4a30',
    windowColor: '#a0b0a0',
  },
};
