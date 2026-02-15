import { Text, TouchableOpacity, View } from 'react-native';
import { Practice } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { styles } from './PracticeCardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/colors';

interface PracticeCardProps {
  practice: Practice;
  onEdit?: (practice: Practice) => void;
}

export default function PracticeCard({ practice, onEdit }: PracticeCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(practice);
    }
  };

  const totalArrows = practice.ends?.reduce((sum, end) => sum + end.arrows, 0) || 0;
  const practiceDate = practice.date instanceof Date ? practice.date : new Date(practice.date);
  const environmentLabel = practice.environment === 'INDOOR' ? '🏠 Innendørs' : '🌲 Utendørs';

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
            {practiceDate.toLocaleDateString('nb-NO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.arrowCount}>{totalArrows} piler</Text>
          {practice.totalScore > 0 && <Text style={styles.score}>Poeng: {practice.totalScore}</Text>}
          <Text style={styles.environment}>{environmentLabel}</Text>
          {practice.location && <Text style={styles.location}>📍 {practice.location}</Text>}
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
