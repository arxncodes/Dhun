import { useEffect, useState } from 'react';
import { trackApi, storageApi, profileApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Track, Profile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Music, Podcast, Users, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BulkUploadDialog, type SingleUploadData, type BulkUploadData } from '@/components/BulkUploadDialog';

export default function AdminDashboardPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

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

  const handleSingleUpload = async (data: SingleUploadData) => {
    if (!data.audioFile || !data.title.trim()) {
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
      const fileName = `${Date.now()}_${data.audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const fileUrl = await storageApi.uploadAudio(data.audioFile, fileName);

      // Upload cover image if provided
      let uploadedCoverUrl = data.coverImageUrl.trim() || null;
      if (data.coverImageFile) {
        const coverFileName = `cover_${Date.now()}_${data.coverImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        uploadedCoverUrl = await storageApi.uploadAudio(data.coverImageFile, coverFileName);
      }

      // Create track record
      await trackApi.createTrack({
        title: data.title.trim(),
        artist: data.contentType === 'music' ? (data.artist.trim() || null) : null,
        podcast_name: data.contentType === 'podcast' ? (data.podcastName.trim() || null) : null,
        category: data.contentType === 'podcast' ? (data.category.trim() || null) : null,
        music_category: data.contentType === 'music' && data.musicCategory ? (data.musicCategory as any) : null,
        content_type: data.contentType,
        file_path: fileName,
        file_url: fileUrl,
        duration: null,
        cover_image_url: uploadedCoverUrl
      });

      toast({
        title: 'Success',
        description: 'Track uploaded successfully'
      });

      setUploadDialogOpen(false);
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

  const handleBulkUpload = async (data: BulkUploadData) => {
    if (data.audioFiles.length === 0 || !data.artist.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide audio files and artist name',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploading(true);

      // Upload cover image first if provided
      let uploadedCoverUrl: string | null = null;
      if (data.coverImageFile) {
        const coverFileName = `cover_${Date.now()}_${data.coverImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        uploadedCoverUrl = await storageApi.uploadAudio(data.coverImageFile, coverFileName);
      }

      // Upload all audio files in parallel
      const uploadPromises = data.audioFiles.map(async (file) => {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const fileUrl = await storageApi.uploadAudio(file, fileName);
        
        return {
          title: data.trackTitles[file.name] || file.name.replace(/\.[^/.]+$/, ''),
          artist: data.artist.trim(),
          podcast_name: null,
          category: null,
          music_category: data.musicCategory,
          content_type: 'music' as const,
          file_path: fileName,
          file_url: fileUrl,
          duration: null,
          cover_image_url: uploadedCoverUrl
        };
      });

      const tracksToCreate = await Promise.all(uploadPromises);

      // Bulk insert all tracks
      await trackApi.bulkCreateTracks(tracksToCreate);

      toast({
        title: 'Success',
        description: `Successfully uploaded ${data.audioFiles.length} track${data.audioFiles.length !== 1 ? 's' : ''}`
      });

      setUploadDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to bulk upload tracks:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload tracks',
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
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Music
        </Button>
      </div>

      <BulkUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSingleUpload={handleSingleUpload}
        onBulkUpload={handleBulkUpload}
        uploading={uploading}
      />

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
