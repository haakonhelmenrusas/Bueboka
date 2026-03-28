import { Pressable, Text, View, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Arrows } from '@/types';
import { styles } from '../DetailsStyles';
import { colors } from '@/styles/colors';
import { DataValue, ModalWrapper } from '@/components/common';

interface Props {
  arrowSet: Arrows;
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Material</Text>
              <DataValue value={arrowSet.material} capitalize textStyle={styles.value} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Antall piler</Text>
              <DataValue value={arrowSet.arrowsCount} textStyle={styles.value} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Spine</Text>
              <DataValue value={arrowSet.spine} textStyle={styles.value} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Vekt</Text>
              <DataValue value={arrowSet.weight} suffix=" grain" textStyle={styles.value} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Lengde</Text>
              <DataValue value={arrowSet.length} suffix=" tommer" textStyle={styles.value} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Diameter</Text>
              <DataValue value={arrowSet.diameter} suffix=" mm" textStyle={styles.value} />
            </View>

            {arrowSet.pointType && (
              <View style={styles.row}>
                <Text style={styles.label}>Pilspisstype</Text>
                <Text style={styles.value}>{arrowSet.pointType}</Text>
              </View>
            )}

            {arrowSet.pointWeight && (
              <View style={styles.row}>
                <Text style={styles.label}>Spissvekt</Text>
                <DataValue value={arrowSet.pointWeight} suffix=" grain" textStyle={styles.value} />
              </View>
            )}

            {arrowSet.vanes && (
              <View style={styles.row}>
                <Text style={styles.label}>Vanes</Text>
                <Text style={styles.value}>{arrowSet.vanes}</Text>
              </View>
            )}

            {arrowSet.nock && (
              <View style={styles.row}>
                <Text style={styles.label}>Nock</Text>
                <Text style={styles.value}>{arrowSet.nock}</Text>
              </View>
            )}

            {arrowSet.notes && (
              <View style={styles.row}>
                <Text style={styles.label}>Notater</Text>
                <Text style={styles.value}>{arrowSet.notes}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}
