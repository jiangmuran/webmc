import { describe, it, expect } from 'vitest';
import { chargeAnchor, makeAnchor, shouldExplodeOnUse, useAnchor } from './respawn_anchor';

describe('respawn anchor', () => {
  it('charges up to 4', () => {
    const a = makeAnchor();
    for (let i = 0; i < 4; i++) expect(chargeAnchor(a)).toBe(true);
    expect(chargeAnchor(a)).toBe(false);
    expect(a.charges).toBe(4);
  });

  it('works in nether + consumes a charge', () => {
    const a = makeAnchor();
    a.charges = 3;
    const r = useAnchor({ dimension: 'nether', anchor: a });
    expect(r.usable).toBe(true);
    expect(r.chargesAfter).toBe(2);
  });

  it('refuses in overworld', () => {
    const a = makeAnchor();
    a.charges = 3;
    const r = useAnchor({ dimension: 'overworld', anchor: a });
    expect(r.usable).toBe(false);
    expect(r.reason).toBe('wrong_dimension');
  });

  it('refuses when uncharged', () => {
    const a = makeAnchor();
    const r = useAnchor({ dimension: 'nether', anchor: a });
    expect(r.usable).toBe(false);
    expect(r.reason).toBe('no_charge');
  });

  it('non-nether use triggers explosion (wiki: overworld AND end)', () => {
    expect(shouldExplodeOnUse('overworld')).toBe(true);
    expect(shouldExplodeOnUse('end')).toBe(true);
    expect(shouldExplodeOnUse('nether')).toBe(false);
  });
});
