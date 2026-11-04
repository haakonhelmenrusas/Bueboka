import { useCallback, useMemo, useState } from 'react';
import { competitionRepository } from '@/services/repositories';
import type { Competition, CompetitionStats } from '@/types';
import { computeCompetitionStats, splitCompetitions } from '@/utils/competitionStats';
import { useTranslation } from '@/contexts/LanguageContext';

/**
 * Loads the user's competitions and derives the active/past split plus
 * overview statistics for the konkurranse screen.
 */
export function useCompetitions() {
  const { t } = useTranslation();

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await competitionRepository.getAll();
      setCompetitions(response.competitions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(t['common.unknownError']));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const { active, past } = useMemo(() => splitCompetitions(competitions), [competitions]);
  const stats: CompetitionStats = useMemo(() => computeCompetitionStats(competitions), [competitions]);

  return {
    competitions,
    active,
    past,
    stats,
    loading,
    error,
    fetchCompetitions,
    refresh: fetchCompetitions,
  };
}
