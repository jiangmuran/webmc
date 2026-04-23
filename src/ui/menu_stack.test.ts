import { describe, it, expect } from 'vitest';
import { makeStack, push, pop, top, pausesWorld, clear, depth } from './menu_stack';

describe('menu stack', () => {
  it('empty top null', () => {
    expect(top(makeStack())).toBeNull();
  });

  it('push + top', () => {
    const s = makeStack();
    push(s, { id: 'pause', pausesWorld: true });
    expect(top(s)?.id).toBe('pause');
  });

  it('pop returns last', () => {
    const s = makeStack();
    push(s, { id: 'a', pausesWorld: false });
    push(s, { id: 'b', pausesWorld: false });
    expect(pop(s)?.id).toBe('b');
  });

  it('pauses if any screen pauses', () => {
    const s = makeStack();
    push(s, { id: 'hud', pausesWorld: false });
    push(s, { id: 'pause', pausesWorld: true });
    expect(pausesWorld(s)).toBe(true);
  });

  it('clear empties', () => {
    const s = makeStack();
    push(s, { id: 'a', pausesWorld: false });
    clear(s);
    expect(depth(s)).toBe(0);
  });
});
