import { createContext, useContext } from "react";
import { themes, type Theme } from "../themes";

const ThemeContext = createContext<Theme>(themes.floral);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({
  theme,
  children,
}) => <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;

export const useTheme = (): Theme => useContext(ThemeContext);
