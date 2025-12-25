-- Create user role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create content type enum
CREATE TYPE content_type AS ENUM ('music', 'podcast');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tracks table (for both music and podcasts)
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT,
  podcast_name TEXT,
  category TEXT,
  content_type content_type NOT NULL DEFAULT 'music',
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration INTEGER,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create playlist_tracks junction table
CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)
);

-- Create recently_played table
CREATE TABLE recently_played (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress INTEGER DEFAULT 0
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create indexes for better performance
CREATE INDEX idx_tracks_content_type ON tracks(content_type);
CREATE INDEX idx_tracks_artist ON tracks(artist);
CREATE INDEX idx_tracks_category ON tracks(category);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX idx_recently_played_user_id ON recently_played(user_id);
CREATE INDEX idx_recently_played_played_at ON recently_played(played_at DESC);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (remove @miaoda.com)
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  -- Insert profile with first user as admin
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.raw_user_meta_data->>'email',
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_played ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Public can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

-- Tracks policies (all users can read, only admins can write)
CREATE POLICY "Anyone can view tracks" ON tracks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert tracks" ON tracks
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update tracks" ON tracks
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete tracks" ON tracks
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Playlists policies
CREATE POLICY "Users can view their own playlists" ON playlists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" ON playlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Playlist tracks policies
CREATE POLICY "Users can view tracks in their playlists" ON playlist_tracks
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can add tracks to their playlists" ON playlist_tracks
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can remove tracks from their playlists" ON playlist_tracks
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
  );

-- Recently played policies
CREATE POLICY "Users can view their own recently played" ON recently_played
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their recently played" ON recently_played
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their recently played" ON recently_played
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites" ON favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favorites" ON favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);