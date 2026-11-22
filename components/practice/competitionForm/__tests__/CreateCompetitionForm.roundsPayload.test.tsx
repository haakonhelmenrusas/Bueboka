import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import CreateCompetitionForm from '../CreateCompetitionForm';

jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));
jest.mock('expo-observe', () => ({ Observe: { reportError: jest.fn() } }));

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/services/repositories', () => ({
  competitionRepository: {
    create: (...args: any[]) => mockCreate(...args),
    update: (...args: any[]) => mockUpdate(...args),
    delete: jest.fn(),
  },
}));

// Keep the real Input (its TextInput has testID="input"); stub out the heavier
// common components the form renders but this test never interacts with.
jest.mock('@/components/common', () => {
  const actual = jest.requireActual('@/components/common');
  const React = jest.requireActual('react');
  return {
    ...actual,
    ModalWrapper: ({ visible, children }: any) => (visible ? React.createElement(React.Fragment, null, children) : null),
    ModalHeader: () => null,
    Select: () => null,
    DatePicker: () => null,
    Checkbox: () => null,
    Textarea: () => null,
  };
});

jest.mock('@/components/home/DeleteArrowSetModal/ConfirmModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/practice/shared/StepIndicator', () => ({ StepIndicator: () => null }));
jest.mock('@/components/practice/shared/EquipmentSelector', () => ({ EquipmentSelector: () => null }));
jest.mock('@/components/practice/shared/WeatherSelector', () => ({ WeatherSelector: () => null }));

// Stateful step navigation so the test can walk to the rounds step
jest.mock('@/components/practice/shared/useStepNavigation', () => ({
  useStepNavigation: (totalSteps: number) => {
    const React = jest.requireActual('react');
    const [step, setStep] = React.useState(0);
    return {
      step,
      setStep,
      goNext: () => setStep((s: number) => Math.min(totalSteps - 1, s + 1)),
      goPrev: () => setStep((s: number) => Math.max(0, s - 1)),
      resetStep: () => setStep(0),
    };
  },
}));

jest.mock('@/components/practice/shared/NavigationFooter', () => ({
  NavigationFooter: (props: any) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Pressable, { testID: 'nav-next', onPress: props.onNext }, React.createElement(Text, null, 'next')),
      React.createElement(Pressable, { testID: 'nav-save', onPress: props.onSave }, React.createElement(Text, null, 'save')),
    );
  },
}));

describe('CreateCompetitionForm rounds payload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({ id: 'comp-1' });
  });

  it('sends numberArrows (not arrows) for each round so the cards endpoint can count arrows', async () => {
    const { getAllByTestId, getByTestId } = await render(
      <CreateCompetitionForm visible={true} onClose={jest.fn()} bows={[]} arrowSets={[]} onSaved={jest.fn()} />,
    );

    // Step 0 (info): first input is the competition name
    await fireEvent.changeText(getAllByTestId('input')[0], 'NM Innendørs 2026');

    // Walk to step 2 (rounds)
    await fireEvent.press(getByTestId('nav-next'));
    await fireEvent.press(getByTestId('nav-next'));

    // Rounds step inputs: [distance, numberArrows, roundScore, arrowsWithoutScore]
    const roundInputs = getAllByTestId('input');
    await fireEvent.changeText(roundInputs[1], '30');
    await fireEvent.changeText(roundInputs[2], '570');

    await fireEvent.press(getByTestId('nav-save'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    const payload = mockCreate.mock.calls[0][0];
    expect(payload.name).toBe('NM Innendørs 2026');
    expect(payload.rounds).toHaveLength(1);
    // Backend contract (lib/validations/competition.ts) expects `numberArrows`;
    // `arrows` is stripped by zod and stored as null, which made cards show 0 arrows.
    expect(payload.rounds[0]).toMatchObject({ roundNumber: 1, numberArrows: 30, roundScore: 570 });
    expect(payload.rounds[0]).not.toHaveProperty('arrows');
  });

  it('sends numberArrows on update as well, preserving the arrow count when editing', async () => {
    mockUpdate.mockResolvedValue({ id: 'comp-1' });
    const editing = {
      id: 'comp-1',
      userId: 'u1',
      date: '2026-01-10T00:00:00.000Z',
      name: 'NM Innendørs 2026',
      location: null,
      organizerName: null,
      environment: 'INDOOR',
      weather: [],
      practiceCategory: 'SKIVE_INDOOR',
      notes: null,
      placement: null,
      numberOfParticipants: null,
      personalBest: false,
      totalScore: 570,
      bowId: null,
      arrowsId: null,
      rounds: [
        {
          id: 'r1',
          competitionId: 'comp-1',
          roundNumber: 1,
          arrows: 30,
          arrowsWithoutScore: null,
          roundScore: 570,
          distanceMeters: 18,
          distanceFrom: null,
          distanceTo: null,
          targetType: '122cm',
          createdAt: '2026-01-10T00:00:00.000Z',
          updatedAt: '2026-01-10T00:00:00.000Z',
        },
      ],
      createdAt: '2026-01-10T00:00:00.000Z',
      updatedAt: '2026-01-10T00:00:00.000Z',
    } as any;

    const { getAllByTestId, getByTestId } = await render(
      <CreateCompetitionForm visible={true} onClose={jest.fn()} bows={[]} arrowSets={[]} editingCompetition={editing} />,
    );

    await fireEvent.press(getByTestId('nav-next'));
    await fireEvent.press(getByTestId('nav-next'));

    // Pre-filled from the loaded competition (r.arrows -> numberArrows); change it to 36
    const roundInputs = getAllByTestId('input');
    await fireEvent.changeText(roundInputs[1], '36');

    await fireEvent.press(getByTestId('nav-save'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    const [id, payload] = mockUpdate.mock.calls[0];
    expect(id).toBe('comp-1');
    expect(payload.rounds[0]).toMatchObject({ roundNumber: 1, numberArrows: 36 });
    expect(payload.rounds[0]).not.toHaveProperty('arrows');
  });
});
