import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import { useBowForm } from './useBowForm';
import { handleNumberChange } from '@/utils';
import { Bow, BowType } from '@/types';
import { styles } from './BowFormStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { colors } from '@/styles/colors';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { bowRepository } from '@/services/repositories';
import { AppError } from '@/services';

interface BowFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  bow: Bow | null;
  existingBows: Bow[];
  onSuccess?: () => void;
  onDeleteSuccess?: (bowId: string) => void;
}

const BowForm = ({ modalVisible, setModalVisible, bow, existingBows = [], onSuccess, onDeleteSuccess }: BowFormProps) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sightMarkOpen, setSightMarkOpen] = useState(false);
  const [
    { name, nameError, type, eyeToNock, aimMeasure, eyeToSight, limbs, riser, handOrientation, drawWeight, bowLength, notes, isFavorite },
    dispatch,
  ] = useBowForm();

  // Ensure existingBows is always an array
  const bows = Array.isArray(existingBows) ? existingBows : [];

  useEffect(() => {
    if (!modalVisible) return;

    if (bow) {
      dispatch({ type: 'SET_NAME', payload: bow.name });
      dispatch({ type: 'SET_TYPE', payload: bow.type });
      dispatch({ type: 'SET_EYE_TO_NOCK', payload: bow.eyeToNock?.toString() ?? '' });
      dispatch({ type: 'SET_AIM_MEASURE', payload: bow.aimMeasure?.toString() ?? '' });
      dispatch({ type: 'SET_EYE_TO_SIGHT', payload: bow.eyeToSight?.toString() ?? '' });
      dispatch({ type: 'SET_LIMBS', payload: bow.limbs ?? '' });
      dispatch({ type: 'SET_RISER', payload: bow.riser ?? '' });
      dispatch({ type: 'SET_HAND_ORIENTATION', payload: (bow.handOrientation as 'RH' | 'LH') ?? '' });
      dispatch({ type: 'SET_DRAW_WEIGHT', payload: bow.drawWeight?.toString() ?? '' });
      dispatch({ type: 'SET_BOW_LENGTH', payload: bow.bowLength?.toString() ?? '' });
      dispatch({ type: 'SET_NOTES', payload: bow.notes ?? '' });
      dispatch({ type: 'SET_IS_FAVORITE', payload: bow.isFavorite ?? false });
      // Open advanced section if any advanced field is already set
      setAdvancedOpen(!!(bow.limbs || bow.riser || bow.handOrientation || bow.drawWeight || bow.bowLength));
      // Open sight mark section if any measurement is already set
      setSightMarkOpen(!!(bow.eyeToNock || bow.aimMeasure || bow.eyeToSight));
    } else {
      // Always start fresh when opening in create mode so stale errors are cleared
      clearForm();
      setAdvancedOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bow, modalVisible]);

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
        limbs: limbs || undefined,
        riser: riser || undefined,
        handOrientation: (handOrientation || null) as 'RH' | 'LH' | null,
        drawWeight: drawWeight ? parseFloat(drawWeight) : undefined,
        bowLength: bowLength ? parseFloat(bowLength) : undefined,
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

      // Best-effort: unfavourite other bows. Don't let this block the success path.
      if (isFavorite) {
        const favoriteBows = bows.filter((b) => b.isFavorite && b.id !== bow?.id);
        for (const favBow of favoriteBows) {
          try {
            await bowRepository.update(favBow.id, { isFavorite: false });
          } catch (e) {
            console.error('[BowForm] Could not unfavourite bow:', favBow.id, e);
          }
        }
      }

      clearForm();
      setModalVisible(false);
      onSuccess?.();
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
      onDeleteSuccess?.(bow.id);
      onSuccess?.();
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
    dispatch({ type: 'SET_LIMBS', payload: '' });
    dispatch({ type: 'SET_RISER', payload: '' });
    dispatch({ type: 'SET_HAND_ORIENTATION', payload: '' });
    dispatch({ type: 'SET_DRAW_WEIGHT', payload: '' });
    dispatch({ type: 'SET_BOW_LENGTH', payload: '' });
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
        <ModalHeader onPress={handleCloseModal} title={bow ? 'Rediger bue' : 'Ny bue'} />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_NAME', payload: value })}
                label="Navn på bue"
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
              <Checkbox
                value={isFavorite}
                label="Favoritt"
                onChange={(newValue) => dispatch({ type: 'SET_IS_FAVORITE', payload: newValue })}
              />

              {/* ── Avansert ──────────────────────────────────────────────── */}
              <TouchableOpacity activeOpacity={0.7} style={styles.advancedToggle} onPress={() => setAdvancedOpen((prev) => !prev)}>
                <View style={styles.advancedLine} />
                <View style={styles.advancedLabelWrap}>
                  <Text style={styles.advancedLabel}>Avansert</Text>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size={11}
                    color={colors.textSecondary}
                    style={{ transform: [{ rotate: advancedOpen ? '180deg' : '0deg' }] }}
                  />
                </View>
                <View style={styles.advancedLine} />
              </TouchableOpacity>

              {advancedOpen && (
                <View style={styles.advancedContent}>
                  {/* Row 1: Equipment */}
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Lemmer"
                      value={limbs}
                      onChangeText={(value) => dispatch({ type: 'SET_LIMBS', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Midtstykke"
                      value={riser}
                      onChangeText={(value) => dispatch({ type: 'SET_RISER', payload: value })}
                    />
                  </View>
                  {/* Row 2: Draw specs */}
                  <View style={styles.numberRow}>
                    <Select
                      containerStyle={{ flex: 1, zIndex: 1500 }}
                      label="Hånd"
                      selectedValue={handOrientation}
                      options={[
                        { label: 'Velg hånd', value: '' },
                        { label: 'Høyre (RH)', value: 'RH' },
                        { label: 'Venstre (LH)', value: 'LH' },
                      ]}
                      onValueChange={(value) => dispatch({ type: 'SET_HAND_ORIENTATION', payload: value as 'RH' | 'LH' | '' })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Styrke (pund)"
                      keyboardType="numeric"
                      value={drawWeight}
                      onChangeText={(value) => handleNumberChange(value, 'SET_DRAW_WEIGHT', dispatch)}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Lengde (tommer)"
                      keyboardType="numeric"
                      value={bowLength}
                      onChangeText={(value) => handleNumberChange(value, 'SET_BOW_LENGTH', dispatch)}
                    />
                  </View>
                </View>
              )}

              {/* ── Siktemerke ────────────────────────────────────────────── */}
              <TouchableOpacity activeOpacity={0.7} style={styles.advancedToggle} onPress={() => setSightMarkOpen((prev) => !prev)}>
                <View style={styles.advancedLine} />
                <View style={styles.advancedLabelWrap}>
                  <Text style={styles.advancedLabel}>Siktemerke</Text>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size={11}
                    color={colors.textSecondary}
                    style={{ transform: [{ rotate: sightMarkOpen ? '180deg' : '0deg' }] }}
                  />
                </View>
                <View style={styles.advancedLine} />
              </TouchableOpacity>

              {sightMarkOpen && (
                <View style={styles.numberRow}>
                  <Input
                    containerStyle={{ flex: 1 }}
                    label="Øye til nock (cm)"
                    keyboardType="numeric"
                    value={eyeToNock}
                    onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_NOCK', dispatch)}
                  />
                  <Input
                    containerStyle={{ flex: 1 }}
                    label="Øye til sikte (cm)"
                    keyboardType="numeric"
                    value={eyeToSight}
                    onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_SIGHT', dispatch)}
                  />
                  <Input
                    containerStyle={{ flex: 1 }}
                    label="Målt sikte"
                    keyboardType="numeric"
                    value={aimMeasure}
                    onChangeText={(value) => handleNumberChange(value, 'SET_AIM_MEASURE', dispatch)}
                  />
                </View>
              )}

              <Textarea
                label="Notater (valgfritt)"
                value={notes}
                onChangeText={(value) => dispatch({ type: 'SET_NOTES', payload: value })}
                placeholderText="F.eks. Spesielle innstillinger eller justeringer"
              />
            </View>
          </Pressable>
        </ScrollView>
        <View style={styles.footer}>
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
