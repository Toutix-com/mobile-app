module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@pages': './src/pages',
          '@services': './src/services',
          '@store': './src/store',
          '@types': './src/types',
          '@utils': './src/utils'
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: false,
      },
    ],
  ],
};
