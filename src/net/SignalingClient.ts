export interface SignalingSocket {
  readonly readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  addEventListener(type: 'open', listener: () => void): void;
  addEventListener(type: 'close', listener: (ev: { code: number; reason: string }) => void): void;
  addEventListener(type: 'error', listener: (ev: Event) => void): void;
  addEventListener(type: 'message', listener: (ev: { data: string | ArrayBuffer }) => void): void;
}

export type SignalingSocketFactory = (url: string) => SignalingSocket;

export interface RoomInfo {
  code: string;
  peerId: string;
  hostPeerId: string;
  peers: string[];
}

export interface SignalMessage {
  from: string;
  payload: unknown;
}

export interface SignalingEvents {
  onRoom(cb: (code: string, peerId: string) => void): () => void;
  onJoined(cb: (info: RoomInfo) => void): () => void;
  onPeerJoined(cb: (peerId: string) => void): () => void;
  onPeerLeft(cb: (peerId: string) => void): () => void;
  onSignal(cb: (msg: SignalMessage) => void): () => void;
  onError(cb: (message: string) => void): () => void;
  onClose(cb: (reason?: string) => void): () => void;
}

export interface SignalingClient extends SignalingEvents {
  readonly connected: boolean;
  connect(): Promise<void>;
  create(name?: string): void;
  join(code: string): void;
  sendSignal(to: string, payload: unknown): void;
  leave(): void;
  close(): void;
}

function defaultFactory(url: string): SignalingSocket {
  return new WebSocket(url);
}

type CB<T extends unknown[]> = (...args: T) => void;

interface Handlers {
  room: CB<[string, string]>[];
  joined: CB<[RoomInfo]>[];
  peerJoined: CB<[string]>[];
  peerLeft: CB<[string]>[];
  signal: CB<[SignalMessage]>[];
  error: CB<[string]>[];
  close: CB<[string | undefined]>[];
}

function fire<K extends keyof Handlers>(
  handlers: Handlers,
  key: K,
  ...args: Parameters<Handlers[K][number]>
): void {
  for (const h of handlers[key] as CB<Parameters<Handlers[K][number]>>[]) h(...args);
}

function subscribe<K extends keyof Handlers>(
  handlers: Handlers,
  key: K,
  cb: Handlers[K][number],
): () => void {
  (handlers[key] as Handlers[K][number][]).push(cb);
  return () => {
    const arr = handlers[key] as Handlers[K][number][];
    const i = arr.indexOf(cb);
    if (i >= 0) arr.splice(i, 1);
  };
}

export function createSignalingClient(
  url: string,
  factory: SignalingSocketFactory = defaultFactory,
): SignalingClient {
  let socket: SignalingSocket | null = null;
  const handlers: Handlers = {
    room: [],
    joined: [],
    peerJoined: [],
    peerLeft: [],
    signal: [],
    error: [],
    close: [],
  };

  function sendRaw(obj: unknown): void {
    if (socket?.readyState !== 1) return;
    socket.send(JSON.stringify(obj));
  }

  function handleMessage(raw: string): void {
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      fire(handlers, 'error', 'bad json from server');
      return;
    }
    switch (msg['type']) {
      case 'room': {
        const code = msg['code'] as string;
        const peerId = msg['peerId'] as string;
        fire(handlers, 'room', code, peerId);
        break;
      }
      case 'joined': {
        fire(handlers, 'joined', {
          code: msg['code'] as string,
          peerId: msg['peerId'] as string,
          hostPeerId: msg['hostPeerId'] as string,
          peers: (msg['peers'] ?? []) as string[],
        });
        break;
      }
      case 'peer-joined':
        fire(handlers, 'peerJoined', msg['peerId'] as string);
        break;
      case 'peer-left':
        fire(handlers, 'peerLeft', msg['peerId'] as string);
        break;
      case 'signal':
        fire(handlers, 'signal', {
          from: msg['from'] as string,
          payload: msg['payload'],
        });
        break;
      case 'error':
        fire(handlers, 'error', (msg['message'] as string | undefined) ?? 'unknown error');
        break;
      default:
        fire(handlers, 'error', `unknown message type ${String(msg['type'])}`);
    }
  }

  return {
    get connected(): boolean {
      return socket !== null && socket.readyState === 1;
    },
    connect(): Promise<void> {
      return new Promise((resolve, reject) => {
        const sock = factory(url);
        socket = sock;
        const onOpen = (): void => {
          resolve();
        };
        const onError = (): void => {
          reject(new Error('signaling socket error'));
        };
        sock.addEventListener('open', onOpen);
        sock.addEventListener('error', onError);
        sock.addEventListener('message', (ev) => {
          if (typeof ev.data === 'string') handleMessage(ev.data);
        });
        sock.addEventListener('close', (ev) => {
          fire(handlers, 'close', ev.reason || undefined);
        });
      });
    },
    create(name?: string): void {
      sendRaw({ type: 'create', name });
    },
    join(code: string): void {
      sendRaw({ type: 'join', code });
    },
    sendSignal(to: string, payload: unknown): void {
      sendRaw({ type: 'signal', to, payload });
    },
    leave(): void {
      sendRaw({ type: 'leave' });
    },
    close(): void {
      socket?.close();
      socket = null;
    },
    onRoom: (cb) => subscribe(handlers, 'room', cb),
    onJoined: (cb) => subscribe(handlers, 'joined', cb),
    onPeerJoined: (cb) => subscribe(handlers, 'peerJoined', cb),
    onPeerLeft: (cb) => subscribe(handlers, 'peerLeft', cb),
    onSignal: (cb) => subscribe(handlers, 'signal', cb),
    onError: (cb) => subscribe(handlers, 'error', cb),
    onClose: (cb) => subscribe(handlers, 'close', cb),
  };
}
