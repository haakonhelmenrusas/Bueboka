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
import { useTranslation } from '@/contexts';

interface BowFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  bow: Bow | null;
  existingBows: Bow[];
  onSuccess?: () => void;
  onDeleteSuccess?: (bowId: string) => void;
}

const BowForm = ({ modalVisible, setModalVisible, bow, existingBows = [], onSuccess, onDeleteSuccess }: BowFormProps) => {
  const { t } = useTranslation();
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
        await bowRepository.update(bow.id, bowData);
      } else {
        if (bows.length >= 5) {
          alert(t['bowForm.maxBowsError']);
          return;
        }
        await bowRepository.create(bowData);
      }

      clearForm();
      setModalVisible(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving bow:', error);
      alert(error instanceof AppError ? error.message : t['bowForm.saveError']);
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
      alert(error instanceof AppError ? error.message : t['bowForm.deleteError']);
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
        <ModalHeader onPress={handleCloseModal} title={bow ? t['bowForm.editTitle'] : t['bowForm.newTitle']} />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_NAME', payload: value })}
                label={t['bowForm.nameLabel']}
                error={nameError}
                errorMessage={t['bowForm.nameRequired']}
              />
              <Select
                containerStyle={{ zIndex: 2000 }}
                label={t['bowForm.typeLabel']}
                selectedValue={type}
                options={[
                  { label: t['bowType.recurve'], value: BowType.RECURVE },
                  { label: t['bowType.compound'], value: BowType.COMPOUND },
                  { label: t['bowType.longbow'], value: BowType.LONGBOW },
                  { label: t['bowType.barebow'], value: BowType.BAREBOW },
                  { label: t['bowType.horsebow'], value: BowType.HORSEBOW },
                  { label: t['bowType.traditional'], value: BowType.TRADITIONAL },
                  { label: t['bowType.other'], value: BowType.OTHER },
                ]}
                onValueChange={(value) => dispatch({ type: 'SET_TYPE', payload: value })}
              />
              <Checkbox
                value={isFavorite}
                label={t['common.favourite']}
                onChange={(newValue) => dispatch({ type: 'SET_IS_FAVORITE', payload: newValue })}
              />
              <TouchableOpacity activeOpacity={0.7} style={styles.advancedToggle} onPress={() => setAdvancedOpen((prev) => !prev)}>
                <View style={styles.advancedLine} />
                <View style={styles.advancedLabelWrap}>
                  <Text style={styles.advancedLabel}>{t['common.advanced']}</Text>
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
                  <Select
                    containerStyle={{ flex: 1, zIndex: 1500 }}
                    label={t['bowDetails.hand']}
                    selectedValue={handOrientation}
                    options={[
                      { label: t['bowForm.handPlaceholder'], value: '' },
                      { label: t['bowDetails.handRH'], value: 'RH' },
                      { label: t['bowDetails.handLH'], value: 'LH' },
                    ]}
                    onValueChange={(value) => dispatch({ type: 'SET_HAND_ORIENTATION', payload: value as 'RH' | 'LH' | '' })}
                  />
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['bowDetails.limbs']}
                      value={limbs}
                      onChangeText={(value) => dispatch({ type: 'SET_LIMBS', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['bowDetails.riser']}
                      value={riser}
                      onChangeText={(value) => dispatch({ type: 'SET_RISER', payload: value })}
                    />
                  </View>
                  <View style={styles.numberRow}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['bowForm.drawWeight']}
                      keyboardType="numeric"
                      value={drawWeight}
                      onChangeText={(value) => handleNumberChange(value, 'SET_DRAW_WEIGHT', dispatch)}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['bowForm.bowLength']}
                      keyboardType="numeric"
                      value={bowLength}
                      onChangeText={(value) => handleNumberChange(value, 'SET_BOW_LENGTH', dispatch)}
                    />
                  </View>
                </View>
              )}
              <TouchableOpacity activeOpacity={0.7} style={styles.advancedToggle} onPress={() => setSightMarkOpen((prev) => !prev)}>
                <View style={styles.advancedLine} />
                <View style={styles.advancedLabelWrap}>
                  <Text style={styles.advancedLabel}>{t['bowForm.sightMarksSection']}</Text>
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
                    label={t['bowForm.eyeToNock']}
                    keyboardType="numeric"
                    value={eyeToNock}
                    onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_NOCK', dispatch)}
                  />
                  <Input
                    containerStyle={{ flex: 1 }}
                    label={t['bowForm.eyeToSight']}
                    keyboardType="numeric"
                    value={eyeToSight}
                    onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_SIGHT', dispatch)}
                  />
                  <Input
                    containerStyle={{ flex: 1 }}
                    label={t['bowDetails.aimMeasure']}
                    keyboardType="numeric"
                    value={aimMeasure}
                    onChangeText={(value) => handleNumberChange(value, 'SET_AIM_MEASURE', dispatch)}
                  />
                </View>
              )}

              <Textarea
                label={t['bowDetails.notes']}
                optional
                value={notes}
                onChangeText={(value) => dispatch({ type: 'SET_NOTES', payload: value })}
                placeholderText={t['bowForm.notesPlaceholder']}
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
          <Button disabled={!name || submitting} onPress={handleSubmit} label={submitting ? t['form.saving'] : t['form.save']} />
          <Button
            type="outline"
            onPress={() => {
              clearForm();
              setModalVisible(false);
            }}
            label={t['common.cancel']}
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmModal
        visible={confirmVisible}
        title={t['bowForm.deleteTitle']}
        message={t['bowForm.deleteMessage'].replace('{name}', name)}
        confirmLabel={t['common.delete']}
        cancelLabel={t['common.cancel']}
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
