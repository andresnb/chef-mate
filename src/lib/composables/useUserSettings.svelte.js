import {
  subscribeUserSettings,
  updateUserSettings as updateSettingsFirestore,
} from "../firebase/firestore.js";

/**
 * Composable para gestión de configuración del usuario.
 * Usa Firestore cuando hay usuario autenticado.
 * @param {{ user: { uid: string, email: string | null, displayName: string | null, photoURL: string | null } | null }} authState
 */
export function useUserSettings(authState) {
  let userSettings = $state({ hourlyRate: 0 });
  /** @type {(() => void) | null} */
  let unsubscribe = null;

  $effect(() => {
    // Clean up previous listener
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    if (authState?.user?.uid) {
      const uid = authState.user.uid;
      unsubscribe = subscribeUserSettings(uid, (/** @type {any} */ data) => {
        userSettings = { hourlyRate: data.hourlyRate || 0 };
      });
    } else {
      userSettings = { hourlyRate: 0 };
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };
  });

  /** @param {number} rate */
  function setHourlyRate(rate) {
    userSettings.hourlyRate = rate;
    if (authState?.user?.uid) {
      updateSettingsFirestore(authState.user.uid, { hourlyRate: rate });
    }
  }

  /** @param {Record<string, any>} newSettings */
  function updateSettings(newSettings) {
    userSettings = { ...userSettings, ...newSettings };
    if (authState?.user?.uid) {
      updateSettingsFirestore(authState.user.uid, newSettings);
    }
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
