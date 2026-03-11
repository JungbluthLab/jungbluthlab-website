import { MAP_W, MAP_H, TILE_SIZE } from './constants';

export interface Seagull {
  x: number;
  y: number;
  dx: number;
  dy: number;
  wingFrame: number;
  wingTimer: number;
}

// Simple seeded random
function srand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function createSeagulls(count: number): Seagull[] {
  const rand = srand(77);
  const gulls: Seagull[] = [];

  for (let i = 0; i < count; i++) {
    // Start over water area (right side of map)
    gulls.push({
      x: (80 + rand() * 35) * TILE_SIZE,
      y: (5 + rand() * 80) * TILE_SIZE,
      dx: (rand() - 0.5) * 0.4,
      dy: (rand() - 0.5) * 0.2,
      wingFrame: 0,
      wingTimer: Math.floor(rand() * 20),
    });
  }

  return gulls;
}

export function updateSeagulls(gulls: Seagull[]) {
  const maxX = MAP_W * TILE_SIZE;
  const maxY = MAP_H * TILE_SIZE;

  for (const g of gulls) {
    g.x += g.dx;
    g.y += g.dy;

    // Wing animation
    g.wingTimer++;
    if (g.wingTimer >= 15) {
      g.wingTimer = 0;
      g.wingFrame = (g.wingFrame + 1) % 3;
    }

    // Gentle direction drift
    g.dx += (Math.random() - 0.5) * 0.02;
    g.dy += (Math.random() - 0.5) * 0.01;

    // Clamp speed
    g.dx = Math.max(-0.5, Math.min(0.5, g.dx));
    g.dy = Math.max(-0.3, Math.min(0.3, g.dy));

    // Wrap around
    if (g.x < 60 * TILE_SIZE) g.x = maxX - TILE_SIZE;
    if (g.x > maxX) g.x = 60 * TILE_SIZE;
    if (g.y < 0) g.y = maxY - TILE_SIZE;
    if (g.y > maxY) g.y = TILE_SIZE;
  }
}

// ── Fish (jump out of water briefly) ──
export interface Fish {
  x: number;
  y: number;
  jumpTimer: number;
  jumpInterval: number;
  jumpPhase: number;
}

export function createFish(count: number): Fish[] {
  const rand = srand(91);
  const fish: Fish[] = [];
  for (let i = 0; i < count; i++) {
    fish.push({
      x: (70 + rand() * 45) * TILE_SIZE,
      y: (5 + rand() * 85) * TILE_SIZE,
      jumpTimer: Math.floor(rand() * 200),
      jumpInterval: 120 + Math.floor(rand() * 200),
      jumpPhase: 0,
    });
  }
  return fish;
}

export function updateFish(fish: Fish[]) {
  for (const f of fish) {
    f.jumpTimer++;
    if (f.jumpTimer >= f.jumpInterval) {
      f.jumpTimer = 0;
      f.jumpPhase = 1;
    }
    if (f.jumpPhase > 0) {
      f.jumpPhase++;
      if (f.jumpPhase > 10) f.jumpPhase = 0;
    }
  }
}

// ── Crabs (scuttle on sand tiles) ──
export interface Crab {
  x: number;
  y: number;
  dx: number;
  moveTimer: number;
  clawFrame: number;
  clawTimer: number;
}

export function createCrabs(count: number, map: number[][]): Crab[] {
  const rand = srand(63);
  const crabs: Crab[] = [];
  const sandTiles: [number, number][] = [];
  for (let ty = 0; ty < map.length; ty++) {
    for (let tx = 0; tx < map[0].length; tx++) {
      if (map[ty][tx] === 4) sandTiles.push([tx, ty]); // TILE.SAND = 4
    }
  }
  for (let i = 0; i < count && sandTiles.length > 0; i++) {
    const [tx, ty] = sandTiles[Math.floor(rand() * sandTiles.length)];
    crabs.push({
      x: tx * TILE_SIZE + rand() * TILE_SIZE,
      y: ty * TILE_SIZE + rand() * TILE_SIZE,
      dx: (rand() > 0.5 ? 1 : -1) * 0.2,
      moveTimer: Math.floor(rand() * 60),
      clawFrame: 0,
      clawTimer: Math.floor(rand() * 30),
    });
  }
  return crabs;
}

export function updateCrabs(crabs: Crab[]) {
  for (const c of crabs) {
    c.moveTimer++;
    if (c.moveTimer > 40) {
      c.moveTimer = 0;
      c.dx = -c.dx;
    }
    c.x += c.dx;
    c.clawTimer++;
    if (c.clawTimer > 20) {
      c.clawTimer = 0;
      c.clawFrame = (c.clawFrame + 1) % 2;
    }
  }
}

// ── Butterflies (flutter over hillside grass) ──
export interface Butterfly {
  x: number;
  y: number;
  dx: number;
  dy: number;
  wingFrame: number;
  wingTimer: number;
  color: string;
}

export function createButterflies(count: number): Butterfly[] {
  const rand = srand(55);
  const colors = ['#FFD700', '#FF6B9D', '#87CEEB', '#FFA500'];
  const butterflies: Butterfly[] = [];
  for (let i = 0; i < count; i++) {
    butterflies.push({
      x: (10 + rand() * 20) * TILE_SIZE,
      y: (25 + rand() * 55) * TILE_SIZE,
      dx: (rand() - 0.5) * 0.3,
      dy: (rand() - 0.5) * 0.2,
      wingFrame: 0,
      wingTimer: Math.floor(rand() * 10),
      color: colors[Math.floor(rand() * colors.length)],
    });
  }
  return butterflies;
}

export function updateButterflies(butterflies: Butterfly[]) {
  for (const b of butterflies) {
    b.x += b.dx;
    b.y += b.dy;
    b.wingTimer++;
    if (b.wingTimer >= 8) {
      b.wingTimer = 0;
      b.wingFrame = (b.wingFrame + 1) % 3;
    }
    b.dx += (Math.random() - 0.5) * 0.04;
    b.dy += (Math.random() - 0.5) * 0.03;
    b.dx = Math.max(-0.4, Math.min(0.4, b.dx));
    b.dy = Math.max(-0.3, Math.min(0.3, b.dy));
    if (b.x < 8 * TILE_SIZE) b.dx = Math.abs(b.dx);
    if (b.x > 30 * TILE_SIZE) b.dx = -Math.abs(b.dx);
    if (b.y < 20 * TILE_SIZE) b.dy = Math.abs(b.dy);
    if (b.y > 80 * TILE_SIZE) b.dy = -Math.abs(b.dy);
  }
}

// ── Perching Birds (sit on trees, fly between them) ──
export interface PerchBird {
  x: number;
  y: number;
  perchTimer: number;
  flying: boolean;
  targetX: number;
  targetY: number;
  wingFrame: number;
  wingTimer: number;
  color: string;
}

export function createPerchBirds(count: number, treePosArray: { x: number; y: number }[]): PerchBird[] {
  const rand = srand(33);
  const colors = ['#5a3a1a', '#3a3a3a', '#6a4a2a', '#4a3020'];
  const birds: PerchBird[] = [];
  for (let i = 0; i < count && treePosArray.length > 0; i++) {
    const tree = treePosArray[Math.floor(rand() * treePosArray.length)];
    birds.push({
      x: tree.x,
      y: tree.y - 4, // perch on top of canopy
      perchTimer: 120 + Math.floor(rand() * 180),
      flying: false,
      targetX: tree.x,
      targetY: tree.y - 4,
      wingFrame: 0,
      wingTimer: 0,
      color: colors[Math.floor(rand() * colors.length)],
    });
  }
  return birds;
}

export function updatePerchBirds(birds: PerchBird[], treePosArray: { x: number; y: number }[]) {
  for (const b of birds) {
    if (b.flying) {
      // Fly toward target
      const dx = b.targetX - b.x;
      const dy = b.targetY - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) {
        b.flying = false;
        b.x = b.targetX;
        b.y = b.targetY;
        b.perchTimer = 120 + Math.floor(Math.random() * 180);
      } else {
        b.x += (dx / dist) * 0.8;
        b.y += (dy / dist) * 0.8;
      }
      // Wing animation while flying
      b.wingTimer++;
      if (b.wingTimer >= 10) {
        b.wingTimer = 0;
        b.wingFrame = (b.wingFrame + 1) % 3;
      }
    } else {
      // Perching — count down to next flight
      b.perchTimer--;
      if (b.perchTimer <= 0 && treePosArray.length > 0) {
        const target = treePosArray[Math.floor(Math.random() * treePosArray.length)];
        b.targetX = target.x;
        b.targetY = target.y - 4;
        b.flying = true;
      }
    }
  }
}

// ── Deer (graze on hillside) ──
export interface Deer {
  x: number;
  y: number;
  dx: number;
  state: 'graze' | 'walk';
  stateTimer: number;
  frame: number;
  frameTimer: number;
}

export function createDeer(count: number): Deer[] {
  const rand = srand(17);
  const deer: Deer[] = [];
  for (let i = 0; i < count; i++) {
    deer.push({
      x: (12 + rand() * 8) * TILE_SIZE,
      y: (35 + rand() * 30) * TILE_SIZE,
      dx: 0,
      state: 'graze',
      stateTimer: 60 + Math.floor(rand() * 120),
      frame: 0,
      frameTimer: 0,
    });
  }
  return deer;
}

export function updateDeer(deer: Deer[]) {
  for (const d of deer) {
    d.stateTimer--;
    if (d.stateTimer <= 0) {
      if (d.state === 'graze') {
        d.state = 'walk';
        d.dx = (Math.random() > 0.5 ? 1 : -1) * 0.3;
        d.stateTimer = 40 + Math.floor(Math.random() * 60);
      } else {
        d.state = 'graze';
        d.dx = 0;
        d.stateTimer = 60 + Math.floor(Math.random() * 120);
      }
    }
    if (d.state === 'walk') {
      d.x += d.dx;
      d.frameTimer++;
      if (d.frameTimer >= 15) {
        d.frameTimer = 0;
        d.frame = (d.frame + 1) % 2;
      }
      // Keep on hillside
      if (d.x < 10 * TILE_SIZE) d.dx = Math.abs(d.dx);
      if (d.x > 20 * TILE_SIZE) d.dx = -Math.abs(d.dx);
    }
  }
}
