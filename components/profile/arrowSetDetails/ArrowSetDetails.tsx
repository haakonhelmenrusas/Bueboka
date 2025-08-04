
import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCog } from '@fortawesome/free-solid-svg-icons';
import { ArrowSet } from '@/types';
import { styles } from './ArrowSetDetailsStyles';
import { colors } from '@/styles/colors';
import { capitalizeFirstLetter } from '@/utils';

interface Props {
  arrowSet: ArrowSet;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function ArrowSetDetails({ arrowSet, visible, onClose, onEdit }: Props) {
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
            <Text style={styles.title}>{arrowSet.name}</Text>
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
              <Text style={styles.label}>Spine:</Text>
              <Text style={styles.value}>{arrowSet.spine}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Vekt:</Text>
              <Text style={styles.value}>{arrowSet.weight} gram</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Lengde:</Text>
              <Text style={styles.value}>{arrowSet.length} cm</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Material:</Text>
              <Text style={styles.value}>{capitalizeFirstLetter(arrowSet.material)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Diameter:</Text>
              <Text style={styles.value}>{arrowSet.diameter} mm</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Antall piler:</Text>
              <Text style={styles.value}>{arrowSet.numberOfArrows}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}