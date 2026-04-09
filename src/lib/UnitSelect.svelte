<script>
  import { unitCategories, generateId, commercialUnits } from './units.js';

  let { value = $bindable(''), label = 'Unidad', defaultValue = '', onlyCommercial = false } = $props();

  const selectId = generateId('unit-select');

  const displayedUnits = $derived(onlyCommercial ? commercialUnits : unitCategories);

  $effect(() => {
    if (defaultValue && !value) {
      value = defaultValue;
    }
  });
</script>

<div class="unit-select-wrapper">
  <label class="unit-label" for={selectId}>{label}</label>
  <select id={selectId} bind:value class="unit-select" aria-label="Seleccionar unidad">
    <option value="" disabled>--</option>
    {#each displayedUnits as category}
      <optgroup label={category.name}>
        {#each category.units as unit}
          <option value={unit.value}>{unit.label}</option>
        {/each}
      </optgroup>
    {/each}
  </select>
</div>

<style>
  .unit-select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .unit-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .unit-select {
    width: 100%;
    height: 48px;
    padding: 0 12px;
    padding-right: 32px;
    font-size: 0.95rem;
    font-weight: 500;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-background);
    color: var(--color-foreground);
    cursor: pointer;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237d7168' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
  }

  .unit-select:focus {
    outline: none;
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
  }

  .unit-select optgroup {
    font-weight: 600;
    color: var(--color-muted-foreground);
  }

  .unit-select option {
    padding: 8px;
  }
</style>
