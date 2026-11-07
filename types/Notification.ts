/**
 * Notification types — mirrors the Prisma NotificationType enum in the API.
 * The server creates these on challenge actions (invite, accept, decline,
 * cancel, submit) and pushes them via Expo Push when a token is registered.
 */
export enum NotificationType {
  CHALLENGE_RECEIVED = 'CHALLENGE_RECEIVED',
  CHALLENGE_SENT = 'CHALLENGE_SENT',
  CHALLENGE_ACCEPTED = 'CHALLENGE_ACCEPTED',
  CHALLENGE_DECLINED = 'CHALLENGE_DECLINED',
  CHALLENGE_CANCELLED = 'CHALLENGE_CANCELLED',
  CHALLENGE_SUBMITTED = 'CHALLENGE_SUBMITTED',
}

/**
 * In-app notification, shape of the /api/notifications rows.
 * `createdAt` is an ISO string from the API; locally-created (optimistic)
 * notifications use `local-` prefixed ids and ISO strings too.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  challengeId?: string | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationsListResponse {
  notifications: Notification[];
  unreadCount: number;
}
