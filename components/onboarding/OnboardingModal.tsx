import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { Button } from '@/components/common';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';
import { styles } from './OnboardingStyles';

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ visible, onClose }: OnboardingModalProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) setCurrentStep(0);
  }, [visible]);

  const steps = [
    {
      title: t['onboarding.welcomeTitle'],
      subtitle: t['onboarding.welcomeSubtitle'],
      content: (
        <View>
          <Text style={styles.heroText}>{t['onboarding.welcomeBody']}</Text>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <FontAwesomeIcon icon={faBullseye} size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{t['onboarding.feature1Title']}</Text>
              <Text style={styles.featureDesc}>{t['onboarding.feature1Desc']}</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <FontAwesomeIcon icon={faChartBar} size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{t['onboarding.feature2Title']}</Text>
              <Text style={styles.featureDesc}>{t['onboarding.feature2Desc']}</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <FontAwesomeIcon icon={faArrowTrendUp} size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{t['onboarding.feature3Title']}</Text>
              <Text style={styles.featureDesc}>{t['onboarding.feature3Desc']}</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      title: t['onboarding.stepsTitle'],
      subtitle: t['onboarding.stepsSubtitle'],
      content: (
        <View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>{t['onboarding.step1Title']}</Text>
              <Text style={styles.stepDesc}>{t['onboarding.step1Desc']}</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>{t['onboarding.step2Title']}</Text>
              <Text style={styles.stepDesc}>{t['onboarding.step2Desc']}</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>{t['onboarding.step3Title']}</Text>
              <Text style={styles.stepDesc}>{t['onboarding.step3Desc']}</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      title: t['onboarding.tipsTitle'],
      subtitle: t['onboarding.tipsSubtitle'],
      content: (
        <View>
          <View style={styles.tipItem}>
            <View style={styles.tipIconWrapper}>
              <FontAwesomeIcon icon={faCheck} size={14} color={colors.tertiary} />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t['onboarding.tip1Title']}</Text>
              <Text style={styles.tipDesc}>{t['onboarding.tip1Desc']}</Text>
            </View>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIconWrapper}>
              <FontAwesomeIcon icon={faCheck} size={14} color={colors.tertiary} />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t['onboarding.tip2Title']}</Text>
              <Text style={styles.tipDesc}>{t['onboarding.tip2Desc']}</Text>
            </View>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIconWrapper}>
              <FontAwesomeIcon icon={faCheck} size={14} color={colors.tertiary} />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t['onboarding.tip3Title']}</Text>
              <Text style={styles.tipDesc}>{t['onboarding.tip3Desc']}</Text>
            </View>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIconWrapper}>
              <FontAwesomeIcon icon={faCheck} size={14} color={colors.tertiary} />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t['onboarding.tip4Title']}</Text>
              <Text style={styles.tipDesc}>{t['onboarding.tip4Desc']}</Text>
            </View>
          </View>
        </View>
      ),
    },
  ];

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <LinearGradient colors={[colors.primaryDark, colors.primary, '#0a4a63']} locations={[0, 0.55, 1]} style={styles.gradient}>
        <View style={[styles.ring, styles.ring1]} />
        <View style={[styles.ring, styles.ring2]} />
        <View style={[styles.ring, styles.ring3]} />
        <View style={[styles.ring, styles.ring4]} />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Pressable style={styles.skipButton} onPress={onClose}>
              <Text style={styles.skipText}>{t['onboarding.skip']}</Text>
            </Pressable>

            <View style={styles.header}>
              <Text style={styles.title}>{currentStepData.title}</Text>
              <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
              {currentStepData.content}
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.dots}>
                {steps.map((_, index) => (
                  <Pressable
                    key={index}
                    style={[styles.dot, index === currentStep && styles.dotActive, index < currentStep && styles.dotCompleted]}
                    onPress={() => setCurrentStep(index)}
                    accessibilityLabel={`${t['onboarding.goToStep']} ${index + 1}`}
                  />
                ))}
              </View>
              <View style={styles.actions}>
                {currentStep > 0 && (
                  <Button
                    label={t['onboarding.previous']}
                    onPress={handlePrevious}
                    type="outline"
                    buttonStyle={styles.backButton}
                    textStyle={{ color: colors.white }}
                    width="48%"
                    icon={<FontAwesomeIcon icon={faChevronLeft} size={14} color={colors.white} />}
                  />
                )}
                <Button
                  label={isLastStep ? t['onboarding.getStarted'] : t['onboarding.next']}
                  onPress={handleNext}
                  variant="tertiary"
                  buttonStyle={styles.nextButton}
                  width={currentStep > 0 ? '48%' : '100%'}
                  icon={<FontAwesomeIcon icon={faChevronRight} size={14} color={colors.primary} />}
                  iconPosition="right"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}
