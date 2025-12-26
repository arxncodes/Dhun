import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface RealAudioWaveformProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  onSeek?: (time: number) => void;
}

export default function RealAudioWaveform({ 
  audioRef, 
  isPlaying,
  currentTime,
  onSeek 
}: RealAudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !audioRef.current) return;

    // Initialize WaveSurfer only once
    if (!wavesurferRef.current && !isInitializedRef.current) {
      isInitializedRef.current = true;

      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: 'hsl(var(--primary) / 0.3)',
        progressColor: 'hsl(var(--primary))',
        cursorColor: 'hsl(var(--primary))',
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 80,
        normalize: true,
        backend: 'WebAudio',
        media: audioRef.current,
        interact: true,
        hideScrollbar: true,
        autoCenter: true,
        minPxPerSec: 1,
      });

      // Handle seeking
      wavesurferRef.current.on('interaction', () => {
        if (wavesurferRef.current && onSeek) {
          const time = wavesurferRef.current.getCurrentTime();
          onSeek(time);
        }
      });

      // Handle errors
      wavesurferRef.current.on('error', (error) => {
        console.error('WaveSurfer error:', error);
      });

      // Load the audio when ready
      if (audioRef.current.src) {
        wavesurferRef.current.load(audioRef.current.src);
      }
    }

    return () => {
      // Cleanup on unmount
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // Update waveform when audio source changes
  useEffect(() => {
    if (wavesurferRef.current && audioRef.current?.src) {
      const currentSrc = audioRef.current.src;
      const wavesurferSrc = wavesurferRef.current.getMediaElement()?.src;
      
      if (currentSrc !== wavesurferSrc) {
        wavesurferRef.current.load(currentSrc);
      }
    }
  }, [audioRef.current?.src]);

  // Sync play/pause state
  useEffect(() => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.play();
      } else {
        wavesurferRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync current time (for external seeks)
  useEffect(() => {
    if (wavesurferRef.current && audioRef.current) {
      const wavesurferTime = wavesurferRef.current.getCurrentTime();
      const diff = Math.abs(wavesurferTime - currentTime);
      
      // Only seek if difference is significant (more than 0.5 seconds)
      // This prevents feedback loops
      if (diff > 0.5) {
        wavesurferRef.current.seekTo(currentTime / (audioRef.current.duration || 1));
      }
    }
  }, [currentTime]);

  return (
    <div className="w-full px-4 py-2">
      <div 
        ref={containerRef} 
        className="w-full"
        style={{ minHeight: '80px' }}
      />
    </div>
  );
}
