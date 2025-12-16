# Music Streaming Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
Melody Stream

### 1.2 Application Description
A full-stack music and podcast streaming web application that allows users to stream audio content, manage playlists, and consume podcast episodes through a modern web interface, similar to Apple Music or Spotify.

### 1.3 Project Aim
To design and develop a music and podcast streaming platform using Python technologies that demonstrates real-world backend development, REST APIs, authentication, media handling, and frontend integration.\n\n## 2. Core Features\n
### 2.1 User Features
- User registration and login with authentication
- Browse music library and podcast collections
- Search functionality for tracks and podcast episodes\n- Stream audio using integrated web player with animated audio wave visualization
- Create and manage personal playlists
- Resume last played audio from previous session
- Like and favorite tracks for quick access

### 2.2 Admin Features
- Upload audio files to the platform by placing music files in a specific folder within the src code directory
- Add and edit metadata (title, artist, podcast name, category)
- Manage music and podcast content library

### 2.3 Audio Wave Animation
- Display animated audio wave visualization that responds to the music being played
- Waves animate in real-time synchronized with audio playback
- Visual feedback enhances user listening experience

## 3. Music File Management

### 3.1 File Storage Method
- Admin manually uploads music files to a designated folder in the src code (e.g., /src/assets/music or /public/music)
- Music files are stored locally within the application structure
- No external API calls for fetching music content

### 3.2 Music Rendering
- Application reads and renders music files directly from the specified folder
- Only music files uploaded by admin are displayed and available for playback in normal user interface
- File metadata is stored in database and linked to physical file location

## 4. Technical Stack

### 4.1 Frontend
- React.js or its framework
- Tailwind CSS
- HTML5 Audio API
- Web Audio API (for wave animation visualization)

### 4.2 Backend
- Python 3.10+
- Flask (REST APIs)
- Flask-JWT-Extended (Authentication)
- Flask-CORS

### 4.3 Database & Storage
- Supabase (PostgreSQL) or PostgreSQL with psycopg2/SQLAlchemy
- Local file system storage for audio files within src code structure

### 4.4 Deployment (Optional)
- Backend: Render/Railway/Fly.io\n- Frontend: Vercel/Netlify

## 5. Database Design
\n### 5.1 Database Tables
- users: Store user account information
- tracks: Store music track details, metadata, and file path reference
- podcasts: Store podcast episode information
- playlists: Store user-created playlist information\n- playlist_tracks: Manage track-playlist relationships
- recently_played: Track user listening history\n
## 6. Design Style

- Color Scheme: Deep purple (#8B5CF6) as primary color with dark background (#0F172A), complemented by vibrant accent colors for interactive elements and wave animations
- Visual Details: Smooth rounded corners (8-12px), subtle shadow effects for card elevation, minimalist icon style, fluid wave animation with gradient colors that pulse with audio frequency
- Layout: Card-based grid layout for music/podcast browsing, fixed bottom player bar with integrated wave visualizer, sidebar navigation with collapsible playlist section