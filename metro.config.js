const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = getSentryExpoConfig(__dirname);

config.resolver.blockList = [/(.*.test.ts?)$/];

module.exports = wrapWithReanimatedMetroConfig(config);
