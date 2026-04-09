import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowDown, faArrowLeft, faBuilding, faChartBar, faHashtag, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { publicProfilesApi } from '@/services';
import { PublicProfile } from '@/types';
import { styles } from '@/components/skyttere/PublicProfileDetailStyles';
import { colors } from '@/styles/colors';
import { Message } from '@/components/common';
import { hexToRgba } from '@/utils';

export default function PublicProfileDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hide tab bar when this screen is focused
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  useEffect(() => {
    if (!id) return;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await publicProfilesApi.getById(id);
        setProfile(data);
      } catch (err: any) {
        console.error('[PublicProfileDetail] Error fetching profile:', err);
        setError(err.message || 'Kunne ikke laste profil');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Laster profil...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <View style={[styles.scrollContent, { paddingTop: insets.top }]}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.white} />
              <Text style={styles.backText}>Tilbake til søk</Text>
            </Pressable>
            <Message title="Profil ikke funnet" description={error || 'Kunne ikke finne den forespurte profilen'} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.white} />
            <Text style={styles.backText}>Tilbake til søk</Text>
          </Pressable>

          <View style={styles.card}>
            <View style={styles.avatarWrap}>
              {profile.image ? (
                <Image source={{ uri: profile.image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <FontAwesomeIcon icon={faUserRegular} size={40} color={hexToRgba(colors.primary, 0.3)} />
                </View>
              )}
            </View>

            <Text style={styles.name}>{profile.name || 'Ukjent navn'}</Text>

            {(profile.club || profile.skytternr) && (
              <View style={styles.badges}>
                {profile.club && (
                  <View style={styles.clubBadge}>
                    <FontAwesomeIcon icon={faBuilding} size={13} color={colors.primary} />
                    <Text style={styles.badgeText}>{profile.club}</Text>
                  </View>
                )}
                {profile.skytternr && (
                  <View style={styles.skytternrBadge}>
                    <FontAwesomeIcon icon={faHashtag} size={13} color={colors.primary} />
                    <Text style={styles.badgeText}>{profile.skytternr}</Text>
                  </View>
                )}
              </View>
            )}

            {profile.stats && (
              <View style={styles.statsSection}>
                <Text style={styles.statsTitle}>Statistikk</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <FontAwesomeIcon icon={faArrowDown} size={20} color={colors.primary} style={styles.statIcon} />
                    <Text style={styles.statValue}>{profile.stats.totalArrows.toLocaleString('nb-NO')}</Text>
                    <Text style={styles.statLabel}>Piler skutt totalt</Text>
                  </View>
                  {profile.stats.avgScorePerArrow !== null && (
                    <View style={styles.statItem}>
                      <FontAwesomeIcon icon={faChartBar} size={20} color={colors.primary} style={styles.statIcon} />
                      <Text style={styles.statValue}>
                        {profile.stats.avgScorePerArrow.toLocaleString('nb-NO', {
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                      <Text style={styles.statLabel}>Snittpoeng per pil</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {profile.achievementCount != null && (
              <View style={styles.statsSection}>
                <Text style={styles.statsTitle}>Prestasjoner</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <FontAwesomeIcon icon={faTrophy} size={20} color={colors.primary} style={styles.statIcon} />
                    <Text style={styles.statValue}>{profile.achievementCount}</Text>
                    <Text style={styles.statLabel}>Prestasjoner oppnådd</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
