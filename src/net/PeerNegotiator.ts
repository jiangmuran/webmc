import { WebRTCTransport } from './transport';

export interface PeerNegotiatorOptions {
  localPeerId: string;
  remotePeerId: string;
  polite: boolean;
  iceServers?: RTCIceServer[];
  sendSignal: (to: string, payload: unknown) => void;
}

const DEFAULT_ICE: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
];

interface SignalPayload {
  kind?: 'offer' | 'answer' | 'ice';
  sdp?: string;
  type?: RTCSdpType;
  candidate?: RTCIceCandidateInit;
}

// Perfect-negotiation pattern (https://w3c.github.io/webrtc-pc/#perfect-negotiation-example)
// with an impolite/polite role so both sides can make offers and auto-resolve
// collisions.
export class PeerNegotiator {
  readonly pc: RTCPeerConnection;
  readonly transport: WebRTCTransport;
  private makingOffer = false;
  private ignoreOffer = false;
  private readonly sendSignal: (to: string, payload: unknown) => void;
  private readonly remotePeerId: string;
  private readonly polite: boolean;

  constructor(opts: PeerNegotiatorOptions) {
    this.remotePeerId = opts.remotePeerId;
    this.polite = opts.polite;
    this.sendSignal = opts.sendSignal;

    this.pc = new RTCPeerConnection({
      iceServers: opts.iceServers ?? DEFAULT_ICE,
    });

    this.transport = new WebRTCTransport(opts.remotePeerId, this.pc);

    this.pc.addEventListener('negotiationneeded', () => {
      void this.onNegotiationNeeded();
    });

    this.pc.addEventListener('icecandidate', (ev) => {
      if (ev.candidate) {
        this.sendSignal(this.remotePeerId, { kind: 'ice', candidate: ev.candidate.toJSON() });
      }
    });
  }

  // Called by the peer that initiates connection (after onPeerJoined).
  // Creating DataChannels triggers 'negotiationneeded' which kicks off the
  // SDP handshake. Returns immediately; completion is event-driven.
  initiate(): void {
    this.transport.createChannels();
  }

  async handleSignal(payload: unknown): Promise<void> {
    const p = payload as SignalPayload;
    try {
      if (p.sdp && p.type) {
        const description: RTCSessionDescriptionInit = { type: p.type, sdp: p.sdp };
        const offerCollision =
          description.type === 'offer' && (this.makingOffer || this.pc.signalingState !== 'stable');
        this.ignoreOffer = !this.polite && offerCollision;
        if (this.ignoreOffer) return;
        await this.pc.setRemoteDescription(description);
        if (description.type === 'offer') {
          await this.pc.setLocalDescription();
          const local = this.pc.localDescription;
          if (local) {
            this.sendSignal(this.remotePeerId, { sdp: local.sdp, type: local.type });
          }
        }
      } else if (p.kind === 'ice' && p.candidate) {
        try {
          await this.pc.addIceCandidate(p.candidate);
        } catch (err) {
          if (!this.ignoreOffer) throw err;
        }
      }
    } catch (err) {
      console.warn('[PeerNegotiator] signal handling failed', err);
    }
  }

  private async onNegotiationNeeded(): Promise<void> {
    try {
      this.makingOffer = true;
      await this.pc.setLocalDescription();
      const local = this.pc.localDescription;
      if (local) {
        this.sendSignal(this.remotePeerId, { sdp: local.sdp, type: local.type });
      }
    } catch (err) {
      console.warn('[PeerNegotiator] negotiationneeded failed', err);
    } finally {
      this.makingOffer = false;
    }
  }

  close(): void {
    this.transport.close('negotiator close');
  }
}
