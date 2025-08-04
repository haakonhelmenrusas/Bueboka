import { ScrollView, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import BowCard from '@/components/profile/bowCard/BowCard';
import { Button, Message } from '@/components/common';
import BowForm from '@/components/profile/bowForm/BowForm';
import { ArrowSet, Bow, User } from '@/types';
import { getLocalStorage, sortItems, storeLocalStorage } from '@/utils';
import { styles } from '@/components/profile/ProfileStyles';
import { colors } from '@/styles/colors';
import ArrowCard from '@/components/profile/arrowCard/ArrowCard';
import ArrowForm from '@/components/profile/arrowForm/ArrowForm';
import BowDetails from '@/components/profile/bowDetails/BowDetails';
import ArrowSetDetails from '@/components/profile/arrowSetDetails/ArrowSetDetails';
import ProfileBox from '@/components/profile/profile/ProfileBox';
import ProfileForm from '@/components/profile/profileForm/ProfileForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [bows, setBows] = useState<Bow[]>([]);
  const [selectedBow, setSelectedBow] = useState<Bow | null>(null);
  const [arrowSets, setArrowSets] = useState<ArrowSet[]>([]);
  const [selectedArrowSet, setSelectedArrowSet] = useState<ArrowSet | null>(null);
  const [selectedBowForDetails, setSelectedBowForDetails] = useState<Bow | null>(null);
  const [selectedArrowSetForDetails, setSelectedArrowSetForDetails] = useState<ArrowSet | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLocalStorage<Bow[]>('bows').then((bows) => {
      if (bows) {
        setBows(bows);
      }
    });
  }, [bowModalVisible]);

  useEffect(() => {
    getLocalStorage<ArrowSet[]>('arrowSets').then((data) => {
      if (data) setArrowSets(data);
    });
  }, [arrowModalVisible]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getLocalStorage<User>('user');
        if (userData) {
          setUser(userData);
        } else {
          // Set default user if no stored data
          setUser({ name: 'Artemis Archer', club: 'Bueklubben' });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Set default user on error
        setUser({ name: 'Artemis Archer', club: 'Bueklubben' });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);
//AsyncStorage.clear()

  const handleProfileUpdate = async (updatedUser: User) => {
    setUser(updatedUser);
    try {
      await storeLocalStorage(JSON.stringify(updatedUser), 'user');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const sortedBows = useMemo(() => sortItems(bows), [bows]);
  const sortedArrowSets = useMemo(() => sortItems(arrowSets), [arrowSets]);

  // Don't render the main content until we have user data
  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <Text>Laster...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileBox
          user={user}
          onEdit={() => setIsProfileModalVisible(true)}
        />
        <ProfileForm
          modalVisible={isProfileModalVisible}
          setModalVisible={setIsProfileModalVisible}
          user={user}
          onSave={handleProfileUpdate}
        />
        <View style={styles.actionButtons}>
          <Button
            onPress={() => {
              setSelectedBow(null);
              setBowModalVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} size={16} color={colors.white} />}
            label="Legg til bue"
          />
          <Button
            onPress={() => {
              setSelectedArrowSet(null);
              setArrowModalVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} size={16} color={colors.white} />}
            label="Legg til pilsett"
          />
        </View>
      <View style={styles.bowContainer}>
        <Text style={styles.subtitle}>Bue</Text>
        <View style={styles.bowGrid}>
          {sortedBows.length > 0 ? (
            sortedBows.map((bow) => (
              <BowCard
                key={bow.id}
                bow={bow}
                onPress={() => setSelectedBowForDetails(bow)}
              />
            ))
      ) : (
        <Message title="Ingen bue" description="Du har ikke lagt til noen bue enda." />
      )}
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.subtitle}>Pilsett</Text>
        <View style={styles.arrowGrid}>
          {Array.isArray(sortedArrowSets) && sortedArrowSets.length > 0 ? (
            sortedArrowSets.map((arrowSet, index) => (
              <ArrowCard
                key={index}
                arrowSet={arrowSet}
                onPress={() => setSelectedArrowSetForDetails(arrowSet)}
              />
            ))
          ) : (
            <Message title="Ingen piler" description="Du har ikke lagt til noen piler enda." />
          )}
        </View>
      </View>
      </ScrollView>
      <BowForm
        modalVisible={bowModalVisible}
         setModalVisible={setBowModalVisible}
         bow={selectedBow}
         existingBows={bows}
      />
      <ArrowForm
        modalVisible={arrowModalVisible}
        setArrowModalVisible={setArrowModalVisible}
        arrowSet={selectedArrowSet}
        existingArrowSets={arrowSets}
      />
      {selectedBowForDetails && (
        <BowDetails
          bow={selectedBowForDetails}
          visible={!!selectedBowForDetails}
          onClose={() => setSelectedBowForDetails(null)}
          onEdit={() => {
            setSelectedBow(selectedBowForDetails);
            setBowModalVisible(true);
            setSelectedBowForDetails(null);
          }}
        />
      )}
      {selectedArrowSetForDetails && (
        <ArrowSetDetails
          arrowSet={selectedArrowSetForDetails}
          visible={!!selectedArrowSetForDetails}
          onClose={() => setSelectedArrowSetForDetails(null)}
          onEdit={() => {
            setSelectedArrowSet(selectedArrowSetForDetails);
            setArrowModalVisible(true);
            setSelectedArrowSetForDetails(null);
          }}
        />
      )}
    </View>
  );
}
