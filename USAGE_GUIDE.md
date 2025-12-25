# Dhun - Music & Podcast Streaming Platform

A full-featured music and podcast streaming web application built with React, TypeScript, and Supabase.

## Features

### User Features
- 🎵 **Music Streaming** - Browse and stream music tracks with a modern interface
- 🎙️ **Podcast Streaming** - Listen to podcast episodes
- 🔍 **Search** - Search across all music and podcasts
- ❤️ **Favorites** - Like and save your favorite tracks
- 🕐 **Recently Played** - View your listening history
- 📝 **Playlists** - Create and manage custom playlists
- 🎨 **Audio Wave Visualization** - Real-time animated audio wave display
- 🌓 **Light/Dark Theme** - Toggle between light and dark modes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

### Admin Features
- 📤 **Upload Tracks** - Upload music and podcast files to Supabase Storage
- ✏️ **Manage Metadata** - Edit track information (title, artist, category, etc.)
- 👥 **User Management** - Manage user roles and permissions
- 📊 **Dashboard** - View statistics and manage content library

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **HTML5 Audio API** - Audio playback
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage for audio files
  - Row Level Security (RLS)

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. The application is pre-configured with Supabase credentials

4. Start the development server:
```bash
npm run dev -- --host 127.0.0.1
```

5. Open your browser and navigate to the local development URL

## Usage

### First Time Setup

1. **Register an Account**
   - Click "Sign up" on the login page
   - Enter a username (letters, numbers, and underscores only)
   - Create a password (minimum 6 characters)
   - The first registered user automatically becomes an admin

2. **Login**
   - Enter your username and password
   - Click "Sign In"

### For Regular Users

- **Browse Music**: Navigate to the Music page to see all available tracks
- **Browse Podcasts**: Visit the Podcasts page for podcast episodes
- **Search**: Use the search page to find specific tracks or podcasts
- **Play Audio**: Click on any track to start playback
- **Like Tracks**: Click the heart icon in the player to add to favorites
- **Create Playlists**: Go to Playlists and click "Create Playlist"
- **View History**: Check Recently Played to see your listening history

### For Admins

1. **Access Admin Dashboard**
   - Click "Admin Dashboard" in the sidebar
   - Only visible to users with admin role

2. **Upload Tracks**
   - Click "Upload Track" button
   - Select content type (Music or Podcast)
   - Choose an audio file
   - Fill in metadata (title, artist/podcast name, category)
   - Optionally add a cover image URL
   - Click "Upload"

3. **Manage Users**
   - Go to the "Users" tab in the admin dashboard
   - Change user roles between "user" and "admin"

4. **Manage Tracks**
   - View all uploaded tracks in the "Tracks" tab
   - Delete tracks as needed

## Audio Player Controls

- **Play/Pause**: Click the play button to start or pause playback
- **Seek**: Drag the progress bar to jump to a specific time
- **Volume**: Adjust volume with the volume slider
- **Mute**: Click the volume icon to mute/unmute
- **Like**: Click the heart icon to add to favorites
- **Wave Visualization**: Animated bars respond to audio playback

## Database Schema

### Tables
- **profiles** - User profiles with roles
- **tracks** - Music and podcast tracks
- **playlists** - User-created playlists
- **playlist_tracks** - Playlist-track relationships
- **recently_played** - User listening history
- **favorites** - User favorite tracks

### Storage
- **audio-files** - Bucket for storing audio files

## Authentication

- Username-based authentication (no email required)
- Passwords stored securely with Supabase Auth
- First registered user becomes admin automatically
- Session management with automatic token refresh

## Security

- Row Level Security (RLS) enabled on all tables
- Admins have full access to tracks and user management
- Users can only access their own playlists, favorites, and history
- Audio files stored in public bucket for streaming

## Sample Data

The application comes with sample tracks for testing:
- 6 music tracks across different genres (Electronic, Jazz, Rock, Classical, Pop, Hip Hop)
- 4 podcast episodes on various topics (Technology, Self Improvement, Business, Health)

## Design

- **Color Scheme**: Deep purple (#8B5CF6) primary color with dark background (#0F172A)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Layout**: Card-based grid for content, sidebar navigation, bottom audio player
- **Animations**: Smooth transitions and audio wave visualization

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- Audio files must be uploaded by admins through the dashboard
- No offline playback support
- No queue management (plays one track at a time)
- Cover images must be provided as URLs

## Future Enhancements

- Playlist sharing
- Social features (follow users, share tracks)
- Advanced search filters
- Audio quality settings
- Download for offline listening
- Queue management
- Shuffle and repeat modes
- Lyrics display
- Artist pages
- Genre browsing

## License

Copyright 2025 Dhun

## Support

For issues or questions, please contact the development team.
