import { useEffect, useState } from "react";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return savedTheme ? savedTheme === "dark" : prefersDark;
};

export const useTheme = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  const toggleTheme = () => {
    setIsDark((currentTheme) => !currentTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return {
    isDark,
    toggleTheme,
  };
};
