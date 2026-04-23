import { describe, it, expect } from 'vitest';
import { offspring, muleIsSterile } from './mule_breed';

describe('mule breed', () => {
  it('horse+horse → horse', () => {
    expect(offspring({ a: 'horse', b: 'horse' })).toBe('horse');
  });

  it('donkey+donkey → donkey', () => {
    expect(offspring({ a: 'donkey', b: 'donkey' })).toBe('donkey');
  });

  it('cross → mule', () => {
    expect(offspring({ a: 'horse', b: 'donkey' })).toBe('mule');
    expect(offspring({ a: 'donkey', b: 'horse' })).toBe('mule');
  });

  it('mule infertile', () => {
    expect(offspring({ a: 'mule', b: 'mule' })).toBeUndefined();
    expect(muleIsSterile()).toBe(true);
  });
});
