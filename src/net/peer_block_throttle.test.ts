import { describe, it, expect } from 'vitest';
import {
  recordAction,
  MAX_ACTIONS_PER_SECOND,
  WINDOW_MS,
  type BlockActionRate,
} from './peer_block_throttle';

const init: BlockActionRate = { peerId: 'p', actionsInWindow: 0, windowStartMs: 0 };

describe('peer block throttle', () => {
  it('first action accepted', () => {
    expect(recordAction(init, 0).accepted).toBe(true);
  });

  it('rejects beyond cap', () => {
    let r = init;
    for (let i = 0; i < MAX_ACTIONS_PER_SECOND; i++) {
      r = recordAction(r, 0).record;
    }
    expect(recordAction(r, 0).accepted).toBe(false);
  });

  it('window reset', () => {
    let r = init;
    for (let i = 0; i < MAX_ACTIONS_PER_SECOND; i++) {
      r = recordAction(r, 0).record;
    }
    expect(recordAction(r, WINDOW_MS + 1).accepted).toBe(true);
  });
});
