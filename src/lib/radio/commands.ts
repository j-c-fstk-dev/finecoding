import { FX, KEYS, LAYERS, STYLES, radio, type FxId, type KeyName, type LayerId } from './engine';

export type Line = { kind: 'out' | 'err' | 'ok' | 'cmd' | 'dim'; text: string };

const bar = (v: number, width = 10) => {
  const filled = Math.round((v / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
};

export const HELP: Line[] = [
  { kind: 'out', text: 'playback' },
  { kind: 'dim', text: '  play | stop             start or stop the radio' },
  { kind: 'dim', text: '  status                  what is playing right now' },
  { kind: 'out', text: 'styles' },
  { kind: 'dim', text: '  styles                  list the presets' },
  { kind: 'dim', text: '  style <name>            ambient | lofi | deep | techno | rain' },
  { kind: 'out', text: 'tweak' },
  { kind: 'dim', text: '  bpm <40-160>            tempo' },
  { kind: 'dim', text: '  key <C..B>              musical key (minor)' },
  { kind: 'dim', text: '  layers                  show instruments and volumes' },
  { kind: 'dim', text: '  on|off <layer>          pad bass keys drums rain vinyl' },
  { kind: 'dim', text: '  vol <layer> <0-100>     volume of one layer' },
  { kind: 'dim', text: '  fx <reverb|delay|lofi> <0-100>' },
  { kind: 'dim', text: '  volume <0-100>          master volume' },
  { kind: 'dim', text: '  quality <auto|high|lite>  lite = lighter sound engine for slow devices' },
  { kind: 'out', text: 'misc' },
  { kind: 'dim', text: '  reset                   back to the style defaults' },
  { kind: 'dim', text: '  clear                   clear the screen' },
];

export const COMMANDS = ['help', 'play', 'stop', 'status', 'styles', 'style', 'bpm', 'key', 'layers', 'on', 'off', 'vol', 'fx', 'volume', 'quality', 'reset', 'clear'];

function statusLines(): Line[] {
  const s = radio.getState();
  return [
    { kind: 'out', text: `${s.status === 'playing' ? '▶ playing' : '■ stopped'} · ${s.style} · ${s.bpm} bpm · ${s.key} minor · volume ${s.master}` },
    { kind: 'dim', text: `fx  reverb ${s.fx.reverb} · delay ${s.fx.delay} · lofi ${s.fx.lofi}` },
    { kind: 'dim', text: `quality ${s.quality}${s.quality === 'auto' ? ` (${radio.quality()})` : ''}` },
  ];
}

function layerLines(): Line[] {
  const s = radio.getState();
  return LAYERS.map((l) => {
    const { on, vol } = s.layers[l];
    return { kind: on ? 'out' : 'dim', text: `  ${l.padEnd(6)} ${on ? 'on ' : 'off'}  ${bar(on ? vol : 0)} ${String(vol).padStart(3)}` } as Line;
  });
}

const num = (v: string | undefined) => (v !== undefined && /^\d+$/.test(v) ? Number(v) : NaN);
const isLayer = (v: string | undefined): v is LayerId => !!v && (LAYERS as readonly string[]).includes(v);
const isFx = (v: string | undefined): v is FxId => !!v && (FX as readonly string[]).includes(v);

/**
 * Runs one command line. Returns the lines to print, or 'clear'.
 * `play` is async because the browser needs a user gesture to start audio.
 */
export async function run(input: string): Promise<Line[] | 'clear'> {
  const [cmd, a, b] = input.trim().toLowerCase().split(/\s+/);
  if (!cmd) return [];

  switch (cmd) {
    case 'help':
    case '?':
      return HELP;

    case 'play':
    case 'start':
      try {
        await radio.play();
        return [{ kind: 'ok', text: `▶ playing ${radio.getState().style} at ${radio.getState().bpm} bpm` }];
      } catch {
        return [{ kind: 'err', text: 'could not start audio in this browser' }];
      }

    case 'stop':
    case 'pause':
      radio.stop();
      return [{ kind: 'ok', text: '■ stopped' }];

    case 'status':
      return statusLines();

    case 'styles':
      return Object.entries(STYLES).map(([name, s]) => ({
        kind: name === radio.getState().style ? 'ok' : 'dim',
        text: `  ${name.padEnd(8)} ${String(s.bpm).padStart(3)} bpm  ${s.description}`,
      }));

    case 'style':
      if (!a || !radio.setStyle(a)) return [{ kind: 'err', text: `unknown style "${a ?? ''}". try: ${Object.keys(STYLES).join(', ')}` }];
      return [{ kind: 'ok', text: `style → ${a}` }, ...statusLines().slice(0, 1)];

    case 'bpm': {
      const v = num(a);
      if (Number.isNaN(v)) return [{ kind: 'out', text: `bpm ${radio.getState().bpm}` }];
      radio.setBpm(v);
      return [{ kind: 'ok', text: `bpm → ${radio.getState().bpm}` }];
    }

    case 'key': {
      const k = a?.toUpperCase() as KeyName | undefined;
      if (!k || !(KEYS as readonly string[]).includes(k)) return [{ kind: 'err', text: `usage: key <${KEYS.join('|')}>` }];
      radio.setKey(k);
      return [{ kind: 'ok', text: `key → ${k} minor` }];
    }

    case 'layers':
      return layerLines();

    case 'on':
    case 'off':
      if (a === 'all') {
        LAYERS.forEach((l) => radio.setLayer(l, { on: cmd === 'on' }));
        return layerLines();
      }
      if (!isLayer(a)) return [{ kind: 'err', text: `usage: ${cmd} <${LAYERS.join('|')}|all>` }];
      radio.setLayer(a, { on: cmd === 'on' });
      return [{ kind: 'ok', text: `${a} ${cmd}` }];

    case 'vol': {
      const v = num(b);
      if (!isLayer(a) || Number.isNaN(v)) return [{ kind: 'err', text: `usage: vol <${LAYERS.join('|')}> <0-100>` }];
      radio.setLayer(a, { vol: v });
      return [{ kind: 'ok', text: `${a} ${bar(radio.getState().layers[a].vol)} ${radio.getState().layers[a].vol}` }];
    }

    case 'fx': {
      const v = num(b);
      if (!isFx(a) || Number.isNaN(v)) return [{ kind: 'err', text: `usage: fx <${FX.join('|')}> <0-100>` }];
      radio.setFx(a, v);
      return [{ kind: 'ok', text: `fx ${a} → ${radio.getState().fx[a]}` }];
    }

    case 'volume': {
      const v = num(a);
      if (Number.isNaN(v)) return [{ kind: 'out', text: `volume ${radio.getState().master}` }];
      radio.setMaster(v);
      return [{ kind: 'ok', text: `volume → ${radio.getState().master}` }];
    }

    case 'quality': {
      if (!a) return [{ kind: 'out', text: `quality ${radio.getState().quality} → ${radio.quality()}` }];
      if (a !== 'auto' && a !== 'high' && a !== 'lite') return [{ kind: 'err', text: 'usage: quality <auto|high|lite>' }];
      await radio.setQuality(a);
      return [{ kind: 'ok', text: `quality → ${a}${a === 'auto' ? ` (${radio.quality()})` : ''}` }];
    }

    case 'reset':
      radio.reset();
      return [{ kind: 'ok', text: `reset to ${radio.getState().style} defaults` }, ...statusLines()];

    case 'clear':
      return 'clear';

    default:
      return [{ kind: 'err', text: `command not found: ${cmd}. type "help"` }];
  }
}

/** Tab completion: completes the command, then a style/layer/fx name. */
export function complete(input: string): string {
  const parts = input.toLowerCase().split(/\s+/);
  // Completes to the full option when unique, else to the longest common prefix.
  const pick = (options: string[], word: string): { text: string; full: boolean } | null => {
    const hits = options.filter((o) => o.startsWith(word));
    if (hits.length === 0) return null;
    if (hits.length === 1) return { text: hits[0], full: true };
    let prefix = hits[0];
    for (const h of hits) while (!h.startsWith(prefix)) prefix = prefix.slice(0, -1);
    return prefix.length > word.length ? { text: prefix, full: false } : null;
  };
  if (parts.length === 1) {
    const hit = pick(COMMANDS, parts[0]);
    return hit ? `${hit.text}${hit.full ? ' ' : ''}` : input;
  }
  const [cmd, arg] = parts;
  const options =
    cmd === 'style' ? Object.keys(STYLES)
      : ['on', 'off', 'vol'].includes(cmd) ? [...LAYERS]
        : cmd === 'fx' ? [...FX]
          : cmd === 'quality' ? ['auto', 'high', 'lite']
          : cmd === 'key' ? KEYS.map((k) => k.toLowerCase())
            : [];
  if (parts.length === 2) {
    const hit = pick(options, arg);
    return hit ? `${cmd} ${hit.text}${hit.full ? ' ' : ''}` : input;
  }
  return input;
}
