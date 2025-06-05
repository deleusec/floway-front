module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': '.',
            '@theme': './constants/theme',
            '@components': './components',
            '@screens': './screens',
            '@hooks': './hooks',
            '@utils': './utils',
            '@services': './services',
            '@types': './types',
          },
        },
      ],
    ],
  };
};
