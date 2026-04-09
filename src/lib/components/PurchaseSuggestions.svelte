<script>
  import { getUnitByValue } from '../units.js';

  let {
    suggestions = [],
    visible = false,
    onSelect = () => {},
    onDismiss = () => {}
  } = $props();

  let highlightedIndex = $state(-1);

  // Reset highlight when suggestions change
  $effect(() => {
    if (suggestions.length) {
      highlightedIndex = -1;
    }
  });

  function handleKeydown(e) {
    if (!visible || suggestions.length === 0) return;

    const totalItems = suggestions.length + 1; // +1 for "Agregar nuevo"

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % totalItems;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = highlightedIndex <= 0 ? totalItems - 1 : highlightedIndex - 1;
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      if (highlightedIndex < suggestions.length) {
        onSelect(suggestions[highlightedIndex]);
      } else {
        onDismiss();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onDismiss();
    }
  }

  function getUnitLabel(unitValue) {
    const unit = getUnitByValue(unitValue);
    return unit?.label || unitValue;
  }

  function formatMeta(purchase) {
    const parts = [];
    if (purchase.brand) parts.push(purchase.brand);
    if (purchase.store) parts.push(purchase.store);
    return parts.join(' - ');
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible && suggestions.length > 0}
  <div class="suggestions-dropdown" role="listbox" aria-label="Sugerencias de compras">
    {#each suggestions as purchase, i (purchase.id)}
      <button
        class="suggestion-item"
        class:highlighted={highlightedIndex === i}
        role="option"
        aria-selected={highlightedIndex === i}
        onclick={() => onSelect(purchase)}
        onmouseenter={() => highlightedIndex = i}
      >
        <div class="suggestion-main">
          <span class="suggestion-name">{purchase.productName}</span>
          <span class="suggestion-price">
            {purchase.containerQuantity} {getUnitLabel(purchase.containerUnit)}
            <span class="price-value">${purchase.containerPrice.toFixed(2)}</span>
          </span>
        </div>
        {#if purchase.brand || purchase.store}
          <div class="suggestion-meta">{formatMeta(purchase)}</div>
        {/if}
      </button>
    {/each}

    <button
      class="suggestion-item suggestion-new"
      class:highlighted={highlightedIndex === suggestions.length}
      role="option"
      aria-selected={highlightedIndex === suggestions.length}
      onclick={() => onDismiss()}
      onmouseenter={() => highlightedIndex = suggestions.length}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Agregar nuevo
    </button>
  </div>
{/if}

<style>
.suggestions-dropdown {
  position: relative;
  z-index: 50;
  margin-top: 8px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  max-height: 240px;
  overflow-y: auto;
  animation: dropIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: var(--color-foreground);
  font-size: 0.92rem;
  transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-border);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item.highlighted {
  background: var(--color-secondary);
}

.suggestion-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.suggestion-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  letter-spacing: -0.01em;
}

.suggestion-price {
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  white-space: nowrap;
  flex-shrink: 0;
}

.price-value {
  font-weight: 700;
  color: var(--color-primary);
  margin-left: 6px;
  font-size: 0.92rem;
}

.suggestion-meta {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  opacity: 0.8;
}

.suggestion-new {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 12px 16px;
}
</style>
