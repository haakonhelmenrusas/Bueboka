import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Input, ModalHeader, ModalWrapper, Select } from '@/components/common';
import { styles } from './CreateTrainingFormStyles';
import { ArrowSet, Bow, Training } from '@/types';
import { Link } from 'expo-router';
import { getLocalStorage, storeLocalStorage } from '@/utils';
import * as Sentry from '@sentry/react-native';

interface CreateTrainingFormProps {
  visible: boolean;
  onClose: () => void;
  bows?: Bow[];
  arrowSets?: ArrowSet[];
  onTrainingSaved?: () => void;
  editingTraining?: Training | null;
}

export default function CreateTrainingForm({
  visible,
  onClose,
  bows = [],
  arrowSets = [],
  onTrainingSaved,
  editingTraining = null,
}: CreateTrainingFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');
  const [arrows, setArrows] = useState('0');

  const bowOptions = bows.map((bow) => ({ label: bow.bowName, value: bow.id }));
  const arrowSetOptions = arrowSets.map((arrowSet) => ({ label: arrowSet.name, value: arrowSet.name }));

  useEffect(() => {
    if (editingTraining) {
      setDate(editingTraining.date.toISOString().split('T')[0]);
      setSelectedBow(editingTraining.bow?.id || '');
      setSelectedArrowSet(editingTraining.arrowSet?.name || '');
      setArrows(editingTraining.arrows.toString());
    } else {
      resetForm();
    }
  }, [editingTraining, visible]);

  const createTrainingObject = (): Training => {
    const selectedBowObject = bows.find((bow) => bow.id === selectedBow);
    const selectedArrowSetObject = arrowSets.find((arrowSet) => arrowSet.name === selectedArrowSet);

    return {
      date: new Date(date),
      arrows: arrows ? parseInt(arrows) : 0,
      bow: selectedBowObject,
      arrowSet: selectedArrowSetObject,
    };
  };

  const saveTrainingToStorage = async (training: Training) => {
    try {
      const existingTrainings = (await getLocalStorage<Training[]>('trainings')) || [];

      if (editingTraining) {
        // Update existing training - find by index instead of field matching
        const trainingIndex = existingTrainings.findIndex((t, index) => {
          // If training has an ID, use it for matching
          if (editingTraining.id && t.id) {
            return t.id === editingTraining.id;
          }
          // Otherwise, try to match by multiple fields as fallback
          const dateMatches = new Date(t.date).getTime() === editingTraining.date.getTime();
          const arrowsMatch = t.arrows === editingTraining.arrows;
          const bowMatches = t.bow?.id === editingTraining.bow?.id;
          const arrowSetMatches = t.arrowSet?.name === editingTraining.arrowSet?.name;

          return dateMatches && arrowsMatch && bowMatches && arrowSetMatches;
        });

        if (trainingIndex !== -1) {
          // Update the existing training at the found index
          const updatedTrainings = [...existingTrainings];
          updatedTrainings[trainingIndex] = {
            ...training,
            id: editingTraining.id || training.id, // Preserve the ID if it exists
          };
          await storeLocalStorage(updatedTrainings, 'trainings');
        } else {
          // If we can't find the training to update, add it as new
          const updatedTrainings = [...existingTrainings, training];
          await storeLocalStorage(updatedTrainings, 'trainings');
        }
      } else {
        // Add new training with a unique ID
        const newTraining = {
          ...training,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        const updatedTrainings = [...existingTrainings, newTraining];
        await storeLocalStorage(updatedTrainings, 'trainings');
      }

      if (onTrainingSaved) {
        onTrainingSaved();
      }
    } catch (error) {
      Sentry.captureException('Error saving training to storage', error);
    }
  };
  const deleteTrainingFromStorage = async () => {
    try {
      const existingTrainings = (await getLocalStorage<Training[]>('trainings')) || [];

      if (editingTraining) {
        // Find and remove the training
        const trainingIndex = existingTrainings.findIndex((t) => {
          // If training has an ID, use it for matching
          if (editingTraining.id && t.id) {
            return t.id === editingTraining.id;
          }
          // Otherwise, try to match by multiple fields as fallback
          const dateMatches = new Date(t.date).getTime() === editingTraining.date.getTime();
          const arrowsMatch = t.arrows === editingTraining.arrows;
          const bowMatches = t.bow?.id === editingTraining.bow?.id;
          const arrowSetMatches = t.arrowSet?.name === editingTraining.arrowSet?.name;

          return dateMatches && arrowsMatch && bowMatches && arrowSetMatches;
        });

        if (trainingIndex !== -1) {
          // Remove the training at the found index
          const updatedTrainings = existingTrainings.filter((_, index) => index !== trainingIndex);
          await storeLocalStorage(updatedTrainings, 'trainings');

          if (onTrainingSaved) {
            onTrainingSaved();
          }
        }
      }
    } catch (error) {
      Sentry.captureException('Error deleting training from storage', error);
    }
  };

  const handleStartShooting = () => {
    try {
      const trainingData = createTrainingObject();
      saveTrainingToStorage(trainingData).then(() => onClose());
    } catch (error) {
      Sentry.captureException('Error starting shooting session', error);
    }
  };

  const handleSaveAndFinish = async () => {
    try {
      const trainingData = createTrainingObject();
      await saveTrainingToStorage(trainingData);
      onClose();
    } catch (error) {
      Sentry.captureException('Error saving and finishing training', error);
    }
  };

  const handleDeleteTraining = async () => {
    try {
      await deleteTrainingFromStorage();
      onClose();
    } catch (error) {
      Sentry.captureException('Error deleting training', error);
    }
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedBow('');
    setSelectedArrowSet('');
    setArrows('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const trainingData = createTrainingObject();
  const shootingParams = {
    date: trainingData.date.toISOString().split('T')[0],
    bowId: selectedBow,
    arrowSet: selectedArrowSet,
    arrows: trainingData.arrows.toString(),
  };

  const isEditing = !!editingTraining;

  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <View style={styles.container}>
        <ModalHeader title={isEditing ? 'Rediger trening' : 'Ny trening'} onPress={handleClose} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Dato"
            value={date}
            onChangeText={setDate}
            placeholderText="YYYY-MM-DD"
            keyboardType="default"
            containerStyle={styles.inputContainer}
          />
          {bowOptions.length > 0 && (
            <Select
              label="Bue (valgfritt)"
              options={bowOptions}
              selectedValue={selectedBow}
              onValueChange={setSelectedBow}
              containerStyle={styles.inputContainer}
            />
          )}
          {arrowSetOptions.length > 0 && (
            <Select
              label="Pilsett (valgfritt)"
              options={arrowSetOptions}
              selectedValue={selectedArrowSet}
              onValueChange={setSelectedArrowSet}
              containerStyle={styles.inputContainer}
            />
          )}
          <Input
            label="Antall piler skutt allerede"
            value={arrows}
            onChangeText={setArrows}
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />
          {!isEditing && (
            <Link
              href={{
                pathname: '/training/shooting',
                params: shootingParams,
              }}
              onPress={handleStartShooting}
              asChild
              style={styles.startButton}>
              <Button label="Start skyting" />
            </Link>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <Button
            label={isEditing ? 'Oppdater trening' : 'Lagre og avslutt'}
            onPress={handleSaveAndFinish}
            buttonStyle={styles.saveButton}
          />
          {isEditing && <Button variant="warning" type="outline" label="Slett trening" onPress={handleDeleteTraining} />}
        </View>
      </View>
    </ModalWrapper>
  );
}
