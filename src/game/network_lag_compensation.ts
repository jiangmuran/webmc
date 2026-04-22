// Client-side lag compensation. The local client runs the sim ahead of
// the server, then reconciles when a server snapshot arrives: rewind
// to acked snapshot and replay local inputs.

export interface InputRecord {
  seq: number;
  dx: number;
  dy: number;
  dz: number;
}

export interface Snapshot {
  seq: number;
  x: number;
  y: number;
  z: number;
}

export class ClientReconcile {
  private unacked: InputRecord[] = [];

  record(input: InputRecord): void {
    this.unacked.push(input);
  }

  // Server acked up to ackedSeq; drop everything ≤ acked.
  reconcile(serverSnap: Snapshot): Snapshot {
    this.unacked = this.unacked.filter((i) => i.seq > serverSnap.seq);
    let x = serverSnap.x;
    let y = serverSnap.y;
    let z = serverSnap.z;
    for (const inp of this.unacked) {
      x += inp.dx;
      y += inp.dy;
      z += inp.dz;
    }
    return { seq: this.lastSeq(), x, y, z };
  }

  private lastSeq(): number {
    return this.unacked.length === 0 ? 0 : (this.unacked[this.unacked.length - 1]?.seq ?? 0);
  }

  get unackedCount(): number {
    return this.unacked.length;
  }
}
