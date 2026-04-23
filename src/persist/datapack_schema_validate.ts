export interface DatapackManifest {
  packFormat: number;
  description: string;
  supportedVersions?: string[];
}

export const MIN_PACK_FORMAT = 1;
export const MAX_PACK_FORMAT = 99;

export function isValidManifest(m: DatapackManifest): boolean {
  if (m.packFormat < MIN_PACK_FORMAT || m.packFormat > MAX_PACK_FORMAT) return false;
  if (m.description.length === 0) return false;
  return true;
}

export function pickCompatibleOverlay(
  overlays: { name: string; minFormat: number; maxFormat: number }[],
  current: number,
): string | undefined {
  for (const o of overlays) {
    if (current >= o.minFormat && current <= o.maxFormat) return o.name;
  }
  return undefined;
}
