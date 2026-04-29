import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Message } from '@/components/common';
import { useAuth } from '@/hooks';
import { AppError } from '@/services';
import { AuthLogo, AuthForm, SocialLogin, AuthToggle, LoadingOverlay, EmailVerification } from '@/components/auth';
import { styles } from '@/components/auth/AuthStyles';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { login, register, loginWithGoogle, isLoading, isAuthenticated, error, clearError } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) return;
    Keyboard.dismiss();
    const id = requestIdleCallback(() => router.replace('/(tabs)/home'));
    return () => cancelIdleCallback(id);
  }, [isAuthenticated, router]);

  const clearAuthErrors = () => {
    setLocalError(null);
    clearError();
  };

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

    if (!email || !password) {
      setLocalError('E-post og passord er påkrevd');
      return;
    }

    if (password.length < 8) {
      setLocalError('Passordet må være minst 8 tegn');
      return;
    }

    try {
      await register(email, password, '');
      setEmail('');
      setPassword('');
      onAuthSuccess?.();
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
        <AuthLogo />
        <AuthForm
          email={email}
          password={password}
          isLoading={isLoading}
          onEmailChange={(text) => {
            setEmail(text);
            if (localError || error) clearAuthErrors();
          }}
          onPasswordChange={(text) => {
            setPassword(text);
            if (localError || error) clearAuthErrors();
          }}
        />
        <Button
          buttonStyle={{ marginTop: 8 }}
          label={isLoading ? 'Venter...' : isLogin ? 'Logg inn' : 'Opprett konto'}
          onPress={handleSubmit}
          disabled={isLoading}
          variant="tertiary"
        />
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
        <SocialLogin isLoading={isLoading} onGoogleLogin={handleGoogleLogin} />
        <AuthToggle
          isLogin={isLogin}
          isLoading={isLoading}
          onToggle={() => {
            setIsLogin(!isLogin);
            setLocalError(null);
            clearError();
          }}
        />
        {isLoading && <LoadingOverlay />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AuthScreen;
