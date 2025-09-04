import { Text, TouchableOpacity, View } from 'react-native';
import { Training } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { styles } from './TrainingCardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/colors';

interface TrainingCardProps {
  training: Training;
  onEdit?: (training: Training) => void;
}

export default function TrainingCard({ training, onEdit }: TrainingCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(training);
    }
  };

  return (
    <View style={styles.trainingCard}>
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.tertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientAccent}
      />
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.date}>
            {training.date.toLocaleDateString('nb-NO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.arrowCount}>{training.arrows} piler</Text>
        </View>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <LinearGradient
            colors={['#f59e0b', '#f97316', '#ef4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.editButtonGradient}>
            <FontAwesomeIcon icon={faEdit} size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
