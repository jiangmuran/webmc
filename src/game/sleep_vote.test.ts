import { describe, it, expect } from 'vitest';
import { evaluateSleepVote, performTimeSkip } from './sleep_vote';

describe('sleep vote', () => {
  it('no players = no skip', () => {
    const r = evaluateSleepVote({
      playersSleepingPercentage: 100,
      onlinePlayers: 0,
      sleepingPlayers: 0,
      skipWeather: true,
    });
    expect(r.shouldSkip).toBe(false);
  });

  it('all sleeping = skip', () => {
    const r = evaluateSleepVote({
      playersSleepingPercentage: 100,
      onlinePlayers: 4,
      sleepingPlayers: 4,
      skipWeather: true,
    });
    expect(r.shouldSkip).toBe(true);
  });

  it('partial sleep with 50% rule', () => {
    const r = evaluateSleepVote({
      playersSleepingPercentage: 50,
      onlinePlayers: 4,
      sleepingPlayers: 2,
      skipWeather: true,
    });
    expect(r.shouldSkip).toBe(true);
  });

  it('0% = any sleeper skips', () => {
    const r = evaluateSleepVote({
      playersSleepingPercentage: 0,
      onlinePlayers: 10,
      sleepingPlayers: 1,
      skipWeather: false,
    });
    expect(r.shouldSkip).toBe(true);
  });

  it('insufficient sleepers = no skip', () => {
    const r = evaluateSleepVote({
      playersSleepingPercentage: 100,
      onlinePlayers: 4,
      sleepingPlayers: 2,
      skipWeather: true,
    });
    expect(r.shouldSkip).toBe(false);
  });

  it('time skip returns dawn + clears weather', () => {
    const r = performTimeSkip(true);
    expect(r.newTimeOfDay).toBe(0);
    expect(r.clearedWeather).toBe(true);
  });
});
