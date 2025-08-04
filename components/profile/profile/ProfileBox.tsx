import { Image, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { styles } from './ProfileBoxStyles';
import { Button } from '@/components/common';

interface Props {
  name: string;
  club: string;
  avatarUrl?: string;
  onEdit: () => void;
}

export default function ProfileBox({ name, club, avatarUrl, onEdit }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarInitial}>
              {name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.club}>{club}</Text>
        </View>
      </View>
      <Button
        iconPosition='left'
        type='outline'
        icon={<FontAwesomeIcon icon={faPencil} size={16} />}
        label='Rediger profile'
        onPress={onEdit}
      />
    </View>
  );
}