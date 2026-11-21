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
type MotifName = 'ascii' | 'tree' | 'terminal' | 'orbit' | 'bars' | 'git' | 'pixels' | 'wave' | 'checklist' | 'document' | 'prompt' | 'flow' | 'diff' | 'radar' | 'modules' | 'pillars';

const motifs: Record<MotifName, Motif> = {
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

  checklist() {
    const rows = [0, 1, 2, 3];
    return (
      <>
        <rect x={170} y={70} width={300} height={220} rx={10} style={stroke(D)} />
        {rows.map((i) => {
          const y = 108 + i * 46, done = i < 3;
          return (
            <g key={i}>
              <rect x={200} y={y - 13} width={26} height={26} rx={5} style={{ fill: done ? 'hsl(var(--phosphor) / 0.12)' : 'none', stroke: done ? G : D, strokeWidth: 1.6 }} />
              {done && <polyline points={`${206},${y} ${211},${y + 6} ${221},${y - 6}`} style={stroke(G, 2.4, { strokeLinecap: 'round', strokeLinejoin: 'round' })} />}
              <line x1={246} y1={y} x2={246 + [170, 130, 190, 110][i]} y2={y} style={stroke(done ? D : G, done ? 6 : 6, { strokeLinecap: 'round', opacity: done ? 0.55 : 1 })} />
            </g>
          );
        })}
      </>
    );
  },
  document() {
    const widths = [210, 180, 200, 140, 196, 170, 120];
    return (
      <>
        <path d="M200 50 H400 L440 90 V310 H200 Z" style={stroke(D, 1.6, { strokeLinejoin: 'round' })} />
        <path d="M400 50 V90 H440" style={stroke(D, 1.6, { strokeLinejoin: 'round' })} />
        <text x={222} y={106} fontSize={22} style={{ ...mono, ...fill(G) }}>#</text>
        <line x1={246} y1={99} x2={360} y2={99} style={stroke(G, 7, { strokeLinecap: 'round' })} />
        {widths.map((w, i) => (
          <line key={i} x1={222} y1={140 + i * 23} x2={222 + w * (i === 3 ? 0.7 : 0.95)} y2={140 + i * 23} style={stroke(D, 5, { strokeLinecap: 'round', opacity: 0.8 })} />
        ))}
      </>
    );
  },
  prompt() {
    return (
      <>
        <rect x={300} y={62} width={220} height={74} rx={14} style={{ fill: 'hsl(var(--phosphor) / 0.08)', stroke: D, strokeWidth: 1.4 }} />
        <line x1={322} y1={90} x2={490} y2={90} style={stroke(D, 5, { strokeLinecap: 'round' })} />
        <line x1={322} y1={110} x2={440} y2={110} style={stroke(D, 5, { strokeLinecap: 'round' })} />
        <rect x={120} y={156} width={260} height={96} rx={14} style={stroke(G, 1.6)} />
        <line x1={142} y1={184} x2={350} y2={184} style={stroke(G, 5, { strokeLinecap: 'round' })} />
        <line x1={142} y1={204} x2={320} y2={204} style={stroke(G, 5, { strokeLinecap: 'round', opacity: 0.7 })} />
        <line x1={142} y1={224} x2={250} y2={224} style={stroke(G, 5, { strokeLinecap: 'round', opacity: 0.5 })} />
        <text x={120} y={300} fontSize={18} style={{ ...mono, ...fill(G) }}>&gt; _</text>
      </>
    );
  },
  flow() {
    const node = (x: number, y: number, label: string, bright = false) => (
      <g key={label}>
        <rect x={x} y={y} width={104} height={56} rx={12} style={{ fill: bright ? 'hsl(var(--phosphor) / 0.1)' : 'hsl(var(--card))', stroke: bright ? G : D, strokeWidth: 1.6 }} />
        <text x={x + 52} y={y + 33} fontSize={13} textAnchor="middle" style={{ ...mono, ...fill(bright ? G : D) }}>{label}</text>
      </g>
    );
    return (
      <>
        <path d="M184 180 C 214 180, 214 180, 244 180" style={stroke(D, 1.6)} />
        <path d="M348 180 C 380 180, 380 120, 412 120" style={stroke(D, 1.6)} />
        <path d="M348 180 C 380 180, 380 240, 412 240" style={stroke(G, 1.6)} />
        {[[184, 180], [244, 180], [348, 180], [412, 120], [412, 240]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={3.5} style={fill(G)} />)}
        {node(80, 152, 'trigger', true)}
        {node(244, 152, 'filter')}
        {node(412, 92, 'notify')}
        {node(412, 212, 'publish', true)}
      </>
    );
  },
  diff() {
    const lines: [string, number][] = [[' ', 200], ['-', 170], ['-', 120], ['+', 190], ['+', 150], ['+', 210], [' ', 130]];
    return (
      <>
        <rect x={150} y={58} width={340} height={244} rx={10} style={stroke(D)} />
        <line x1={192} y1={58} x2={192} y2={302} style={stroke(F)} />
        {lines.map(([sign, w], i) => {
          const y = 92 + i * 30;
          const color = sign === '+' ? G : sign === '-' ? D : F;
          return (
            <g key={i}>
              {sign !== ' ' && <rect x={151} y={y - 13} width={338} height={26} style={{ fill: sign === '+' ? 'hsl(var(--phosphor) / 0.08)' : 'transparent' }} />}
              <text x={166} y={y + 5} fontSize={15} style={{ ...mono, ...fill(sign === ' ' ? D : color) }}>{sign}</text>
              <line x1={210} y1={y} x2={210 + w} y2={y} style={stroke(sign === ' ' ? D : color, 5, { strokeLinecap: 'round', opacity: sign === '-' ? 0.6 : 1 })} />
            </g>
          );
        })}
      </>
    );
  },
  radar(rnd) {
    const blips = Array.from({ length: 6 }, () => {
      const a = rnd() * Math.PI * 2, r = 30 + rnd() * 90;
      return [320 + Math.cos(a) * r, 180 + Math.sin(a) * r, rnd() < 0.5];
    }) as [number, number, boolean][];
    return (
      <>
        {[40, 80, 120].map((r) => <circle key={r} cx={320} cy={180} r={r} style={stroke(r === 120 ? D : F)} />)}
        <line x1={200} y1={180} x2={440} y2={180} style={stroke(F)} />
        <line x1={320} y1={60} x2={320} y2={300} style={stroke(F)} />
        <path d="M320 180 L 404.9 95.1 A 120 120 0 0 1 440 180 Z" style={{ fill: 'hsl(var(--phosphor) / 0.12)' }} />
        <line x1={320} y1={180} x2={404.9} y2={95.1} style={stroke(G, 1.8)} />
        {blips.map(([x, y, hot], i) => <circle key={i} cx={x} cy={y} r={hot ? 4.5 : 3} style={fill(hot ? G : D)} />)}
      </>
    );
  },
  modules() {
    const glyphs = ['</>', '$_', '{ }', '#', '⚙', '▲'];
    return (
      <>
        {glyphs.map((g, i) => {
          const x = 176 + (i % 3) * 100, y = 82 + Math.floor(i / 3) * 104;
          const bright = i === 1 || i === 5;
          return (
            <g key={g}>
              <rect x={x} y={y} width={84} height={84} rx={14} style={{ fill: bright ? 'hsl(var(--phosphor) / 0.1)' : 'hsl(var(--card))', stroke: bright ? G : D, strokeWidth: 1.5 }} />
              <text x={x + 42} y={y + 50} fontSize={22} textAnchor="middle" style={{ ...mono, ...fill(bright ? G : D) }}>{g}</text>
            </g>
          );
        })}
      </>
    );
  },
  pillars() {
    return (
      <>
        <line x1={150} y1={300} x2={490} y2={300} style={stroke(D, 2)} />
        <path d="M170 92 L 320 52 L 470 92 Z" style={stroke(G, 1.6, { strokeLinejoin: 'round' })} />
        {[0, 1, 2].map((i) => {
          const x = 196 + i * 100;
          return (
            <g key={i}>
              <rect x={x} y={104} width={48} height={190} rx={4} style={{ fill: i === 1 ? 'hsl(var(--phosphor) / 0.1)' : 'none', stroke: i === 1 ? G : D, strokeWidth: 1.5 }} />
              <text x={x + 24} y={136} fontSize={14} textAnchor="middle" style={{ ...mono, ...fill(i === 1 ? G : D) }}>{`0${i + 1}`}</text>
              {[0, 1, 2].map((k) => <line key={k} x1={x + 14 + k * 10} y1={156} x2={x + 14 + k * 10} y2={280} style={stroke(i === 1 ? G : D, 1, { opacity: 0.45 })} />)}
            </g>
          );
        })}
      </>
    );
  },
};

/**
 * Hand-picked covers for existing posts, so no two posts share a picture.
 * New posts fall back to a motif picked from their slug.
 */
const COVER_BY_SLUG: Record<string, MotifName> = {
  'unraveling-fine-coding': 'orbit',
  'building-the-fine-coding-blog-with-next-js-netlify-and-firebase-fast-secure-and-free': 'terminal',
  'principles-of-fine-coding-clarity-efficiency-and-amplified-collaboration': 'pillars',
  'fine-coding-guidelines-security-quality-and-continuous-learning': 'checklist',
  'fine-coder-s-essential-tools-powering-workflow-with-ai-and-cloud': 'modules',
  'the-git-ecosystem-version-control-collaboration-and-the-fine-coder-s-foundation': 'git',
  'the-fine-coder-s-mindset-beyond-syntax-the-strategy-of-the-modern-developer': 'tree',
  'advanced-prompt-engineering-mastering-communication-with-ai-for-the-fine-coder': 'prompt',
  'automating-repetitive-tasks-leveraging-ai-for-enhanced-developer-productivity': 'flow',
  'code-review-in-the-age-of-ai-how-to-use-ai-to-improve-code-quality': 'diff',
  'writing-better-documentation-with-ai-assistance-clarity-consistency-and-speed': 'document',
  'the-fine-coder-s-guide-to-staying-updated-with-the-latest-ai-and-development': 'radar',
};

const order = Object.keys(motifs) as MotifName[];

export function PostCover({ seed, className, motif }: { seed: string; className?: string; motif?: MotifName }) {
  const h = hash(seed);
  const name = motif ?? COVER_BY_SLUG[seed] ?? order[h % order.length];
  return (
    <div className={cn('cover-frame aspect-video', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        {motifs[name](prng(h), seed)}
      </svg>
    </div>
  );
}
