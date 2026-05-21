import { View } from 'react-native';
import { DatePicker, Input, Select } from '@/components/common';
import { WeatherSelector } from '@/components/practice/shared/WeatherSelector';
import { EquipmentSelector } from '@/components/practice/shared/EquipmentSelector';
import { getPracticeCategoryOptions, getEnvironmentOptions } from '@/components/practice/shared/formConstants';
import { useTranslation } from '@/contexts';
import { Environment, PracticeCategory, WeatherCondition } from '@/types';
import { styles } from './CreatePracticeFormStyles';

interface InfoStepProps {
  date: Date;
  onDateChange: (date: Date) => void;
  practiceCategory: PracticeCategory;
  onCategoryChange: (cat: PracticeCategory) => void;
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
  location: string;
  onLocationChange: (loc: string) => void;
  weather: WeatherCondition[];
  onToggleWeather: (condition: WeatherCondition) => void;
  bowOptions: { label: string; value: string }[];
  arrowSetOptions: { label: string; value: string }[];
  selectedBow: string;
  selectedArrowSet: string;
  onBowChange: (value: string) => void;
  onArrowSetChange: (value: string) => void;
}

export function InfoStep({
  date,
  onDateChange,
  practiceCategory,
  onCategoryChange,
  environment,
  onEnvironmentChange,
  location,
  onLocationChange,
  weather,
  onToggleWeather,
  bowOptions,
  arrowSetOptions,
  selectedBow,
  selectedArrowSet,
  onBowChange,
  onArrowSetChange,
}: InfoStepProps) {
  const { t } = useTranslation();
  const PRACTICE_CATEGORY_OPTIONS = getPracticeCategoryOptions(t);
  const ENVIRONMENT_OPTIONS = getEnvironmentOptions(t);

  return (
    <View style={styles.stepContent}>
      <View style={styles.row}>
        <DatePicker label={t['form.date']} value={date} onDateChange={onDateChange} containerStyle={styles.field} />
        <Select
          label={t['form.category']}
          options={PRACTICE_CATEGORY_OPTIONS}
          selectedValue={practiceCategory}
          onValueChange={(v) => onCategoryChange(v as PracticeCategory)}
          containerStyle={styles.field}
        />
      </View>

      <View style={styles.row}>
        <Select
          label={t['form.environment']}
          options={ENVIRONMENT_OPTIONS}
          selectedValue={environment}
          onValueChange={(v) => onEnvironmentChange(v as Environment)}
          containerStyle={styles.field}
        />
        <Input
          label={t['form.location']}
          value={location}
          onChangeText={onLocationChange}
          placeholder={t['form.locationPlaceholder']}
          maxLength={64}
          containerStyle={styles.field}
        />
      </View>

      {environment === Environment.OUTDOOR && <WeatherSelector selectedWeather={weather} onToggleWeather={onToggleWeather} />}

      <EquipmentSelector
        bowOptions={bowOptions}
        arrowSetOptions={arrowSetOptions}
        selectedBow={selectedBow}
        selectedArrowSet={selectedArrowSet}
        onBowChange={onBowChange}
        onArrowSetChange={onArrowSetChange}
      />
    </View>
  );
}
