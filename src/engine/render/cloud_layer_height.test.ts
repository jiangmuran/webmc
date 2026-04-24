import { describe, it, expect } from 'vitest';
import {
  cloudsVisible,
  cloudScrollSpeed,
  cloudColor,
  DEFAULT_CLOUD_HEIGHT,
} from './cloud_layer_height';

describe('cloud layer height', () => {
  it('clouds visible at surface', () => {
    expect(cloudsVisible(64, DEFAULT_CLOUD_HEIGHT)).toBe(true);
  });

  it('clouds invisible very far above', () => {
    expect(cloudsVisible(9999, DEFAULT_CLOUD_HEIGHT)).toBe(false);
  });

  it('scroll speed positive', () => {
    expect(cloudScrollSpeed()).toBeGreaterThan(0);
  });

  it('thunder clouds darker', () => {
    expect(cloudColor('thunder')[0]).toBeLessThan(cloudColor('clear')[0]);
  });

  it('clear clouds white', () => {
    const [r, g, b] = cloudColor('clear');
    expect(r === g && g === b).toBe(true);
  });
});
