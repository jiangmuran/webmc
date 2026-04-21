export type TransportChannel = 'reliable' | 'unreliable';

export interface Transport {
  readonly peerId: string;
  send(channel: TransportChannel, bytes: Uint8Array): void;
  onMessage(cb: (channel: TransportChannel, bytes: Uint8Array) => void): () => void;
  onClose(cb: (reason?: string) => void): () => void;
  close(reason?: string): void;
}

// Signaling-server-mediated WebSocket relay: every peer message is wrapped in
// a JSON envelope and sent through the signaling WS. Used as a fallback when
// WebRTC DataChannels cannot be established (strict NAT, corp firewall).
export class RelayTransport implements Transport {
  private msgHandlers: ((channel: TransportChannel, bytes: Uint8Array) => void)[] = [];
  private closeHandlers: ((reason?: string) => void)[] = [];
  private closed = false;

  constructor(
    readonly peerId: string,
    private readonly remotePeerId: string,
    private readonly signal: (obj: unknown) => void,
  ) {}

  send(channel: TransportChannel, bytes: Uint8Array): void {
    if (this.closed) return;
    // Encode as base64 for JSON transport. Binary DataChannel path avoids this.
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    const b64 = btoa(binary);
    this.signal({ type: 'relay', to: this.remotePeerId, channel, data: b64 });
  }

  receive(channel: TransportChannel, bytes: Uint8Array): void {
    if (this.closed) return;
    for (const h of this.msgHandlers) h(channel, bytes);
  }

  onMessage(cb: (channel: TransportChannel, bytes: Uint8Array) => void): () => void {
    this.msgHandlers.push(cb);
    return () => {
      this.msgHandlers = this.msgHandlers.filter((h) => h !== cb);
    };
  }

  onClose(cb: (reason?: string) => void): () => void {
    this.closeHandlers.push(cb);
    return () => {
      this.closeHandlers = this.closeHandlers.filter((h) => h !== cb);
    };
  }

  close(reason?: string): void {
    if (this.closed) return;
    this.closed = true;
    for (const h of this.closeHandlers) h(reason);
  }
}

// WebRTC DataChannel-backed transport. Two channels per peer: 'reliable'
// (ordered) for world edits and chat, 'unreliable' (unordered, 0 retransmits)
// for 30Hz position/entity telemetry.
export class WebRTCTransport implements Transport {
  private reliable: RTCDataChannel | null = null;
  private unreliable: RTCDataChannel | null = null;
  private msgHandlers: ((channel: TransportChannel, bytes: Uint8Array) => void)[] = [];
  private closeHandlers: ((reason?: string) => void)[] = [];
  private closed = false;

  constructor(
    readonly peerId: string,
    private readonly pc: RTCPeerConnection,
  ) {
    pc.addEventListener('datachannel', (ev) => {
      this.bindChannel(ev.channel);
    });
    pc.addEventListener('connectionstatechange', () => {
      if (pc.connectionState === 'closed' || pc.connectionState === 'failed') {
        this.close(pc.connectionState);
      }
    });
  }

  createChannels(): void {
    this.reliable = this.pc.createDataChannel('reliable', { ordered: true });
    this.unreliable = this.pc.createDataChannel('unreliable', {
      ordered: false,
      maxRetransmits: 0,
    });
    this.bindChannel(this.reliable);
    this.bindChannel(this.unreliable);
  }

  private bindChannel(dc: RTCDataChannel): void {
    dc.binaryType = 'arraybuffer';
    if (dc.label === 'reliable') this.reliable = dc;
    else if (dc.label === 'unreliable') this.unreliable = dc;
    dc.addEventListener('message', (ev: MessageEvent<ArrayBuffer>) => {
      if (this.closed) return;
      const channel: TransportChannel = dc.label === 'unreliable' ? 'unreliable' : 'reliable';
      const bytes = new Uint8Array(ev.data);
      for (const h of this.msgHandlers) h(channel, bytes);
    });
    dc.addEventListener('close', () => {
      const relClosed = !this.reliable || this.reliable.readyState === 'closed';
      const unrelClosed = !this.unreliable || this.unreliable.readyState === 'closed';
      if (relClosed && unrelClosed) this.close('both channels closed');
    });
  }

  send(channel: TransportChannel, bytes: Uint8Array): void {
    if (this.closed) return;
    const dc = channel === 'reliable' ? this.reliable : this.unreliable;
    if (dc?.readyState !== 'open') return;
    // RTCDataChannel.send accepts ArrayBufferView; cast past the
    // SharedArrayBuffer-wariness of the DOM lib types.
    dc.send(bytes as unknown as ArrayBufferView<ArrayBuffer>);
  }

  onMessage(cb: (channel: TransportChannel, bytes: Uint8Array) => void): () => void {
    this.msgHandlers.push(cb);
    return () => {
      this.msgHandlers = this.msgHandlers.filter((h) => h !== cb);
    };
  }

  onClose(cb: (reason?: string) => void): () => void {
    this.closeHandlers.push(cb);
    return () => {
      this.closeHandlers = this.closeHandlers.filter((h) => h !== cb);
    };
  }

  close(reason?: string): void {
    if (this.closed) return;
    this.closed = true;
    try {
      this.reliable?.close();
    } catch {
      /* ignore */
    }
    try {
      this.unreliable?.close();
    } catch {
      /* ignore */
    }
    this.pc.close();
    for (const h of this.closeHandlers) h(reason);
  }

  get connectionState(): RTCPeerConnectionState {
    return this.pc.connectionState;
  }
}
