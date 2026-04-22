import { describe, it, expect } from 'vitest';
import { bedInteraction } from './bed_dimension';

describe('bed dimension', () => {
  it('overworld sleeps', () => {
    const r = bedInteraction({ dimension: 'overworld' });
    expect(r.allowsSleep).toBe(true);
    expect(r.explodes).toBe(false);
  });

  it('nether explodes', () => {
    const r = bedInteraction({ dimension: 'nether' });
    expect(r.explodes).toBe(true);
    expect(r.explosionPower).toBe(5);
  });

  it('end explodes', () => {
    const r = bedInteraction({ dimension: 'end' });
    expect(r.explodes).toBe(true);
  });
});
