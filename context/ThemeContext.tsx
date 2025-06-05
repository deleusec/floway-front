import React, { createContext, useContext } from 'react';
import { FlowayTheme } from '@/constants/theme';

const ThemeContext = createContext(FlowayTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeContext.Provider value={FlowayTheme}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => useContext(ThemeContext);
