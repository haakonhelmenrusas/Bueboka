import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import { authFetchClient } from './api/authFetch';
import * as Sentry from '@sentry/react-native';

interface VersionResponse {
  minVersion: string;
  currentVersion: string;
  forceUpdate: boolean;
  updateMessage?: string;
  ios?: {
    minVersion: string;
    storeUrl: string;
  };
  android?: {
    minVersion: string;
    storeUrl: string;
  };
}

export class VersionService {
  private static APP_STORE_URL = 'https://apps.apple.com/no/app/bueboka/id6448108838';
  private static PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.aaronshade.bueboka';

  /**
   * Get current app version using expo-application
   */
  static getCurrentVersion(): string {
    // expo-application provides the native version
    return Application.nativeApplicationVersion || '1.0.0';
  }

  /**
   * Get current build number using expo-application
   */
  static getCurrentBuildNumber(): string {
    return Application.nativeBuildVersion || '1';
  }

  /**
   * Check if app update is required or available
   */
  static async checkVersion(): Promise<{
    updateRequired: boolean;
    updateAvailable: boolean;
    message: string;
    storeUrl: string;
  }> {
    try {
      const { data: response } = await authFetchClient.get<VersionResponse>('/app/version');
      const currentVersion = this.getCurrentVersion();

      const platformConfig = Platform.OS === 'ios' ? response.ios : response.android;
      const minVersion = platformConfig?.minVersion || response.minVersion;
      const storeUrl = platformConfig?.storeUrl || (Platform.OS === 'ios' ? this.APP_STORE_URL : this.PLAY_STORE_URL);

      const updateRequired = this.compareVersions(currentVersion, minVersion) < 0;
      const updateAvailable = this.compareVersions(currentVersion, response.currentVersion) < 0;

      return {
        updateRequired,
        updateAvailable,
        message: response.updateMessage || 'En ny versjon er tilgjengelig. Vennligst oppdater appen.',
        storeUrl,
      };
    } catch (error) {
      // If version check fails, don't block the app
      // Log to Sentry for monitoring
      Sentry.captureException(error);

      return {
        updateRequired: false,
        updateAvailable: false,
        message: '',
        storeUrl: Platform.OS === 'ios' ? this.APP_STORE_URL : this.PLAY_STORE_URL,
      };
    }
  }

  /**
   * Compare two semantic versions (e.g., "1.6.4" vs "1.7.0")
   * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  static compareVersions(version1: string, version2: string): number {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;

      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }

  /**
   * Open the App Store or Play Store
   */
  static openStore(storeUrl: string) {
    Linking.openURL(storeUrl);
  }
}
