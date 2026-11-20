import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { uploadAvatar } from '@/services/api/uploadAvatar';
import { User } from '@/types';

/** User update data */
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

/** User repository */
export const userRepository = {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await client.get<{ profile: User } | User>('/profile');
      const data = response.data as any;
      return data?.profile ?? data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateProfile(data: UpdateUserData): Promise<User> {
    try {
      const response = await client.patch<User>('/users', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateAvatar(imageUri: string): Promise<User> {
    try {
      return await uploadAvatar(imageUri);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async removeAvatar(): Promise<User> {
    try {
      const response = await client.patch<User>('/users', { image: null });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updatePublicSettings(data: UpdatePublicSettingsData): Promise<User> {
    try {
      const response = await client.patch<User>('/users', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateLocale(locale: 'no' | 'en' | null): Promise<User> {
    try {
      const response = await client.patch<User>('/users', { locale });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteAccount(): Promise<void> {
    try {
      await client.delete('/users/delete');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
