import { describe, it, expect } from 'vitest';
import { shiftClickTarget, type ContainerView } from './inventory_shift_click';

const player: ContainerView = { id: 'player', slots: [] };
const chest: ContainerView = { id: 'chest', slots: [] };

describe('inventory shift click', () => {
  it('player main → hotbar when no link', () => {
    expect(shiftClickTarget(player, 10, undefined).hotbarFirst).toBe(true);
  });

  it('player hotbar → main when no link', () => {
    expect(shiftClickTarget(player, 0, undefined).hotbarFirst).toBe(false);
  });

  it('player → chest when linked', () => {
    expect(shiftClickTarget(player, 0, chest).container).toBe('chest');
  });

  it('chest → player hotbar first', () => {
    expect(shiftClickTarget(chest, 0, player).hotbarFirst).toBe(true);
  });
});
