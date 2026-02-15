import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/styles/colors';
import { Button, Input, Message } from '@/components/common';
import { useAuth } from '@/hooks';
import { AppError } from '@/services';
import EmailVerification from '@/components/auth/EmailVerification';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { login, register, loginWithGoogle, loginWithApple, isLoading, error, clearError, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
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
      setConfirmPassword('');
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
        <View style={styles.header}>
          <Text style={styles.title}>{isLogin ? 'Logg Inn' : 'Opprett konto'}</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Velkommen tilbake til Bueboka' : 'Bli med i Bueboka-samfunnet'}</Text>
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
          {!isLogin && <Input label="Navn" value={name} onChangeText={setName} editable={!isLoading} />}
          <Input
            label="E-post"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <Input label="Passord" value={password} onChangeText={setPassword} secureTextEntry editable={!isLoading} />
          {!isLogin && (
            <>
              <Input
                label="Bekreft passord"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <Input label="Klubb (valgfritt)" value={club} onChangeText={setClub} editable={!isLoading} />
            </>
          )}
        </View>
        <Button label={isLoading ? 'Venter...' : isLogin ? 'Logg Inn' : 'Opprett Konto'} onPress={handleSubmit} disabled={isLoading} />

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

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>{isLogin ? 'Har ikke konto? ' : 'Har du allerede konto? '}</Text>
          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
              setLocalError(null);
              clearError();
            }}
            disabled={isLoading}>
            <Text style={styles.toggleLink}>{isLogin ? 'Opprett konto' : 'Logg inn'}</Text>
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
    backgroundColor: colors.background || '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 14,
  },
  toggleLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
