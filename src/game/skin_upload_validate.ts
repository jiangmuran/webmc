// Player skin upload validation. Must be 64x64 or 64x32 PNG under 8KB.

export const SKIN_WIDTH_OPTIONS = [64];
export const SKIN_HEIGHT_OPTIONS = [64, 32];
export const MAX_SKIN_BYTES = 8192;

export interface SkinMeta {
  width: number;
  height: number;
  byteLength: number;
  mimeType: string;
}

export interface ValidateResult {
  valid: boolean;
  errors: string[];
}

export function validate(m: SkinMeta): ValidateResult {
  const errors: string[] = [];
  if (m.mimeType !== 'image/png') errors.push('must be PNG');
  if (!SKIN_WIDTH_OPTIONS.includes(m.width)) errors.push('width must be 64');
  if (!SKIN_HEIGHT_OPTIONS.includes(m.height)) errors.push('height must be 64 or 32');
  if (m.byteLength > MAX_SKIN_BYTES) errors.push('too large');
  return { valid: errors.length === 0, errors };
}

export function isLegacy32(m: SkinMeta): boolean {
  return m.height === 32;
}
