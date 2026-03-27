import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { colors } from '@/styles/colors';
import { arrowsRepository, bowRepository, competitionRepository, practiceRepository } from '@/services/repositories';
import { Arrows, Bow, Competition, Practice, PracticeCardItem, PracticeFilter } from '@/types';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import SkeletonTrainingCard from '@/components/practice/practiceCard/SkeletonTrainingCard';
import CreatePracticeForm from '@/components/practice/practiceForm/CreatePracticeForm';
import CreateCompetitionForm from '@/components/practice/competitionForm/CreateCompetitionForm';
import BowForm from '@/components/home/bowForm/BowForm';
import ArrowForm from '@/components/home/arrowForm/ArrowForm';
import { MobileActionButton } from '@/components/common';
import { PracticeDetailsModal } from '@/components/practice/practiceDetailsModal';

const PAGE_SIZE = 15;

const FILTERS: { label: string; value: PracticeFilter }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Treninger', value: 'TRENING' },
  { label: 'Konkurranser', value: 'KONKURRANSE' },
];

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
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <FontAwesomeIcon icon={faBullseye} size={20} color={colors.white} />
            </View>
            <Text style={styles.headerTitle}>Aktivitet</Text>
          </View>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
                onPress={() => handleFilterChange(f.value)}
                accessibilityLabel={f.label}>
                <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.list}>
              {[0, 1, 2, 3].map((i) => (
                <SkeletonTrainingCard key={i} />
              ))}
            </View>
          ) : cards.length === 0 ? (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {filter === 'TRENING'
                  ? 'Ingen treninger lagt til ennå'
                  : filter === 'KONKURRANSE'
                    ? 'Ingen konkurranser lagt til ennå'
                    : 'Ingen treninger eller konkurranser ennå'}
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {cards.map((card) => (
                <PracticeCard key={`${card.practiceType}-${card.id}`} card={card} onPress={handleCardPress} />
              ))}
              {hasMore && (
                <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore} disabled={loadingMore} accessibilityLabel="Last mer">
                  {loadingMore ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={styles.loadMoreText}>Last mer ({total - cards.length} gjenstår)</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Detail Modals */}
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

      {/* Form Modals */}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  filterTabActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  filterTabTextActive: {
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 8,
  },
  list: { gap: 8 },
  loadMoreBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginTop: 4,
    minHeight: 44,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  placeholder: {
    backgroundColor: 'rgba(12,130,172,0.05)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(12,130,172,0.26)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
});
