import { ScrollView, Text, View } from 'react-native';
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
  const [arrowSets, setArrowSets] = useState<ArrowSet[]>([]);
  const [selectedArrowSet, setSelectedArrowSet] = useState<ArrowSet | null>(null);

  useEffect(() => {
    getLocalStorage<Bow>('bow').then((bow) => {
      if (bow) {
        setBow(bow);
      }
    });
  }, [bowModalVisible]);

  useEffect(() => {
    getLocalStorage<ArrowSet[]>('arrowSets').then((data) => {
      if (data) setArrowSets(data);
    });
  }, [arrowModalVisible]);

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

  const handleDeleteArrowSet = async (target: ArrowSet) => {
    const updatedList = arrowSets.filter(set => set.name !== target.name);
    setArrowSets(updatedList);
    await AsyncStorage.setItem('arrowSets', JSON.stringify(updatedList));
  };

  return (
    <View style={styles.container}>
      <View style={styles.bowContainer}>
        <Text style={styles.subtitle}>Bue</Text>
      {bow ? (
        <BowCard bow={bow} openFormWithData={openBowFormWithData} />
      ) : (
        <Message title="Ingen bue" description="Du har ikke lagt til noen bue enda." />
      )}
      </View>
      <View>
        <Text style={styles.subtitle}>Pilsett</Text>
        <ScrollView style={styles.scrollList} contentContainerStyle={{ paddingBottom: 16 }}>
          {Array.isArray(arrowSets) && arrowSets.length > 0 ? (
            arrowSets.map((arrowSet, index) => (
              <ArrowCard
                key={index}
                arrowSet={arrowSet}
                onEdit={() => {
                  setSelectedArrowSet(arrowSet);
                  setArrowModalVisible(true);
                }}
                onDelete={handleDeleteArrowSet}
              />
            ))
          ) : (
            <Message title="Ingen piler" description="Du har ikke lagt til noen piler enda." />
          )}
        </ScrollView>
      </View>
      <BowForm modalVisible={bowModalVisible} setModalVisible={setBowModalVisible} bow={bow} />
      <ArrowForm
        modalVisible={arrowModalVisible}
        setArrowModalVisible={setArrowModalVisible}
        arrowSet={selectedArrowSet}
        existingArrowSets={arrowSets}
      />
      <View style={styles.buttons}>
        <Button
          onPress={() => {
            setSelectedArrowSet(null);
            setArrowModalVisible(true);
          }}
          icon={<FontAwesomeIcon icon={faPlus} size={16} color={colors.white} />}
          label="Legg til pilsett"
        />
        <Button
          onPress={() => {
            setBow(null);
            setBowModalVisible(true);
          }}
          icon={<FontAwesomeIcon icon={faPlus} size={16} color={colors.white} />}
          label="Legg til bue"
        />
      </View>
    </View>
  );
}
