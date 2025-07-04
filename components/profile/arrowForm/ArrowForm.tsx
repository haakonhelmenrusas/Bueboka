import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useEffect } from 'react';
import { Button, Input, Select } from '@/components/common';
import { handleNumberChange, storeLocalStorage } from '@/utils';
import { ArrowSet, Material } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { useArrowForm } from '@/components/profile/arrowCard/useArrowForm';
import { styles } from './ArrowFormStyles';

interface Props {
  modalVisible: boolean;
  setArrowModalVisible: (visible: boolean) => void;
  arrowSet: ArrowSet | null;
}

export default function ArrowForm ({ modalVisible, setArrowModalVisible, arrowSet }: Props) {
  const [{ name, material, weight, spine, length, diameter }, dispatch] = useArrowForm();

  useEffect(() => {
    if (!modalVisible) return;

    if (arrowSet) {
      dispatch({ type: 'SET_ARROW_NAME', payload: arrowSet.name });
      dispatch({ type: 'SET_ARROW_WEIGHT', payload: arrowSet.weight ? arrowSet.weight.toString() : '' });
      dispatch({ type: 'SET_ARROW_LENGTH', payload: arrowSet.length ? arrowSet.length.toString() : '' });
      dispatch({ type: 'SET_DIAMETER', payload: arrowSet.diameter ? arrowSet.diameter.toString() : '' });
      dispatch({ type: 'SET_SPINE', payload: arrowSet.spine ? arrowSet.spine.toString() : "" });
      dispatch({ type: 'SET_MATERIAL', payload: arrowSet.material });
    } else {
      clearForm();
    }
  }, [modalVisible, arrowSet]);


  async function handleSubmit() {
    let arrowSet: ArrowSet = {
      name,
      material,
      diameter: parseFloat(diameter),
      weight: parseFloat(weight),
      spine: parseFloat(spine),
      length: parseFloat(length),
    };

    await storeLocalStorage(arrowSet, 'arrowSet');
    clearForm();
    setArrowModalVisible(false);
  }

  function clearForm() {
    dispatch({ type: 'SET_ARROW_NAME', payload: '' });
    dispatch({ type: 'SET_ARROW_WEIGHT', payload: '' });
    dispatch({ type: 'SET_ARROW_LENGTH', payload: '' });
    dispatch({ type: 'SET_MATERIAL', payload: Material.Karbon });
    dispatch({ type: 'SET_DIAMETER', payload: '' });
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
              <View style={{ marginTop: 24 }}>
                <Input
                  containerStyle={{ flex: 1, width: "50%" }}
                  label="Diameter (mm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 6"
                  value={diameter}
                  onChangeText={(value) => handleNumberChange(value, 'SET_DIAMETER', dispatch)}
                />
              </View>
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
    </Modal>
  );
};
