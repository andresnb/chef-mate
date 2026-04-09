<script>
  let {
    onSignInWithGoogle = async () => {},
    onSignInWithEmail = async () => {},
    onCreateAccount = async () => {},
    error = '',
    isDarkMode = false,
    onToggleDarkMode = () => {}
  } = $props();

  let email = $state('');
  let password = $state('');
  let isSignUp = $state(false);
  let isSubmitting = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    isSubmitting = true;
    if (isSignUp) {
      await onCreateAccount(email, password);
    } else {
      await onSignInWithEmail(email, password);
    }
    isSubmitting = false;
  }

  async function handleGoogle() {
    isSubmitting = true;
    await onSignInWithGoogle();
    isSubmitting = false;
  }
</script>

<div class="login-screen">
  <button class="theme-toggle" onclick={() => onToggleDarkMode()} aria-label="Toggle dark mode">
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
  <div class="login-card">
    <div class="login-header">
      <span class="login-logo">&#x1F468;&#x200D;&#x1F373;</span>
      <h1 class="login-title">ChefMate</h1>
      <p class="login-subtitle">Calculadora de costos de recetas</p>
    </div>

    <button class="google-btn" onclick={handleGoogle} disabled={isSubmitting}>
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </button>

    <div class="divider">
      <span>o</span>
    </div>

    <form onsubmit={handleSubmit}>
      <div class="input-group">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          bind:value={email}
          placeholder="tu@email.com"
          autocomplete="email"
          required
        />
      </div>
      <div class="input-group">
        <label for="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          bind:value={password}
          placeholder="Min. 6 caracteres"
          autocomplete={isSignUp ? 'new-password' : 'current-password'}
          minlength="6"
          required
        />
      </div>

      {#if error}
        <div class="error-msg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      {/if}

      <button type="submit" class="submit-btn" disabled={isSubmitting || !email.trim() || !password.trim()}>
        {isSignUp ? 'Crear cuenta' : 'Iniciar sesion'}
      </button>
    </form>

    <button class="toggle-btn" onclick={() => { isSignUp = !isSignUp; }} type="button">
      {isSignUp ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}
    </button>
  </div>
</div>

<style>
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  background: var(--color-background);
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
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
  .theme-toggle:hover {
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border-color: var(--color-secondary);
  }
}

.theme-toggle:active {
  transform: scale(0.93);
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 36px 28px 28px;
  box-shadow: var(--shadow-lg);
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.login-logo {
  font-size: 3rem;
  display: block;
  margin-bottom: 8px;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: var(--color-muted-foreground);
  font-size: 0.88rem;
  margin: 4px 0 0;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 13px 16px;
  background: var(--color-background);
  color: var(--color-foreground);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.google-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.google-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: var(--color-muted-foreground);
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.input-group {
  margin-bottom: 14px;
}

.input-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--color-foreground);
}

.input-group input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  background: var(--color-background);
  color: var(--color-foreground);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
}

.input-group input::placeholder {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: hsl(var(--destructive) / 0.1);
  color: var(--color-destructive);
  border: 1px solid hsl(var(--destructive) / 0.2);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 14px;
}

.submit-btn {
  width: 100%;
  padding: 13px 16px;
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

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px hsl(var(--primary) / 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.toggle-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 8px;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.toggle-btn:hover {
  text-decoration: underline;
}
</style>
