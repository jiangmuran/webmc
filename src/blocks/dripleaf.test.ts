import { describe, it, expect } from 'vitest';
import {
  canTransformToBig,
  growSmall,
  isFallenThrough,
  makeBig,
  makeSmall,
  setEntityOnTop,
  tickBigDripleaf,
} from './dripleaf';

describe('small dripleaf', () => {
  it('grows stage by stage on suitable soil', () => {
    const s = makeSmall();
    for (let i = 0; i < 1000 && s.growthStage < 3; i++) growSmall(s, true, () => 0.01);
    expect(s.growthStage).toBe(3);
  });

  it('refuses to grow off-soil', () => {
    const s = makeSmall();
    expect(growSmall(s, false, () => 0.01)).toBe(false);
  });

  it('fully grown ⇒ canTransformToBig', () => {
    const s = makeSmall();
    s.growthStage = 3;
    expect(canTransformToBig(s)).toBe(true);
  });
});

describe('big dripleaf', () => {
  it('tilts after 1.5s of entity on top', () => {
    const b = makeBig();
    setEntityOnTop(b, true);
    for (let i = 0; i < 20; i++) tickBigDripleaf(b, 0.1);
    expect(isFallenThrough(b)).toBe(true);
  });

  it('no entity → no tilt', () => {
    const b = makeBig();
    for (let i = 0; i < 20; i++) tickBigDripleaf(b, 0.1);
    expect(b.tilt).toBe('none');
  });

  it('entity stepping off resets tilt', () => {
    const b = makeBig();
    setEntityOnTop(b, true);
    tickBigDripleaf(b, 1.2);
    setEntityOnTop(b, false);
    tickBigDripleaf(b, 0.1);
    expect(b.tilt).toBe('none');
  });
});
