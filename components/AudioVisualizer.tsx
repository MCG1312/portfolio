import React, { useEffect, useRef } from 'react';

export const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseSpeed = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime.current;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate instantaneous speed
      if (dt > 0) {
        const speed = dist / dt;
        mouseSpeed.current = Math.min(speed * 10, 50); // Cap max amplitude
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;
    };

    window.addEventListener('mousemove', handleMove);

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Decay speed
      mouseSpeed.current *= 0.92;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      // Draw random noise based on mouseSpeed
      for (let i = 0; i < canvas.width; i += 5) {
        const noise = (Math.random() - 0.5) * mouseSpeed.current;
        ctx.lineTo(i, canvas.height / 2 + noise);
      }
      
      ctx.stroke();
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 pointer-events-none z-40 border-t border-white/10 bg-obsidian/50 backdrop-blur-sm">
      <canvas ref={canvasRef} width={window.innerWidth} height={48} className="w-full h-full" />
    </div>
  );
};