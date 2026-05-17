'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const blob = blobRef.current;
    if (!dot || !blob) return;

    let bx = window.innerWidth / 2, by = window.innerHeight / 2;
    let mx = bx, my = by;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };

    const loop = () => {
      bx += (mx - bx) * 0.14;
      by += (my - by) * 0.14;
      blob.style.transform = `translate(${bx - 18}px, ${by - 18}px)`;
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 8, height: 8, borderRadius: '50%',
        background: 'var(--saffron)', pointerEvents: 'none', zIndex: 99999,
        top: 0, left: 0, willChange: 'transform',
      }} />
      <div ref={blobRef} style={{
        position: 'fixed', width: 36, height: 36, borderRadius: '50%',
        border: '2px solid rgba(99,102,241,0.5)', pointerEvents: 'none', zIndex: 99998,
        top: 0, left: 0, willChange: 'transform',
      }} />
    </>
  );
}
