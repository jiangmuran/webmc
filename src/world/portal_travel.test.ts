import { describe, it, expect } from 'vitest';
import { makePortalTravel, tickPortalTravel } from './portal_travel';

describe('portal travel', () => {
  it('takes 4 seconds to travel from overworld', () => {
    const s = makePortalTravel('overworld');
    let travelled = false;
    for (let i = 0; i < 100; i++) {
      if (tickPortalTravel(s, { insidePortal: true, creative: false, dtSec: 0.1 }).travel) {
        travelled = true;
        break;
      }
    }
    expect(travelled).toBe(true);
    expect(s.dimension).toBe('nether');
  });

  it('creative is instant', () => {
    const s = makePortalTravel('overworld');
    const r = tickPortalTravel(s, { insidePortal: true, creative: true, dtSec: 0.05 });
    expect(r.travel).toBe(true);
  });

  it('stepping out cancels progress', () => {
    const s = makePortalTravel('overworld');
    tickPortalTravel(s, { insidePortal: true, creative: false, dtSec: 2 });
    tickPortalTravel(s, { insidePortal: false, creative: false, dtSec: 0.1 });
    expect(s.portalTicks).toBe(0);
  });

  it('post-travel cooldown prevents instant re-travel', () => {
    const s = makePortalTravel('overworld');
    for (let i = 0; i < 50; i++) {
      tickPortalTravel(s, { insidePortal: true, creative: false, dtSec: 0.1 });
    }
    // Now in nether; travelling back requires waiting 10s.
    for (let i = 0; i < 20; i++) {
      tickPortalTravel(s, { insidePortal: true, creative: false, dtSec: 0.1 });
    }
    expect(s.dimension).toBe('nether');
  });
});
