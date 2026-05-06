import { useState, useCallback } from 'react';
import { Alert, View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatsSummary, EquipmentSection, PracticesSection } from '@/components/home';
import { useAuth } from '@/hooks';
import { Message, Button, MobileActionButton } from '@/components/common';
import { colors } from '@/styles/colors';
import { statsApi, StatsResponse } from '@/services/api/statsApi';
import { arrowsRepository, bowRepository, competitionRepository, practiceRepository, userRepository } from '@/services/repositories';
import { Bow, Arrows, Practice, Competition } from '@/types';
import BowForm from '@/components/home/bowForm/BowForm';
import ArrowForm from '@/components/home/arrowForm/ArrowForm';
import BowDetails from '@/components/home/bowDetails/BowDetails';
import ArrowSetDetails from '@/components/home/arrowSetDetails/ArrowSetDetails';
import CreatePracticeForm from '@/components/practice/practiceForm/CreatePracticeForm';
import { styles } from '@/components/home/HomeScreenStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import ProfileImageManager from '@/components/home/profile/ProfileImageManager';
import { AppError } from '@/services';
import CreateCompetitionForm from '@/components/practice/competitionForm/CreateCompetitionForm';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { PracticeDetailsModal } from '@/components/practice/practiceDetailsModal';

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<StatsResponse>({
    last7Days: { totalArrows: 0, scoredArrows: 0, unscoredArrows: 0, avgScorePerArrow: null },
    last30Days: { totalArrows: 0, scoredArrows: 0, unscoredArrows: 0, avgScorePerArrow: null },
    overall: { totalArrows: 0, scoredArrows: 0, unscoredArrows: 0, avgScorePerArrow: null },
  });
  const [bows, setBows] = useState<Bow[]>([]);
  const [arrows, setArrows] = useState<Arrows[]>([]);
  // refreshKey increments to trigger PracticesSection reload after save/delete
  const [practicesRefreshKey, setPracticesRefreshKey] = useState(0);
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [practiceModalVisible, setPracticeModalVisible] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);
  const [selectedBow, setSelectedBow] = useState<Bow | null>(null);
  const [selectedArrowSet, setSelectedArrowSet] = useState<Arrows | null>(null);
  const [selectedBowForDetails, setSelectedBowForDetails] = useState<Bow | null>(null);
  const [selectedArrowSetForDetails, setSelectedArrowSetForDetails] = useState<Arrows | null>(null);
  const [competitionModalVisible, setCompetitionModalVisible] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [selectedPracticeForDetails, setSelectedPracticeForDetails] = useState<Practice | null>(null);
  const [selectedCompetitionForDetails, setSelectedCompetitionForDetails] = useState<Competition | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [statsResult, bowsResult, arrowsResult] = await Promise.allSettled([
        statsApi.getStats(),
        bowRepository.getAll(),
        arrowsRepository.getAll(),
      ]);

      if (statsResult.status === 'fulfilled' && statsResult.value) {
        setStats((prev) => ({ ...prev, ...statsResult.value }));
      }
      if (bowsResult.status === 'fulfilled') {
        setBows(bowsResult.value || []);
      }
      if (arrowsResult.status === 'fulfilled') {
        setArrows(arrowsResult.value || []);
      }
    } catch (_error) {
      console.error('[HomePage] Error loading data:', _error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    // Also refresh the practices/competitions list
    setPracticesRefreshKey((k) => k + 1);
  };

  const handlePracticesSaved = () => {
    setPracticesRefreshKey((k) => k + 1);
  };

  async function handleAvatarUpload(uri: string) {
    try {
      await userRepository.updateAvatar(uri);
      await refreshUser();
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Kunne ikke laste opp bilde. Prøv igjen.';
      Alert.alert('Feil', message);
    }
  }

  async function handleAvatarRemove() {
    try {
      await userRepository.removeAvatar();
      await refreshUser();
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Kunne ikke fjerne bilde. Prøv igjen.';
      Alert.alert('Feil', message);
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Message title="Ikke innlogget" description="Vennligst logg inn for å se hjemskjermen." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 96 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <ProfileImageManager
                userName={user.name || user.email}
                avatarUrl={user.image || undefined}
                onUpload={handleAvatarUpload}
                onRemove={handleAvatarRemove}
                size={48}
              />
              <View style={styles.headerInfo}>
                <Text style={styles.greeting}>{user.name?.split(' ')[0] || 'Skytter'}</Text>
                {user.club && <Text style={styles.club}>{user.club}</Text>}
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => router.push('/(tabs)/skyttere')}
                  accessibilityLabel="Søk etter skyttere">
                  <FontAwesomeIcon icon={faUserGroup} size={18} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.trophyButton}
                  onPress={() => router.push('/(tabs)/home/achievements')}
                  accessibilityLabel="Mine prestasjoner">
                  <FontAwesomeIcon icon={faTrophy} size={20} color={colors.warning} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <StatsSummary last7Days={stats.last7Days} last30Days={stats.last30Days} overall={stats.overall} />
          <Button
            iconPosition="right"
            size="small"
            buttonStyle={{ alignSelf: 'center' }}
            icon={<FontAwesomeIcon icon={faChevronRight} size={16} color={colors.warning} />}
            label="Se detaljert statistikk"
            onPress={() => router.push('/(tabs)/home/statistics')}
          />
          <PracticesSection
            refreshKey={practicesRefreshKey}
            onSelectPractice={async (id) => {
              try {
                const fullPractice = await practiceRepository.getById(id);
                setSelectedPracticeForDetails(fullPractice);
              } catch (error) {
                console.error('[HomeScreen] Error fetching practice:', error);
                Alert.alert('Kunne ikke laste trening', 'Treningen kunne ikke lastes. Prøv igjen senere.');
                setSelectedPracticeForDetails(null);
              }
            }}
            onSelectCompetition={async (id) => {
              try {
                const fullCompetition = await competitionRepository.getById(id);
                setSelectedCompetitionForDetails(fullCompetition);
              } catch (error) {
                console.error('[HomeScreen] Error fetching competition:', error);
                Alert.alert('Kunne ikke laste konkurranse', 'Konkurransen kunne ikke lastes. Prøv igjen senere.');
                setSelectedCompetitionForDetails(null);
              }
            }}
          />
          <EquipmentSection
            bows={bows}
            arrows={arrows}
            onSelectBow={(bow) => {
              setSelectedBowForDetails(bow);
              setSelectedBow(null);
            }}
            onSelectArrows={(arrow) => {
              setSelectedArrowSetForDetails(arrow);
              setSelectedArrowSet(null);
            }}
          />
        </ScrollView>
      </LinearGradient>
      <BowForm
        modalVisible={bowModalVisible}
        setModalVisible={setBowModalVisible}
        bow={selectedBow}
        existingBows={bows}
        onSuccess={loadData}
        onDeleteSuccess={(bowId) => {
          setBows((prev) => prev.filter((b) => b.id !== bowId));
          loadData();
        }}
      />
      <ArrowForm
        modalVisible={arrowModalVisible}
        setArrowModalVisible={setArrowModalVisible}
        arrowSet={selectedArrowSet}
        existingArrowSets={arrows}
      />
      {selectedBowForDetails && (
        <BowDetails
          visible={!!selectedBowForDetails}
          bow={selectedBowForDetails}
          onClose={() => setSelectedBowForDetails(null)}
          onEdit={() => {
            const bowToEdit = selectedBowForDetails;
            setSelectedBowForDetails(null);
            setSelectedBow(bowToEdit);
            setBowModalVisible(true);
          }}
        />
      )}

      {selectedArrowSetForDetails && (
        <ArrowSetDetails
          visible={!!selectedArrowSetForDetails}
          arrowSet={selectedArrowSetForDetails}
          onClose={() => setSelectedArrowSetForDetails(null)}
          onEdit={() => {
            const arrowToEdit = selectedArrowSetForDetails;
            setSelectedArrowSetForDetails(null);
            setSelectedArrowSet(arrowToEdit);
            setArrowModalVisible(true);
          }}
        />
      )}
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
          setSelectedBowForDetails(null);
          setBowModalVisible(true);
        }}
        onCreateArrows={() => {
          setSelectedArrowSet(null);
          setSelectedArrowSetForDetails(null);
          setArrowModalVisible(true);
        }}
      />

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
          handlePracticesSaved();
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
          handlePracticesSaved();
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
        onPracticeSaved={handlePracticesSaved}
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
        onSaved={handlePracticesSaved}
      />
    </View>
  );
}
