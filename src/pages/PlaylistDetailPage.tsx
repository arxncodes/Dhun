import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Playlist, PlaylistTrack } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Play, Music, Podcast, Trash2, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playTrack } = useAudioPlayer();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id]);

  const loadPlaylist = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [playlistData, tracksData] = await Promise.all([
        playlistApi.getPlaylist(id),
        playlistApi.getPlaylistTracks(id)
      ]);
      setPlaylist(playlistData);
      setTracks(tracksData);
    } catch (error) {
      console.error('Failed to load playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load playlist',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    
    try {
      await playlistApi.deletePlaylist(id);
      toast({
        title: 'Success',
        description: 'Playlist deleted successfully'
      });
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete playlist',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!id) return;
    
    try {
      await playlistApi.removeTrackFromPlaylist(id, trackId);
      toast({
        title: 'Success',
        description: 'Track removed from playlist'
      });
      loadPlaylist();
    } catch (error) {
      console.error('Failed to remove track:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove track',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <Skeleton className="h-10 w-48 mb-6 bg-muted" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 xl:p-8">
        <p>Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <Button variant="ghost" onClick={() => navigate('/playlists')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Playlists
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground">{playlist.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
          </p>
        </div>
        {user?.id === playlist.user_id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Playlist
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this playlist? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePlaylist}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tracks in this playlist</h2>
          <p className="text-muted-foreground">
            Add tracks to this playlist from the music or podcasts pages
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tracks.map((item) => {
            const track = item.track;
            if (!track) return null;
            
            return (
              <Card key={item.id} className="group hover:bg-secondary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playTrack(track)}
                      className="shrink-0"
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      {track.cover_image_url ? (
                        <img
                          src={track.cover_image_url}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {track.content_type === 'music' ? (
                            <Music className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Podcast className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.content_type === 'music' ? track.artist : track.podcast_name}
                      </p>
                    </div>
                    {user?.id === playlist.user_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTrack(track.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
