import { describe, it, expect } from 'vitest';
import { zoomedFov, showsScopeOverlay, DEFAULT_SCOPE_FOV } from './spyglass_scope_zoom';

describe('spyglass scope zoom', () => {
  it('inactive default fov', () => {
    expect(zoomedFov(70, false)).toBe(70);
  });

  it('active zoomed', () => {
    expect(zoomedFov(70, true)).toBe(DEFAULT_SCOPE_FOV);
  });

  it('overlay only when active', () => {
    expect(showsScopeOverlay(true)).toBe(true);
    expect(showsScopeOverlay(false)).toBe(false);
  });
});
