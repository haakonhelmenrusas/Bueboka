import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, TouchableOpacity, View } from 'react-native';
import { Button, DatePicker, Input, ModalHeader, ModalWrapper, Select } from '@/components/common';
import { styles } from './CreateTrainingFormStyles';
import { ArrowSet, Bow, Training } from '@/types';
import { Link } from 'expo-router';
import { getLocalStorage, storeLocalStorage } from '@/utils';
import * as Sentry from '@sentry/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import ConfirmModal from '@/components/profile/DeleteArrowSetModal/ConfirmModal';

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
  const [date, setDate] = useState(new Date());
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');
  const [arrows, setArrows] = useState('0');
  const [confirmVisible, setConfirmVisible] = useState(false);

  const bowOptions = bows.map((bow) => ({ label: bow.bowName, value: bow.id }));
  const arrowSetOptions = arrowSets.map((arrowSet) => ({ label: arrowSet.name, value: arrowSet.name }));

  useEffect(() => {
    if (editingTraining) {
      setDate(editingTraining.date);
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
      id: editingTraining?.id || new Date().getTime().toString() + Math.random().toString(36).substring(2, 9),
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
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
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
    setDate(new Date());
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
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <ModalHeader title={isEditing ? 'Rediger trening' : 'Ny trening'} onPress={handleClose} />
          <View style={styles.content}>
            <DatePicker label="Dato" value={date} onDateChange={setDate} containerStyle={styles.inputContainer} testID="date-picker" />
            {bowOptions.length > 0 && (
              <Select
                label="🏹 Bue (valgfritt)"
                options={bowOptions}
                selectedValue={selectedBow}
                onValueChange={setSelectedBow}
                containerStyle={styles.inputContainer}
              />
            )}
            {arrowSetOptions.length > 0 && (
              <Select
                label="🎯 Pilsett (valgfritt)"
                options={arrowSetOptions}
                selectedValue={selectedArrowSet}
                onValueChange={setSelectedArrowSet}
                containerStyle={styles.inputContainer}
              />
            )}
            <Input
              label="Antall piler skutt allerede"
              inputStyle={{ width: '30%' }}
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
          </View>
          <View style={styles.footer}>
            {isEditing && (
              <TouchableOpacity onPress={() => setConfirmVisible(true)}>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ padding: 4, marginBottom: 12, alignSelf: 'flex-end' }}
                  color={'#FF0000'}
                  size={20}
                  testID="delete-training-button"
                />
              </TouchableOpacity>
            )}
            <Button
              label={isEditing ? 'Oppdater trening' : 'Lagre og avslutt'}
              onPress={handleSaveAndFinish}
              buttonStyle={styles.saveButton}
            />
          </View>
        </Pressable>
      </View>
      <ConfirmModal
        visible={confirmVisible}
        title="Slett bue"
        message={'Vil du slette treningen?'}
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          handleDeleteTraining();
          setConfirmVisible(false);
        }}
      />
    </ModalWrapper>
  );
}
