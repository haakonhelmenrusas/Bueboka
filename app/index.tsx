import { Redirect } from 'expo-router';
import React from 'react';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: false,
  environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,
});

const Index = () => {
  return <Redirect href="/siktemerker" />;
};
export default Index;
