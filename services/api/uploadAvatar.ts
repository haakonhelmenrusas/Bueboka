import { File as ExpoFile } from 'expo-file-system';
import { authFetchClient as client } from '@/services/api/authFetch';
import { Platform } from 'react-native';
import { User } from '@/types';

async function fileToBase64DataUri(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const file = new ExpoFile(uri);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/jpeg;base64,${btoa(binary)}`;
}

export async function uploadAvatar(imageUri: string): Promise<User> {
  const dataUri = await fileToBase64DataUri(imageUri);
  const response = await client.patch<User>('/users', { image: dataUri });
  return response.data;
}
