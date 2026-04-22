// Cauldron boiling over a campfire. A full water cauldron + a lit
// campfire directly below triggers "cooking" animations; players
// standing in the cauldron while it's hot take fire damage.

export interface HotCauldronQuery {
  cauldronContent: 'water' | 'lava' | 'powder_snow' | 'empty';
  cauldronLevel: number;
  campfireBelow: boolean;
  campfireLit: boolean;
}

export interface HotCauldronResult {
  isBoiling: boolean;
  damagesOccupants: boolean;
  appliesFireEffect: boolean;
}

export function cauldronHeatState(q: HotCauldronQuery): HotCauldronResult {
  if (q.cauldronContent === 'lava' && q.cauldronLevel > 0) {
    return { isBoiling: false, damagesOccupants: true, appliesFireEffect: true };
  }
  if (q.cauldronContent !== 'water' || q.cauldronLevel === 0) {
    return { isBoiling: false, damagesOccupants: false, appliesFireEffect: false };
  }
  if (q.campfireBelow && q.campfireLit) {
    return { isBoiling: true, damagesOccupants: true, appliesFireEffect: false };
  }
  return { isBoiling: false, damagesOccupants: false, appliesFireEffect: false };
}
