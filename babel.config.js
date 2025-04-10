module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated plugin (if you use reanimated)
      'react-native-reanimated/plugin',
    ],
  };
}; 