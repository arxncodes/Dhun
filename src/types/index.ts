export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';
export type ContentType = 'music' | 'podcast';
export type MusicCategory = 
  | 'phonk'
  | 'bollywood'
  | 'hollywood'
  | 'romantic'
  | 'gym'
  | 'casual'
  | 'funny'
  | 'pop'
  | 'rock'
  | 'hip-hop'
  | 'electronic'
  | 'jazz'
  | 'classical'
  | 'country'
  | 'r&b'
  | 'indie'
  | 'folk'
  | 'metal'
  | 'blues'
  | 'reggae'
  | 'latin'
  | 'k-pop'
  | 'anime'
  | 'lo-fi'
  | 'chill'
  | 'party'
  | 'workout'
  | 'study'
  | 'sleep'
  | 'meditation'
  | 'other';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string | null;
  podcast_name: string | null;
  category: string | null; // For podcasts
  music_category: MusicCategory | null; // For music
  content_type: ContentType;
  file_path: string;
  file_url: string;
  duration: number | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
  track?: Track;
}

export interface RecentlyPlayed {
  id: string;
  user_id: string;
  track_id: string;
  played_at: string;
  progress: number;
  track?: Track;
}

export interface Favorite {
  id: string;
  user_id: string;
  track_id: string;
  created_at: string;
  track?: Track;
}
