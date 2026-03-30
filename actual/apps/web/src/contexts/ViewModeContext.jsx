import React, { createContext, useContext, useState, useEffect } from 'react';

const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app-view-mode') || 'costos';
  });

  useEffect(() => {
    localStorage.setItem('app-view-mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'costos' ? 'produccion' : 'costos'));
  };

  return (
    <ViewModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};