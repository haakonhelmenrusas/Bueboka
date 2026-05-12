export type Locale = 'no' | 'en';

// Translation keys are added in batches as each screen is migrated. Names
// mirror the web app's TranslationKeys where possible so the two locale
// sets can eventually be shared.
export interface TranslationKeys {
  // Language switcher (in Settings)
  'language.sectionTitle': string;
  'language.helpText': string;
  'language.norwegian': string;
  'language.english': string;
  'language.current': string;
  'language.switchTo': string;

  // Intro screen
  'intro.tagline': string;
  'intro.titleLine1': string;
  'intro.titleLine2': string;
  'intro.body': string;
  'intro.getStarted': string;

  // Auth screen
  'auth.emailLabel': string;
  'auth.passwordLabel': string;
  'auth.loginButton': string;
  'auth.registerButton': string;
  'auth.loginWithGoogle': string;
  'auth.errorTitle': string;
  'auth.toggleToRegister': string;
  'auth.toggleToLogin': string;
  'auth.divider': string;

  // Validation
  'validation.emailPasswordRequired': string;
  'validation.passwordMinLength': string;
  'validation.genericError': string;

  // Common
  'common.loading': string;
  'common.success': string;
  'common.error': string;

  // Email verification screen
  'emailVerification.title': string;
  'emailVerification.sentTo': string;
  'emailVerification.instructions': string;
  'emailVerification.checkButton': string;
  'emailVerification.resendButton': string;
  'emailVerification.resendCooldown': string;
  'emailVerification.sendingEmail': string;
  'emailVerification.checkingStatus': string;
  'emailVerification.notVerifiedYet': string;
  'emailVerification.checkFailed': string;
  'emailVerification.sentSuccess': string;
  'emailVerification.sendFailed': string;
  'emailVerification.helpText': string;

  // Email verification banner
  'emailBanner.notVerified': string;
  'emailBanner.resend': string;
  'emailBanner.sending': string;
  'emailBanner.sendError': string;
}
