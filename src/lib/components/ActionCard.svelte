<script>
  let {
    icon = 'plus',
    title = '',
    subtitle = '',
    primary = false,
    onclick = () => {}
  } = $props();
</script>

<button
  class="action-card"
  class:primary
  onclick={(e) => onclick(e)}
>
  <span class="card-icon" class:primary>
    {#if icon === 'plus'}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    {:else if icon === 'book'}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    {:else}
      <span class="emoji-icon">{icon}</span>
    {/if}
  </span>
  <span class="card-text">
    <strong>{title}</strong>
    <small>{subtitle}</small>
  </span>
  <span class="card-arrow">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </span>
</button>

<style>
.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: left;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  color: var(--color-foreground);
  width: 100%;
}

@media (hover: hover) {
  .action-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }

  .action-card:hover .card-arrow {
    transform: translateX(3px);
    opacity: 1;
  }
}

.action-card:active {
  transform: scale(0.98);
}

.action-card.primary {
  background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
  color: var(--color-primary-foreground);
  border-color: transparent;
  box-shadow: var(--shadow-md), 0 4px 20px hsl(var(--primary) / 0.25);
}

.action-card.primary .card-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-card.primary .card-arrow {
  color: rgba(255, 255, 255, 0.7);
}

.action-card.primary small {
  opacity: 0.85;
}

.card-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.emoji-icon {
  font-size: 1.4rem;
}

.card-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 2px;
}

.card-text strong {
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.card-text small {
  color: var(--color-muted-foreground);
  font-size: 0.82rem;
}

.card-arrow {
  color: var(--color-muted-foreground);
  opacity: 0.5;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}
</style>
