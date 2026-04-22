import { describe, it, expect } from 'vitest';
import { makeSprint, transition, type Input } from './sprint_toggle';

function input(overrides: Partial<Input> = {}): Input {
  return {
    forwardPressed: false,
    ctrlPressed: false,
    sneakPressed: false,
    hunger: 20,
    nowMs: 0,
    collided: false,
    ...overrides,
  };
}

describe('sprint', () => {
  it('ctrl+forward starts sprint', () => {
    const s = makeSprint();
    const r = transition(input(), input({ forwardPressed: true, ctrlPressed: true }), s);
    expect(r.startedSprint).toBe(true);
    expect(s.active).toBe(true);
  });

  it('low hunger blocks', () => {
    const s = makeSprint();
    const r = transition(input(), input({ forwardPressed: true, ctrlPressed: true, hunger: 5 }), s);
    expect(r.startedSprint).toBe(false);
  });

  it('sneak cancels', () => {
    const s = makeSprint();
    transition(input(), input({ forwardPressed: true, ctrlPressed: true }), s);
    const r = transition(
      input({ forwardPressed: true, ctrlPressed: true }),
      input({ forwardPressed: true, ctrlPressed: true, sneakPressed: true }),
      s,
    );
    expect(r.stoppedSprint).toBe(true);
  });

  it('double-tap W triggers', () => {
    const s = makeSprint();
    transition(input(), input({ forwardPressed: true, nowMs: 0 }), s);
    transition(
      input({ forwardPressed: true, nowMs: 0 }),
      input({ forwardPressed: false, nowMs: 50 }),
      s,
    );
    const r = transition(
      input({ forwardPressed: false, nowMs: 50 }),
      input({ forwardPressed: true, nowMs: 150 }),
      s,
    );
    expect(r.startedSprint).toBe(true);
  });

  it('collision stops', () => {
    const s = makeSprint();
    transition(input(), input({ forwardPressed: true, ctrlPressed: true }), s);
    const r = transition(
      input({ forwardPressed: true, ctrlPressed: true }),
      input({ forwardPressed: true, ctrlPressed: true, collided: true }),
      s,
    );
    expect(r.stoppedSprint).toBe(true);
  });
});
