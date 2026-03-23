import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Input, ModalHeader, ModalWrapper, Select, Textarea, Toggle } from '@/components/common';
import { handleNumberChange } from '@/utils';
import { Arrows, Material } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useArrowForm } from '@/components/home/arrowForm/useArrowForm';
import { styles } from './ArrowFormStyles';
import { colors } from '@/styles/colors';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
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
  const [
    { name, material, weight, spine, length, diameter, arrowsCount, pointType, pointWeight, vanes, nock, notes, isFavorite },
    dispatch,
  ] = useArrowForm();
  const [prevArrowSet, setPrevArrowSet] = useState<Arrows | null>(null);

  useEffect(() => {
    if (!modalVisible) return;

    if (prevArrowSet !== null && arrowSet === null) {
      clearForm();
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
    }

    setPrevArrowSet(arrowSet);
  }, [modalVisible, arrowSet, dispatch]);

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
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <ModalHeader onPress={handleCloseModal} title={arrowSet ? 'Rediger pilsett' : 'Nytt pilsett'} />
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_NAME', payload: value })}
                placeholderText="F.eks. Carbon X23"
                label="Navn på pilsett (obligatorisk)"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Select
                  containerStyle={{ width: '48%' }}
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
                  containerStyle={{ width: '48%' }}
                  label="Antall piler"
                  keyboardType="numeric"
                  placeholderText="F.eks. 12"
                  value={arrowsCount}
                  onChangeText={(value) => handleNumberChange(value, 'SET_ARROWS_COUNT', dispatch)}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Lengde (tommer)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 31"
                  value={length}
                  onChangeText={(value) => dispatch({ type: 'SET_LENGTH', payload: value })}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Vekt (grain)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 400"
                  value={weight}
                  onChangeText={(value) => handleNumberChange(value, 'SET_WEIGHT', dispatch)}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Spine"
                  placeholderText="F.eks. 500"
                  value={spine}
                  onChangeText={(value) => dispatch({ type: 'SET_SPINE', payload: value })}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Diameter (mm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 5.2"
                  value={diameter}
                  onChangeText={(value) => handleNumberChange(value, 'SET_DIAMETER', dispatch)}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Pilspisstype"
                  placeholderText="F.eks. Bullet"
                  value={pointType}
                  onChangeText={(value) => dispatch({ type: 'SET_POINT_TYPE', payload: value })}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Spissvekt (grain)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 100"
                  value={pointWeight}
                  onChangeText={(value) => handleNumberChange(value, 'SET_POINT_WEIGHT', dispatch)}
                />
              </View>
              <Input
                label="Vanes"
                placeholderText="F.eks. Bohning X Vanes"
                value={vanes}
                onChangeText={(value) => dispatch({ type: 'SET_VANES', payload: value })}
              />
              <Input
                label="Nock"
                placeholderText="F.eks. Easton G Nock"
                value={nock}
                onChangeText={(value) => dispatch({ type: 'SET_NOCK', payload: value })}
              />
              <Textarea
                label="Notater (valgfritt)"
                value={notes}
                onChangeText={(value) => dispatch({ type: 'SET_NOTES', payload: value })}
                placeholderText="Ekstra informasjon om pilsettet"
              />
              <Toggle value={isFavorite} label="Favoritt" onToggle={() => dispatch({ type: 'SET_FAVORITE', payload: !isFavorite })} />
            </View>
            <View style={{ marginTop: 'auto' }}>
              {arrowSet && (
                <Button variant="warning" label="Slett" onPress={() => setConfirmVisible(true)} type="outline" disabled={submitting}>
                  <FontAwesomeIcon icon={faTrash} size={16} color={colors.warning} />
                </Button>
              )}
              <Button disabled={!name || submitting} onPress={handleSubmit} label={submitting ? 'Lagrer...' : 'Lagre'} />
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
          </Pressable>
        </ScrollView>
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
