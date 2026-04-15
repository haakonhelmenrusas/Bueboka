import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { colors } from '@/styles/colors';
import { arrowsRepository, bowRepository, competitionRepository, practiceRepository } from '@/services/repositories';
import { Arrows, Bow, Competition, Practice, PracticeCardItem, PracticeFilter } from '@/types';
import CreatePracticeForm from '@/components/practice/practiceForm/CreatePracticeForm';
import CreateCompetitionForm from '@/components/practice/competitionForm/CreateCompetitionForm';
import BowForm from '@/components/home/bowForm/BowForm';
import ArrowForm from '@/components/home/arrowForm/ArrowForm';
import { MobileActionButton } from '@/components/common';
import { PracticeDetailsModal } from '@/components/practice/practiceDetailsModal';
import { AktivitetHeader, PracticeList } from '@/components/aktivitet';
import { styles } from '@/components/aktivitet/AktivitetStyles';

const PAGE_SIZE = 15;

export default function AktivitetScreen() {
  const insets = useSafeAreaInsets();

  const [bows, setBows] = useState<Bow[]>([]);
  const [arrows, setArrows] = useState<Arrows[]>([]);

  const [filter, setFilter] = useState<PracticeFilter>('all');
  const [cards, setCards] = useState<PracticeCardItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [practiceModalVisible, setPracticeModalVisible] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);
  const [competitionModalVisible, setCompetitionModalVisible] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [selectedBow, setSelectedBow] = useState<Bow | null>(null);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [selectedArrowSet, setSelectedArrowSet] = useState<Arrows | null>(null);
  const [selectedPracticeForDetails, setSelectedPracticeForDetails] = useState<Practice | null>(null);
  const [selectedCompetitionForDetails, setSelectedCompetitionForDetails] = useState<Competition | null>(null);

  const fetchCards = useCallback(async (currentFilter: PracticeFilter, currentPage: number, append = false) => {
    if (currentPage === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const result = await practiceRepository.getCards({
        page: currentPage,
        pageSize: PAGE_SIZE,
        filter: currentFilter,
      });
      setTotal(result.total);
      setCards((prev) => (append ? [...prev, ...result.practices] : result.practices));
    } catch {
      // silently fail – network errors handled by offline layer
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadEquipment = useCallback(async () => {
    try {
      const [bowsResult, arrowsResult] = await Promise.allSettled([bowRepository.getAll(), arrowsRepository.getAll()]);
      if (bowsResult.status === 'fulfilled') setBows(bowsResult.value || []);
      if (arrowsResult.status === 'fulfilled') setArrows(arrowsResult.value || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchCards(filter, 1, false);
  }, [filter, refreshKey, fetchCards]);

  useFocusEffect(
    useCallback(() => {
      loadEquipment();
      setRefreshKey((k) => k + 1);
    }, [loadEquipment]),
  );

  const handleFilterChange = (newFilter: PracticeFilter) => {
    if (newFilter === filter) return;
    setFilter(newFilter);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCards(filter, nextPage, true);
  };

  const handleCardPress = async (card: PracticeCardItem) => {
    if (card.practiceType === 'KONKURRANSE') {
      try {
        const full = await competitionRepository.getById(card.id);
        setSelectedCompetitionForDetails(full);
      } catch (error) {
        console.error('[AktivitetScreen] Error fetching competition:', error);
        Alert.alert('Kunne ikke laste konkurranse', 'Konkurransen kunne ikke lastes. Prøv igjen senere.');
        setSelectedCompetitionForDetails(null);
      }
    } else {
      try {
        const full = await practiceRepository.getById(card.id);
        setSelectedPracticeForDetails(full);
      } catch (error) {
        console.error('[AktivitetScreen] Error fetching practice:', error);
        Alert.alert('Kunne ikke laste trening', 'Treningen kunne ikke lastes. Prøv igjen senere.');
        setSelectedPracticeForDetails(null);
      }
    }
  };

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
  };

  const hasMore = cards.length < total;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <AktivitetHeader paddingTop={insets.top + 16} filter={filter} onFilterChange={handleFilterChange} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <PracticeList
            cards={cards}
            loading={loading}
            loadingMore={loadingMore}
            filter={filter}
            hasMore={hasMore}
            total={total}
            onCardPress={handleCardPress}
            onLoadMore={handleLoadMore}
          />
        </ScrollView>
      </LinearGradient>
      <PracticeDetailsModal
        visible={!!selectedPracticeForDetails}
        practice={selectedPracticeForDetails}
        onClose={() => setSelectedPracticeForDetails(null)}
        onEdit={() => {
          const practiceToEdit = selectedPracticeForDetails;
          setSelectedPracticeForDetails(null);
          setEditingPractice(practiceToEdit);
          setPracticeModalVisible(true);
        }}
        onDeleted={() => {
          setSelectedPracticeForDetails(null);
          handleSaved();
        }}
      />
      <PracticeDetailsModal
        visible={!!selectedCompetitionForDetails}
        practice={selectedCompetitionForDetails}
        onClose={() => setSelectedCompetitionForDetails(null)}
        onEdit={() => {
          const competitionToEdit = selectedCompetitionForDetails;
          setSelectedCompetitionForDetails(null);
          setEditingCompetition(competitionToEdit);
          setCompetitionModalVisible(true);
        }}
        onDeleted={() => {
          setSelectedCompetitionForDetails(null);
          handleSaved();
        }}
      />
      <CreatePracticeForm
        visible={practiceModalVisible}
        onClose={() => {
          setPracticeModalVisible(false);
          setEditingPractice(null);
        }}
        bows={bows}
        arrowSets={arrows}
        editingPractice={editingPractice}
        onPracticeSaved={handleSaved}
      />
      <CreateCompetitionForm
        visible={competitionModalVisible}
        onClose={() => {
          setCompetitionModalVisible(false);
          setEditingCompetition(null);
        }}
        bows={bows}
        arrowSets={arrows}
        editingCompetition={editingCompetition}
        onSaved={handleSaved}
      />
      <BowForm
        modalVisible={bowModalVisible}
        setModalVisible={setBowModalVisible}
        bow={selectedBow}
        existingBows={bows}
        onSuccess={loadEquipment}
        onDeleteSuccess={(bowId) => {
          setBows((prev) => prev.filter((b) => b.id !== bowId));
          loadEquipment();
        }}
      />
      <ArrowForm
        modalVisible={arrowModalVisible}
        setArrowModalVisible={setArrowModalVisible}
        arrowSet={selectedArrowSet}
        existingArrowSets={arrows}
      />
      <MobileActionButton
        onCreatePractice={() => {
          setEditingPractice(null);
          setPracticeModalVisible(true);
        }}
        onCreateCompetition={() => {
          setEditingCompetition(null);
          setCompetitionModalVisible(true);
        }}
        onCreateBow={() => {
          setSelectedBow(null);
          setBowModalVisible(true);
        }}
        onCreateArrows={() => {
          setSelectedArrowSet(null);
          setArrowModalVisible(true);
        }}
      />
    </View>
  );
}
