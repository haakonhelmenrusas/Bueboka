import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Keyboard, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Input, Button } from '@/components/common';
import { useBowForm } from './useBowForm';
import { formatNumber, storeLocalStorage } from '@/utils';
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
            inputStyle={bowName === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
            onFocus={handleInputFocus}
            onBlur={() => {
              dispatch({ type: 'SET_BOW_NAME_ERROR', payload: false });
              setInputFocused(false);
            }}
            placeholderText="F.eks. Hoyt"
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
                  style={[styles.radioButtonContainer, bowType === bow.value && styles.radioButtonContainerSelected]}
                  onPress={() => {
                    dispatch({ type: 'SET_BOW_TYPE', payload: bow.value });
                  }}>
                  <View style={[styles.radioButton, bowType === bow.value && styles.radioButtonSelected]} />
                  <Text style={styles.radioButtonLabel}>{bow.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.bowTypeLabel}>Plassering</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {alignment.map((place) => (
                <TouchableOpacity
                  key={place.value}
                  style={[
                    styles.radioButtonContainer,
                    placement === place.value && styles.radioButtonContainerSelected,
                  ]}
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
              containerStyle={{ flex: 1, marginRight: 8 }}
              inputStyle={eyeToNock === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
              label="Fra øye til nock (cm)"
              keyboardType="numeric"
              placeholderText="F.eks. 10"
              maxLength={2}
              value={eyeToNock}
              onChangeText={(value) => dispatch({ type: 'SET_EYE_TO_NOCK', payload: value })}
            />
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              containerStyle={{ flex: 1 }}
              inputStyle={eyeToAim === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
              label="Fra øye til sikte (cm)"
              keyboardType="numeric"
              placeholderText="F.eks. 90"
              maxLength={3}
              value={eyeToAim}
              onChangeText={(value) => dispatch({ type: 'SET_EYE_TO_AIM', payload: value })}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 }}>
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              containerStyle={{ flex: 1, marginRight: 8 }}
              inputStyle={arrowWeight === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
              label="Vekt pil (g)"
              keyboardType="numeric"
              placeholderText="F.eks. 20"
              maxLength={3}
              value={arrowWeight}
              onChangeText={(value) => dispatch({ type: 'SET_ARROW_WEIGHT', payload: formatNumber(value) })}
            />
            <Input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textAlign="center"
              containerStyle={{ flex: 1 }}
              inputStyle={arrowDiameter === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
              label="Diameter pil (mm)"
              keyboardType="numeric"
              placeholderText="F.eks. 5"
              maxLength={3}
              value={arrowDiameter}
              onChangeText={(value) => dispatch({ type: 'SET_ARROW_DIAMETER', payload: formatNumber(value) })}
            />
          </View>
          {!(Platform.OS === 'android' && isInputFocused) && (
            <View style={{ marginTop: 'auto' }}>
              <Button disabled={!bowName} onPress={handleSubmit} label="Lagre" />
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
  radioContainer: {
    marginTop: 32,
  },
  radioButtonContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 16,
  },
  radioButtonContainerSelected: {
    borderColor: '#053546',
  },
  radioButton: {
    height: 16,
    width: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#053546',
  },
  radioButtonLabel: {
    color: '#053546',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  bowTypeLabel: {
    color: '#053546',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
});
