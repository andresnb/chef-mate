<script>
  import { fractionButtons, generateId } from './units.js';
  
  let { value = $bindable(''), label = 'Cantidad', showFractions = true } = $props();
  
  // Generate unique ID for accessibility
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
  
  // Let oninput handle sanitization - just allow modifier keys and navigation
  
  function handleInput() {
    // Sanitize: keep only allowed characters
    const allowed = /^[\d\s½¼¾⅓⅔⅛]*$/;
    if (!allowed.test(value)) {
      value = value.replace(/[^\d\s½¼¾⅓⅔⅛]/g, '');
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
    border-radius: var(--radius);
    background: var(--color-card);
    color: var(--color-foreground);
    text-align: center;
    font-weight: 500;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .qty-field:focus {
    outline: none;
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px rgba(229, 123, 132, 0.25);
  }
  
  .qty-field::placeholder {
    color: var(--color-muted-foreground);
    opacity: 0.7;
  }
  
  .fraction-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .frac-btn {
    min-width: 40px;
    height: 36px;
    padding: 0 8px;
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-card);
    color: var(--color-foreground);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .frac-btn:hover {
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    border-color: var(--color-primary);
  }
  
  .frac-btn:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 380px) {
    .frac-btn {
      min-width: 32px;
      height: 32px;
      font-size: 0.875rem;
      padding: 0 4px;
    }
  }
</style>
