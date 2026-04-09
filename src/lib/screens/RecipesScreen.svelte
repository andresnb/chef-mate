<script>
  import RecipeCard from '../components/RecipeCard.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  let {
    recipes = [],
    getTotal = () => 0,
    onSelectRecipe = () => {},
    onNavigate = () => {}
  } = $props();
</script>

<section class="screen recipes-screen">
  <div class="screen-header">
    <h2>Mis Recetas</h2>
    <p>{recipes.length} receta{recipes.length !== 1 ? 's' : ''} guardada{recipes.length !== 1 ? 's' : ''}</p>
  </div>

  <div class="recipes-list">
    {#each recipes as recipe, i (recipe.id)}
      <div class="recipe-item" style="animation-delay: {i * 50}ms">
        <RecipeCard
          {recipe}
          {getTotal}
          onClick={onSelectRecipe}
        />
      </div>
    {/each}

    {#if recipes.length === 0}
      <EmptyState
        message="No hay recetas aun"
        hint="Crea tu primera receta para empezar a calcular costos"
        actionText="Crear mi primera receta"
        onAction={() => onNavigate('create')}
      />
    {/if}
  </div>
</section>

<style>
  .screen {
    flex: 1;
    padding: 24px 20px;
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

  .screen-header {
    margin-bottom: 20px;
  }

  .screen-header h2 {
    font-size: 1.5rem;
    font-weight: 750;
    margin: 0 0 4px 0;
    color: var(--color-foreground);
    letter-spacing: -0.02em;
  }

  .screen-header p {
    color: var(--color-muted-foreground);
    margin: 0;
    font-size: 0.9rem;
  }

  .recipes-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recipe-item {
    animation: fadeUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  @media (max-width: 480px) {
    .screen {
      padding: 16px;
    }
  }
</style>
