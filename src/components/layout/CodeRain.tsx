"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // This effect runs only on the client, after the component has mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // We wait until the component is mounted and the theme is confirmed to be dark.
    if (!mounted || resolvedTheme !== 'dark') {
        const canvas = canvasRef.current;
        // If the theme changes away from dark, clear the canvas.
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
    }

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
      ctx.fillStyle = '#00674F'; // Use the correct dark theme green
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
  }, [resolvedTheme, mounted]); // Rerun effect when theme or mounted status changes

  // On the initial server render and the first client render, `mounted` is false, so we render nothing.
  // This ensures the server and client HTML match.
  if (!mounted || resolvedTheme !== 'dark') {
    return null;
  }

  // Once mounted on the client, if the theme is dark, we render the canvas.
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-20"></canvas>;
}
