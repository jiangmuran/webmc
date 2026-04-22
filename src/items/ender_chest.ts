// Ender chest — per-player shared storage that spans dimensions. Logically
// one Container per player-id, accessible from any Ender Chest block.
// Implementation is a simple Map<playerId, Container>; the persistence
// layer saves/restores it alongside the player's inventory.

import type { Container } from './container';
import { makeContainer } from './container';

export class EnderChestStore {
  private readonly chests = new Map<string, Container>();
  private readonly maxStack: (itemId: number) => number;

  constructor(maxStack: (itemId: number) => number) {
    this.maxStack = maxStack;
  }

  // 27 slots per MC; each player has their own instance.
  getFor(playerId: string): Container {
    let c = this.chests.get(playerId);
    if (!c) {
      c = makeContainer(27, this.maxStack);
      this.chests.set(playerId, c);
    }
    return c;
  }

  hasFor(playerId: string): boolean {
    return this.chests.has(playerId);
  }

  removeFor(playerId: string): void {
    this.chests.delete(playerId);
  }
}
