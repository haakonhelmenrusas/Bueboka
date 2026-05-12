import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';
import { languageSectionStyles as s } from '@/components/settings/LanguageSectionStyles';
import { useTranslation } from '@/contexts';
import type { Locale } from '@/lib/i18n';

const OPTIONS: { code: Locale; flag: string; labelKey: 'language.norwegian' | 'language.english' }[] = [
  { code: 'no', flag: '🇳🇴', labelKey: 'language.norwegian' },
  { code: 'en', flag: '🇬🇧', labelKey: 'language.english' },
];

export default function LanguageSection() {
  const { locale, setLanguage, t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t['language.sectionTitle']}</Text>
      <View style={styles.sectionCard}>
        <Text style={s.helpText}>{t['language.helpText']}</Text>
        <View style={s.optionList}>
          {OPTIONS.map((opt) => {
            const active = locale === opt.code;
            return (
              <TouchableOpacity
                key={opt.code}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${t['language.switchTo']} ${t[opt.labelKey]}`}
                onPress={() => void setLanguage(opt.code)}
                style={[s.option, active && s.optionActive]}>
                <Text style={s.flag}>{opt.flag}</Text>
                <Text style={[s.optionLabel, active && s.optionLabelActive]}>{t[opt.labelKey]}</Text>
                {active ? <FontAwesomeIcon icon={faCheck} size={14} color={colors.primary} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
