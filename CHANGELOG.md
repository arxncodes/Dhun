# Changelog

All notable changes to Dhun will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-12-25

### Added
- **Wave Animation Toggle**
  - Toggle button to switch between vertical and horizontal wave animations
  - Waves icon button positioned next to volume controls
  - Icon rotates 90° to indicate current orientation
  - Smooth CSS transform animations for both modes
  - Horizontal waves: 40 bars animating left-to-right with scaleX
  - Vertical waves: 40 bars animating up-and-down with scaleY (default)
  - Tooltip shows current wave orientation
  - No interruption to music playback when switching modes

### Changed
- Enhanced `AudioWaveVisualizer` component to support orientation prop
- Updated `AudioPlayer.tsx` with wave orientation state management
- Added new CSS animation for horizontal wave mode

### Technical
- Added `wave-bar-horizontal` CSS class with scaleX animation
- Added `@keyframes wave-horizontal` animation definition
- Imported Waves icon from lucide-react
- TypeScript type: `'vertical' | 'horizontal'`
- No new dependencies required

## [2.1.0] - 2025-12-25

### Added
- **Collapsible Audio Player**
  - Toggle button in upper right corner with ChevronDown/ChevronUp icons
  - Smooth slide-down/slide-up animations (300ms transition)
  - Mini player mode showing track cover, title, artist, and play/pause button
  - Music continues playing seamlessly when collapsed
  - Space-saving design for better content browsing
  
- **Credits & About Page**
  - Comprehensive developer information section
  - Project details and purpose
  - Technology stack showcase with icons
  - 12 key features highlighted
  - Credits and acknowledgments section
  - Accessible via Info icon in sidebar navigation
  - Route: `/credits`
  
- **GitHub Pages Deployment Support**
  - Automated CI/CD via GitHub Actions workflow
  - Dynamic base path configuration in `vite.config.ts`
  - SPA routing support with 404.html redirect system
  - `.nojekyll` file to prevent Jekyll processing
  - Comprehensive deployment documentation
  - Quick setup guide for easy deployment
  - Environment variables support via GitHub Secrets
  - Custom domain configuration support

### Changed
- Updated `AudioPlayer.tsx` with collapsible functionality
- Enhanced `MainLayout.tsx` navigation with Credits link
- Updated `routes.tsx` to include Credits page route
- Modified `vite.config.ts` for GitHub Pages compatibility
- Updated `index.html` with SPA redirect script
- Bumped version to 2.1.0 in README.md

### Documentation
- Added `GITHUB_PAGES_DEPLOYMENT.md` - Comprehensive deployment guide
- Added `GITHUB_PAGES_QUICK_SETUP.md` - Quick 3-step setup guide
- Added `NEW_FEATURES_SUMMARY.md` - Detailed feature documentation
- Added `TODO_NEW_FEATURES.md` - Feature implementation tracking
- Updated `README.md` with new features and deployment instructions

### Technical
- No new dependencies added
- Leveraged existing Lucide React icons (ChevronDown, ChevronUp, Info)
- Used existing shadcn/ui components for Credits page
- Maintained TypeScript type safety
- All code passes lint checks (89 files, 0 errors)
- Production-ready build configuration

## [2.0.0] - 2025-12-24

### Added
- Enhanced audio player with queue management
- Shuffle and repeat modes (off, all, one)
- Playlist management system
- Add to playlist functionality
- Music categories (31 types)
- Cover image upload for tracks
- Audio wave visualization
- Recently played tracking
- Favorites system
- Advanced search functionality

### Changed
- Improved audio player UI/UX
- Enhanced admin dashboard
- Better responsive design
- Optimized database queries

### Fixed
- Audio playback issues
- Playlist synchronization
- Theme persistence
- Mobile navigation

## [1.0.0] - 2025-12-20

### Added
- Initial release
- Music and podcast streaming
- User authentication (username-based)
- Admin dashboard
- Light/Dark theme support
- Responsive design
- Supabase backend integration
- Basic audio player
- Search functionality
- User profiles

### Features
- Browse music and podcasts
- Play audio content
- Create user accounts
- Admin content management
- Theme switching
- Mobile-friendly interface

---

## Version History

- **2.2.0** (2025-12-25) - Wave animation toggle (vertical/horizontal modes)
- **2.1.0** (2025-12-25) - Collapsible player, Credits page, GitHub Pages support
- **2.0.0** (2025-12-24) - Enhanced player, playlists, categories, queue management
- **1.0.0** (2025-12-20) - Initial release with core features

## Upgrade Guide

### From 2.1.0 to 2.2.0

No breaking changes. All existing features remain functional.

**New Features Available:**
1. Click the wave icon button (next to volume controls) to toggle wave orientation
2. Choose between vertical (default) or horizontal wave animations
3. Icon rotates to indicate current mode

**For Developers:**
- Review `WAVE_ANIMATION_FEATURE.md` for technical details
- No database migrations required
- No environment variable changes needed
- No new dependencies added

### From 2.0.0 to 2.1.0

No breaking changes. All existing features remain functional.

**New Features Available:**
1. Click the chevron button in the audio player to collapse/expand
2. Visit `/credits` page to view developer information
3. Deploy to GitHub Pages using the provided workflow

**For Developers:**
- Review `GITHUB_PAGES_DEPLOYMENT.md` for deployment options
- Check `NEW_FEATURES_SUMMARY.md` for technical details
- No database migrations required
- No environment variable changes needed

## Future Roadmap

### Planned Features (v2.3.0)
- [ ] Persist wave orientation preference (localStorage)
- [ ] Additional wave visualization modes (circular, radial)
- [ ] Keyboard shortcuts for player control
- [ ] User preferences for player state
- [ ] Enhanced queue visualization
- [ ] Drag-and-drop playlist reordering
- [ ] Social sharing features
- [ ] Collaborative playlists

### Under Consideration
- [ ] PWA support with offline playback
- [ ] Lyrics display
- [ ] Equalizer controls
- [ ] Podcast chapters support
- [ ] Sleep timer
- [ ] Crossfade between tracks
- [ ] Gapless playback
- [ ] Audio normalization
- [ ] Custom wave colors and themes
- [ ] Reduced motion support for accessibility

## Support

For issues, questions, or feature requests:
1. Check the documentation files
2. Review the troubleshooting section in README.md
3. Open an issue on GitHub (if applicable)

## Contributors

- Development Team - Initial work and ongoing maintenance
- Community - Bug reports and feature suggestions

## License

Copyright © 2025 Dhun. All rights reserved.

---

**Last Updated**: December 25, 2025  
**Current Version**: 2.1.0  
**Status**: Stable
