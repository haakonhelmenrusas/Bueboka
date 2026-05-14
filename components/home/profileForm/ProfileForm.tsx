import { Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Input, ModalWrapper, Select } from '@/components/common';
import { styles } from './ProfileFormStyles';
import { User } from '@/types';
import { NORWEGIAN_ARCHERY_CLUBS } from '@/utils/NorwegianClubs';
import { useTranslation } from '@/contexts';

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  user: User;
  onSave: (data: { name: string; club?: string; skytternr?: string }) => void;
}

export default function ProfileForm({ modalVisible, setModalVisible, user, onSave }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(user.name || '');
  const [club, setClub] = useState(user.club || '');
  const [skytternr, setSkytternr] = useState(user.skytternr || '');
  const [errors, setErrors] = useState({ name: '' });

  const CLUB_OPTIONS = [{ value: '', label: t['profileForm.noClub'] }, ...NORWEGIAN_ARCHERY_CLUBS];

  const validate = () => {
    const newErrors = { name: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = t['profileForm.nameRequired'];
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
        <Text style={styles.title}>{t['profileBox.editProfile']}</Text>
        <View style={styles.form}>
          <Input
            label={t['profileForm.nameLabel']}
            value={name}
            onChangeText={setName}
            error={!!errors.name}
            errorMessage={errors.name}
            autoCapitalize="words"
            helpText={t['profileForm.nameHelpText']}
          />
          <Select
            label={t['profileForm.clubLabel']}
            options={CLUB_OPTIONS}
            selectedValue={club}
            onValueChange={setClub}
            searchable={true}
            placeholder={t['profileForm.clubPlaceholder']}
          />
          <Input
            label={t['profileForm.archerNumberLabel']}
            value={skytternr}
            onChangeText={setSkytternr}
            autoCapitalize="none"
            helpText={t['profileForm.archerNumberHelpText']}
          />
        </View>
        <View style={styles.buttons}>
          <Button label={t['common.cancel']} onPress={() => setModalVisible(false)} type="outline" />
          <Button label={t['form.save']} onPress={handleSave} />
        </View>
      </View>
    </ModalWrapper>
  );
}
