import { useEffect, useState } from 'react';
import { recentlyPlayedApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { RecentlyPlayed } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Clock, Music, Podcast } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentlyPlayedPage() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    if (user) {
      loadRecentlyPlayed();
    }
  }, [user]);

  const loadRecentlyPlayed = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await recentlyPlayedApi.getUserRecentlyPlayed(user.id, 50);
      setRecentlyPlayed(data);
    } catch (error) {
      console.error('Failed to load recently played:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <Skeleton className="h-10 w-48 mb-6 bg-muted" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <h1 className="text-3xl font-bold mb-6">Recently Played</h1>
      
      {recentlyPlayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No listening history</h2>
          <p className="text-muted-foreground">
            Start playing some tracks to see your listening history here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentlyPlayed.map((item) => {
            const track = item.track;
            if (!track) return null;
            
            return (
              <Card
                key={item.id}
                className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {track.cover_image_url ? (
                        <img
                          src={track.cover_image_url}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {track.content_type === 'music' ? (
                            <Music className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <Podcast className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.content_type === 'music' ? track.artist : track.podcast_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(item.played_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
