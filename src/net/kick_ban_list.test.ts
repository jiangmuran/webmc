import { describe, it, expect } from 'vitest';
import { isBanned, ban, unban } from './kick_ban_list';

describe('kick ban list', () => {
  it('permanent ban', () => {
    const l = ban([], 'abc', 'grief');
    expect(isBanned(l, 'abc', 1000)).toBe(true);
  });

  it('temp ban expires', () => {
    const l = ban([], 'abc', 'chat spam', 500);
    expect(isBanned(l, 'abc', 100)).toBe(true);
    expect(isBanned(l, 'abc', 600)).toBe(false);
  });

  it('unban clears', () => {
    let l = ban([], 'abc', 'test');
    l = unban(l, 'abc');
    expect(isBanned(l, 'abc', 1)).toBe(false);
  });

  it('re-ban replaces old', () => {
    let l = ban([], 'abc', 'r1', 100);
    l = ban(l, 'abc', 'r2');
    expect(isBanned(l, 'abc', 1000)).toBe(true);
  });
});
