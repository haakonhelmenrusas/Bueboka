/**
 * User model matching backend Prisma schema
 */
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  club: string | null;
  image: string | null;
  skytternr: string | null;
  isPublic: boolean;
  publicName: boolean;
  publicClub: boolean;
  publicStats: boolean;
  publicSkytternr: boolean;
  publicAchievements: boolean;
  /**
   * UI language preference synced across devices.
   * `null` means the user has not yet chosen — clients fall back to the OS
   * locale or the default. Valid values: 'no', 'en'.
   */
  locale: string | null;
  createdAt: string;
  updatedAt: string;
}
