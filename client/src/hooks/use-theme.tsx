import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeColor = "blue" | "green" | "violet" | "darkgreen";
type NavColor = "blue" | "green" | "violet" | "darkgreen" | "slate" | "charcoal" | "transparent" | "white";
type ThemeMode = "light" | "dark";

interface ThemeContextType {
  color: ThemeColor;
  navColor: NavColor;
  mode: ThemeMode;
  setColor: (color: ThemeColor) => void;
  setNavColor: (color: NavColor) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorVariables: Record<ThemeColor, Record<ThemeMode, Record<string, string>>> = {
  blue: {
    light: {
      "--primary": "224 76% 32%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "224 76% 32%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "224 50% 95%",
      "--sidebar-accent-foreground": "224 76% 32%",
      "--sidebar-ring": "224 76% 32%",
      "--ring": "224 76% 32%",
      "--chart-1": "224 76% 32%",
    },
    dark: {
      "--primary": "224 76% 44%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "224 76% 44%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "224 50% 15%",
      "--sidebar-accent-foreground": "224 60% 70%",
      "--sidebar-ring": "224 76% 44%",
      "--ring": "224 76% 44%",
      "--chart-1": "224 76% 44%",
    },
  },
  green: {
    light: {
      "--primary": "145 85% 28%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "145 85% 28%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "145 60% 94%",
      "--sidebar-accent-foreground": "145 85% 28%",
      "--sidebar-ring": "145 85% 28%",
      "--ring": "145 85% 28%",
      "--chart-1": "145 85% 28%",
    },
    dark: {
      "--primary": "145 80% 38%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "145 80% 38%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "145 50% 15%",
      "--sidebar-accent-foreground": "145 60% 65%",
      "--sidebar-ring": "145 80% 38%",
      "--ring": "145 80% 38%",
      "--chart-1": "145 80% 38%",
    },
  },
  violet: {
    light: {
      "--primary": "262 83% 58%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "262 83% 58%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "262 50% 95%",
      "--sidebar-accent-foreground": "262 83% 58%",
      "--sidebar-ring": "262 83% 58%",
      "--ring": "262 83% 58%",
      "--chart-1": "262 83% 58%",
    },
    dark: {
      "--primary": "262 83% 60%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "262 83% 60%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "262 50% 15%",
      "--sidebar-accent-foreground": "262 60% 70%",
      "--sidebar-ring": "262 83% 60%",
      "--ring": "262 83% 60%",
      "--chart-1": "262 83% 60%",
    },
  },
  darkgreen: {
    light: {
      "--primary": "145 70% 25%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "145 70% 25%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "145 50% 92%",
      "--sidebar-accent-foreground": "145 70% 25%",
      "--sidebar-ring": "145 70% 25%",
      "--ring": "145 70% 25%",
      "--chart-1": "145 70% 25%",
    },
    dark: {
      "--primary": "145 65% 30%",
      "--primary-foreground": "0 0% 100%",
      "--sidebar-primary": "145 65% 30%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "145 40% 15%",
      "--sidebar-accent-foreground": "145 55% 60%",
      "--sidebar-ring": "145 65% 30%",
      "--ring": "145 65% 30%",
      "--chart-1": "145 65% 30%",
    },
  },
};

// Nav color HSL values — sidebar/header tint
const navColorHSL: Record<NavColor, string> = {
  blue: "224 76% 32%",
  green: "145 85% 28%",
  violet: "262 83% 50%",
  darkgreen: "145 70% 25%",
  slate: "220 10% 20%",
  charcoal: "0 0% 15%",
  transparent: "0 0% 0%",
  white: "0 0% 100%",
};

// Light nav modes where text must be dark instead of white
export const isLightNav = (nav: NavColor) => nav === "transparent" || nav === "white";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColorState] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme-color") as ThemeColor) || "blue";
    }
    return "blue";
  });

  const [navColor, setNavColorState] = useState<NavColor>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("nav-color") as NavColor) || "slate";
    }
    return "slate";
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme-mode") as ThemeMode) || "light";
    }
    return "light";
  });

  const applyTheme = (themeColor: ThemeColor, themeMode: ThemeMode, navCol: NavColor) => {
    const root = document.documentElement;

    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const variables = colorVariables[themeColor][themeMode];
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set nav color variable
    root.style.setProperty("--nav-primary", navColorHSL[navCol]);

    // Set a data attribute for light nav modes (transparent/white)
    if (isLightNav(navCol)) {
      root.setAttribute("data-nav-light", "true");
    } else {
      root.removeAttribute("data-nav-light");
    }
  };

  useEffect(() => {
    applyTheme(color, mode, navColor);
  }, [color, mode, navColor]);

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    localStorage.setItem("theme-color", newColor);
  };

  const setNavColor = (newNavColor: NavColor) => {
    setNavColorState(newNavColor);
    localStorage.setItem("nav-color", newNavColor);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ color, navColor, mode, setColor, setNavColor, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
