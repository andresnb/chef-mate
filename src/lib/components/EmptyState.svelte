<script>
  let {
    message = 'No hay elementos',
    hint = '',
    actionText = '',
    onAction = null
  } = $props();
</script>

<div class="empty-state">
  <div class="empty-icon">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
  </div>
  <p class="empty-message">{message}</p>
  {#if hint}
    <p class="empty-hint">{hint}</p>
  {/if}
  {#if actionText && onAction}
    <button class="action-btn" onclick={(e) => onAction(e)}>
      {actionText}
    </button>
  {/if}
</div>

<style>
  .empty-state {
    text-align: center;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    opacity: 0.8;
  }

  .empty-message {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: var(--color-foreground);
  }

  .empty-hint {
    font-size: 0.85rem;
    color: var(--color-muted-foreground);
    margin: 0;
    max-width: 260px;
    line-height: 1.4;
  }

  .action-btn {
    margin-top: 20px;
    padding: 12px 24px;
    background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
    color: var(--color-primary-foreground);
    border: none;
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 650;
    cursor: pointer;
    box-shadow: 0 2px 12px hsl(var(--primary) / 0.25);
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px hsl(var(--primary) / 0.35);
    }
  }

  .action-btn:active {
    transform: scale(0.97);
  }
</style>
