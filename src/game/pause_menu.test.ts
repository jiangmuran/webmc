import { describe, it, expect } from 'vitest';
import { back, closeMenu, makePauseMenu, navigate, openMenu, quitRequest } from './pause_menu';

describe('pause menu', () => {
  it('open pauses and shows main', () => {
    const s = makePauseMenu();
    const r = openMenu(s);
    expect(r.paused).toBe(true);
    expect(r.screen).toBe('main');
  });

  it('close requires open', () => {
    const s = makePauseMenu();
    expect(closeMenu(s)).toBe(false);
    openMenu(s);
    expect(closeMenu(s)).toBe(true);
  });

  it('navigate pushes history', () => {
    const s = makePauseMenu();
    openMenu(s);
    navigate({ state: s, target: 'options' });
    expect(s.currentScreen).toBe('options');
    expect(s.history).toEqual(['main']);
  });

  it('back pops history', () => {
    const s = makePauseMenu();
    openMenu(s);
    navigate({ state: s, target: 'options' });
    navigate({ state: s, target: 'video' });
    back(s);
    expect(s.currentScreen).toBe('options');
  });

  it('back at root returns false', () => {
    const s = makePauseMenu();
    openMenu(s);
    expect(back(s)).toBe(false);
  });

  it('quit in mp needs confirmation', () => {
    expect(quitRequest({ isMultiplayer: true }).requiresConfirmation).toBe(true);
    expect(quitRequest({ isMultiplayer: false }).requiresConfirmation).toBe(false);
  });
});
