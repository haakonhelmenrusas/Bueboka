import { useState, useEffect } from 'react';
import { Environment, WeatherCondition } from '@/types';

/**
 * Hook for managing weather condition selection
 * Automatically clears weather when environment is not outdoor
 */
export function useWeatherSelection(environment: Environment) {
  const [weather, setWeather] = useState<WeatherCondition[]>([]);

  useEffect(() => {
    if (environment !== Environment.OUTDOOR) {
      setWeather([]);
    }
  }, [environment]);

  const toggleWeather = (condition: WeatherCondition) => {
    setWeather((prev) => (prev.includes(condition) ? prev.filter((w) => w !== condition) : [...prev, condition]));
  };

  return {
    weather,
    setWeather,
    toggleWeather,
  };
}
