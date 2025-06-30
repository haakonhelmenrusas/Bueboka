import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect } from 'react';
import { Button, Input } from '@/components/common';
import { useBowForm } from './useBowForm';
import { handleNumberChange, storeLocalStorage } from '@/utils';
import { Bow } from '@/types';
import { styles } from './BowFormStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

interface BowFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  bow: Bow | null;
}

const BowForm = ({ modalVisible, setModalVisible, bow }: BowFormProps) => {
  const [
    {
      bowName,
      bowNameError,
      bowType,
      placement,
      eyeToNock,
      eyeToAim,
      interval_sight_real,
      intervalSightMeasure,
    },
    dispatch,
  ] = useBowForm();

  useEffect(() => {
    if (bow) {
      dispatch({ type: 'SET_BOW_NAME', payload: bow.bowName });
      dispatch({ type: 'SET_BOW_TYPE', payload: bow.bowType });
      dispatch({ type: 'SET_PLACEMENT', payload: bow.placement });
      dispatch({ type: 'SET_EYE_TO_NOCK', payload: bow.eyeToNock?.toString() ?? '' });
      dispatch({ type: 'SET_EYE_TO_AIM', payload: bow.eyeToAim?.toString() ?? '' });
      dispatch({ type: 'SET_INTERVAL_SIGHT_REAL', payload: bow.interval_sight_real?.toString() ?? '' });
      dispatch({ type: 'SET_INTERVAL_SIGHT_MEASURE', payload: bow.interval_sight_measured?.toString() ?? '' });
    }
  }, [bow, dispatch]);

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
      interval_sight_real: interval_sight_real ? parseFloat(interval_sight_real) : undefined,
      interval_sight_measured: intervalSightMeasure ? parseFloat(intervalSightMeasure) : undefined,
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
    dispatch({ type: 'SET_INTERVAL_SIGHT_REAL', payload: '' });
    dispatch({ type: 'SET_INTERVAL_SIGHT_MEASURE', payload: '' });
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, marginTop: 24 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={styles.modal}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Din bue</Text>
                <Pressable
                  onPress={() => {
                    clearForm();
                    setModalVisible(false);
                  }}>
                  <FontAwesomeIcon size={20} icon={faXmark} />
                </Pressable>
              </View>
              <Input
                value={bowName}
                onChangeText={(value) => dispatch({ type: 'SET_BOW_NAME', payload: value })}
                inputStyle={bowName === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
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
                      style={[
                        styles.radioButtonContainer,
                        bowType === bow.value && styles.radioButtonContainerSelected,
                      ]}
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
                  containerStyle={{ flex: 1, marginRight: 8 }}
                  inputStyle={eyeToNock === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
                  label="Fra øye til nock (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 10"
                  value={eyeToNock}
                  onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_NOCK', dispatch)}
                />
                <Input
                  containerStyle={{ flex: 1 }}
                  inputStyle={eyeToAim === '' ? { borderColor: '#ccc' } : { borderColor: '#053546' }}
                  label="Fra øye til sikte (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 90"
                  value={eyeToAim}
                  onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_AIM', dispatch)}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 24, marginBottom: 24 }}>
                <Input
                  label={'Intervall sikte (cm)'}
                  value={interval_sight_real}
                  placeholderText="F.eks. 5"
                  onChangeText={(value) => handleNumberChange(value, 'SET_INTERVAL_SIGHT_REAL', dispatch)}
                />
              </View>
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
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BowForm;
