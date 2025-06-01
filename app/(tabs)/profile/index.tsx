import { View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import BowCard from '@/components/profile/bowCard/BowCard';
import { Button, Message } from '@/components/common';
import BowForm from '@/components/profile/bowForm/BowForm';
import { Bow } from '@/types';
import { getLocalStorage } from '@/utils';
import { styles } from '@/components/profile/ProfileStyles';
import { colors } from '@/styles/colors';

export default function Profile() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bow, setBow] = useState<Bow | null>(null);

  useEffect(() => {
    getLocalStorage<Bow>('bow').then((bow) => {
      if (bow) {
        setBow(bow);
      }
    });
  }, [modalVisible]);

  const openFormWithData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('bow');
      if (storedData !== null) {
        setBow(JSON.parse(storedData));
        setModalVisible(true);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return (
    <View style={styles.container}>
      {bow ? (
        <BowCard bow={bow} openFormWithData={openFormWithData} />
      ) : (
        <Message title="Ingen bue" description="Du har ikke lagt til noen bue enda." />
      )}
      <BowForm modalVisible={modalVisible} setModalVisible={setModalVisible} bow={bow} />
      {!bow && (
        <View style={{ marginTop: 16 }}>
          <Button
            onPress={() => {
              setModalVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />}
            label="Legg til bue"
          />
        </View>
      )}
    </View>
  );
}
