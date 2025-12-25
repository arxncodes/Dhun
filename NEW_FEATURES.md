# New Features Documentation

## Overview
This document describes the new features added to Dhun music streaming application.

## Features Added

### 1. Enhanced Audio Player Controls

#### Shuffle Mode
- **Location**: Audio player bottom bar
- **Icon**: Shuffle icon (🔀)
- **Functionality**:
  - Click to toggle shuffle mode on/off
  - When enabled, the icon turns purple
  - Shuffles the current queue while keeping the current track playing
  - Maintains original queue order for when shuffle is disabled

#### Previous/Next Track Controls
- **Location**: Audio player bottom bar, on either side of play/pause button
- **Icons**: SkipBack (⏮️) and SkipForward (⏭️)
- **Functionality**:
  - **Previous**: 
    - If more than 3 seconds have played, restarts current track
    - Otherwise, plays the previous track in queue
  - **Next**: Plays the next track in queue
  - Works with shuffle and repeat modes

#### Repeat Mode
- **Location**: Audio player bottom bar
- **Icon**: Repeat (🔁) or Repeat1 (🔂)
- **Modes**:
  - **Off**: No repeat (default)
  - **All**: Repeats entire queue
  - **One**: Repeats current track
- **Functionality**:
  - Click to cycle through modes: Off → All → One → Off
  - Icon turns purple when active
  - Icon changes to Repeat1 when in "one" mode

### 2. Add to Playlist Feature

#### Add to Playlist Button
- **Location**: Audio player, next to the heart (favorite) button
- **Icon**: Plus (+)
- **Functionality**:
  - Opens a dialog showing all user playlists
  - Allows adding/removing current track to/from playlists
  - Shows checkmark for playlists that already contain the track

#### Add to Playlist Dialog
- **Features**:
  - Lists all user playlists
  - Shows playlist name and description
  - Click to add/remove track
  - Visual feedback with checkmark for added tracks
  - Loading state while fetching playlists
  - Empty state with link to create playlist
  - Toast notifications for success/error

### 3. Music Categories

#### Category System
- **For Music Tracks**: Predefined enum categories
- **For Podcasts**: Free-text category field

#### Available Music Categories
1. **Genre-based**:
   - Phonk
   - Bollywood
   - Hollywood
   - Pop
   - Rock
   - Hip-Hop
   - Electronic
   - Jazz
   - Classical
   - Country
   - R&B
   - Indie
   - Folk
   - Metal
   - Blues
   - Reggae
   - Latin
   - K-Pop
   - Anime

2. **Mood/Activity-based**:
   - Romantic
   - Gym/Workout
   - Casual
   - Funny
   - Lo-Fi
   - Chill
   - Party
   - Study
   - Sleep
   - Meditation

3. **Other**: For uncategorized music

#### Admin Upload Form
- **Music Category Selector**: Dropdown with all available categories
- **Podcast Category**: Text input for custom categories
- **Conditional Display**: Shows appropriate field based on content type

### 4. Cover Image Upload

#### Upload Methods
1. **File Upload**: Upload image file directly
2. **URL Input**: Provide image URL

#### Admin Upload Form
- **Cover Image File Input**: 
  - Accepts image files (jpg, png, gif, etc.)
  - Uploads to Supabase storage
  - Generates public URL automatically
  
- **Cover Image URL Input**:
  - Alternative to file upload
  - Accepts any valid image URL
  - Useful for external images

#### Image Display
- **Audio Player**: Shows cover image (12x12 rounded)
- **Track Cards**: Shows cover image on music/podcast cards
- **Playlist Views**: Shows cover image in track lists

## Technical Implementation

### Database Changes

#### New Column: `music_category`
```sql
CREATE TYPE music_category AS ENUM (
  'phonk', 'bollywood', 'hollywood', 'romantic', 'gym', 
  'casual', 'funny', 'pop', 'rock', 'hip-hop', 'electronic',
  'jazz', 'classical', 'country', 'r&b', 'indie', 'folk',
  'metal', 'blues', 'reggae', 'latin', 'k-pop', 'anime',
  'lo-fi', 'chill', 'party', 'workout', 'study', 'sleep',
  'meditation', 'other'
);

ALTER TABLE tracks ADD COLUMN music_category music_category;
```

#### Column Usage
- `category`: Text field for podcast categories
- `music_category`: Enum field for music categories

### Context Updates

#### AudioPlayerContext
**New State**:
- `queue`: Array of tracks in playback queue
- `currentIndex`: Current track position in queue
- `shuffle`: Boolean for shuffle mode
- `repeatMode`: 'off' | 'all' | 'one'
- `originalQueue`: Backup of queue before shuffle

**New Methods**:
- `playTrack(track, trackList?)`: Play track with optional queue
- `playNext()`: Play next track in queue
- `playPrevious()`: Play previous track or restart current
- `toggleShuffle()`: Toggle shuffle mode
- `toggleRepeat()`: Cycle through repeat modes
- `addToQueue(track)`: Add track to end of queue
- `removeFromQueue(index)`: Remove track from queue
- `clearQueue()`: Clear entire queue

### Component Updates

#### AudioPlayer Component
**New Controls**:
- Shuffle button (left side)
- Previous button
- Next button
- Repeat button (right side)
- Add to playlist button (track info section)

**Layout**:
```
[Track Info + Heart + Plus] [Shuffle | Prev | Play/Pause | Next | Repeat] [Volume]
```

#### AddToPlaylistDialog Component
**Props**:
- `track`: Current track to add
- `open`: Dialog open state
- `onOpenChange`: Callback for state change

**Features**:
- Fetches user playlists on open
- Checks which playlists contain the track
- Handles add/remove operations
- Shows loading and empty states

#### AdminDashboardPage Updates
**New Form Fields**:
- Music category dropdown (for music)
- Podcast category text input (for podcasts)
- Cover image file upload
- Cover image URL input

**Upload Logic**:
- Uploads cover image file to storage if provided
- Falls back to URL if no file uploaded
- Saves music_category for music tracks
- Saves category for podcast tracks

### Type Updates

#### Track Interface
```typescript
export interface Track {
  // ... existing fields
  category: string | null; // For podcasts
  music_category: MusicCategory | null; // For music
  cover_image_url: string | null;
}
```

#### MusicCategory Type
```typescript
export type MusicCategory = 
  | 'phonk' | 'bollywood' | 'hollywood' | 'romantic'
  | 'gym' | 'casual' | 'funny' | 'pop' | 'rock'
  | 'hip-hop' | 'electronic' | 'jazz' | 'classical'
  | 'country' | 'r&b' | 'indie' | 'folk' | 'metal'
  | 'blues' | 'reggae' | 'latin' | 'k-pop' | 'anime'
  | 'lo-fi' | 'chill' | 'party' | 'workout' | 'study'
  | 'sleep' | 'meditation' | 'other';
```

## User Guide

### Using Shuffle and Repeat

1. **Enable Shuffle**:
   - Click the shuffle button in the audio player
   - Button turns purple when active
   - Queue is shuffled while keeping current track

2. **Use Repeat**:
   - Click repeat button to cycle modes
   - Off → All (repeat queue) → One (repeat track) → Off
   - Button turns purple when active

3. **Navigate Tracks**:
   - Click previous/next buttons to navigate queue
   - Previous restarts track if > 3 seconds played
   - Works with shuffle and repeat modes

### Adding Tracks to Playlists

1. **From Audio Player**:
   - Play any track
   - Click the + button next to the heart icon
   - Select playlists to add/remove track
   - Checkmark shows playlists containing the track

2. **Managing Playlist Tracks**:
   - Click playlist name to toggle add/remove
   - Toast notification confirms action
   - Changes are immediate

### Admin: Uploading with Categories and Cover Images

1. **Select Content Type**:
   - Choose "Music" or "Podcast"

2. **Upload Audio File**:
   - Click "Choose File" and select audio

3. **Add Metadata**:
   - Enter title (required)
   - Enter artist (for music) or podcast name (for podcasts)

4. **Select Category**:
   - **For Music**: Choose from dropdown (phonk, bollywood, etc.)
   - **For Podcasts**: Type custom category

5. **Add Cover Image**:
   - **Option 1**: Upload image file
   - **Option 2**: Paste image URL
   - File upload takes precedence over URL

6. **Upload**:
   - Click "Upload" button
   - Wait for success notification
   - Track appears in library with cover image and category

## Best Practices

### For Users
- Create playlists before adding tracks for easier organization
- Use shuffle for variety in long playlists
- Use repeat one for favorite tracks
- Use repeat all for continuous playback

### For Admins
- Always add cover images for better visual experience
- Choose appropriate categories for better discoverability
- Use high-quality images (recommended: 500x500px or larger)
- Keep image file sizes reasonable (< 1MB recommended)
- Use descriptive podcast categories

## Troubleshooting

### Shuffle Not Working
- Ensure you have multiple tracks in the queue
- Try toggling shuffle off and on again
- Check that tracks are loaded properly

### Add to Playlist Button Not Showing
- Ensure you're logged in
- Ensure a track is currently playing
- Check that you have created at least one playlist

### Cover Image Not Displaying
- Verify image URL is accessible
- Check image file format (jpg, png, gif supported)
- Ensure image uploaded successfully
- Try re-uploading or using a different image

### Category Not Saving
- For music: Ensure you selected a category from dropdown
- For podcasts: Category is optional
- Check that upload completed successfully

## Future Enhancements

Potential features for future releases:
- Queue management UI (view, reorder, clear queue)
- Category filtering on music/podcast pages
- Smart playlists based on categories
- Bulk category assignment
- Cover image editing/cropping
- Auto-fetch cover images from metadata
- Category-based recommendations
- Playlist cover image customization

---

**Last Updated**: December 25, 2025
**Version**: 2.1.0
