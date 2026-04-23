import { describe, it, expect } from 'vitest';
import { currentVector } from './water_current';

describe('water current', () => {
  it('east drain pulls east', () => {
    const v = currentVector([
      { level: 0, downflow: false },
      { level: 0, downflow: false },
      { level: 5, downflow: false },
      { level: 0, downflow: false },
    ]);
    expect(v.dx).toBeLessThan(0);
  });

  it('still water no push', () => {
    const v = currentVector([
      { level: 0, downflow: false },
      { level: 0, downflow: false },
      { level: 0, downflow: false },
      { level: 0, downflow: false },
    ]);
    expect(v.dx).toBe(0);
    expect(v.dz).toBe(0);
  });

  it('bad input 0 vector', () => {
    expect(currentVector([])).toEqual({ dx: 0, dz: 0 });
  });
});
