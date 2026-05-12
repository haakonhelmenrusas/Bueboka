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

  // Shared form fields (used by practice + competition forms)
  'form.date': string;
  'form.category': string;
  'form.environment': string;
  'form.location': string;
  'form.locationPlaceholder': string;
  'form.weather': string;
  'form.optional': string;
  'form.notes': string;
  'form.bow': string;
  'form.arrows': string;
  'form.selectBowPlaceholder': string;
  'form.selectArrowsPlaceholder': string;
  'form.equipment': string;
  'form.prevStep': string;
  'form.nextStep': string;
  'form.save': string;
  'form.saving': string;
  'form.distance': string;
  'form.distanceFrom': string;
  'form.distanceTo': string;
  'form.target': string;
  'form.choose': string;
  'form.arrowsWithScore': string;
  'form.arrowsPerEnd': string;
  'form.arrowsWithoutScore': string;
  'form.score': string;

  // Practice category options (used in the form Category select)
  'practiceCategory.skiveIndoor': string;
  'practiceCategory.skiveOutdoor': string;
  'practiceCategory.jakt3D': string;
  'practiceCategory.felt': string;

  // Environment options (used in the form Environment select)
  'environment.indoor': string;
  'environment.outdoor': string;

  // Weather chip labels
  'weather.sun': string;
  'weather.clouded': string;
  'weather.clear': string;
  'weather.rain': string;
  'weather.wind': string;
  'weather.snow': string;
  'weather.fog': string;
  'weather.thunder': string;
  'weather.changing': string;
  'weather.other': string;

  // Practice form step indicator + navigation
  'practiceStep.info': string;
  'practiceStep.rounds': string;
  'practiceStep.scoring': string;
  'practiceStep.reflection': string;
  'practiceStep.goTo': string;

  // Competition form step indicator
  'competitionStep.info': string;
  'competitionStep.details': string;
  'competitionStep.rounds': string;
  'competitionStep.reflection': string;

  // Target type labels (used in the rounds step Target select)
  'target.size40cm': string;
  'target.size60cm': string;
  'target.size80cm': string;
  'target.size122cm': string;
  'target.figure3D': string;
  'target.field24cm': string;
  'target.field60cm': string;
  'target.other': string;

  // Round card UI
  'round.title': string;
  'round.remove': string;
  'round.add': string;
  'round.maxLimit': string;
  'round.noDetails': string;

  // Scoring step UI
  'scoring.methodSection': string;
  'scoring.methodButtons': string;
  'scoring.methodTarget': string;
  'scoring.startShooting': string;
  'scoring.noArrowRounds': string;
  'scoring.totalScoreLabel': string;
  'scoring.points': string;
  'scoring.manualScoreHint': string;
  'scoring.previousEnd': string;
  'scoring.nextEnd': string;
  'scoring.endLabel': string;
  'scoring.of': string;
  'scoring.arrowsRecorded': string;
  'scoring.sum': string;
  'scoring.editingArrowPrefix': string;
  'scoring.allRegistered': string;
  'scoring.scoreSuffix': string;
  'scoring.editArrowAriaPrefix': string;

  // Reflection step UI
  'reflection.ratingLabel': string;
  'reflection.ratingPromptPractice': string;
  'reflection.ratingPromptCompetition': string;
  'reflection.ratingAriaPrefix': string;
  'reflection.notesPlaceholder': string;

  // Practice form (titles, confirms, errors)
  'practiceForm.editTitle': string;
  'practiceForm.newTitle': string;
  'practiceForm.deleteTitle': string;
  'practiceForm.deleteMessage': string;
  'practiceForm.discardTitle': string;
  'practiceForm.discardMessage': string;
  'practiceForm.discardConfirm': string;
  'practiceForm.discardCancel': string;
  'practiceForm.saveError': string;
  'practiceForm.startShootingError': string;

  // Competition form (titles, fields, errors)
  'competitionForm.editTitle': string;
  'competitionForm.newTitle': string;
  'competitionForm.deleteTitle': string;
  'competitionForm.deleteMessage': string;
  'competitionForm.saveError': string;
  'competitionForm.nameRequired': string;
  'competitionForm.nameLabel': string;
  'competitionForm.namePlaceholder': string;
  'competitionForm.organizer': string;
  'competitionForm.organizerPlaceholder': string;
  'competitionForm.placement': string;
  'competitionForm.placementPlaceholder': string;
  'competitionForm.participants': string;
  'competitionForm.participantsPlaceholder': string;
  'competitionForm.personalBest': string;
  'competitionForm.personalBestHint': string;
  'competitionForm.locationPlaceholder': string;

  // Activity feed tab
  'aktivitet.title': string;
  'aktivitet.filterAll': string;
  'aktivitet.filterPractices': string;
  'aktivitet.filterCompetitions': string;
  'aktivitet.emptyPractices': string;
  'aktivitet.emptyCompetitions': string;
  'aktivitet.loadMore': string;
  'aktivitet.remaining': string;

  // Practice card (used on dashboard + activity feed)
  'practiceCard.badgePractice': string;
  'practiceCard.badgeCompetition': string;
  'practiceCard.arrowsSuffix': string;
  'practiceCard.placementLabel': string;
  'practiceCard.envIndoor': string;
  'practiceCard.envOutdoor': string;

  // Practice details modal
  'practiceDetails.confirmDeleteTitle': string;
  'practiceDetails.deletePracticeConfirm': string;
  'practiceDetails.deleteCompetitionConfirm': string;
  'practiceDetails.deleteFailed': string;
  'practiceDetails.share': string;
  'practiceDetails.shareComingSoon': string;
  'practiceDetails.totalScore': string;
  'practiceDetails.arrowsShot': string;
  'practiceDetails.bowLabel': string;
  'practiceDetails.arrowsLabel': string;
  'practiceDetails.placementOf': string;
  'practiceDetails.unscoredTitle': string;
  'practiceDetails.unscoredCountSuffix': string;
  'practiceDetails.edit': string;
  'practiceDetails.close': string;
  'practiceDetails.deleting': string;

  // Round card (in details modal)
  'roundCard.distance': string;

  // Bow types (from labelUtils)
  'bowType.recurve': string;
  'bowType.compound': string;
  'bowType.longbow': string;
  'bowType.barebow': string;
  'bowType.horsebow': string;
  'bowType.traditional': string;
  'bowType.other': string;

  // Arrow materials (from labelUtils)
  'arrowMaterial.karbon': string;
  'arrowMaterial.aluminium': string;
  'arrowMaterial.treverk': string;

  // Achievements screen
  'achievements.fetchError': string;
  'achievements.subtitle': string;
  'achievements.loading': string;
  'achievements.retry': string;
  'achievements.summaryUnlocked': string;
  'achievements.summaryCompletion': string;
  'achievements.summaryPoints': string;
  'achievements.filterStatus': string;
  'achievements.filterStatusUnlocked': string;
  'achievements.filterStatusLocked': string;
  'achievements.filterMilestone': string;
  'achievements.filterStreak': string;
  'achievements.filterPerformance': string;
  'achievements.filterCompetition': string;
  'achievements.filterDedication': string;
  'achievements.filterExploration': string;
  'achievements.filterSpecial': string;
  'achievements.filterRarity': string;
  'achievements.rarityCommon': string;
  'achievements.rarityUncommon': string;
  'achievements.rarityRare': string;
  'achievements.rarityEpic': string;
  'achievements.rarityLegendary': string;
  'achievements.emptyTitle': string;
  'achievements.emptySubtitle': string;
  'achievements.unlockedBadge': string;

  // Statistics screen
  'statistics.title': string;
  'statistics.subtitle': string;
  'statistics.loading': string;
  'statistics.fetchError': string;
  'statistics.emptyTitle': string;
  'statistics.emptySubtitle': string;
  'statistics.period': string;
  'statistics.date7days': string;
  'statistics.date30days': string;
  'statistics.date90days': string;
  'statistics.arrowsCategoryLabel': string;
  'statistics.scoreCategoryLabel': string;
  'statistics.categorySkiveIndoor': string;
  'statistics.categorySkiveOutdoor': string;
  'statistics.categoryJakt3D': string;
  'statistics.categoryFelt': string;
  'statistics.breakdownTitle': string;
  'statistics.sessions': string;
  'statistics.totalArrows': string;
  'statistics.scoredArrows': string;
  'statistics.unscored': string;
  'statistics.arrowsPerSession': string;
  'statistics.avgScorePerArrow': string;
  'statistics.arrowsChartTitle': string;
  'statistics.arrowsChartCardTitle': string;
  'statistics.noDataForPeriod': string;
  'statistics.scoreChartTitle': string;
  'statistics.scoreChartCardTitle': string;
  'statistics.noScoredForPeriod': string;
  'statistics.legendTraining': string;
  'statistics.legendCompetition': string;
}
