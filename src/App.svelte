<script>
  import Header from './lib/components/Header.svelte';
  import HomeScreen from './lib/screens/HomeScreen.svelte';
  import CreateScreen from './lib/screens/CreateScreen.svelte';
  import IngredientsScreen from './lib/screens/IngredientsScreen.svelte';
  import RecipesScreen from './lib/screens/RecipesScreen.svelte';
  import LoginScreen from './lib/screens/LoginScreen.svelte';
  import SettingsModal from './lib/components/SettingsModal.svelte';
  import Toast from './lib/components/Toast.svelte';
  import InstallPrompt from './lib/components/InstallPrompt.svelte';

  // Composables
  import { useNavigation } from './lib/composables/useNavigation.svelte.js';
  import { useDarkMode } from './lib/composables/useDarkMode.svelte.js';
  import { useAuth } from './lib/composables/useAuth.svelte.js';
  import { useUserSettings } from './lib/composables/useUserSettings.svelte.js';
  import { useRecipes } from './lib/composables/useRecipes.svelte.js';
  import { usePurchases } from './lib/composables/usePurchases.svelte.js';
  import { useToast } from './lib/composables/useToast.svelte.js';

  // Initialize composables
  const navigation = useNavigation();
  const darkMode = useDarkMode();
  const authManager = useAuth();
  const toast = useToast();

  // Auth-dependent composables (reactive to auth state)
  const userSettings = useUserSettings(authManager);
  const recipesManager = useRecipes(authManager);
  const purchasesManager = usePurchases(authManager);

  // Initialize navigation
  navigation.initialize();

  // Derived states
  let currentScreen = $derived.by(() => navigation.currentScreen);
  let isDarkMode = $derived(darkMode.isDarkMode);
  let userSettingsData = $derived(userSettings.userSettings);
  let recipes = $derived(recipesManager.recipes);
  let currentRecipe = $derived(recipesManager.currentRecipe);

  // Settings modal
  let showSettings = $state(false);

  // Forms
  let newRecipeName = $state('');
  let newIngredient = $state({
    name: '',
    quantity: '',
    unit: '',
    pricePerKgOrL: 0,
    containerQuantity: '',
    containerUnit: '',
    containerPrice: 0,
    brand: '',
    store: ''
  });

  // Reactive calculations
  let recipeIngredients = $derived((currentRecipe && currentRecipe.ingredients) || []);
  let totalIngredientsCost = $derived(recipesManager.getTotal(recipeIngredients));
  let recipePrepTime = $derived((currentRecipe && currentRecipe.prepTimeMinutes) || 0);
  let laborCost = $derived(
    ((userSettingsData.hourlyRate || 0) * (recipePrepTime / 60)) || 0
  );
  let totalRecipeCost = $derived(totalIngredientsCost + laborCost);

  // Navigation handlers
  function goTo(screen) {
    navigation.goTo(screen);
  }

  function goBack() {
    navigation.goHome();
  }

  // Toggle handlers
  function toggleDarkMode() {
    darkMode.toggleDarkMode();
  }

  function handleSaveSettings(settings) {
    userSettings.updateSettings(settings);
    toast.success('Ajustes guardados');
  }

  // Recipe handlers
  async function handleCreateRecipe(name) {
    const recipe = await recipesManager.createRecipe(name);
    if (recipe) {
      newRecipeName = '';
      navigation.goTo('ingredients');
      toast.success(`Receta "${name}" creada`);
    }
  }

  async function handleAddIngredient() {
    await recipesManager.addIngredient(newIngredient);

    // Auto-save purchase if container data is complete
    if (newIngredient.containerQuantity && newIngredient.containerUnit && newIngredient.containerPrice) {
      await purchasesManager.addPurchase({
        productName: newIngredient.name,
        containerQuantity: newIngredient.containerQuantity,
        containerUnit: newIngredient.containerUnit,
        containerPrice: newIngredient.containerPrice,
        brand: newIngredient.brand || '',
        store: newIngredient.store || '',
      });
    }

    // Reset form
    newIngredient = {
      name: '',
      quantity: '',
      unit: '',
      pricePerKgOrL: 0,
      containerQuantity: '',
      containerUnit: '',
      containerPrice: 0,
      brand: '',
      store: ''
    };
  }

  async function handleRemoveIngredient(ingredientId) {
    await recipesManager.removeIngredient(ingredientId);
  }

  async function handleDeleteRecipe(recipeId) {
    await recipesManager.deleteRecipe(recipeId);
    navigation.goTo('recipes');
    toast.success('Receta eliminada');
  }

  function handleSelectRecipe(recipe) {
    recipesManager.selectRecipe(recipe);
    navigation.goTo('ingredients');
  }

  async function handlePrepTimeChange(recipeId, minutes) {
    await recipesManager.updatePrepTime(recipeId, minutes);
  }

  // Purchase handlers
  function handleSearchPurchases(query) {
    return purchasesManager.searchByName(query);
  }

  function handleSelectPurchase(purchase) {
    purchasesManager.updatePurchaseUsage(purchase.id);
  }

  async function handleClearPurchases() {
    await purchasesManager.clearAll();
    toast.success('Historial de compras eliminado');
  }

  // Auth handlers
  async function handleSignOut() {
    await authManager.signOut();
    navigation.goHome();
    showSettings = false;
  }

  // Ingredient display data
  let ingredientsWithPrice = $derived(recipeIngredients.map(ing => ({
    ...ing,
    _displayPrice: recipesManager.getIngredientDisplayPrice(ing)
  })));
</script>

{#if authManager.isLoading}
  <!-- Loading splash -->
  <div class="loading-screen">
    <div class="loading-content">
      <span class="loading-logo">&#x1F468;&#x200D;&#x1F373;</span>
      <div class="loading-spinner"></div>
    </div>
  </div>
{:else if !authManager.user}
  <!-- Login -->
  <LoginScreen
    onSignInWithGoogle={authManager.signInWithGoogle}
    onSignInWithEmail={authManager.signInWithEmail}
    onCreateAccount={authManager.createAccount}
    error={authManager.error}
    {isDarkMode}
    onToggleDarkMode={toggleDarkMode}
  />
{:else}
  <!-- App -->
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
        onSearchPurchases={handleSearchPurchases}
        onSelectPurchase={handleSelectPurchase}
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
      purchaseCount={purchasesManager.count}
      onClearPurchases={handleClearPurchases}
      user={authManager.user}
      onSignOut={handleSignOut}
    />

    <Toast toasts={toast.toasts} onDismiss={toast.dismiss} />
  </main>
{/if}

<InstallPrompt />

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

  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background);
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .loading-logo {
    font-size: 3.5rem;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
