import { useState } from 'react';

/**
 * Hook for managing multi-step form navigation
 */
export function useStepNavigation(totalSteps: number) {
  const [step, setStep] = useState(0);

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));
  const goToStep = (newStep: number) => setStep(Math.max(0, Math.min(newStep, totalSteps - 1)));
  const resetStep = () => setStep(0);

  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;

  return {
    step,
    setStep,
    goNext,
    goPrev,
    goToStep,
    resetStep,
    isFirstStep,
    isLastStep,
  };
}
