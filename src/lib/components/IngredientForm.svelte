<script>
  import QuantityInput from '../QuantityInput.svelte';
  import UnitSelect from '../UnitSelect.svelte';
  import PurchaseSuggestions from './PurchaseSuggestions.svelte';
  import { getPriceLabel } from '../utils/format.js';

  let {
    ingredient = $bindable({
      name: '',
      quantity: '',
      unit: '',
      pricePerKgOrL: 0,
      containerQuantity: '',
      containerUnit: '',
      containerPrice: 0,
      brand: '',
      store: ''
    }),
    onSubmit = () => {},
    onSearchPurchases = () => [],
    onSelectPurchase = () => {}
  } = $props();

  let priceLabel = $derived(getPriceLabel(ingredient.unit));

  let effectiveContainerUnit = $derived(
    ingredient.containerUnit || ingredient.unit
  );

  // Purchase suggestions state
  let showSuggestions = $state(false);
  let suggestions = $state([]);
  let searchTimer = $state(null);

  // Progressive disclosure: show brand/store when container fields have values
  let showBrandStore = $derived(
    !!(ingredient.containerQuantity || ingredient.containerUnit || ingredient.containerPrice)
  );

  function handleNameInput() {
    const query = ingredient.name;

    if (searchTimer) clearTimeout(searchTimer);

    if (!query || query.trim().length < 2) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    searchTimer = setTimeout(() => {
      const results = onSearchPurchases(query);
      suggestions = results;
      showSuggestions = results.length > 0;
    }, 150);
  }

  function handleNameFocus() {
    if (ingredient.name.trim().length >= 2) {
      const results = onSearchPurchases(ingredient.name);
      suggestions = results;
      showSuggestions = results.length > 0;
    }
  }

  function handleSelectSuggestion(purchase) {
    ingredient.name = purchase.productName;
    ingredient.containerQuantity = purchase.containerQuantity;
    ingredient.containerUnit = purchase.containerUnit;
    ingredient.containerPrice = purchase.containerPrice;
    ingredient.brand = purchase.brand || '';
    ingredient.store = purchase.store || '';
    showSuggestions = false;
    onSelectPurchase(purchase);
  }

  function handleDismissSuggestions() {
    showSuggestions = false;
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(ingredient);
  }
</script>

<form class="ingredient-form" onsubmit={handleSubmit}>
  <div class="form-section">
    <div class="section-label">Ingrediente</div>
    <div class="form-row form-row-main">
      <div class="input-group qty-group">
        <QuantityInput bind:value={ingredient.quantity} label="Cant." />
      </div>
      <div class="input-group unit-group">
        <UnitSelect bind:value={ingredient.unit} label="Unidad" />
      </div>
      <div class="input-group name-group">
        <label class="input-label" for="ingredient-name">Nombre</label>
        <input
          id="ingredient-name"
          type="text"
          bind:value={ingredient.name}
          placeholder="Ej: Harina"
          class="text-input"
          oninput={handleNameInput}
          onfocus={handleNameFocus}
          autocomplete="off"
        />
      </div>
    </div>
    <PurchaseSuggestions
      {suggestions}
      visible={showSuggestions}
      onSelect={handleSelectSuggestion}
      onDismiss={handleDismissSuggestions}
    />
  </div>

  <div class="form-divider"></div>

  <div class="form-section">
    <div class="section-label">Presentacion en tienda</div>
    <div class="form-row form-row-container">
      <div class="input-group container-qty-group">
        <QuantityInput bind:value={ingredient.containerQuantity} label="Contenido" showFractions={false} />
      </div>
      <div class="input-group container-unit-group">
        <UnitSelect
          bind:value={ingredient.containerUnit}
          label="Unidad"
          defaultValue={effectiveContainerUnit}
          onlyCommercial={true}
        />
      </div>
      <div class="input-group container-price-group">
        <label class="input-label" for="container-price">Precio ($)</label>
        <input
          id="container-price"
          type="number"
          bind:value={ingredient.containerPrice}
          placeholder="0.00"
          step="0.01"
          min="0"
          class="text-input price-input"
        />
      </div>
    </div>

    {#if showBrandStore}
      <div class="form-row form-row-brand-store">
        <div class="input-group brand-group">
          <label class="input-label" for="ingredient-brand">Marca (opcional)</label>
          <input
            id="ingredient-brand"
            type="text"
            bind:value={ingredient.brand}
            placeholder="Ej: Zulka"
            class="text-input"
            autocomplete="off"
          />
        </div>
        <div class="input-group store-group">
          <label class="input-label" for="ingredient-store">Tienda (opcional)</label>
          <input
            id="ingredient-store"
            type="text"
            bind:value={ingredient.store}
            placeholder="Ej: Walmart"
            class="text-input"
            autocomplete="off"
          />
        </div>
      </div>
    {/if}
  </div>

  <button type="submit" class="add-btn" class:disabled={!ingredient.name.trim()}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Agregar Ingrediente
  </button>
</form>

<style>
.ingredient-form {
  background: var(--color-card);
  padding: 18px;
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted-foreground);
}

.form-divider {
  height: 1px;
  background: var(--color-border);
  margin: 14px 0;
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row-main {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  align-items: start;
}

.form-row-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.form-row-brand-store {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.container-qty-group,
.container-unit-group,
.container-price-group {
  min-width: 0;
}

.brand-group,
.store-group {
  min-width: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 50px;
  margin-top: 16px;
  font-size: 0.92rem;
  font-weight: 650;
  background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
  color: var(--color-primary-foreground);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 12px hsl(var(--primary) / 0.2);
}

@media (hover: hover) {
  .add-btn:hover:not(.disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px hsl(var(--primary) / 0.3);
  }
}

.add-btn:active:not(.disabled) {
  transform: scale(0.98);
}

.add-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.qty-group {
  min-width: 0;
}

.unit-group {
  min-width: 0;
}

.name-group {
  flex: 1;
  min-width: 0;
}

.text-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font-size: 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-foreground);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.text-input:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
}

.text-input::placeholder {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

@media (max-width: 480px) {
  .form-row-main {
    grid-template-columns: 1fr 1fr;
  }

  .name-group {
    grid-column: 1 / -1;
  }

  .form-row-container {
    grid-template-columns: 1fr 1fr;
  }

  .container-price-group {
    grid-column: 1 / -1;
  }
}
</style>
