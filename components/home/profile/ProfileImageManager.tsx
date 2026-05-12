import { Alert, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/common';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from '@/contexts';
import { styles } from './ProfileImageManagerStyles';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

interface Props {
  userName?: string;
  avatarUrl?: string;
  onUpload: (uri: string) => Promise<void>;
  onRemove: () => Promise<void>;
  size?: number;
}

export default function ProfileImageManager({ userName, avatarUrl, onUpload, onRemove, size }: Props) {
  const { t } = useTranslation();
  const avatarSize = size ?? 72;
  const fontSize = size ? Math.round(size * 0.44) : 32;
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const ensurePhotoPermission = async (): Promise<boolean> => {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (current.granted) return true;

    const asked = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (asked.granted) return true;

    Alert.alert(t['avatar.noPermissionTitle'], t['avatar.noPermissionMessage']);
    return false;
  };

  const getFileSize = async (uri: string, assetFileSize?: number): Promise<number | null> => {
    if (typeof assetFileSize === 'number') return assetFileSize;

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && fileInfo.size) {
        return fileInfo.size;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handlePickAndUpload = async () => {
    setShowMenu(false);
    const hasPermission = await ensurePhotoPermission();
    if (!hasPermission) return;

    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const size = await getFileSize(asset.uri, asset.fileSize);

      if (size !== null && size > MAX_IMAGE_SIZE_BYTES) {
        Alert.alert(t['avatar.tooLargeTitle'], t['avatar.tooLargeMessage']);
        return;
      }

      await onUpload(asset.uri);
      Alert.alert(t['avatar.uploadedTitle'], t['avatar.uploadedMessage']);
    } catch (error: any) {
      Alert.alert(t['avatar.uploadErrorTitle'], error?.message || t['common.tryAgain']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!avatarUrl) return;
    setShowMenu(false);

    Alert.alert(t['avatar.removeTitle'], t['avatar.removeConfirm'], [
      { text: t['common.cancel'], style: 'cancel' },
      {
        text: t['avatar.remove'],
        style: 'destructive',
        onPress: async () => {
          try {
            setIsRemoving(true);
            await onRemove();
            Alert.alert(t['avatar.removedTitle'], t['avatar.removedMessage']);
          } catch (error: any) {
            Alert.alert(t['avatar.removeErrorTitle'], error?.message || t['common.tryAgain']);
          } finally {
            setIsRemoving(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
        onPress={() => setShowMenu(true)}
        disabled={isUploading || isRemoving}
        activeOpacity={0.7}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={[styles.avatarImage, { width: avatarSize, height: avatarSize }]} />
        ) : (
          <Text style={[styles.avatarInitial, { fontSize }]}>{userName?.charAt(0).toUpperCase() || '?'}</Text>
        )}
      </TouchableOpacity>

      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>{t['avatar.menuTitle']}</Text>
            <View style={styles.menuActions}>
              <Button
                buttonStyle={styles.menuButton}
                label={isUploading ? t['avatar.uploading'] : t['avatar.choose']}
                onPress={handlePickAndUpload}
                disabled={isUploading || isRemoving}
                loading={isUploading}
              />
              {avatarUrl && (
                <Button
                  type="outline"
                  variant="warning"
                  buttonStyle={styles.menuButton}
                  label={isRemoving ? t['avatar.removing'] : t['avatar.removeButton']}
                  onPress={handleRemove}
                  disabled={isUploading || isRemoving}
                  loading={isRemoving}
                />
              )}
              <Button type="outline" buttonStyle={styles.menuButton} label={t['common.cancel']} onPress={() => setShowMenu(false)} />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
