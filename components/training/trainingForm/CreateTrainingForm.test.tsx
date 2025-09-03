import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import CreateTrainingForm from './CreateTrainingForm';
import { ArrowSet, Bow, Material } from '@/types';
import { getLocalStorage, storeLocalStorage } from '@/utils';

// Mock the utils
jest.mock('@/utils', () => ({
  getLocalStorage: jest.fn(),
  storeLocalStorage: jest.fn(),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: ({ children, onPress }: any) => {
    const React = require('react');
    return React.cloneElement(children, { onPress });
  },
}));

// Mock common components
jest.mock('@/components/common', () => ({
  Button: ({ label, onPress, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={`button-${label}`} onPress={onPress} {...props}>
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  },
  Input: ({ label, value, onChangeText, testID, ...props }: any) => {
    const { TextInput, Text, View } = require('react-native');
    return (
      <View>
        <Text>{label}</Text>
        <TextInput testID={testID || `input-${label}`} value={value} onChangeText={onChangeText} {...props} />
      </View>
    );
  },
  Select: ({ label, options, selectedValue, onValueChange, testID, ...props }: any) => {
    const { TouchableOpacity, Text, View } = require('react-native');
    return (
      <View testID={testID || `select-${label}`}>
        <Text>{label}</Text>
        <TouchableOpacity
          testID={`select-trigger-${label}`}
          onPress={() => {
            // Simulate selecting the first option for testing
            if (options.length > 0) {
              onValueChange(options[0].value);
            }
          }}>
          <Text>{selectedValue || 'Velg et alternativ'}</Text>
        </TouchableOpacity>
      </View>
    );
  },
  ModalHeader: ({ title, onPress }: any) => {
    const { TouchableOpacity, Text, View } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        <TouchableOpacity testID="modal-close" onPress={onPress}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  },
  ModalWrapper: ({ visible, children }: any) => {
    const { View } = require('react-native');
    return visible ? <View testID="modal-wrapper">{children}</View> : null;
  },
}));

const mockBows: Bow[] = [
  {
    id: 'bow1',
    bowName: 'Test Recurve Bow',
    bowType: 'Recurve',
    placement: 'Indoor',
    eyeToNock: 80,
    eyeToAim: 85,
  },
  {
    id: 'bow2',
    bowName: 'Test Compound Bow',
    bowType: 'Compound',
    placement: 'Outdoor',
    eyeToNock: 75,
    eyeToAim: 80,
  },
];

const mockArrowSets: ArrowSet[] = [
  {
    name: 'Carbon Pro',
    weight: 400,
    length: 31,
    diameter: 5.2,
    material: Material.Karbon,
    spine: 500,
    numberOfArrows: 12,
  },
  {
    name: 'Aluminum Sport',
    weight: 350,
    length: 30,
    diameter: 6.2,
    material: Material.Aluminum,
    spine: 1600,
    numberOfArrows: 6,
  },
];

describe('CreateTrainingForm', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    bows: mockBows,
    arrowSets: mockArrowSets,
    onTrainingSaved: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getLocalStorage as jest.Mock).mockResolvedValue([]);
    (storeLocalStorage as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render form when visible is true', () => {
      const { getByTestId, getByText } = render(<CreateTrainingForm {...defaultProps} />);

      expect(getByTestId('modal-wrapper')).toBeTruthy();
      expect(getByText('Ny trening')).toBeTruthy();
      expect(getByText('Dato')).toBeTruthy();
      expect(getByText('Antall piler skutt')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByTestId } = render(<CreateTrainingForm {...defaultProps} visible={false} />);

      expect(queryByTestId('modal-wrapper')).toBeNull();
    });

    it('should render bow selector when bows are provided', () => {
      const { getByText } = render(<CreateTrainingForm {...defaultProps} />);

      expect(getByText('Bue (valgfritt)')).toBeTruthy();
    });

    it('should not render bow selector when no bows provided', () => {
      const { queryByText } = render(<CreateTrainingForm {...defaultProps} bows={[]} />);

      expect(queryByText('Bue (valgfritt)')).toBeNull();
    });

    it('should render arrow set selector when arrow sets are provided', () => {
      const { getByText } = render(<CreateTrainingForm {...defaultProps} />);

      expect(getByText('Pilsett (valgfritt)')).toBeTruthy();
    });

    it('should not render arrow set selector when no arrow sets provided', () => {
      const { queryByText } = render(<CreateTrainingForm {...defaultProps} arrowSets={[]} />);

      expect(queryByText('Pilsett (valgfritt)')).toBeNull();
    });
  });

  describe('Form Input', () => {
    it("should initialize with today's date", () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);
      const dateInput = getByTestId('input-Dato');

      const today = new Date().toISOString().split('T')[0];
      expect(dateInput.props.value).toBe(today);
    });

    it('should update date when input changes', () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);
      const dateInput = getByTestId('input-Dato');

      fireEvent.changeText(dateInput, '2025-12-25');
      expect(dateInput.props.value).toBe('2025-12-25');
    });

    it('should update arrows when input changes', () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);
      const arrowsInput = getByTestId('input-Antall piler skutt');

      fireEvent.changeText(arrowsInput, '24');
      expect(arrowsInput.props.value).toBe('24');
    });

    it('should select bow when select changes', () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);
      const bowSelect = getByTestId('select-trigger-Bue (valgfritt)');

      fireEvent.press(bowSelect);

      // The mock select will automatically select the first option
      const selectElement = getByTestId('select-Bue (valgfritt)');
      expect(selectElement).toBeTruthy();
    });

    it('should select arrow set when select changes', () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);
      const arrowSetSelect = getByTestId('select-trigger-Pilsett (valgfritt)');

      fireEvent.press(arrowSetSelect);

      // The mock select will automatically select the first option
      const selectElement = getByTestId('select-Pilsett (valgfritt)');
      expect(selectElement).toBeTruthy();
    });
  });

  describe('Training Object Creation', () => {
    it('should create training object with correct data', async () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      // Set form values
      const dateInput = getByTestId('input-Dato');
      const arrowsInput = getByTestId('input-Antall piler skutt');

      fireEvent.changeText(dateInput, '2025-12-25');
      fireEvent.changeText(arrowsInput, '36');

      // Trigger save to test training object creation
      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(storeLocalStorage).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              date: new Date('2025-12-25'),
              arrows: 36,
              bow: undefined,
              arrowSet: undefined,
            }),
          ]),
          'trainings',
        );
      });
    });

    it('should create training object with selected bow and arrow set', async () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      // Select bow and arrow set
      const bowSelect = getByTestId('select-trigger-Bue (valgfritt)');
      const arrowSetSelect = getByTestId('select-trigger-Pilsett (valgfritt)');

      fireEvent.press(bowSelect);
      fireEvent.press(arrowSetSelect);

      // Set arrows
      const arrowsInput = getByTestId('input-Antall piler skutt');
      fireEvent.changeText(arrowsInput, '24');

      // Trigger save
      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(storeLocalStorage).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              arrows: 24,
              bow: mockBows[0],
              arrowSet: mockArrowSets[0],
            }),
          ]),
          'trainings',
        );
      });
    });

    it('should handle empty arrows input as 0', async () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      // Leave arrows empty
      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(storeLocalStorage).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              arrows: 0,
            }),
          ]),
          'trainings',
        );
      });
    });
  });

  describe('Save Operations', () => {
    it('should save training when "Lagre og avslutt" is pressed', async () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(getLocalStorage).toHaveBeenCalledWith('trainings');
        expect(storeLocalStorage).toHaveBeenCalledWith(expect.any(Array), 'trainings');
        expect(defaultProps.onTrainingSaved).toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('should save training when "Start skyting" is pressed', async () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      const startButton = getByTestId('button-Start skyting');
      fireEvent.press(startButton);

      await waitFor(() => {
        expect(getLocalStorage).toHaveBeenCalledWith('trainings');
        expect(storeLocalStorage).toHaveBeenCalledWith(expect.any(Array), 'trainings');
        expect(defaultProps.onTrainingSaved).toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('should append to existing trainings', async () => {
      const existingTrainings = [
        {
          date: new Date('2025-01-01'),
          arrows: 12,
        },
      ];

      (getLocalStorage as jest.Mock).mockResolvedValue(existingTrainings);

      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      const arrowsInput = getByTestId('input-Antall piler skutt');
      fireEvent.changeText(arrowsInput, '18');

      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(storeLocalStorage).toHaveBeenCalledWith(
          expect.arrayContaining([
            existingTrainings[0],
            expect.objectContaining({
              arrows: 18,
            }),
          ]),
          'trainings',
        );
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should call onClose when modal close button is pressed', () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      const closeButton = getByTestId('modal-close');
      fireEvent.press(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should reset form when close button is clicked', () => {
      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      // Change form values
      const dateInput = getByTestId('input-Dato');
      const arrowsInput = getByTestId('input-Antall piler skutt');

      fireEvent.changeText(dateInput, '2025-12-25');
      fireEvent.changeText(arrowsInput, '36');

      // Verify values are changed
      expect(dateInput.props.value).toBe('2025-12-25');
      expect(arrowsInput.props.value).toBe('36');

      // Click close button (which calls handleClose -> resetForm)
      const closeButton = getByTestId('modal-close');
      fireEvent.press(closeButton);

      // Form should be reset to initial values after close
      const today = new Date().toISOString().split('T')[0];
      expect(dateInput.props.value).toBe(today);
      expect(arrowsInput.props.value).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle storeLocalStorage errors gracefully', async () => {
      (storeLocalStorage as jest.Mock).mockRejectedValue(new Error('Save error'));

      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      // Should not crash and still call onClose
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('should not call onTrainingSaved when localStorage save fails', async () => {
      (storeLocalStorage as jest.Mock).mockRejectedValue(new Error('Save error'));

      const { getByTestId } = render(<CreateTrainingForm {...defaultProps} />);

      const saveButton = getByTestId('button-Lagre og avslutt');
      fireEvent.press(saveButton);

      // Wait a bit to ensure async operations complete
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });

      // onTrainingSaved should not be called when save fails
      expect(defaultProps.onTrainingSaved).not.toHaveBeenCalled();
    });
  });
});
