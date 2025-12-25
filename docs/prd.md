# Music Streaming Web Application Requirements Document\n
## 1. Application Overview

### 1.1 Application Name
Melody Stream

### 1.2 Application Description\nA full-stack music and podcast streaming web application that allows users to stream audio content, manage playlists, and consume podcast episodes through a modern web interface, similar to Apple Music or Spotify.

### 1.3 Project Aim
To design and develop a music and podcast streaming platform using Python technologies that demonstrates real-world backend development, REST APIs, authentication, media handling, and frontend integration.

## 2. Core Features

### 2.1 User Features
- User registration and login with authentication\n- Browse music library and podcast collections
- Search functionality for tracks and podcast episodes
- Stream audio using integrated web player with animated audio wave visualization
- Create and manage personal playlists
- Add currently playing music to specific playlist via popup selection box
- Shuffle playback mode for randomized track order
- Queue management to view and reorder upcoming tracks
- Loop feature with options: loop single track, loop playlist, or no loop
- Resume last played audio from previous session
- Like and favorite tracks for quick access\n- Browse music by categories (phonk, Bollywood, Hollywood, romantic, gym-musics, casual, funny, etc.)
- View developer details and credits page

### 2.2 Admin Features
- Upload audio files to the platform by placing music files in a specific folder within the src code directory
- Upload cover picture/artwork for each music track
- Add and edit metadata (title, artist, podcast name, category)
- Assign music to categories (phonk, Bollywood, Hollywood, romantic, gym-musics, casual, funny, and more)
- Manage music and podcast content library\n
### 2.3 Audio Wave Animation
- Display animated audio wave visualization that responds to the music being played
- Waves animate in real-time synchronized with audio playback
- Visual feedback enhances user listening experience

### 2.4 Music Player Controls
- Add to Playlist button: Opens a popup box displaying user's existing playlists for selection\n- Shuffle button: Enables random playback order
- Queue button: Shows upcoming tracks with drag-to-reorder functionality
- Loop button: Cycles through loop modes (single track / playlist / off)\n- Hide/Show toggle: Arrow button in the right upper corner of mini player to hide the player interface with slide-down animation while music continues playing in background; arrow button appears to bring player back with slide-up animation
\n### 2.5 Developer Credits Page
- Dedicated page accessible to normal users displaying developer information\n- Shows project credits, contributor details, and acknowledgments
- Accessible via navigation menu or footer link

## 3. Music File Management

### 3.1 File Storage Method
- Admin manually uploads music files to a designated folder in the src code (e.g., /src/assets/music or /public/music)
- Admin uploads cover pictures to a designated folder (e.g., /src/assets/covers or /public/covers)
- Music files and cover images are stored locally within the application structure
- No external API calls for fetching music content

### 3.2 Music Rendering
- Application reads and renders music files directly from the specified folder
- Cover pictures are displayed alongside track information in library and player interface
- Only music files uploaded by admin are displayed and available for playback in normal user interface
- File metadata is stored in database and linked to physical file location

### 3.3 Music Categories\n- Categories include: phonk, Bollywood, Hollywood, romantic, gym-musics, casual, funny, and other relevant genres
- Users can filter and browse music by category
- Each track can be assigned to one or multiple categories
\n## 4. Technical Stack\n
### 4.1 Frontend
- React.js or its framework
- Tailwind CSS
- HTML5 Audio API
- Web Audio API (for wave animation visualization)
\n### 4.2 Backend
- Python 3.10+
- Flask (REST APIs)
- Flask-JWT-Extended (Authentication)
- Flask-CORS

### 4.3 Database & Storage
- Supabase (PostgreSQL) or PostgreSQL with psycopg2/SQLAlchemy\n- Local file system storage for audio files and cover images within src code structure

### 4.4 Deployment\n- Backend: Render/Railway/Fly.io
- Frontend: Vercel/Netlify/GitHub Pages
- GitHub Pages compatibility: Configure build settings for static site deployment, ensure proper routing with HashRouter or custom404.html handling for client-side routing

## 5. Database Design
\n### 5.1 Database Tables
- users: Store user account information
- tracks: Store music track details, metadata, file path reference, and cover image path
- categories: Store music category information (phonk, Bollywood, Hollywood, romantic, gym-musics, casual, funny, etc.)
- track_categories: Manage track-category relationships (many-to-many)
- podcasts: Store podcast episode information
- playlists: Store user-created playlist information
- playlist_tracks: Manage track-playlist relationships
- recently_played: Track user listening history
- queue: Store user's current playback queue and order

## 6. Design Style

- Color Scheme: Deep purple (#8B5CF6) as primary color with dark background (#0F172A), complemented by vibrant accent colors for interactive elements and wave animations
- Visual Details: Smooth rounded corners (8-12px), subtle shadow effects for card elevation, minimalist icon style, fluid wave animation with gradient colors that pulse with audio frequency, slide-down/slide-up animations (300ms duration with ease-in-out timing) for mini player hide/show transitions
- Layout: Card-based grid layout for music/podcast browsing with cover artwork display, fixed bottom player bar with integrated wave visualizer and playback controls (shuffle, queue, loop, add to playlist, hide/show arrow), sidebar navigation with collapsible playlist section and category filters, dedicated credits page with centered content layout