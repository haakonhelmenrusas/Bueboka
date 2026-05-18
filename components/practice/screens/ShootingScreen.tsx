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
import { useTranslation } from '@/contexts';

export default function ShootingScreen() {
  const t = useTranslation();
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
      router.replace('/(tabs)/home');
    } catch (error) {
      Sentry.captureException(error);
      Alert.alert(t['common.error'], t['shootingScreen.saveError']);
    } finally {
      setIsSaving(false);
    }
  };

  const openScoring = () => {
    router.push({
      pathname: '/(tabs)/home/shooting-score',
      params: { ...params, currentCount: arrowCount },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t['shootingScreen.title']}</Text>
        <View style={styles.arrowCountContainer}>
          <Text style={styles.arrowCountLabel}>{t['shootingScreen.arrowCountLabel']}</Text>
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
          <Text style={styles.scoreButtonText}>{t['shootingScreen.registerOnTarget']}</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{t['shootingScreen.dateLabel']}{params.date}</Text>
        </View>
        <Button
          label={isSaving ? t['form.saving'] : t['shootingScreen.save']}
          onPress={savePractice}
          disabled={isSaving}
          loading={isSaving}
          buttonStyle={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}
