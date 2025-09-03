import { Text, TouchableOpacity, View } from 'react-native';
import { Training } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { styles } from './TrainingCardStyles';

interface TrainingCardProps {
  training: Training;
}
export default function TrainingCard({ training }: TrainingCardProps) {
  return (
    <View style={styles.trainingCard}>
      <View>
        <Text style={styles.date}>
          {training.date.toLocaleDateString('nb-NO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.arrowCount}>{training.arrows} piler</Text>
      </View>
      <TouchableOpacity onPress={() => {}}>
        <FontAwesomeIcon style={styles.icon} icon={faInfoCircle} />
      </TouchableOpacity>
    </View>
  );
}
