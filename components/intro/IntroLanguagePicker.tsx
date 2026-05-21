import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@/contexts';
import type { Locale } from '@/lib/i18n';
import { introLanguagePickerStyles as s } from './IntroLanguagePickerStyles';

const OPTIONS: { code: Locale; flag: string }[] = [
  { code: 'no', flag: '🇳🇴' },
  { code: 'en', flag: '🇬🇧' },
];

export default function IntroLanguagePicker() {
  const { locale, setLanguage, t } = useTranslation();

  return (
    <View style={s.container} accessibilityLabel={t['intro.chooseLanguage']} accessibilityRole="radiogroup">
      {OPTIONS.map((opt) => {
        const active = locale === opt.code;
        return (
          <TouchableOpacity
            key={opt.code}
            onPress={() => void setLanguage(opt.code)}
            style={[s.pill, active && s.pillActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <Text style={s.flag}>{opt.flag}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
