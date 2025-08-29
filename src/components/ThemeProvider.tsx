import React, { createContext, useContext, useState, useEffect } from 'react';

type Disease = 'general' | 'parkinson' | 'diabetes' | 'cataract' | 'dementia';

interface ThemeContextType {
  disease: Disease;
  setDisease: (disease: Disease) => void;
  getDiseaseLabel: (disease: Disease) => string;
  getDiseaseColor: (disease: Disease) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [disease, setDisease] = useState<Disease>('general');

  const getDiseaseLabel = (disease: Disease) => {
    const labels = {
      general: '일반',
      parkinson: '파킨슨병',
      diabetes: '당뇨병',
      cataract: '백내장',
      dementia: '치매'
    };
    return labels[disease];
  };

  const getDiseaseColor = (disease: Disease) => {
    const colors = {
      general: '#2563eb',
      parkinson: '#16a34a',
      diabetes: '#dc2626',
      cataract: '#0f172a',
      dementia: '#7c3aed'
    };
    return colors[disease];
  };

  useEffect(() => {
    document.body.className = `theme-${disease}`;
  }, [disease]);

  return (
    <ThemeContext.Provider value={{ disease, setDisease, getDiseaseLabel, getDiseaseColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}