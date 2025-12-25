import { useEffect, useState } from 'react';
import { trackApi } from '@/db/api';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Track } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Music } from 'lucide-react';

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const data = await trackApi.getAllTracks('music');
      setTracks(data);
    } catch (error) {
      console.error('Failed to load music:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <Skeleton className="h-10 w-48 mb-6 bg-muted" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <h1 className="text-3xl font-bold mb-6">Music</h1>
      
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No music available</h2>
          <p className="text-muted-foreground">
            Check back later for new music tracks
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="group hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <CardContent className="p-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                  {track.cover_image_url ? (
                    <img
                      src={track.cover_image_url}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="font-medium truncate text-sm">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist || 'Unknown Artist'}
                </p>
                {track.category && (
                  <p className="text-xs text-muted-foreground/70 truncate mt-1">
                    {track.category}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
