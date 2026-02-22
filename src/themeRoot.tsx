import { useEffect, useMemo, useState, createContext, useContext, type ReactNode } from "react";
import { createTheme, type PaletteMode } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";

type ColorModeContextType = {
  mode: PaletteMode;
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#22c55e",
    },
    background:
      mode === "dark"
        ? {
            default: "#020617",
            paper: "#020617",
          }
        : {
            default: "#f9fafb",
            paper: "#ffffff",
          },
    text:
      mode === "dark"
        ? {
            primary: "#ffffff", // texto branco no modo dark
            secondary: "#e5e7eb",
          }
        : {
            primary: "#000000", // texto preto no modo light
            secondary: "#4b5563",
          },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === "dark" ? "#020617" : "#f9fafb",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  },
});

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within AppThemeProvider");
  }
  return context;
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("color-mode");
    if (stored === "light" || stored === "dark") {
      setMode(stored);
    }
  }, []);

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("color-mode", next);
      return next;
    });
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const value = useMemo(
    () => ({ mode, toggleColorMode }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
