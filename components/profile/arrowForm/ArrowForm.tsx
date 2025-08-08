import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Input, ModalWrapper, Select, Toggle } from '@/components/common';
import { handleNumberChange, storeLocalStorage } from '@/utils';
import { ArrowSet, Material } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { useArrowForm } from '@/components/profile/arrowForm/useArrowForm';
import { styles } from './ArrowFormStyles';
import { colors } from '@/styles/colors';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmModal from '@/components/profile/DeleteArrowSetModal/ConfirmModal';

interface Props {
  modalVisible: boolean;
  setArrowModalVisible: (visible: boolean) => void;
  arrowSet: ArrowSet | null;
  existingArrowSets: ArrowSet[];
}

export default function ArrowForm({ modalVisible, setArrowModalVisible, arrowSet, existingArrowSets }: Props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [{ name, material, weight, spine, length, diameter, numberOfArrows, isFavorite }, dispatch] = useArrowForm();
  const [prevArrowSet, setPrevArrowSet] = useState<ArrowSet | null>(null);

  useEffect(() => {
    if (!modalVisible) return;

    if (prevArrowSet !== null && arrowSet === null) {
      clearForm();
    }

    if (arrowSet) {
      dispatch({ type: 'SET_ARROW_NAME', payload: arrowSet.name });
      dispatch({ type: 'SET_ARROW_WEIGHT', payload: arrowSet.weight ? arrowSet.weight.toString() : '' });
      dispatch({ type: 'SET_ARROW_LENGTH', payload: arrowSet.length ? arrowSet.length.toString() : '' });
      dispatch({ type: 'SET_DIAMETER', payload: arrowSet.diameter ? arrowSet.diameter.toString() : '' });
      dispatch({ type: 'SET_SPINE', payload: arrowSet.spine ? arrowSet.spine.toString() : '' });
      dispatch({ type: 'SET_MATERIAL', payload: arrowSet.material });
      dispatch({ type: 'SET_NUMBER_OF_ARROWS', payload: arrowSet.numberOfArrows ? arrowSet.numberOfArrows.toString() : '' });
      dispatch({ type: 'SET_FAVORITE', payload: arrowSet.isFavorite ?? false });
    }

    setPrevArrowSet(arrowSet);
  }, [modalVisible, arrowSet]);

  const handleDeleteArrowSet = async (target: ArrowSet) => {
    const updatedList = existingArrowSets.filter((set) => set.name !== target.name);
    await AsyncStorage.setItem('arrowSets', JSON.stringify(updatedList));
    clearForm();
    setArrowModalVisible(false);
  };

  async function handleSubmit() {
    const newArrowSet: ArrowSet = {
      name,
      material,
      diameter: parseFloat(diameter),
      weight: parseFloat(weight),
      spine: parseFloat(spine),
      length: parseFloat(length),
      numberOfArrows: parseFloat(numberOfArrows),
      isFavorite: isFavorite,
    };

    let updatedList: ArrowSet[];

    if (arrowSet) {
      // Edit mode: replace the existing one by name
      updatedList = existingArrowSets.map((set) => (set.name === arrowSet.name ? newArrowSet : set));
    } else {
      // Create mode: add a new set, prevent duplicate names
      const isDuplicate = existingArrowSets.some((set) => set.name === newArrowSet.name);

      updatedList = isDuplicate ? existingArrowSets : [...existingArrowSets, newArrowSet];
    }

    if (newArrowSet.isFavorite) {
      updatedList = updatedList.map((set) => ({
        ...set,
        isFavorite: set.name === newArrowSet.name,
      }));
    }

    await storeLocalStorage(updatedList, 'arrowSets');

    clearForm();
    setArrowModalVisible(false);
  }

  function clearForm() {
    dispatch({ type: 'SET_ARROW_NAME', payload: '' });
    dispatch({ type: 'SET_ARROW_WEIGHT', payload: '' });
    dispatch({ type: 'SET_ARROW_LENGTH', payload: '' });
    dispatch({ type: 'SET_MATERIAL', payload: Material.Karbon });
    dispatch({ type: 'SET_SPINE', payload: '' });
    dispatch({ type: 'SET_DIAMETER', payload: '' });
    dispatch({ type: 'SET_NUMBER_OF_ARROWS', payload: '' });
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
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1, flexGrow: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Nytt pilsett</Text>
              <Pressable
                onPress={() => {
                  clearForm();
                  setArrowModalVisible(false);
                }}>
                <FontAwesomeIcon size={20} icon={faXmark} />
              </Pressable>
            </View>
            <View style={styles.inputs}>
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_ARROW_NAME', payload: value })}
                placeholderText="F.eks. Hoyt"
                label="Navn på pilsett"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Select
                  containerStyle={{ width: '48%' }}
                  label="Materiale"
                  selectedValue={material}
                  options={[
                    { label: 'Treverk', value: 'Treverk' },
                    { label: 'Karbon', value: 'Karbon' },
                    { label: 'Aluminium', value: 'Aluminium' },
                  ]}
                  onValueChange={(value) => dispatch({ type: 'SET_MATERIAL', payload: value })}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Lengde (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 90"
                  value={length}
                  onChangeText={(value) => dispatch({ type: 'SET_ARROW_LENGTH', payload: value })}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Vekt (g)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 20"
                  value={weight}
                  onChangeText={(value) => handleNumberChange(value, 'SET_ARROW_WEIGHT', dispatch)}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Spine"
                  keyboardType="numeric"
                  placeholderText="F.eks. 250"
                  value={spine}
                  onChangeText={(value) => handleNumberChange(value, 'SET_SPINE', dispatch)}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Diameter (mm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 6"
                  value={diameter}
                  onChangeText={(value) => handleNumberChange(value, 'SET_DIAMETER', dispatch)}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Antall piler"
                  keyboardType="numeric"
                  placeholderText="F.eks. 6"
                  value={numberOfArrows}
                  onChangeText={(value) => handleNumberChange(value, 'SET_NUMBER_OF_ARROWS', dispatch)}
                />
              </View>
              <Toggle value={isFavorite} label="Favoritt" onToggle={() => dispatch({ type: 'SET_FAVORITE', payload: !isFavorite })} />
            </View>
            <View style={{ marginTop: 'auto' }}>
              {arrowSet && (
                <Button variant="warning" label="Slett" onPress={() => setConfirmVisible(true)} type="outline">
                  <FontAwesomeIcon icon={faTrash} size={16} color={colors.warning} />
                </Button>
              )}
              <Button disabled={!name} onPress={handleSubmit} label="Lagre" />
              <Button
                type="outline"
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
          if (arrowSet) {
            handleDeleteArrowSet(arrowSet);
          }
          setConfirmVisible(false);
        }}
      />
    </ModalWrapper>
  );
}
