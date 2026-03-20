import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import { PublicProfileList } from '@/components/skyttere';
import { publicProfilesApi } from '@/services';
import { PublicProfile } from '@/types';
import { styles } from './SkyttereStyles';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { Message } from '@/components/common';

export default function SkytterePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fetchProfiles = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await publicProfilesApi.search(q.trim());
      setProfiles(data);
      setSearched(true);
    } catch (_error) {
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

  const showIdle = !loading && !searched;

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <FontAwesomeIcon icon={faUsers} size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Finn bueskyttere</Text>
            <Text style={styles.subtitle}>
              Søk blant bueskyttere som har valgt å dele profilen sin med andre Bueboka-skyttere. Det er kun registrerte brukere som kan søke.
            </Text>

            {/* Search Input */}
            <View style={[styles.searchWrap, isFocused && styles.searchWrapFocused]}>
              <View style={styles.searchIcon}>
                <FontAwesomeIcon icon={faSearch} size={20} color="rgba(255, 255, 255, 0.5)" />
              </View>
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Søk etter navn eller klubb…"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
          </View>

          {/* Results Section */}
          <View style={styles.results}>
            {showIdle ? (
              <View style={styles.idle}>
                <View style={styles.idleTarget}>
                  <View style={[styles.idleRing, styles.idleRing1]} />
                  <View style={[styles.idleRing, styles.idleRing2]} />
                  <View style={[styles.idleRing, styles.idleRing3]} />
                  <View style={styles.idleCenter}>
                    <FontAwesomeIcon icon={faUsers} size={28} color="#FFFFFF" />
                  </View>
                </View>
                <Text style={styles.idleHint}>Begynn å skrive for å søke</Text>
              </View>
            ) : (
              <PublicProfileList profiles={profiles} loading={loading} searched={searched} query={query} />
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
