import { View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import BowCard from '@/components/profile/bowCard/BowCard';
import { Button, Message } from '@/components/common';
import BowForm from '@/components/profile/bowForm/BowForm';
import { ArrowSet, Bow } from '@/types';
import { getLocalStorage } from '@/utils';
import { styles } from '@/components/profile/ProfileStyles';
import { colors } from '@/styles/colors';
import ArrowCard from '@/components/profile/arrowCard/ArrowCard';
import ArrowForm from '@/components/profile/arrowForm/ArrowForm';

export default function Profile() {
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [bow, setBow] = useState<Bow | null>(null);
  const [arrowSet, setArrowSet] = useState<ArrowSet | null>(null);

  useEffect(() => {
    getLocalStorage<Bow>('bow').then((bow) => {
      if (bow) {
        setBow(bow);
      }
    });
  }, [bowModalVisible]);

  useEffect(() => {
    getLocalStorage<ArrowSet>('arrowSet').then((arrowSet) => {
      if (arrowSet) {
        setArrowSet(arrowSet);
      }
    })
  }, []);

  const openBowFormWithData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('bow');
      if (storedData !== null) {
        setBow(JSON.parse(storedData));
        setBowModalVisible(true);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const openArrowFormWithData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('arrowSet');
      if (storedData !== null) {
        setArrowSet(JSON.parse(storedData));
        setArrowModalVisible(true);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return (
    <View style={styles.container}>
      {bow ? (
        <BowCard bow={bow} openFormWithData={openBowFormWithData} />
      ) : (
        <Message title="Ingen bue" description="Du har ikke lagt til noen bue enda." />
      )}
      {arrowSet ? (
        <ArrowCard arrowSet={arrowSet} openFormWithData={openArrowFormWithData} />
      ) : (
        <Message title="Ingen piler" description="Du har ikke lagt til noen piler enda." />
      )}
      <BowForm modalVisible={bowModalVisible} setModalVisible={setBowModalVisible} bow={bow} />
      <ArrowForm modalVisible={arrowModalVisible} setArrowModalVisible={setArrowModalVisible} arrowSet={arrowSet} />
      <View style={styles.buttons}>
        <Button
          type="outline"
          onPress={() => {
            setArrowModalVisible(true);
          }}
          icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.primary} />}
          label="Legg til pilsett"
        />
        <Button
          type="outline"
          onPress={() => {
            setBowModalVisible(true);
          }}
          icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.primary} />}
          label="Legg til bue"
        />
      </View>
    </View>
  );
}
