import { onMount } from "svelte";

/**
 * Composable para gestión del modo oscuro
 */
export function useDarkMode() {
  let isDarkMode = $state(false);

  onMount(() => {
    // Cargar preferencia guardada
    try {
      const savedDarkMode = localStorage.getItem("chefmate-dark-mode");
      if (savedDarkMode === "true") {
        isDarkMode = true;
        document.documentElement.classList.add("dark");
      } else if (savedDarkMode === null) {
        // Si no hay preferencia, usar la del sistema
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          isDarkMode = true;
          document.documentElement.classList.add("dark");
        }
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
    }

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      try {
        if (localStorage.getItem("chefmate-dark-mode") === null) {
          isDarkMode = e.matches;
          document.documentElement.classList.toggle("dark", isDarkMode);
        }
      } catch (err) {
        // Ignorar errores
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  });

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("chefmate-dark-mode", isDarkMode ? "true" : "false");
    } catch (e) {
      // Silently fail in private browsing mode
    }
  }

  return {
    get isDarkMode() {
      return isDarkMode;
    },
    set isDarkMode(v) {
      isDarkMode = v;
    },
    toggleDarkMode,
  };
}
