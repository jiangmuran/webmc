// Cursor / hover tooltip state. Mouse hover over inventory slots,
// hotbar items, minimap, or buttons surfaces a tooltip anchored near
// the cursor. The tooltip has a fade-in delay (300ms) to avoid
// flashing when the user is just passing over.

export interface HoverContext {
  targetId: string | null; // unique id of the hovered UI element
  cursorX: number;
  cursorY: number;
  nowMs: number;
}

export interface HoverState {
  targetId: string | null;
  targetEnteredAtMs: number;
  visible: boolean;
}

export function makeHoverState(): HoverState {
  return { targetId: null, targetEnteredAtMs: Infinity, visible: false };
}

const TOOLTIP_DELAY_MS = 300;

export interface UpdateResult {
  tooltipJustAppeared: boolean;
  tooltipJustHidden: boolean;
  visibleTargetId: string | null;
}

export function updateHover(state: HoverState, ctx: HoverContext): UpdateResult {
  if (ctx.targetId !== state.targetId) {
    const previouslyVisible = state.visible;
    state.targetId = ctx.targetId;
    state.targetEnteredAtMs = ctx.targetId === null ? Infinity : ctx.nowMs;
    state.visible = false;
    return {
      tooltipJustAppeared: false,
      tooltipJustHidden: previouslyVisible,
      visibleTargetId: null,
    };
  }
  if (state.targetId === null) {
    return { tooltipJustAppeared: false, tooltipJustHidden: false, visibleTargetId: null };
  }
  if (!state.visible && ctx.nowMs - state.targetEnteredAtMs >= TOOLTIP_DELAY_MS) {
    state.visible = true;
    return {
      tooltipJustAppeared: true,
      tooltipJustHidden: false,
      visibleTargetId: state.targetId,
    };
  }
  return {
    tooltipJustAppeared: false,
    tooltipJustHidden: false,
    visibleTargetId: state.visible ? state.targetId : null,
  };
}

// Tooltip positioning: prefer above-cursor, but if cursor is near the
// top of the screen, show below. Anchors with a 12-pixel offset so the
// tooltip doesn't sit directly under the cursor.
export interface TooltipAnchor {
  x: number;
  y: number;
  above: boolean;
}

export function anchorTooltip(
  cursorX: number,
  cursorY: number,
  _screenHeight: number,
): TooltipAnchor {
  const above = cursorY > 80;
  return {
    x: cursorX,
    y: above ? cursorY - 12 : cursorY + 12,
    above,
  };
}

// Force-show: used by mid-drag interactions where the player wants the
// tooltip immediately instead of waiting for the delay.
export function forceShowTooltip(state: HoverState, targetId: string, nowMs: number): void {
  state.targetId = targetId;
  state.targetEnteredAtMs = nowMs - TOOLTIP_DELAY_MS;
  state.visible = true;
}
