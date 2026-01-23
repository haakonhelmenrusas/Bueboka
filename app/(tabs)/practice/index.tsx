import { Text } from 'react-native';
import { styles } from '@/components/practice/PracticeStyles';
import { colors } from '@/styles/colors';
import Summary from '@/components/practice/summary/Summary';
import PracticeList from '@/components/practice/PracticeList/PracticeList';
import { Button, Message } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useCallback, useState } from 'react';
import { Arrows, Bow, Practice } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SkeletonTrainingList from '@/components/practice/practiceCard/SkeletonTrainingList';
import * as Sentry from '@sentry/react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks';
import { arrowsRepository, bowRepository, practiceRepository } from '@/services/repositories';
import { AppError } from '@/services';
import CreatePracticeForm from '@/components/practice/practiceForm/CreatePracticeForm';

export default function PracticeScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [bows, setBows] = useState<Bow[]>([]);
  const [arrowSets, setArrowSets] = useState<Arrows[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPractice, setEditingPractice] = useState<Practice | null | undefined>(null);

  const loadData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const [practicesResponse, bowsData, arrowsData] = await Promise.all([
        practiceRepository.getAll({ limit: 100 }),
        bowRepository.getAll(),
        arrowsRepository.getAll(),
      ]);

      // Extract arrays from responses
      const practicesData = Array.isArray(practicesResponse) ? practicesResponse : practicesResponse?.data || [];
      const bowsListData = Array.isArray(bowsData) ? bowsData : [];
      const arrowsListData = Array.isArray(arrowsData) ? arrowsData : [];

      setPractices(practicesData);
      setBows(bowsListData);
      setArrowSets(arrowsListData);
    } catch (err) {
      console.error('Error loading practice data:', err);
      Sentry.captureException(err);
      if (err instanceof AppError) {
        setError(err.message);
      } else {
        setError('Kunne ikke laste treninger');
      }
      setPractices([]);
      setBows([]);
      setArrowSets([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleOpenModal = () => {
    loadData();
    setModalVisible(true);
  };

  const handlePracticeSaved = () => {
    loadData();
  };

  const handleEditPractice = (practice: Practice) => {
    setEditingPractice(practice);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingPractice(null);
  };

  const renderContent = () => {
    if (authLoading || isLoading) {
      return <SkeletonTrainingList />;
    }

    if (!user) {
      return <Message title="Ikke innlogget" description="Vennligst logg inn for å se treninger." />;
    }

    if (error) {
      return <Message title="Feil" description={error} />;
    }

    return <PracticeList practices={practices} onEditPractice={handleEditPractice} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.title}>Treninger</Text>
        <Summary practices={practices} />
        {renderContent()}
        {user && (
          <Button onPress={handleOpenModal} icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />} label={'Ny trening'} />
        )}
        <CreatePracticeForm
          visible={modalVisible}
          onClose={handleCloseModal}
          bows={bows}
          arrowSets={arrowSets}
          onPracticeSaved={handlePracticeSaved}
          editingPractice={editingPractice}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
