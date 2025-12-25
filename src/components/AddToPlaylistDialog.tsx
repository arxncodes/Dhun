import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { playlistApi } from '@/db/api';
import type { Playlist, Track } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToPlaylistDialogProps {
  track: Track | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToPlaylistDialog({ track, open, onOpenChange }: AddToPlaylistDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [addedPlaylists, setAddedPlaylists] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      loadPlaylists();
    }
  }, [open, user]);

  const loadPlaylists = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await playlistApi.getUserPlaylists(user.id);
      setPlaylists(data);
      
      // Check which playlists already contain this track
      if (track) {
        const added = new Set<string>();
        for (const playlist of data) {
          const tracks = await playlistApi.getPlaylistTracks(playlist.id);
          if (tracks.some(pt => pt.track_id === track.id)) {
            added.add(playlist.id);
          }
        }
        setAddedPlaylists(added);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load playlists',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!track || !user) return;

    try {
      if (addedPlaylists.has(playlistId)) {
        // Remove from playlist
        await playlistApi.removeTrackFromPlaylist(playlistId, track.id);
        setAddedPlaylists(prev => {
          const next = new Set(prev);
          next.delete(playlistId);
          return next;
        });
        toast({
          title: 'Removed',
          description: 'Track removed from playlist',
        });
      } else {
        // Add to playlist - get current tracks to determine position
        const tracks = await playlistApi.getPlaylistTracks(playlistId);
        const position = tracks.length;
        await playlistApi.addTrackToPlaylist(playlistId, track.id, position);
        setAddedPlaylists(prev => new Set(prev).add(playlistId));
        toast({
          title: 'Added',
          description: 'Track added to playlist',
        });
      }
    } catch (error) {
      console.error('Failed to update playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update playlist',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            {track ? `Add "${track.title}" to a playlist` : 'Select a track first'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any playlists yet</p>
            <Button asChild variant="outline">
              <a href="/playlists">Create Playlist</a>
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const isAdded = addedPlaylists.has(playlist.id);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{playlist.name}</p>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {playlist.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {isAdded && (
                      <Check className="h-5 w-5 text-primary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
