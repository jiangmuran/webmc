import { describe, it, expect } from 'vitest';
import { ReplayBuffer } from './replay_record';

describe('replay buffer', () => {
  it('records events', () => {
    const b = new ReplayBuffer();
    b.start(0);
    b.record({ t: 10, kind: 'input', payload: { dx: 1, dy: 0, jump: false } });
    expect(b.size()).toBe(1);
  });

  it('range query', () => {
    const b = new ReplayBuffer();
    b.record({ t: 10, kind: 'chat', payload: { player: 'a', text: 'hi' } });
    b.record({ t: 100, kind: 'chat', payload: { player: 'a', text: 'bye' } });
    expect(b.replayRange(0, 50).length).toBe(1);
  });

  it('trim before', () => {
    const b = new ReplayBuffer();
    b.record({ t: 0, kind: 'chat', payload: { player: 'a', text: '' } });
    b.record({ t: 1000, kind: 'chat', payload: { player: 'a', text: '' } });
    b.record({ t: 2000, kind: 'chat', payload: { player: 'a', text: '' } });
    const dropped = b.trimBefore(2500, 1000);
    expect(dropped).toBe(2);
    expect(b.size()).toBe(1);
  });

  it('serialize is a copy', () => {
    const b = new ReplayBuffer();
    b.record({ t: 0, kind: 'chat', payload: { player: 'a', text: 'x' } });
    const s = b.serialize();
    b.clear();
    expect(s.length).toBe(1);
  });
});
