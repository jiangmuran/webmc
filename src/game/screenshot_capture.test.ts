import { describe, it, expect } from 'vitest';
import { screenshotFilename, resolveCollision } from './screenshot_capture';

describe('screenshot filename', () => {
  it('formats padded', () => {
    const d = new Date(2026, 3, 5, 9, 2, 8);
    expect(screenshotFilename(d)).toBe('2026-04-05_09.02.08.png');
  });

  it('collision adds suffix', () => {
    const existing = new Set(['a.png', 'a_1.png']);
    expect(resolveCollision('a.png', existing)).toBe('a_2.png');
  });

  it('no collision = original', () => {
    expect(resolveCollision('b.png', new Set())).toBe('b.png');
  });
});
