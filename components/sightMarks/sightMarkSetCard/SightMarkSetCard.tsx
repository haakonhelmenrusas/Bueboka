import { Text, View } from 'react-native';
import { Button } from '@/components/common';
import MarksTable from '@/components/sightMarks/marksTable/MarksTable';
import { CalculatedMarks, SightMark } from '@/types';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors } from '@/styles/colors';
import { styles } from './SightMarkSetCardStyles';

interface SightMarkSetCardProps {
  sightMark: SightMark;
  onAddMark: () => void;
  onDeleteMark: (index: number) => void;
  onDeleteSet: () => void;
  status: 'idle' | 'pending' | 'error';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SightMarkSetCard({ sightMark, onAddMark, onDeleteMark, onDeleteSet, status }: SightMarkSetCardProps) {
  const ballistics = sightMark.ballisticsParameters as CalculatedMarks | null;
  const markCount = sightMark.givenMarks?.length ?? 0;
  const displayName = sightMark.name ?? sightMark.bowSpec?.bow?.name ?? 'Innskyting';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.date}>{formatDate(sightMark.createdAt)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{markCount} merker</Text>
        </View>
        <Button
          type="outline"
          size="small"
          iconPosition="left"
          icon={<FontAwesomeIcon icon={faPlus} size={12} color={colors.white} />}
          label="Legg til"
          onPress={onAddMark}
          buttonStyle={{ borderColor: colors.white }}
          textStyle={{ color: colors.white }}
        />
      </View>

      {/* Marks rows */}
      {markCount > 0 && (
        <>
          <View style={styles.divider} />
          <MarksTable ballistics={ballistics} removeMark={onDeleteMark} status={status} />
        </>
      )}

      {/* Footer actions */}
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Button
          size="small"
          iconPosition="left"
          icon={<FontAwesomeIcon icon={faTrash} size={12} color="rgba(255,255,255,0.7)" />}
          label="Slett innskyting"
          onPress={onDeleteSet}
          buttonStyle={{ flex: 1, borderWidth: 0, backgroundColor: 'transparent' }}
          textStyle={{ color: 'rgba(255,255,255,0.95)' }}
        />
      </View>
    </View>
  );
}
