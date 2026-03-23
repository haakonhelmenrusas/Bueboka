import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, DatePicker, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import { styles } from './CreatePracticeFormStyles';
import { Arrows, Bow, Environment, Practice, PracticeCategory } from '@/types';
import { useRouter } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { practiceRepository } from '@/services/repositories';

interface CreatePracticeFormProps {
  visible: boolean;
  onClose: () => void;
  bows?: Bow[];
  arrowSets?: Arrows[];
  onPracticeSaved?: () => void;
  editingPractice?: Practice | null;
}

export default function CreatePracticeForm({
  visible,
  onClose,
  bows = [],
  arrowSets = [],
  onPracticeSaved,
  editingPractice = null,
}: CreatePracticeFormProps) {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');
  const [totalScore, setTotalScore] = useState('0');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [environment, setEnvironment] = useState<Environment>(Environment.INDOOR);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Safely handle undefined or null props - ensure always arrays
  const validBows = Array.isArray(bows) ? bows : [];
  const validArrowSets = Array.isArray(arrowSets) ? arrowSets : [];
  const bowOptions = validBows.map((bow) => ({ label: bow.name, value: bow.id }));
  const arrowSetOptions = validArrowSets.map((arrowSet) => ({ label: arrowSet.name, value: arrowSet.id }));

  useEffect(() => {
    if (editingPractice) {
      setDate(new Date(editingPractice.date));
      setSelectedBow(editingPractice.bowId || '');
      setSelectedArrowSet(editingPractice.arrowsId || '');
      setTotalScore(editingPractice.totalScore?.toString() || '0');
      setNotes(editingPractice.notes || '');
      setLocation(editingPractice.location || '');
      setEnvironment(editingPractice.environment || Environment.INDOOR);
    } else {
      resetForm();
    }
  }, [editingPractice, visible]);

  const createPracticeObject = (): Practice => {
    const selectedBowObject = validBows.find((bow) => bow.id === selectedBow);
    const selectedArrowSetObject = validArrowSets.find((arrowSet) => arrowSet.id === selectedArrowSet);

    return {
      id: editingPractice?.id || new Date().getTime().toString() + Math.random().toString(36).substring(2, 9),
      userId: '',
      date: date.toISOString(),
      totalScore: totalScore ? parseInt(totalScore) : 0,
      environment: environment,
      location: location || null,
      bowId: selectedBowObject?.id ?? null,
      arrowsId: selectedArrowSetObject?.id ?? null,
      notes: notes || null,
      rating: null,
      weather: [],
      practiceCategory: PracticeCategory.SKIVE_INDOOR,
      roundTypeId: null,
      ends: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const savePracticeToApi = async (practice: Practice) => {
    try {
      if (editingPractice) {
        // For updates, send only the fields that can be updated
        const updateData = {
          date: new Date(practice.date),
          environment: practice.environment,
          totalScore: practice.totalScore,
          location: practice.location ?? undefined,
          weather: practice.weather,
          bowId: practice.bowId ?? undefined,
          arrowsId: practice.arrowsId ?? undefined,
          notes: practice.notes ?? undefined,
        };
        await practiceRepository.update(editingPractice.id, updateData);
      } else {
        // For creates, don't send the client-generated ID
        const createData = {
          date: new Date(practice.date),
          environment: practice.environment,
          totalScore: practice.totalScore,
          location: practice.location ?? undefined,
          weather: practice.weather,
          bowId: practice.bowId ?? undefined,
          arrowsId: practice.arrowsId ?? undefined,
          notes: practice.notes ?? undefined,
        };
        await practiceRepository.create(createData);
      }
      if (onPracticeSaved) onPracticeSaved();
    } catch (error) {
      console.error('Error saving practice:', error);
      Sentry.captureException('Error saving practice to API', error);
      // Re-throw to show user feedback
      throw error;
    }
  };

  const deletePracticeFromApi = async () => {
    try {
      if (editingPractice) {
        await practiceRepository.delete(editingPractice.id);
        if (onPracticeSaved) onPracticeSaved();
      }
    } catch (error) {
      Sentry.captureException('Error deleting practice from API', error);
    }
  };

  const handleStartShooting = async () => {
    try {
      const createData = {
        date: date,
        environment: environment,
        totalScore: totalScore ? parseInt(totalScore) : 0,
        location: location || undefined,
        bowId: selectedBow || undefined,
        arrowsId: selectedArrowSet || undefined,
        notes: notes || undefined,
      };
      const savedPractice = await practiceRepository.create(createData);
      if (onPracticeSaved) onPracticeSaved();

      router.push({
        pathname: '/practice/shooting',
        params: {
          id: savedPractice.id,
          date: date.toISOString().split('T')[0],
          bowId: selectedBow || '',
          arrowSet: selectedArrowSet || '',
          totalScore: totalScore,
          notes: notes || '',
          environment: environment,
          location: location || '',
        },
      });
      onClose();
    } catch (error) {
      console.error('Error starting shooting session:', error);
      Sentry.captureException(error);
      alert('Kunne ikke starte skyteøkten. Vennligst prøv igjen.');
    }
  };

  const handleSaveAndFinish = async () => {
    try {
      const practiceData = createPracticeObject();
      await savePracticeToApi(practiceData);
      onClose();
    } catch (error) {
      console.error('Error saving practice:', error);
      Sentry.captureException('Error saving and finishing practice', error);
      alert('Kunne ikke lagre treningen. Vennligst prøv igjen.');
    }
  };

  const handleDeletePractice = async () => {
    try {
      await deletePracticeFromApi();
      onClose();
    } catch (error) {
      Sentry.captureException('Error deleting practice', error);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setSelectedBow('');
    setSelectedArrowSet('');
    setTotalScore('0');
    setNotes('');
    setLocation('');
    setEnvironment(Environment.INDOOR);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isEditing = !!editingPractice;

  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <ModalHeader title={isEditing ? 'Rediger trening' : 'Ny trening'} onPress={handleClose} />
            <View style={styles.content}>
              <DatePicker label="Dato" value={date} onDateChange={setDate} containerStyle={styles.inputContainer} testID="date-picker" />
              <Select
                label="🌍 Miljø"
                options={[
                  { label: 'Innendørs', value: Environment.INDOOR },
                  { label: 'Utendørs', value: Environment.OUTDOOR },
                ]}
                selectedValue={environment}
                onValueChange={(value) => setEnvironment(value as Environment)}
                containerStyle={styles.inputContainer}
              />
              <Input
                label="📍 Sted (valgfritt)"
                value={location}
                onChangeText={setLocation}
                placeholder="F.eks. Oslo Bueskytterhall"
                containerStyle={styles.inputContainer}
              />
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
                label="Total score (valgfritt)"
                inputStyle={{ width: '30%' }}
                value={totalScore}
                onChangeText={setTotalScore}
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
              />
              <Textarea
                label="Notater (valgfritt)"
                value={notes}
                onChangeText={setNotes}
                placeholderText="Legg til notater om treningsøkten..."
                containerStyle={styles.inputContainer}
              />
              {!isEditing && <Button label="Start skyting" onPress={handleStartShooting} buttonStyle={styles.startButton} />}
            </View>
            {isEditing && (
              <TouchableOpacity testID="delete-practice-button" onPress={() => setConfirmVisible(true)}>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ padding: 8, marginBottom: 12, alignSelf: 'flex-end' }}
                  color={'#FF0000'}
                  size={20}
                />
              </TouchableOpacity>
            )}
            <View style={styles.footer}>
              <Button
                label={isEditing ? 'Oppdater trening' : 'Lagre og avslutt'}
                onPress={handleSaveAndFinish}
                buttonStyle={styles.saveButton}
              />
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmModal
        visible={confirmVisible}
        title="Slett trening"
        message={'Vil du slette treningen?'}
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          handleDeletePractice();
          setConfirmVisible(false);
        }}
      />
    </ModalWrapper>
  );
}
