import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Upload,
  Music,
  Trash2,
} from "lucide-react";

interface Song {
  id: string;
  name: string;
  url: string;
  lyrics?: string;
}

const TEST_SONGS: Song[] = [
  {
    id: "1",
    name: "测试音频",
    url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    lyrics:
      "[00:00.00]This is a test song\n[00:04.00]With some example lyrics\n[00:08.00]To demonstrate the lyrics display\n[00:12.00]In our music player",
  },
];

interface LyricLine {
  time: number;
  text: string;
}

function parseLyrics(lyricsStr?: string): LyricLine[] {
  if (!lyricsStr) return [];

  return lyricsStr
    .split("\n")
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
      if (!match) return null;

      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const time = minutes * 60 + seconds;
      const text = match[4].trim();

      return { time, text };
    })
    .filter((line): line is LyricLine => line !== null);
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function App() {
  const [songs, setSongs] = useState<Song[]>(TEST_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(TEST_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);

  const currentLyrics = currentSong ? parseLyrics(currentSong.lyrics) : [];
  const currentLyricIndex = currentLyrics.findIndex((line, index) => {
    const nextLine = currentLyrics[index + 1];
    return (
      line.time <= currentTime && (!nextLine || nextLine.time > currentTime)
    );
  });

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setVolume(value);
      if (audioRef.current) {
        audioRef.current.volume = value;
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && audioRef.current) {
      const newTime = (value / 100) * duration;
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newSongs = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setSongs((prev) => [...prev, ...newSongs]);
    }
  };

  const playNext = () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
      setCurrentSong(songs[previousIndex]);
    }
  };

  const removeSong = (songId: string) => {
    setSongs((prev) => prev.filter((song) => song.id !== songId));
    if (currentSong?.id === songId) {
      const remainingSongs = songs.filter((song) => song.id !== songId);
      setCurrentSong(remainingSongs.length > 0 ? remainingSongs[0] : null);
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (lyricsRef.current && currentLyricIndex !== -1) {
      const lyricElement = lyricsRef.current.children[currentLyricIndex];
      if (lyricElement) {
        lyricElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentLyricIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 flex items-center justify-center p-8">
      <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-4xl shadow-2xl border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <div className="flex flex-col items-center mb-8">
              <div className="w-48 h-48 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 ring-2 ring-white/20">
                <div className="w-44 h-44 bg-black/40 backdrop-blur rounded-full flex items-center justify-center">
                  <Music className="w-24 h-24 text-white/80" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">
                {currentSong ? currentSong.name : "No song selected"}
              </h1>
              <div className="text-violet-200/80 text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="mb-8 px-2">
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                  style={{
                    width: `${(currentTime / (duration || 1)) * 100}%`,
                    transition: "width 0.1s linear",
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / (duration || 1)) * 100}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer relative z-10"
                  style={{
                    backgroundImage: "none",
                    WebkitAppearance: "none",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={playPrevious}
                className="p-3 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
              >
                <SkipBack className="w-8 h-8 text-white/80" />
              </button>
              <button
                onClick={togglePlay}
                className="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full hover:from-violet-400 hover:to-fuchsia-400 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-purple-500/30"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white translate-x-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                className="p-3 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
              >
                <SkipForward className="w-8 h-8 text-white/80" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8 px-2">
              {volume === 0 ? (
                <VolumeX className="w-6 h-6 text-white/80" />
              ) : (
                <Volume2 className="w-6 h-6 text-white/80" />
              )}
              <div className="relative flex-1">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full h-3"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer relative z-10"
                />
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur rounded-2xl p-6 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div ref={lyricsRef} className="space-y-4">
                {currentLyrics.length > 0 ? (
                  currentLyrics.map((line, index) => (
                    <p
                      key={index}
                      className={`text-center transition-all duration-500 ${
                        index === currentLyricIndex
                          ? "text-white text-lg font-semibold scale-110"
                          : "text-violet-200/50 text-base scale-100"
                      }`}
                    >
                      {line.text}
                    </p>
                  ))
                ) : (
                  <p className="text-violet-200/50 text-center">
                    No lyrics available
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                播放列表
              </h2>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-colors text-white py-4 rounded-xl cursor-pointer mb-4 border border-white/10 backdrop-blur"
                >
                  <Upload className="w-5 h-5" />
                  上传音乐
                </label>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur rounded-2xl p-4 flex-grow overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {songs.length === 0 ? (
                <div className="text-violet-200/50 text-center py-8">
                  播放列表中没有歌曲。上传一些音乐来开始！
                </div>
              ) : (
                <div className="space-y-2">
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => setCurrentSong(song)}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                        currentSong?.id === song.id
                          ? "bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 text-white border border-white/10"
                          : "hover:bg-white/5 text-violet-200/80"
                      }`}
                    >
                      <div className="flex items-center flex-grow min-w-0">
                        <span className="w-6 text-sm opacity-60">
                          {index + 1}.
                        </span>
                        <Music className="w-5 h-5 mr-3 flex-shrink-0 opacity-60" />
                        <span className="truncate">{song.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSong(song.id);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2 opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {currentSong && (
          <audio
            ref={audioRef}
            src={currentSong.url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={playNext}
          />
        )}
      </div>
    </div>
  );
}

export default App;
