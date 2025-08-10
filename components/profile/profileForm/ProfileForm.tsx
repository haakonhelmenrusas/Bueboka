import { Modal, Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Input, ModalWrapper } from '@/components/common';
import { styles } from './ProfileFormStyles';
import { User } from '@/types';

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  user: User;
  onSave: (data: { name: string; club?: string }) => void;
}

export default function ProfileForm({ modalVisible, setModalVisible, user, onSave }: Props) {
  const [name, setName] = useState(user.name);
  const [club, setClub] = useState(user.club || '');
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
      });
      setModalVisible(false);
    }
  };

  return (
    <ModalWrapper visible={modalVisible} onClose={() => setModalVisible(false)}>
      <View style={styles.modalView}>
        <Text style={styles.title}>Rediger profil</Text>
        <View style={styles.form}>
          <Input label="Navn" value={name} onChangeText={setName} error={!!errors} errorMessage={errors.name} autoCapitalize="words" />
          <Input label="Klubb" value={club} onChangeText={setClub} autoCapitalize="words" />
        </View>
        <View style={styles.buttons}>
          <Button label="Avbryt" onPress={() => setModalVisible(false)} type="outline" />
          <Button label="Lagre" onPress={handleSave} />
        </View>
      </View>
    </ModalWrapper>
  );
}
