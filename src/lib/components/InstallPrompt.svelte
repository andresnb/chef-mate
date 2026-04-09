<script>
  import { onMount } from 'svelte';

  let showBanner = $state(false);
  let deferredPrompt = $state(null);
  let isIOS = $state(false);
  let isStandalone = $state(false);

  onMount(() => {
    // Check if already installed (standalone mode)
    isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;

    if (isStandalone) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem('chefmate-install-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < sevenDays) return;
    }

    // Detect iOS Safari
    const ua = navigator.userAgent;
    isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // Show iOS instructions after a short delay
      setTimeout(() => { showBanner = true; }, 2000);
      return;
    }

    // Chrome/Edge: listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Hide if app gets installed
    window.addEventListener('appinstalled', () => {
      showBanner = false;
      deferredPrompt = null;
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  });

  function handleBeforeInstall(e) {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => { showBanner = true; }, 1500);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showBanner = false;
    }
    deferredPrompt = null;
  }

  function handleDismiss() {
    showBanner = false;
    localStorage.setItem('chefmate-install-dismissed', String(Date.now()));
  }
</script>

{#if showBanner}
  <div class="install-banner" role="alert">
    <div class="install-content">
      <div class="install-icon">&#x1F468;&#x200D;&#x1F373;</div>
      <div class="install-text">
        {#if isIOS}
          <strong>Instala ChefMate</strong>
          <span class="install-hint">
            Toca
            <svg class="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            y luego "Agregar a inicio"
          </span>
        {:else}
          <strong>Instala ChefMate</strong>
          <span class="install-hint">Acceso rapido desde tu pantalla</span>
        {/if}
      </div>
    </div>
    <div class="install-actions">
      {#if !isIOS && deferredPrompt}
        <button class="install-btn" onclick={handleInstall}>Instalar</button>
      {/if}
      <button class="dismiss-btn" onclick={handleDismiss} aria-label="Cerrar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
.install-banner {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1500;
  width: calc(100% - 32px);
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.install-content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.install-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  line-height: 1;
}

.install-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.install-text strong {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-foreground);
  letter-spacing: -0.01em;
}

.install-hint {
  font-size: 0.78rem;
  color: var(--color-muted-foreground);
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
}

.share-icon {
  display: inline-block;
  vertical-align: middle;
  color: var(--color-primary);
  flex-shrink: 0;
}

.install-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.install-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
  color: var(--color-primary-foreground);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

@media (hover: hover) {
  .install-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px hsl(var(--primary) / 0.3);
  }
}

.install-btn:active {
  transform: scale(0.96);
}

.dismiss-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-muted-foreground);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  opacity: 0.6;
}

.dismiss-btn:hover {
  opacity: 1;
  background: var(--color-muted);
}
</style>
