// Raid captain (pillager / vindicator wearing an illager banner). Killing
// one gives the killer Bad Omen at level = bannerTier + 1.

export interface RaidCaptain {
  wearingBanner: boolean;
  bannerTier: number; // for stacked bad omen in MC 1.21, 1..5
}

export function makeCaptain(bannerTier = 1): RaidCaptain {
  return { wearingBanner: true, bannerTier: Math.max(1, Math.min(5, bannerTier)) };
}

export interface KillResult {
  appliesBadOmen: boolean;
  badOmenLevel: number;
}

export function onCaptainKilled(captain: RaidCaptain): KillResult {
  if (!captain.wearingBanner) return { appliesBadOmen: false, badOmenLevel: 0 };
  return { appliesBadOmen: true, badOmenLevel: captain.bannerTier };
}

// Remove the banner (e.g., cauldron wash).
export function removeBanner(captain: RaidCaptain): void {
  captain.wearingBanner = false;
}
