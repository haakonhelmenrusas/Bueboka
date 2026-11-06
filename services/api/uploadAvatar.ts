import { File as ExpoFile } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { authFetchClient as client } from '@/services/api/authFetch';
import { Image, Platform } from 'react-native';
import { User } from '@/types';

// Keep avatars small (like the web app's 800px / q0.7) — the image is stored on
// the user record and ships inside the session payload, which has a hard
// storage size limit in the auth client.
const MAX_EDGE = 800;
const JPEG_QUALITY = 0.7;

function getSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

/** Resize so the longest edge is MAX_EDGE and re-encode as JPEG */
async function compressImage(uri: string): Promise<string> {
  const { width, height } = await getSize(uri);
  const ratio = Math.min(MAX_EDGE / width, MAX_EDGE / height, 1);
  const actions: ImageManipulator.Action[] =
    ratio < 1 ? [{ resize: { width: Math.round(width * ratio), height: Math.round(height * ratio) } }] : [];
  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return result.uri;
}

/** Convert file URI to base64 data URI for upload */
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

/** Upload user avatar image (compressed first) */
export async function uploadAvatar(imageUri: string): Promise<User> {
  const compressedUri = await compressImage(imageUri);
  const dataUri = await fileToBase64DataUri(compressedUri);
  const response = await client.patch<User>('/users', { image: dataUri });
  return response.data;
}
