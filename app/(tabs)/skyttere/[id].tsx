import { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { publicProfilesApi } from '@/services';
import { PublicProfile } from '@/types';
import { styles } from '@/components/skyttere/PublicProfileDetailStyles';
import { colors } from '@/styles/colors';
import { Message } from '@/components/common';
import { BackButton, LoadingState, ProfileHeader, ProfileStats, ProfileAchievements } from '@/components/skyttere';

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
          <LoadingState />
        </LinearGradient>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <View style={[styles.scrollContent, { paddingTop: insets.top }]}>
            <BackButton onPress={() => router.back()} />
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
          <BackButton onPress={() => router.back()} />

          <View style={styles.card}>
            <ProfileHeader name={profile.name} image={profile.image} club={profile.club} skytternr={profile.skytternr} />

            {profile.stats && <ProfileStats totalArrows={profile.stats.totalArrows} avgScorePerArrow={profile.stats.avgScorePerArrow} />}

            {profile.achievementCount != null && <ProfileAchievements achievementCount={profile.achievementCount} />}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
