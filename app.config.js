/** @type {import('@expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  const base = require('./app.json');

  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  return {
    ...base.expo,
    ...config,
    android: {
      ...base.expo.android,
      ...config.android,
      config: {
        ...base.expo.android?.config,
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
