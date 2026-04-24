import { describe, it, expect } from 'vitest';
import { formatAnnouncement, parseAnnouncement, LAN_PORT } from './lan_broadcast_service';

describe('LAN broadcast', () => {
  it('round-trip', () => {
    const s = formatAnnouncement({
      motd: 'webmc world',
      port: 25565,
      worldName: 'TestWorld',
      gameMode: 'survival',
    });
    expect(parseAnnouncement(s)).toEqual({ motd: 'webmc world', port: 25565 });
  });

  it('invalid input', () => {
    expect(parseAnnouncement('garbage')).toBeUndefined();
  });

  it('bad port rejected', () => {
    expect(parseAnnouncement('[MOTD]a[/MOTD][AD]99999[/AD]')).toBeUndefined();
  });

  it('LAN port is 4445', () => {
    expect(LAN_PORT).toBe(4445);
  });
});
