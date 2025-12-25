# Bulk Music Upload Feature - User Guide

## Overview

The admin dashboard now supports both **Single Upload** and **Bulk Upload** modes, allowing you to upload multiple music tracks at once with shared metadata.

## How to Access

1. Log in as an admin user
2. Navigate to the Admin Dashboard
3. Click the "Upload Music" button in the top-right corner

## Upload Modes

### Single Upload Mode

**Use when:** You want to upload one track at a time with unique metadata

**Features:**
- Upload one audio file
- Choose content type (Music or Podcast)
- Set individual title, artist, category
- Upload or provide URL for cover image
- Full control over each track's metadata

**Steps:**
1. Click "Single Upload" tab
2. Select content type (Music/Podcast)
3. Choose audio file
4. Enter track title
5. Enter artist name (for music) or podcast name (for podcasts)
6. Select music category or enter podcast category
7. Upload cover image or provide URL
8. Click "Upload"

---

### Bulk Upload Mode ⭐ NEW

**Use when:** You want to upload multiple tracks from the same artist/album/collection

**Features:**
- Upload multiple audio files at once
- Set common artist name for all tracks
- Set common music category for all tracks
- Upload ONE cover image that applies to ALL tracks
- Edit individual track titles
- Optional group name and description for organization
- See file count in upload button

**Steps:**

1. **Click "Bulk Upload" tab**

2. **Select Multiple Audio Files**
   - Click "Audio Files (Multiple)" input
   - Select multiple audio files from your computer
   - All selected files will appear in a list

3. **Review and Edit Track Titles**
   - Each file is shown with its filename
   - Default title is the filename without extension
   - Click on the title input to edit each track's name
   - Remove unwanted files using the X button

4. **Enter Group Information (Optional)**
   - **Music Group Name**: e.g., "Summer Hits 2024", "Workout Mix"
   - **Group Description**: Describe this collection of songs
   - These fields are for your organization only

5. **Enter Common Metadata (Required)**
   - **Artist Name**: This will be applied to ALL uploaded tracks
   - **Music Category**: Select a category that applies to ALL tracks
     - Options: Phonk, Bollywood, Hollywood, Romantic, Gym, Pop, Rock, Hip-Hop, Electronic, Jazz, Classical, and more

6. **Upload Cover Image (Optional)**
   - Upload ONE image file
   - This cover image will be applied to ALL uploaded tracks
   - Recommended: Use album art or collection artwork

7. **Upload All Tracks**
   - Click the "Upload X Tracks" button (shows count)
   - Wait for upload to complete
   - You'll see a success message with the number of tracks uploaded

## Example Use Cases

### Use Case 1: Album Upload
You have 12 songs from the same album:
- Use **Bulk Upload**
- Artist: "The Beatles"
- Category: "Rock"
- Cover Image: Album artwork
- Edit individual track titles: "Hey Jude", "Let It Be", etc.
- Upload all 12 tracks at once

### Use Case 2: Workout Playlist
You have 20 workout songs from various artists:
- Use **Single Upload** for each track (different artists)
- OR use **Bulk Upload** if they're all from one artist
- Set appropriate category: "Workout" or "Gym"

### Use Case 3: Podcast Series
You have 5 podcast episodes:
- Use **Single Upload** for each episode
- Set content type to "Podcast"
- Enter podcast name and episode titles individually

## Tips & Best Practices

### File Naming
- Use descriptive filenames before uploading
- Default track titles come from filenames
- Remove special characters from filenames

### Cover Images
- Use square images (1:1 aspect ratio) for best results
- Recommended size: 500x500 pixels or larger
- Supported formats: JPG, PNG, WebP

### Bulk Upload Best Practices
- Group tracks by artist or album for easier management
- Review all track titles before uploading
- Use meaningful group names for future reference
- Upload cover image that represents the entire collection

### Performance
- Bulk upload processes files in parallel for faster uploads
- Larger files take longer to upload
- Don't close the browser during upload

## Validation Rules

### Single Upload
- ✅ Audio file is required
- ✅ Title is required
- ⚠️ Artist/Podcast name recommended
- ⚠️ Cover image optional

### Bulk Upload
- ✅ At least one audio file required
- ✅ Artist name is required
- ✅ Music category is required
- ⚠️ Group name/description optional
- ⚠️ Cover image optional
- ⚠️ Individual track titles optional (defaults to filename)

## Troubleshooting

### "Please provide audio files and artist name"
- Make sure you've selected at least one audio file
- Make sure you've entered an artist name

### Upload takes too long
- Check your internet connection
- Try uploading fewer files at once
- Compress audio files if they're very large

### Cover image not showing
- Make sure image file is valid (JPG, PNG, WebP)
- Try uploading a smaller image
- Check image file isn't corrupted

### Track titles are wrong
- Edit track titles before clicking upload
- Click on the title input field for each track
- Default titles come from filenames

## Technical Details

### Supported Audio Formats
- MP3
- WAV
- OGG
- M4A
- FLAC
- AAC

### Supported Image Formats
- JPG/JPEG
- PNG
- WebP
- GIF

### File Size Limits
- Audio files: Depends on your Supabase storage limits
- Images: Recommended under 5MB

### Upload Process
1. Cover image uploaded first (if provided)
2. All audio files uploaded in parallel
3. Track records created in database
4. Success notification shown

## Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify you're logged in as admin
3. Check file formats are supported
4. Try refreshing the page
5. Try uploading fewer files at once
