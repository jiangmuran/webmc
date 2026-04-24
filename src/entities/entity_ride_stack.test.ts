import { describe, it, expect } from 'vitest';
import {
  canMount,
  mount,
  dismount,
  controllingPassenger,
  type Rideable,
} from './entity_ride_stack';

const boat: Rideable = { id: 'boat', maxPassengers: 2, passengerIds: [] };

describe('entity ride stack', () => {
  it('empty boat mounts', () => {
    expect(canMount(boat, 'alice')).toBe(true);
  });

  it('full boat rejects', () => {
    const full = { ...boat, passengerIds: ['a', 'b'] };
    expect(canMount(full, 'c')).toBe(false);
  });

  it('duplicate mount rejected', () => {
    expect(canMount({ ...boat, passengerIds: ['alice'] }, 'alice')).toBe(false);
  });

  it('mount adds', () => {
    expect(mount(boat, 'alice').passengerIds).toEqual(['alice']);
  });

  it('dismount removes', () => {
    const b = mount(boat, 'alice');
    expect(dismount(b, 'alice').passengerIds).toEqual([]);
  });

  it('controller is first passenger', () => {
    const b = mount(mount(boat, 'alice'), 'bob');
    expect(controllingPassenger(b)).toBe('alice');
  });
});
