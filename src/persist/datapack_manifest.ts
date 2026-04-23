// Datapack manifest validator. webmc's own datapack schema (not Mojang's).

export interface DatapackManifest {
  schemaVersion: 1;
  name: string;
  description: string;
  pack_format: number;
  webmc_min_version: string;
}

export const SUPPORTED_PACK_FORMATS = [1, 2, 3];
export const CURRENT_WEBMC_VERSION = '0.18.0';

export interface Validation {
  valid: boolean;
  errors: string[];
}

export function validateManifest(m: Partial<DatapackManifest>): Validation {
  const errors: string[] = [];
  if (m.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!m.name || typeof m.name !== 'string') errors.push('name required');
  if (!m.pack_format || !SUPPORTED_PACK_FORMATS.includes(m.pack_format)) {
    errors.push('pack_format unsupported');
  }
  return { valid: errors.length === 0, errors };
}

export function isCompatibleVersion(declaredMin: string): boolean {
  return compareSemver(CURRENT_WEBMC_VERSION, declaredMin) >= 0;
}

function compareSemver(a: string, b: string): number {
  const ap = a.split('.').map(Number);
  const bp = b.split('.').map(Number);
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    const av = ap[i] ?? 0;
    const bv = bp[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}
