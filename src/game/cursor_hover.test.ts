import { describe, it, expect } from 'vitest';
import { anchorTooltip, forceShowTooltip, makeHoverState, updateHover } from './cursor_hover';

describe('cursor hover', () => {
  it('immediate target is not yet visible', () => {
    const s = makeHoverState();
    const r = updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 0 });
    expect(r.visibleTargetId).toBeNull();
  });

  it('appears after 300ms', () => {
    const s = makeHoverState();
    updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 0 });
    const r = updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 300 });
    expect(r.tooltipJustAppeared).toBe(true);
  });

  it('moves to different target hides', () => {
    const s = makeHoverState();
    updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 0 });
    updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 500 });
    const r = updateHover(s, { targetId: 'slot_2', cursorX: 10, cursorY: 0, nowMs: 510 });
    expect(r.tooltipJustHidden).toBe(true);
  });

  it('exit to null stops tooltip', () => {
    const s = makeHoverState();
    updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 0 });
    updateHover(s, { targetId: 'slot_1', cursorX: 0, cursorY: 0, nowMs: 500 });
    const r = updateHover(s, { targetId: null, cursorX: 10, cursorY: 0, nowMs: 510 });
    expect(r.tooltipJustHidden).toBe(true);
  });

  it('force show bypasses delay', () => {
    const s = makeHoverState();
    forceShowTooltip(s, 'slot_1', 0);
    expect(s.visible).toBe(true);
  });

  it('anchor above when cursor low', () => {
    const a = anchorTooltip(100, 200, 600);
    expect(a.above).toBe(true);
    expect(a.y).toBeLessThan(200);
  });

  it('anchor below when cursor near top', () => {
    const a = anchorTooltip(100, 20, 600);
    expect(a.above).toBe(false);
    expect(a.y).toBeGreaterThan(20);
  });
});
