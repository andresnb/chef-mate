<script>
  let { toasts = [], onDismiss = () => {} } = $props();
</script>

{#if toasts.length > 0}
  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <div class="toast toast-{toast.type}" role="status" aria-live="polite">
        <span class="toast-icon">
          {#if toast.type === 'success'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          {:else if toast.type === 'error'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          {/if}
        </span>
        <span class="toast-message">{toast.message}</span>
        <button class="toast-close" onclick={() => onDismiss(toast.id)} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 400px;
    padding: 0 16px;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    animation: toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: auto;
    font-size: 0.88rem;
    font-weight: 550;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.92);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .toast-success {
    background: var(--color-success);
    color: var(--color-success-foreground);
  }

  .toast-error {
    background: var(--color-destructive);
    color: var(--color-destructive-foreground);
  }

  .toast-warning {
    background: var(--color-warning);
    color: var(--color-warning-foreground);
  }

  .toast-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .toast-message {
    flex: 1;
    line-height: 1.3;
  }

  .toast-close {
    background: none;
    border: none;
    color: inherit;
    opacity: 0.6;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    transition: all var(--transition-fast);
  }

  .toast-close:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
  }
</style>
