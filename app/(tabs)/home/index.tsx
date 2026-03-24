import { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatsSummary, EquipmentSection, PracticesSection } from '@/components/home';
import { useAuth } from '@/hooks';
import { Message, Button, MobileActionButton } from '@/components/common';
import { colors } from '@/styles/colors';
import { statsApi, StatsResponse } from '@/services/api/statsApi';
import { arrowsRepository, bowRepository, practiceRepository } from '@/services/repositories';
import { Bow, Arrows, Practice } from '@/types';
import BowForm from '@/components/home/bowForm/BowForm';
import ArrowForm from '@/components/home/arrowForm/ArrowForm';
import BowDetails from '@/components/home/bowDetails/BowDetails';
import ArrowSetDetails from '@/components/home/arrowSetDetails/ArrowSetDetails';
import { styles } from '@/components/home/HomeScreenStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';

export default function HomeScreen() {
  const { user } = useAuth();
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
  const [practices, setPractices] = useState<Practice[]>([]);
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [selectedBow, setSelectedBow] = useState<Bow | null>(null);
  const [selectedArrowSet, setSelectedArrowSet] = useState<Arrows | null>(null);
  const [selectedBowForDetails, setSelectedBowForDetails] = useState<Bow | null>(null);
  const [selectedArrowSetForDetails, setSelectedArrowSetForDetails] = useState<Arrows | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [statsResult, bowsResult, arrowsResult, practicesResult] = await Promise.allSettled([
        statsApi.getStats(),
        bowRepository.getAll(),
        arrowsRepository.getAll(),
        practiceRepository.getAll({ page: 1, limit: 5 }),
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
      if (practicesResult.status === 'fulfilled') {
        setPractices(practicesResult.value?.practices || []);
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
  };

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
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hei, {user.name?.split(' ')[0] || 'Skytter'}!</Text>
            {user.club && <Text style={styles.club}>{user.club}</Text>}
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
          <PracticesSection practices={practices} loading={false} onSelectPractice={(_id) => {}} />
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
        onCreatePractice={() => {}}
        onCreateCompetition={() => {}}
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
    </View>
  );
}
