import { onMount } from "svelte";

/**
 * Composable para gestión de configuración del usuario
 */
export function useUserSettings() {
  let userSettings = $state({ hourlyRate: 0 });
  let isInitialized = $state(false);

  // Effect para persistir en localStorage - solo después de inicialización
  $effect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(
        "chefmate-user-settings",
        JSON.stringify(userSettings),
      );
    } catch (e) {
      // Silently fail in private browsing mode
    }
  });

  onMount(() => {
    // Cargar userSettings desde localStorage primero
    try {
      const savedSettings = localStorage.getItem("chefmate-user-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        userSettings.hourlyRate = parsed.hourlyRate || 0;
      }
    } catch (e) {
      userSettings.hourlyRate = 0;
    }

    // Marcar como inicializado después de cargar
    isInitialized = true;
  });

  function setHourlyRate(rate) {
    userSettings.hourlyRate = rate;
  }

  function updateSettings(newSettings) {
    userSettings = { ...userSettings, ...newSettings };
  }

  return {
    get userSettings() {
      return userSettings;
    },
    set userSettings(v) {
      userSettings = v;
    },
    setHourlyRate,
    updateSettings,
  };
}
