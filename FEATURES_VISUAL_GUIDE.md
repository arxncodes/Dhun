# Dhun Music Player - New Features Overview

## 🎵 Audio Player Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DHUN MUSIC PLAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────────────────────────┐  ┌──────────┐   │
│  │          │  │  Track Title                           │  │          │   │
│  │  Cover   │  │  Artist Name                           │  │  Volume  │   │
│  │  Image   │  │                                        │  │  Control │   │
│  │ 12x12    │  │  ❤️ Favorite    ➕ Add to Playlist    │  │          │   │
│  │          │  │                                        │  │          │   │
│  └──────────┘  └────────────────────────────────────────┘  └──────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Playback Controls                            │   │
│  │                                                                     │   │
│  │    🔀      ⏮️       ▶️/⏸️       ⏭️       🔁                        │   │
│  │  Shuffle  Previous  Play/Pause   Next    Repeat                    │   │
│  │  (Purple  (Skip or  (Toggle)   (Skip)   (Off/All/                  │   │
│  │   when    Restart)              Track    One)                      │   │
│  │  active)                                 🔂 for One                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Progress Bar                                                       │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  0:00                                                         3:45  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📋 Add to Playlist Dialog

```
┌─────────────────────────────────────────────┐
│  Add to Playlist                      ✕     │
├─────────────────────────────────────────────┤
│  Select playlists to add this track to:    │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ✅ My Favorites                      │ │
│  │     Your favorite tracks              │ │
│  ├───────────────────────────────────────┤ │
│  │  ⬜ Workout Mix                       │ │
│  │     High energy tracks                │ │
│  ├───────────────────────────────────────┤ │
│  │  ✅ Chill Vibes                       │ │
│  │     Relaxing music                    │ │
│  ├───────────────────────────────────────┤ │
│  │  ⬜ Road Trip                         │ │
│  │     Long drive playlist               │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ✅ = Track already in playlist             │
│  Click to add/remove                        │
│                                             │
│                                    [Close]  │
└─────────────────────────────────────────────┘
```

## 🎨 Admin Upload Form - Music Categories

```
┌─────────────────────────────────────────────────────────────┐
│  Upload New Track                                     ✕     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Content Type:  [Music ▼]                                  │
│                                                             │
│  Audio File:    [Choose File] track.mp3                    │
│                                                             │
│  Title:         [Amazing Song________________]             │
│                                                             │
│  Artist:        [Great Artist________________]             │
│                                                             │
│  Music Category: [Select a category ▼]                     │
│                  ┌─────────────────────────┐               │
│                  │ Phonk                   │               │
│                  │ Bollywood               │               │
│                  │ Hollywood               │               │
│                  │ Romantic                │               │
│                  │ Gym                     │               │
│                  │ Casual                  │               │
│                  │ Funny                   │               │
│                  │ Pop                     │               │
│                  │ Rock                    │               │
│                  │ Hip-Hop                 │               │
│                  │ Electronic              │               │
│                  │ Jazz                    │               │
│                  │ Classical               │               │
│                  │ ... (31 total)          │               │
│                  └─────────────────────────┘               │
│                                                             │
│  Cover Image:   [Choose File] cover.jpg                    │
│                 Upload a cover image or provide URL below  │
│                                                             │
│  Or Cover URL:  [https://example.com/cover.jpg_______]     │
│                                                             │
│                                    [Cancel]  [Upload]       │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Feature Interaction Flow

### Playing Music with New Controls

```
User Action                    System Response
───────────                    ───────────────

1. Click Play on Track    →   • Track loads into player
                               • Queue initialized with track list
                               • All controls become active

2. Click Shuffle          →   • Queue is shuffled
                               • Current track stays playing
                               • Shuffle button turns purple
                               • Original order saved

3. Click Next             →   • Next track in shuffled queue plays
                               • Progress bar resets
                               • Cover image updates

4. Click Repeat           →   • Mode changes: Off → All
                               • Repeat button turns purple
                               • Icon shows 🔁

5. Click Repeat Again     →   • Mode changes: All → One
                               • Icon changes to 🔂
                               • Current track will loop

6. Click Previous         →   • If < 3 sec: Previous track plays
                               • If > 3 sec: Current track restarts
                               • Works with shuffle/repeat

7. Track Ends             →   • If Repeat One: Restart track
                               • If Repeat All: Play next, loop at end
                               • If Off: Play next, stop at end
```

### Adding Track to Playlist

```
User Action                    System Response
───────────                    ───────────────

1. Track is Playing       →   • Plus button visible next to heart

2. Click Plus Button      →   • Dialog opens
                               • Loading spinner shows
                               • Fetches user's playlists

3. Playlists Load         →   • Shows all playlists
                               • Checks which contain current track
                               • Shows ✅ for playlists with track

4. Click Playlist         →   • If not in playlist: Adds track
                               • If in playlist: Removes track
                               • Checkmark toggles
                               • Toast notification shows

5. Click Another          →   • Same add/remove logic
                               • Multiple playlists can be updated
                               • Each action shows toast

6. Close Dialog           →   • Changes are saved
                               • Dialog closes
                               • Player continues playing
```

### Admin Uploading with Categories

```
Admin Action                   System Response
────────────                   ───────────────

1. Click Upload Track     →   • Dialog opens
                               • Form fields shown

2. Select "Music"         →   • Artist field appears
                               • Music Category dropdown appears
                               • Podcast fields hidden

3. Choose Audio File      →   • File name displays
                               • File validated

4. Fill Title & Artist    →   • Required fields filled

5. Select Category        →   • Dropdown opens
                               • 31 categories shown
                               • Select "Phonk"

6. Upload Cover Image     →   • File chooser opens
                               • Select image file
                               • File name displays

7. Click Upload           →   • Audio file uploads to storage
                               • Cover image uploads to storage
                               • Track record created with:
                                 - title, artist
                                 - music_category: 'phonk'
                                 - cover_image_url
                               • Success toast shows
                               • Form resets
                               • Track appears in library
```

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUDIO PLAYER CONTEXT                        │
│                                                                 │
│  State:                          Methods:                       │
│  • currentTrack                  • playTrack(track, list?)     │
│  • queue: Track[]                • playNext()                   │
│  • currentIndex: number          • playPrevious()               │
│  • shuffle: boolean              • toggleShuffle()              │
│  • repeatMode: 'off'|'all'|'one' • toggleRepeat()               │
│  • originalQueue: Track[]        • addToQueue(track)            │
│  • isPlaying: boolean            • removeFromQueue(index)       │
│  • audioRef: HTMLAudioElement    • clearQueue()                 │
│                                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Provides Context
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────────┐
│ AudioPlayer   │         │ Other Components │
│ Component     │         │ (Pages, Cards)   │
│               │         │                  │
│ • Controls UI │         │ • Play buttons   │
│ • Progress    │         │ • Track lists    │
│ • Volume      │         │                  │
└───────────────┘         └──────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLAYLIST MANAGEMENT                         │
│                                                                 │
│  AddToPlaylistDialog                                            │
│         │                                                       │
│         ├─→ Fetch user playlists (playlistApi.getUserPlaylists)│
│         │                                                       │
│         ├─→ Check track in playlists (playlistApi.getPlaylist  │
│         │                              Tracks for each)         │
│         │                                                       │
│         ├─→ Add track (playlistApi.addTrackToPlaylist)         │
│         │                                                       │
│         └─→ Remove track (playlistApi.removeTrackFromPlaylist) │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│                     TRACK UPLOAD FLOW                           │
│                                                                 │
│  AdminDashboardPage                                             │
│         │                                                       │
│         ├─→ Upload audio file (storageApi.uploadAudio)         │
│         │   • Generates unique filename                        │
│         │   • Returns public URL                               │
│         │                                                       │
│         ├─→ Upload cover image (storageApi.uploadAudio)        │
│         │   • If file provided                                 │
│         │   • Generates unique filename                        │
│         │   • Returns public URL                               │
│         │                                                       │
│         └─→ Create track record (trackApi.createTrack)         │
│             • title, artist/podcast_name                        │
│             • music_category (for music)                        │
│             • category (for podcasts)                           │
│             • file_url, cover_image_url                         │
│             • content_type                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema Updates

```sql
-- Music Category Enum
CREATE TYPE music_category AS ENUM (
  'phonk', 'bollywood', 'hollywood', 'romantic', 'gym',
  'casual', 'funny', 'pop', 'rock', 'hip-hop', 'electronic',
  'jazz', 'classical', 'country', 'r&b', 'indie', 'folk',
  'metal', 'blues', 'reggae', 'latin', 'k-pop', 'anime',
  'lo-fi', 'chill', 'party', 'workout', 'study', 'sleep',
  'meditation', 'other'
);

-- Tracks Table (Updated)
tracks
├── id (uuid, PK)
├── title (text)
├── artist (text, nullable)
├── podcast_name (text, nullable)
├── category (text, nullable)          ← For podcasts
├── music_category (music_category)    ← NEW: For music
├── content_type (content_type)
├── file_path (text)
├── file_url (text)
├── duration (integer, nullable)
├── cover_image_url (text, nullable)   ← Already existed
├── created_at (timestamp)
└── updated_at (timestamp)
```

## 🎨 UI Component Hierarchy

```
App
└── AudioPlayerProvider
    ├── Layout
    │   ├── Sidebar
    │   ├── Header
    │   └── Main Content
    │       ├── HomePage
    │       ├── MusicPage
    │       ├── PodcastsPage
    │       ├── PlaylistsPage
    │       └── AdminDashboardPage
    │           └── Upload Dialog
    │               ├── Content Type Selector
    │               ├── Audio File Input
    │               ├── Title Input
    │               ├── Artist/Podcast Name Input
    │               ├── Music Category Dropdown  ← NEW
    │               ├── Podcast Category Input
    │               ├── Cover Image File Input  ← NEW
    │               └── Cover Image URL Input   ← NEW
    │
    └── AudioPlayer (Fixed at bottom)
        ├── Track Info Section
        │   ├── Cover Image
        │   ├── Title & Artist
        │   ├── Favorite Button
        │   └── Add to Playlist Button  ← NEW
        │       └── AddToPlaylistDialog ← NEW
        │
        ├── Controls Section
        │   ├── Shuffle Button          ← NEW
        │   ├── Previous Button         ← NEW
        │   ├── Play/Pause Button
        │   ├── Next Button             ← NEW
        │   └── Repeat Button           ← NEW
        │
        ├── Progress Bar
        └── Volume Control
```

## 🔄 State Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   AudioPlayerContext State                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  playTrack(track, trackList)                                │
│    ↓                                                         │
│  • Set currentTrack = track                                 │
│  • Set queue = trackList || [track]                         │
│  • Set currentIndex = 0                                     │
│  • If shuffle: Apply shuffle to queue                       │
│  • Start playback                                           │
│                                                              │
│  toggleShuffle()                                            │
│    ↓                                                         │
│  • If enabling:                                             │
│    - Save originalQueue = queue                             │
│    - Shuffle queue (keep current track)                     │
│  • If disabling:                                            │
│    - Restore queue = originalQueue                          │
│  • Toggle shuffle state                                     │
│                                                              │
│  toggleRepeat()                                             │
│    ↓                                                         │
│  • Cycle: 'off' → 'all' → 'one' → 'off'                    │
│  • Update repeatMode state                                  │
│                                                              │
│  playNext()                                                 │
│    ↓                                                         │
│  • If currentIndex < queue.length - 1:                      │
│    - Increment currentIndex                                 │
│    - Play queue[currentIndex]                               │
│  • Else if repeatMode === 'all':                            │
│    - Set currentIndex = 0                                   │
│    - Play queue[0]                                          │
│                                                              │
│  playPrevious()                                             │
│    ↓                                                         │
│  • If currentTime > 3:                                      │
│    - Restart current track                                  │
│  • Else if currentIndex > 0:                                │
│    - Decrement currentIndex                                 │
│    - Play queue[currentIndex]                               │
│                                                              │
│  handleEnded()                                              │
│    ↓                                                         │
│  • If repeatMode === 'one':                                 │
│    - Restart current track                                  │
│  • Else:                                                    │
│    - Call playNext()                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🎯 Key Features Summary

| Feature | Description | Location | Status |
|---------|-------------|----------|--------|
| **Shuffle** | Randomize playback order | Audio Player | ✅ Complete |
| **Repeat** | Loop queue or single track | Audio Player | ✅ Complete |
| **Previous** | Go to previous track | Audio Player | ✅ Complete |
| **Next** | Go to next track | Audio Player | ✅ Complete |
| **Add to Playlist** | Quick add from player | Audio Player | ✅ Complete |
| **Music Categories** | 31 predefined categories | Admin Upload | ✅ Complete |
| **Cover Upload** | File or URL upload | Admin Upload | ✅ Complete |

## 📱 Responsive Design

All new features are fully responsive:

- **Desktop**: Full controls visible, hover states active
- **Tablet**: Optimized layout, touch-friendly buttons
- **Mobile**: Compact controls, mobile-optimized dialogs

---

**Version**: 2.1.0  
**Last Updated**: December 25, 2025  
**Status**: ✅ Production Ready
