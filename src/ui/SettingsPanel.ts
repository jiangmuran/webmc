export interface SettingsValues {
  fov: number;
  viewDistance: number;
  mouseSensitivity: number;
  masterVolume: number;
  chunkUploadBudget: number;
  invertY: boolean;
  sprintToggle: boolean;
  brightness: number;
  showCrosshair: boolean;
  playerName: string;
  showMobNames: boolean;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export const DEFAULT_SETTINGS: SettingsValues = {
  fov: 70,
  viewDistance: 6,
  mouseSensitivity: 0.0022,
  masterVolume: 0.35,
  chunkUploadBudget: 4,
  invertY: false,
  sprintToggle: false,
  brightness: 1.0,
  showCrosshair: true,
  playerName: 'Player',
  showMobNames: true,
  highContrast: false,
  largeText: false,
  reduceMotion: false,
};

const STORAGE_KEY = 'webmc:settings';

export function loadSettings(): SettingsValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SettingsValues>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(v: SettingsValues): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    // storage quota or privacy mode — non-fatal
  }
}

export interface SettingsPanelCallbacks {
  onChange: (v: SettingsValues) => void;
}

export class SettingsPanel {
  readonly root: HTMLDivElement;
  private visible = false;
  private readonly values: SettingsValues;
  private readonly uiResetters: (() => void)[] = [];

  constructor(
    parent: HTMLElement,
    private readonly cb: SettingsPanelCallbacks,
  ) {
    this.values = loadSettings();

    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'settings-panel');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'background:rgba(0,0,0,0.55)',
      'backdrop-filter:blur(2px)',
      'z-index:1200',
      'color:#e6edf3',
      'pointer-events:auto',
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background:rgba(18,22,30,0.96)',
      'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:8px',
      'padding:14px',
      'width:min(420px,92vw)',
      'max-height:86vh',
      'overflow-y:auto',
      'display:flex',
      'flex-direction:column',
      'gap:10px',
      'font-size:13px',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Settings';
    title.style.cssText = 'font-size:18px;font-weight:600;';
    panel.appendChild(title);

    this.slider(panel, 'FOV', 'fov', 30, 110, 1);
    this.slider(panel, 'View distance (chunks)', 'viewDistance', 2, 16, 1);
    this.slider(panel, 'Mouse sensitivity', 'mouseSensitivity', 0.0005, 0.01, 0.0001);
    this.slider(panel, 'Master volume', 'masterVolume', 0, 1, 0.01);
    this.slider(panel, 'Chunk upload per frame', 'chunkUploadBudget', 1, 16, 1);
    this.slider(panel, 'Brightness', 'brightness', 0.5, 2.0, 0.05);
    this.checkbox(panel, 'Invert Y', 'invertY');
    this.checkbox(panel, 'Sprint toggle (vs hold)', 'sprintToggle');
    this.checkbox(panel, 'Show crosshair', 'showCrosshair');
    this.checkbox(panel, 'Show mob names', 'showMobNames');
    this.checkbox(panel, 'High contrast', 'highContrast');
    this.checkbox(panel, 'Large text', 'largeText');
    this.checkbox(panel, 'Reduce motion', 'reduceMotion');
    this.textInput(panel, 'Player name', 'playerName');

    const presetRow = document.createElement('div');
    presetRow.style.cssText = 'display:flex;gap:6px;align-self:flex-start;flex-wrap:wrap;';
    const potatoBtn = document.createElement('button');
    potatoBtn.textContent = 'Potato preset';
    potatoBtn.style.cssText =
      'padding:4px 10px;background:rgba(100,50,30,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:11px;';
    potatoBtn.addEventListener('click', () => {
      Object.assign(this.values, {
        ...DEFAULT_SETTINGS,
        viewDistance: 3,
        chunkUploadBudget: 1,
        masterVolume: 0,
        showMobNames: false,
        brightness: 1.4,
        fov: 65,
      });
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
      for (const r of this.uiResetters) r();
    });
    presetRow.appendChild(potatoBtn);
    const fastBtn = document.createElement('button');
    fastBtn.textContent = 'Fast preset';
    fastBtn.style.cssText =
      'padding:4px 10px;background:rgba(80,60,40,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:11px;';
    fastBtn.addEventListener('click', () => {
      Object.assign(this.values, {
        ...DEFAULT_SETTINGS,
        viewDistance: 4,
        chunkUploadBudget: 2,
        masterVolume: 0.2,
      });
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
      for (const r of this.uiResetters) r();
    });
    presetRow.appendChild(fastBtn);
    const qualityBtn = document.createElement('button');
    qualityBtn.textContent = 'Quality preset';
    qualityBtn.style.cssText =
      'padding:4px 10px;background:rgba(40,60,100,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:11px;';
    qualityBtn.addEventListener('click', () => {
      Object.assign(this.values, {
        ...DEFAULT_SETTINGS,
        viewDistance: 12,
        chunkUploadBudget: 8,
        masterVolume: 0.5,
      });
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
      for (const r of this.uiResetters) r();
    });
    presetRow.appendChild(qualityBtn);
    const ultraBtn = document.createElement('button');
    ultraBtn.textContent = 'Ultra preset';
    ultraBtn.style.cssText =
      'padding:4px 10px;background:rgba(60,30,100,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:11px;';
    ultraBtn.addEventListener('click', () => {
      Object.assign(this.values, {
        ...DEFAULT_SETTINGS,
        viewDistance: 16,
        chunkUploadBudget: 12,
        masterVolume: 0.6,
        fov: 75,
      });
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
      for (const r of this.uiResetters) r();
    });
    presetRow.appendChild(ultraBtn);
    panel.appendChild(presetRow);

    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = 'display:flex;gap:8px;align-self:flex-end;';
    const reset = document.createElement('button');
    reset.textContent = 'Reset';
    reset.style.cssText =
      'padding:6px 14px;background:rgba(100,60,50,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    reset.addEventListener('click', () => {
      Object.assign(this.values, DEFAULT_SETTINGS);
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
      for (const r of this.uiResetters) r();
    });
    buttonRow.appendChild(reset);
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.cssText =
      'padding:6px 14px;background:rgba(50,80,110,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    close.addEventListener('click', () => {
      this.hide();
    });
    buttonRow.appendChild(close);
    panel.appendChild(buttonRow);

    this.root.appendChild(panel);
    parent.appendChild(this.root);

    // Apply initial values
    cb.onChange({ ...this.values });
  }

  private slider(
    parent: HTMLElement,
    label: string,
    key: keyof SettingsValues,
    min: number,
    max: number,
    step: number,
  ): void {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-direction:column;gap:3px;';
    const lbl = document.createElement('label');
    const valueSpan = document.createElement('span');
    valueSpan.style.cssText = 'opacity:0.7;margin-left:6px;';
    lbl.textContent = label;
    lbl.appendChild(valueSpan);
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    const current = this.values[key] as number;
    input.value = String(current);
    valueSpan.textContent = `= ${formatValue(current)}`;
    input.addEventListener('input', () => {
      const v = Number(input.value);
      (this.values as unknown as Record<string, number | boolean>)[key as string] = v;
      valueSpan.textContent = `= ${formatValue(v)}`;
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
    });
    row.append(lbl, input);
    parent.appendChild(row);
    this.uiResetters.push(() => {
      const v = this.values[key] as number;
      input.value = String(v);
      valueSpan.textContent = `= ${formatValue(v)}`;
    });
  }

  private textInput(parent: HTMLElement, label: string, key: keyof SettingsValues): void {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const lbl = document.createElement('span');
    lbl.textContent = label;
    lbl.style.cssText = 'opacity:0.85;';
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 20;
    input.value = String(this.values[key]);
    input.style.cssText =
      'flex:1;padding:4px 6px;background:rgba(0,0,0,0.4);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;font:inherit;font-size:12px;';
    input.addEventListener('change', () => {
      (this.values as unknown as Record<string, string>)[key as string] = input.value;
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
    });
    row.append(lbl, input);
    parent.appendChild(row);
    this.uiResetters.push(() => {
      input.value = String(this.values[key]);
    });
  }

  private checkbox(parent: HTMLElement, label: string, key: keyof SettingsValues): void {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(this.values[key]);
    input.addEventListener('change', () => {
      (this.values as unknown as Record<string, number | boolean>)[key as string] = input.checked;
      saveSettings(this.values);
      this.cb.onChange({ ...this.values });
    });
    const text = document.createElement('span');
    text.textContent = label;
    row.append(input, text);
    parent.appendChild(row);
    this.uiResetters.push(() => {
      input.checked = Boolean(this.values[key]);
    });
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.root.style.display = 'flex';
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.style.display = 'none';
  }

  isVisible(): boolean {
    return this.visible;
  }

  get(): SettingsValues {
    return { ...this.values };
  }
}

function formatValue(v: number): string {
  if (Math.abs(v) < 0.01) return v.toFixed(4);
  if (Math.abs(v) < 1) return v.toFixed(3);
  return v.toFixed(0);
}
