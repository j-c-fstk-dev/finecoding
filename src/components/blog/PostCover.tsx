import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Generated "phosphor terminal" cover art. Deterministic per slug, so the
 * server and the browser always draw the same picture, and every post gets a
 * cover that matches the site without needing an image.
 */

const G = 'hsl(var(--phosphor))';
const D = 'hsl(var(--phosphor-dim))';
const F = 'hsl(var(--border))';
const W = 640;
const H = 360;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function prng(seed: number) {
  let s = seed % 2147483647 || 7;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const stroke = (color: string, width = 1, extra: CSSProperties = {}): CSSProperties => ({ stroke: color, strokeWidth: width, fill: 'none', ...extra });
const fill = (color: string): CSSProperties => ({ fill: color });
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

type Motif = (rnd: () => number, seedText: string) => ReactNode;

const motifs: Record<string, Motif> = {
  ascii(rnd) {
    return (
      <>
        {Array.from({ length: 8 }, (_, r) => {
          let line = '';
          for (let c = 0; c < 30; c++) line += rnd() < 0.12 ? '+' : rnd() < 0.1 ? '-' : '·';
          return <text key={r} x={140} y={110 + r * 22} fontSize={15} letterSpacing={3} style={{ ...mono, ...fill(r % 3 ? D : G) }}>{line}</text>;
        })}
        <line x1={330} y1={92} x2={330} y2={280} style={stroke(G, 1.5)} />
      </>
    );
  },
  tree(rnd) {
    const parts: ReactNode[] = [];
    const branch = (x: number, y: number, a: number, len: number, d: number) => {
      if (d === 0) return;
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      parts.push(<line key={`l${parts.length}`} x1={x} y1={y} x2={x2} y2={y2} style={stroke(D)} />);
      parts.push(<circle key={`c${parts.length}`} cx={x2} cy={y2} r={2.4} style={fill(d < 3 ? G : D)} />);
      branch(x2, y2, a - 0.5 - rnd() * 0.3, len * 0.72, d - 1);
      branch(x2, y2, a + 0.5 + rnd() * 0.3, len * 0.72, d - 1);
    };
    branch(320, 320, -Math.PI / 2, 70, 6);
    return <>{parts}</>;
  },
  terminal() {
    const lines = ['$ git diff --stat', ' src/lib/posts.ts   | 42 +++---', ' firestore.rules    | 18 ++--', '$ npm run build', '✓ Compiled successfully', '$ _'];
    return (
      <>
        <rect x={110} y={60} width={420} height={240} rx={8} style={stroke(D)} />
        <line x1={110} y1={88} x2={530} y2={88} style={stroke(D)} />
        {[0, 1, 2].map((i) => <circle key={i} cx={128 + i * 14} cy={74} r={3.5} style={fill(i ? F : D)} />)}
        {lines.map((l, i) => <text key={i} x={130} y={120 + i * 28} fontSize={14} style={{ ...mono, ...fill(l.startsWith('$') ? G : D) }}>{l}</text>)}
      </>
    );
  },
  orbit() {
    return (
      <>
        <rect x={100} y={60} width={440} height={240} style={stroke(F)} />
        <ellipse cx={320} cy={180} rx={200} ry={55} style={stroke(D)} />
        <ellipse cx={320} cy={180} rx={45} ry={115} style={stroke(G)} />
        <ellipse cx={320} cy={180} rx={170} ry={60} transform="rotate(-32 320 180)" style={stroke(D, 1, { strokeDasharray: '4 5' })} />
      </>
    );
  },
  bars(rnd) {
    return (
      <>
        {Array.from({ length: 70 }, (_, i) => {
          const x = 120 + i * 5.7, dense = Math.abs(i - 42) < 9;
          return rnd() < (dense ? 0.9 : 0.45) ? <line key={i} x1={x} y1={90} x2={x} y2={270} style={stroke(dense ? G : D, dense ? 1.6 : 1)} /> : null;
        })}
      </>
    );
  },
  git(rnd) {
    const ys = [80, 130, 180, 230, 280];
    const shas = ys.map(() => Math.floor(rnd() * 0xfffffff).toString(16).padStart(7, '0'));
    const msgs = ['init', 'add feature', 'fix rules', 'refactor', 'ship it'];
    return (
      <>
        <line x1={250} y1={60} x2={250} y2={300} style={stroke(D)} />
        <path d="M250 130 C 250 150, 330 150, 330 175 L 330 235 C 330 255, 250 255, 250 280" style={stroke(G)} />
        {ys.map((y, i) => (
          <g key={i}>
            <circle cx={250} cy={y} r={6} style={{ fill: 'hsl(var(--card))', stroke: D, strokeWidth: 2 }} />
            <text x={370} y={y + 5} fontSize={13} style={{ ...mono, ...fill(D) }}>{`${shas[i]}  ${msgs[i]}`}</text>
          </g>
        ))}
        <circle cx={330} cy={205} r={6} style={fill(G)} />
      </>
    );
  },
  pixels(rnd) {
    const cells: ReactNode[] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) {
      const v = rnd();
      if (v < 0.7) cells.push(<rect key={`${r}-${c}`} x={170 + c * 34} y={105 + r * 38} width={26} height={26} style={{ fill: v < 0.3 ? G : v < 0.5 ? D : 'none', stroke: D }} />);
    }
    return <>{cells}</>;
  },
  wave() {
    return (
      <>
        {Array.from({ length: 5 }, (_, k) => {
          let d = 'M 100 180';
          for (let x = 100; x <= 540; x += 6) d += ` L ${x} ${(180 + Math.sin((x + k * 40) / 38) * (70 - k * 12) * Math.sin((x - 100) / 140)).toFixed(1)}`;
          return <path key={k} d={d} style={stroke(k ? D : G, k ? 1 : 1.6, { opacity: 1 - k * 0.15 })} />;
        })}
      </>
    );
  },
};

const order = Object.keys(motifs);

export function PostCover({ seed, className, motif }: { seed: string; className?: string; motif?: keyof typeof motifs }) {
  const h = hash(seed);
  const name = motif ?? order[h % order.length];
  return (
    <div className={cn('cover-frame aspect-video', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        {motifs[name](prng(h), seed)}
      </svg>
    </div>
  );
}
