<script>
  import { fractionButtons, generateId } from './units.js';

  let { value = $bindable(''), label = 'Cantidad', showFractions = true } = $props();

  const inputId = generateId('qty-input');

  function insertFraction(frac) {
    if (!value) {
      value = frac;
    } else if (value.match(/[\d\s]$/)) {
      value = value + ' ' + frac;
    } else {
      value = value + frac;
    }
  }

  function handleInput() {
    // Convert comma to period for decimal support
    value = value.replace(/,/g, '.');
    // Remove invalid chars
    value = value.replace(/[^\d\s.½¼¾⅓⅔⅛]/g, '');
    // Allow only one dot
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
  }

  function handleFocus(e) {
    if (value === '0' || value === '0.0' || value === '0.00') {
      value = '';
    } else if (value) {
      e.currentTarget.select();
    }
  }
</script>

<div class="quantity-input" role="group" aria-label="Cantidad con fracciones">
  <label class="qty-label" for={inputId}>{label}</label>
  <input
    id={inputId}
    type="text"
    bind:value
    placeholder="0"
    class="qty-field"
    inputmode="decimal"
    oninput={handleInput}
    onfocus={handleFocus}
  />

  {#if showFractions}
    <div class="fraction-buttons">
      {#each fractionButtons as frac}
        <button
          type="button"
          class="frac-btn"
          aria-label="Agregar {frac.display}"
          onclick={() => insertFraction(frac.value)}
        >
          {frac.display}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .quantity-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .qty-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .qty-field {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    font-size: 1.1rem;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-background);
    color: var(--color-foreground);
    text-align: center;
    font-weight: 500;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .qty-field:focus {
    outline: none;
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
  }

  .qty-field::placeholder {
    color: var(--color-muted-foreground);
    opacity: 0.5;
  }

  .fraction-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .frac-btn {
    min-width: 38px;
    height: 32px;
    padding: 0 6px;
    font-size: 0.95rem;
    font-weight: 600;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-card);
    color: var(--color-foreground);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .frac-btn:hover {
      background: var(--color-primary);
      color: var(--color-primary-foreground);
      border-color: var(--color-primary);
    }
  }

  .frac-btn:active {
    transform: scale(0.93);
  }

  @media (max-width: 380px) {
    .frac-btn {
      min-width: 32px;
      height: 30px;
      font-size: 0.85rem;
      padding: 0 4px;
    }
  }
</style>
