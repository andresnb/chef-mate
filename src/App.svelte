<script>
  let recipes = [];
  let newRecipeName = '';
  let newIngredient = { name: '', quantity: '', price: 0 };
  let selectedRecipe = null;

  function addRecipe() {
    if (!newRecipeName.trim()) return;
    recipes = [...recipes, { 
      id: Date.now(), 
      name: newRecipeName, 
      ingredients: [] 
    }];
    newRecipeName = '';
  }

  function addIngredient() {
    if (!newIngredient.name.trim() || !selectedRecipe) return;
    const recipeIndex = recipes.findIndex(r => r.id === selectedRecipe.id);
    recipes[recipeIndex].ingredients = [
      ...recipes[recipeIndex].ingredients,
      { ...newIngredient, id: Date.now() }
    ];
    newIngredient = { name: '', quantity: '', price: 0 };
  }

  function removeIngredient(recipeId, ingredientId) {
    const recipeIndex = recipes.findIndex(r => r.id === recipeId);
    recipes[recipeIndex].ingredients = recipes[recipeIndex].ingredients.filter(i => i.id !== ingredientId);
  }

  function deleteRecipe(recipeId) {
    recipes = recipes.filter(r => r.id !== recipeId);
    selectedRecipe = null;
  }

  function getTotal(ingredients) {
    return ingredients.reduce((sum, ing) => sum + (parseFloat(ing.price) || 0), 0);
  }

  function selectRecipe(recipe) {
    selectedRecipe = recipe;
  }
</script>

<main>
  <header>
    <h1>🍰 ChefMate</h1>
    <p class="subtitle">Tu bitácora de costos de recetas</p>
  </header>

  <div class="container">
    <!-- Panel de Recetas -->
    <section class="recipes-panel">
      <h2>📋 Mis Recetas</h2>
      
      <div class="add-recipe-form">
        <input 
          type="text" 
          bind:value={newRecipeName} 
          placeholder="Nombre de la receta..."
          onkeypress={(e) => e.key === 'Enter' && addRecipe()}
        />
        <button onclick={addRecipe}>+ Agregar</button>
      </div>

      <div class="recipe-list">
        {#each recipes as recipe}
          <div 
            class="recipe-item" 
            class:selected={selectedRecipe?.id === recipe.id}
            onclick={() => selectRecipe(recipe)}
          >
            <span class="recipe-name">{recipe.name}</span>
            <span class="recipe-total">${getTotal(recipe.ingredients).toFixed(2)}</span>
            <button class="delete-btn" onclick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}>×</button>
          </div>
        {/each}
        
        {#if recipes.length === 0}
          <p class="empty-message">No hay recetas aún. ¡Agrega una!</p>
        {/if}
      </div>
    </section>

    <!-- Panel de Detalles -->
    <section class="details-panel">
      {#if selectedRecipe}
        <h2>🍪 {selectedRecipe.name}</h2>
        
        <div class="add-ingredient-form">
          <input 
            type="text" 
            bind:value={newIngredient.name} 
            placeholder="Ingrediente..."
          />
          <input 
            type="text" 
            bind:value={newIngredient.quantity} 
            placeholder="Cantidad (ej: 500g)"
          />
          <input 
            type="number" 
            bind:value={newIngredient.price} 
            placeholder="Precio ($)"
            step="0.01"
          />
          <button onclick={addIngredient}>+ Agregar</button>
        </div>

        <div class="ingredients-list">
          {#each selectedRecipe.ingredients as ingredient}
            <div class="ingredient-item">
              <div class="ingredient-info">
                <span class="ingredient-name">{ingredient.name}</span>
                <span class="ingredient-quantity">{ingredient.quantity}</span>
              </div>
              <div class="ingredient-price">
                <span>${parseFloat(ingredient.price).toFixed(2)}</span>
                <button class="remove-btn" onclick={() => removeIngredient(selectedRecipe.id, ingredient.id)}>×</button>
              </div>
            </div>
          {/each}
          
          {#if selectedRecipe.ingredients.length === 0}
            <p class="empty-message">Agrega ingredientes para calcular el costo.</p>
          {/if}
        </div>

        <div class="total-section">
          <span>Total de la Receta:</span>
          <span class="total-amount">${getTotal(selectedRecipe.ingredients).toFixed(2)}</span>
        </div>
      {:else}
        <div class="no-recipe-selected">
          <p>Selecciona una receta para ver sus detalles</p>
        </div>
      {/if}
    </section>
  </div>
</main>

<style>
  :global(body) {
    font-family: 'Segoe UI', system-ui, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 30px;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
  }

  .subtitle {
    opacity: 0.9;
    margin: 5px 0 0 0;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
    }
  }

  section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.3rem;
  }

  .add-recipe-form, .add-ingredient-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  input {
    flex: 1;
    min-width: 120px;
    padding: 10px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  button {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background 0.3s;
  }

  button:hover {
    background: #5568d3;
  }

  .recipe-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recipe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .recipe-item:hover {
    background: #eeeeee;
  }

  .recipe-item.selected {
    background: #667eea;
    color: white;
  }

  .recipe-name {
    font-weight: 600;
  }

  .recipe-total {
    font-weight: bold;
    color: #4caf50;
  }

  .recipe-item.selected .recipe-total {
    color: #a5d6a7;
  }

  .delete-btn {
    background: #ff5252;
    padding: 5px 10px;
    font-size: 1.2rem;
    margin-left: 10px;
  }

  .delete-btn:hover {
    background: #ff1744;
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
    padding: 12px 15px;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #667eea;
  }

  .ingredient-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ingredient-name {
    font-weight: 600;
    color: #333;
  }

  .ingredient-quantity {
    font-size: 0.9rem;
    color: #666;
  }

  .ingredient-price {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: #4caf50;
  }

  .remove-btn {
    background: #ff5252;
    padding: 4px 8px;
    font-size: 1rem;
  }

  .total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .total-amount {
    font-size: 1.8rem;
  }

  .empty-message {
    text-align: center;
    color: #999;
    padding: 20px;
  }

  .no-recipe-selected {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #999;
  }
</style>
