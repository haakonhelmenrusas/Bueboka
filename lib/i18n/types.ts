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
  'common.cancel': string;
  'common.delete': string;
  'common.tryAgain': string;
  'common.seeAll': string;

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

  // Home screen
  'home.greetingFallback': string;
  'home.searchArchers': string;
  'home.myAchievements': string;
  'home.detailedStats': string;
  'home.notLoggedInTitle': string;
  'home.notLoggedInDesc': string;
  'home.uploadAvatarError': string;
  'home.removeAvatarError': string;
  'home.loadPracticeErrorTitle': string;
  'home.loadPracticeErrorDesc': string;
  'home.loadCompetitionErrorTitle': string;
  'home.loadCompetitionErrorDesc': string;

  // Recent activity section
  'recentActivity.title': string;
  'recentActivity.seeAllAriaLabel': string;
  'recentActivity.empty': string;

  // Equipment section
  'equipment.bows': string;
  'equipment.arrows': string;
  'equipment.noBows': string;
  'equipment.noArrows': string;

  // Stats summary
  'statsSummary.last7days': string;
  'statsSummary.last30days': string;
  'statsSummary.total': string;
  'statsSummary.totalArrows': string;
  'statsSummary.withScore': string;
  'statsSummary.withoutScore': string;

  // Profile box
  'profileBox.editProfile': string;
  'profileBox.fallbackName': string;

  // Avatar / profile image manager
  'avatar.noPermissionTitle': string;
  'avatar.noPermissionMessage': string;
  'avatar.tooLargeTitle': string;
  'avatar.tooLargeMessage': string;
  'avatar.uploadedTitle': string;
  'avatar.uploadedMessage': string;
  'avatar.uploadErrorTitle': string;
  'avatar.removeTitle': string;
  'avatar.removeConfirm': string;
  'avatar.remove': string;
  'avatar.removedTitle': string;
  'avatar.removedMessage': string;
  'avatar.removeErrorTitle': string;
  'avatar.menuTitle': string;
  'avatar.uploading': string;
  'avatar.choose': string;
  'avatar.removing': string;
  'avatar.removeButton': string;

  // Bow details modal
  'bowDetails.type': string;
  'bowDetails.eyeToNock': string;
  'bowDetails.eyeToSight': string;
  'bowDetails.aimMeasure': string;
  'bowDetails.limbs': string;
  'bowDetails.riser': string;
  'bowDetails.hand': string;
  'bowDetails.handRH': string;
  'bowDetails.handLH': string;
  'bowDetails.drawWeight': string;
  'bowDetails.poundsSuffix': string;
  'bowDetails.bowLength': string;
  'bowDetails.notes': string;

  // Arrow set details modal
  'arrowDetails.material': string;
  'arrowDetails.arrowCount': string;
  'arrowDetails.spine': string;
  'arrowDetails.weight': string;
  'arrowDetails.length': string;
  'arrowDetails.lengthSuffix': string;
  'arrowDetails.diameter': string;
  'arrowDetails.pointType': string;
  'arrowDetails.pointWeight': string;
  'arrowDetails.vanes': string;
  'arrowDetails.nock': string;
  'arrowDetails.notes': string;
}
