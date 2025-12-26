# Melody Stream - Project Structure

## 📁 Directory Structure

```
melody-stream/
├── 📄 Documentation
│   ├── README.md                           # Main project documentation
│   ├── CHANGELOG.md                        # Version history
│   ├── TODO.md                             # Current tasks
│   ├── AUDIO_PLAYBACK_FIX.md              # Audio playback fix details
│   ├── SEARCH_FIX.md                       # Search functionality fix
│   ├── REAL_WAVEFORM_IMPLEMENTATION.md    # Waveform feature documentation
│   ├── WAVEFORM_UPGRADE_SUMMARY.md        # Waveform upgrade summary
│   ├── DEVELOPER_CREDITS_SUMMARY.md       # Developer information
│   └── BULK_UPLOAD_GUIDE.md               # Bulk upload guide
│
├── 📂 src/                                 # Source code
│   ├── components/                         # React components
│   │   ├── layouts/                        # Layout components
│   │   │   ├── AppLayout.tsx              # Main app layout
│   │   │   └── Sidebar.tsx                # Sidebar navigation
│   │   ├── ui/                            # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (other UI components)
│   │   ├── AudioPlayer.tsx                # Audio player component
│   │   ├── RealAudioWaveform.tsx          # Real waveform visualization
│   │   └── ... (other components)
│   │
│   ├── contexts/                           # React contexts
│   │   └── AudioPlayerContext.tsx         # Audio player state management
│   │
│   ├── db/                                 # Database layer
│   │   ├── api.ts                         # Supabase API functions
│   │   └── supabase.ts                    # Supabase client
│   │
│   ├── hooks/                              # Custom React hooks
│   │   └── use-debounce.ts                # Debounce hook
│   │
│   ├── pages/                              # Page components
│   │   ├── HomePage.tsx                   # Home page
│   │   ├── SearchPage.tsx                 # Search page
│   │   ├── LibraryPage.tsx                # Library page
│   │   ├── PlaylistsPage.tsx              # Playlists page
│   │   ├── FavoritesPage.tsx              # Favorites page
│   │   ├── RecentlyPlayedPage.tsx         # Recently played page
│   │   ├── AdminPage.tsx                  # Admin page
│   │   └── CreditsPage.tsx                # Credits page
│   │
│   ├── types/                              # TypeScript types
│   │   └── types.ts                       # Type definitions
│   │
│   ├── lib/                                # Utility libraries
│   │   └── utils.ts                       # Utility functions
│   │
│   ├── App.tsx                            # Main app component
│   ├── routes.tsx                         # Route definitions
│   ├── index.css                          # Global styles
│   └── main.tsx                           # App entry point
│
├── 📂 public/                              # Public assets
│   └── music/                             # Music files directory
│       ├── sample-track-1.mp3
│       ├── sample-track-2.mp3
│       └── ... (uploaded music files)
│
├── 📂 supabase/                            # Supabase configuration
│   ├── migrations/                        # Database migrations
│   └── config.toml                        # Supabase config
│
├── 📂 node_modules/                        # Dependencies (not in git)
├── 📂 dist/                                # Build output (not in git)
│
├── 📄 Configuration Files
│   ├── package.json                       # NPM dependencies
│   ├── pnpm-lock.yaml                     # Lock file
│   ├── tsconfig.json                      # TypeScript config
│   ├── vite.config.ts                     # Vite config
│   ├── tailwind.config.mjs                # Tailwind CSS config
│   ├── postcss.config.js                  # PostCSS config
│   └── eslint.config.js                   # ESLint config
│
└── 📄 Other Files
    ├── .gitignore                         # Git ignore rules
    └── index.html                         # HTML entry point
```

## 🎯 Key Directories

### `/src/components`
Contains all React components including:
- **layouts/**: Layout components (AppLayout, Sidebar)
- **ui/**: shadcn/ui components (Button, Card, Dialog, etc.)
- **AudioPlayer.tsx**: Main audio player component
- **RealAudioWaveform.tsx**: Real-time waveform visualization

### `/src/pages`
Contains all page components:
- **HomePage**: Main landing page with featured content
- **SearchPage**: Search functionality with filters
- **LibraryPage**: User's music library
- **PlaylistsPage**: Playlist management
- **FavoritesPage**: Liked/favorited tracks
- **RecentlyPlayedPage**: Recently played history
- **AdminPage**: Admin panel for content management
- **CreditsPage**: Developer credits and information

### `/src/contexts`
Contains React context providers:
- **AudioPlayerContext**: Global audio player state management

### `/src/db`
Contains database layer:
- **api.ts**: Supabase API functions (CRUD operations)
- **supabase.ts**: Supabase client configuration

### `/public/music`
Contains uploaded music files:
- Admin uploads music files here
- Files are served directly from this directory
- Supported formats: MP3, WAV, OGG

### `/supabase`
Contains Supabase configuration:
- **migrations/**: Database schema migrations
- **config.toml**: Supabase project configuration

## 🧹 Cleaned Up

The following unnecessary files have been removed:
- ✅ 33 redundant documentation files
- ✅ Backup files (*.backup, *.bak)
- ✅ Temporary files (*.tmp, *.temp)
- ✅ Old files (*.old, *.orig)
- ✅ Cache files (__pycache__, *.pyc)
- ✅ System files (.DS_Store, Thumbs.db)

## 📦 Dependencies

### Main Dependencies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Supabase**: Backend & database
- **WaveSurfer.js**: Audio waveform visualization
- **Lucide React**: Icons
- **React Router**: Routing

### Dev Dependencies
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

## 📝 Notes

- All music files must be placed in `/public/music/` directory
- Database schema is managed through Supabase migrations
- UI components follow shadcn/ui conventions
- Color scheme uses deep purple (#8B5CF6) as primary color
- Dark mode is enabled by default

---

**Last Updated**: December 26, 2024
**Version**: 2.1.0
**Developer**: Aryan
