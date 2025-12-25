import { useEffect, useRef, useState } from 'react';

interface AudioReactiveWaveProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  barCount?: number;
}

export function AudioReactiveWave({ 
  audioElement, 
  isPlaying, 
  barCount = 40 
}: AudioReactiveWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioElement || isInitialized) return;

    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Higher = more frequency detail, lower = better performance
      analyser.smoothingTimeConstant = 0.8; // Smoothing for less jittery animation
      analyserRef.current = analyser;

      // Create source from audio element
      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;

      // Connect: source -> analyser -> destination
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Web Audio API:', error);
    }

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [audioElement, isInitialized]);

  // Resume audio context on user interaction (required by browsers)
  useEffect(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended' && isPlaying) {
      audioContextRef.current.resume();
    }
  }, [isPlaying]);

  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser || !isPlaying) {
      // Clear canvas when not playing
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw static bars when paused
          drawStaticBars(ctx, canvas.width, canvas.height, barCount);
        }
      }
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate bar width and spacing
      const barWidth = canvas.width / barCount;
      const barSpacing = barWidth * 0.2;
      const actualBarWidth = barWidth - barSpacing;

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        // Map bar index to frequency data (focus on lower-mid frequencies for music)
        const dataIndex = Math.floor((i / barCount) * (bufferLength * 0.6));
        const value = dataArray[dataIndex];
        
        // Normalize value (0-255) to height (0-1)
        const normalizedValue = value / 255;
        
        // Calculate bar height with minimum height
        const minHeight = 0.05;
        const barHeight = Math.max(minHeight, normalizedValue) * canvas.height;
        
        // Calculate position
        const x = i * barWidth + barSpacing / 2;
        const y = canvas.height - barHeight;

        // Create gradient for bar
        const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
        
        // Use CSS variables for colors (matching theme)
        const primaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--primary')
          .trim();
        const chart2Color = getComputedStyle(document.documentElement)
          .getPropertyValue('--chart-2')
          .trim();
        const chart3Color = getComputedStyle(document.documentElement)
          .getPropertyValue('--chart-3')
          .trim();

        gradient.addColorStop(0, `hsl(${primaryColor})`);
        gradient.addColorStop(0.5, `hsl(${chart2Color})`);
        gradient.addColorStop(1, `hsl(${chart3Color})`);

        // Draw bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, barHeight);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  // Draw static bars when paused
  const drawStaticBars = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    count: number
  ) => {
    const barWidth = width / count;
    const barSpacing = barWidth * 0.2;
    const actualBarWidth = barWidth - barSpacing;
    const staticHeight = height * 0.1;

    // Get muted color
    const mutedColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--muted')
      .trim();

    ctx.fillStyle = `hsl(${mutedColor})`;

    for (let i = 0; i < count; i++) {
      const x = i * barWidth + barSpacing / 2;
      const y = height - staticHeight;
      ctx.fillRect(x, y, actualBarWidth, staticHeight);
    }
  };

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-16 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}
