import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import type { Track } from '@/types';
import { recentlyPlayedApi, favoritesApi } from '@/db/api';
import { useAuth } from './AuthContext';

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFavorite: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleFavorite: () => Promise<void>;
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();

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
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (user) {
      recentlyPlayedApi.addRecentlyPlayed(user.id, track.id, 0).catch(console.error);
    }
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
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlayPause,
        setVolume,
        seekTo,
        toggleFavorite,
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
