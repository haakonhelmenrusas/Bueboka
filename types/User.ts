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
  createdAt: string;
  updatedAt: string;
}
