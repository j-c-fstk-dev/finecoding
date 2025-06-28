
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to prevent layout shift and hydration errors
    return <div className="theme-switch-placeholder" />;
  }

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <label className="theme-switch" title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <input
        type="checkbox"
        className="theme-switch__checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
        aria-label="Theme switch"
      />
      <div className="theme-switch__container">
        <div className="theme-switch__circle-container">
          <div className="theme-switch__sun-moon-container">
            <div className="theme-switch__moon">
              <div className="theme-switch__spot"></div>
              <div className="theme-switch__spot"></div>
              <div className="theme-switch__spot"></div>
            </div>
          </div>
        </div>
        <div className="theme-switch__clouds"></div>
        <div className="theme-switch__stars-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path
              fill="currentColor"
              d="M393 201.3l-14.7-14.7-4.8-19.2-19.2-4.8-14.7-14.7-14.7 14.7-19.2 4.8-4.8 19.2 14.7 14.7 4.8 19.2 19.2 4.8 14.7 14.7zm-208-48l-14.7-14.7-4.8-19.2-19.2-4.8-14.7-14.7-14.7 14.7-19.2 4.8-4.8 19.2 14.7 14.7 4.8 19.2 19.2 4.8 14.7 14.7zm112 224l-14.7-14.7-4.8-19.2-19.2-4.8-14.7-14.7-14.7 14.7-19.2 4.8-4.8 19.2 14.7 14.7 4.8 19.2 19.2 4.8 14.7 14.7z"
            ></path>
          </svg>
        </div>
      </div>
    </label>
  );
}
