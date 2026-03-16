/**
 * User model matching backend Prisma schema
 */
export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  club?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
