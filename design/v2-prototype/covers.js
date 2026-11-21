// Monochrome "phosphor" cover art, generated per post (no AI images needed).
(function () {
  const G = '#3dff9a', D = '#1f8f57', F = '#12382a';
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const W = 640, H = 360;
  const svg = (inner) => `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="JetBrains Mono, monospace">${inner}</svg>`;

  const art = {
    ascii() { // rows of + - . like a diff / matrix
      let s = '';
      for (let r = 0; r < 8; r++) {
        let line = '';
        for (let c = 0; c < 30; c++) line += rnd() < .12 ? '+' : rnd() < .1 ? '-' : '·';
        s += `<text x="140" y="${110 + r * 22}" font-size="15" fill="${r % 3 ? D : G}" letter-spacing="3">${line}</text>`;
      }
      return svg(s + `<line x1="330" y1="92" x2="330" y2="280" stroke="${G}" stroke-width="1.5"/>`);
    },
    tree() { // branching nodes
      let s = '';
      const branch = (x, y, a, len, d) => {
        if (d === 0) return;
        const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
        s += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${D}" stroke-width="1"/><circle cx="${x2}" cy="${y2}" r="2.4" fill="${d < 3 ? G : D}"/>`;
        branch(x2, y2, a - .5 - rnd() * .3, len * .72, d - 1);
        branch(x2, y2, a + .5 + rnd() * .3, len * .72, d - 1);
      };
      branch(320, 320, -Math.PI / 2, 70, 6);
      return svg(s);
    },
    terminal() {
      const lines = ['$ git diff --stat', ' src/lib/posts.ts   | 42 +++---', ' firestore.rules    | 18 ++--', '$ npm run build', '✓ Compiled successfully', '$ _'];
      let s = `<rect x="110" y="60" width="420" height="240" rx="8" fill="none" stroke="${D}"/><line x1="110" y1="88" x2="530" y2="88" stroke="${D}"/>`;
      [0, 1, 2].forEach(i => s += `<circle cx="${128 + i * 14}" cy="74" r="3.5" fill="${i ? F : D}"/>`);
      lines.forEach((l, i) => s += `<text x="130" y="${120 + i * 28}" font-size="14" fill="${l.startsWith('$') ? G : D}">${l}</text>`);
      return svg(s);
    },
    orbit() {
      let s = `<rect x="100" y="60" width="440" height="240" fill="none" stroke="${F}"/>`;
      s += `<ellipse cx="320" cy="180" rx="200" ry="55" fill="none" stroke="${D}"/>`;
      s += `<ellipse cx="320" cy="180" rx="45" ry="115" fill="none" stroke="${G}"/>`;
      s += `<ellipse cx="320" cy="180" rx="170" ry="60" fill="none" stroke="${D}" stroke-dasharray="4 5" transform="rotate(-32 320 180)"/>`;
      return svg(s);
    },
    bars() {
      let s = '';
      for (let i = 0; i < 70; i++) { const x = 120 + i * 5.7, dense = Math.abs(i - 42) < 9; if (rnd() < (dense ? .9 : .45)) s += `<line x1="${x}" y1="90" x2="${x}" y2="270" stroke="${dense ? G : D}" stroke-width="${dense ? 1.6 : 1}"/>`; }
      return svg(s);
    },
    git() { // commit graph
      let s = '';
      const ys = [80, 130, 180, 230, 280];
      s += `<line x1="250" y1="60" x2="250" y2="300" stroke="${D}"/><path d="M250 130 C 250 150, 330 150, 330 175 L 330 235 C 330 255, 250 255, 250 280" fill="none" stroke="${G}"/>`;
      ys.forEach((y, i) => { s += `<circle cx="250" cy="${y}" r="6" fill="#07090a" stroke="${D}" stroke-width="2"/><text x="370" y="${y + 5}" font-size="13" fill="${D}">${['a1f3c9e','7d2e01b','c58f4aa','09be771','e4d2f10'][i]}  ${['init','share links','fix rules','admin sdk','next 16'][i]}</text>`; });
      s += `<circle cx="330" cy="205" r="6" fill="${G}"/>`;
      return svg(s);
    },
    pixels() {
      let s = '';
      for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) { const x = 170 + c * 34, y = 105 + r * 38; const v = rnd(); if (v < .7) s += `<rect x="${x}" y="${y}" width="26" height="26" fill="${v < .3 ? G : v < .5 ? D : 'none'}" stroke="${D}"/>`; }
      return svg(s);
    },
    wave() {
      let s = '';
      for (let k = 0; k < 5; k++) { let d = 'M 100 ' + (180); for (let x = 100; x <= 540; x += 6) d += ` L ${x} ${180 + Math.sin((x + k * 40) / 38) * (70 - k * 12) * Math.sin((x - 100) / 140)}`; s += `<path d="${d}" fill="none" stroke="${k ? D : G}" stroke-width="${k ? 1 : 1.6}" opacity="${1 - k * .15}"/>`; }
      return svg(s);
    },
  };
  document.querySelectorAll('[data-art]').forEach(el => { seed = el.dataset.art.length * 97 + 7; el.innerHTML = art[el.dataset.art](); });
})();
