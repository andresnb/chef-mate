<script>
  import Header from './lib/components/Header.svelte';
  import HomeScreen from './lib/screens/HomeScreen.svelte';
  import CreateScreen from './lib/screens/CreateScreen.svelte';
  import IngredientsScreen from './lib/screens/IngredientsScreen.svelte';
  import RecipesScreen from './lib/screens/RecipesScreen.svelte';
  import SettingsModal from './lib/components/SettingsModal.svelte';
  import Toast from './lib/components/Toast.svelte';

  // Composables
  import { useNavigation } from './lib/composables/useNavigation.svelte.js';
  import { useDarkMode } from './lib/composables/useDarkMode.svelte.js';
  import { useUserSettings } from './lib/composables/useUserSettings.svelte.js';
  import { useRecipes } from './lib/composables/useRecipes.svelte.js';
  import { useToast } from './lib/composables/useToast.svelte.js';

  // Inicializar composables
  const navigation = useNavigation();
  const darkMode = useDarkMode();
  const userSettings = useUserSettings();
  const recipesManager = useRecipes();
  const toast = useToast();

  // Inicializar navegación después de que todo esté listo
  navigation.initialize();

  // Estados derivados del composable
  let currentScreen = $derived.by(() => {
    return navigation.currentScreen;
  });
  let isDarkMode = $derived(darkMode.isDarkMode);
  let userSettingsData = $derived(userSettings.userSettings);
  let recipes = $derived(recipesManager.recipes);
  let currentRecipe = $derived(recipesManager.currentRecipe);

  // Mostrar/ocultar modal de settings
  let showSettings = $state(false);

  // Formularios
  let newRecipeName = $state('');
  let newIngredient = $state({
    name: '',
    quantity: '',
    unit: '',
    pricePerKgOrL: 0,
    containerQuantity: '',
    containerUnit: '',
    containerPrice: 0
  });

  // Cálculos reactivos
  let recipeIngredients = $derived((currentRecipe && currentRecipe.ingredients) || []);
  let totalIngredientsCost = $derived(recipesManager.getTotal(recipeIngredients));
  let recipePrepTime = $derived((currentRecipe && currentRecipe.prepTimeMinutes) || 0);
  let laborCost = $derived(
    ((userSettingsData.hourlyRate || 0) * (recipePrepTime / 60)) || 0
  );
  let totalRecipeCost = $derived(totalIngredientsCost + laborCost);

  // Handlers de navegación
  function goTo(screen) {
    navigation.goTo(screen);
  }

  function goBack() {
    navigation.goHome();
  }

  // Handlers de toggle
  function toggleDarkMode() {
    darkMode.toggleDarkMode();
  }

  function handleSaveSettings(settings) {
    userSettings.updateSettings(settings);
    toast.success('Ajustes guardados');
  }

  // Handlers de recetas
  function handleCreateRecipe(name) {
    const recipe = recipesManager.createRecipe(name);
    if (recipe) {
      newRecipeName = '';
      navigation.goTo('ingredients');
      toast.success(`Receta "${name}" creada`);
    }
  }

  function handleAddIngredient() {
    recipesManager.addIngredient(newIngredient);
    // Reset ingredient form
    newIngredient = {
      name: '',
      quantity: '',
      unit: '',
      pricePerKgOrL: 0,
      containerQuantity: '',
      containerUnit: '',
      containerPrice: 0
    };
  }

  function handleRemoveIngredient(ingredientId) {
    recipesManager.removeIngredient(ingredientId);
  }

  function handleDeleteRecipe(recipeId) {
    recipesManager.deleteRecipe(recipeId);
    navigation.goTo('recipes');
    toast.success('Receta eliminada');
  }

  function handleSelectRecipe(recipe) {
    recipesManager.selectRecipe(recipe);
    navigation.goTo('ingredients');
  }

  function handlePrepTimeChange(recipeId, minutes) {
    recipesManager.updatePrepTime(recipeId, minutes);
  }

  // Preparar datos de ingredientes para mostrar
  let ingredientsWithPrice = $derived(recipeIngredients.map(ing => ({
    ...ing,
    _displayPrice: recipesManager.getIngredientDisplayPrice(ing)
  })));
</script>

<main>
  <Header
    showBackButton={currentScreen !== 'home'}
    isDarkMode={isDarkMode}
    onBack={goBack}
    onToggleDarkMode={toggleDarkMode}
    onOpenSettings={() => showSettings = true}
  />

  {#if currentScreen === 'home'}
    <HomeScreen
      {recipes}
      onNavigate={goTo}
    />
  {/if}

  {#if currentScreen === 'create'}
    <CreateScreen
      bind:recipeName={newRecipeName}
      onSubmit={handleCreateRecipe}
    />
  {/if}

  {#if currentScreen === 'ingredients' && currentRecipe}
    <IngredientsScreen
      recipe={{...currentRecipe, ingredients: ingredientsWithPrice}}
      bind:newIngredient
      totalIngredientsCost={totalIngredientsCost}
      laborCost={laborCost}
      totalRecipeCost={totalRecipeCost}
      onAddIngredient={handleAddIngredient}
      onRemoveIngredient={handleRemoveIngredient}
      onDeleteRecipe={handleDeleteRecipe}
      onPrepTimeChange={handlePrepTimeChange}
      {toast}
    />
  {/if}

  {#if currentScreen === 'recipes'}
    <RecipesScreen
      {recipes}
      getTotal={recipesManager.getTotal}
      onSelectRecipe={handleSelectRecipe}
      onNavigate={goTo}
    />
  {/if}

  <SettingsModal
    show={showSettings}
    userSettings={userSettingsData}
    onClose={() => showSettings = false}
    onSave={handleSaveSettings}
  />

  <Toast toasts={toast.toasts} onDismiss={toast.dismiss} />
</main>

<style>
  :global(*) {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--color-background);
    min-height: 100vh;
    color: var(--color-foreground);
    transition: background var(--transition-base), color var(--transition-base);
  }

  main {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }
</style>
