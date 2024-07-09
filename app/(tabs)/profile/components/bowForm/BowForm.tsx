import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Keyboard, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Input, Button } from '@/components/common';
import { useBowForm } from './useBowForm';
import { storeLocalStorage } from '@/utils';
import { Bow } from '@/types';

interface BowFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  bow?: Bow;
}

const BowForm = ({ modalVisible, setModalVisible, bow }: BowFormProps) => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [{ bowName, bowNameError, bowType, placement, eyeToNock, eyeToAim, arrowWeight, arrowDiameter }, dispatch] =
    useBowForm();

  const handleInputFocus = () => setInputFocused(true);
  const handleInputBlur = () => setInputFocused(false);

  useEffect(() => {
    if (bow) {
      dispatch({ type: 'SET_BOW_NAME', payload: bow.bowName });
      dispatch({ type: 'SET_BOW_TYPE', payload: bow.bowType });
      dispatch({ type: 'SET_PLACEMENT', payload: bow.placement });
      dispatch({ type: 'SET_EYE_TO_NOCK', payload: bow.eyeToNock?.toString() });
      dispatch({ type: 'SET_EYE_TO_AIM', payload: bow.eyeToAim?.toString() });
      dispatch({ type: 'SET_ARROW_WEIGHT', payload: bow.arrowWeight?.toString() });
      dispatch({ type: 'SET_ARROW_DIAMETER', payload: bow.arrowDiameter?.toString() });
    }
  }, [bow]);

  async function handleSubmit() {
    if (!bowName) {
      dispatch({ type: 'SET_BOW_NAME_ERROR', payload: true });
      return;
    }
    let bow: Bow = {
      bowName,
      bowType,
      placement,
      eyeToNock: eyeToNock ? parseFloat(eyeToNock) : undefined,
      eyeToAim: eyeToAim ? parseFloat(eyeToAim) : undefined,
      arrowWeight: arrowWeight ? parseFloat(arrowWeight) : undefined,
      arrowDiameter: arrowDiameter ? parseFloat(arrowDiameter) : undefined,
    };

    await storeLocalStorage(bow, 'bow');
    clearForm();
    setModalVisible(false);
  }

  function clearForm() {
    dispatch({ type: 'SET_BOW_NAME', payload: '' });
    dispatch({ type: 'SET_BOW_NAME_ERROR', payload: false });
    dispatch({ type: 'SET_BOW_TYPE', payload: 'recurve' });
    dispatch({ type: 'SET_PLACEMENT', payload: 'behind' });
    dispatch({ type: 'SET_EYE_TO_NOCK', payload: '' });
    dispatch({ type: 'SET_EYE_TO_AIM', payload: '' });
    dispatch({ type: 'SET_ARROW_WEIGHT', payload: '' });
    dispatch({ type: 'SET_ARROW_DIAMETER', payload: '' });
  }

  const bowTypes = [
    { label: 'Recurve', value: 'recurve' },
    { label: 'Compound', value: 'compound' },
    { label: 'Annet', value: 'annet' },
  ];
  const alignment = [
    { label: 'Bak linja', value: 'behind' },
    { label: 'Over linja', value: '' },
  ];

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        clearForm();
        setModalVisible(false);
      }}>
      <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={styles.modal}>
          <Text style={styles.title}>Din bue</Text>
          <Input
            value={bowName}
            onChangeText={(value) => dispatch({ type: 'SET_BOW_NAME', payload: value })}
            onFocus={handleInputFocus}
            onBlur={() => {
              dispatch({ type: 'SET_BOW_NAME_ERROR', payload: false });
              setInputFocused(false);
            }}
            placeholderText="Hoyt eller Dragon"
            label="Navn på bue"
            error={bowNameError}
            errorMessage="Du må fylle inn navn på bue"
          />
          <View style={styles.radioContainer}>
            <Text style={styles.bowTypeLabel}>Buetype</Text>
            <View style={{ flexDirection: 'row' }}>
              {bowTypes.map((bow) => (
                <TouchableOpacity
                  key={bow.value}
                  style={styles.radioButtonContainer}
                  onPress={() => {
                    dispatch({ type: 'SET_BOW_TYPE', payload: bow.value });
                  }}>
                  <View style={[styles.radioButton, bowType === bow.value && styles.radioButtonSelected]} />
                  <Text style={styles.radioButtonLabel}>{bow.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.placement}>
            <Text style={styles.bowTypeLabel}>Plassering</Text>
            <View style={{ flexDirection: 'row' }}>
              {alignment.map((place) => (
                <TouchableOpacity
                  key={place.value}
                  style={styles.radioButtonContainer}
                  onPress={() => {
                    dispatch({ type: 'SET_PLACEMENT', payload: place.value });
                  }}>
                  <View style={[styles.radioButton, placement === place.value && styles.radioButtonSelected]} />
                  <Text style={styles.radioButtonLabel}>{place.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              inputStyle={{ width: 128 }}
              label="Fra øye til nock"
              keyboardType="numeric"
              placeholderText="F.eks. 10cm"
              value={eyeToNock}
              onChangeText={(value) => dispatch({ type: 'SET_EYE_TO_NOCK', payload: value })}
            />
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              inputStyle={{ width: 128 }}
              label="Fra øye til sikte"
              keyboardType="numeric"
              placeholderText="F.eks. 90cm"
              value={eyeToAim}
              onChangeText={(value) => dispatch({ type: 'SET_EYE_TO_AIM', payload: value })}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 }}>
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              inputStyle={{ width: 128 }}
              label="Vekt pil"
              keyboardType="numeric"
              placeholderText="F.eks. 10gram"
              value={arrowWeight}
              onChangeText={(value) => dispatch({ type: 'SET_ARROW_WEIGHT', payload: value })}
            />
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              inputStyle={{ width: 128 }}
              label="Diameter pil"
              keyboardType="numeric"
              placeholderText="F.eks. 4mm"
              value={arrowDiameter}
              onChangeText={(value) => dispatch({ type: 'SET_ARROW_DIAMETER', payload: value })}
            />
          </View>
          {!(Platform.OS === 'android' && isInputFocused) && (
            <View style={{ marginTop: 'auto' }}>
              <Button onPress={handleSubmit} label="Lagre" />
              <Button
                type="outline"
                onPress={() => {
                  clearForm();
                  setModalVisible(false);
                }}
                label="Avbryt"
              />
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};
export default BowForm;

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    padding: 24,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'medium',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 200,
  },
  radioContainer: {
    marginTop: 32,
  },
  placement: {
    marginTop: 16,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#053546',
  },
  radioButtonLabel: {
    color: '#053546',
    fontWeight: '500',
  },
  bowTypeLabel: {
    color: '#053546',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
});

const test = {
  arrow_mass_gram: 21.2,
  arrow_diameter_mm: 5.69,
  length_eye_sight_cm: 97,
  length_nock_eye_cm: 12,
};
