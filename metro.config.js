const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Expo Router's require.context (_ctx.js) discovers every *.ts/tsx file in app/,
// including test files, before Metro's blockList runs.  Intercept at the
// resolveRequest level instead: return an empty module for any test/spec file
// so it is silently dropped from the bundle.
const TEST_FILE_RE = /\.(test|spec)\.(tsx?|jsx?)$/;

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (TEST_FILE_RE.test(moduleName)) {
    return { type: 'empty' };
  }
  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = wrapWithReanimatedMetroConfig(config);
