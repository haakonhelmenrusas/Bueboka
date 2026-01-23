import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, DatePicker, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import { styles } from './CreatePracticeFormStyles';
import { Arrows, Bow, Environment, Practice } from '@/types';
import { Link } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import ConfirmModal from '@/components/profile/DeleteArrowSetModal/ConfirmModal';
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
  const [date, setDate] = useState(new Date());
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');
  const [totalScore, setTotalScore] = useState('0');
  const [notes, setNotes] = useState('');
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
    } else {
      resetForm();
    }
  }, [editingPractice, visible]);

  const createPracticeObject = (): Practice => {
    const selectedBowObject = validBows.find((bow) => bow.id === selectedBow);
    const selectedArrowSetObject = validArrowSets.find((arrowSet) => arrowSet.id === selectedArrowSet);

    return {
      id: editingPractice?.id || new Date().getTime().toString() + Math.random().toString(36).substring(2, 9),
      date: new Date(date),
      totalScore: totalScore ? parseInt(totalScore) : 0,
      environment: Environment.INDOOR, // Default environment
      bowId: selectedBowObject?.id,
      arrowsId: selectedArrowSetObject?.id,
      notes: notes || undefined,
    };
  };

  const savePracticeToApi = async (practice: Practice) => {
    try {
      if (editingPractice) {
        await practiceRepository.update(editingPractice.id, practice);
      } else {
        await practiceRepository.create(practice);
      }
      if (onPracticeSaved) onPracticeSaved();
    } catch (error) {
      Sentry.captureException('Error saving practice to API', error);
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
      await savePracticeToApi(practiceData);
      onClose();
    } catch (error) {
      Sentry.captureException('Error starting shooting session', error);
    }
  };

  const handleSaveAndFinish = async () => {
    try {
      const practiceData = createPracticeObject();
      await savePracticeToApi(practiceData);
      onClose();
    } catch (error) {
      Sentry.captureException('Error saving and finishing practice', error);
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const practiceData = createPracticeObject();
  const shootingParams = {
    id: practiceData.id,
    date: practiceData.date.toISOString().split('T')[0],
    bowId: selectedBow,
    arrowSet: selectedArrowSet,
    totalScore: totalScore,
    notes: practiceData.notes,
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
              {!isEditing && (
                <Link
                  href={{
                    pathname: '/practice/shooting',
                    params: shootingParams,
                  }}
                  onPress={handleStartShooting}
                  asChild
                  style={styles.startButton}>
                  <Button label="Start skyting" />
                </Link>
              )}
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
