// Wearing a carved pumpkin prevents Endermen from considering stare
// a provocation.

export function preventsEndermanAggro(helmet: string | null): boolean {
  return helmet === 'carved_pumpkin';
}

export function obscuresVision(helmet: string | null): boolean {
  return helmet === 'carved_pumpkin';
}

export function canWearPumpkin(helmetSlotEmpty: boolean): boolean {
  return helmetSlotEmpty;
}
