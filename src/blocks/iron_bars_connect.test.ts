import { describe, it, expect } from 'vitest';
import { connectionsFor, shapeFor, type NeighborQuery } from './iron_bars_connect';

function q(
  over: Partial<
    Record<'north' | 'south' | 'east' | 'west', { fullBlock: boolean; sameMaterial: boolean }>
  > = {},
): NeighborQuery {
  const empty = { fullBlock: false, sameMaterial: false };
  return {
    neighbor: {
      north: { ...empty, ...over.north },
      south: { ...empty, ...over.south },
      east: { ...empty, ...over.east },
      west: { ...empty, ...over.west },
    },
  };
}

describe('iron bars connect', () => {
  it('isolated = post', () => {
    expect(shapeFor(connectionsFor(q()))).toBe('post');
  });

  it('ns straight', () => {
    expect(
      shapeFor(
        connectionsFor(
          q({
            north: { fullBlock: true, sameMaterial: false },
            south: { fullBlock: true, sameMaterial: false },
          }),
        ),
      ),
    ).toBe('straight_ns');
  });

  it('cross', () => {
    const conn = connectionsFor(
      q({
        north: { fullBlock: true, sameMaterial: false },
        south: { fullBlock: true, sameMaterial: false },
        east: { fullBlock: true, sameMaterial: false },
        west: { fullBlock: true, sameMaterial: false },
      }),
    );
    expect(shapeFor(conn)).toBe('cross');
  });

  it('corner', () => {
    const conn = connectionsFor(
      q({
        north: { fullBlock: true, sameMaterial: false },
        east: { fullBlock: true, sameMaterial: false },
      }),
    );
    expect(shapeFor(conn)).toBe('corner');
  });

  it('same material counts', () => {
    const conn = connectionsFor(q({ north: { fullBlock: false, sameMaterial: true } }));
    expect(conn.has('north')).toBe(true);
  });
});
