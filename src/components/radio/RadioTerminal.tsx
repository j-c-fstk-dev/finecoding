'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_STATE, LAYERS, STYLES, radio } from '@/lib/radio/engine';
import { complete, run, type Line } from '@/lib/radio/commands';

const WELCOME: Line[] = [
  { kind: 'out', text: 'fine_coding radio v1 · generative music, synthesized live in your browser' },
  { kind: 'dim', text: 'type "help" for commands, or tap one below. try: play, style deep, bpm 90' },
];

const PROMPT = 'radio@fine_coding:~$';

function useRadioState() {
  return useSyncExternalStore(radio.subscribe, radio.getState, () => DEFAULT_STATE);
}

function Visualizer({ playing }: { playing: boolean }) {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (!playing) {
      barsRef.current.forEach((el) => { if (el) el.style.transform = 'scaleY(0.08)'; });
      return;
    }
    let raf = 0;
    const draw = () => {
      const levels = radio.spectrum(barsRef.current.length);
      if (levels) levels.forEach((v, i) => { const el = barsRef.current[i]; if (el) el.style.transform = `scaleY(${Math.max(0.06, v)})`; });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  return (
    <div className="radio-viz" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span key={i} ref={(el) => { barsRef.current[i] = el; }} />
      ))}
    </div>
  );
}

export function RadioTerminal() {
  const state = useRadioState();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const playing = state.status === 'playing';

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  const exec = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [...h.filter((x) => x !== cmd), cmd].slice(-50));
    setHIndex(null);
    setLines((l) => [...l, { kind: 'cmd', text: cmd }]);
    const result = await run(cmd);
    if (result === 'clear') setLines([]);
    else setLines((l) => [...l, ...result].slice(-200));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input;
      setInput('');
      void exec(v);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput((v) => complete(v));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const i = hIndex === null ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(i);
      setInput(history[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIndex === null) return;
      const i = hIndex + 1;
      if (i >= history.length) { setHIndex(null); setInput(''); }
      else { setHIndex(i); setInput(history[i]); }
    }
  };

  const chips: { label: string; cmd: string; active?: boolean }[] = [
    { label: playing ? '■ stop' : state.status === 'loading' ? '… loading' : '▶ play', cmd: playing ? 'stop' : 'play', active: playing },
    ...Object.keys(STYLES).map((name) => ({ label: name, cmd: `style ${name}`, active: state.style === name })),
    { label: 'layers', cmd: 'layers' },
    { label: 'help', cmd: 'help' },
  ];

  return (
    <div className="screen relative overflow-hidden rounded-xl border bg-card font-mono text-[13px]">
      {/* title bar */}
      <div className="flex items-center justify-between border-b px-4 py-2.5 text-xs text-muted-foreground/80">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-phosphor-dim" />
          <span className="h-2 w-2 rounded-full bg-input" />
          <span className="h-2 w-2 rounded-full bg-input" />
        </span>
        <span>radio.sh</span>
        <span className={cn('flex items-center gap-2', playing ? 'text-phosphor' : 'text-muted-foreground/70')}>
          <span className={cn('h-1.5 w-1.5 rounded-full', playing ? 'radio-live-dot' : 'bg-input')} aria-hidden="true" />
          {playing ? 'live' : 'idle'}
        </span>
      </div>

      {/* visualizer + status */}
      <div className="border-b px-4 pb-4 pt-5 sm:px-6">
        <Visualizer playing={playing} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
          <span className={playing ? 'text-phosphor' : 'text-muted-foreground'}>
            {playing ? '▶' : '■'} {state.style} · {state.bpm} bpm · {state.key} minor
          </span>
          <span className="text-muted-foreground/80">
            {LAYERS.map((l) => (
              <span key={l} className={cn('ml-2', state.layers[l].on ? 'text-foreground/80' : 'text-muted-foreground/40 line-through')}>{l}</span>
            ))}
          </span>
        </div>
      </div>

      {/* output */}
      <div
        ref={logRef}
        className="h-64 overflow-y-auto px-4 py-3 leading-relaxed sm:px-6"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        role="log"
        aria-live="polite"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={cn(
              'whitespace-pre-wrap break-words',
              l.kind === 'cmd' && 'text-foreground',
              l.kind === 'ok' && 'text-phosphor',
              l.kind === 'err' && 'text-red-400',
              l.kind === 'dim' && 'text-muted-foreground',
              l.kind === 'out' && 'text-foreground/85'
            )}
          >
            {l.kind === 'cmd' ? <><span className="text-phosphor-dim">{PROMPT}</span> {l.text}</> : l.text}
          </div>
        ))}
        <label className="flex items-center gap-2">
          <span className="shrink-0 text-phosphor-dim">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Radio command"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            className="w-full min-w-0 bg-transparent text-foreground caret-[hsl(var(--phosphor))] outline-none"
          />
        </label>
      </div>

      {/* quick commands */}
      <div className="flex flex-wrap gap-2 border-t px-4 py-3 sm:px-6">
        {chips.map((c) => (
          <button
            key={c.cmd}
            onClick={() => void exec(c.cmd)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs transition-colors',
              c.active ? 'border-phosphor-dim text-phosphor' : 'border-input text-muted-foreground hover:text-foreground'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
