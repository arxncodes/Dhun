interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export default function AudioWaveVisualizer({ 
  isPlaying, 
  orientation = 'vertical' 
}: AudioWaveVisualizerProps) {
  const bars = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div 
      className={`w-full h-24 flex items-center justify-center gap-1 px-4 ${
        orientation === 'horizontal' ? 'flex-col' : 'flex-row'
      }`}
    >
      {bars.map((i) => (
        <div
          key={i}
          className={`${
            orientation === 'vertical' 
              ? 'w-1 h-full wave-bar' 
              : 'h-1 w-full wave-bar-horizontal'
          } ${isPlaying ? '' : 'opacity-30'}`}
          style={{
            animationDelay: `${i * 0.05}s`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}
