import { Text, TouchableOpacity, View } from 'react-native';
import { Training } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { styles } from './TrainingCardStyles';
import { LinearGradient } from 'expo-linear-gradient';

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
      {/* Gradient background accent */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#d946ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientAccent}
      />

      {/* Main content */}
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

          {/* Equipment info with gradient background */}
          {(training.bow || training.arrowSet) && (
            <View style={styles.equipmentContainer}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.equipmentGradient}
              />
              {training.bow && <Text style={styles.equipmentText}>🏹 {training.bow.bowName}</Text>}
              {training.arrowSet && <Text style={styles.equipmentText}>📍 {training.arrowSet.name}</Text>}
            </View>
          )}
        </View>

        {/* Edit button with gradient */}
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
