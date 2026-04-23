import { describe, it, expect } from 'vitest';
import {
  createManifest,
  validateImport,
  exportFilename,
  MANIFEST_SCHEMA_VERSION,
} from './webmc_export_zip';

describe('webmc export zip', () => {
  it('create sets schema', () => {
    const m = createManifest({
      worldName: 'Alpha',
      seed: '42',
      createdMs: 0,
      lastPlayedMs: 100,
      chunkCount: 50,
      playerCount: 1,
    });
    expect(m.schemaVersion).toBe(MANIFEST_SCHEMA_VERSION);
  });

  it('validate ok', () => {
    const m = createManifest({
      worldName: 'Alpha',
      seed: '42',
      createdMs: 0,
      lastPlayedMs: 100,
      chunkCount: 50,
      playerCount: 1,
    });
    expect(validateImport(m).ok).toBe(true);
  });

  it('bad schema rejected', () => {
    const r = validateImport({
      schemaVersion: 999,
      worldName: 'x',
      seed: '0',
      createdMs: 0,
      lastPlayedMs: 0,
      chunkCount: 0,
      playerCount: 0,
    });
    expect(r.ok).toBe(false);
  });

  it('filename is safe', () => {
    const m = createManifest({
      worldName: 'My World!',
      seed: '0',
      createdMs: 0,
      lastPlayedMs: 0,
      chunkCount: 0,
      playerCount: 0,
    });
    expect(exportFilename(m)).toContain('.webmc');
    expect(exportFilename(m)).not.toContain('!');
  });
});
