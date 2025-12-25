import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import type { Track } from '@/types';
import { recentlyPlayedApi, favoritesApi } from '@/db/api';
import { useAuth } from './AuthContext';

export type RepeatMode = 'off' | 'all' | 'one';

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFavorite: boolean;
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  playTrack: (track: Track, trackList?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleFavorite: () => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Check if current track is favorited
  useEffect(() => {
    if (currentTrack && user) {
      favoritesApi.isFavorite(user.id, currentTrack.id).then(setIsFavorite);
    } else {
      setIsFavorite(false);
    }
  }, [currentTrack, user]);

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.file_url;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  // Handle time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        // Repeat current track
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else if (repeatMode === 'all' || currentIndex < queue.length - 1) {
        // Play next track
        let nextIndex = currentIndex + 1;
        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') {
            nextIndex = 0;
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
            return;
          }
        }
        setCurrentIndex(nextIndex);
        setCurrentTrack(queue[nextIndex]);
        setIsPlaying(true);
      } else {
        // Stop playback
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, currentIndex, queue]);

  // Save progress to recently played
  useEffect(() => {
    if (!currentTrack || !user || !isPlaying) return;

    const interval = setInterval(() => {
      if (audioRef.current && currentTrack) {
        const progress = Math.floor(audioRef.current.currentTime);
        recentlyPlayedApi.addRecentlyPlayed(user.id, currentTrack.id, progress).catch(console.error);
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [currentTrack, user, isPlaying]);

  const playTrack = (track: Track, trackList?: Track[]) => {
    if (trackList && trackList.length > 0) {
      // Set up queue
      const newQueue = shuffle ? shuffleArray(trackList) : trackList;
      setQueue(newQueue);
      setOriginalQueue(trackList);
      const index = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
      setCurrentTrack(index >= 0 ? newQueue[index] : track);
    } else {
      // Single track playback
      setCurrentTrack(track);
      setQueue([track]);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
    if (user) {
      recentlyPlayedApi.addRecentlyPlayed(user.id, track.id, 0).catch(console.error);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    
    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }
    
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    // If more than 3 seconds played, restart current track
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const toggleShuffle = () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    
    if (queue.length > 0) {
      if (newShuffle) {
        // Enable shuffle: shuffle the queue but keep current track
        const currentTrackData = queue[currentIndex];
        const otherTracks = queue.filter((_, idx) => idx !== currentIndex);
        const shuffledOthers = shuffleArray(otherTracks);
        const newQueue = [currentTrackData, ...shuffledOthers];
        setQueue(newQueue);
        setCurrentIndex(0);
      } else {
        // Disable shuffle: restore original order
        if (originalQueue.length > 0) {
          const currentTrackData = queue[currentIndex];
          const newIndex = originalQueue.findIndex(t => t.id === currentTrackData.id);
          setQueue(originalQueue);
          setCurrentIndex(newIndex >= 0 ? newIndex : 0);
        }
      }
    }
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
    if (!originalQueue.find(t => t.id === track.id)) {
      setOriginalQueue(prev => [...prev, track]);
    }
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, idx) => idx !== index));
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (index === currentIndex && queue.length > 1) {
      // If removing current track, play next
      playNext();
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setOriginalQueue([]);
    setCurrentIndex(0);
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFavorite = async () => {
    if (!currentTrack || !user) return;

    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(user.id, currentTrack.id);
        setIsFavorite(false);
      } else {
        await favoritesApi.addFavorite(user.id, currentTrack.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        duration,
        isFavorite,
        queue,
        currentIndex,
        shuffle,
        repeatMode,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlayPause,
        setVolume,
        seekTo,
        toggleFavorite,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        audioRef
      }}
    >
      {children}
      <audio ref={audioRef} />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
