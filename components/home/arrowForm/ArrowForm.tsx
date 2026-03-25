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

interface Props {
  modalVisible: boolean;
  setArrowModalVisible: (visible: boolean) => void;
  arrowSet: Arrows | null;
  existingArrowSets: Arrows[];
}

export default function ArrowForm({ modalVisible, setArrowModalVisible, arrowSet, existingArrowSets }: Props) {
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
      if (error instanceof AppError) {
        alert(error.message);
      } else {
        alert('Kunne ikke slette pilsett');
      }
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
      alert('Navn er påkrevd');
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
        // Edit mode
        await arrowsRepository.update(arrowSet.id, arrowsData);
      } else {
        // Create mode
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
      if (error instanceof AppError) {
        alert(error.message);
      } else {
        alert('Kunne ikke lagre pilsett');
      }
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
        <ModalHeader onPress={handleCloseModal} title={arrowSet ? 'Rediger pilsett' : 'Nytt pilsett'} />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_NAME', payload: value })}
                helpText="F.eks. Carbon X23"
                label="Navn på pilsett"
                info="(obligatorisk)"
              />
              <View style={styles.row}>
                <Select
                  containerStyle={{ flex: 1 }}
                  label="Materiale"
                  selectedValue={material}
                  options={[
                    { label: 'Karbon', value: Material.KARBON },
                    { label: 'Aluminium', value: Material.ALUMINIUM },
                    { label: 'Treverk', value: Material.TREVERK },
                  ]}
                  onValueChange={(value) => dispatch({ type: 'SET_MATERIAL', payload: value })}
                />
                <Input
                  containerStyle={{ flex: 1 }}
                  label="Antall piler"
                  keyboardType="numeric"
                  helpText="F.eks. 12"
                  value={arrowsCount}
                  onChangeText={(value) => handleNumberChange(value, 'SET_ARROWS_COUNT', dispatch)}
                />
              </View>

              <Checkbox
                value={isFavorite}
                label="Favoritt"
                onChange={(newValue) => dispatch({ type: 'SET_FAVORITE', payload: newValue })}
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
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Lengde"
                      info="(tommer)"
                      keyboardType="numeric"
                      helpText="F.eks. 31"
                      value={length}
                      onChangeText={(value) => dispatch({ type: 'SET_LENGTH', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Vekt"
                      info="(grain)"
                      keyboardType="numeric"
                      helpText="F.eks. 400"
                      value={weight}
                      onChangeText={(value) => handleNumberChange(value, 'SET_WEIGHT', dispatch)}
                    />
                  </View>
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Spine"
                      helpText="F.eks. 500"
                      value={spine}
                      onChangeText={(value) => dispatch({ type: 'SET_SPINE', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Diameter"
                      info="(mm)"
                      keyboardType="numeric"
                      helpText="F.eks. 5.2"
                      value={diameter}
                      onChangeText={(value) => handleNumberChange(value, 'SET_DIAMETER', dispatch)}
                    />
                  </View>
                  <View style={styles.row}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Pilspisstype"
                      helpText="F.eks. Bullet"
                      value={pointType}
                      onChangeText={(value) => dispatch({ type: 'SET_POINT_TYPE', payload: value })}
                    />
                    <Input
                      containerStyle={{ flex: 1 }}
                      label="Spissvekt"
                      info="(grain)"
                      keyboardType="numeric"
                      helpText="F.eks. 100"
                      value={pointWeight}
                      onChangeText={(value) => handleNumberChange(value, 'SET_POINT_WEIGHT', dispatch)}
                    />
                  </View>
                  <Input
                    label="Vanes"
                    helpText="F.eks. Bohning X Vanes"
                    value={vanes}
                    onChangeText={(value) => dispatch({ type: 'SET_VANES', payload: value })}
                  />
                  <Input
                    label="Nock"
                    helpText="F.eks. Easton G Nock"
                    value={nock}
                    onChangeText={(value) => dispatch({ type: 'SET_NOCK', payload: value })}
                  />
                </View>
              )}

              <Textarea
                label="Notater"
                optional
                value={notes}
                onChangeText={(value) => dispatch({ type: 'SET_NOTES', payload: value })}
                placeholder="Ekstra informasjon om pilsettet"
              />
            </View>
          </Pressable>
        </ScrollView>
        <View style={styles.footer}>
          <Button disabled={!name || submitting} onPress={handleSubmit} label={submitting ? 'Lagrer...' : 'Lagre'} />
          {arrowSet && (
            <Button variant="warning" label="Slett" onPress={() => setConfirmVisible(true)} type="outline" disabled={submitting}>
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
            label="Avbryt"
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmModal
        title={'Slett pilsett'}
        message={'Vil du slette pilsettet "' + arrowSet?.name + '"?'}
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
