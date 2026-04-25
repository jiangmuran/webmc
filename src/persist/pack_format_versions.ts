// Map vanilla pack_format integers to the human-readable MC version
// range that pack_format covers. webmc uses this only to label imported
// resource packs so the user knows roughly what era they came from.
//
// Source: minecraft.wiki "Pack format". Behavioral spec — clean-room.

const RESOURCE_PACK_FORMATS: Readonly<Record<number, string>> = {
  1: '1.6.1 – 1.8.9',
  2: '1.9 – 1.10.2',
  3: '1.11 – 1.12.2',
  4: '1.13 – 1.14.4',
  5: '1.15 – 1.16.1',
  6: '1.16.2 – 1.16.5',
  7: '1.17 – 1.17.1',
  8: '1.18 – 1.18.2',
  9: '1.19 – 1.19.2',
  11: '22w42a',
  12: '1.19.3',
  13: '1.19.4',
  14: '23w14a',
  15: '1.20 – 1.20.1',
  16: '23w24a',
  17: '23w25a',
  18: '1.20.2',
  22: '1.20.3 – 1.20.4',
  26: '1.20.5 – 1.20.6',
  29: '1.21 – 1.21.1',
  32: '1.21.2 – 1.21.3',
  34: '1.21.4',
  46: '1.21.5',
  55: '1.21.6 – 1.21.7',
  64: '1.21.8 – 1.21.9',
};

const DATA_PACK_FORMATS: Readonly<Record<number, string>> = {
  4: '1.13 – 1.14.4',
  5: '1.15 – 1.16.1',
  6: '1.16.2 – 1.16.5',
  7: '1.17 – 1.17.1',
  8: '1.18 – 1.18.1',
  9: '1.18.2',
  10: '1.19 – 1.19.3',
  12: '1.19.4',
  15: '1.20 – 1.20.1',
  18: '1.20.2',
  26: '1.20.3 – 1.20.4',
  41: '1.20.5 – 1.20.6',
  48: '1.21 – 1.21.1',
  57: '1.21.2 – 1.21.3',
  61: '1.21.4',
  71: '1.21.5',
  80: '1.21.6 – 1.21.7',
};

export function resourcePackVersion(packFormat: number): string {
  return RESOURCE_PACK_FORMATS[packFormat] ?? `unknown (pack_format=${String(packFormat)})`;
}

export function dataPackVersion(packFormat: number): string {
  return DATA_PACK_FORMATS[packFormat] ?? `unknown (pack_format=${String(packFormat)})`;
}

export const KNOWN_RESOURCE_PACK_FORMATS = Object.freeze(
  Object.keys(RESOURCE_PACK_FORMATS)
    .map((k) => Number(k))
    .sort((a, b) => a - b),
);

export const KNOWN_DATA_PACK_FORMATS = Object.freeze(
  Object.keys(DATA_PACK_FORMATS)
    .map((k) => Number(k))
    .sort((a, b) => a - b),
);
