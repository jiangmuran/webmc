import { describe, it, expect } from 'vitest';
import { parseVanillaAdvancement, AdvancementParseError } from './vanilla_advancement_parse';

describe('vanilla advancement parser', () => {
  it('parses a typical story advancement', () => {
    const adv = parseVanillaAdvancement(
      JSON.stringify({
        parent: 'minecraft:story/root',
        display: {
          title: { translate: 'advancements.story.mine_stone.title' },
          description: 'Use a pickaxe',
          icon: { item: 'minecraft:wooden_pickaxe' },
          frame: 'task',
        },
        criteria: {
          get_stone: {
            trigger: 'minecraft:inventory_changed',
            conditions: { items: [{ items: ['minecraft:cobblestone'] }] },
          },
        },
      }),
    );
    expect(adv.parent).toBe('story/root');
    expect(adv.title).toBe('advancements.story.mine_stone.title');
    expect(adv.description).toBe('Use a pickaxe');
    expect(adv.iconItem).toBe('webmc:wooden_pickaxe');
    expect(adv.frame).toBe('task');
    expect(adv.criteria['get_stone']?.trigger).toBe('webmc:inventory_changed');
    // Default requirements: AND of all criterion keys.
    expect(adv.requirements).toEqual([['get_stone']]);
  });

  it('honors challenge frame and explicit requirements', () => {
    const adv = parseVanillaAdvancement(
      JSON.stringify({
        display: { title: 'Beat them all', description: '', frame: 'challenge' },
        criteria: {
          a: { trigger: 'minecraft:impossible' },
          b: { trigger: 'minecraft:impossible' },
        },
        requirements: [['a', 'b']],
      }),
    );
    expect(adv.frame).toBe('challenge');
    expect(adv.requirements).toEqual([['a', 'b']]);
  });

  it('flattens text-component title with extra fragments', () => {
    const adv = parseVanillaAdvancement(
      JSON.stringify({
        display: {
          title: { text: 'Hello ', extra: [{ text: 'world' }] },
          description: '',
          icon: { item: 'minecraft:stone' },
        },
        criteria: {},
      }),
    );
    expect(adv.title).toBe('Hello world');
    expect(adv.iconItem).toBe('webmc:stone');
  });

  it('returns null parent and empty defaults when fields are missing', () => {
    const adv = parseVanillaAdvancement('{}');
    expect(adv.parent).toBeNull();
    expect(adv.title).toBe('');
    expect(adv.iconItem).toBeNull();
    expect(adv.frame).toBe('task');
    expect(adv.criteria).toEqual({});
    expect(adv.requirements).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaAdvancement('not json')).toThrow(AdvancementParseError);
  });
});
