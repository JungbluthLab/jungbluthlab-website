import { V_WIDTH, V_HEIGHT, MAP_W, MAP_H, TILE_SIZE } from './constants';

export interface CameraState {
  x: number;
  y: number;
}

export function createCamera(): CameraState {
  return { x: 0, y: 0 };
}

export function updateCamera(cam: CameraState, targetX: number, targetY: number) {
  // Center camera on target
  const goalX = targetX - V_WIDTH / 2;
  const goalY = targetY - V_HEIGHT / 2;

  // Smooth lerp follow
  cam.x += (goalX - cam.x) * 0.12;
  cam.y += (goalY - cam.y) * 0.12;

  // Clamp to map bounds
  const maxX = MAP_W * TILE_SIZE - V_WIDTH;
  const maxY = MAP_H * TILE_SIZE - V_HEIGHT;
  cam.x = Math.max(0, Math.min(maxX, cam.x));
  cam.y = Math.max(0, Math.min(maxY, cam.y));
}
