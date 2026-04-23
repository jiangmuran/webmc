import { describe, it, expect, vi } from 'vitest';
import { makeBus, subscribe, emit, clear, listenerCount } from './event_bus';

describe('event bus', () => {
  it('subscribe receives', () => {
    const b = makeBus();
    const fn = vi.fn();
    subscribe(b, 'hit', fn);
    emit(b, 'hit', { dmg: 5 });
    expect(fn).toHaveBeenCalledWith({ dmg: 5 });
  });

  it('unsubscribe works', () => {
    const b = makeBus();
    const fn = vi.fn();
    const off = subscribe(b, 'hit', fn);
    off();
    emit(b, 'hit', 1);
    expect(fn).not.toHaveBeenCalled();
  });

  it('emit returns count', () => {
    const b = makeBus();
    subscribe(b, 'e', () => undefined);
    subscribe(b, 'e', () => undefined);
    expect(emit(b, 'e', null)).toBe(2);
  });

  it('clear by name', () => {
    const b = makeBus();
    subscribe(b, 'a', () => undefined);
    subscribe(b, 'b', () => undefined);
    clear(b, 'a');
    expect(listenerCount(b, 'a')).toBe(0);
    expect(listenerCount(b, 'b')).toBe(1);
  });

  it('clear all', () => {
    const b = makeBus();
    subscribe(b, 'a', () => undefined);
    subscribe(b, 'b', () => undefined);
    clear(b);
    expect(listenerCount(b, 'a')).toBe(0);
    expect(listenerCount(b, 'b')).toBe(0);
  });
});
