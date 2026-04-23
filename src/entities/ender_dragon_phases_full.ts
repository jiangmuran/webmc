export type DragonPhase =
  | 'holding_pattern'
  | 'strafe_player'
  | 'land_on_portal'
  | 'sit_flaming'
  | 'sit_scanning'
  | 'sit_attacking'
  | 'takeoff'
  | 'breath'
  | 'charge_player'
  | 'dying'
  | 'hover';

export interface PhaseCtx {
  hpPercent: number;
  allCrystalsDestroyed: boolean;
  player_nearby: boolean;
}

export function shouldTransitionTo(current: DragonPhase, c: PhaseCtx): DragonPhase | undefined {
  if (c.hpPercent <= 0) return 'dying';
  if (current === 'holding_pattern' && c.allCrystalsDestroyed && c.player_nearby) {
    return 'land_on_portal';
  }
  if (current === 'land_on_portal') return 'sit_scanning';
  if (current === 'sit_attacking' && !c.player_nearby) return 'takeoff';
  return undefined;
}
