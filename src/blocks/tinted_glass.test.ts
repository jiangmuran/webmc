import { describe, it, expect } from 'vitest';
import {
  blocksLight,
  opaque,
  dropsSelfNoSilkTouchRequired,
  craftRequiresAmethyst,
} from './tinted_glass';

describe('tinted glass', () => {
  it('blocks light', () => {
    expect(blocksLight()).toBe(true);
  });

  it('not opaque', () => {
    expect(opaque()).toBe(false);
  });

  it('drops self bare-handed', () => {
    expect(dropsSelfNoSilkTouchRequired()).toBe(true);
  });

  it('amethyst recipe', () => {
    expect(craftRequiresAmethyst()).toBe(4);
  });
});
