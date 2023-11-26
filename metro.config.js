// eslint-disable-next-line prettier/prettier
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/(.*.test.ts?)$/];

module.exports = config;
