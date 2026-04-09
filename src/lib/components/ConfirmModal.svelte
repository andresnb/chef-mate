<script>
  let {
    show = false,
    title = 'Estas seguro?',
    message = '',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    destructive = false,
    onConfirm = () => {},
    onCancel = () => {}
  } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onCancel();
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }
</script>

{#if show}
  <div
    class="confirm-overlay"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
    aria-describedby="confirm-message"
    tabindex="-1"
  >
    <div class="confirm-content">
      <div class="confirm-icon" class:destructive>
        {#if destructive}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        {:else}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        {/if}
      </div>
      <h3 id="confirm-title">{title}</h3>
      {#if message}
        <p id="confirm-message">{message}</p>
      {/if}
      <div class="confirm-actions">
        <button class="confirm-btn cancel-btn" onclick={() => onCancel()}>
          {cancelText}
        </button>
        <button
          class="confirm-btn action-btn"
          class:destructive
          onclick={() => onConfirm()}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
    padding: 20px;
    animation: overlayIn 0.15s ease;
  }

  @keyframes overlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .confirm-content {
    background: var(--color-card);
    border-radius: var(--radius-xl);
    padding: 28px 24px 24px;
    width: 100%;
    max-width: 340px;
    box-shadow: var(--shadow-xl);
    animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: var(--color-foreground);
    text-align: center;
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .confirm-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .confirm-icon.destructive {
    background: hsl(var(--destructive) / 0.12);
    color: var(--color-destructive);
  }

  .confirm-content h3 {
    margin: 0 0 8px 0;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .confirm-content p {
    margin: 0 0 24px 0;
    color: var(--color-muted-foreground);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .confirm-actions {
    display: flex;
    gap: 10px;
  }

  .confirm-btn {
    flex: 1;
    padding: 13px 16px;
    border: none;
    border-radius: var(--radius);
    font-size: 0.92rem;
    font-weight: 650;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .confirm-btn:active {
    transform: scale(0.97);
  }

  .cancel-btn {
    background: var(--color-muted);
    color: var(--color-foreground);
  }

  @media (hover: hover) {
    .cancel-btn:hover {
      background: var(--color-border);
    }
  }

  .action-btn {
    background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
    color: var(--color-primary-foreground);
    box-shadow: 0 2px 8px hsl(var(--primary) / 0.2);
  }

  .action-btn.destructive {
    background: var(--color-destructive);
    box-shadow: 0 2px 8px hsl(var(--destructive) / 0.25);
  }
</style>
