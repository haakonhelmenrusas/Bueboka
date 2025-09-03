import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getLocalStorage, storeLocalStorage } from '@/utils';
import { ArrowSet, Bow, Training } from '@/types';
import * as Sentry from '@sentry/react-native';
import { styles } from '@/components/training/ShootingStyles';
import { Button } from '@/components/common';

export default function ShootingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [arrowCount, setArrowCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.arrows) {
      const initialCount = parseInt(params.arrows as string) || 0;
      setArrowCount(initialCount);
    }
  }, [params.arrows]);

  const incrementArrows = () => {
    setArrowCount((prev) => prev + 1);
  };

  const decrementArrows = () => {
    setArrowCount((prev) => Math.max(0, prev - 1));
  };

  const saveTraining = async () => {
    if (isSaving) return; // Prevent double-saving

    setIsSaving(true);
    try {
      const existingTrainings = (await getLocalStorage<Training[]>('trainings')) || [];

      let selectedBow: Bow | undefined;
      let selectedArrowSet: ArrowSet | undefined;

      if (params.bowId) {
        const bows = (await getLocalStorage<Bow[]>('bows')) || [];
        selectedBow = bows.find((bow) => bow.id === params.bowId);
      }

      if (params.arrowSet) {
        const arrowSets = (await getLocalStorage<ArrowSet[]>('arrowSets')) || [];
        selectedArrowSet = arrowSets.find((arrowSet) => arrowSet.name === params.arrowSet);
      }

      const sessionDate = new Date((params.date as string) || new Date().toISOString().split('T')[0]);

      const newTraining: Training = {
        date: sessionDate,
        arrows: arrowCount,
        bow: selectedBow,
        arrowSet: selectedArrowSet,
      };

      // Find existing training that matches this session
      const existingIndex = existingTrainings.findIndex((training) => {
        const trainingDate = new Date(training.date);
        const isSameDate = trainingDate.toDateString() === sessionDate.toDateString();
        const isSameBow = (!training.bow && !selectedBow) || training.bow?.id === selectedBow?.id;
        const isSameArrowSet = (!training.arrowSet && !selectedArrowSet) || training.arrowSet?.name === selectedArrowSet?.name;

        return isSameDate && isSameBow && isSameArrowSet;
      });

      if (existingIndex !== -1) {
        existingTrainings[existingIndex] = newTraining;
      } else {
        existingTrainings.push(newTraining);
      }

      // Wait for the save operation to complete
      await storeLocalStorage(existingTrainings, 'trainings');

      await new Promise((resolve) => setTimeout(resolve, 100));

      router.replace('/(tabs)/training');
    } catch (error) {
      Sentry.captureException('Error saving training from shooting screen', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skyteøkt</Text>
      <View style={styles.arrowCountContainer}>
        <Text style={styles.arrowCountLabel}>Antall piler skutt</Text>
        <Text style={styles.arrowCount}>{arrowCount}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.counterButton} onPress={decrementArrows}>
          <FontAwesomeIcon icon={faMinus} size={40} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.counterButton} onPress={incrementArrows}>
          <FontAwesomeIcon icon={faPlus} size={40} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Dato: {params.date}</Text>
        {params.bowId && <Text style={styles.infoText}>Bue ID: {params.bowId}</Text>}
        {params.arrowSet && <Text style={styles.infoText}>Pilsett: {params.arrowSet}</Text>}
      </View>
      <Button
        label={isSaving ? 'Lagrer...' : 'Lagre trening'}
        onPress={saveTraining}
        disabled={isSaving}
        loading={isSaving}
        buttonStyle={styles.saveButton}
      />
    </View>
  );
}
