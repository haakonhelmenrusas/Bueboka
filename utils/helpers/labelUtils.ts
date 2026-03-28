import { BowType, Material, PracticeCategory, WeatherCondition } from '@/types';

/**
 * Get Norwegian label for bow type
 */
export function getBowTypeLabel(type: BowType): string {
  switch (type) {
    case BowType.RECURVE:
      return 'Recurve';
    case BowType.COMPOUND:
      return 'Compound';
    case BowType.LONGBOW:
      return 'Langbue';
    case BowType.BAREBOW:
      return 'Barebow';
    case BowType.HORSEBOW:
      return 'Hestebue';
    case BowType.TRADITIONAL:
      return 'Tradisjonell';
    case BowType.OTHER:
      return 'Annet';
    default:
      return type;
  }
}

/**
 * Get Norwegian label for arrow material
 */
export function getArrowMaterialLabel(material: Material): string {
  switch (material) {
    case Material.KARBON:
      return 'Karbon';
    case Material.ALUMINIUM:
      return 'Aluminium';
    case Material.TREVERK:
      return 'Treverk';
    default:
      return material;
  }
}

/**
 * Get Norwegian label for practice category
 */
export function getPracticeCategoryLabel(category: PracticeCategory): string {
  switch (category) {
    case PracticeCategory.SKIVE_INDOOR:
      return 'Skive innendørs';
    case PracticeCategory.SKIVE_OUTDOOR:
      return 'Skive utendørs';
    case PracticeCategory.JAKT_3D:
      return 'Jakt 3D';
    case PracticeCategory.FELT:
      return 'Felt';
    default:
      return category;
  }
}

/**
 * Get emoji + label for weather condition
 */
export function getWeatherConditionLabel(condition: WeatherCondition): string {
  switch (condition) {
    case WeatherCondition.SUN:
      return '☀️ Sol';
    case WeatherCondition.CLOUDED:
      return '⛅ Skyet';
    case WeatherCondition.CLEAR:
      return '🌤 Klart';
    case WeatherCondition.RAIN:
      return '🌧 Regn';
    case WeatherCondition.WIND:
      return '💨 Vind';
    case WeatherCondition.SNOW:
      return '❄️ Snø';
    case WeatherCondition.FOG:
      return '🌫 Tåke';
    case WeatherCondition.THUNDER:
      return '⛈ Torden';
    case WeatherCondition.CHANGING_CONDITIONS:
      return '🔄 Skiftende';
    case WeatherCondition.OTHER:
      return '🌡 Annet';
    default:
      return condition;
  }
}

/**
 * Format multiple weather conditions into a single string
 */
export function formatWeatherConditions(conditions: WeatherCondition[]): string {
  if (!conditions || conditions.length === 0) return '';
  return conditions.map(getWeatherConditionLabel).join(', ');
}
