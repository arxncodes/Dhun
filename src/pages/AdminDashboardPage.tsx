import { useEffect, useState } from 'react';
import { trackApi, storageApi, profileApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Track, Profile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Music, Podcast, Users, Trash2, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  // Upload form state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [podcastName, setPodcastName] = useState('');
  const [category, setCategory] = useState('');
  const [contentType, setContentType] = useState<'music' | 'podcast'>('music');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tracksData, profilesData] = await Promise.all([
        trackApi.getAllTracks(),
        profileApi.getAllProfiles()
      ]);
      setTracks(tracksData);
      setProfiles(profilesData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTrack = async () => {
    if (!audioFile || !title.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an audio file and title',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload audio file
      const fileName = `${Date.now()}_${audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const fileUrl = await storageApi.uploadAudio(audioFile, fileName);

      // Create track record
      await trackApi.createTrack({
        title: title.trim(),
        artist: contentType === 'music' ? (artist.trim() || null) : null,
        podcast_name: contentType === 'podcast' ? (podcastName.trim() || null) : null,
        category: category.trim() || null,
        content_type: contentType,
        file_path: fileName,
        file_url: fileUrl,
        duration: null,
        cover_image_url: coverImageUrl.trim() || null
      });

      toast({
        title: 'Success',
        description: 'Track uploaded successfully'
      });

      // Reset form
      setUploadDialogOpen(false);
      setAudioFile(null);
      setTitle('');
      setArtist('');
      setPodcastName('');
      setCategory('');
      setCoverImageUrl('');
      loadData();
    } catch (error) {
      console.error('Failed to upload track:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload track',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTrack = async (track: Track) => {
    try {
      await trackApi.deleteTrack(track.id);
      await storageApi.deleteAudio(track.file_path);
      toast({
        title: 'Success',
        description: 'Track deleted successfully'
      });
      loadData();
    } catch (error) {
      console.error('Failed to delete track:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete track',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await profileApi.updateProfile(userId, { role: newRole });
      toast({
        title: 'Success',
        description: 'User role updated successfully'
      });
      loadData();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="p-6 xl:p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              You don't have permission to access this page
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <Skeleton className="h-10 w-48 mb-6 bg-muted" />
        <div className="space-y-4">
          <Skeleton className="h-32 bg-muted" />
          <Skeleton className="h-64 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Track
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Track</DialogTitle>
              <DialogDescription>
                Upload an audio file and provide metadata
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={(v) => setContentType(v as 'music' | 'podcast')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioFile">Audio File</Label>
                <Input
                  id="audioFile"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Track title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {contentType === 'music' && (
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    placeholder="Artist name"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                  />
                </div>
              )}
              {contentType === 'podcast' && (
                <div className="space-y-2">
                  <Label htmlFor="podcastName">Podcast Name</Label>
                  <Input
                    id="podcastName"
                    placeholder="Podcast name"
                    value={podcastName}
                    onChange={(e) => setPodcastName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  placeholder="e.g., Rock, Pop, Technology"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Cover Image URL (Optional)</Label>
                <Input
                  id="coverImageUrl"
                  placeholder="https://example.com/cover.jpg"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadTrack} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tracks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Music Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tracks.filter(t => t.content_type === 'music').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Podcast Episodes</CardTitle>
            <Podcast className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tracks.filter(t => t.content_type === 'podcast').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracks">
        <TabsList>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Tracks</CardTitle>
              <CardDescription>Manage uploaded music and podcast tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Artist/Podcast</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tracks.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell className="font-medium">{track.title}</TableCell>
                      <TableCell>
                        <Badge variant={track.content_type === 'music' ? 'default' : 'secondary'}>
                          {track.content_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {track.content_type === 'music' ? track.artist : track.podcast_name}
                      </TableCell>
                      <TableCell>{track.category || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrack(track)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {user.id !== profile.id && (
                          <Select
                            value={user.role}
                            onValueChange={(v) => handleUpdateUserRole(user.id, v as 'user' | 'admin')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
