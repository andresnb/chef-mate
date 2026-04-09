<script>
  /** @type {{ title?: string, showBackButton?: boolean, isDarkMode?: boolean, onBack?: () => void, onToggleDarkMode?: () => void, onOpenSettings?: () => void }} */
  let {
    title = 'ChefMate',
    showBackButton = false,
    isDarkMode = false,
    onBack = () => {},
    onToggleDarkMode = () => {},
    onOpenSettings = () => {}
  } = $props();
</script>

<header>
  <div class="header-content">
    <div class="header-left">
      {#if showBackButton}
        <button class="icon-btn back-btn" onclick={onBack} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
        </button>
      {/if}
      <h1>
        <span class="logo-icon">&#x1F468;&#x200D;&#x1F373;</span>
        <span class="logo-text">{title}</span>
      </h1>
    </div>
    <div class="header-actions">
      <button class="icon-btn" onclick={onToggleDarkMode} aria-label="Toggle dark mode">
        {#if isDarkMode}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>
      <button class="icon-btn" onclick={onOpenSettings} aria-label="Settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>
  </div>
</header>

<style>
header {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--glass-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 480px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

header h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-foreground);
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.02em;
}

.logo-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.logo-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  border-radius: var(--radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
  transition: all var(--transition-fast);
}

@media (hover: hover) {
  .icon-btn:hover {
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border-color: var(--color-secondary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
}

.icon-btn:active {
  transform: scale(0.93);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.back-btn {
  margin-right: 4px;
}
</style>
