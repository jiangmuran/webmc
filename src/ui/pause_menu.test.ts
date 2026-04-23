import { describe, it, expect } from 'vitest';
import { availableActions, pausesWorldSimulation } from './pause_menu';

describe('pause menu', () => {
  it('singleplayer has save/quit', () => {
    expect(availableActions({ singleplayer: true, isHost: true, lanOpen: false })).toContain(
      'save_and_quit',
    );
  });

  it('multiplayer no save/quit', () => {
    expect(availableActions({ singleplayer: false, isHost: true, lanOpen: false })).not.toContain(
      'save_and_quit',
    );
  });

  it('host offers invite', () => {
    expect(availableActions({ singleplayer: false, isHost: true, lanOpen: false })).toContain(
      'invite',
    );
  });

  it('LAN already open hides option', () => {
    expect(availableActions({ singleplayer: true, isHost: true, lanOpen: true })).not.toContain(
      'lan_world',
    );
  });

  it('pauses only in single', () => {
    expect(pausesWorldSimulation({ singleplayer: true, isHost: true, lanOpen: false })).toBe(true);
    expect(pausesWorldSimulation({ singleplayer: false, isHost: true, lanOpen: false })).toBe(
      false,
    );
  });
});
