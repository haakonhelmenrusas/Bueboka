import React, { useState } from 'react';
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
}

export default function CreateTrainingForm({ visible, onClose, bows = [], arrowSets = [], onTrainingSaved }: CreateTrainingFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');
  const [arrows, setArrows] = useState('');

  const bowOptions = bows.map((bow) => ({ label: bow.bowName, value: bow.id }));
  const arrowSetOptions = arrowSets.map((arrowSet) => ({ label: arrowSet.name, value: arrowSet.name }));

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
      const updatedTrainings = [...existingTrainings, training];
      await storeLocalStorage(updatedTrainings, 'trainings');

      if (onTrainingSaved) {
        onTrainingSaved();
      }
    } catch (error) {
      Sentry.captureException('Error saving training to storage', error);
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

  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <View style={styles.container}>
        <ModalHeader title="Ny trening" onPress={handleClose} />
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
            label="Antall piler skutt"
            value={arrows}
            onChangeText={setArrows}
            placeholderText="0"
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />
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
        </ScrollView>
        <View style={styles.footer}>
          <Button label="Lagre og avslutt" onPress={handleSaveAndFinish} buttonStyle={styles.saveButton} />
        </View>
      </View>
    </ModalWrapper>
  );
}
