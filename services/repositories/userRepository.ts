import client from '@/services/api/client';
import { handleApiError } from '@/services/api/errors';
import { User } from '@/types';

/**
 * User update data structure
 */
export interface UpdateUserData {
  name?: string;
  club?: string;
  image?: string;
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
      const response = await client.get<User>('/profile');
      return response.data;
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
   * PATCH /api/profile
   */
  async updateAvatar(imageUri: string): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await client.patch<User>('/profile', formData, {
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
