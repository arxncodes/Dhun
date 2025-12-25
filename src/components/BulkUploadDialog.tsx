import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Upload, Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MusicCategory } from '@/types';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSingleUpload: (data: SingleUploadData) => Promise<void>;
  onBulkUpload: (data: BulkUploadData) => Promise<void>;
  uploading: boolean;
}

export interface SingleUploadData {
  audioFile: File;
  coverImageFile: File | null;
  title: string;
  artist: string;
  podcastName: string;
  category: string;
  musicCategory: string;
  contentType: 'music' | 'podcast';
  coverImageUrl: string;
}

export interface BulkUploadData {
  audioFiles: File[];
  coverImageFile: File | null;
  groupName: string;
  groupDescription: string;
  artist: string;
  musicCategory: MusicCategory;
  trackTitles: { [key: string]: string };
}

export function BulkUploadDialog({
  open,
  onOpenChange,
  onSingleUpload,
  onBulkUpload,
  uploading
}: BulkUploadDialogProps) {
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');

  // Single upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [podcastName, setPodcastName] = useState('');
  const [category, setCategory] = useState('');
  const [musicCategory, setMusicCategory] = useState('');
  const [contentType, setContentType] = useState<'music' | 'podcast'>('music');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Bulk upload state
  const [bulkAudioFiles, setBulkAudioFiles] = useState<File[]>([]);
  const [bulkCoverImageFile, setBulkCoverImageFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [bulkArtist, setBulkArtist] = useState('');
  const [bulkMusicCategory, setBulkMusicCategory] = useState<MusicCategory>('pop');
  const [trackTitles, setTrackTitles] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    // Reset single upload
    setAudioFile(null);
    setCoverImageFile(null);
    setTitle('');
    setArtist('');
    setPodcastName('');
    setCategory('');
    setMusicCategory('');
    setCoverImageUrl('');
    
    // Reset bulk upload
    setBulkAudioFiles([]);
    setBulkCoverImageFile(null);
    setGroupName('');
    setGroupDescription('');
    setBulkArtist('');
    setBulkMusicCategory('pop');
    setTrackTitles({});
  };

  const handleSingleSubmit = async () => {
    if (!audioFile || !title.trim()) return;
    
    await onSingleUpload({
      audioFile,
      coverImageFile,
      title,
      artist,
      podcastName,
      category,
      musicCategory,
      contentType,
      coverImageUrl
    });
    
    resetForm();
  };

  const handleBulkSubmit = async () => {
    if (bulkAudioFiles.length === 0 || !bulkArtist.trim()) return;
    
    await onBulkUpload({
      audioFiles: bulkAudioFiles,
      coverImageFile: bulkCoverImageFile,
      groupName,
      groupDescription,
      artist: bulkArtist,
      musicCategory: bulkMusicCategory,
      trackTitles
    });
    
    resetForm();
  };

  const handleBulkFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBulkAudioFiles(files);
    
    // Initialize track titles with file names (without extension)
    const titles: { [key: string]: string } = {};
    files.forEach(file => {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      titles[file.name] = nameWithoutExt;
    });
    setTrackTitles(titles);
  };

  const handleRemoveBulkFile = (fileName: string) => {
    setBulkAudioFiles(prev => prev.filter(f => f.name !== fileName));
    setTrackTitles(prev => {
      const newTitles = { ...prev };
      delete newTitles[fileName];
      return newTitles;
    });
  };

  const handleTrackTitleChange = (fileName: string, newTitle: string) => {
    setTrackTitles(prev => ({
      ...prev,
      [fileName]: newTitle
    }));
  };

  const musicCategories: MusicCategory[] = [
    'phonk', 'bollywood', 'hollywood', 'romantic', 'gym', 'casual', 'funny',
    'pop', 'rock', 'hip-hop', 'electronic', 'jazz', 'classical', 'country',
    'r&b', 'indie', 'folk', 'metal', 'blues', 'reggae', 'latin', 'k-pop',
    'anime', 'lo-fi', 'chill', 'party', 'workout', 'study', 'sleep', 'meditation', 'other'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Upload Music</DialogTitle>
          <DialogDescription>
            Choose between single track upload or bulk upload multiple tracks at once
          </DialogDescription>
        </DialogHeader>

        <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as 'single' | 'bulk')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Upload</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>

          {/* Single Upload Tab */}
          <TabsContent value="single" className="space-y-4">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-4">
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
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="artist">Artist</Label>
                      <Input
                        id="artist"
                        placeholder="Artist name"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="musicCategory">Music Category</Label>
                      <Select value={musicCategory} onValueChange={setMusicCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {musicCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {contentType === 'podcast' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="podcastName">Podcast Name</Label>
                      <Input
                        id="podcastName"
                        placeholder="Podcast name"
                        value={podcastName}
                        onChange={(e) => setPodcastName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Podcast Category (Optional)</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Technology, Business, Comedy"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a cover image or provide a URL below
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImageUrl">Or Cover Image URL</Label>
                  <Input
                    id="coverImageUrl"
                    placeholder="https://example.com/cover.jpg"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSingleSubmit} disabled={uploading || !audioFile || !title.trim()}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Bulk Upload Tab */}
          <TabsContent value="bulk" className="space-y-4">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkAudioFiles">Audio Files (Multiple)</Label>
                  <Input
                    id="bulkAudioFiles"
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleBulkFilesChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Select multiple audio files to upload at once
                  </p>
                </div>

                {bulkAudioFiles.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-semibold">
                          Selected Files ({bulkAudioFiles.length})
                        </Label>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {bulkAudioFiles.map((file) => (
                          <div key={file.name} className="flex items-start gap-2 p-2 bg-muted rounded-md">
                            <Music className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground truncate">
                                  {file.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 flex-shrink-0"
                                  onClick={() => handleRemoveBulkFile(file.name)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <Input
                                placeholder="Track title"
                                value={trackTitles[file.name] || ''}
                                onChange={(e) => handleTrackTitleChange(file.name, e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label htmlFor="groupName">Music Group Name (Optional)</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Summer Hits 2024, Workout Mix"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A name to identify this batch of songs
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupDescription">Group Description (Optional)</Label>
                  <Textarea
                    id="groupDescription"
                    placeholder="Describe this collection of songs..."
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkArtist">Artist Name *</Label>
                  <Input
                    id="bulkArtist"
                    placeholder="Artist name (applies to all tracks)"
                    value={bulkArtist}
                    onChange={(e) => setBulkArtist(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This artist name will be applied to all uploaded tracks
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkMusicCategory">Music Category *</Label>
                  <Select value={bulkMusicCategory} onValueChange={(v) => setBulkMusicCategory(v as MusicCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {musicCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This category will be applied to all uploaded tracks
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkCoverImage">Cover Image (Applies to All)</Label>
                  <Input
                    id="bulkCoverImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBulkCoverImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This cover image will be applied to all uploaded tracks
                  </p>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBulkSubmit} 
                disabled={uploading || bulkAudioFiles.length === 0 || !bulkArtist.trim()}
              >
                {uploading ? 'Uploading...' : `Upload ${bulkAudioFiles.length} Track${bulkAudioFiles.length !== 1 ? 's' : ''}`}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
