<script>
  import { formatDate } from '../utils/format.js';

  let {
    recipe,
    onClick = () => {},
    getTotal = () => 0
  } = $props();

  let total = $derived((getTotal(recipe.ingredients || []) || 0).toFixed(2));
  let ingredientCount = $derived(recipe.ingredients?.length || 0);
</script>

<button class="recipe-card" onclick={() => onClick(recipe)}>
  <div class="recipe-left">
    <div class="recipe-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    </div>
    <div class="recipe-info">
      <span class="recipe-name">{recipe.name}</span>
      <span class="recipe-meta">
        {ingredientCount} ingrediente{ingredientCount !== 1 ? 's' : ''}
        <span class="meta-dot"></span>
        {formatDate(recipe.createdAt)}
      </span>
    </div>
  </div>
  <div class="recipe-total">
    <span class="total-currency">$</span>{total}
  </div>
</button>

<style>
.recipe-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: left;
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-fast);
  width: 100%;
}

@media (hover: hover) {
  .recipe-card:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }

  .recipe-card:hover .recipe-avatar {
    background: var(--color-primary);
    color: var(--color-primary-foreground);
  }
}

.recipe-card:active {
  transform: scale(0.98);
}

.recipe-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.recipe-avatar {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.recipe-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.recipe-name {
  font-weight: 650;
  font-size: 0.95rem;
  color: var(--color-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.recipe-meta {
  font-size: 0.78rem;
  color: var(--color-muted-foreground);
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-muted-foreground);
  opacity: 0.5;
}

.recipe-total {
  font-weight: 750;
  font-size: 1.15rem;
  color: var(--color-primary);
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.total-currency {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.7;
}
</style>
