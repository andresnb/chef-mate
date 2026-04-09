<script>
  import { getUnitByValue } from '../units.js';

  let {
    ingredient,
    displayPrice = '0.00',
    onRemove = () => {}
  } = $props();
</script>

<div class="ingredient-item">
  <div class="ingredient-info">
    <span class="ingredient-name">{ingredient.name}</span>
    <span class="ingredient-quantity">
      {ingredient.quantity || '—'}{ingredient.unit ? ` ${getUnitByValue(ingredient.unit)?.label || ingredient.unit}` : ''}
      {#if ingredient.containerQuantity && ingredient.containerUnit}
        <span class="container-info"> / {ingredient.containerQuantity} {getUnitByValue(ingredient.containerUnit)?.label || ingredient.containerUnit}</span>
      {/if}
    </span>
  </div>
  <div class="ingredient-right">
    <span class="ingredient-price"><span class="currency">$</span>{displayPrice}</span>
    <button class="remove-btn" onclick={() => onRemove(ingredient.id)} aria-label="Eliminar ingrediente">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</div>

<style>
.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--color-card);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-fast);
}

@media (hover: hover) {
  .ingredient-item:hover {
    border-color: hsl(var(--primary) / 0.3);
    box-shadow: var(--shadow-sm);
  }

  .ingredient-item:hover .remove-btn {
    opacity: 1;
  }
}

.ingredient-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ingredient-name {
  font-weight: 600;
  color: var(--color-foreground);
  font-size: 0.92rem;
  letter-spacing: -0.01em;
}

.ingredient-quantity {
  font-size: 0.78rem;
  color: var(--color-muted-foreground);
}

.container-info {
  opacity: 0.7;
}

.ingredient-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.ingredient-price {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.currency {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
}

.remove-btn {
  width: 30px;
  height: 30px;
  background: hsl(var(--destructive) / 0.1);
  color: var(--color-destructive);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  opacity: 0.7;
}

@media (hover: hover) {
  .remove-btn:hover {
    background: var(--color-destructive);
    color: var(--color-destructive-foreground);
  }
}

.remove-btn:active {
  transform: scale(0.9);
}
</style>
