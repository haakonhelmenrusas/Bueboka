import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Pressable, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { BowIcon, ArrowIcon } from '@/components/common/icons/ArcheryIcons';
import { styles } from './MobileActionButtonStyles';

export interface MobileActionButtonProps {
  onCreatePractice: () => void;
  onCreateCompetition: () => void;
  onCreateBow: () => void;
  onCreateArrows: () => void;
}

const NUM_ITEMS = 4;

export function MobileActionButton({ onCreatePractice, onCreateCompetition, onCreateBow, onCreateArrows }: MobileActionButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const animValues = useRef(Array.from({ length: NUM_ITEMS }, () => new Animated.Value(0))).current;

  const openMenu = useCallback(() => {
    setOpen(true);
    Animated.stagger(
      40,
      [...animValues].reverse().map((anim) => Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true })),
    ).start();
  }, [animValues]);

  const closeMenu = useCallback(() => {
    Animated.parallel(animValues.map((anim) => Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true }))).start(() =>
      setOpen(false),
    );
  }, [animValues]);

  const toggle = () => (open ? closeMenu() : openMenu());

  const actions = [
    {
      key: 'practice',
      label: t['fab.newPractice'],
      icon: <FontAwesomeIcon icon={faBullseye} size={18} color={colors.white} />,
      onPress: () => {
        onCreatePractice();
        closeMenu();
      },
    },
    {
      key: 'competition',
      label: t['fab.newCompetition'],
      icon: <FontAwesomeIcon icon={faTrophy} size={18} color={colors.white} />,
      onPress: () => {
        onCreateCompetition();
        closeMenu();
      },
    },
    {
      key: 'bow',
      label: t['fab.newBow'],
      icon: <BowIcon />,
      onPress: () => {
        onCreateBow();
        closeMenu();
      },
    },
    {
      key: 'arrows',
      label: t['fab.newArrows'],
      icon: <ArrowIcon />,
      onPress: () => {
        onCreateArrows();
        closeMenu();
      },
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {open && <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />}

      <View style={[styles.wrapper, { bottom: insets.bottom + 92 }]} pointerEvents="box-none">
        {open && (
          <View style={styles.menu}>
            {[...actions].reverse().map((action, displayIndex) => {
              const originalIndex = actions.length - 1 - displayIndex;
              const animVal = animValues[originalIndex];
              return (
                <Animated.View
                  key={action.key}
                  style={{
                    opacity: animVal,
                    transform: [
                      {
                        translateY: animVal.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8, 0],
                        }),
                      },
                    ],
                  }}>
                  <TouchableOpacity style={styles.actionRow} onPress={action.onPress} activeOpacity={0.8}>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <View style={styles.actionIcon}>{action.icon}</View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={[styles.fab, open && styles.fabOpen]} onPress={toggle} activeOpacity={0.85}>
          <FontAwesomeIcon icon={open ? faXmark : faPlus} size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
