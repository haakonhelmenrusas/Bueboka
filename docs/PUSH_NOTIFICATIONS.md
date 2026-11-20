# Push notifications

## How it works in this app

- The app registers an **Expo push token** (not a raw FCM token) with the API
  after login: `hooks/usePushNotifications.ts` → `POST /api/notifications/push-token`.
- The API stores the token on the user and sends pushes through the
  **Expo Push Notification service** (`https://exp.host/--/api/v2/push/send`)
  — see `lib/notifications.ts` (`sendExpoPush`) in the Bueboka-website repo.
  So there is **no own push backend** to run; one request reaches both platforms.
- In-app inbox (`/varsler` screen + badges) reads `GET /api/notifications` and
  works without any push token (30 s polling fallback).

## The Firebase question (Android only)

- Expo's push service delivers to Android **via FCM** and to iOS **via APNs**.
  On Android, FCM is Android's only remote-push channel — Google is unavoidable
  there. iOS never involves Google (APNs).
- You do **not** need `google-services.json` in this repo if you build with EAS:
  upload an FCM V1 **service account key** once via `eas credentials`
  ("Set up a Google Service Account Key for Push Notifications (FCM V1)"), and
  an APNs key for iOS (`eas credentials` → iOS). EAS injects them at build time.
- Only local dev builds (`npx expo run:android` with a dev client) need
  `google-services.json` + `android.googleServicesFile` in `app.json`.
  Without it, token registration is skipped with a quiet warning
  (see `usePushNotifications.ts`) — in-app notifications still work.
- Quickest way to test push without any credentials: run the app in **Expo Go**,
  which uses Expo's own push credentials.

## Flow

`POST /api/challenges` (and accept/decline/cancel/submit) create a notification
row server-side and, if the recipient has a push token, send an Expo push.
The app shows a foreground alert via `setNotificationHandler` and the inbox
syncs from `/api/notifications`.
