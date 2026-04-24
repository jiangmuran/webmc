import { describe, it, expect } from 'vitest';
import {
  sortByPriority,
  overrideMap,
  VANILLA_DEFAULT_PACK,
  type ResourcePackMeta,
} from './resource_pack_priority';

const faith: ResourcePackMeta = {
  id: 'faithful',
  name: 'Faithful',
  format: 15,
  enabled: true,
  priority: 10,
};
const disabled: ResourcePackMeta = {
  id: 'dark',
  name: 'Dark',
  format: 15,
  enabled: false,
  priority: 20,
};

describe('resource pack priority', () => {
  it('sorts highest first', () => {
    expect(sortByPriority([VANILLA_DEFAULT_PACK, faith])[0]?.id).toBe('faithful');
  });

  it('disabled filtered out', () => {
    expect(sortByPriority([disabled, faith]).map((p) => p.id)).toEqual(['faithful']);
  });

  it('override map has enabled', () => {
    expect(overrideMap([VANILLA_DEFAULT_PACK, faith]).has('faithful')).toBe(true);
  });

  it('vanilla default enabled', () => {
    expect(VANILLA_DEFAULT_PACK.enabled).toBe(true);
  });
});
