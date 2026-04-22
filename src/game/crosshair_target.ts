// Crosshair raycast target classification. The HUD crosshair changes
// shape/color based on what's in focus.

export type TargetKind =
  | 'none'
  | 'block'
  | 'mob_hostile'
  | 'mob_passive'
  | 'player'
  | 'item_frame'
  | 'sign_editable';

export interface RaycastHit {
  kind: TargetKind;
  distance: number;
}

export interface CrosshairStyle {
  color: 'white' | 'red' | 'yellow' | 'green';
  shape: 'plus' | 'dot' | 'square';
}

export function crosshairStyle(hit: RaycastHit | null): CrosshairStyle {
  if (!hit || hit.kind === 'none') return { color: 'white', shape: 'plus' };
  if (hit.kind === 'mob_hostile') return { color: 'red', shape: 'plus' };
  if (hit.kind === 'player') return { color: 'yellow', shape: 'plus' };
  if (hit.kind === 'mob_passive') return { color: 'white', shape: 'plus' };
  if (hit.kind === 'sign_editable' || hit.kind === 'item_frame') {
    return { color: 'green', shape: 'square' };
  }
  return { color: 'white', shape: 'plus' };
}

// Interactable range (6 blocks creative, 4.5 survival).
export function interactRange(creative: boolean): number {
  return creative ? 6 : 4.5;
}
