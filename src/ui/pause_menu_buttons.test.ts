import { describe, it, expect } from 'vitest';
import { availableButtons } from './pause_menu_buttons';

describe('pause menu buttons', () => {
  it('singleplayer shows save and quit', () => {
    expect(availableButtons({ isMultiplayer: false, isHost: false })).toContain('save_and_quit');
  });

  it('singleplayer shows open to LAN', () => {
    expect(availableButtons({ isMultiplayer: false, isHost: false })).toContain('open_to_lan');
  });

  it('multiplayer shows disconnect', () => {
    expect(availableButtons({ isMultiplayer: true, isHost: false })).toContain('disconnect');
  });

  it('resume always present', () => {
    expect(availableButtons({ isMultiplayer: true, isHost: true })).toContain('resume');
  });

  it('multiplayer no save_and_quit', () => {
    expect(availableButtons({ isMultiplayer: true, isHost: false })).not.toContain('save_and_quit');
  });
});
