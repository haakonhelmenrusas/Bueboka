import { useState } from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';
import ProfileForm from '@/components/home/profileForm/ProfileForm';
import { User } from '@/types';

interface AccountSectionProps {
  user: User;
  onProfileUpdate: (data: { name: string; club?: string; skytternr?: string }) => Promise<void>;
}

export default function AccountSection({ user, onProfileUpdate }: AccountSectionProps) {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Konto</Text>
        <View style={styles.sectionCard}>
          <View style={styles.infoGrid}>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Navn</Text>
              <Text style={styles.value}>{user.name ?? '—'}</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>E-post</Text>
              <Text style={styles.value} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Klubb</Text>
              <Text style={styles.value}>{user.club ?? '—'}</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Skytternummer</Text>
              <Text style={styles.value}>{user.skytternr ?? '—'}</Text>
            </View>
          </View>
          <View style={styles.editButtonRow}>
            <Button
              type="outline"
              label="Rediger profil"
              onPress={() => setIsProfileModalVisible(true)}
              icon={<FontAwesomeIcon icon={faPen} size={13} color={colors.primary} />}
              iconPosition="left"
            />
          </View>
        </View>
      </View>

      <ProfileForm modalVisible={isProfileModalVisible} setModalVisible={setIsProfileModalVisible} user={user} onSave={onProfileUpdate} />
    </>
  );
}
