import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackApi, recentlyPlayedApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Track, RecentlyPlayed } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Music, Podcast, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tracks, recent] = await Promise.all([
        trackApi.getAllTracks(),
        user ? recentlyPlayedApi.getUserRecentlyPlayed(user.id, 6) : Promise.resolve([])
      ]);
      setRecentTracks(tracks.slice(0, 6));
      setRecentlyPlayed(recent);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: Track) => {
    playTrack(track);
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-3/20 p-8 xl:p-12">
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 gradient-text">
            Welcome to Melody Stream
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Discover and stream your favorite music and podcasts. Create playlists, explore new content, and enjoy seamless playback.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link to="/music">
                <Music className="mr-2 h-5 w-5" />
                Browse Music
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/podcasts">
                <Podcast className="mr-2 h-5 w-5" />
                Explore Podcasts
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Played</h2>
            <Button asChild variant="ghost">
              <Link to="/recent">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentlyPlayed.map((item) => {
              const track = item.track;
              if (!track) return null;
              return (
                <Card
                  key={item.id}
                  className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => handlePlayTrack(track)}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Tracks</h2>
          <Button asChild variant="ghost">
            <Link to="/music">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {recentTracks.map((track) => (
            <Card
              key={track.id}
              className="group hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => handlePlayTrack(track)}
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
                      {track.content_type === 'music' ? (
                        <Music className="h-8 w-8 text-muted-foreground" />
                      ) : (
                        <Podcast className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="font-medium truncate text-sm">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.content_type === 'music' ? track.artist : track.podcast_name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
