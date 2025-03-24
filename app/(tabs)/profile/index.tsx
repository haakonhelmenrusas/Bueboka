import { Image, ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import BowCard from './components/bowCard/BowCard';
import { Button } from '@/components/common';
import BowForm from './components/bowForm/BowForm';
import { Bow } from '@/types';
import { getLocalStorage } from '@/utils';
import { styles } from './ProfileStyles';
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
    <ScrollView style={styles.container}>
      {bow ? (
        <BowCard bow={bow} openFormWithData={openFormWithData} />
      ) : (
        <View style={styles.bow}>
          <View style={styles.header}>
            <Image source={require('@/assets/bow.png')} style={[styles.image, { tintColor: colors.tertiary }]} />
            <Text style={styles.title}>Ingen bue lagre</Text>
          </View>
        </View>
      )}
      <BowForm modalVisible={modalVisible} setModalVisible={setModalVisible} bow={bow} />
      {!bow && (
        <View style={{ marginTop: 'auto' }}>
          <Button
            onPress={() => {
              setModalVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />}
            label="Legg til bue"
          />
        </View>
      )}
    </ScrollView>
  );
}
