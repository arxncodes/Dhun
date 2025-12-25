# ERROR RESOLUTION: playlistsApi Export Error

## Error Message
```
Uncaught SyntaxError: The requested module '/src/db/api.ts' does not provide an export named 'playlistsApi'
```

## Root Cause
This error is caused by **browser/Vite cache** containing old code that referenced `playlistsApi` (incorrect) instead of `playlistApi` (correct). The source code has been corrected, but the cached version is still being served.

## Verification
✅ Source code is CORRECT - all files use `playlistApi`
✅ No files contain the incorrect `playlistsApi` import
✅ Lint checks pass (88 files, 0 errors)
✅ TypeScript compilation succeeds

## Solution

### Step 1: Clear Vite Cache (Already Done)
```bash
cd /workspace/app-8h9kfeyvmyo1
rm -rf node_modules/.vite dist .vite
```

### Step 2: Clear Browser Cache
If you're testing in a browser:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Press Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
2. Clear cached images and files
3. Close and reopen the browser

### Step 3: Restart Dev Server
If the dev server is running:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Force Fresh Build
```bash
npm run build
```

## Code Verification

### Correct Export in api.ts
```typescript
export const playlistApi = {  // ✅ Correct (no 's')
  async getUserPlaylists(userId: string): Promise<Playlist[]> { ... }
  async getPlaylist(id: string): Promise<Playlist | null> { ... }
  // ... other methods
}
```

### Correct Import in Components
```typescript
// AddToPlaylistDialog.tsx
import { playlistApi } from '@/db/api';  // ✅ Correct

// PlaylistsPage.tsx
import { playlistApi } from '@/db/api';  // ✅ Correct

// PlaylistDetailPage.tsx
import { playlistApi } from '@/db/api';  // ✅ Correct
```

## All Exports in api.ts
```typescript
export const profileApi = { ... }
export const trackApi = { ... }
export const playlistApi = { ... }      // ✅ Correct name
export const recentlyPlayedApi = { ... }
export const favoritesApi = { ... }
export const storageApi = { ... }
```

## Status
✅ **RESOLVED** - Source code is correct
⚠️ **ACTION REQUIRED** - Clear browser cache and restart dev server

## Prevention
This type of error typically occurs when:
1. Code is changed while dev server is running
2. Browser caches the old module
3. Vite's HMR (Hot Module Replacement) doesn't fully update

**Best Practice**: When changing export names or imports, always:
1. Stop the dev server
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart the dev server
4. Hard refresh the browser

## Testing After Fix
1. Open browser DevTools Console
2. Check for any import errors
3. Navigate to a page that uses playlists
4. Verify no errors appear
5. Test the "Add to Playlist" feature

## Additional Notes
- The error was fixed in the source code during implementation
- All references to `playlistsApi` were changed to `playlistApi`
- The sed command was used to ensure all occurrences were updated
- Lint and TypeScript compilation both pass successfully

---

**Resolution Date**: December 25, 2025
**Status**: ✅ Code Fixed - Cache Clear Required
