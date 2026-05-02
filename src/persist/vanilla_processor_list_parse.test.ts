import { describe, it, expect } from 'vitest';
import { parseVanillaProcessorList, ProcessorListParseError } from './vanilla_processor_list_parse';

describe('vanilla processor_list parser', () => {
  it('parses a typical worn-jigsaw processor list', () => {
    const p = parseVanillaProcessorList(
      JSON.stringify({
        processors: [
          {
            processor_type: 'minecraft:rule',
            rules: [{ input_predicate: {}, output_state: {} }],
          },
          { processor_type: 'minecraft:gravity', heightmap: 'WORLD_SURFACE_WG' },
        ],
      }),
    );
    expect(p.processors).toHaveLength(2);
    expect(p.processors[0]?.type).toBe('webmc:rule');
    expect(p.processors[1]?.type).toBe('webmc:gravity');
    expect(p.processors[1]?.raw['heightmap']).toBe('WORLD_SURFACE_WG');
  });

  it('returns empty when processors missing', () => {
    expect(parseVanillaProcessorList('{}').processors).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaProcessorList('nope')).toThrow(ProcessorListParseError);
  });
});
