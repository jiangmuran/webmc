import { describe, it, expect } from 'vitest';
import { validate, isLegacy32, MAX_SKIN_BYTES } from './skin_upload_validate';

describe('skin upload validate', () => {
  it('valid 64x64 png', () => {
    expect(validate({ width: 64, height: 64, byteLength: 2048, mimeType: 'image/png' }).valid).toBe(
      true,
    );
  });

  it('legacy 64x32', () => {
    const m = { width: 64, height: 32, byteLength: 2048, mimeType: 'image/png' };
    expect(validate(m).valid).toBe(true);
    expect(isLegacy32(m)).toBe(true);
  });

  it('rejects non-png', () => {
    expect(validate({ width: 64, height: 64, byteLength: 100, mimeType: 'image/jpeg' }).valid).toBe(
      false,
    );
  });

  it('rejects wrong size', () => {
    expect(
      validate({ width: 128, height: 128, byteLength: 100, mimeType: 'image/png' }).valid,
    ).toBe(false);
  });

  it('rejects huge', () => {
    expect(
      validate({ width: 64, height: 64, byteLength: MAX_SKIN_BYTES + 1, mimeType: 'image/png' })
        .valid,
    ).toBe(false);
  });
});
