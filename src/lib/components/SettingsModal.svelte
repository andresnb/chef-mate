<script>
  import Modal from './Modal.svelte';

  let {
    show = false,
    userSettings = { hourlyRate: 0 },
    onClose = () => {},
    onSave = () => {}
  } = $props();

  let localHourlyRate = $state(0);

  $effect(() => {
    if (show) {
      localHourlyRate = userSettings.hourlyRate || 0;
    }
  });
</script>

<Modal {show} title="Ajustes" onClose={onClose}>
  <div class="settings-section">
    <label class="settings-label" for="hourly-rate">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      Valor de tu hora de trabajo
    </label>
    <div class="input-wrapper">
      <span class="input-prefix">$</span>
      <input
        id="hourly-rate"
        type="number"
        bind:value={localHourlyRate}
        placeholder="0.00"
        step="0.01"
        min="0"
        class="settings-input"
      />
    </div>
    <small class="settings-hint">
      Se usa para calcular el costo de mano de obra en tus recetas
    </small>
  </div>

  <button class="save-btn" onclick={() => { onSave({ hourlyRate: localHourlyRate }); onClose(); }}>
    Guardar ajustes
  </button>
</Modal>

<style>
  .settings-section {
    margin-bottom: 24px;
  }

  .settings-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 0.92rem;
    color: var(--color-foreground);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-prefix {
    position: absolute;
    left: 16px;
    color: var(--color-muted-foreground);
    font-weight: 600;
    font-size: 1rem;
    pointer-events: none;
  }

  .settings-input {
    width: 100%;
    padding: 14px 16px 14px 32px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius);
    font-size: 1rem;
    background: var(--color-background);
    color: var(--color-foreground);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .settings-input:focus {
    outline: none;
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
  }

  .settings-hint {
    display: block;
    margin-top: 8px;
    color: var(--color-muted-foreground);
    font-size: 0.78rem;
    line-height: 1.4;
  }

  .save-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
    color: var(--color-primary-foreground);
    border: none;
    border-radius: var(--radius);
    font-size: 0.92rem;
    font-weight: 650;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: 0 2px 12px hsl(var(--primary) / 0.2);
  }

  @media (hover: hover) {
    .save-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px hsl(var(--primary) / 0.3);
    }
  }

  .save-btn:active {
    transform: scale(0.98);
  }
</style>
