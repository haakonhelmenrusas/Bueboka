import { ScrollView, Text, View } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import BowCard from '@/components/profile/bowCard/BowCard';
import { Button, Message } from '@/components/common';
import BowForm from '@/components/profile/bowForm/BowForm';
import { Arrows, Bow } from '@/types';
import { sortItems } from '@/utils';
import { styles } from '@/components/profile/ProfileStyles';
import { colors } from '@/styles/colors';
import ArrowCard from '@/components/profile/arrowCard/ArrowCard';
import ArrowForm from '@/components/profile/arrowForm/ArrowForm';
import BowDetails from '@/components/profile/bowDetails/BowDetails';
import ArrowSetDetails from '@/components/profile/arrowSetDetails/ArrowSetDetails';
import ProfileBox from '@/components/profile/profile/ProfileBox';
import ProfileForm from '@/components/profile/profileForm/ProfileForm';
import { useAuth } from '@/hooks';
import { arrowsRepository, bowRepository, userRepository } from '@/services/repositories';
import { AppError } from '@/services';
import { useFocusEffect } from 'expo-router';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [bows, setBows] = useState<Bow[]>([]);
  const [selectedBow, setSelectedBow] = useState<Bow | null>(null);
  const [arrowSets, setArrowSets] = useState<Arrows[]>([]);
  const [selectedArrowSet, setSelectedArrowSet] = useState<Arrows | null>(null);
  const [selectedBowForDetails, setSelectedBowForDetails] = useState<Bow | null>(null);
  const [selectedArrowSetForDetails, setSelectedArrowSetForDetails] = useState<Arrows | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBows = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await bowRepository.getAll();
      setBows(data || []);
    } catch (err) {
      if (err instanceof AppError) {
        setError(err.message);
      }
      setBows([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadArrows = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await arrowsRepository.getAll();
      setArrowSets(data || []);
    } catch (err) {
      if (err instanceof AppError) {
        setError(err.message);
      }
      setArrowSets([]);
    }
  }, [user]);

  // Load data when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadBows();
      loadArrows();
    }, [loadBows, loadArrows]),
  );

  // Also reload when modals close
  useEffect(() => {
    if (!user) return;
    loadBows();
  }, [bowModalVisible, loadBows, user]);

  useEffect(() => {
    if (!user) return;
    loadArrows();
  }, [arrowModalVisible, loadArrows, user]);

  async function handleProfileUpdate(data: { name: string; club?: string }) {
    try {
      await userRepository.updateProfile(data);
    } catch (err) {
      if (err instanceof AppError) {
        alert(err.message);
      }
    }
  }

  const sortedBows = useMemo(() => sortItems(bows), [bows]);
  const sortedArrowSets = useMemo(() => sortItems(arrowSets), [arrowSets]);

  if (authLoading || isLoading) {
    return (
      <View style={styles.container}>
        <Text>Laster...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Message title="Ikke innlogget" description="Vennligst logg inn for å se profilen din." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profil</Text>
        <ProfileBox user={user} onEdit={() => setIsProfileModalVisible(true)} />
        <ProfileForm
          modalVisible={isProfileModalVisible}
          setModalVisible={setIsProfileModalVisible}
          user={user}
          onSave={handleProfileUpdate}
        />
        {error && <Message title="Feil" description={error} />}
        <View style={styles.actionButtons}>
          <Button
            buttonStyle={{ minWidth: '45%' }}
            onPress={() => {
              setSelectedBow(null);
              setBowModalVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} size={16} color={colors.white} />}
            label="Ny bue"
          />
          <Button
            buttonStyle={{ minWidth: '45%' }}
            onPress={() => {
              setSelectedArrowSet(null);
              setArrowModalVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} size={16} color={colors.white} />}
            label="Nytt pilsett"
          />
        </View>
        <View style={styles.bowContainer}>
          <Text style={styles.subtitle}>Bue</Text>
          <View style={styles.bowGrid}>
            {sortedBows.length > 0 ? (
              sortedBows.map((bow) => <BowCard key={bow.id} bow={bow} onPress={() => setSelectedBowForDetails(bow)} />)
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
                <ArrowCard key={index} arrowSet={arrowSet} onPress={() => setSelectedArrowSetForDetails(arrowSet)} />
              ))
            ) : (
              <Message title="Ingen piler" description="Du har ikke lagt til noen piler enda." />
            )}
          </View>
        </View>
      </ScrollView>
      <BowForm modalVisible={bowModalVisible} setModalVisible={setBowModalVisible} bow={selectedBow} existingBows={bows} />
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
