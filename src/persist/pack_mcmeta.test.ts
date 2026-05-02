import { describe, it, expect } from 'vitest';
import { parsePackMcmeta, PackMetaError } from './pack_mcmeta';

describe('pack.mcmeta parser', () => {
  it('parses a minimal pack.mcmeta with string description', () => {
    const meta = parsePackMcmeta('{"pack":{"pack_format":15,"description":"My pack"}}');
    expect(meta.packFormat).toBe(15);
    expect(meta.description).toBe('My pack');
    expect(meta.supportedFormatsMin).toBeNull();
    expect(meta.supportedFormatsMax).toBeNull();
  });

  it('flattens a JSON-text-component description', () => {
    const meta = parsePackMcmeta(
      JSON.stringify({
        pack: {
          pack_format: 22,
          description: { text: 'Hello ', extra: [{ text: 'world' }] },
        },
      }),
    );
    expect(meta.description).toBe('Hello world');
  });

  it('flattens an array description', () => {
    const meta = parsePackMcmeta(
      JSON.stringify({
        pack: { pack_format: 22, description: ['One ', { text: 'Two' }] },
      }),
    );
    expect(meta.description).toBe('One Two');
  });

  it('reads supported_formats as a single int', () => {
    const meta = parsePackMcmeta(
      JSON.stringify({
        pack: { pack_format: 22, description: '', supported_formats: 22 },
      }),
    );
    expect(meta.supportedFormatsMin).toBe(22);
    expect(meta.supportedFormatsMax).toBe(22);
  });

  it('reads supported_formats as a {min,max} object', () => {
    const meta = parsePackMcmeta(
      JSON.stringify({
        pack: {
          pack_format: 22,
          description: '',
          supported_formats: { min_inclusive: 18, max_inclusive: 22 },
        },
      }),
    );
    expect(meta.supportedFormatsMin).toBe(18);
    expect(meta.supportedFormatsMax).toBe(22);
  });

  it('reads supported_formats as a [min,max] array', () => {
    const meta = parsePackMcmeta(
      JSON.stringify({
        pack: { pack_format: 22, description: '', supported_formats: [18, 22] },
      }),
    );
    expect(meta.supportedFormatsMin).toBe(18);
    expect(meta.supportedFormatsMax).toBe(22);
  });

  it('throws on invalid JSON', () => {
    expect(() => parsePackMcmeta('{not json')).toThrow(PackMetaError);
  });

  it('throws when pack field is missing', () => {
    expect(() => parsePackMcmeta('{}')).toThrow(PackMetaError);
  });

  it('throws when pack_format is not a number', () => {
    expect(() => parsePackMcmeta('{"pack":{"pack_format":"abc"}}')).toThrow(PackMetaError);
  });
});
