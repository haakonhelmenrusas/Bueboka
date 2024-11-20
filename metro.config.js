const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

config.resolver.blockList = [/(.*.test.ts?)$/];

module.exports = config;
