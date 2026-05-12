import { Pressable, Text, View, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Arrows } from '@/types';
import { styles } from '../DetailsStyles';
import { colors } from '@/styles/colors';
import { DataValue, ModalWrapper } from '@/components/common';
import { useTranslation } from '@/contexts';

interface Props {
  arrowSet: Arrows;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function ArrowSetDetails({ arrowSet, visible, onClose, onEdit }: Props) {
  const { t } = useTranslation();
  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      <ScrollView style={styles.modalView} showsVerticalScrollIndicator={false} bounces={false}>
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
            <Text style={styles.label}>{t['arrowDetails.material']}</Text>
            <DataValue value={arrowSet.material} capitalize textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t['arrowDetails.arrowCount']}</Text>
            <DataValue value={arrowSet.arrowsCount} textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t['arrowDetails.spine']}</Text>
            <DataValue value={arrowSet.spine} textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t['arrowDetails.weight']}</Text>
            <DataValue value={arrowSet.weight} suffix=" grain" textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t['arrowDetails.length']}</Text>
            <DataValue value={arrowSet.length} suffix={t['arrowDetails.lengthSuffix']} textStyle={styles.value} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t['arrowDetails.diameter']}</Text>
            <DataValue value={arrowSet.diameter} suffix=" mm" textStyle={styles.value} />
          </View>

          {arrowSet.pointType && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['arrowDetails.pointType']}</Text>
              <Text style={styles.value}>{arrowSet.pointType}</Text>
            </View>
          )}

          {arrowSet.pointWeight && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['arrowDetails.pointWeight']}</Text>
              <DataValue value={arrowSet.pointWeight} suffix=" grain" textStyle={styles.value} />
            </View>
          )}

          {arrowSet.vanes && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['arrowDetails.vanes']}</Text>
              <Text style={styles.value}>{arrowSet.vanes}</Text>
            </View>
          )}

          {arrowSet.nock && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['arrowDetails.nock']}</Text>
              <Text style={styles.value}>{arrowSet.nock}</Text>
            </View>
          )}

          {arrowSet.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['arrowDetails.notes']}</Text>
              <Text style={styles.value}>{arrowSet.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ModalWrapper>
  );
}
