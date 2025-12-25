import { supabase } from './supabase';
import type { Track, Playlist, PlaylistTrack, RecentlyPlayed, Favorite, Profile, ContentType } from '@/types';

// Profile API
export const profileApi = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
};

// Track API
export const trackApi = {
  async getAllTracks(contentType?: ContentType): Promise<Track[]> {
    let query = supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getTrack(id: string): Promise<Track | null> {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async searchTracks(query: string, contentType?: ContentType): Promise<Track[]> {
    let searchQuery = supabase
      .from('tracks')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,podcast_name.ilike.%${query}%,category.ilike.%${query}%,music_category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (contentType) {
      searchQuery = searchQuery.eq('content_type', contentType);
    }

    const { data, error } = await searchQuery;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createTrack(track: Omit<Track, 'id' | 'created_at' | 'updated_at'>): Promise<Track> {
    const { data, error } = await supabase
      .from('tracks')
      .insert(track)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrack(id: string, updates: Partial<Track>): Promise<Track> {
    const { data, error } = await supabase
      .from('tracks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTrack(id: string): Promise<void> {
    const { error } = await supabase
      .from('tracks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Playlist API
export const playlistApi = {
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getPlaylist(id: string): Promise<Playlist | null> {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createPlaylist(playlist: Omit<Playlist, 'id' | 'created_at' | 'updated_at'>): Promise<Playlist> {
    const { data, error } = await supabase
      .from('playlists')
      .insert(playlist)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist> {
    const { data, error } = await supabase
      .from('playlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePlaylist(id: string): Promise<void> {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPlaylistTracks(playlistId: string): Promise<PlaylistTrack[]> {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('*, track:tracks(*)')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addTrackToPlaylist(playlistId: string, trackId: string, position: number): Promise<PlaylistTrack> {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert({ playlist_id: playlistId, track_id: trackId, position })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    const { error } = await supabase
      .from('playlist_tracks')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('track_id', trackId);

    if (error) throw error;
  }
};

// Recently Played API
export const recentlyPlayedApi = {
  async getUserRecentlyPlayed(userId: string, limit = 20): Promise<RecentlyPlayed[]> {
    const { data, error } = await supabase
      .from('recently_played')
      .select('*, track:tracks(*)')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addRecentlyPlayed(userId: string, trackId: string, progress = 0): Promise<RecentlyPlayed> {
    const { data, error } = await supabase
      .from('recently_played')
      .insert({ user_id: userId, track_id: trackId, progress })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProgress(id: string, progress: number): Promise<void> {
    const { error } = await supabase
      .from('recently_played')
      .update({ progress })
      .eq('id', id);

    if (error) throw error;
  },

  async getLastPlayed(userId: string): Promise<RecentlyPlayed | null> {
    const { data, error } = await supabase
      .from('recently_played')
      .select('*, track:tracks(*)')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};

// Favorites API
export const favoritesApi = {
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, track:tracks(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addFavorite(userId: string, trackId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, track_id: trackId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavorite(userId: string, trackId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('track_id', trackId);

    if (error) throw error;
  },

  async isFavorite(userId: string, trackId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
};

// Storage API for audio files
export const storageApi = {
  async uploadAudio(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async deleteAudio(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([path]);

    if (error) throw error;
  },

  getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(path);

    return publicUrl;
  }
};
