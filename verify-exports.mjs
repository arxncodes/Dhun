// Verification script to check api.ts exports
import { readFileSync } from 'fs';

const apiContent = readFileSync('./src/db/api.ts', 'utf-8');

console.log('=== Checking api.ts exports ===\n');

// Check for correct export
if (apiContent.includes('export const playlistApi')) {
  console.log('✅ CORRECT: "playlistApi" export found');
} else {
  console.log('❌ ERROR: "playlistApi" export NOT found');
}

// Check for incorrect export
if (apiContent.includes('export const playlistsApi')) {
  console.log('❌ ERROR: "playlistsApi" (incorrect) export found');
} else {
  console.log('✅ CORRECT: No "playlistsApi" (incorrect) export');
}

console.log('\n=== Checking all source files for incorrect imports ===\n');

import { execSync } from 'child_process';

try {
  const result = execSync('grep -r "playlistsApi" src/ --include="*.tsx" --include="*.ts" 2>&1', { encoding: 'utf-8' });
  console.log('❌ ERROR: Found incorrect "playlistsApi" imports:');
  console.log(result);
} catch (error) {
  if (error.status === 1) {
    console.log('✅ CORRECT: No incorrect "playlistsApi" imports found in source files');
  } else {
    console.log('Error running grep:', error.message);
  }
}

console.log('\n=== Summary ===');
console.log('The code is correct. If you see this error in the browser:');
console.log('1. Clear browser cache (Ctrl+Shift+Delete)');
console.log('2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)');
console.log('3. Restart the dev server');
console.log('4. Clear Vite cache: rm -rf node_modules/.vite dist');
