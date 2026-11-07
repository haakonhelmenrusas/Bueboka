/**
 * Removes base64 data-URI images from a better-auth session payload.
 *
 * The backend stores avatars as data URIs on the user record, so the
 * /get-session response embeds the whole image. The expo auth client persists
 * that response to storage in 1800-byte chunks with a hard limit of 100
 * chunks, so a large image makes the write fail ("requires N chunks,
 * exceeding the limit of 100"). The app reads the avatar from /profile
 * instead, so stripping it here loses nothing.
 */
export function stripDataUriImageFromSession(data: unknown): void {
  const user = (data as { user?: { image?: unknown } } | null | undefined)?.user;
  if (user && typeof user.image === 'string' && user.image.startsWith('data:image/')) {
    user.image = null;
  }
}
