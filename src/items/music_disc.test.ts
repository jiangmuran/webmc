import { describe, it, expect } from 'vitest';
import {
  discById,
  discsBySource,
  insertDisc,
  makeJukebox,
  MUSIC_DISCS,
  tickJukebox,
} from './music_disc';

describe('music disc', () => {
  it('13 is a C418 disc', () => {
    expect(discById('13')?.composer).toBe('C418');
  });

  it('pigstep comes from nether fortress', () => {
    expect(discById('pigstep')?.source).toBe('nether_fortress');
  });

  it('unknown id returns null', () => {
    expect(discById('xyz')).toBeNull();
  });

  it('creeper skeleton kill discs include mall', () => {
    const ids = discsBySource('skeleton_kills_creeper').map((d) => d.id);
    expect(ids).toContain('mall');
  });

  it('there are at least 15 discs', () => {
    expect(MUSIC_DISCS.length).toBeGreaterThanOrEqual(15);
  });
});

describe('jukebox', () => {
  it('inserting a disc plays it', () => {
    const j = makeJukebox();
    expect(insertDisc(j, '13')).toBe(true);
    expect(j.currentDisc).toBe('13');
  });

  it('double-insert rejected', () => {
    const j = makeJukebox();
    insertDisc(j, '13');
    expect(insertDisc(j, 'cat')).toBe(false);
  });

  it('tick advances; finishes after duration', () => {
    const j = makeJukebox();
    insertDisc(j, '13');
    expect(tickJukebox(j, 100)).toBe('playing');
    expect(tickJukebox(j, 999)).toBe('finished');
  });

  it('empty jukebox = finished', () => {
    expect(tickJukebox(makeJukebox(), 1)).toBe('finished');
  });
});
