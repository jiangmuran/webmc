import { describe, it, expect } from 'vitest';
import { onBreak, onPlace } from './shulker_box_drop_contents';

describe('shulker drop contents', () => {
  it('normal break keeps contents', () => {
    const c = {
      items: [{ id: 'webmc:stone', count: 5 }, null, null],
      color: 'red',
    };
    const r = onBreak(c, { byExplosion: false, byCreative: false });
    expect(r.droppedBoxItem?.nbt?.items[0]?.count).toBe(5);
  });

  it('explosion scatters', () => {
    const c = {
      items: [
        { id: 'webmc:stone', count: 5 },
        { id: 'webmc:dirt', count: 1 },
      ],
      color: 'red',
    };
    const r = onBreak(c, { byExplosion: true, byCreative: false });
    expect(r.droppedLooseItems.length).toBe(2);
  });

  it('creative drops nothing', () => {
    const c = { items: [null, null], color: 'red' };
    const r = onBreak(c, { byExplosion: false, byCreative: true });
    expect(r.droppedBoxItem).toBeNull();
    expect(r.droppedLooseItems).toEqual([]);
  });

  it('place restores nbt', () => {
    const c = {
      items: [{ id: 'webmc:diamond', count: 1 }],
      color: 'red',
    };
    const placed = onPlace({ itemNbt: c });
    expect(placed.items[0]?.id).toBe('webmc:diamond');
  });

  it('place without nbt empty', () => {
    expect(onPlace({ itemNbt: null }).items.length).toBe(27);
  });
});
