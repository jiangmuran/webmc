export interface AnvilFingerprint {
  hasLevelDat: boolean;
  hasRegionFolder: boolean;
  hasPlayerdataFolder: boolean;
  hasDataFolder: boolean;
}

export function isAnvilWorld(fp: AnvilFingerprint): boolean {
  if (!fp.hasLevelDat) return false;
  if (!fp.hasRegionFolder) return false;
  return true;
}

export function signatureScore(fp: AnvilFingerprint): number {
  let score = 0;
  if (fp.hasLevelDat) score += 50;
  if (fp.hasRegionFolder) score += 30;
  if (fp.hasPlayerdataFolder) score += 10;
  if (fp.hasDataFolder) score += 10;
  return score;
}

export function needsUserConfirmation(fp: AnvilFingerprint): boolean {
  return signatureScore(fp) >= 50 && signatureScore(fp) < 90;
}
