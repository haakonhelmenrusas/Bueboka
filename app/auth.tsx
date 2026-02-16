import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '@/styles/colors';
import { Button, Input, Message } from '@/components/common';
import { useAuth } from '@/hooks';
import { AppError } from '@/services';
import EmailVerification from '@/components/auth/EmailVerification';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { login, register, loginWithGoogle, loginWithApple, isLoading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [club, setClub] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  const handleAuthError = (error: any) => {
    if (error instanceof AppError) {
      setLocalError(error.message);
    } else {
      setLocalError(error?.message || 'An error occurred');
    }
  };

  const handleLogin = async () => {
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
      onAuthSuccess?.();
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleRegister = async () => {
    setLocalError(null);
    clearError();

    if (!email || !password || !name) {
      setLocalError('Email, name, and password are required');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      await register(email, password, name, club || undefined);
      // After successful registration, show email verification screen
      setRegisteredEmail(email);
      setShowVerification(true);
      // Clear form fields
      setPassword('');
      setName('');
      setClub('');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithGoogle();
      onAuthSuccess?.();
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAppleLogin = async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithApple();
      onAuthSuccess?.();
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    setEmail('');
    setRegisteredEmail('');
    onAuthSuccess?.();
  };

  // If showing verification screen, render it instead
  if (showVerification) {
    return <EmailVerification email={registeredEmail} onVerified={handleVerificationComplete} />;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Text style={styles.appTitle}>Bueboka</Text>
          <Image source={require('../assets/images/logo-main-dark.png')} style={styles.logo} resizeMode="contain" />
        </View>
        {(localError || error) && (
          <Message
            title="Feil"
            description={localError || error || ''}
            onPress={() => {
              setLocalError(null);
              clearError();
            }}
          />
        )}
        <View style={styles.form}>
          {!isLogin && (
            <Input
              label="Navn"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              placeholder="Navn"
              labelStyle={styles.whiteLabel}
            />
          )}
          <Input
            label="E-post"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            labelStyle={styles.whiteLabel}
          />
          <Input
            label="Passord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            labelStyle={styles.whiteLabel}
          />
        </View>
        <Button
          buttonStyle={{ marginTop: 16 }}
          label={isLoading ? 'Venter...' : isLogin ? 'Logg inn' : 'Opprett konto'}
          onPress={handleSubmit}
          disabled={isLoading}
          variant="tertiary"
        />
        {!isLogin && (
          <>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>eller</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialButtonsContainer}>
              <Button label="Fortsett med Google" onPress={handleGoogleLogin} disabled={isLoading} variant="standard" />
              {Platform.OS === 'ios' && (
                <Button label="Fortsett med Apple" onPress={handleAppleLogin} disabled={isLoading} variant="standard" />
              )}
            </View>
          </>
        )}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
              setLocalError(null);
              clearError();
            }}
            disabled={isLoading}>
            <Text style={styles.toggleLink}>{isLogin ? 'Registrer deg' : 'Logg inn'}</Text>
          </TouchableOpacity>
        </View>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.inactive || '#999',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
    gap: 16,
  },
  whiteLabel: {
    color: colors.white,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 14,
  },
  toggleLink: {
    color: colors.tertiary,
    fontSize: 14,
    fontWeight: '400',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inactive || '#ccc',
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.inactive || '#999',
    fontSize: 14,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default AuthScreen;
