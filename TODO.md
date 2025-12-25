# Task: Add Bulk Music Upload Feature to Admin Dashboard

## Plan

- [x] Step 1: Create BulkUploadDialog component (Completed)
  - [x] Add upload mode toggle (Single/Bulk)
  - [x] Create bulk upload form with group-level fields
  - [x] Add multiple file selection support
  - [x] Add single cover image upload for all tracks
  - [x] Display selected files list with individual titles

- [x] Step 2: Add bulk upload API function (Completed)
  - [x] Create bulkCreateTracks function in trackApi
  - [x] Handle multiple file uploads in parallel
  - [x] Apply group metadata to all tracks

- [x] Step 3: Update AdminDashboardPage (Completed)
  - [x] Add upload mode state (single/bulk)
  - [x] Integrate BulkUploadDialog component
  - [x] Add bulk upload handler function
  - [x] Update UI to show upload mode toggle

- [x] Step 4: Testing and validation (Completed)
  - [x] Run lint check - All passed!

## Implementation Summary

### Features Implemented:

1. **BulkUploadDialog Component** (src/components/BulkUploadDialog.tsx)
   - Two-tab interface: Single Upload and Bulk Upload
   - Single upload maintains all original functionality (music/podcast support)
   - Bulk upload features:
     - Multiple audio file selection
     - Group name and description fields (optional)
     - Artist name (required, applies to all)
     - Music category (required, applies to all)
     - Single cover image upload (applies to all tracks)
     - Editable track titles for each file
     - Visual file list with remove buttons
     - Real-time file count in upload button

2. **API Enhancement** (src/db/api.ts)
   - Added `bulkCreateTracks()` function
   - Supports batch insertion of multiple tracks
   - Returns array of created tracks

3. **Admin Dashboard Integration** (src/pages/AdminDashboardPage.tsx)
   - Replaced old inline dialog with BulkUploadDialog component
   - Added `handleSingleUpload()` function
   - Added `handleBulkUpload()` function with parallel file uploads
   - Cover image uploaded first, then applied to all tracks
   - Progress feedback during upload
   - Success/error toasts with track count

### User Experience:

**Single Upload Mode:**
- Same as before - upload one track at a time
- Supports both music and podcasts
- Individual metadata for each track

**Bulk Upload Mode:**
- Select multiple audio files at once
- Set common metadata (artist, category)
- Upload one cover image for all
- Edit individual track titles
- Upload all with one click
- See progress and confirmation

### Technical Details:

- Parallel file uploads using Promise.all
- Unique timestamps for file naming
- Proper error handling and validation
- Clean component separation
- Type-safe interfaces
- Responsive dialog with scrollable content
