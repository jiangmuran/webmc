import { describe, it, expect } from 'vitest';
import { parseServerProperties } from './server_properties_parse';

describe('vanilla server.properties parser', () => {
  it('parses a typical server.properties', () => {
    const p = parseServerProperties(`# Minecraft server properties
motd=Welcome to my world
server-port=25577
gamemode=creative
difficulty=hard
hardcore=true
pvp=false
spawn-protection=8
max-players=42
view-distance=12
simulation-distance=8
level-name=overworld
level-seed=12345
white-list=true
`);
    expect(p.motd).toBe('Welcome to my world');
    expect(p.serverPort).toBe(25577);
    expect(p.gamemode).toBe('creative');
    expect(p.difficulty).toBe('hard');
    expect(p.hardcore).toBe(true);
    expect(p.pvp).toBe(false);
    expect(p.spawnProtection).toBe(8);
    expect(p.maxPlayers).toBe(42);
    expect(p.viewDistance).toBe(12);
    expect(p.simulationDistance).toBe(8);
    expect(p.levelName).toBe('overworld');
    expect(p.levelSeed).toBe('12345');
    expect(p.whiteList).toBe(true);
  });

  it('falls back to defaults when fields missing', () => {
    const p = parseServerProperties('');
    expect(p.motd).toBe('A webmc server');
    expect(p.serverPort).toBe(25565);
    expect(p.gamemode).toBe('survival');
    expect(p.difficulty).toBe('normal');
    expect(p.hardcore).toBe(false);
    expect(p.pvp).toBe(true);
    expect(p.maxPlayers).toBe(20);
    expect(p.levelName).toBe('world');
    expect(p.whiteList).toBe(false);
  });

  it('ignores comment and empty lines, supports CRLF', () => {
    const p = parseServerProperties(
      `# header\r\n!banged comment\r\n\r\nmotd=Hello\r\nmax-players=5\r\n`,
    );
    expect(p.motd).toBe('Hello');
    expect(p.maxPlayers).toBe(5);
  });

  it('accepts numeric gamemode/difficulty (pre-1.13 format)', () => {
    const p = parseServerProperties('gamemode=1\ndifficulty=2');
    expect(p.gamemode).toBe('creative');
    expect(p.difficulty).toBe('normal');
  });

  it('exposes raw fields map', () => {
    const p = parseServerProperties('custom-key=custom-value\nrconpassword=secret');
    expect(p.fields['custom-key']).toBe('custom-value');
    expect(p.fields['rconpassword']).toBe('secret');
  });
});
