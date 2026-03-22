import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { styles } from './ProfileBoxStyles';
import { Button, Badge } from '@/components/common';
import { User } from '@/types';
import { colors } from '@/styles/colors';
import ProfileImageManager from './ProfileImageManager';

interface Props {
  user: User;
  avatarUrl?: string;
  onEdit: () => void;
  onAvatarUpload: (uri: string) => Promise<void>;
  onAvatarRemove: () => Promise<void>;
}

export default function ProfileBox({ user, avatarUrl, onEdit, onAvatarUpload, onAvatarRemove }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProfileImageManager userName={user.name || user.email} avatarUrl={avatarUrl} onUpload={onAvatarUpload} onRemove={onAvatarRemove} />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name || user.email || 'Bruker'}</Text>
          {user.club && <Text style={styles.club}>{user.club}</Text>}
          {user.skytternr && (
            <Badge variant="default" size="md" style={{ marginTop: 4 }}>
              #{user.skytternr}
            </Badge>
          )}
        </View>
      </View>
      <Button
        size="small"
        buttonStyle={{ backgroundColor: colors.background, width: '50%', marginLeft: 'auto' }}
        iconPosition="left"
        type="outline"
        icon={<FontAwesomeIcon icon={faPencil} size={16} />}
        label="Rediger profil"
        onPress={onEdit}
      />
    </View>
  );
}
