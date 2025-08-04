
import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCog } from '@fortawesome/free-solid-svg-icons';
import { Bow } from '@/types';
import { styles } from './BowDetailsStyles';
import { colors } from '@/styles/colors';
import { capitalizeFirstLetter } from '@/utils';

interface Props {
  bow: Bow;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function BowDetails({ bow, visible, onClose, onEdit }: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>{bow.bowName}</Text>
            <View style={styles.actions}>
              <Pressable onPress={onEdit} style={styles.editButton}>
                <FontAwesomeIcon icon={faCog} size={20} color={colors.white} />
              </Pressable>
              <Pressable onPress={onClose}>
                <FontAwesomeIcon icon={faXmark} size={20} />
              </Pressable>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{capitalizeFirstLetter(bow.bowType)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plassering:</Text>
              <Text style={styles.value}>{bow.placement === 'behind' ? 'Bak linja' : 'Over linja'}</Text>
            </View>
            {bow.eyeToNock && (
              <View style={styles.row}>
                <Text style={styles.label}>Fra øye til nock:</Text>
                <Text style={styles.value}>{bow.eyeToNock} cm</Text>
              </View>
            )}
            {bow.eyeToAim && (
              <View style={styles.row}>
                <Text style={styles.label}>Fra øye til sikte:</Text>
                <Text style={styles.value}>{bow.eyeToAim} cm</Text>
              </View>
            )}
            {bow.interval_sight_real && (
              <View style={styles.row}>
                <Text style={styles.label}>Intervall sikte:</Text>
                <Text style={styles.value}>{bow.interval_sight_real} cm</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}