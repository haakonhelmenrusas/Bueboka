import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, usePathname } from 'expo-router';
import { PublicProfileList, SearchHero, SearchIdleState } from '@/components/skyttere';
import { publicProfilesApi } from '@/services';
import { PublicProfile } from '@/types';
import { styles } from '@/components/skyttere/SkyttereStyles';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { Message } from '@/components/common';
import { hexToRgba } from '@/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SkytterePage() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Track the previous pathname to detect navigation
  const previousPathname = useRef<string>(pathname);

  // Use Animated instead of useState so focus/blur never triggers a re-render
  // (a setState call inside onFocus can cause the native input to immediately lose focus)
  const focusAnim = useRef(new Animated.Value(0)).current;

  // Clear search when returning to this screen from a different screen
  // (except when coming back from the detail screen)
  useFocusEffect(
    useCallback(() => {
      const isReturningFromDetailScreen = previousPathname.current.startsWith('/skyttere/') && previousPathname.current !== '/skyttere';

      if (!isReturningFromDetailScreen && previousPathname.current !== pathname) {
        // Clear the search when returning from other screens
        setQuery('');
        setProfiles([]);
        setSearched(false);
      }

      // Update previous pathname
      previousPathname.current = pathname;
    }, [pathname]),
  );

  const handleFocus = useCallback(() => {
    Animated.timing(focusAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  }, [focusAnim]);

  const handleBlur = useCallback(() => {
    Animated.timing(focusAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  }, [focusAnim]);

  const animatedSearchStyle = {
    backgroundColor: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [hexToRgba(colors.white, 0.12), hexToRgba(colors.white, 0.18)],
    }),
    borderColor: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [hexToRgba(colors.white, 0.25), hexToRgba(colors.white, 0.5)],
    }),
  };

  const fetchProfiles = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await publicProfilesApi.search(q.trim());
      setProfiles(data);
      setSearched(true);
    } catch {
      setProfiles([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearched(false);
      setProfiles([]);
      return;
    }
    const timer = setTimeout(() => fetchProfiles(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchProfiles]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Message title="Ikke innlogget" description="Vennligst logg inn for å søke etter bueskyttere." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          keyboardShouldPersistTaps="always">
          <SearchHero
            query={query}
            onQueryChange={setQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            animatedSearchStyle={animatedSearchStyle}
          />
          <View style={styles.results}>
            {!loading && !searched ? (
              <SearchIdleState />
            ) : (
              <PublicProfileList profiles={profiles} loading={loading} searched={searched} query={query} />
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
