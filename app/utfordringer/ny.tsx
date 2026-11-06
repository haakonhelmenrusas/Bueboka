import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks';
import { publicProfilesApi } from '@/services';
import type { PublicProfile } from '@/types';
import { styles } from '@/components/challenges/NyChallengeScreenStyles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUser, faArrowLeft, faCheck, faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function CreateChallengePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ opponentId?: string }>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // If opponentId is provided in route params, navigate directly to the form
  useEffect(() => {
    if (params.opponentId) {
      router.replace(`/utfordringer/ny/${params.opponentId}`);
    }
  }, [params.opponentId, router]);

  const fetchProfiles = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const data = await publicProfilesApi.search(q.trim());
        // Filter out the current user
        setProfiles(data.filter((p) => p.id !== user?.id));
      } catch {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

  // Search for profiles
  useEffect(() => {
    if (!query.trim()) {
      setProfiles([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchProfiles(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchProfiles]);

  const handleSelectOpponent = useCallback(
    (profile: PublicProfile) => {
      router.push(`/utfordringer/ny/${profile.id}`);
    },
    [router],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!user) {
    return null;
  }

  // Show opponent search
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Button
              onPress={handleBack}
              label=""
              variant="tertiary"
              type="outline"
              buttonStyle={styles.backButton}
              icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
            />
            <View style={styles.headerContent}>
              <FontAwesomeIcon icon={faTrophy} size={24} color={colors.white} />
              <Text style={styles.title}>{t['challenge.createNew']}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>{t['challenge.searchOpponent']}</Text>
            <View style={styles.searchInputContainer}>
              <FontAwesomeIcon icon={faSearch} size={20} color={'rgba(255, 255, 255, 0.7)'} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t['challenge.searchPlaceholder']}
                placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                value={query}
                onChangeText={setQuery}
              />
            </View>

            {loading && query && <ActivityIndicator size="small" color={colors.white} style={styles.loading} />}

            {profiles.length > 0 && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>{t['common.chooseOption']}</Text>
                <FlatList
                  data={profiles}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.profileItem} onTouchEnd={() => handleSelectOpponent(item)}>
                      <FontAwesomeIcon icon={faUser} size={20} color={colors.white} />
                      <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{item.name || t['challenge.unknownOpponent']}</Text>
                        {item.club && <Text style={styles.profileClub}>{item.club}</Text>}
                      </View>
                      <FontAwesomeIcon icon={faCheck} size={20} color={colors.success} />
                    </View>
                  )}
                  scrollEnabled={false}
                />
              </View>
            )}

            {profiles.length === 0 && query && !loading && <Text style={styles.noResults}>{t['challenge.noOpponents']}</Text>}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
