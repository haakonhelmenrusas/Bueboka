import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { styles } from './ModalHeaderStyles';

interface Props {
  title?: string;
  onPress: () => void;
}

export default function ModalHeader({ title, onPress }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onPress}>
        <Text>
          <FontAwesomeIcon icon={faXmark} size={20} />
        </Text>
      </TouchableOpacity>
    </View>
  );
}
