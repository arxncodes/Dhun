# Wave Animation Toggle - Quick Visual Guide

## Feature Overview

Toggle between vertical and horizontal wave animations in the audio player.

## Button Location

```
Audio Player Controls:
┌─────────────────────────────────────────────────────────────┐
│  [Track Info]  [Controls]  [Progress]  [🌊] [🔊] [Volume]  │
│                                          ↑                   │
│                                    Wave Toggle               │
└─────────────────────────────────────────────────────────────┘
```

## Visual Modes

### Vertical Waves (Default)
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│     ▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▃ ▇ ▄ ▆      │
│     ▃ ▆ ▄ █ ▅ ▇ ▃ ▆ ▄ █ ▅ ▇ ▃ ▆ ▄ █ ▅ ▇ ▃ ▆ ▄ █ ▅ ▇      │
│     ▄ ▇ ▅ █ ▆ █ ▄ ▇ ▅ █ ▆ █ ▄ ▇ ▅ █ ▆ █ ▄ ▇ ▅ █ ▆ █      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
Animation: Bars move up and down (scaleY)
```

### Horizontal Waves (Toggle Mode)
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│     ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂    │
│     ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃  │
│     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄│
│     ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅│
│                                                              │
└─────────────────────────────────────────────────────────────┘
Animation: Bars extend left to right (scaleX)
```

## Button States

### Vertical Mode (Default)
```
┌────────┐
│   🌊   │  ← Icon upright
└────────┘
Tooltip: "Wave orientation: vertical"
```

### Horizontal Mode (Toggled)
```
┌────────┐
│   🌊   │  ← Icon rotated 90°
└────────┘
Tooltip: "Wave orientation: horizontal"
```

## User Flow

```
Step 1: Play Music
   ↓
Step 2: Locate Wave Button (next to volume)
   ↓
Step 3: Click to Toggle
   ↓
Step 4: Watch Animation Change
   ↓
Step 5: Click Again to Switch Back
```

## Animation Comparison

| Feature | Vertical | Horizontal |
|---------|----------|------------|
| **Bars** | 40 vertical bars | 40 horizontal bars |
| **Direction** | Up/Down | Left/Right |
| **Transform** | scaleY(0.3 → 1) | scaleX(0.3 → 1) |
| **Gradient** | Bottom to Top | Left to Right |
| **Bar Size** | w-1 (4px wide) | h-0.5 (2px tall) |
| **Container** | Horizontal flex | Vertical flex |
| **Icon** | Upright | Rotated 90° |

## Technical Details

### CSS Classes
```css
/* Vertical (default) */
.wave-bar {
  background: linear-gradient(to top, ...);
  animation: wave 0.8s ease-in-out infinite;
}

/* Horizontal (toggle) */
.wave-bar-horizontal {
  background: linear-gradient(to right, ...);
  animation: wave-horizontal 0.8s ease-in-out infinite;
}
```

### React State
```typescript
const [waveOrientation, setWaveOrientation] = 
  useState<'vertical' | 'horizontal'>('vertical');
```

### Toggle Function
```typescript
onClick={() => setWaveOrientation(
  prev => prev === 'vertical' ? 'horizontal' : 'vertical'
)}
```

## Benefits

✅ **Visual Variety** - Choose your preferred style  
✅ **Aesthetic Control** - Match your taste  
✅ **No Interruption** - Music continues playing  
✅ **Instant Switch** - Smooth transition  
✅ **Accessible** - Keyboard and mouse support  

## Keyboard Access

```
Tab → Navigate to wave button
Enter/Space → Toggle orientation
```

## Mobile Support

- Touch-friendly button size (32x32px)
- Works on all screen sizes
- Responsive layout maintained

## Browser Compatibility

✅ Chrome/Edge (Chromium)  
✅ Firefox  
✅ Safari  
✅ Opera  
✅ All modern browsers  

## Performance

- **CPU**: Minimal (CSS animations)
- **GPU**: Accelerated transforms
- **Memory**: No additional overhead
- **Rendering**: 40 DOM elements (same as before)

## Tips

💡 **Try Both Modes**: See which you prefer!  
💡 **Match Your Mood**: Vertical for energy, horizontal for calm  
💡 **Screen Orientation**: Horizontal may look better on wide screens  
💡 **Accessibility**: Icon rotation provides visual feedback  

## Troubleshooting

**Button not visible?**
- Ensure player is expanded (not collapsed)
- Check screen width (may be hidden on very small screens)

**Animation not changing?**
- Click the button again
- Refresh the page if needed

**Icon not rotating?**
- Browser may not support CSS transforms (unlikely)
- Check browser console for errors

---

**Version**: 2.2.0  
**Feature**: Wave Animation Toggle  
**Status**: ✅ Production Ready  
**Date**: December 25, 2025  

**Enjoy your customized listening experience! 🎵**
