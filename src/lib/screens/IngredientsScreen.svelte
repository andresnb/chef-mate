<script>
  import IngredientForm from '../components/IngredientForm.svelte';
  import IngredientItem from '../components/IngredientItem.svelte';
  import TotalBar from '../components/TotalBar.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import ConfirmModal from '../components/ConfirmModal.svelte';
  import { validateIngredient } from '../utils/validation.js';

  let {
    recipe = null,
    newIngredient = $bindable({
      name: '',
      quantity: '',
      unit: '',
      pricePerKgOrL: 0,
      containerQuantity: '',
      containerUnit: '',
      containerPrice: 0
    }),
    totalIngredientsCost = 0,
    laborCost = 0,
    totalRecipeCost = 0,
    onAddIngredient = () => {},
    onRemoveIngredient = () => {},
    onDeleteRecipe = () => {},
    onPrepTimeChange = () => {},
    onSearchPurchases = () => [],
    onSelectPurchase = () => {},
    toast = null
  } = $props();

  let validationError = $state('');
  let validationWarning = $state('');
  let showDeleteConfirm = $state(false);
  let showRemoveConfirm = $state(false);
  let ingredientToRemove = $state(null);

  function handleAddIngredient(ingredientData) {
    const validation = validateIngredient(ingredientData);

    validationError = '';
    validationWarning = '';

    if (!validation.valid) {
      validationError = validation.error || 'Error de validacion';
      if (toast) toast.error(validation.error || 'Error de validacion');
      return;
    }

    if (validation.warning) {
      validationWarning = validation.warning;
      if (toast) toast.warning(validation.warning, 4000);
    }

    onAddIngredient(ingredientData);
    if (toast) toast.success(`"${ingredientData.name}" agregado`);
  }

  function confirmDeleteRecipe() {
    showDeleteConfirm = true;
  }

  function handleDeleteConfirm() {
    showDeleteConfirm = false;
    onDeleteRecipe(recipe.id);
  }

  function confirmRemoveIngredient(ingredientId) {
    ingredientToRemove = ingredientId;
    showRemoveConfirm = true;
  }

  function handleRemoveConfirm() {
    showRemoveConfirm = false;
    onRemoveIngredient(ingredientToRemove);
    ingredientToRemove = null;
    if (toast) toast.success('Ingrediente eliminado');
  }
</script>

{#if recipe}
  <section class="screen ingredients-screen">
    <!-- Recipe header -->
    <div class="recipe-header">
      <div class="recipe-title-group">
        <h2>{recipe.name}</h2>
        <span class="recipe-badge">{recipe.ingredients?.length || 0} ingredientes</span>
      </div>
      <button class="delete-btn" onclick={confirmDeleteRecipe} aria-label="Eliminar receta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>

    <!-- Prep time -->
    <div class="prep-time-card">
      <div class="prep-time-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="prep-time-label">Tiempo de preparacion</span>
      </div>
      <div class="prep-time-input-group">
        <input
          id="prep-time"
          type="number"
          value={recipe.prepTimeMinutes || 0}
          oninput={(e) => onPrepTimeChange(recipe.id, parseInt(e.currentTarget.value) || 0)}
          placeholder="0"
          min="0"
          class="prep-time-input"
        />
        <span class="prep-time-unit">min</span>
      </div>
    </div>

    <!-- Ingredient form -->
    <IngredientForm
      bind:ingredient={newIngredient}
      onSubmit={handleAddIngredient}
      {onSearchPurchases}
      {onSelectPurchase}
    />

    {#if validationError}
      <div class="validation-msg validation-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {validationError}
      </div>
    {/if}

    {#if validationWarning}
      <div class="validation-msg validation-warning">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        {validationWarning}
      </div>
    {/if}

    <!-- Ingredients list -->
    <div class="ingredients-list">
      {#if recipe.ingredients && recipe.ingredients.length > 0}
        <div class="list-header">
          <span>Ingredientes</span>
          <span>Costo</span>
        </div>
      {/if}

      {#each recipe.ingredients || [] as ingredient, i (ingredient.id)}
        <div style="animation-delay: {i * 40}ms" class="ingredient-anim">
          <IngredientItem
            {ingredient}
            displayPrice={ingredient._displayPrice || '0.00'}
            onRemove={confirmRemoveIngredient}
          />
        </div>
      {/each}

      {#if !recipe.ingredients || recipe.ingredients.length === 0}
        <EmptyState
          message="No hay ingredientes aun"
          hint="Agrega ingredientes con el formulario de arriba"
        />
      {/if}
    </div>

    <!-- Total -->
    <TotalBar
      ingredientsCost={totalIngredientsCost}
      laborCost={laborCost}
      totalCost={totalRecipeCost}
    />
  </section>

  <ConfirmModal
    show={showDeleteConfirm}
    title="Eliminar receta"
    message="Estas seguro de que queres eliminar '{recipe.name}'? Esta accion no se puede deshacer."
    confirmText="Eliminar"
    destructive={true}
    onConfirm={handleDeleteConfirm}
    onCancel={() => showDeleteConfirm = false}
  />

  <ConfirmModal
    show={showRemoveConfirm}
    title="Eliminar ingrediente"
    message="Queres eliminar este ingrediente?"
    confirmText="Eliminar"
    destructive={true}
    onConfirm={handleRemoveConfirm}
    onCancel={() => { showRemoveConfirm = false; ingredientToRemove = null; }}
  />
{/if}

<style>
  .screen {
    flex: 1;
    padding: 24px 20px;
    padding-bottom: 32px;
    animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Recipe Header */
  .recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .recipe-title-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .recipe-header h2 {
    font-size: 1.35rem;
    font-weight: 750;
    color: var(--color-foreground);
    margin: 0;
    letter-spacing: -0.02em;
  }

  .recipe-badge {
    display: inline-flex;
    padding: 3px 10px;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 600;
    width: fit-content;
  }

  .delete-btn {
    width: 38px;
    height: 38px;
    border: 1px solid var(--color-border);
    background: var(--color-card);
    border-radius: var(--radius);
    cursor: pointer;
    color: var(--color-muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  @media (hover: hover) {
    .delete-btn:hover {
      background: var(--color-destructive);
      color: var(--color-destructive-foreground);
      border-color: var(--color-destructive);
    }
  }

  .delete-btn:active {
    transform: scale(0.93);
  }

  /* Prep time */
  .prep-time-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: var(--color-card);
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-xs);
  }

  .prep-time-left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-muted-foreground);
  }

  .prep-time-label {
    font-weight: 600;
    font-size: 0.88rem;
    color: var(--color-foreground);
  }

  .prep-time-input-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .prep-time-input {
    width: 64px;
    padding: 7px 10px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    background: var(--color-background);
    color: var(--color-foreground);
    text-align: center;
    font-weight: 600;
    transition: border-color var(--transition-fast);
  }

  .prep-time-input:focus {
    outline: none;
    border-color: var(--color-ring);
  }

  .prep-time-unit {
    color: var(--color-muted-foreground);
    font-size: 0.82rem;
    font-weight: 500;
  }

  /* Ingredients list */
  .ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    padding: 0 4px;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted-foreground);
    margin-bottom: 2px;
  }

  .ingredient-anim {
    animation: fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  /* Validation messages */
  .validation-msg {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    margin-bottom: 12px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .validation-error {
    background: hsl(var(--destructive) / 0.1);
    color: var(--color-destructive);
    border: 1px solid hsl(var(--destructive) / 0.2);
  }

  .validation-warning {
    background: hsl(var(--warning) / 0.1);
    color: var(--color-warning);
    border: 1px solid hsl(var(--warning) / 0.2);
  }

  @media (max-width: 480px) {
    .screen {
      padding: 16px;
    }
  }
</style>
