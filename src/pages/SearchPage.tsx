import { useState } from 'react';
import { trackApi } from '@/db/api';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Track } from '@/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, Play, Music, Podcast } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'music' | 'podcast'>('all');
  const { playTrack } = useAudioPlayer();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, activeTab]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const contentType = activeTab === 'all' ? undefined : activeTab;
      const data = await trackApi.searchTracks(searchQuery, contentType);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(track => {
    if (activeTab === 'all') return true;
    return track.content_type === activeTab;
  });

  return (
    <div className="p-6 xl:p-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="max-w-2xl mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for music, podcasts, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="podcast">Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {query.trim() ? 'No results found' : 'Start searching'}
              </h2>
              <p className="text-muted-foreground">
                {query.trim() 
                  ? 'Try different keywords or check your spelling'
                  : 'Enter a search term to find music and podcasts'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {filteredResults.map((track) => (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
