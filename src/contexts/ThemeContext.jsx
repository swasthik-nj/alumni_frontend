import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
  isDark: false,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "alumni-ui-theme",
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let activeTheme = theme;
    if (theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      activeTheme = systemDark ? "dark" : "light";
    }

    root.classList.add(activeTheme);
    setIsDark(activeTheme === "dark");
  }, [theme]);

  // Listen to system preference changes if in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      const activeTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(activeTheme);
      setIsDark(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Global Keyboard Shortcuts (Conflict-Free: Shift + D, Alt + Shift + T, or \)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in a form field
      const target = e.target;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.tagName === "SELECT");

      // Conflict-free shortcuts that never trigger browser tab actions (no Ctrl+T or Ctrl+Shift+T):
      // 1. Alt + Shift + T or Alt + Shift + D (Safe modifier combination)
      const isAltShift = e.altKey && e.shiftKey && (e.key === "T" || e.key === "t" || e.key === "D" || e.key === "d");

      // 2. Shift + D (Fastest one-tap shortcut when not typing)
      const isShiftD = !isInput && !e.ctrlKey && !e.metaKey && !e.altKey && e.shiftKey && (e.key === "D" || e.key === "d");

      // 3. Backslash '\' (Single-key toggle when not typing)
      const isBackslash = !isInput && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && e.key === "\\";

      if (isAltShift || isShiftD || isBackslash) {
        e.preventDefault();
        e.stopPropagation();
        const nextTheme = isDark ? "light" : "dark";
        localStorage.setItem(storageKey, nextTheme);
        setTheme(nextTheme);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDark, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    isDark,
    toggleTheme: () => {
      const nextTheme = isDark ? "light" : "dark";
      localStorage.setItem(storageKey, nextTheme);
      setTheme(nextTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
