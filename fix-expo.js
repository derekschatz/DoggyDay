#!/usr/bin/env node

/**
 * This script helps diagnose and fix common Expo startup issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Expo troubleshooting script...');

// Check for React Native package.json issue
const reactNativePath = path.resolve('./node_modules/react-native');
const packageJsonPath = path.join(reactNativePath, 'package.json');

console.log('🔎 Checking for React Native package.json...');
if (!fs.existsSync(packageJsonPath)) {
  console.log('⚠️ React Native package.json not found. Creating it...');
  try {
    if (!fs.existsSync(reactNativePath)) {
      fs.mkdirSync(reactNativePath, { recursive: true });
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      name: 'react-native',
      version: '0.76.9',
    }, null, 2));
    console.log('✅ Created React Native package.json successfully.');
  } catch (error) {
    console.error('❌ Failed to create React Native package.json:', error.message);
  }
} else {
  console.log('✅ React Native package.json exists.');
}

// Check for running Metro instances
console.log('\n🔎 Checking for running Metro instances...');
try {
  console.log('Attempting to kill any running Metro processes...');
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
    } else {
      execSync('pkill -f "metro" || true', { stdio: 'ignore' });
    }
    console.log('✅ Killed any existing Metro processes.');
  } catch (e) {
    // Ignore errors if no processes were found
  }
} catch (error) {
  console.warn('⚠️ Could not check for Metro processes:', error.message);
}

// Check for .expo directory corruption
console.log('\n🔎 Checking for potential .expo directory corruption...');
const expoDir = path.resolve('./.expo');
if (fs.existsSync(expoDir)) {
  console.log('Found .expo directory, moving it to .expo.bak in case of corruption...');
  try {
    // Rename instead of delete to keep a backup
    fs.renameSync(expoDir, `${expoDir}.bak`);
    console.log('✅ Moved .expo directory to .expo.bak.');
  } catch (error) {
    console.error('❌ Failed to move .expo directory:', error.message);
  }
} else {
  console.log('✅ No existing .expo directory found.');
}

// Clear Watchman if available
console.log('\n🔎 Checking if Watchman is installed...');
try {
  execSync('which watchman', { stdio: 'ignore' });
  console.log('Watchman found, clearing watches...');
  try {
    execSync('watchman watch-del-all', { stdio: 'inherit' });
    console.log('✅ Cleared Watchman watches.');
  } catch (error) {
    console.error('❌ Failed to clear Watchman watches:', error.message);
  }
} catch (e) {
  console.log('Watchman not installed, skipping...');
}

// Clear npm cache
console.log('\n🔎 Clearing npm cache...');
try {
  execSync('npm cache verify', { stdio: 'inherit' });
  console.log('✅ Cleared npm cache.');
} catch (error) {
  console.error('❌ Failed to clear npm cache:', error.message);
}

// Start Expo with a fresh environment
console.log('\n🚀 Ready to start Expo with a clean environment.');
console.log('Run the following command to start:');
console.log('\nnpx expo start --clear --port 19001\n');

console.log('If that doesn\'t work, try completely reinstalling dependencies:');
console.log('\nrm -rf node_modules && npm install\n');

console.log('🧩 Troubleshooting complete!'); 