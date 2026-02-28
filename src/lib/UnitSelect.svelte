<script>
  import { unitCategories, generateId } from './units.js';
  
  let { value = $bindable(''), label = 'Unidad' } = $props();
  
  // Generate unique ID for accessibility
  const selectId = generateId('unit-select');
</script>

<div class="unit-select-wrapper">
  <label class="unit-label" for={selectId}>{label}</label>
  <select id={selectId} bind:value class="unit-select" aria-label="Seleccionar unidad">
    <option value="" disabled>--</option>
    {#each unitCategories as category}
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
    font-size: 1rem;
    font-weight: 500;
    border: 2px solid var(--color-border);
    border-radius: var(--radius);
    background-color: var(--color-card);
    color: var(--color-foreground);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .unit-select:focus {
    outline: none;
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px rgba(229, 123, 132, 0.25);
  }
  
  .unit-select optgroup {
    font-weight: 600;
    color: var(--color-muted-foreground);
  }
  
  .unit-select option {
    padding: 8px;
  }
</style>
