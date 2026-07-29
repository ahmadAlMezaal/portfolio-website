"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const THEMES = [
  { id: "matrix", label: "matrix", swatch: "#00ff9c" },
  { id: "cyberpunk", label: "cyberpunk", swatch: "#22d3ee" },
  { id: "amber", label: "amber", swatch: "#ffb000" },
] as const;

export type Theme = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "matrix";
const SWITCH_MS = 200;
const VALID = new Set<string>(THEMES.map((t) => t.id));

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
    }
    const initial = stored && VALID.has(stored) ? (stored as Theme) : DEFAULT_THEME;
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);

    const root = document.documentElement;
    root.classList.add("theme-switching");
    if (switchTimer.current) clearTimeout(switchTimer.current);
    switchTimer.current = setTimeout(
      () => root.classList.remove("theme-switching"),
      SWITCH_MS
    );

    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
  }, []);

  useEffect(
    () => () => {
      if (switchTimer.current) clearTimeout(switchTimer.current);
    },
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
