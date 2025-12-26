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
  const isSeekingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !audioRef.current) return;

    // Initialize WaveSurfer only once
    if (!wavesurferRef.current) {
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
        interact: true,
        hideScrollbar: true,
        autoCenter: true,
        minPxPerSec: 1,
      });

      // Handle seeking - when user clicks on waveform
      wavesurferRef.current.on('click', (relativeX: number) => {
        if (audioRef.current && onSeek) {
          const duration = audioRef.current.duration;
          
          // Validate duration is a valid finite number
          if (!duration || !isFinite(duration)) {
            console.warn('Cannot seek: audio duration not ready');
            return;
          }
          
          isSeekingRef.current = true;
          const seekTime = relativeX * duration;
          onSeek(seekTime);
          // Reset seeking flag after a short delay
          setTimeout(() => {
            isSeekingRef.current = false;
          }, 100);
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
      }
    };
  }, []);

  // Update waveform when audio source changes
  useEffect(() => {
    if (wavesurferRef.current && audioRef.current?.src) {
      wavesurferRef.current.load(audioRef.current.src);
    }
  }, [audioRef.current?.src]);

  // Sync current time to update progress (but don't control playback)
  useEffect(() => {
    if (wavesurferRef.current && audioRef.current && !isSeekingRef.current) {
      const duration = audioRef.current.duration;
      if (duration && isFinite(duration)) {
        const progress = currentTime / duration;
        wavesurferRef.current.seekTo(progress);
      }
    }
  }, [currentTime]);

  return (
    <div className="w-full px-4 py-2">
      <div 
        ref={containerRef} 
        className="w-full cursor-pointer"
        style={{ minHeight: '80px' }}
      />
    </div>
  );
}
