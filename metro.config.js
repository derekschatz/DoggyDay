// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const fs = require('fs');

// Create a polyfill for the missing react-native package.json
// This ensures Metro can find it during bundling
try {
  const reactNativePath = path.resolve(__dirname, 'node_modules/react-native');
  const packageJsonPath = path.join(reactNativePath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('Creating react-native package.json polyfill');
    if (!fs.existsSync(reactNativePath)) {
      fs.mkdirSync(reactNativePath, { recursive: true });
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      name: 'react-native',
      version: '0.76.9',
    }));
  }
} catch (error) {
  console.warn('Failed to create react-native package.json polyfill', error);
}

/** @type {import('@expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Enable require.context for expo-router
config.transformer.assetPlugins.push('expo-asset/tools/hashAssetFiles');
config.resolver.sourceExts.push('mjs');
config.transformer.unstable_allowRequireContext = true;

// Fix for "Cannot find module 'react-native/package.json'" error
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules')
];

// Additional Metro configuration for better module resolution
config.resolver.extraNodeModules = new Proxy({}, {
  get: (target, name) => {
    return path.join(__dirname, `node_modules/${name}`);
  }
});

module.exports = config; 