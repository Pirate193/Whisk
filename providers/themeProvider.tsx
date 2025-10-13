import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import React, { createContext, useContext } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: 'light' | 'dark' | undefined;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme: setNativeWindScheme } = useColorScheme();

  const setColorScheme = async (scheme: ThemeMode) => {
    setNativeWindScheme(scheme);
    await AsyncStorage.setItem('theme', scheme);
  };

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  // Load saved theme on mount
  React.useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem('theme');
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      setNativeWindScheme(saved as ThemeMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};