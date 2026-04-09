<script>
  let {
    ingredientsCost = 0,
    laborCost = 0,
    totalCost = 0
  } = $props();
</script>

<div class="total-bar">
  <div class="total-rows">
    <div class="total-row">
      <span class="row-label">Ingredientes</span>
      <span class="row-value">${(ingredientsCost || 0).toFixed(2)}</span>
    </div>
    {#if laborCost > 0}
      <div class="total-row muted">
        <span class="row-label">Mano de obra</span>
        <span class="row-value">${(laborCost || 0).toFixed(2)}</span>
      </div>
    {/if}
  </div>
  <div class="total-divider"></div>
  <div class="total-final">
    <span class="final-label">Costo Total</span>
    <span class="final-amount"><span class="currency">$</span>{(totalCost || 0).toFixed(2)}</span>
  </div>
</div>

<style>
.total-bar {
  padding: 18px 20px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  color: var(--color-foreground);
}

.total-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.total-row.muted {
  color: var(--color-muted-foreground);
}

.row-label {
  font-weight: 500;
}

.row-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.total-divider {
  height: 1px;
  background: var(--color-border);
  margin: 12px 0;
}

.total-final {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.final-label {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.final-amount {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.currency {
  font-size: 1rem;
  font-weight: 700;
  opacity: 0.7;
}
</style>
