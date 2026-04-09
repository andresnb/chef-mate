<script>
  let {
    show = false,
    title = '',
    onClose = () => {},
    children
  } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

{#if show}
  <div
    class="modal-overlay"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <div class="modal-content" role="presentation" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button class="modal-close" onclick={(e) => onClose(e)} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
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
    z-index: 1000;
    padding: 20px;
    animation: overlayIn 0.2s ease;
  }

  @keyframes overlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: var(--color-card);
    border-radius: var(--radius-xl);
    padding: 24px;
    width: 100%;
    max-width: 400px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-xl);
    animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: var(--color-foreground);
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .modal-close {
    width: 34px;
    height: 34px;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .modal-close:hover {
      background: var(--color-muted);
      color: var(--color-foreground);
    }
  }

  .modal-close:active {
    transform: scale(0.93);
  }
</style>
