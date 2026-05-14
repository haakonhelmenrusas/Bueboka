import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import { handleNumberChange } from '@/utils';
import { Arrows, Material } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { useArrowForm } from '@/components/home/arrowForm/useArrowForm';
import { styles } from './ArrowFormStyles';
import { colors } from '@/styles/colors';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { arrowsRepository } from '@/services/repositories';
import { AppError } from '@/services';
import { useTranslation } from '@/contexts';

interface Props {
  modalVisible: boolean;
  setArrowModalVisible: (visible: boolean) => void;
  arrowSet: Arrows | null;
  existingArrowSets: Arrows[];
}

export default function ArrowForm({ modalVisible, setArrowModalVisible, arrowSet, existingArrowSets }: Props) {
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [
    { name, material, weight, spine, length, diameter, arrowsCount, pointType, pointWeight, vanes, nock, notes, isFavorite },
    dispatch,
  ] = useArrowForm();
  const [prevArrowSet, setPrevArrowSet] = useState<Arrows | null>(null);

  useEffect(() => {
    if (!modalVisible) return;

    if (prevArrowSet !== null && arrowSet === null) {
      clearForm();
      setAdvancedOpen(false);
    }

    if (arrowSet) {
      dispatch({ type: 'SET_NAME', payload: arrowSet.name });
      dispatch({ type: 'SET_WEIGHT', payload: arrowSet.weight?.toString() ?? '' });
      dispatch({ type: 'SET_LENGTH', payload: arrowSet.length?.toString() ?? '' });
      dispatch({ type: 'SET_DIAMETER', payload: arrowSet.diameter?.toString() ?? '' });
      dispatch({ type: 'SET_SPINE', payload: arrowSet.spine ?? '' });
      dispatch({ type: 'SET_MATERIAL', payload: arrowSet.material });
      dispatch({ type: 'SET_ARROWS_COUNT', payload: arrowSet.arrowsCount?.toString() ?? '' });
      dispatch({ type: 'SET_POINT_TYPE', payload: arrowSet.pointType ?? '' });
      dispatch({ type: 'SET_POINT_WEIGHT', payload: arrowSet.pointWeight?.toString() ?? '' });
      dispatch({ type: 'SET_VANES', payload: arrowSet.vanes ?? '' });
      dispatch({ type: 'SET_NOCK', payload: arrowSet.nock ?? '' });
      dispatch({ type: 'SET_NOTES', payload: arrowSet.notes ?? '' });
      dispatch({ type: 'SET_FAVORITE', payload: arrowSet.isFavorite ?? false });
      // Auto-open advanced section if any advanced field is set
      setAdvancedOpen(
        !!(
          arrowSet.length ||
          arrowSet.weight ||
          arrowSet.spine ||
          arrowSet.diameter ||
          arrowSet.pointType ||
          arrowSet.pointWeight ||
          arrowSet.vanes ||
          arrowSet.nock
        ),
      );
    }

    setPrevArrowSet(arrowSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, arrowSet]);

  async function handleDeleteArrowSet() {
    if (!arrowSet) return;

    setSubmitting(true);
    try {
      await arrowsRepository.delete(arrowSet.id);
      clearForm();
      setArrowModalVisible(false);
    } catch (error) {
      console.error('Error deleting arrows:', error);
      alert(error instanceof AppError ? error.message : t['arrowForm.deleteError']);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    clearForm();
    setArrowModalVisible(false);
  }

  async function handleSubmit() {
    if (!name) {
      alert(t['arrowForm.nameRequired']);
      return;
    }

    setSubmitting(true);
    try {
      const arrowsData = {
        name,
        material,
        arrowsCount: arrowsCount ? parseInt(arrowsCount) : undefined,
        diameter: diameter ? parseFloat(diameter) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        length: length ? parseFloat(length) : undefined,
        spine: spine || undefined,
        pointType: pointType || undefined,
        pointWeight: pointWeight ? parseFloat(pointWeight) : undefined,
        vanes: vanes || undefined,
        nock: nock || undefined,
        notes: notes || undefined,
        isFavorite,
      };

      if (arrowSet) {
        await arrowsRepository.update(arrowSet.id, arrowsData);
      } else {
        await arrowsRepository.create(arrowsData);
      }

      // If setting as favorite, unfavorite others
      if (isFavorite) {
        const favoriteArrows = existingArrowSets.filter((a) => a.isFavorite && a.id !== arrowSet?.id);
        for (const favArrow of favoriteArrows) {
          await arrowsRepository.update(favArrow.id, { isFavorite: false });
        }
      }

      clearForm();
      setArrowModalVisible(false);
    } catch (error) {
      console.error('Error saving arrows:', error);
      alert(error instanceof AppError ? error.message : t['arrowForm.saveError']);
    } finally {
      setSubmitting(false);
    }
  }

  function clearForm() {
    dispatch({ type: 'SET_NAME', payload: '' });
    dispatch({ type: 'SET_WEIGHT', payload: '' });
    dispatch({ type: 'SET_LENGTH', payload: '' });
    dispatch({ type: 'SET_MATERIAL', payload: Material.KARBON });
    dispatch({ type: 'SET_SPINE', payload: '' });
    dispatch({ type: 'SET_DIAMETER', payload: '' });
    dispatch({ type: 'SET_ARROWS_COUNT', payload: '' });
    dispatch({ type: 'SET_POINT_TYPE', payload: '' });
    dispatch({ type: 'SET_POINT_WEIGHT', payload: '' });
    dispatch({ type: 'SET_VANES', payload: '' });
    dispatch({ type: 'SET_NOCK', payload: '' });
    dispatch({ type: 'SET_NOTES', payload: '' });
    dispatch({ type: 'SET_FAVORITE', payload: false });
  }

  return (
    <ModalWrapper
      visible={modalVisible}
      onClose={() => {
        clearForm();
        setArrowModalVisible(false);
      }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modal}>
        <ModalHeader onPress={handleCloseModal} title={arrowSet ? t['arrowForm.editTitle'] : t['arrowForm.newTitle']} />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_NAME', payload: value })}
                helpText={t['arrowForm.nameHelpText']}
                label={t['arrowForm.nameLabel']}
                info={t['arrowForm.nameInfo']}
              />
              <View style={styles.row}>
                <Select
                  containerStyle={{ flex: 1 }}
                  label={t['arrowDetails.material']}
                  selectedValue={material}
                  options={[
                    { label: t['arrowMaterial.karbon'], value: Material.KARBON },
                    { label: t['arrowMaterial.aluminium'], value: Material.ALUMINIUM },
                    { label: t['arrowMaterial.treverk'], value: Material.TREVERK },
                  ]}
                  onValueChange={(value) => dispatch({ type: 'SET_MATERIAL', payload: value })}
                />
                <Input
                  containerStyle={{ flex: 1 }}
                  label={t['arrowDetails.arrowCount']}
                  keyboardType="numeric"
                  helpText={t['arrowForm.arrowCountHelpText']}
                  value={arrowsCount}
                  onChangeText={(value) => handleNumberChange(value, 'SET_ARROWS_COUNT', dispatch)}
                />
              </View>

              <Checkbox
                value={isFavorite}
                label={t['common.favourite']}
                onChange={(newValue) => dispatch({ type: 'SET_FAVORITE', payload: newValue })}
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
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['arrowDetails.length']}
                      info={t['arrowDetails.lengthSuffix']}
                      keyboardType="numeric"
                      helpText={t['arrowForm.lengthHelpText']}
                      value={length}
                      onChangeText={(value) => dispatch({ type: 'SET_LENGTH', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['arrowDetails.weight']}
                      info={t['arrowForm.grainSuffix']}
                      keyboardType="numeric"
                      helpText={t['arrowForm.weightHelpText']}
                      value={weight}
                      onChangeText={(value) => handleNumberChange(value, 'SET_WEIGHT', dispatch)}
                    />
                  </View>
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['arrowDetails.spine']}
                      helpText={t['arrowForm.spineHelpText']}
                      value={spine}
                      onChangeText={(value) => dispatch({ type: 'SET_SPINE', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['arrowDetails.diameter']}
                      info={t['arrowForm.mmSuffix']}
                      keyboardType="numeric"
                      helpText={t['arrowForm.diameterHelpText']}
                      value={diameter}
                      onChangeText={(value) => handleNumberChange(value, 'SET_DIAMETER', dispatch)}
                    />
                  </View>
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['arrowDetails.pointType']}
                      helpText={t['arrowForm.pointTypeHelpText']}
                      value={pointType}
                      onChangeText={(value) => dispatch({ type: 'SET_POINT_TYPE', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label={t['arrowDetails.pointWeight']}
                      info={t['arrowForm.grainSuffix']}
                      keyboardType="numeric"
                      helpText={t['arrowForm.pointWeightHelpText']}
                      value={pointWeight}
                      onChangeText={(value) => handleNumberChange(value, 'SET_POINT_WEIGHT', dispatch)}
                    />
                  </View>
                  <Input
                    label={t['arrowDetails.vanes']}
                    helpText={t['arrowForm.vanesHelpText']}
                    value={vanes}
                    onChangeText={(value) => dispatch({ type: 'SET_VANES', payload: value })}
                  />
                  <Input
                    label={t['arrowDetails.nock']}
                    helpText={t['arrowForm.nockHelpText']}
                    value={nock}
                    onChangeText={(value) => dispatch({ type: 'SET_NOCK', payload: value })}
                  />
                </View>
              )}

              <Textarea
                label={t['arrowDetails.notes']}
                optional
                value={notes}
                onChangeText={(value) => dispatch({ type: 'SET_NOTES', payload: value })}
                placeholder={t['arrowForm.notesPlaceholder']}
              />
            </View>
          </Pressable>
        </ScrollView>
        <View style={styles.footer}>
          <Button disabled={!name || submitting} onPress={handleSubmit} label={submitting ? t['form.saving'] : t['form.save']} />
          {arrowSet && (
            <Button
              variant="warning"
              label={t['common.delete']}
              onPress={() => setConfirmVisible(true)}
              type="outline"
              disabled={submitting}>
              <FontAwesomeIcon icon={faTrash} size={16} color={colors.warning} />
            </Button>
          )}
          <Button
            type="outline"
            disabled={submitting}
            onPress={() => {
              clearForm();
              setArrowModalVisible(false);
            }}
            label={t['common.cancel']}
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmModal
        title={t['arrowForm.deleteTitle']}
        message={t['arrowForm.deleteMessage'].replace('{name}', arrowSet?.name ?? '')}
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          handleDeleteArrowSet();
          setConfirmVisible(false);
        }}
      />
    </ModalWrapper>
  );
}
