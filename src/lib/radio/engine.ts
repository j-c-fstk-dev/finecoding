'use client';

/**
 * Fine Coding Radio: a generative music engine built on Tone.js.
 *
 * Everything is synthesized live in the browser: no audio files, no samples,
 * no licensed music. The engine is a module-level singleton, so it keeps
 * playing while the reader navigates around the blog. Tone.js is imported
 * only when the radio is first started.
 */

import type * as ToneNS from 'tone';

export const LAYERS = ['pad', 'bass', 'keys', 'drums', 'rain', 'vinyl'] as const;
export type LayerId = (typeof LAYERS)[number];
export const FX = ['reverb', 'delay', 'lofi'] as const;
export type FxId = (typeof FX)[number];
export const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export type KeyName = (typeof KEYS)[number];

type Pattern = 'none' | 'lofi' | 'deep' | 'techno';

export interface StyleDef {
  description: string;
  bpm: number;
  swing: number;
  chordBars: number;
  keysDensity: number;
  pattern: Pattern;
  layers: Record<LayerId, number>; // 0 = off
  fx: Record<FxId, number>;
}

export const STYLES: Record<string, StyleDef> = {
  ambient: {
    description: 'slow pads, no beat, lots of space',
    bpm: 60, swing: 0, chordBars: 2, keysDensity: 0.22, pattern: 'none',
    layers: { pad: 85, bass: 45, keys: 40, drums: 0, rain: 35, vinyl: 0 },
    fx: { reverb: 80, delay: 50, lofi: 15 },
  },
  lofi: {
    description: 'warm chords, lazy swung beat, vinyl and rain',
    bpm: 76, swing: 0.12, chordBars: 1, keysDensity: 0.5, pattern: 'lofi',
    layers: { pad: 70, bass: 70, keys: 55, drums: 70, rain: 35, vinyl: 45 },
    fx: { reverb: 40, delay: 30, lofi: 60 },
  },
  deep: {
    description: 'four-on-the-floor, offbeat bass, deep focus',
    bpm: 118, swing: 0, chordBars: 2, keysDensity: 0.35, pattern: 'deep',
    layers: { pad: 55, bass: 80, keys: 40, drums: 80, rain: 0, vinyl: 0 },
    fx: { reverb: 35, delay: 40, lofi: 10 },
  },
  techno: {
    description: 'four-on-the-floor, rolling acid bass, hypnotic loop',
    bpm: 128, swing: 0, chordBars: 4, keysDensity: 1, pattern: 'techno',
    layers: { pad: 35, bass: 80, keys: 50, drums: 85, rain: 0, vinyl: 0 },
    fx: { reverb: 25, delay: 45, lofi: 5 },
  },
  rain: {
    description: 'rain on the window and a soft drone',
    bpm: 60, swing: 0, chordBars: 4, keysDensity: 0, pattern: 'none',
    layers: { pad: 40, bass: 0, keys: 0, drums: 0, rain: 85, vinyl: 25 },
    fx: { reverb: 85, delay: 20, lofi: 40 },
  },
};
export type StyleName = keyof typeof STYLES;

export interface RadioState {
  status: 'stopped' | 'loading' | 'playing';
  style: string;
  bpm: number;
  key: KeyName;
  master: number;
  layers: Record<LayerId, { on: boolean; vol: number }>;
  fx: Record<FxId, number>;
  output: 'media' | 'direct' | null;
  /** auto picks "lite" on low-end devices */
  quality: Quality;
  /** song structure: sections, builds and drops (off = endless loop) */
  arrange: boolean;
  /** current section name while playing (not persisted) */
  section: string;
}

export type Quality = 'auto' | 'high' | 'lite';

/** Rough low-end check: few CPU cores or little memory. */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return cores <= 4 || (memory !== undefined && memory <= 4);
}

export function effectiveQuality(q: Quality): 'high' | 'lite' {
  return q === 'auto' ? (isLowEndDevice() ? 'lite' : 'high') : q;
}

const STORAGE_KEY = 'fc-radio-v1';

/** Initial state used for server rendering and hydration. */
export const DEFAULT_STATE: RadioState = {} as RadioState;

function stateFromStyle(name: string, keep?: Partial<RadioState>): RadioState {
  const s = STYLES[name] ?? STYLES.lofi;
  return {
    status: keep?.status ?? 'stopped',
    style: STYLES[name] ? name : 'lofi',
    bpm: s.bpm,
    key: keep?.key ?? 'A',
    master: keep?.master ?? 80,
    layers: Object.fromEntries(LAYERS.map((l) => [l, { on: s.layers[l] > 0, vol: s.layers[l] > 0 ? s.layers[l] : 50 }])) as RadioState['layers'],
    fx: { ...s.fx },
    output: keep?.output ?? null,
    quality: keep?.quality ?? 'auto',
    arrange: keep?.arrange ?? true,
    section: keep?.section ?? '',
  };
}

Object.assign(DEFAULT_STATE, stateFromStyle('lofi'));

function loadSaved(): RadioState {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const saved = JSON.parse(raw) as Partial<RadioState>;
      const base = stateFromStyle(saved.style ?? 'lofi');
      return { ...base, ...saved, status: 'stopped', output: null, section: '', layers: { ...base.layers, ...saved.layers }, fx: { ...base.fx, ...saved.fx } };
    }
  } catch {
    /* storage unavailable */
  }
  return stateFromStyle('lofi');
}

// ---------------------------------------------------------------------------
// state + subscriptions
// ---------------------------------------------------------------------------

let state: RadioState | null = null;
const listeners = new Set<() => void>();

function getState(): RadioState {
  if (!state) state = loadSaved();
  return state;
}

function setState(patch: Partial<RadioState>) {
  state = { ...getState(), ...patch };
  try {
    const { status: _s, output: _o, section: _sec, ...persist } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
  // the section label alone doesn't touch the audio (and is set from the
  // audio callback, where apply()'s "now"-based ramps would be mistimed)
  if (!(Object.keys(patch).length === 1 && 'section' in patch)) apply();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------------------------------------------------------------------------
// audio graph
// ---------------------------------------------------------------------------

type Graph = {
  Tone: typeof ToneNS;
  transport: ReturnType<typeof ToneNS.getTransport>;
  master: ToneNS.Volume;
  lofiFilter: ToneNS.Filter;
  analyser: ToneNS.Analyser;
  reverbSend: ToneNS.Gain;
  delay: ToneNS.FeedbackDelay;
  layerVol: Record<LayerId, ToneNS.Volume>;
  pad: ToneNS.PolySynth;
  bass: ToneNS.MonoSynth;
  keys: ToneNS.FMSynth;
  kick: ToneNS.MembraneSynth;
  snare: ToneNS.NoiseSynth;
  hat: ToneNS.NoiseSynth;
  rain: ToneNS.Noise;
  crackle: ToneNS.NoiseSynth;
  audioEl: HTMLAudioElement | null;
  loopId: number | null;
  quality: 'high' | 'lite';
  /** per-layer gain the arrangement automates (fades in/out) */
  arr: Record<ArrLayer, ToneNS.Gain>;
  /** master high-pass that sweeps up during a build */
  sweep: ToneNS.Filter;
  riser: { noise: ToneNS.Noise; filter: ToneNS.Filter; gain: ToneNS.Gain } | null;
};

const ARR_LAYERS = ['pad', 'bass', 'keys'] as const;
type ArrLayer = (typeof ARR_LAYERS)[number];

let graph: Graph | null = null;
let step = 0;
let chordIndex = 0;

const BASE_DB: Record<LayerId, number> = { pad: -20, bass: -12, keys: -21, drums: -2, rain: -30, vinyl: -24 };

// Chords in A minor (transposed with `key`): voicing + bass note
const CHORDS: Record<string, { notes: string[]; bass: string }> = {
  Am9: { notes: ['A2', 'E3', 'G3', 'B3', 'C4'], bass: 'A1' },
  Fmaj7: { notes: ['F2', 'C3', 'E3', 'A3', 'C4'], bass: 'F1' },
  Cmaj9: { notes: ['C3', 'E3', 'G3', 'B3', 'D4'], bass: 'C2' },
  G6: { notes: ['G2', 'D3', 'E3', 'B3', 'D4'], bass: 'G1' },
  Dm9: { notes: ['D3', 'F3', 'A3', 'C4', 'E4'], bass: 'D2' },
  Em7: { notes: ['E2', 'B2', 'D3', 'G3', 'B3'], bass: 'E1' },
};
// Each drop moves to the next progression
const PROGRESSIONS = [
  ['Am9', 'Fmaj7', 'Cmaj9', 'G6'],
  ['Fmaj7', 'G6', 'Em7', 'Am9'],
  ['Am9', 'Dm9', 'Fmaj7', 'Em7'],
  ['Dm9', 'G6', 'Cmaj9', 'Am9'],
];
const MELODY = ['A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6'];
const TECHNO_POOL = ['A3', 'C4', 'D4', 'E4', 'G4', 'A4'];
const TECHNO_RHYTHMS = [[0, 3, 6, 8, 11, 14], [0, 2, 6, 10, 12], [0, 3, 7, 10, 13], [2, 6, 8, 11, 14], [0, 3, 6, 9, 12, 14]];

// ---------------------------------------------------------------------------
// arrangement: the song is a sequence of sections that loops
// ---------------------------------------------------------------------------

type DrumMode = 'full' | 'kick' | 'none' | 'build';
interface Section {
  name: string;
  bars: number;
  drums: DrumMode;
  /** layer levels 0..1 (missing = 1) */
  mix: Partial<Record<ArrLayer, number>>;
  /** bars to fade into the mix (0 = cut) */
  fade?: number;
  newMotif?: boolean;
  newProg?: boolean;
  /** build: high-pass sweep target in Hz */
  sweep?: number;
}
interface Arrangement { sections: Section[]; loopFrom: number }

const beatArrangement = (introDrums: DrumMode, buildBars: number, sweep: number): Arrangement => ({
  sections: [
    { name: 'intro', bars: 8, drums: introDrums, mix: { bass: 0.5, keys: 0.7 } },
    { name: 'groove', bars: 16, drums: 'full', mix: {}, fade: 1 },
    { name: 'break', bars: 8, drums: 'none', mix: { bass: 0, keys: 0.9 }, fade: 1, newMotif: true },
    { name: 'build', bars: buildBars, drums: 'build', mix: { bass: 0.6, pad: 0.7 }, sweep },
    { name: 'drop', bars: 16, drums: 'full', mix: {}, newMotif: true, newProg: true },
    { name: 'groove', bars: 16, drums: 'full', mix: { pad: 0.6, keys: 0.5 }, fade: 2 },
  ],
  loopFrom: 2,
});

const ARRANGEMENTS: Record<Pattern, Arrangement> = {
  lofi: beatArrangement('none', 1, 500),
  deep: beatArrangement('kick', 4, 900),
  techno: beatArrangement('kick', 8, 1200),
  none: {
    sections: [
      { name: 'bloom', bars: 16, drums: 'none', mix: {}, fade: 4 },
      { name: 'drift', bars: 8, drums: 'none', mix: { pad: 0.25, keys: 0.5, bass: 0 }, fade: 4 },
      { name: 'swell', bars: 16, drums: 'none', mix: {}, fade: 4, newMotif: true, newProg: true },
    ],
    loopFrom: 1,
  },
};
// Techno: the first one-bar figure (later ones are generated)
const TECHNO_MOTIF: Record<number, string> = { 0: 'A3', 3: 'A3', 6: 'C4', 8: 'A3', 11: 'E4', 14: 'D4' };
const KEY_OFFSET: Record<KeyName, number> = { C: 3, D: 5, E: -5, F: -4, G: -2, A: 0, B: 2 };

async function buildGraph(): Promise<Graph> {
  const Tone = await import('tone');
  const quality = effectiveQuality(getState().quality);
  const lite = quality === 'lite';
  // Larger buffers: the radio doesn't need low latency, and bigger buffers
  // avoid crackles on slow devices.
  Tone.setContext(new Tone.Context({ latencyHint: 'playback', lookAhead: lite ? 0.3 : 0.15 }));
  await Tone.start();
  const transport = Tone.getTransport();

  const master = new Tone.Volume(0);
  const comp = new Tone.Compressor({ threshold: -18, ratio: 3, attack: 0.02, release: 0.3 });
  const lofiFilter = new Tone.Filter(12000, 'lowpass');
  const limiter = new Tone.Limiter(-1);
  const analyser = new Tone.Analyser('fft', lite ? 64 : 128);
  const sweep = new Tone.Filter({ frequency: 20, type: 'highpass', rolloff: -12 });
  master.chain(sweep, comp, lofiFilter, limiter);
  limiter.connect(analyser);

  // Output: prefer an <audio> element fed by a MediaStream, so the phone
  // treats the radio as regular media (lock-screen controls, background play).
  let audioEl: HTMLAudioElement | null = null;
  let output: RadioState['output'] = 'direct';
  try {
    const raw = Tone.getContext().rawContext as unknown as AudioContext;
    if (typeof raw.createMediaStreamDestination === 'function') {
      const dest = raw.createMediaStreamDestination();
      Tone.connect(limiter, dest);
      audioEl = document.createElement('audio');
      audioEl.setAttribute('playsinline', '');
      audioEl.srcObject = dest.stream;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      await audioEl.play();
      output = 'media';
    } else {
      limiter.toDestination();
    }
  } catch {
    if (audioEl) { audioEl.remove(); audioEl = null; }
    limiter.toDestination();
    output = 'direct';
  }

  const reverb = new Tone.Reverb({ decay: lite ? 3 : 6, wet: 1, preDelay: 0.03 });
  const reverbSend = new Tone.Gain(0.3).connect(reverb);
  reverb.connect(master);

  const layerVol = Object.fromEntries(LAYERS.map((l) => [l, new Tone.Volume(BASE_DB[l])])) as Graph['layerVol'];
  LAYERS.forEach((l) => layerVol[l].connect(master));
  const arr = Object.fromEntries(ARR_LAYERS.map((l) => [l, new Tone.Gain(1)])) as Graph['arr'];

  // build riser: filtered white noise, only scheduled during builds
  let riser: Graph['riser'] = null;
  if (!lite) {
    const noise = new Tone.Noise('white');
    noise.volume.value = -30;
    const filter = new Tone.Filter(500, 'bandpass');
    const gain = new Tone.Gain(0);
    noise.chain(filter, gain, master);
    gain.connect(reverbSend);
    riser = { noise, filter, gain };
  }

  // pad
  // Lite: 2 detuned oscillators per voice instead of 3, fewer voices,
  // no chorus and a static filter instead of an LFO sweep.
  const pad = new Tone.PolySynth({
    voice: Tone.Synth,
    // enough for the release tails of two chords plus the next one
    maxPolyphony: lite ? 12 : 16,
    options: {
      oscillator: { type: 'fatsawtooth', count: lite ? 2 : 3, spread: lite ? 16 : 22 },
      envelope: { attack: 1.6, decay: 1, sustain: 0.7, release: lite ? 2.5 : 3.5 },
    },
  });
  const padFilter = new Tone.Filter(lite ? 1000 : 900, 'lowpass', lite ? -12 : -24);
  if (lite) {
    pad.chain(arr.pad, padFilter, layerVol.pad);
    padFilter.connect(reverbSend);
  } else {
    const padChorus = new Tone.Chorus(0.6, 3.5, 0.5).start();
    pad.chain(arr.pad, padFilter, padChorus, layerVol.pad);
    padChorus.connect(reverbSend);
    new Tone.LFO('0.07hz', 600, 1500).start().connect(padFilter.frequency);
  }

  // bass
  const bass = new Tone.MonoSynth({
    oscillator: { type: 'triangle' },
    filter: { Q: 1, type: 'lowpass', rolloff: -24 },
    envelope: { attack: 0.02, decay: 0.4, sustain: 0.6, release: 0.8 },
    filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, baseFrequency: 120, octaves: 2.5 },
  });
  bass.chain(arr.bass, layerVol.bass);

  // keys
  const keys = new Tone.FMSynth({
    harmonicity: 2, modulationIndex: 3,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: 0.6, sustain: 0.1, release: 1.2 },
    modulation: { type: 'triangle' },
    modulationEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 },
  });
  const delay = new Tone.FeedbackDelay('8n.', 0.35);
  keys.chain(arr.keys, delay, layerVol.keys);
  delay.connect(reverbSend);

  // drums
  const kick = new Tone.MembraneSynth({ pitchDecay: 0.04, octaves: 6, envelope: { attack: 0.001, decay: 0.45, sustain: 0, release: 0.2 } });
  kick.volume.value = -8;
  kick.connect(layerVol.drums);
  const snareFilter = new Tone.Filter(1800, 'bandpass', -12);
  const snare = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 } });
  snare.volume.value = -18;
  snare.chain(snareFilter, layerVol.drums);
  snareFilter.connect(reverbSend);
  const hatFilter = new Tone.Filter(8000, 'highpass');
  const hat = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.045, sustain: 0 } });
  hat.volume.value = -28;
  hat.chain(hatFilter, layerVol.drums);

  // rain
  const rain = new Tone.Noise('pink');
  const rainLP = new Tone.Filter(5500, 'lowpass');
  rain.chain(new Tone.Filter(700, 'highpass'), rainLP, layerVol.rain);
  if (!lite) new Tone.LFO('0.11hz', 4500, 6500).start().connect(rainLP.frequency);

  // vinyl crackle
  const crackle = new Tone.NoiseSynth({ noise: { type: 'brown' }, envelope: { attack: 0.001, decay: 0.008, sustain: 0 } });
  crackle.chain(new Tone.Filter(2500, 'highpass'), layerVol.vinyl);

  setState({ output });

  return {
    Tone, transport, master, lofiFilter, analyser, reverbSend, delay, layerVol,
    pad, bass, keys, kick, snare, hat, rain, crackle, audioEl, loopId: null, quality,
    arr, sweep, riser,
  };
}

/** Tear the whole audio graph down (its AudioContext included). */
function disposeGraph() {
  if (!graph) return;
  try {
    graph.transport.stop();
    graph.transport.cancel();
    graph.audioEl?.remove();
    graph.Tone.getContext().dispose();
  } catch {
    /* already closed */
  }
  graph = null;
}

function t(note: string): string {
  if (!graph) return note;
  const s = getState();
  return graph.Tone.Frequency(note).transpose(KEY_OFFSET[s.key]).toNote();
}

function layerOn(id: LayerId) {
  const l = getState().layers[id];
  return l.on && l.vol > 0;
}

// arrangement position
let sectionIdx = -1;
let barInSection = 0;
let progIdx = 0;
let motif: (string | null)[] = [];
/** set to jump to a section at the next bar (play, style change, `next`) */
let pending: { idx: number | 'next'; fresh?: boolean } | null = null;

function arrangement(): Arrangement {
  const style = STYLES[getState().style] ?? STYLES.lofi;
  return ARRANGEMENTS[style.pattern];
}

function grooveIndex(): number {
  const i = arrangement().sections.findIndex((x) => x.name === 'groove');
  return i >= 0 ? i : 0;
}

function currentSection(): Section | null {
  if (!getState().arrange) return null;
  return arrangement().sections[sectionIdx] ?? null;
}

/** A melodic phrase: techno = one bar, others = two bars, built by random walk. */
function makeMotif(style: StyleDef, first = false) {
  const rnd = Math.random;
  if (style.pattern === 'techno') {
    const m: (string | null)[] = new Array(16).fill(null);
    if (first) {
      Object.entries(TECHNO_MOTIF).forEach(([k, v]) => { m[Number(k)] = v; });
    } else {
      const rhythm = TECHNO_RHYTHMS[Math.floor(rnd() * TECHNO_RHYTHMS.length)];
      let i = 0;
      rhythm.forEach((slot, n) => {
        if (n > 0) i = Math.max(0, Math.min(TECHNO_POOL.length - 1, i + Math.floor(rnd() * 5) - 2));
        m[slot] = TECHNO_POOL[i];
      });
    }
    motif = m;
    return;
  }
  const m: (string | null)[] = new Array(32).fill(null);
  let i = Math.floor(rnd() * 3);
  let count = 0;
  for (let slot = 0; slot < 32; slot += 2) {
    if (rnd() < style.keysDensity * 0.9 || (slot === 0 && style.keysDensity > 0)) {
      i = Math.max(0, Math.min(MELODY.length - 1, i + Math.floor(rnd() * 5) - 2));
      m[slot] = MELODY[i];
      count++;
    }
  }
  // the phrase resolves: last note back to the root
  if (count > 2) m[28] = MELODY[rnd() < 0.5 ? 0 : 5];
  motif = m;
}

/** Small variation each time the phrase repeats, so it stays alive. */
function mutateMotif() {
  const filled = motif.map((n, i) => (n ? i : -1)).filter((i) => i >= 0);
  if (!filled.length) return;
  const slot = filled[Math.floor(Math.random() * filled.length)];
  const pool = motif.length === 16 ? TECHNO_POOL : MELODY;
  const i = pool.indexOf(motif[slot]!);
  motif[slot] = pool[Math.max(0, Math.min(pool.length - 1, i + (Math.random() < 0.5 ? -1 : 1)))];
}

function enterSection(idx: number, time: number, fresh = false) {
  if (!graph) return;
  const style = STYLES[getState().style] ?? STYLES.lofi;
  const sec = arrangement().sections[idx];
  sectionIdx = idx;
  barInSection = 0;
  const barSec = graph.Tone.Time('1m').toSeconds();

  ARR_LAYERS.forEach((l) => graph!.arr[l].gain.linearRampTo(sec.mix[l] ?? 1, Math.max(0.03, (sec.fade ?? 0) * barSec), time));

  // high-pass sweep + noise riser on builds, snap back on the drop
  graph.sweep.frequency.cancelScheduledValues(time);
  graph.riser?.gain.gain.cancelScheduledValues(time);
  if (sec.sweep) {
    const dur = sec.bars * barSec * 0.97;
    graph.sweep.frequency.setValueAtTime(20, time);
    graph.sweep.frequency.exponentialRampTo(sec.sweep, dur, time);
    if (graph.riser) {
      // short and subtle: only the last 2 bars of the build
      const rBars = Math.min(2, sec.bars);
      const rStart = time + (sec.bars - rBars) * barSec;
      const rDur = rBars * barSec * 0.97;
      graph.riser.filter.frequency.cancelScheduledValues(time);
      graph.riser.filter.frequency.setValueAtTime(600, rStart);
      graph.riser.filter.frequency.exponentialRampTo(5000, rDur, rStart);
      graph.riser.gain.gain.setValueAtTime(0, rStart);
      graph.riser.gain.gain.linearRampTo(0.35, rDur, rStart);
      try {
        graph.riser.noise.start(rStart).stop(rStart + rDur);
      } catch {
        /* still running from a skipped build */
      }
    }
  } else {
    graph.sweep.frequency.setValueAtTime(20, time);
    graph.riser?.gain.gain.setValueAtTime(0, time);
  }

  if (sec.newProg) progIdx = (progIdx + 1) % PROGRESSIONS.length;
  if (sec.newMotif || fresh) makeMotif(style);
  if (sec.newProg) chordIndex = -1;
  setState({ section: getState().arrange ? sec.name : '' });
}

/** Back to a flat mix (arrangement turned off). */
function flattenMix() {
  if (!graph) return;
  const now = graph.Tone.now();
  ARR_LAYERS.forEach((l) => graph!.arr[l].gain.linearRampTo(1, 0.5, now));
  graph.sweep.frequency.cancelScheduledValues(now);
  graph.sweep.frequency.setValueAtTime(20, now);
  graph.riser?.gain.gain.cancelScheduledValues(now);
  graph.riser?.gain.gain.setValueAtTime(0, now);
}

function tick(time: number) {
  if (!graph) return;
  const s = getState();
  const style = STYLES[s.style] ?? STYLES.lofi;
  const pos = step % 16;
  const rnd = Math.random;

  // section changes happen on the downbeat
  if (pos === 0) {
    const arr = arrangement();
    if (pending) {
      const { idx, fresh } = pending;
      pending = null;
      const next = idx === 'next' ? (sectionIdx + 1 < arr.sections.length ? sectionIdx + 1 : arr.loopFrom) : idx;
      enterSection(Math.min(next, arr.sections.length - 1), time, fresh);
    } else if (s.arrange && sectionIdx >= 0 && barInSection >= arr.sections[sectionIdx].bars) {
      enterSection(sectionIdx + 1 < arr.sections.length ? sectionIdx + 1 : arr.loopFrom, time);
    }
    // the phrase repeats with a small change now and then
    if (barInSection > 0 && barInSection % 2 === 0 && rnd() < 0.3) mutateMotif();
  }
  const sec = currentSection();
  const drums: DrumMode = sec?.drums ?? 'full';
  const prog = PROGRESSIONS[progIdx];

  if (pos === 0 && barInSection % style.chordBars === 0) {
    chordIndex = (chordIndex + 1) % prog.length;
    if (layerOn('pad')) {
      const dur = graph.Tone.Time('1m').toSeconds() * style.chordBars * 0.95;
      graph.pad.triggerAttackRelease(CHORDS[prog[chordIndex]].notes.map(t), dur, time, 0.6);
    }
  }
  const chord = CHORDS[prog[Math.max(0, chordIndex)]];

  const root = t(chord.bass);
  if (layerOn('bass')) {
    if (style.pattern === 'lofi') {
      if (pos === 0) graph.bass.triggerAttackRelease(root, '2n', time, 0.8);
      if (pos === 10) graph.bass.triggerAttackRelease(root, '8n', time, 0.6);
    } else if (style.pattern === 'deep') {
      if (pos % 4 === 2) graph.bass.triggerAttackRelease(root, '16n', time, 0.85);
    } else if (style.pattern === 'techno') {
      // rolling bass: every 16th except where the kick hits
      if (pos % 4 !== 0) graph.bass.triggerAttackRelease(root, '32n', time, pos % 4 === 2 ? 0.95 : 0.55);
    } else if (pos === 0 && barInSection % style.chordBars === 0) {
      graph.bass.triggerAttackRelease(root, '1m', time, 0.5);
    }
  }

  if (layerOn('drums') && style.pattern !== 'none' && drums !== 'none') {
    if (drums === 'kick') {
      if (pos % 4 === 0) graph.kick.triggerAttackRelease('C1', '8n', time, 0.85);
      if (pos % 4 === 2) graph.hat.triggerAttackRelease('16n', time, 0.4);
    } else if (drums === 'build') {
      // snare roll that speeds up, then one beat of silence before the drop
      const total = (sec?.bars ?? 1) * 16;
      const k = barInSection * 16 + pos;
      const p = k / total;
      if (k < total - 4) {
        if (pos % 4 === 0) graph.kick.triggerAttackRelease('C1', '8n', time, 0.9);
        const every = p < 0.5 ? 4 : p < 0.75 ? 2 : 1;
        if (k % every === 0 && (p >= 0.25 || pos === 4 || pos === 12)) graph.snare.triggerAttackRelease('16n', time, 0.25 + p * 0.65);
        if (pos % 2 === 0) graph.hat.triggerAttackRelease('32n', time, 0.3);
      }
    } else if (style.pattern === 'lofi') {
      if (pos === 0 || pos === 10 || (pos === 7 && rnd() < 0.35)) graph.kick.triggerAttackRelease('C1', '8n', time, pos === 0 ? 0.9 : 0.6);
      if (pos === 4 || pos === 12) graph.snare.triggerAttackRelease('16n', time, 0.75);
      if (pos % 2 === 0) graph.hat.triggerAttackRelease('32n', time, 0.35 + rnd() * 0.45);
    } else if (style.pattern === 'deep') {
      if (pos % 4 === 0) graph.kick.triggerAttackRelease('C1', '8n', time, 0.95);
      if (pos === 4 || pos === 12) graph.snare.triggerAttackRelease('16n', time, 0.6);
      if (pos % 4 === 2) graph.hat.triggerAttackRelease('16n', time, 0.8);
      else if (rnd() < (graph.quality === 'lite' ? 0.12 : 0.3)) graph.hat.triggerAttackRelease('32n', time, 0.25);
    } else if (style.pattern === 'techno') {
      if (pos % 4 === 0) graph.kick.triggerAttackRelease('C1', '8n', time, 1);
      if (pos === 4 || pos === 12) graph.snare.triggerAttackRelease('16n', time, 0.55);
      // 16th hats with an accented, longer "open" hat on the offbeat
      if (pos % 4 === 2) graph.hat.triggerAttackRelease('8n', time, 0.9);
      else graph.hat.triggerAttackRelease('32n', time, 0.25 + rnd() * 0.2);
    }
  }

  if (layerOn('keys') && motif.length) {
    const slot = motif.length === 16 ? pos : (barInSection % 2) * 16 + pos;
    const note = motif[slot];
    if (note) {
      const techno = style.pattern === 'techno';
      graph.keys.triggerAttackRelease(t(note), techno ? '16n' : '8n', time, techno ? 0.5 + rnd() * 0.3 : 0.4 + rnd() * 0.4);
    }
  }

  if (layerOn('vinyl') && rnd() < (graph.quality === 'lite' ? 0.1 : 0.18)) {
    graph.crackle.triggerAttackRelease('64n', time, 0.3 + rnd() * 0.5);
  }

  step++;
  if (pos === 15) barInSection++;
}

const toDb = (vol: number, base: number) => base + (vol / 100 - 1) * 30;

/** Push the current state into the audio graph (safe to call any time). */
function apply() {
  if (!graph || !state) return;
  const s = state;
  const style = STYLES[s.style] ?? STYLES.lofi;
  graph.transport.bpm.rampTo(s.bpm, 0.5);
  graph.transport.swing = style.swing;
  graph.transport.swingSubdivision = '8n';
  graph.master.volume.rampTo(s.master <= 0 ? -Infinity : (s.master / 100 - 1) * 30, 0.2);
  graph.master.mute = s.master <= 0;
  LAYERS.forEach((l) => {
    const { on, vol } = s.layers[l];
    graph!.layerVol[l].mute = !on || vol <= 0;
    graph!.layerVol[l].volume.rampTo(toDb(Math.max(vol, 1), BASE_DB[l]), 0.3);
  });
  graph.reverbSend.gain.rampTo((s.fx.reverb / 100) * 0.6, 0.3);
  graph.delay.wet.rampTo((s.fx.delay / 100) * 0.6, 0.3);
  graph.lofiFilter.frequency.rampTo(18000 - s.fx.lofi * 140, 0.3);
  // acid-style resonant bass for techno, round bass otherwise
  const acid = style.pattern === 'techno';
  graph.bass.filter.Q.value = acid ? 7 : 1;
  graph.bass.filterEnvelope.octaves = acid ? 3.5 : 2.5;
  graph.bass.filterEnvelope.baseFrequency = acid ? 90 : 120;
}

function updateMediaSession() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  const s = getState();
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `fine_coding radio · ${s.style}`,
      artist: `${s.bpm} bpm · ${s.key} minor`,
      album: 'Fine Coding',
      artwork: [{ src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }],
    });
    navigator.mediaSession.playbackState = s.status === 'playing' ? 'playing' : 'paused';
    navigator.mediaSession.setActionHandler('play', () => { void radio.play(); });
    navigator.mediaSession.setActionHandler('pause', () => radio.stop());
    navigator.mediaSession.setActionHandler('stop', () => radio.stop());
  } catch {
    /* not supported */
  }
}

// ---------------------------------------------------------------------------
// public API
// ---------------------------------------------------------------------------

export const radio = {
  getState,
  subscribe,

  async play() {
    const s = getState();
    if (s.status === 'playing' || s.status === 'loading') return;
    setState({ status: 'loading' });
    try {
      if (!graph) graph = await buildGraph();
      else {
        await graph.Tone.start();
        if (graph.audioEl) await graph.audioEl.play().catch(() => {});
      }
      apply();
      step = 0;
      chordIndex = -1;
      barInSection = 0;
      sectionIdx = -1;
      progIdx = 0;
      makeMotif(STYLES[getState().style] ?? STYLES.lofi, true);
      // arrangement off: stay in the main groove
      pending = { idx: getState().arrange ? 0 : grooveIndex() };
      graph.rain.start();
      graph.loopId = graph.transport.scheduleRepeat(tick, '16n');
      graph.transport.start('+0.05');
      setState({ status: 'playing' });
      updateMediaSession();
    } catch (e) {
      console.error('[radio] failed to start', e);
      setState({ status: 'stopped' });
      throw e;
    }
  },

  stop() {
    if (graph) {
      graph.transport.stop();
      if (graph.loopId !== null) graph.transport.clear(graph.loopId);
      graph.loopId = null;
      graph.rain.stop();
      graph.pad.releaseAll();
      flattenMix();
    }
    pending = null;
    setState({ status: 'stopped', section: '' });
    updateMediaSession();
  },

  /** Change quality; rebuilds the audio graph (and resumes) if needed. */
  async setQuality(q: Quality) {
    const s = getState();
    setState({ quality: q });
    if (graph && graph.quality !== effectiveQuality(q)) {
      const wasPlaying = s.status === 'playing';
      disposeGraph();
      setState({ status: 'stopped' });
      if (wasPlaying) await radio.play();
    }
  },

  /** Turn the song structure on/off (off = the endless groove). */
  setArrange(on: boolean) {
    setState({ arrange: on });
    if (getState().status !== 'playing') return;
    if (on) pending = { idx: 'next' };
    else {
      flattenMix();
      pending = { idx: grooveIndex() };
    }
  },

  /** Jump to the next section at the next bar. */
  next() {
    if (getState().status !== 'playing' || !getState().arrange) return false;
    pending = { idx: 'next' };
    return true;
  },

  /** Quality in effect right now ("auto" resolved). */
  quality(): 'high' | 'lite' {
    return graph?.quality ?? effectiveQuality(getState().quality);
  },

  setStyle(name: string) {
    if (!STYLES[name]) return false;
    const s = getState();
    setState(stateFromStyle(name, { status: s.status, key: s.key, master: s.master, output: s.output, quality: s.quality, arrange: s.arrange, section: s.section }));
    // new style: skip the intro, land in its groove at the next bar
    if (s.status === 'playing') pending = { idx: grooveIndex(), fresh: true };
    updateMediaSession();
    return true;
  },

  setBpm(bpm: number) {
    setState({ bpm: Math.round(Math.min(160, Math.max(40, bpm))) });
    updateMediaSession();
  },

  setKey(key: KeyName) {
    setState({ key });
    updateMediaSession();
  },

  setMaster(vol: number) {
    setState({ master: Math.round(Math.min(100, Math.max(0, vol))) });
  },

  setLayer(id: LayerId, patch: { on?: boolean; vol?: number }) {
    const cur = getState().layers[id];
    const vol = patch.vol === undefined ? cur.vol : Math.round(Math.min(100, Math.max(0, patch.vol)));
    const on = patch.on ?? (patch.vol !== undefined ? vol > 0 : cur.on);
    setState({ layers: { ...getState().layers, [id]: { on, vol } } });
  },

  setFx(id: FxId, value: number) {
    setState({ fx: { ...getState().fx, [id]: Math.round(Math.min(100, Math.max(0, value))) } });
  },

  reset() {
    const s = getState();
    setState(stateFromStyle(s.style, { status: s.status, output: s.output, quality: s.quality, arrange: s.arrange, section: s.section }));
  },

  /** 0..1 levels for a small visualizer (log-spaced bands), or null when not playing. */
  spectrum(bands = 24): number[] | null {
    if (!graph || getState().status !== 'playing') return null;
    const values = graph.analyser.getValue() as Float32Array;
    const lo = 1;
    const hi = Math.floor(values.length * 0.7);
    const out: number[] = [];
    for (let i = 0; i < bands; i++) {
      const a = Math.floor(lo * Math.pow(hi / lo, i / bands));
      const b = Math.max(a + 1, Math.floor(lo * Math.pow(hi / lo, (i + 1) / bands)));
      let sum = 0;
      for (let j = a; j < b; j++) sum += values[j] ?? -140;
      const db = sum / (b - a);
      // gentle tilt so higher bands (naturally quieter) still move
      out.push(Math.max(0, Math.min(1, (db + 95 + i * 0.9) / 60)));
    }
    return out;
  },
};
