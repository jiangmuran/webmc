import { describe, it, expect } from 'vitest';
import { nextStage, prevStage, waxed } from './chiseled_copper_progression';

describe('chiseled copper progression', () => {
  it('chiseled → exposed', () => {
    expect(nextStage('chiseled_copper')).toBe('exposed_chiseled_copper');
  });

  it('oxidized terminal', () => {
    expect(nextStage('oxidized_chiseled_copper')).toBeUndefined();
  });

  it('exposed ← chiseled', () => {
    expect(prevStage('exposed_chiseled_copper')).toBe('chiseled_copper');
  });

  it('chiseled no prev', () => {
    expect(prevStage('chiseled_copper')).toBeUndefined();
  });

  it('waxed prefix', () => {
    expect(waxed('weathered_chiseled_copper')).toBe('waxed_weathered_chiseled_copper');
  });
});
