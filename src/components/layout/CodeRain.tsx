"use client";

import React, { useEffect, useRef } from 'react';

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      if (ctx) {
         ctx.fillStyle = 'rgba(26, 26, 26, 1)';
         ctx.fillRect(0, 0, w, h);
      }
      p = Array(Math.ceil(w / 15)).fill(0);
    };

    window.addEventListener('resize', handleResize);

    const str = "101010101010101010";
    const matrix = str.split("");
    let font = 15;
    let p = Array(Math.ceil(w / font)).fill(0);

    const draw = () => {
      ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#2C6E49';
      ctx.font = `${font}px monospace`;
      p.forEach((v, i) => {
        ctx.fillText(matrix[Math.floor(Math.random() * matrix.length)], i * font, v);
        p[i] = v >= h || v > 10000 * Math.random() ? 0 : v + font;
      });
    };

    let interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-20"></canvas>;
}
