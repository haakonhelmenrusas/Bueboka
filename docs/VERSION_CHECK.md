# Version Check System Documentation

## Overview

The app now includes a forced update system that checks the app version on launch and can block users from using the app until they update to a newer version from the App Store or Play Store.

## How It Works

1. **App Launch**: When the app starts, it calls `VersionService.checkVersion()`
2. **API Call**: The service calls `/api/app/version` endpoint
3. **Version Comparison**: Compares current app version with minimum required version
4. **Decision**: If update is required, shows blocking screen; otherwise, allows app usage

## Backend API Endpoint

Your backend needs to implement this endpoint:

### Endpoint

```
GET /api/app/version
```

### Response Format

```json
{
  "minVersion": "1.6.4",
  "currentVersion": "1.7.0",
  "forceUpdate": true,
  "updateMessage": "En ny versjon er tilgjengelig. Vennligst oppdater appen.",
  "ios": {
    "minVersion": "1.6.4",
    "storeUrl": "https://apps.apple.com/no/app/bueboka/id6448108838"
  },
  "android": {
    "minVersion": "1.6.4",
    "storeUrl": "https://play.google.com/store/apps/details?id=com.aaronshade.bueboka"
  }
}
```

### Response Fields

- `minVersion`: **Required**. Minimum version users must have. Users below this will be forced to update.
- `currentVersion`: **Required**. Latest version available in stores (for informational purposes).
- `forceUpdate`: **Optional**. Boolean flag (not currently used, but can be extended).
- `updateMessage`: **Optional**. Custom message to show users. Defaults to Norwegian message if not provided.
- `ios.minVersion`: **Optional**. iOS-specific minimum version (overrides `minVersion` if set).
- `ios.storeUrl`: **Optional**. Custom iOS App Store URL.
- `android.minVersion`: **Optional**. Android-specific minimum version.
- `android.storeUrl`: **Optional**. Custom Play Store URL.

## Usage Examples

### Example 1: Force All Users to Update to 1.7.0

```json
{
  "minVersion": "1.7.0",
  "currentVersion": "1.7.0",
  "updateMessage": "Viktig sikkerhetsoppdatering. Vennligst oppdater appen."
}
```

All users with version < 1.7.0 will be blocked and forced to update.

### Example 2: Different Versions for iOS and Android

```json
{
  "minVersion": "1.6.0",
  "currentVersion": "1.7.0",
  "ios": {
    "minVersion": "1.7.0"
  },
  "android": {
    "minVersion": "1.6.5"
  }
}
```

iOS users below 1.7.0 are forced to update.
Android users below 1.6.5 are forced to update.

### Example 3: No Forced Update (Let Everyone In)

```json
{
  "minVersion": "1.0.0",
  "currentVersion": "1.7.0"
}
```

No one is forced to update (minVersion is very low).

## Deployment Workflow

### When Releasing a New Version

1. **Build and submit to stores**:

   ```bash
   # Build for both platforms
   eas build --platform all --profile production

   # Submit to stores
   eas submit --platform ios --profile production
   eas submit --platform android --profile production
   ```

2. **Wait for approval** (iOS: 1-3 days, Android: hours)

3. **Once approved and live**, update your backend API to return the new minVersion:

   ```json
   {
     "minVersion": "1.7.0",
     "currentVersion": "1.7.0"
   }
   ```

4. **Users on older versions** will now see the update screen

### For Non-Critical Updates (Optional Updates)

If you want to allow users to skip the update:

```json
{
  "minVersion": "1.6.0", // Keep old min version
  "currentVersion": "1.7.0", // New version available
  "updateMessage": "En ny versjon er tilgjengelig med forbedringer"
}
```

Note: The current implementation blocks users if `updateRequired` is true. To show optional update banners, you'll need to extend the UI.

## Version Comparison

Versions are compared semantically (major.minor.patch):

- `1.7.0` > `1.6.4` ✅
- `2.0.0` > `1.9.9` ✅
- `1.6.10` > `1.6.9` ✅
- `1.6.4` = `1.6.4` ✅

## Error Handling

If the API call fails (network error, server down, etc.):

- The version check **fails gracefully**
- Users are **NOT blocked**
- Error is logged to Sentry
- App functions normally

This ensures the app doesn't break if the backend is temporarily unavailable.

## Testing

### Test Forced Update Locally

1. Set your backend to return:

   ```json
   {
     "minVersion": "99.0.0",
     "currentVersion": "99.0.0",
     "updateMessage": "Test forced update"
   }
   ```

2. Launch the app
3. You should see the UpdateRequired screen

### Test Different Versions

Modify `app.json` to change the version:

```json
{
  "expo": {
    "version": "1.6.4"
  }
}
```

Then test with different `minVersion` values from your backend.

## Monitoring

Version check data is logged to Sentry with breadcrumbs including:

- Current version
- Build number
- Whether update is required
- Whether update is available

Check Sentry to monitor version distribution across your user base.

## Backend Implementation Examples

### Node.js/Express

```typescript
app.get('/api/app/version', (req, res) => {
  res.json({
    minVersion: '1.6.4',
    currentVersion: '1.7.0',
    updateMessage: 'En ny versjon er tilgjengelig',
    ios: {
      minVersion: '1.6.4',
      storeUrl: 'https://apps.apple.com/no/app/bueboka/id6448108838',
    },
    android: {
      minVersion: '1.6.4',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.aaronshade.bueboka',
    },
  });
});
```

### Database-Driven (Recommended)

Store version config in your database so you can update it without deploying backend code:

```typescript
app.get('/api/app/version', async (req, res) => {
  const config = await db.appConfig.findFirst();
  res.json({
    minVersion: config.minVersion,
    currentVersion: config.currentVersion,
    updateMessage: config.updateMessage,
    ios: {
      minVersion: config.iosMinVersion,
      storeUrl: config.iosStoreUrl,
    },
    android: {
      minVersion: config.androidMinVersion,
      storeUrl: config.androidStoreUrl,
    },
  });
});
```

## Files Modified

- `services/versionService.ts` - Core version checking logic
- `components/common/UpdateRequired/UpdateRequired.tsx` - Blocking UI screen
- `app/_layout.tsx` - Version check integration
- `components/common/index.ts` - Export UpdateRequired
- `services/index.ts` - Export VersionService

## Future Enhancements

Potential improvements:

1. **Optional update banner** - Show dismissible banner for non-critical updates
2. **Update changelog** - Display what's new in the update
3. **Grace period** - Allow N days before forcing update
4. **A/B testing** - Gradually roll out forced updates
5. **Admin dashboard** - UI to manage version requirements
