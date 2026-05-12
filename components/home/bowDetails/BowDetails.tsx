import { Pressable, Text, View, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Bow } from '@/types';
import { styles } from '../DetailsStyles';
import { colors } from '@/styles/colors';
import { capitalizeFirstLetter } from '@/utils';
import { DataValue, ModalWrapper } from '@/components/common';
import { useTranslation } from '@/contexts';

interface Props {
  bow: Bow;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function BowDetails({ bow, visible, onClose, onEdit }: Props) {
  const { t } = useTranslation();
  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      <ScrollView style={styles.modalView} showsVerticalScrollIndicator={false} bounces={false}>
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
            <Text style={styles.label}>{t['bowDetails.type']}</Text>
            <Text style={styles.value}>{capitalizeFirstLetter(bow.type)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t['bowDetails.eyeToNock']}</Text>
            <DataValue textStyle={styles.value} value={bow.eyeToNock} suffix=" cm" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t['bowDetails.eyeToSight']}</Text>
            <DataValue textStyle={styles.value} value={bow.eyeToSight} suffix=" cm" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t['bowDetails.aimMeasure']}</Text>
            <DataValue textStyle={styles.value} value={bow.aimMeasure} suffix=" cm" />
          </View>
          {bow.limbs && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['bowDetails.limbs']}</Text>
              <Text style={styles.value}>{bow.limbs}</Text>
            </View>
          )}
          {bow.riser && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['bowDetails.riser']}</Text>
              <Text style={styles.value}>{bow.riser}</Text>
            </View>
          )}
          {bow.handOrientation && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['bowDetails.hand']}</Text>
              <Text style={styles.value}>{bow.handOrientation === 'RH' ? t['bowDetails.handRH'] : t['bowDetails.handLH']}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>{t['bowDetails.drawWeight']}</Text>
            <DataValue textStyle={styles.value} value={bow.drawWeight} suffix={t['bowDetails.poundsSuffix']} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t['bowDetails.bowLength']}</Text>
            <DataValue textStyle={styles.value} value={bow.bowLength} suffix={'"'} />
          </View>
          {bow.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>{t['bowDetails.notes']}</Text>
              <Text style={styles.value}>{bow.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ModalWrapper>
  );
}
