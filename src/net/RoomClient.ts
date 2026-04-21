import type { World } from '@/world/World';
import { MPSession } from './MPSession';
import { PeerNegotiator } from './PeerNegotiator';
import { type SignalingClient, createSignalingClient } from './SignalingClient';

export interface RoomClientOptions {
  signalingUrl: string;
  world: World;
  onChat?: (from: string, text: string) => void;
  onRoom?: (code: string) => void;
  onError?: (message: string) => void;
  name?: string;
}

export class RoomClient {
  private readonly signaling: SignalingClient;
  private readonly world: World;
  private readonly name: string;
  private readonly onRoom: (code: string) => void;
  private readonly onError: (message: string) => void;
  private readonly onChat: ((from: string, text: string) => void) | undefined;
  private session: MPSession | null = null;
  private readonly negotiators = new Map<string, PeerNegotiator>();
  private _code: string | null = null;
  private _peerId = '';
  private _role: 'host' | 'guest' = 'host';

  constructor(opts: RoomClientOptions) {
    this.signaling = createSignalingClient(opts.signalingUrl);
    this.world = opts.world;
    this.name = opts.name ?? 'Player';
    this.onRoom = opts.onRoom ?? (() => undefined);
    this.onError = opts.onError ?? (() => undefined);
    this.onChat = opts.onChat;
  }

  get code(): string | null {
    return this._code;
  }

  get peerId(): string {
    return this._peerId;
  }

  get role(): 'host' | 'guest' {
    return this._role;
  }

  async createRoom(): Promise<void> {
    await this.signaling.connect();
    this.wireHandlers();
    return new Promise<void>((resolve) => {
      const off = this.signaling.onRoom((code, peerId) => {
        off();
        this._code = code;
        this._peerId = peerId;
        this._role = 'host';
        this.bootSession();
        this.onRoom(code);
        resolve();
      });
      this.signaling.create(this.name);
    });
  }

  async joinRoom(code: string): Promise<void> {
    await this.signaling.connect();
    this.wireHandlers();
    return new Promise<void>((resolve, reject) => {
      const offJoined = this.signaling.onJoined((info) => {
        offJoined();
        this._code = info.code;
        this._peerId = info.peerId;
        this._role = 'guest';
        this.bootSession();
        for (const remoteId of info.peers) this.openPeer(remoteId, /* initiator */ true);
        this.onRoom(info.code);
        resolve();
      });
      const offError = this.signaling.onError((msg) => {
        offError();
        reject(new Error(msg));
      });
      this.signaling.join(code);
    });
  }

  sendChat(text: string): void {
    this.session?.sendChat(text);
  }

  applyLocalBlockEdit(edit: {
    x: number;
    y: number;
    z: number;
    block: number;
    meta: number;
  }): void {
    this.session?.applyLocalBlockEdit(edit);
  }

  close(): void {
    for (const n of this.negotiators.values()) n.close();
    this.negotiators.clear();
    this.session?.close();
    this.session = null;
    this.signaling.leave();
    this.signaling.close();
  }

  private bootSession(): void {
    this.session = new MPSession({
      world: this.world,
      localPeerId: this._peerId,
      role: this._role,
      ...(this.onChat ? { onChat: this.onChat } : {}),
    });
  }

  private wireHandlers(): void {
    this.signaling.onPeerJoined((remoteId) => {
      this.openPeer(remoteId, /* initiator */ false);
    });
    this.signaling.onPeerLeft((remoteId) => {
      const neg = this.negotiators.get(remoteId);
      if (neg) {
        neg.close();
        this.negotiators.delete(remoteId);
      }
      this.session?.removePeer(remoteId);
    });
    this.signaling.onSignal(({ from, payload }) => {
      const neg = this.negotiators.get(from) ?? this.openPeer(from, /* initiator */ false);
      void neg.handleSignal(payload);
    });
    this.signaling.onError((m) => {
      this.onError(m);
    });
  }

  private openPeer(remoteId: string, initiator: boolean): PeerNegotiator {
    const existing = this.negotiators.get(remoteId);
    if (existing) return existing;
    const polite = this._peerId > remoteId;
    const neg = new PeerNegotiator({
      localPeerId: this._peerId,
      remotePeerId: remoteId,
      polite,
      sendSignal: (to, payload) => {
        this.signaling.sendSignal(to, payload);
      },
    });
    this.negotiators.set(remoteId, neg);
    if (this.session) this.session.addPeer(remoteId, neg.transport);
    if (initiator) neg.initiate();
    return neg;
  }
}
