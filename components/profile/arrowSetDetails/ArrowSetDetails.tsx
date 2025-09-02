import { Pressable, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCog } from '@fortawesome/free-solid-svg-icons';
import { ArrowSet } from '@/types';
import { styles } from '../DetailsStyles';
import { colors } from '@/styles/colors';
import { ModalWrapper, DataValue } from '@/components/common';

interface Props {
  arrowSet: ArrowSet;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function ArrowSetDetails({ arrowSet, visible, onClose, onEdit }: Props) {
  return (
    <ModalWrapper visible={visible} onClose={onClose}>
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
            <Text style={styles.label}>Spine</Text>
            <DataValue value={arrowSet.spine} textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vekt</Text>
            <DataValue value={arrowSet.weight} suffix=" gram" textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Lengde</Text>
            <DataValue value={arrowSet.length} suffix=" cm" textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Material</Text>
            <DataValue value={arrowSet.material} capitalize textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Diameter</Text>
            <DataValue value={arrowSet.diameter} suffix=" mm" textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Antall piler</Text>
            <DataValue value={arrowSet.numberOfArrows} textStyle={styles.value} />
          </View>
        </View>
      </View>
    </ModalWrapper>
  );
}
