<script>
  import { onMount } from 'svelte';

  // Estado de la aplicación
  let currentScreen = 'home'; // 'home', 'create', 'ingredients', 'recipes'
  let recipes = [];
  let currentRecipe = null;
  
  // Formularios
  let newRecipeName = '';
  let newIngredient = { name: '', quantity: '', price: 0 };

  // Cargar recetas desde localStorage al iniciar
  onMount(() => {
    const saved = localStorage.getItem('chefmate-recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate schema
        if (Array.isArray(parsed)) {
          recipes = parsed.filter(r => r && typeof r === 'object' && r.id && r.name);
        } else {
          recipes = [];
        }
      } catch (e) {
        recipes = [];
      }
    }
  });

  // Guardar recetas en localStorage
  function saveRecipes() {
    localStorage.setItem('chefmate-recipes', JSON.stringify(recipes));
  }

  // Navegación
  function goTo(screen) {
    currentScreen = screen;
  }

  // Crear nueva receta
  function createRecipe() {
    if (!newRecipeName.trim()) return;
    
    const recipe = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newRecipeName.trim(),
      ingredients: [],
      createdAt: new Date().toISOString()
    };
    
    recipes = [...recipes, recipe];
    currentRecipe = recipe;
    newRecipeName = '';
    saveRecipes();
    
    // Navegar automáticamente a ingredientes
    goTo('ingredients');
  }

  // Agregar ingrediente
  function addIngredient() {
    if (!newIngredient.name.trim() || !currentRecipe) return;
    
    const recipeIndex = recipes.findIndex(r => r.id === currentRecipe.id);
    if (recipeIndex === -1) return;
    
    const ingredient = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newIngredient.name.trim(),
      quantity: newIngredient.quantity.trim(),
      price: Math.max(0, parseFloat(String(newIngredient.price)) || 0)
    };
    
    recipes[recipeIndex].ingredients = [
      ...recipes[recipeIndex].ingredients,
      ingredient
    ];
    currentRecipe = recipes[recipeIndex];
    newIngredient = { name: '', quantity: '', price: 0 };
    saveRecipes();
  }

  // Eliminar ingrediente
  function removeIngredient(ingredientId) {
    if (!currentRecipe) return;
    
    const recipeIndex = recipes.findIndex(r => r.id === currentRecipe.id);
    if (recipeIndex === -1) return;
    
    recipes[recipeIndex].ingredients = 
      recipes[recipeIndex].ingredients.filter(i => i.id !== ingredientId);
    currentRecipe = recipes[recipeIndex];
    saveRecipes();
  }

  // Eliminar receta
  function deleteRecipe(recipeId) {
    recipes = recipes.filter(r => r.id !== recipeId);
    if (currentRecipe?.id === recipeId) {
      currentRecipe = null;
    }
    saveRecipes();
  }

  // Seleccionar receta para editar
  function selectRecipe(recipe) {
    currentRecipe = recipe;
    goTo('ingredients');
  }

  // Calcular total de ingredientes
  function getTotal(ingredients) {
    return ingredients.reduce((sum, ing) => sum + (parseFloat(ing.price) || 0), 0);
  }

  // Formatear fecha
  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  }
</script>

<main>
  <!-- Header -->
  <header>
    <div class="header-content">
      {#if currentScreen !== 'home'}
        <button class="back-btn" onclick={() => goTo('home')}>
          ←
        </button>
      {/if}
      <h1>🍰 ChefMate</h1>
      {#if currentScreen === 'home'}
        <button class="menu-btn" onclick={() => goTo('recipes')}>
          📋
        </button>
      {:else}
        <div style="width: 40px;"></div>
      {/if}
    </div>
  </header>

  <!-- Pantalla: Home -->
  {#if currentScreen === 'home'}
    <section class="screen home-screen">
      <div class="hero">
        <div class="hero-icon">👨‍🍳</div>
        <h2>Tu bitácora de costos</h2>
        <p>Crea recetas y controla cuánto gastas en ingredientes</p>
      </div>
      
      <div class="action-cards">
        <button class="action-card primary" onclick={() => goTo('create')}>
          <span class="card-icon">➕</span>
          <span class="card-text">
            <strong>Nueva Receta</strong>
            <small>Crear una receta desde cero</small>
          </span>
        </button>
        
        <button class="action-card" onclick={() => goTo('recipes')}>
          <span class="card-icon">📖</span>
          <span class="card-text">
            <strong>Mis Recetas</strong>
            <small>{recipes.length} recetas guardadas</small>
          </span>
        </button>
      </div>
    </section>
  {/if}

  <!-- Pantalla: Crear Receta -->
  {#if currentScreen === 'create'}
    <section class="screen create-screen">
      <div class="screen-header">
        <h2>Nueva Receta</h2>
        <p>¿Qué vas a preparar?</p>
      </div>
      
      <form class="create-form" onsubmit={(e) => { e.preventDefault(); createRecipe(); }}>
        <div class="input-group">
          <label for="recipe-name">Nombre de la receta</label>
          <input 
            id="recipe-name"
            type="text" 
            bind:value={newRecipeName} 
            placeholder="Ej: Torta de Chocolate"
          />
          {#if newRecipeName.trim() === '' && newRecipeName.length > 0}
            <small style="color: #ff5252;">El nombre no puede estar vacío</small>
          {/if}
        </div>
        
        <button type="submit" class="submit-btn" class:disabled={!newRecipeName.trim()}>
          Crear y agregar ingredientes →
        </button>
      </form>
    </section>
  {/if}

  <!-- Pantalla: Ingredientes -->
  {#if currentScreen === 'ingredients' && currentRecipe}
    <section class="screen ingredients-screen">
      <div class="recipe-header">
        <h2>🍪 {currentRecipe.name}</h2>
        <button class="delete-recipe-btn" onclick={() => { if (confirm('¿Estás seguro de eliminar esta receta?')) { deleteRecipe(currentRecipe.id); goTo('recipes'); } }}>
          🗑️
        </button>
      </div>
      
      <!-- Formulario agregar ingrediente -->
      <form class="ingredient-form" onsubmit={(e) => { e.preventDefault(); addIngredient(); }}>
        <div class="form-row">
          <input 
            type="text" 
            bind:value={newIngredient.name} 
            placeholder="Ingrediente"
            class="name-input"
          />
          <input 
            type="text" 
            bind:value={newIngredient.quantity} 
            placeholder="Cantidad"
            class="qty-input"
          />
        </div>
        <div class="form-row">
          <input 
            type="number" 
            bind:value={newIngredient.price} 
            placeholder="Precio ($)"
            step="0.01"
            min="0"
            class="price-input"
          />
          <button type="submit" class="add-btn" class:disabled={!newIngredient.name.trim()}>
            +
          </button>
        </div>
      </form>

      <!-- Lista de ingredientes -->
      <div class="ingredients-list">
        {#each currentRecipe.ingredients as ingredient}
          <div class="ingredient-item">
            <div class="ingredient-info">
              <span class="ingredient-name">{ingredient.name}</span>
              <span class="ingredient-quantity">{ingredient.quantity || '—'}</span>
            </div>
            <div class="ingredient-right">
              <span class="ingredient-price">${(parseFloat(ingredient.price) || 0).toFixed(2)}</span>
              <button class="remove-btn" onclick={() => removeIngredient(ingredient.id)}>×</button>
            </div>
          </div>
        {/each}
        
        {#if currentRecipe.ingredients.length === 0}
          <div class="empty-state">
            <p>No hay ingredientes aún</p>
            <small>Agrega los arriba ingredientes</small>
          </div>
        {/if}
      </div>

      <!-- Total -->
      <div class="total-bar">
        <span>Total de la receta:</span>
        <span class="total-amount">${(getTotal(currentRecipe.ingredients) || 0).toFixed(2)}</span>
      </div>
    </section>
  {/if}

  <!-- Pantalla: Mis Recetas -->
  {#if currentScreen === 'recipes'}
    <section class="screen recipes-screen">
      <div class="screen-header">
        <h2>Mis Recetas</h2>
        <p>{recipes.length} recetas guardadas</p>
      </div>
      
      <div class="recipes-list">
        {#each recipes as recipe (recipe.id)}
          <button class="recipe-card" onclick={() => selectRecipe(recipe)}>
            <div class="recipe-info">
              <span class="recipe-name">{recipe.name}</span>
              <span class="recipe-meta">
                {recipe.ingredients.length} ingredientes • {formatDate(recipe.createdAt)}
              </span>
            </div>
            <div class="recipe-total">
              ${(getTotal(recipe.ingredients) || 0).toFixed(2)}
            </div>
          </button>
        {/each}
        
        {#if recipes.length === 0}
          <div class="empty-state">
            <p>No hay recetas aún</p>
            <button class="create-first-btn" onclick={() => goTo('create')}>
              Crear mi primera receta
            </button>
          </div>
        {/if}
      </div>
    </section>
  {/if}
</main>

<style>
  :global(*) {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  main {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  header {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    padding: 16px 20px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 480px;
    margin: 0 auto;
  }

  header h1 {
    font-size: 1.4rem;
    margin: 0;
    color: #333;
  }

  .back-btn, .menu-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: #f0f0f0;
    border-radius: 12px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background 0.2s;
  }

  .back-btn:active, .menu-btn:active {
    transform: scale(0.95);
    background: #e0e0e0;
  }

  /* Screens */
  .screen {
    flex: 1;
    padding: 20px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Home Screen */
  .hero {
    text-align: center;
    padding: 40px 20px;
    color: white;
  }

  .hero-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hero h2 {
    font-size: 1.8rem;
    margin: 0 0 8px 0;
  }

  .hero p {
    opacity: 0.9;
    font-size: 1rem;
    margin: 0;
  }

  .action-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .action-card:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .action-card.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .card-icon {
    font-size: 2rem;
  }

  .card-text {
    display: flex;
    flex-direction: column;
  }

  .card-text strong {
    font-size: 1.1rem;
  }

  .card-text small {
    opacity: 0.8;
    font-size: 0.85rem;
  }

  /* Create Screen */
  .screen-header {
    margin-bottom: 24px;
  }

  .screen-header h2 {
    font-size: 1.5rem;
    margin: 0 0 4px 0;
    color: white;
  }

  .screen-header p {
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  .create-form {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  .submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
  }

  .submit-btn:active {
    transform: scale(0.98);
  }

  .submit-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ingredients Screen */
  .recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .recipe-header h2 {
    font-size: 1.3rem;
    color: white;
    margin: 0;
  }

  .delete-recipe-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    color: white;
  }

  .ingredient-form {
    background: white;
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .form-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .form-row:last-child {
    margin-bottom: 0;
  }

  .name-input { flex: 2; }
  .qty-input { flex: 1; }
  .price-input { flex: 1; }

  .add-btn {
    width: 50px;
    height: 50px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }

  .add-btn:active {
    transform: scale(0.95);
    background: #5568d3;
  }

  .add-btn.disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .ingredient-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ingredient-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ingredient-name {
    font-weight: 600;
    color: #333;
  }

  .ingredient-quantity {
    font-size: 0.85rem;
    color: #888;
  }

  .ingredient-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ingredient-price {
    font-weight: 700;
    color: #4caf50;
    font-size: 1.1rem;
  }

  .remove-btn {
    width: 32px;
    height: 32px;
    background: #ff5252;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .remove-btn:active {
    background: #ff1744;
  }

  .total-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .total-amount {
    font-size: 1.5rem;
    color: #4caf50;
  }

  /* Recipes Screen */
  .recipes-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .recipe-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    background: white;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    transition: transform 0.2s;
  }

  .recipe-card:active {
    transform: scale(0.98);
  }

  .recipe-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .recipe-name {
    font-weight: 600;
    font-size: 1.05rem;
    color: #333;
  }

  .recipe-meta {
    font-size: 0.8rem;
    color: #888;
  }

  .recipe-total {
    font-weight: 700;
    font-size: 1.2rem;
    color: #4caf50;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: white;
  }

  .empty-state p {
    font-size: 1.1rem;
    margin: 0 0 8px 0;
    opacity: 0.9;
  }

  .empty-state small {
    opacity: 0.7;
  }

  .create-first-btn {
    margin-top: 16px;
    padding: 14px 24px;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .create-first-btn:active {
    transform: scale(0.98);
  }

  /* Mobile optimizations */
  @media (max-width: 480px) {
    .screen {
      padding: 16px;
    }

    .hero {
      padding: 30px 16px;
    }

    .hero-icon {
      font-size: 3rem;
    }

    .action-card {
      padding: 16px;
    }

    .form-row {
      flex-wrap: wrap;
    }

    .name-input, .qty-input, .price-input {
      flex: 1 1 100%;
    }

    .ingredient-form .add-btn {
      width: 100%;
    }
  }
</style>
