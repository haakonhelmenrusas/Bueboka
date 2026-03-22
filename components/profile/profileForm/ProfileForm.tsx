import { Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Input, ModalWrapper, Select } from '@/components/common';
import { styles } from './ProfileFormStyles';
import { User } from '@/types';
import { NORWEGIAN_ARCHERY_CLUBS } from '@/utils/NorwegianClubs';

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  user: User;
  onSave: (data: { name: string; club?: string; skytternr?: string }) => void;
}

const CLUB_OPTIONS = [{ value: '', label: 'Ingen / ikke tilknyttet' }, ...NORWEGIAN_ARCHERY_CLUBS];

export default function ProfileForm({ modalVisible, setModalVisible, user, onSave }: Props) {
  const [name, setName] = useState(user.name || '');
  const [club, setClub] = useState(user.club || '');
  const [skytternr, setSkytternr] = useState(user.skytternr || '');
  const [errors, setErrors] = useState({ name: '' });

  const validate = () => {
    const newErrors = { name: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Navn er påkrevd';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        name: name.trim(),
        club: club?.trim() || undefined,
        skytternr: skytternr?.trim() || undefined,
      });
      setModalVisible(false);
    }
  };

  return (
    <ModalWrapper visible={modalVisible} onClose={() => setModalVisible(false)}>
      <View style={styles.modalView}>
        <Text style={styles.title}>Rediger profil</Text>
        <View style={styles.form}>
          <Input
            label="Navn"
            value={name}
            onChangeText={setName}
            error={!!errors.name}
            errorMessage={errors.name}
            autoCapitalize="words"
            helpText="Ditt fulle navn"
          />
          <Select
            label="Klubb"
            options={CLUB_OPTIONS}
            selectedValue={club}
            onValueChange={setClub}
            searchable={true}
            placeholder="Velg en klubb"
          />
          <Input label="Skytternr" value={skytternr} onChangeText={setSkytternr} autoCapitalize="none" helpText="Ditt skytternummer" />
        </View>
        <View style={styles.buttons}>
          <Button label="Avbryt" onPress={() => setModalVisible(false)} type="outline" />
          <Button label="Lagre" onPress={handleSave} />
        </View>
      </View>
    </ModalWrapper>
  );
}
