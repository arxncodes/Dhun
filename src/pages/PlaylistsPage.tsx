import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { playlistApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Playlist } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ListMusic, Plus } from 'lucide-react';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await playlistApi.getUserPlaylists(user.id);
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!user || !name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a playlist name',
        variant: 'destructive'
      });
      return;
    }

    try {
      setCreating(true);
      await playlistApi.createPlaylist({
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        cover_image_url: null
      });
      
      toast({
        title: 'Success',
        description: 'Playlist created successfully'
      });
      
      setDialogOpen(false);
      setName('');
      setDescription('');
      loadPlaylists();
    } catch (error) {
      console.error('Failed to create playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to create playlist',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48 bg-muted" />
          <Skeleton className="h-10 w-32 bg-muted" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Give your playlist a name and description
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Playlist"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your playlist..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlaylist} disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ListMusic className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No playlists yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first playlist to organize your favorite tracks
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Playlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <Link key={playlist.id} to={`/playlists/${playlist.id}`}>
              <Card className="group hover:bg-secondary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3 flex items-center justify-center">
                    {playlist.cover_image_url ? (
                      <img
                        src={playlist.cover_image_url}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ListMusic className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <p className="font-medium truncate text-sm">{playlist.name}</p>
                  {playlist.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {playlist.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
