import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMinus, faPlus, faBullseye } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/react-native';
import { styles } from '@/components/practice/ShootingStyles';
import { Button } from '@/components/common';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShootingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [arrowCount, setArrowCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.totalScore) {
      const initialCount = parseInt(params.totalScore as string) || 0;
      setArrowCount(initialCount);
    }
  }, [params.totalScore]);

  const incrementArrows = () => {
    setArrowCount((prev) => prev + 1);
  };

  const decrementArrows = () => {
    setArrowCount((prev) => Math.max(0, prev - 1));
  };

  const savePractice = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Practice data (including totalScore) is updated via ShootingScoreScreen
      // when actual scores are entered. This screen just tracks arrow count locally.
      router.replace('/(tabs)/practice');
    } catch (error) {
      Sentry.captureException(error);
      Alert.alert('Feil', 'Kunne ikke lagre treningen. Vennligst prøv igjen.');
    } finally {
      setIsSaving(false);
    }
  };

  const openScoring = () => {
    router.push({
      pathname: '/(tabs)/practice/shooting/score',
      params: { ...params, currentCount: arrowCount },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Skyteøkt</Text>
        <View style={styles.arrowCountContainer}>
          <Text style={styles.arrowCountLabel}>Antall piler skutt</Text>
          <Text style={styles.arrowCount}>{arrowCount}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.counterButtonMinus} onPress={decrementArrows}>
            <FontAwesomeIcon icon={faMinus} size={32} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.counterButton} onPress={incrementArrows}>
            <FontAwesomeIcon icon={faPlus} size={40} color={colors.white} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.scoreButton} onPress={openScoring}>
          <FontAwesomeIcon icon={faBullseye} size={20} color={colors.white} />
          <Text style={styles.scoreButtonText}>Registrer piler på skive</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Dato: {params.date}</Text>
        </View>
        <Button
          label={isSaving ? 'Lagrer...' : 'Lagre trening'}
          onPress={savePractice}
          disabled={isSaving}
          loading={isSaving}
          buttonStyle={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}
