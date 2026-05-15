import { Pressable, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from './PublicProfileDetailStyles';
import { useTranslation } from '@/contexts';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export default function BackButton({ onPress, label }: BackButtonProps) {
  const { t } = useTranslation();
  const displayLabel = label ?? t['skyttere.backButton'];
  return (
    <Pressable onPress={onPress} style={styles.backButton}>
      <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.white} />
      <Text style={styles.backText}>{displayLabel}</Text>
    </Pressable>
  );
}
