// Resource pack zip validation. Checks pack.mcmeta presence +
// directory structure; does NOT unpack binary assets. Sandboxed.

export interface ZipEntry {
  path: string;
  sizeBytes: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  texturesFound: number;
  modelsFound: number;
}

const MAX_TOTAL_SIZE = 512 * 1024 * 1024; // 512 MB
const MAX_ENTRIES = 50000;

export function validate(entries: ZipEntry[]): ValidationResult {
  const errors: string[] = [];
  let textures = 0;
  let models = 0;
  let total = 0;
  let hasMeta = false;
  for (const e of entries) {
    total += e.sizeBytes;
    if (e.path === 'pack.mcmeta') hasMeta = true;
    if (e.path.startsWith('assets/minecraft/textures/')) textures++;
    if (e.path.startsWith('assets/minecraft/models/')) models++;
    if (e.path.includes('..')) errors.push(`path traversal: ${e.path}`);
  }
  if (!hasMeta) errors.push('missing pack.mcmeta');
  if (total > MAX_TOTAL_SIZE) errors.push('pack too large');
  if (entries.length > MAX_ENTRIES) errors.push('too many entries');
  return { valid: errors.length === 0, errors, texturesFound: textures, modelsFound: models };
}
