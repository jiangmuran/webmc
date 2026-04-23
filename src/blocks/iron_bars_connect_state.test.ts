import { describe, it, expect } from 'vitest';
import { connectionCount, isFloater, renderModel } from './iron_bars_connect_state';

describe('iron bars connect state', () => {
  it('count accurate', () => {
    expect(connectionCount({ north: true, south: false, east: true, west: false })).toBe(2);
  });

  it('floater detection', () => {
    expect(isFloater({ north: false, south: false, east: false, west: false })).toBe(true);
  });

  it('render model post when alone', () => {
    expect(renderModel({ north: false, south: false, east: false, west: false })).toBe('post');
  });

  it('render model connected', () => {
    expect(renderModel({ north: true, south: false, east: true, west: false })).toBe('connected');
  });
});
