import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/hooks';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Redirect href={isAuthenticated ? '/practice' : '/auth'} />;
}
