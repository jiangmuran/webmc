import type { BlockState } from '@/blocks/state';
import { makeState } from '@/blocks/state';
import type { World } from '@/world/World';
import { type AnyMsg, type BlockEdit, MSG_BLOCK_EDIT, MSG_CHAT, decode, encode } from './codec';
import type { Transport } from './transport';

export type Role = 'host' | 'guest';

export interface MPSessionOptions {
  world: World;
  localPeerId: string;
  role: Role;
  onChat?: (from: string, text: string) => void;
}

export class MPSession {
  readonly role: Role;
  readonly localPeerId: string;
  private readonly world: World;
  private readonly transports = new Map<string, Transport>();
  private readonly unsubs = new Map<string, () => void>();
  private readonly onChat: (from: string, text: string) => void;
  private tick = 0;

  constructor(opts: MPSessionOptions) {
    this.role = opts.role;
    this.localPeerId = opts.localPeerId;
    this.world = opts.world;
    this.onChat = opts.onChat ?? (() => undefined);
  }

  addPeer(peerId: string, transport: Transport): void {
    if (this.transports.has(peerId)) this.removePeer(peerId);
    this.transports.set(peerId, transport);
    const off = transport.onMessage((_channel, bytes) => {
      this.handleIncoming(peerId, bytes);
    });
    this.unsubs.set(peerId, off);
  }

  removePeer(peerId: string): void {
    const off = this.unsubs.get(peerId);
    if (off) off();
    this.unsubs.delete(peerId);
    this.transports.delete(peerId);
  }

  get peerCount(): number {
    return this.transports.size;
  }

  applyLocalBlockEdit(edit: BlockEdit): void {
    this.applyEditToWorld(edit);
    const msg: AnyMsg = {
      tag: MSG_BLOCK_EDIT,
      tick: ++this.tick,
      edits: [edit],
    };
    if (this.role === 'host') {
      this.broadcast(encode(msg));
    } else {
      this.sendToHost(encode(msg));
    }
  }

  sendChat(text: string): void {
    const msg: AnyMsg = { tag: MSG_CHAT, text };
    const bytes = encode(msg);
    if (this.role === 'host') this.broadcast(bytes);
    else this.sendToHost(bytes);
  }

  close(): void {
    for (const [id, off] of this.unsubs) {
      off();
      this.transports.get(id)?.close('session close');
    }
    this.unsubs.clear();
    this.transports.clear();
  }

  private handleIncoming(peerId: string, bytes: Uint8Array): void {
    let msg: AnyMsg;
    try {
      msg = decode(bytes);
    } catch {
      return;
    }
    switch (msg.tag) {
      case MSG_BLOCK_EDIT:
        for (const edit of msg.edits) this.applyEditToWorld(edit);
        if (this.role === 'host') {
          this.rebroadcastExcept(peerId, bytes);
        }
        break;
      case MSG_CHAT:
        this.onChat(peerId, msg.text);
        if (this.role === 'host') this.rebroadcastExcept(peerId, bytes);
        break;
      default:
        break;
    }
  }

  private applyEditToWorld(edit: BlockEdit): void {
    const state: BlockState = edit.block === 0 ? 0 : makeState(edit.block, edit.meta);
    this.world.set(edit.x, edit.y, edit.z, state);
  }

  private broadcast(bytes: Uint8Array): void {
    for (const t of this.transports.values()) t.send('reliable', bytes);
  }

  private rebroadcastExcept(exceptPeerId: string, bytes: Uint8Array): void {
    for (const [id, t] of this.transports) {
      if (id === exceptPeerId) continue;
      t.send('reliable', bytes);
    }
  }

  private sendToHost(bytes: Uint8Array): void {
    const [hostTransport] = this.transports.values();
    if (hostTransport) hostTransport.send('reliable', bytes);
  }
}
