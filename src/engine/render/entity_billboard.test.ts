import { describe, it, expect } from 'vitest';
import { computeBillboard, projectToNdc } from './entity_billboard';

const BASE = {
  entityPos: { x: 0, y: 64, z: 5 },
  entityHeight: 1.8,
  cameraPos: { x: 0, y: 65, z: 0 },
  cameraForward: { x: 0, y: 0, z: 1 },
  sneaking: false,
  invisible: false,
};

describe('entity billboard', () => {
  it('visible when in front and close', () => {
    const r = computeBillboard(BASE);
    expect(r.visible).toBe(true);
    expect(r.opacity).toBe(1);
  });

  it('invisible entity hidden', () => {
    const r = computeBillboard({ ...BASE, invisible: true });
    expect(r.visible).toBe(false);
  });

  it('behind camera hidden', () => {
    const r = computeBillboard({
      ...BASE,
      cameraForward: { x: 0, y: 0, z: -1 },
    });
    expect(r.visible).toBe(false);
  });

  it('far entity hidden', () => {
    const r = computeBillboard({
      ...BASE,
      entityPos: { x: 0, y: 64, z: 100 },
    });
    expect(r.visible).toBe(false);
  });

  it('sneak shrinks range', () => {
    const r = computeBillboard({
      ...BASE,
      entityPos: { x: 0, y: 64, z: 50 },
      sneaking: true,
    });
    expect(r.visible).toBe(false);
  });
});

describe('projectToNdc', () => {
  it('returns null for points behind camera', () => {
    const r = projectToNdc({
      worldPos: { x: 0, y: 0, z: -5 },
      cameraPos: { x: 0, y: 0, z: 0 },
      cameraForward: { x: 0, y: 0, z: 1 },
      cameraUp: { x: 0, y: 1, z: 0 },
      fovRadians: Math.PI / 2,
      aspect: 16 / 9,
    });
    expect(r).toBeNull();
  });

  it('projects centered forward point', () => {
    const r = projectToNdc({
      worldPos: { x: 0, y: 0, z: 5 },
      cameraPos: { x: 0, y: 0, z: 0 },
      cameraForward: { x: 0, y: 0, z: 1 },
      cameraUp: { x: 0, y: 1, z: 0 },
      fovRadians: Math.PI / 2,
      aspect: 1,
    });
    expect(r?.x).toBeCloseTo(0);
    expect(r?.y).toBeCloseTo(0);
  });
});
