/**
 * Composable para gestión de navegación entre pantallas
 */

export function useNavigation() {
  let currentScreen = $state("home"); // 'home', 'create', 'ingredients', 'recipes'
  let isInitialized = $state(false);

  // Effect para persistir navegación
  $effect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem("chefmate-current-screen", currentScreen);
    } catch (e) {
      // Silently fail in private browsing mode
    }
  });

  // Cargar estado guardado al inicializar (solo una vez)
  function initialize() {
    if (isInitialized) return;

    try {
      const savedScreen = localStorage.getItem("chefmate-current-screen");
      if (
        savedScreen &&
        ["home", "create", "ingredients", "recipes"].includes(savedScreen)
      ) {
        currentScreen = savedScreen;
      }
    } catch (e) {
      // Use default screen
    }
    isInitialized = true;
  }

  /** @param {string} screen */
  function goTo(screen) {
    currentScreen = screen;
  }

  function goHome() {
    currentScreen = "home";
  }

  function goToCreate() {
    currentScreen = "create";
  }

  function goToIngredients() {
    currentScreen = "ingredients";
  }

  function goToRecipes() {
    currentScreen = "recipes";
  }

  return {
    get currentScreen() {
      return currentScreen;
    },
    set currentScreen(v) {
      currentScreen = v;
    },
    goTo,
    goHome,
    goToCreate,
    goToIngredients,
    goToRecipes,
    initialize,
  };
}
