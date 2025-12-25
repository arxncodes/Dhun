import { useEffect, useState, useRef } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Heart, Volume2, VolumeX } from 'lucide-react';

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function AudioWaveVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = 40;
  
  return (
    <div className="flex items-center justify-center gap-1 h-16 px-4">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${isPlaying ? 'wave-bar' : 'bg-muted'}`}
          style={{
            height: isPlaying ? `${Math.random() * 60 + 20}%` : '20%',
            animationDelay: `${i * 0.05}s`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`
          }}
        />
      ))}
    </div>
  );
}

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isFavorite,
    togglePlayPause,
    setVolume,
    seekTo,
    toggleFavorite
  } = useAudioPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="container mx-auto">
        {/* Wave Visualizer */}
        <AudioWaveVisualizer isPlaying={isPlaying} />

        {/* Player Controls */}
        <div className="flex flex-col xl:flex-row items-center gap-4 p-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {currentTrack.cover_image_url && (
              <img
                src={currentTrack.cover_image_url}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack.content_type === 'music' 
                  ? currentTrack.artist 
                  : currentTrack.podcast_name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="shrink-0"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`}
              />
            </Button>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 w-full xl:w-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="h-10 w-10"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-xs text-muted-foreground w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={([value]) => seekTo(value)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => {
                setVolume(value / 100);
                setIsMuted(false);
              }}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
