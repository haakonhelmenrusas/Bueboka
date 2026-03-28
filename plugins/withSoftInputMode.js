const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withSoftInputMode(config) {
  return withAndroidManifest(config, (config) => {
    const activity = config.modResults.manifest.application?.[0]?.activity?.find((a) => a.$['android:name'] === '.MainActivity');
    if (activity) {
      activity.$['android:windowSoftInputMode'] = 'adjustNothing';
    }
    return config;
  });
};
