// Resource pack loader. Validates format version, extracts asset paths,
// prioritizes packs by load order (last-loaded wins).

export interface PackManifest {
  format: number;
  description: string;
  name: string;
}

export const SUPPORTED_FORMATS = [7, 8, 9, 10, 12, 15];

export function isSupported(format: number): boolean {
  return SUPPORTED_FORMATS.includes(format);
}

export interface LoadedPack {
  manifest: PackManifest;
  files: Map<string, Uint8Array>;
  priority: number;
}

export class ResourcePackStack {
  private packs: LoadedPack[] = [];

  add(p: LoadedPack): boolean {
    if (!isSupported(p.manifest.format)) return false;
    this.packs.push(p);
    this.packs.sort((a, b) => a.priority - b.priority);
    return true;
  }

  resolve(path: string): Uint8Array | null {
    for (let i = this.packs.length - 1; i >= 0; i--) {
      const f = this.packs[i]?.files.get(path);
      if (f) return f;
    }
    return null;
  }

  clear(): void {
    this.packs.length = 0;
  }

  get size(): number {
    return this.packs.length;
  }
}
