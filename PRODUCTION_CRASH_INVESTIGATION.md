# Production Crash Investigation - Migration Banner

## Issue Summary
The app crashes in production (both Android and iOS) after deploying the migration banner feature via EAS Update.

## Error Details
```
ClassCastException: java.lang.String cannot be cast to java.lang.Boolean
Location: com.facebook.react.viewmanagers.RNSScreenManagerDelegate.setProperty (line 56)
Platform: Android (Samsung SM-S926B, Android 16)
Runtime: New Architecture (Fabric) enabled
Context: Navigation to "index" screen
```

## Root Cause Analysis
The crash occurs in the react-native-screens library when it tries to set a property on a Screen component. The error indicates that a string value is being passed where a boolean is expected. This is a common issue when:

1. **New Architecture Strict Type Checking**: With `newArchEnabled: true` in app.json, React Native's New Architecture (Fabric) has stricter type checking for native props
2. **OTA Update Compatibility**: The OTA update bundle may have different prop handling than the native build expects
3. **Minification Issues**: Production builds minify code differently, potentially changing how props are serialized

## Immediate Fix
✅ Reverted the migration banner update and published hotfix:
- Update Group ID: 2782c2b9-6784-4b67-b5d2-75d4afce3808
- Message: "Revert migration banner to fix production crash"

## Recommended Solution
To safely add the migration banner back, we should:

### Option 1: Full Native Rebuild (Recommended)
1. Increment the runtime version in app.json (e.g., from "1.0.0" to "1.0.1")
2. Build new native binaries with EAS Build
3. Submit to app stores
4. This ensures native code and JS bundle are perfectly in sync

### Option 2: Simplified Component (Temporary)
If we want to keep OTA updates, we can:
1. Ensure all screen options use proper boolean types (not strings)
2. Test the bundle export locally before publishing
3. Add error boundaries around the migration banner

## Files Changed
- components/common/MigrationBanner/MigrationBanner.tsx (cleaned up formatting)
- components/common/MigrationBanner/MigrationBannerStyles.ts (removed unused imports, fixed gap)
- app/(tabs)/training/index.tsx
- app/(tabs)/profile/index.tsx  
- app/(tabs)/sightMarks/index.tsx
- app/(tabs)/about/index.tsx

## Testing Checklist
Before re-deploying the migration banner:
- [ ] Test in development mode (iOS simulator)
- [ ] Test in development mode (Android emulator)
- [ ] Create production build locally with `npx expo export`
- [ ] Test production build in development client
- [ ] Deploy to a test channel first
- [ ] Monitor Sentry for any errors
- [ ] Gradually roll out to production

## Next Steps
1. Wait for confirmation that the reverted version fixes the crash
2. Decide between Option 1 (new build) or Option 2 (simplified approach)
3. Re-implement the migration banner with proper testing

