import type { TranslationKeys } from '@/lib/i18n/types';

export const en: TranslationKeys = {
  'language.sectionTitle': 'Language',
  'language.helpText': 'Choose the app language',
  'language.norwegian': 'Norwegian',
  'language.english': 'English',
  'language.current': 'Current',
  'language.switchTo': 'Switch to',

  'intro.tagline': 'Training tracker for archers',
  'intro.titleLine1': 'Every shot',
  'intro.titleLine2': 'counts.',
  'intro.body':
    'Log practices and competitions, track your sight marks and follow your progress over time. Everything you need to become a better archer.',
  'intro.getStarted': 'Get started',

  'auth.emailLabel': 'Email',
  'auth.passwordLabel': 'Password',
  'auth.loginButton': 'Log in',
  'auth.registerButton': 'Create account',
  'auth.loginWithGoogle': 'Continue with Google',
  'auth.errorTitle': 'Error',
  'auth.toggleToRegister': 'Sign up',
  'auth.toggleToLogin': 'Log in',
  'auth.divider': 'or',

  'validation.emailPasswordRequired': 'Email and password are required',
  'validation.passwordMinLength': 'Password must be at least 8 characters',
  'validation.genericError': 'An error occurred',

  'common.loading': 'Loading...',
  'common.success': 'Success',
  'common.error': 'Error',

  'emailVerification.title': 'Verify your email',
  'emailVerification.sentTo': "We've sent a verification link to",
  'emailVerification.instructions':
    'Click the link in the email to verify your account. Once verified, come back here and tap "I have verified".',
  'emailVerification.checkButton': 'I have verified',
  'emailVerification.resendButton': 'Resend email',
  'emailVerification.resendCooldown': 'Resend',
  'emailVerification.sendingEmail': 'Sending email...',
  'emailVerification.checkingStatus': 'Checking status...',
  'emailVerification.notVerifiedYet': 'Email not verified yet. Please check your inbox.',
  'emailVerification.checkFailed': 'Failed to check verification status',
  'emailVerification.sentSuccess': 'Verification email sent! Check your inbox.',
  'emailVerification.sendFailed': 'Failed to resend email',
  'emailVerification.helpText': 'Didn\'t receive the email? Check your spam folder or tap "Resend email".',

  'emailBanner.notVerified': 'Your email is not verified.',
  'emailBanner.resend': 'Resend verification',
  'emailBanner.sending': 'Sending...',
  'emailBanner.sendError': 'Failed to send verification email. Please try again.',
};
