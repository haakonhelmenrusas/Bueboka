import { Image, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { styles } from './ProfileBoxStyles';
import { Button } from '@/components/common';
import { User } from '@/types';
import { colors } from '@/styles/colors';

interface Props {
  user: User;
  avatarUrl?: string;
  onEdit: () => void;
}

export default function ProfileBox({ user, avatarUrl, onEdit }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitial}>{user.name.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          {user.club && <Text style={styles.club}>{user.club}</Text>}
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
