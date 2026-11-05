import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ModalWrapper, ModalHeader } from '@/components/common';
import ChallengeForm from './ChallengeForm';
import { useChallenge } from '@/hooks/useChallenge';
import { publicProfilesApi } from '@/services';
import type { PublicProfile } from '@/types';
import { useAuth } from '@/hooks';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';
import { styles } from './CreateChallengeModalStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Called after a challenge was created (e.g. to refresh lists) */
  onSaved?: () => void;
}

/**
 * "Ny utfordring" modal: pick an opponent by searching public profiles,
 * then fill in the challenge form.
 */
export default function CreateChallengeModal({ visible, onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createChallenge } = useChallenge();

  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState<PublicProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setQuery('');
    setProfiles([]);
    setSearching(false);
    setOpponent(null);
    setSubmitting(false);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  // Debounced opponent search
  useEffect(() => {
    if (!visible) return;
    if (!query.trim()) {
      setProfiles([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await publicProfilesApi.search(query.trim());
        setProfiles(data.filter((p) => p.id !== user?.id));
      } catch {
        setProfiles([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, visible, user?.id]);

  const handleSubmit = useCallback(
    async (data: Parameters<typeof createChallenge>[0]) => {
      setSubmitting(true);
      setError(null);
      try {
        await createChallenge(data, opponent?.name ?? undefined);
        onSaved?.();
        handleClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : t['common.unknownError']);
      } finally {
        setSubmitting(false);
      }
    },
    [createChallenge, opponent?.name, onSaved, handleClose, t],
  );

  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <View style={styles.modal}>
        <ModalHeader onPress={handleClose} title={t['challenge.createNew']} />
        {opponent ? (
          <ChallengeForm
            opponent={opponent}
            onSubmit={handleSubmit}
            onCancel={() => setOpponent(null)}
            loading={submitting}
            error={error}
          />
        ) : (
          <View style={styles.body}>
            <Text style={styles.sectionTitle}>{t['challenge.searchOpponent']}</Text>
            <View style={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} size={16} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                testID="challenge-opponent-search"
                style={styles.searchInput}
                placeholder={t['challenge.searchPlaceholder']}
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={setQuery}
              />
            </View>

            {searching && <ActivityIndicator size="small" color={colors.primary} style={styles.loading} />}

            <FlatList
              data={profiles}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                query.trim() && !searching ? <Text style={styles.noResults}>{t['challenge.noOpponents']}</Text> : undefined
              }
              renderItem={({ item }) => (
                <TouchableOpacity testID={`challenge-opponent-${item.id}`} style={styles.profileItem} onPress={() => setOpponent(item)}>
                  <FontAwesomeIcon icon={faUser} size={18} color={colors.primary} />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{item.name || t['challenge.unknownOpponent']}</Text>
                    {item.club ? <Text style={styles.profileClub}>{item.club}</Text> : null}
                  </View>
                  <FontAwesomeIcon icon={faCheck} size={16} color={colors.success} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </ModalWrapper>
  );
}
