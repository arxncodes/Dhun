import { useEffect, useRef } from 'react';

interface SimpleAnimatedWaveProps {
  isPlaying: boolean;
  color?: string;
}

export default function SimpleAnimatedWave({ isPlaying, color = '#8B5CF6' }: SimpleAnimatedWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        // Draw multiple wave layers
        const waves = [
          { amplitude: 20, frequency: 0.02, speed: 0.05, opacity: 0.3 },
          { amplitude: 15, frequency: 0.03, speed: 0.07, opacity: 0.5 },
          { amplitude: 25, frequency: 0.015, speed: 0.04, opacity: 0.2 },
        ];

        waves.forEach((wave) => {
          ctx.beginPath();
          ctx.strokeStyle = color + Math.floor(wave.opacity * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 2;

          for (let x = 0; x < width; x++) {
            const y = centerY + Math.sin(x * wave.frequency + phaseRef.current * wave.speed) * wave.amplitude;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        });

        // Update phase for animation
        phaseRef.current += 1;
      } else {
        // Draw flat line when paused
        ctx.beginPath();
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
