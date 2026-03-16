import { Text, View } from 'react-native';
import { styles } from './SummaryStyles';
import { Practice } from '@/types';
import { sumArrows } from '../helpers/sumArrows';

interface SummaryProps {
  practices: Practice[];
}
export default function Summary({ practices }: SummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oppsummering</Text>
      <View style={styles.textLine}>
        <Text style={styles.subtitle}>Siste 7 dagene</Text>
        <Text style={styles.arrowCount}>{sumArrows(practices, '7days')}</Text>
      </View>
      <View style={styles.textLine}>
        <Text style={styles.subtitle}>Denne måneden</Text>
        <Text style={styles.arrowCount}>{sumArrows(practices, 'month')}</Text>
      </View>
      <View style={styles.textLine}>
        <Text style={styles.subtitle}>Totalt</Text>
        <Text style={styles.arrowCount}>{sumArrows(practices)}</Text>
      </View>
    </View>
  );
}
