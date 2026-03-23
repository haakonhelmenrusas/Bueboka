import { Pressable, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Bow } from '@/types';
import { styles } from '../DetailsStyles';
import { colors } from '@/styles/colors';
import { capitalizeFirstLetter } from '@/utils';
import { DataValue, ModalWrapper } from '@/components/common';

interface Props {
  bow: Bow;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function BowDetails({ bow, visible, onClose, onEdit }: Props) {
  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      <View style={styles.modalView}>
        <View style={styles.header}>
          <Text style={styles.title}>{bow.name}</Text>
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
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{capitalizeFirstLetter(bow.type)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fra øye til nock</Text>
            <DataValue textStyle={styles.value} value={bow.eyeToNock} suffix=" cm" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Siktemåling</Text>
            <DataValue textStyle={styles.value} value={bow.aimMeasure} suffix=" cm" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fra øye til sikte</Text>
            <DataValue textStyle={styles.value} value={bow.eyeToSight} suffix=" cm" />
          </View>
          {bow.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>Notater</Text>
              <Text style={styles.value}>{bow.notes}</Text>
            </View>
          )}
        </View>
      </View>
    </ModalWrapper>
  );
}
