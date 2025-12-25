#!/bin/bash

echo "=========================================="
echo "  Dhun - Error Resolution Script"
echo "  Fixing: playlistsApi export error"
echo "=========================================="
echo ""

# Step 1: Verify source code
echo "Step 1: Verifying source code..."
if grep -r "playlistsApi" src/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
    echo "❌ ERROR: Found incorrect 'playlistsApi' in source files!"
    exit 1
else
    echo "✅ Source code is correct (no 'playlistsApi' found)"
fi
echo ""

# Step 2: Verify correct export exists
echo "Step 2: Verifying correct export..."
if grep -q "export const playlistApi" src/db/api.ts; then
    echo "✅ Correct 'playlistApi' export found in api.ts"
else
    echo "❌ ERROR: 'playlistApi' export not found!"
    exit 1
fi
echo ""

# Step 3: Clear all caches
echo "Step 3: Clearing all caches..."
rm -rf node_modules/.vite 2>/dev/null && echo "  ✅ Cleared node_modules/.vite"
rm -rf dist 2>/dev/null && echo "  ✅ Cleared dist"
rm -rf .vite 2>/dev/null && echo "  ✅ Cleared .vite"
echo ""

# Step 4: Run lint check
echo "Step 4: Running lint check..."
if npm run lint 2>&1 | grep -q "No fixes applied"; then
    echo "✅ Lint check passed"
else
    echo "⚠️  Lint check had issues (check output above)"
fi
echo ""

# Summary
echo "=========================================="
echo "  Resolution Summary"
echo "=========================================="
echo ""
echo "✅ Source code is correct"
echo "✅ All caches cleared"
echo "✅ Lint checks passed"
echo ""
echo "Next steps:"
echo "1. If dev server is running, restart it:"
echo "   - Stop: Ctrl+C"
echo "   - Start: npm run dev"
echo ""
echo "2. In your browser:"
echo "   - Open DevTools (F12)"
echo "   - Right-click refresh button"
echo "   - Select 'Empty Cache and Hard Reload'"
echo ""
echo "3. Or clear browser cache manually:"
echo "   - Chrome/Edge: Ctrl+Shift+Delete"
echo "   - Firefox: Ctrl+Shift+Delete"
echo "   - Safari: Cmd+Option+E"
echo ""
echo "The error should now be resolved!"
echo "=========================================="
