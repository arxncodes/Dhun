import { useState } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Heart, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AddToPlaylistDialog } from './AddToPlaylistDialog';
import { AudioReactiveWave } from './AudioReactiveWave';

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isFavorite,
    shuffle,
    repeatMode,
    togglePlayPause,
    setVolume,
    seekTo,
    toggleFavorite,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    audioRef
  } = useAudioPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return Repeat1;
    return Repeat;
  };

  const RepeatIcon = getRepeatIcon();

  if (!currentTrack) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 lg:left-64 bg-card border-t border-border z-40 transition-transform duration-300 ease-in-out ${
        isCollapsed ? 'translate-y-[calc(100%-3.5rem)]' : 'translate-y-0'
      }`}
    >
      {/* Toggle Button */}
      <div className="absolute top-2 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary"
          title={isCollapsed ? 'Expand player' : 'Collapse player'}
        >
          {isCollapsed ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="container mx-auto">
        {/* Collapsed Mini Player */}
        {isCollapsed && (
          <div className="flex items-center gap-3 p-3 pr-16">
            {currentTrack.cover_image_url && (
              <img
                src={currentTrack.cover_image_url}
                alt={currentTrack.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate text-sm">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.content_type === 'music' 
                  ? currentTrack.artist 
                  : currentTrack.podcast_name}
              </p>
            </div>
            <Button
              variant="default"
              size="icon"
              onClick={togglePlayPause}
              className="h-9 w-9 shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}

        {/* Full Player */}
        {!isCollapsed && (
          <>
            {/* Wave Visualizer */}
            <AudioReactiveWave 
              audioElement={audioRef.current} 
              isPlaying={isPlaying}
              barCount={50}
            />

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
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddToPlaylist(true)}
                title="Add to playlist"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 w-full xl:w-auto">
            <div className="flex items-center gap-2">
              {/* Shuffle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={`h-8 w-8 ${shuffle ? 'text-primary' : ''}`}
                title={shuffle ? 'Shuffle on' : 'Shuffle off'}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              {/* Previous */}
              <Button
                variant="ghost"
                size="icon"
                onClick={playPrevious}
                className="h-8 w-8"
                title="Previous track"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              {/* Play/Pause */}
              <Button
                variant="default"
                size="icon"
                onClick={togglePlayPause}
                className="h-10 w-10"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              {/* Next */}
              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                className="h-8 w-8"
                title="Next track"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Repeat */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={`h-8 w-8 ${repeatMode !== 'off' ? 'text-primary' : ''}`}
                title={`Repeat: ${repeatMode}`}
              >
                <RepeatIcon className="h-4 w-4" />
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
              title={isMuted ? 'Unmute' : 'Mute'}
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
          </>
        )}
      </div>

      {/* Add to Playlist Dialog */}
      <AddToPlaylistDialog
        track={currentTrack}
        open={showAddToPlaylist}
        onOpenChange={setShowAddToPlaylist}
      />
    </div>
  );
}
