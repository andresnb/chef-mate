<script>
  import Modal from './Modal.svelte';
  import ConfirmModal from './ConfirmModal.svelte';

  let {
    show = false,
    userSettings = { hourlyRate: 0 },
    onClose = () => {},
    onSave = () => {},
    purchaseCount = 0,
    onClearPurchases = () => {},
    user = null,
    onSignOut = () => {}
  } = $props();

  let localHourlyRate = $state(0);
  let showClearConfirm = $state(false);

  $effect(() => {
    if (show) {
      localHourlyRate = userSettings.hourlyRate || 0;
    }
  });

  function handleClearConfirm() {
    showClearConfirm = false;
    onClearPurchases();
  }
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

  <!-- Purchases section -->
  <div class="settings-section purchases-section">
    <div class="purchases-header">
      <span class="settings-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        Compras guardadas
      </span>
      <span class="purchase-count">{purchaseCount}</span>
    </div>
    <small class="settings-hint">
      Precios de productos que se sugieren automaticamente al agregar ingredientes
    </small>
    {#if purchaseCount > 0}
      <button class="clear-btn" onclick={() => showClearConfirm = true}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        Borrar historial de compras
      </button>
    {/if}
  </div>

  <button class="save-btn" onclick={() => { onSave({ hourlyRate: localHourlyRate }); onClose(); }}>
    Guardar ajustes
  </button>

  <!-- Account section -->
  {#if user}
    <div class="settings-section account-section">
      <div class="account-info">
        <div class="account-avatar">
          {#if user.photoURL}
            <img src={user.photoURL} alt="" class="avatar-img" referrerpolicy="no-referrer" />
          {:else}
            <span class="avatar-initial">{(user.displayName || user.email || '?')[0].toUpperCase()}</span>
          {/if}
        </div>
        <div class="account-details">
          {#if user.displayName}
            <span class="account-name">{user.displayName}</span>
          {/if}
          <span class="account-email">{user.email}</span>
        </div>
      </div>
      <button class="signout-btn" onclick={() => onSignOut()}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar sesion
      </button>
    </div>
  {/if}
</Modal>

<ConfirmModal
  show={showClearConfirm}
  title="Borrar historial"
  message="Se eliminaran todas las compras guardadas ({purchaseCount}). Los ingredientes en tus recetas no se veran afectados."
  confirmText="Borrar todo"
  destructive={true}
  onConfirm={handleClearConfirm}
  onCancel={() => showClearConfirm = false}
/>

<style>
  .settings-section {
    margin-bottom: 24px;
  }

  .settings-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 0.92rem;
    color: var(--color-foreground);
  }

  .purchases-section {
    padding-top: 20px;
    border-top: 1px solid var(--color-border);
  }

  .purchases-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .purchase-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 8px;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .clear-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 14px;
    margin-top: 12px;
    background: hsl(var(--destructive) / 0.08);
    color: var(--color-destructive);
    border: 1px solid hsl(var(--destructive) / 0.15);
    border-radius: var(--radius);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .clear-btn:hover {
      background: hsl(var(--destructive) / 0.15);
      border-color: hsl(var(--destructive) / 0.3);
    }
  }

  .clear-btn:active {
    transform: scale(0.98);
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
    margin-top: 4px;
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

  /* Account section */
  .account-section {
    padding-top: 20px;
    border-top: 1px solid var(--color-border);
  }

  .account-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .account-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-initial {
    font-size: 1rem;
    font-weight: 700;
  }

  .account-details {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .account-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--color-foreground);
  }

  .account-email {
    font-size: 0.78rem;
    color: var(--color-muted-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .signout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 14px;
    background: var(--color-muted);
    color: var(--color-foreground);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .signout-btn:hover {
      background: var(--color-border);
    }
  }

  .signout-btn:active {
    transform: scale(0.98);
  }
</style>
