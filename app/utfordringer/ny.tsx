import { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, Text, ActivityIndicator, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks';
import { publicProfilesApi } from '@/services';
import { useChallenge } from '@/hooks/useChallenge';
import type { PublicProfile, CreateChallengeData } from '@/types';
import { styles } from './nyStyles.styles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUser, faArrowLeft, faCheck, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { ChallengeForm } from '@/components/challenges';

export default function CreateChallengePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ opponentId?: string }>();
  const insets = useSafeAreaInsets();
  const { createChallenge } = useChallenge();

  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load opponent if opponentId is provided in route params
  useEffect(() => {
    if (params.opponentId && !selectedOpponent) {
      loadOpponent(params.opponentId);
    }
  }, [params.opponentId, selectedOpponent, loadOpponent]);

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

  const loadOpponent = useCallback(
    async (opponentId: string) => {
      setInitLoading(true);
      try {
        const data = await publicProfilesApi.getById(opponentId);
        // Filter out the current user
        if (data.id !== user?.id) {
          setSelectedOpponent(data);
          setQuery('');
          setProfiles([]);
        }
      } catch (err) {
        console.error('Error loading opponent:', err);
      } finally {
        setInitLoading(false);
      }
    },
    [user?.id],
  );

  const fetchProfiles = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const data = await publicProfilesApi.search(q.trim());
        // Filter out the current user
        setProfiles(data.filter((p) => p.id !== user?.id));
      } catch (err) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

  const handleSelectOpponent = useCallback((profile: PublicProfile) => {
    setSelectedOpponent(profile);
    setQuery('');
    setProfiles([]);
    setFormError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (selectedOpponent) {
      setSelectedOpponent(null);
      setFormError(null);
    } else {
      router.back();
    }
  }, [selectedOpponent, router]);

  const handleCancelForm = useCallback(() => {
    setSelectedOpponent(null);
    setQuery('');
    setProfiles([]);
    setFormError(null);
  }, []);

  const handleSubmitForm = useCallback(
    async (data: CreateChallengeData) => {
      setFormLoading(true);
      setFormError(null);
      try {
        await createChallenge(data);
        router.back();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : t['common.unknownError']);
      } finally {
        setFormLoading(false);
      }
    },
    [createChallenge, router, t],
  );

  if (!user) {
    return null;
  }

  // Show loading if we're loading an opponent from route params
  if (initLoading && !selectedOpponent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Show the challenge form when an opponent is selected
  if (selectedOpponent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, flex: 1 }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <View style={styles.scrollContent}>
            <View style={styles.header}>
              <Button
                onPress={handleBack}
                label=""
                variant="tertiary"
                style={styles.backButton}
                icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
              />
              <View style={styles.headerContent}>
                <FontAwesomeIcon icon={faTrophy} size={24} color={colors.white} />
                <Text style={styles.title}>{t['challenge.createNew']}</Text>
              </View>
            </View>

            <View style={styles.content}>
              {/* Selected opponent info */}
              <View style={styles.selectedOpponentContainer}>
                <Text style={styles.selectedOpponentLabel}>{t['challenge.selectedOpponent']}</Text>
                <View style={styles.selectedOpponentInfo}>
                  <FontAwesomeIcon icon={faUser} size={20} color={colors.white} />
                  <View style={styles.opponentDetails}>
                    <Text style={styles.opponentName}>{selectedOpponent.name || t['challenge.unknownOpponent']}</Text>
                    {selectedOpponent.club && <Text style={styles.opponentClub}>{selectedOpponent.club}</Text>}
                  </View>
                </View>
              </View>

              {/* Form container with light background */}
              <View style={styles.formContainer}>
                <ChallengeForm
                  opponent={selectedOpponent}
                  onSubmit={handleSubmitForm}
                  onCancel={handleCancelForm}
                  loading={formLoading}
                  error={formError}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
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
              style={styles.backButton}
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
              <Input
                label=""
                placeholder={t['challenge.searchPlaceholder']}
                value={query}
                onChangeText={setQuery}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
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
