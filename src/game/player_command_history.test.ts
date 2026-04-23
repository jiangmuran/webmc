import { describe, it, expect } from 'vitest';
import { create, push, prev, next } from './player_command_history';

describe('player command history', () => {
  it('empty push', () => {
    expect(push(create(), '').entries).toEqual([]);
  });

  it('push adds', () => {
    expect(push(create(), '/tp').entries).toEqual(['/tp']);
  });

  it('cap at max', () => {
    let h = create(2);
    h = push(h, 'a');
    h = push(h, 'b');
    h = push(h, 'c');
    expect(h.entries).toEqual(['b', 'c']);
  });

  it('prev walks back', () => {
    let h = create();
    h = push(h, 'one');
    h = push(h, 'two');
    expect(prev(h).text).toBe('two');
  });

  it('next returns empty past tail', () => {
    const h = push(create(), 'one');
    const n = next(h);
    expect(n.text).toBe('');
  });
});
