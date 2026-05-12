import { BowType, Material, PracticeCategory, WeatherCondition } from '@/types';
import type { TranslationKeys } from '@/lib/i18n';

/**
 * Get the localized label for a bow type.
 */
export function getBowTypeLabel(type: BowType, t: TranslationKeys): string {
  switch (type) {
    case BowType.RECURVE:
      return t['bowType.recurve'];
    case BowType.COMPOUND:
      return t['bowType.compound'];
    case BowType.LONGBOW:
      return t['bowType.longbow'];
    case BowType.BAREBOW:
      return t['bowType.barebow'];
    case BowType.HORSEBOW:
      return t['bowType.horsebow'];
    case BowType.TRADITIONAL:
      return t['bowType.traditional'];
    case BowType.OTHER:
      return t['bowType.other'];
    default:
      return type;
  }
}

/**
 * Get the localized label for an arrow material.
 */
export function getArrowMaterialLabel(material: Material, t: TranslationKeys): string {
  switch (material) {
    case Material.KARBON:
      return t['arrowMaterial.karbon'];
    case Material.ALUMINIUM:
      return t['arrowMaterial.aluminium'];
    case Material.TREVERK:
      return t['arrowMaterial.treverk'];
    default:
      return material;
  }
}

/**
 * Get the localized label for a practice category.
 */
export function getPracticeCategoryLabel(category: PracticeCategory, t: TranslationKeys): string {
  switch (category) {
    case PracticeCategory.SKIVE_INDOOR:
      return t['practiceCategory.skiveIndoor'];
    case PracticeCategory.SKIVE_OUTDOOR:
      return t['practiceCategory.skiveOutdoor'];
    case PracticeCategory.JAKT_3D:
      return t['practiceCategory.jakt3D'];
    case PracticeCategory.FELT:
      return t['practiceCategory.felt'];
    default:
      return category;
  }
}

/**
 * Get emoji + localized label for a single weather condition.
 */
export function getWeatherConditionLabel(condition: WeatherCondition, t: TranslationKeys): string {
  switch (condition) {
    case WeatherCondition.SUN:
      return t['weather.sun'];
    case WeatherCondition.CLOUDED:
      return t['weather.clouded'];
    case WeatherCondition.CLEAR:
      return t['weather.clear'];
    case WeatherCondition.RAIN:
      return t['weather.rain'];
    case WeatherCondition.WIND:
      return t['weather.wind'];
    case WeatherCondition.SNOW:
      return t['weather.snow'];
    case WeatherCondition.FOG:
      return t['weather.fog'];
    case WeatherCondition.THUNDER:
      return t['weather.thunder'];
    case WeatherCondition.CHANGING_CONDITIONS:
      return t['weather.changing'];
    case WeatherCondition.OTHER:
      return t['weather.other'];
    default:
      return condition;
  }
}

/**
 * Format multiple weather conditions into a single localized string.
 */
export function formatWeatherConditions(conditions: WeatherCondition[], t: TranslationKeys): string {
  if (!conditions || conditions.length === 0) return '';
  return conditions.map((c) => getWeatherConditionLabel(c, t)).join(', ');
}
