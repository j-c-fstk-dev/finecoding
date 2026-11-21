# Generative radio demo

`fine-coding-radio-demo.mp3` is a 52 s "lo-fi focus" sample (76 BPM, A minor)
rendered entirely in the browser with [Tone.js](https://tonejs.github.io/)
by `demo.html`: no audio files, no samples, nothing licensed.

Layers, entering over time: chord pad → rain + vinyl crackle → bass and a
light swung beat (bar 5) → FM keys arpeggio with delay (bar 9) → fade out.

To re-render: open `demo.html` in Chrome, wait for `window.__done`, and read
the WAV from `window.__wav` (base64). It is only a sound test; the real
radio would play the same engine live instead of a file.
