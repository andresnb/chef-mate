<script>
  import ActionCard from '../components/ActionCard.svelte';

  let {
    recipes = [],
    onNavigate = () => {}
  } = $props();
</script>

<section class="screen home-screen">
  <div class="hero">
    <div class="hero-badge">Tu cocina, tus costos</div>
    <h2>Calculadora de<br/><span class="gradient-text">Costos de Recetas</span></h2>
    <p>Crea recetas, suma ingredientes y descubri exactamente cuanto te cuesta cada preparacion.</p>
  </div>

  <div class="action-cards">
    <ActionCard
      icon="plus"
      title="Nueva Receta"
      subtitle="Crear una receta desde cero"
      primary={true}
      onclick={() => onNavigate('create')}
    />

    <ActionCard
      icon="book"
      title="Mis Recetas"
      subtitle="{recipes.length} recetas guardadas"
      onclick={() => onNavigate('recipes')}
    />
  </div>

  {#if recipes.length > 0}
    <div class="quick-stats">
      <div class="stat">
        <span class="stat-number">{recipes.length}</span>
        <span class="stat-label">Recetas</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-number">{recipes.reduce((sum, r) => sum + (r.ingredients?.length || 0), 0)}</span>
        <span class="stat-label">Ingredientes</span>
      </div>
    </div>
  {/if}
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

  .hero {
    text-align: center;
    padding: 32px 8px 40px;
  }

  .hero-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .hero h2 {
    font-size: 1.85rem;
    font-weight: 800;
    margin: 0 0 12px 0;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--color-foreground);
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    color: var(--color-muted-foreground);
    font-size: 0.95rem;
    margin: 0;
    line-height: 1.5;
    max-width: 320px;
    margin-inline: auto;
  }

  .action-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .quick-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 32px;
    padding: 16px 24px;
    background: var(--color-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-xs);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-divider {
    width: 1px;
    height: 32px;
    background: var(--color-border);
  }

  @media (max-width: 480px) {
    .screen {
      padding: 16px;
    }

    .hero {
      padding: 24px 4px 32px;
    }

    .hero h2 {
      font-size: 1.6rem;
    }
  }
</style>
