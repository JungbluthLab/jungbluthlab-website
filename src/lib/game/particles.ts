export interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  size: number;
}

const MAX_PARTICLES = 30;
const particles: Particle[] = [];

export function spawnDust(x: number, y: number) {
  if (particles.length >= MAX_PARTICLES) return;
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      life: 12 + Math.floor(Math.random() * 8),
      maxLife: 20,
      size: 1 + Math.random(),
    });
  }
}

export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

export function getParticles(): readonly Particle[] {
  return particles;
}
