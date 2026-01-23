/**
 * Quick Guide: Adding Logout Button
 * 
 * Add this to your Profile screen (app/(tabs)/profile/index.tsx)
 * at the bottom of the screen, right after the forms.
 */

// 1. Add import at the top:
import { useAuth } from '@/hooks';

// 2. Inside your Profile component, add:
const { logout } = useAuth();
const [loggingOut, setLoggingOut] = useState(false);

// 3. Add logout handler:
async function handleLogout() {
  try {
    setLoggingOut(true);
    await logout();
    // Navigation automatically switches to auth screen
  } catch (error) {
    alert('Failed to logout: ' + error.message);
  } finally {
    setLoggingOut(false);
  }
}

// 4. Add button to your JSX (near bottom):
<Button
  label={loggingOut ? 'Logger ut...' : 'Logg Ut'}
  onPress={handleLogout}
  disabled={loggingOut}
  type="outline"
/>

/**
 * Example implementation:
 */

import { ScrollView, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import BowCard from '@/components/profile/bowCard/BowCard';
import { Button, Message } from '@/components/common';
import { Arrows, Bow } from '@/types';
import { sortItems } from '@/utils';
import { styles } from '@/components/profile/ProfileStyles';
import { colors } from '@/styles/colors';
import ArrowCard from '@/components/profile/arrowCard/ArrowCard';
import BowDetails from '@/components/profile/bowDetails/BowDetails';
import ArrowSetDetails from '@/components/profile/arrowSetDetails/ArrowSetDetails';
import ProfileBox from '@/components/profile/profile/ProfileBox';
import ProfileForm from '@/components/profile/profileForm/ProfileForm';
import { useAuth } from '@/hooks';
import { bowRepository, arrowsRepository, userRepository } from '@/services/repositories';
import { AppError } from '@/services';

export default function Profile() {
  const { user, isLoading: authLoading, logout } = useAuth(); // Add logout here
  const [bowModalVisible, setBowModalVisible] = useState(false);
  const [arrowModalVisible, setArrowModalVisible] = useState(false);
  const [bows, setBows] = useState<Bow[]>([]);
  const [selectedBow, setSelectedBow] = useState<Bow | null>(null);
  const [arrowSets, setArrowSets] = useState<Arrows[]>([]);
  const [selectedArrowSet, setSelectedArrowSet] = useState<Arrows | null>(null);
  const [selectedBowForDetails, setSelectedBowForDetails] = useState<Bow | null>(null);
  const [selectedArrowSetForDetails, setSelectedArrowSetForDetails] = useState<Arrows | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false); // Add this

  // ... existing loadBows, loadArrows, and other methods ...

  // Add this new logout handler:
  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      // Navigation automatically switches to auth screen
    } catch (error) {
      if (error instanceof AppError) {
        alert('Feil ved utlogging: ' + error.message);
      } else {
        alert('Feil ved utlogging');
      }
    } finally {
      setLoggingOut(false);
    }
  }

  // ... existing code ...

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profil</Text>
        <ProfileBox user={user} onEdit={() => setIsProfileModalVisible(true)} />
        <ProfileForm
          modalVisible={isProfileModalVisible}
          setModalVisible={setIsProfileModalVisible}
          user={user}
          onSave={handleProfileUpdate}
        />
        {error && <Message title="Feil" description={error} />}

        {/* ... existing bows and arrows sections ... */}

        {/* Logout Button - Add at the bottom before closing View */}
        <View style={styles.actionButtons}>
          <Button
            label={loggingOut ? 'Logger ut...' : 'Logg Ut'}
            onPress={handleLogout}
            disabled={loggingOut}
            type="outline"
            buttonStyle={{ width: '100%' }}
          />
        </View>
      </ScrollView>

      {/* ... rest of modals ... */}
    </View>
  );
}
