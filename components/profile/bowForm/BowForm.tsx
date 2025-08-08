import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Input, ModalWrapper, Select, Toggle } from '@/components/common';
import { useBowForm } from './useBowForm';
import { handleNumberChange, storeLocalStorage } from '@/utils';
import { Bow } from '@/types';
import { styles } from './BowFormStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { colors } from '@/styles/colors';
import ConfirmModal from '@/components/profile/DeleteArrowSetModal/ConfirmModal';

interface BowFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  bow: Bow | null;
  existingBows: Bow[];
}

const BowForm = ({ modalVisible, setModalVisible, bow, existingBows }: BowFormProps) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [
    { bowName, bowNameError, bowType, placement, eyeToNock, eyeToAim, interval_sight_real, intervalSightMeasure, isFavorite },
    dispatch,
  ] = useBowForm();
  const [prevBow, setPrevBow] = useState<Bow | null>(null);

  useEffect(() => {
    if (!modalVisible) return;

    // Clear form if we're switching from editing to creating new
    if (prevBow !== null && bow === null) {
      clearForm();
    }

    if (bow) {
      dispatch({ type: 'SET_BOW_NAME', payload: bow.bowName });
      dispatch({ type: 'SET_BOW_TYPE', payload: bow.bowType });
      dispatch({ type: 'SET_PLACEMENT', payload: bow.placement });
      dispatch({ type: 'SET_EYE_TO_NOCK', payload: bow.eyeToNock?.toString() ?? '' });
      dispatch({ type: 'SET_EYE_TO_AIM', payload: bow.eyeToAim?.toString() ?? '' });
      dispatch({ type: 'SET_INTERVAL_SIGHT_REAL', payload: bow.interval_sight_real?.toString() ?? '' });
      dispatch({ type: 'SET_INTERVAL_SIGHT_MEASURE', payload: bow.interval_sight_measured?.toString() ?? '' });
      dispatch({ type: 'SET_IS_FAVORITE', payload: bow.isFavorite ?? false });
    }

    setPrevBow(bow);
  }, [bow, dispatch]);

  async function handleSubmit() {
    if (!bowName) {
      dispatch({ type: 'SET_BOW_NAME_ERROR', payload: true });
      return;
    }
    let newBow: Bow = {
      id: bow?.id || Date.now().toString(),
      bowName,
      bowType,
      placement,
      eyeToNock: eyeToNock ? parseFloat(eyeToNock) : undefined,
      eyeToAim: eyeToAim ? parseFloat(eyeToAim) : undefined,
      interval_sight_real: interval_sight_real ? parseFloat(interval_sight_real) : undefined,
      interval_sight_measured: intervalSightMeasure ? parseFloat(intervalSightMeasure) : undefined,
      isFavorite,
    };

    let updatedBows: Bow[];

    if (bow) {
      // Edit mode: replace the existing one by id
      updatedBows = existingBows.map((b) => (b.id === bow.id ? newBow : b));
    } else {
      // Create mode: add new bow if limit not reached
      if (existingBows.length >= 5) {
        //TODO: Add error message to user here
        return;
      }
      updatedBows = [...existingBows, newBow];
    }

    if (newBow.isFavorite) {
      updatedBows = updatedBows.map((b) => ({
        ...b,
        isFavorite: b.id === newBow.id,
      }));
    }

    await storeLocalStorage(updatedBows, 'bows');
    clearForm();
    setModalVisible(false);
  }

  const handleDelete = async () => {
    if (!bow) return;
    const updatedBows = existingBows.filter((b) => b.id !== bow.id);
    await storeLocalStorage(updatedBows, 'bows');
    clearForm();
    setModalVisible(false);
  };

  function clearForm() {
    dispatch({ type: 'SET_BOW_NAME', payload: '' });
    dispatch({ type: 'SET_BOW_NAME_ERROR', payload: false });
    dispatch({ type: 'SET_BOW_TYPE', payload: 'recurve' });
    dispatch({ type: 'SET_PLACEMENT', payload: 'behind' });
    dispatch({ type: 'SET_EYE_TO_NOCK', payload: '' });
    dispatch({ type: 'SET_EYE_TO_AIM', payload: '' });
    dispatch({ type: 'SET_INTERVAL_SIGHT_REAL', payload: '' });
    dispatch({ type: 'SET_INTERVAL_SIGHT_MEASURE', payload: '' });
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
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
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
            <View style={styles.inputs}>
              <Input
                value={bowName}
                onChangeText={(value) => dispatch({ type: 'SET_BOW_NAME', payload: value })}
                placeholderText="F.eks. Hoyt"
                label="Navn på bue (obligatorisk)"
                error={bowNameError}
                errorMessage="Du må fylle inn navn på bue"
              />
              <Select
                containerStyle={{ zIndex: 2000, marginBottom: 16 }}
                label="Buetype"
                selectedValue={bowType}
                options={[
                  { label: 'Recurve', value: 'recurve' },
                  { label: 'Compound', value: 'compound' },
                  { label: 'Tradisjonell', value: 'tradisjonell' },
                  { label: 'Langbue', value: 'langbue' },
                  { label: 'Kyudo', value: 'kyudo' },
                  { label: 'Barebow', value: 'barebow' },
                  { label: 'Rytterbue', value: 'rytterbue' },
                  { label: 'Annet', value: 'annet' },
                ]}
                onValueChange={(value) => dispatch({ type: 'SET_BOW_TYPE', payload: value })}
              />
              <Select
                containerStyle={{ zIndex: 2000, marginBottom: 16 }}
                label="Plassering"
                selectedValue={placement}
                options={[
                  { label: 'Bak linja', value: 'behind' },
                  { label: 'Over linja', value: '' },
                ]}
                onValueChange={(value) => dispatch({ type: 'SET_PLACEMENT', payload: value })}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Fra øye til nock (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 10"
                  value={eyeToNock}
                  onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_NOCK', dispatch)}
                />
                <Input
                  containerStyle={{ width: '48%' }}
                  label="Fra øye til sikte (cm)"
                  keyboardType="numeric"
                  placeholderText="F.eks. 90"
                  value={eyeToAim}
                  onChangeText={(value) => handleNumberChange(value, 'SET_EYE_TO_AIM', dispatch)}
                />
              </View>
              <Input
                keyboardType="numeric"
                containerStyle={{ width: '48%', marginBottom: 16 }}
                label={'Intervall sikte (cm)'}
                value={interval_sight_real}
                placeholderText="F.eks. 5"
                onChangeText={(value) => handleNumberChange(value, 'SET_INTERVAL_SIGHT_REAL', dispatch)}
              />
              <Toggle value={isFavorite} label="Favoritt" onToggle={() => dispatch({ type: 'SET_IS_FAVORITE', payload: !isFavorite })} />
            </View>
            <View style={{ marginTop: 'auto' }}>
              {bow && (
                <Button variant="warning" label="Slett" onPress={() => setConfirmVisible(true)} type="outline">
                  <FontAwesomeIcon icon={faTrash} size={16} color={colors.warning} />
                </Button>
              )}
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
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmModal
        visible={confirmVisible}
        title="Slett bue"
        message={'Vil du slette buen "' + bowName + '"?'}
        confirmLabel="Slett"
        cancelLabel="Avbryt"
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
