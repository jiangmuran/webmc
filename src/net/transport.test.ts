import { describe, it, expect } from 'vitest';
import { RelayTransport } from './transport';

describe('RelayTransport', () => {
  it('send emits a relay envelope to the signaling channel', () => {
    const sent: unknown[] = [];
    const t = new RelayTransport('self', 'other', (obj) => sent.push(obj));
    const payload = new Uint8Array([1, 2, 3, 4]);
    t.send('reliable', payload);
    expect(sent).toHaveLength(1);
    const env = sent[0] as Record<string, unknown>;
    expect(env['type']).toBe('relay');
    expect(env['to']).toBe('other');
    expect(env['channel']).toBe('reliable');
    expect(typeof env['data']).toBe('string');
  });

  it('receive delivers bytes to registered handlers', () => {
    const t = new RelayTransport('self', 'other', () => undefined);
    const seen: Uint8Array[] = [];
    t.onMessage((_channel, bytes) => {
      seen.push(bytes);
    });
    t.receive('unreliable', new Uint8Array([7, 8, 9]));
    expect(seen).toHaveLength(1);
    const first = seen[0];
    if (!first) throw new Error('no message received');
    expect(Array.from(first)).toEqual([7, 8, 9]);
  });

  it('close fires close handlers once and stops further message delivery', () => {
    const t = new RelayTransport('self', 'other', () => undefined);
    let closeCount = 0;
    let msgCount = 0;
    t.onClose(() => closeCount++);
    t.onMessage(() => msgCount++);
    t.close('test');
    t.close('test');
    t.receive('reliable', new Uint8Array([1]));
    expect(closeCount).toBe(1);
    expect(msgCount).toBe(0);
  });

  it('send is a no-op after close', () => {
    const sent: unknown[] = [];
    const t = new RelayTransport('self', 'other', (obj) => sent.push(obj));
    t.close();
    t.send('reliable', new Uint8Array([0]));
    expect(sent).toEqual([]);
  });

  it('unsubscribe removes the handler', () => {
    const t = new RelayTransport('self', 'other', () => undefined);
    let count = 0;
    const off = t.onMessage(() => {
      count++;
    });
    t.receive('reliable', new Uint8Array([1]));
    off();
    t.receive('reliable', new Uint8Array([1]));
    expect(count).toBe(1);
  });
});
