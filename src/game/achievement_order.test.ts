import { describe, it, expect } from 'vitest';
import { childrenOf, unlockOrder, ACHIEVEMENTS } from './achievement_order';

describe('achievement order', () => {
  it('story branches from root', () => {
    expect(childrenOf('root/story').length).toBeGreaterThan(0);
  });

  it('kill dragon has parent', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'end/kill_dragon');
    expect(a?.parent).toBe('story/enter_the_end');
  });

  it('unlock order starts with root', () => {
    expect(unlockOrder()[0]).toBe('root/story');
  });

  it('parents before children', () => {
    const order = unlockOrder();
    expect(order.indexOf('story/smelt_iron')).toBeLessThan(order.indexOf('story/obtain_armor'));
  });

  it('all achievements in order', () => {
    expect(new Set(unlockOrder()).size).toBe(ACHIEVEMENTS.length);
  });
});
