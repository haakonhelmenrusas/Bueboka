import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { styles } from '@/components/intro/IntroStyles';

export const INTRO_SEEN_KEY = 'bueboka_has_seen_intro';

export default function IntroScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const markSeenAndNavigate = async () => {
    await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
    router.replace('/auth');
  };

  return (
    <LinearGradient colors={[colors.primaryDark, colors.primary, '#0a4a63']} locations={[0, 0.55, 1]} style={styles.gradient}>
      {/* Decorative background rings — subtle target-face motif */}
      <View style={[styles.ring, styles.ring1]} />
      <View style={[styles.ring, styles.ring2]} />
      <View style={[styles.ring, styles.ring3]} />
      <View style={[styles.ring, styles.ring4]} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <Image source={require('../assets/images/logo-main-dark.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>Bueboka</Text>
          </View>

          {/* Hero copy */}
          <View style={styles.heroSection}>
            <Text style={styles.tagline}>{t['intro.tagline']}</Text>
            <Text style={styles.title}>
              {t['intro.titleLine1']}
              {'\n'}
              <Text style={styles.titleAccent}>{t['intro.titleLine2']}</Text>
            </Text>
            <Text style={styles.body}>{t['intro.body']}</Text>
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <Button
              label={t['intro.getStarted']}
              onPress={markSeenAndNavigate}
              variant="tertiary"
              width="100%"
              buttonStyle={styles.ctaButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
