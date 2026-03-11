import { TILE_SIZE, PLAYER_SPEED, DIR } from './constants';
import type { PlayerState } from './player';

interface TourStop {
  buildingId: string;
  tileX: number;
  tileY: number;
}

const TOUR_STOPS: TourStop[] = [
  { buildingId: 'bldg20', tileX: 23, tileY: 80 },
  { buildingId: 'bldg49', tileX: 20, tileY: 57 },
  { buildingId: 'bldg33', tileX: 28, tileY: 45 },
  { buildingId: 'bldg75', tileX: 36, tileY: 44 },
  { buildingId: 'bldg30', tileX: 33, tileY: 38 },
  { buildingId: 'bldg39', tileX: 20, tileY: 28 },
  { buildingId: 'bldg53', tileX: 38, tileY: 13 },
  { buildingId: 'bldg22', tileX: 58, tileY: 44 },
  { buildingId: 'bldg36', tileX: 48, tileY: 52 },
  { buildingId: 'bldg54', tileX: 54, tileY: 62 },
  { buildingId: 'boatramp', tileX: 70, tileY: 64 },
];

let active = false;
let currentStop = 0;
let arrivedAtStop = false;

export function isTourActive(): boolean { return active; }

export function startTour() {
  active = true;
  currentStop = 0;
  arrivedAtStop = false;
}

export function stopTour() {
  active = false;
}

export function updateTour(player: PlayerState): string | null {
  if (!active || currentStop >= TOUR_STOPS.length) {
    active = false;
    return null;
  }

  if (arrivedAtStop) return null;

  const stop = TOUR_STOPS[currentStop];
  const targetX = stop.tileX * TILE_SIZE + TILE_SIZE / 2;
  const targetY = stop.tileY * TILE_SIZE + TILE_SIZE / 2;
  const dx = targetX - player.x;
  const dy = targetY - player.y;
  const dist = Math.hypot(dx, dy);

  if (dist < TILE_SIZE) {
    arrivedAtStop = true;
    return stop.buildingId;
  }

  const nx = dx / dist;
  const ny = dy / dist;
  player.x += nx * PLAYER_SPEED;
  player.y += ny * PLAYER_SPEED;

  if (Math.abs(nx) > Math.abs(ny)) {
    player.dir = nx > 0 ? DIR.RIGHT : DIR.LEFT;
  } else {
    player.dir = ny > 0 ? DIR.DOWN : DIR.UP;
  }

  player.moving = true;
  player.frameTimer++;
  if (player.frameTimer >= 10) {
    player.frameTimer = 0;
    player.frame = (player.frame + 1) % 2;
  }

  return null;
}

export function advanceTourStop() {
  currentStop++;
  arrivedAtStop = false;
  if (currentStop >= TOUR_STOPS.length) {
    active = false;
  }
}
