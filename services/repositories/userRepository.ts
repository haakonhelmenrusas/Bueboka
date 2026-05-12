import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { User } from '@/types';

/**
 * User update data structure
 */
export interface UpdateUserData {
  name?: string;
  club?: string;
  skytternr?: string;
  image?: string | null;
}

export interface UpdatePublicSettingsData {
  isPublic?: boolean;
  publicName?: boolean;
  publicClub?: boolean;
  publicStats?: boolean;
  publicSkytternr?: boolean;
  publicAchievements?: boolean;
}

/**
 * User repository - handles all user-related API operations
 */
export const userRepository = {
  /**
   * Get current user profile
   * GET /api/profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await client.get<{ profile: User } | User>('/profile');
      // The API returns { profile: {...} } — unwrap it if present
      const data = response.data as any;
      return data?.profile ?? data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update current user profile
   * PATCH /api/profile
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    try {
      const response = await client.patch<User>('/profile', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user avatar
   * PATCH /api/users
   */
  async updateAvatar(imageUri: string): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await client.patch<User>('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove user avatar
   * PATCH /api/users
   */
  async removeAvatar(): Promise<User> {
    try {
      const response = await client.patch<User>('/users', { image: null });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update public profile visibility settings
   * PATCH /api/users
   */
  async updatePublicSettings(data: UpdatePublicSettingsData): Promise<User> {
    try {
      const response = await client.patch<User>('/users', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update the user's UI language preference.
   * PATCH /api/users
   *
   * Server validates `locale` against the literals 'no' | 'en' (any other
   * value returns 400). Pass `null` only if you intentionally want to clear
   * a previously-set preference.
   */
  async updateLocale(locale: 'no' | 'en' | null): Promise<User> {
    try {
      const response = await client.patch<User>('/users', { locale });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete user account
   * DELETE /api/users/delete
   */
  async deleteAccount(): Promise<void> {
    try {
      await client.delete('/users/delete');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
