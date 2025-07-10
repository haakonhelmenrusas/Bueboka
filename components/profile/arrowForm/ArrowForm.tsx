import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { handleNumberChange, storeLocalStorage } from '@/utils';
import { ArrowSet, Material } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { useArrowForm } from '@/components/profile/arrowForm/useArrowForm';
import { styles } from './ArrowFormStyles';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  modalVisible: boolean;
  setArrowModalVisible: (visible: boolean) => void;
  arrowSet: ArrowSet | null;
  existingArrowSets: ArrowSet[];
}

export default function ArrowForm ({ modalVisible, setArrowModalVisible, arrowSet, existingArrowSets }: Props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [{ name, material, weight, spine, length, diameter, numberOfArrows, isFavorite }, dispatch] = useArrowForm();

  useEffect(() => {
    if (!modalVisible) return;

    if (arrowSet) {
      dispatch({ type: 'SET_ARROW_NAME', payload: arrowSet.name });
      dispatch({ type: 'SET_ARROW_WEIGHT', payload: arrowSet.weight ? arrowSet.weight.toString() : '' });
      dispatch({ type: 'SET_ARROW_LENGTH', payload: arrowSet.length ? arrowSet.length.toString() : '' });
      dispatch({ type: 'SET_DIAMETER', payload: arrowSet.diameter ? arrowSet.diameter.toString() : '' });
      dispatch({ type: 'SET_SPINE', payload: arrowSet.spine ? arrowSet.spine.toString() : "" });
      dispatch({ type: 'SET_MATERIAL', payload: arrowSet.material });
      dispatch({ type: 'SET_NUMBER_OF_ARROWS', payload: arrowSet.numberOfArrows ? arrowSet.numberOfArrows.toString() : '' });
      dispatch({ type: 'SET_FAVORITE', payload: arrowSet.isFavorite ?? false })
    } else {
      clearForm();
    }
  }, [modalVisible, arrowSet]);

  const handleDeleteArrowSet = async (target: ArrowSet) => {
    const updatedList = existingArrowSets.filter(set => set.name !== target.name);
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
      updatedList = existingArrowSets.map(set =>
        set.name === arrowSet.name ? newArrowSet : set
      );
    } else {
      // Create mode: add new set, prevent duplicate names
      const isDuplicate = existingArrowSets.some(set => set.name === newArrowSet.name);

      updatedList = isDuplicate ? existingArrowSets : [...existingArrowSets, newArrowSet];
    }

    if (newArrowSet.isFavorite) {
      updatedList = updatedList.map(set => ({
        ...set,
        isFavorite: set.name === newArrowSet.name
      }));
    }

    await storeLocalStorage(updatedList,'arrowSets');

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
    dispatch({ type: 'SET_FAVORITE', payload: false })
  }

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        clearForm();
        setArrowModalVisible(false);
      }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, marginTop: 40 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={styles.modal}>
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
              <Input
                value={name}
                onChangeText={(value) => dispatch({ type: 'SET_ARROW_NAME', payload: value })}
                placeholderText="F.eks. Hoyt"
                label="Navn på pilsett"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 }}>
                <Select
                  containerStyle={{ flex: 1, marginRight: 8 }}
                  label="Materiale"
                  selectedValue={material}
                  options={[
                    { label: "Treverk", value: "Treverk" },
                    { label: "Karbon", value: "Karbon" },
                    { label: "Aluminium", value: "Aluminium" },
                  ]}
                  onValueChange={(value) => dispatch({ type: 'SET_MATERIAL', payload: value })}
                />
                <Input
                  containerStyle={{ flex: 1}}
                  label="Lengde (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 90"
                  value={length}
                  onChangeText={(value) => dispatch({type: 'SET_ARROW_LENGTH',payload: value})}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 }}>
                <Input
                  containerStyle={{ flex: 1, marginRight: 8 }}
                  label="Vekt (g)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 20"
                  value={weight}
                  onChangeText={(value) => handleNumberChange(value, 'SET_ARROW_WEIGHT', dispatch)}
                />
                <Input
                  containerStyle={{ flex: 1}}
                  label="Spine"
                  keyboardType="numeric"
                  placeholderText="F.eks. 250"
                  value={spine}
                  onChangeText={(value) => handleNumberChange(value, 'SET_SPINE', dispatch)}
                />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: 24 }}>
                <Input
                  containerStyle={{ flex: 1, marginRight: 8 }}
                  label="Diameter (mm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 6"
                  value={diameter}
                  onChangeText={(value) => handleNumberChange(value, 'SET_DIAMETER', dispatch)}
                />
              <Input
                  containerStyle={{ flex: 1 }}
                  label="Antall piler"
                  keyboardType="numeric"
                  placeholderText="F.eks. 6"
                  value={numberOfArrows}
                  onChangeText={(value) => handleNumberChange(value, 'SET_NUMBER_OF_ARROWS', dispatch)}
                />
              </View>
              <Pressable style={styles.favorite} onPress={() => dispatch({type: 'SET_FAVORITE',payload: !isFavorite})}>
                <FontAwesomeIcon icon={isFavorite ? faStar : faStarHalf} size={20} color={colors.warning} />
                <Text>{arrowSet?.isFavorite ? "Favoritt" : "Gjør til favoritt"}</Text>
              </Pressable>
              {arrowSet && (
                <Button label="Slett" onPress={() => setConfirmVisible(true)} type="outline">
                  <FontAwesomeIcon icon={faTrash} size={16} color={colors.warning} />
                </Button>
              )}
              <View style={{ marginTop: 'auto' }}>
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
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Vil du slette dette pilsettet?</Text>
            <View style={styles.confirmActions}>
              <Button label="Avbryt" type="outline" onPress={() => setConfirmVisible(false)} />
              <Button
                label="Slett"
                onPress={() => {
                  handleDeleteArrowSet(arrowSet!);
                  setConfirmVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};
