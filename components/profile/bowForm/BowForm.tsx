import { Keyboard, KeyboardAvoidingView, Platform, Pressable, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import { useBowForm } from './useBowForm';
import { handleNumberChange } from '@/utils';
import { Bow, BowType } from '@/types';
import { styles } from './BowFormStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { colors } from '@/styles/colors';
import ConfirmModal from '@/components/profile/DeleteArrowSetModal/ConfirmModal';
import { bowRepository } from '@/services/repositories';
import { AppError } from '@/services';

interface BowFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  bow: Bow | null;
  existingBows: Bow[];
}

const BowForm = ({ modalVisible, setModalVisible, bow, existingBows = [] }: BowFormProps) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [{ name, nameError, type, eyeToNock, aimMeasure, eyeToSight, notes, isFavorite }, dispatch] = useBowForm();
  const [prevBow, setPrevBow] = useState<Bow | null>(null);

  // Ensure existingBows is always an array
  const bows = Array.isArray(existingBows) ? existingBows : [];

  useEffect(() => {
    if (!modalVisible) return;

    // Clear form if we're switching from editing to creating new
    if (prevBow !== null && bow === null) {
      clearForm();
    }

    if (bow) {
      dispatch({ type: 'SET_NAME', payload: bow.name });
      dispatch({ type: 'SET_TYPE', payload: bow.type });
      dispatch({ type: 'SET_EYE_TO_NOCK', payload: bow.eyeToNock?.toString() ?? '' });
      dispatch({ type: 'SET_AIM_MEASURE', payload: bow.aimMeasure?.toString() ?? '' });
      dispatch({ type: 'SET_EYE_TO_SIGHT', payload: bow.eyeToSight?.toString() ?? '' });
      dispatch({ type: 'SET_NOTES', payload: bow.notes ?? '' });
      dispatch({ type: 'SET_IS_FAVORITE', payload: bow.isFavorite ?? false });
    }

    setPrevBow(bow);
  }, [bow, dispatch, modalVisible]);

  async function handleSubmit() {
    if (!name) {
      dispatch({ type: 'SET_NAME_ERROR', payload: true });
      return;
    }

    setSubmitting(true);
    try {
      const bowData = {
        name,
        type: type as BowType,
        eyeToNock: eyeToNock ? parseFloat(eyeToNock) : undefined,
        aimMeasure: aimMeasure ? parseFloat(aimMeasure) : undefined,
        eyeToSight: eyeToSight ? parseFloat(eyeToSight) : undefined,
        notes: notes || undefined,
        isFavorite,
      };

      if (bow) {
        // Edit mode
        await bowRepository.update(bow.id, bowData);
      } else {
        // Create mode
        if (bows.length >= 5) {
          alert('Du kan ikke ha mer enn 5 buer');
          return;
        }
        await bowRepository.create(bowData);
      }

      // If setting as favorite, unfavorite others
      if (isFavorite) {
        const favoriteBows = bows.filter((b) => b.isFavorite && b.id !== bow?.id);
        for (const favBow of favoriteBows) {
          await bowRepository.update(favBow.id, { isFavorite: false });
        }
      }

      clearForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving bow:', error);
      if (error instanceof AppError) {
        alert(error.message);
      } else {
        alert('Kunne ikke lagre bue');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!bow) return;

    setSubmitting(true);
    try {
      await bowRepository.delete(bow.id);
      clearForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting bow:', error);
      if (error instanceof AppError) {
        alert(error.message);
      } else {
        alert('Kunne ikke slette bue');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    clearForm();
    setModalVisible(false);
  }

  function clearForm() {
    dispatch({ type: 'SET_NAME', payload: '' });
    dispatch({ type: 'SET_NAME_ERROR', payload: false });
    dispatch({ type: 'SET_TYPE', payload: BowType.RECURVE });
    dispatch({ type: 'SET_EYE_TO_NOCK', payload: '' });
    dispatch({ type: 'SET_AIM_MEASURE', payload: '' });
    dispatch({ type: 'SET_EYE_TO_SIGHT', payload: '' });
    dispatch({ type: 'SET_NOTES', payload: '' });
    dispatch({ type: 'SET_IS_FAVORITE', payload: false });
  }

  return (
    <ModalWrapper
      visible={modalVisible}
      onClose={() => {
        clearForm();
        setModalVisible(false);
      }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modal}>
        <View style={{ flex: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <ModalHeader onPress={handleCloseModal} title={bow ? 'Rediger bue' : 'Ny bue'} />
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_NAME', payload: value })}
                placeholderText="F.eks. Hoyt"
                label="Navn på bue (obligatorisk)"
                error={nameError}
                errorMessage="Du må fylle inn navn på bue"
              />
              <Select
                containerStyle={{ zIndex: 2000 }}
                label="Buetype"
                selectedValue={type}
                options={[
                  { label: 'Recurve', value: BowType.RECURVE },
                  { label: 'Compound', value: BowType.COMPOUND },
                  { label: 'Langbue', value: BowType.LONGBOW },
                  { label: 'Barebow', value: BowType.BAREBOW },
                  { label: 'Rytterbue', value: BowType.HORSEBOW },
                  { label: 'Tradisjonell', value: BowType.TRADITIONAL },
                  { label: 'Annet', value: BowType.OTHER },
                ]}
                onValueChange={(value) => dispatch({ type: 'SET_TYPE', payload: value })}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Øye til nock (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 10"
                  value={eyeToNock}
                  onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_NOCK', dispatch)}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Siktemåling (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 90"
                  value={aimMeasure}
                  onChangeText={(value) => handleNumberChange(value, 'SET_AIM_MEASURE', dispatch)}
                />
              </View>
              <Input
                keyboardType="numeric"
                containerStyle={{ width: '48%', marginBottom: 16 }}
                label={'Øye til sikte (cm)'}
                value={eyeToSight}
                placeholderText="F.eks. 5"
                onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_SIGHT', dispatch)}
              />
              <Checkbox
                value={isFavorite}
                label="Favoritt"
                onChange={(newValue) => dispatch({ type: 'SET_IS_FAVORITE', payload: newValue })}
              />
              <Textarea
                label="Notater (valgfritt)"
                value={notes}
                onChangeText={(value) => dispatch({ type: 'SET_NOTES', payload: value })}
                placeholderText="F.eks. Spesielle innstillinger eller justeringer"
              />
            </View>
            <View style={{ marginTop: 'auto' }}>
              {bow && (
                <TouchableOpacity style={styles.trashIcon} onPress={() => setConfirmVisible(true)}>
                  <FontAwesomeIcon icon={faTrashCan} size={16} color={colors.error} />
                </TouchableOpacity>
              )}
              <Button disabled={!name || submitting} onPress={handleSubmit} label={submitting ? 'Lagrer...' : 'Lagre'} />
              <Button
                type="outline"
                onPress={() => {
                  clearForm();
                  setModalVisible(false);
                }}
                label="Avbryt"
              />
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <ConfirmModal
        visible={confirmVisible}
        title="Slett bue"
        message={'Vil du slette buen "' + name + '"?'}
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          handleDelete();
          setConfirmVisible(false);
        }}
      />
    </ModalWrapper>
  );
};

export default BowForm;
