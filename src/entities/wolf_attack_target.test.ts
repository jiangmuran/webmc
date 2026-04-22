import { describe, it, expect } from 'vitest';
import { onEvent, clearAggroIfTargetGone, canAttack, type Wolf } from './wolf_attack_target';

function wolf(tamed: boolean, ownerId: string | null, packId: string | null): Wolf {
  return { tamed, ownerId, packId, aggroTargetId: null };
}

describe('wolf targeting', () => {
  it('tamed aggros on owner attacker', () => {
    const w = wolf(true, 'Steve', null);
    onEvent(w, { kind: 'owner_attacked_by', byId: 'zombie1', targetId: null });
    expect(w.aggroTargetId).toBe('zombie1');
  });

  it('tamed aggros on owner target', () => {
    const w = wolf(true, 'Steve', null);
    onEvent(w, { kind: 'owner_attacked', byId: null, targetId: 'cow1' });
    expect(w.aggroTargetId).toBe('cow1');
  });

  it('tamed never targets own owner', () => {
    const w = wolf(true, 'Steve', null);
    w.aggroTargetId = 'Steve';
    expect(canAttack(w, 'Steve')).toBe(false);
  });

  it('wild pack aggros on pack member attacker', () => {
    const w = wolf(false, null, 'pack1');
    onEvent(w, { kind: 'pack_member_hurt', byId: 'Steve', targetId: null });
    expect(w.aggroTargetId).toBe('Steve');
  });

  it('clear aggro if target dies', () => {
    const w = wolf(true, 'Steve', null);
    w.aggroTargetId = 'zombie1';
    clearAggroIfTargetGone(w, new Set(['Steve']));
    expect(w.aggroTargetId).toBeNull();
  });
});
