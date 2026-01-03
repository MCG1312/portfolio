import React, { useEffect, useRef } from 'react';

export const DotGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.05;
      targetY = (e.clientY - window.innerHeight / 2) * 0.05;
    };

    const draw = () => {
      // Smooth interpolation
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#222'; // Subtle grey dots

      const spacing = 30;
      const rows = Math.ceil(canvas.height / spacing);
      const cols = Math.ceil(canvas.width / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          
          // Parallax offset
          const offsetX = mouseX * ((j - rows/2) / rows);
          const offsetY = mouseY * ((i - cols/2) / cols);

          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-50"
    />
  );
};