"use client";

import { useEffect, useRef } from "react";
import type { Coordinates } from "@/types";
import { graticule, landPoints, project } from "@/lib/globe";
import { useTheme } from "./ThemeProvider";

const RAD = Math.PI / 180;
const AUTO_SPIN = 0.1;
const DRAG_SPEED = 0.008;
const KEY_STEP = 0.25;
const PITCH_LIMIT = 1.05;
const FRICTION = 0.94;
const PING_PERIOD = 2200;

const parseChannels = (value: string, fallback: [number, number, number]) => {
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return fallback;
  return [parts[0], parts[1], parts[2]] as [number, number, number];
};

export const Globe = ({
  coordinates,
  label,
}: {
  coordinates: Coordinates;
  label: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yawRef = useRef(coordinates.lon * RAD);
  const pitchRef = useRef(0.35);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const accent = parseChannels(root.getPropertyValue("--accent-rgb"), [0, 255, 156]);
    const [ar, ag, ab] = accent;
    const accentRgba = (alpha: number) => `rgba(${ar}, ${ag}, ${ab}, ${alpha})`;
    const hot = `rgb(${Math.round(ar + (255 - ar) * 0.65)}, ${Math.round(ag + (255 - ag) * 0.65)}, ${Math.round(ab + (255 - ab) * 0.65)})`;
    const backdrop = root.getPropertyValue("--card-bg").trim() || root.getPropertyValue("--background").trim();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) pitchRef.current = coordinates.lat * RAD * 0.6;

    const land = landPoints();
    const lines = graticule();

    let size = 0;
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.offsetWidth;
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGraticule = (radius: number, centre: number) => {
      ctx.strokeStyle = accentRgba(0.14);
      ctx.lineWidth = 0.6;
      for (const line of lines) {
        ctx.beginPath();
        let drawing = false;
        for (const point of line) {
          const p = project(point, yawRef.current, pitchRef.current);
          if (p.z <= 0) {
            drawing = false;
            continue;
          }
          const x = centre + p.x * radius;
          const y = centre - p.y * radius;
          if (drawing) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          drawing = true;
        }
        ctx.stroke();
      }
    };

    const drawLand = (radius: number, centre: number) => {
      const dot = Math.max(0.9, radius * 0.016);
      for (const point of land) {
        const p = project(point, yawRef.current, pitchRef.current);
        if (p.z <= 0.02) continue;
        ctx.fillStyle = accentRgba(0.2 + p.z * 0.6);
        ctx.beginPath();
        ctx.arc(centre + p.x * radius, centre - p.y * radius, dot, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPin = (radius: number, centre: number, time: number) => {
      const p = project(coordinates, yawRef.current, pitchRef.current);
      if (p.z <= 0) return;

      const x = centre + p.x * radius;
      const y = centre - p.y * radius;
      const depth = Math.min(1, p.z * 2.2);
      const core = Math.max(2.5, radius * 0.03);

      ctx.globalAlpha = depth;

      ctx.fillStyle = backdrop;
      ctx.beginPath();
      ctx.arc(x, y, core * 2.4, 0, Math.PI * 2);
      ctx.fill();

      if (!reduceMotion) {
        const phase = (time % PING_PERIOD) / PING_PERIOD;
        ctx.strokeStyle = accentRgba(1 - phase);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(x, y, core + phase * radius * 0.18, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = accentRgba(0.9);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, core * 1.7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = hot;
      ctx.beginPath();
      ctx.arc(x, y, core, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
    };

    const render = (time: number) => {
      const delta = Math.min(64, time - last);
      last = time;

      if (!draggingRef.current) {
        yawRef.current += velocityRef.current;
        velocityRef.current *= FRICTION;
        if (Math.abs(velocityRef.current) < 0.0002) velocityRef.current = 0;
        if (!reduceMotion && velocityRef.current === 0) {
          yawRef.current += AUTO_SPIN * RAD * (delta / 16.67);
        }
      }

      ctx.clearRect(0, 0, size, size);
      const centre = size / 2;
      const radius = centre - 2;

      const glow = ctx.createRadialGradient(centre, centre, radius * 0.6, centre, centre, radius);
      glow.addColorStop(0, accentRgba(0.05));
      glow.addColorStop(1, accentRgba(0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centre, centre, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = accentRgba(0.3);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centre, centre, radius, 0, Math.PI * 2);
      ctx.stroke();

      drawGraticule(radius, centre);
      drawLand(radius, centre);
      drawPin(radius, centre, time);

      frame = requestAnimationFrame(render);
    };

    resize();
    frame = requestAnimationFrame(render);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [coordinates, theme]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    velocityRef.current = 0;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const last = lastPointRef.current;
    lastPointRef.current = { x: event.clientX, y: event.clientY };

    const step = -(event.clientX - last.x) * DRAG_SPEED;
    yawRef.current += step;
    velocityRef.current = step;
    pitchRef.current = Math.max(
      -PITCH_LIMIT,
      Math.min(PITCH_LIMIT, pitchRef.current + (event.clientY - last.y) * DRAG_SPEED)
    );
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") velocityRef.current = KEY_STEP * DRAG_SPEED * 12;
    else if (event.key === "ArrowRight") velocityRef.current = -KEY_STEP * DRAG_SPEED * 12;
    else return;
    event.preventDefault();
  };

  return (
    <div
      role="img"
      aria-label={`Rotating globe with a marker on ${label}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full max-w-[210px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.6)]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="block w-full aspect-square cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
};
