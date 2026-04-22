import { describe, it, expect } from 'vitest';
import {
  copyToClipboard,
  formatCoordsForClipboard,
  formatRoomCodeForClipboard,
  formatSeedForClipboard,
  MemoryClipboard,
} from './clipboard_util';

describe('clipboard util', () => {
  it('memory clipboard round-trips', async () => {
    const c = new MemoryClipboard();
    await c.writeText('hello');
    expect(await c.readText()).toBe('hello');
  });

  it('copy returns success message', async () => {
    const c = new MemoryClipboard();
    const r = await copyToClipboard(c, 'x');
    expect(r.success).toBe(true);
    expect(r.message).toBe('Copied!');
  });

  it('custom success message', async () => {
    const c = new MemoryClipboard();
    const r = await copyToClipboard(c, 'x', 'Seed copied');
    expect(r.message).toBe('Seed copied');
  });

  it('format coords', () => {
    expect(formatCoordsForClipboard({ x: 1.234, y: 64, z: -5.5 })).toBe('1.23 64.00 -5.50');
  });

  it('format seed is identity', () => {
    expect(formatSeedForClipboard('1234')).toBe('1234');
  });

  it('format room code is identity', () => {
    expect(formatRoomCodeForClipboard('ABC-DEF')).toBe('ABC-DEF');
  });
});
