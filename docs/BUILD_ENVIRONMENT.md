# Build Environment Configuration

## Overview

The app uses different API URLs for different environments:
- **Local Development**: Local network IP (e.g., `http://192.168.0.90:3000/api`)
- **Preview Builds**: Production API URL
- **Production Builds**: Production API URL

## Problem We're Solving

When building preview/production versions with EAS, the `.env` file is baked into the build. If it contains a local IP address, Google OAuth and other API calls will fail when the device is not on your local network.

## Solution

Use EAS Secrets to inject the correct API URL at build time for each profile.

## Setup Instructions

### 1. Set Your Production API URL as an Environment Variable

```bash
# First, delete the incorrectly created secret if you already created it
eas env:delete EXPO_PUBLIC_API_URL --scope project

# Add the environment variable with plain text visibility (EXPO_PUBLIC_ variables are not secret)
eas env:create EXPO_PUBLIC_API_URL --scope project --value https://your-production-api.com/api --visibility plaintext
```

Replace `https://your-production-api.com/api` with your actual production backend URL.

**Important**: `EXPO_PUBLIC_` variables are compiled into your app and are visible in plain text. This is fine for your API URL since it's a public endpoint. Never put sensitive data (like API keys or passwords) in `EXPO_PUBLIC_` variables.

### 2. Verify the Environment Variable

```bash
# List all environment variables for your project
eas env:list
```

### 3. Build with the Correct Environment

Now when you build, EAS will automatically inject the production API URL **and auto-increment the build number** for you:

```bash
# For preview builds (TestFlight)
eas build --profile preview --platform ios

# For production builds (App Store)
eas build --profile production --platform ios
```

**Note**: Both preview and production profiles have `"autoIncrement": true` enabled, so you'll never get duplicate build number errors from Apple. EAS automatically increments the build number each time you build.

## How It Works

- **Local Development** (using `npm start`, `npm run ios`, etc.):
  - Uses `.env` file with local IP address
  - Perfect for connecting to your local dev server

- **Preview/Production Builds** (using `eas build`):
  - Uses the `EXPO_PUBLIC_API_URL` EAS secret
  - Overrides the `.env` file value
  - Points to your production backend

## Google OAuth Configuration

Make sure your Google OAuth app is configured with the correct redirect URIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Select your OAuth 2.0 Client ID
4. Add these redirect URIs:
   - `https://your-production-api.com/api/auth/callback/google`
   - `bueboka://` (for deep linking back to the app)

## Troubleshooting

### "Build number has already been used" Error

If you see: `Build number X.X.X for app version X.X.X has already been used`

**Cause**: You tried to submit a build with a duplicate build number to App Store Connect.

**Fix**: This should not happen anymore! The `eas.json` is now configured with `"autoIncrement": true` for both preview and production profiles. EAS will automatically increment the build number for each new build.

Just rebuild:
```bash
eas build --profile preview --platform ios
```

### Warning: "Secret EXPO_PUBLIC variable"

If you see this warning in the Expo dashboard:

**Cause**: You created the variable with "secret" visibility, but `EXPO_PUBLIC_` variables are compiled into your app and can't be truly secret.

**Fix**:
```bash
# Delete the incorrectly created variable
eas env:delete EXPO_PUBLIC_API_URL --scope project

# Recreate it with plaintext visibility
eas env:create EXPO_PUBLIC_API_URL --scope project --value https://your-production-api.com/api --visibility plaintext
```

### "Network Error" when trying to log in with Google

**Cause**: The app is trying to reach a local IP address that's not accessible.

**Fix**: 
1. Make sure you've set the `EXPO_PUBLIC_API_URL` EAS secret (see step 1 above)
2. Rebuild your preview/production app with `eas build`
3. Install the new build on your device

### How to check what API URL is being used

Add this to your app temporarily to see the current API URL:

```typescript
console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
```

## Different Backend for Preview vs Production (Optional)

If you want different API URLs for preview and production:

```bash
# Set preview API URL
eas env:create PREVIEW_API_URL --scope project --value https://preview-api.com/api --visibility plaintext

# Set production API URL
eas env:create PRODUCTION_API_URL --scope project --value https://production-api.com/api --visibility plaintext
```

Then update `eas.json`:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_API_URL": "${PREVIEW_API_URL}"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "${PRODUCTION_API_URL}"
      }
    }
  }
}
```

## References

- [EAS Build Environment Variables](https://docs.expo.dev/build-reference/variables/)
- [EAS Environment Variables (eas env)](https://docs.expo.dev/eas/environment-variables/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

