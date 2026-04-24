import { describe, it, expect } from 'vitest';
import { standardLayout, isValidExportFilename } from './world_export_zip_layout';

describe('world export zip layout', () => {
  it('includes manifest', () => {
    expect(standardLayout('World1').some((e) => e.kind === 'manifest')).toBe(true);
  });

  it('world name in paths', () => {
    expect(standardLayout('Hello').every((e) => e.path.startsWith('Hello/'))).toBe(true);
  });

  it('valid .webmc filename', () => {
    expect(isValidExportFilename('my-world.webmc')).toBe(true);
    expect(isValidExportFilename('world.zip')).toBe(false);
  });

  it('rejects dangerous names', () => {
    expect(isValidExportFilename('../evil.webmc')).toBe(false);
  });
});
