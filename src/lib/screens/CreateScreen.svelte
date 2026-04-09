<script>
  import { validateRecipeName } from '../utils/validation.js';

  let {
    recipeName = $bindable(''),
    onNameChange = () => {},
    onSubmit = () => {}
  } = $props();

  let nameError = $derived(
    recipeName.trim() === '' && recipeName.length > 0
      ? 'El nombre no puede estar vacio'
      : ''
  );

  let isValid = $derived(recipeName.trim().length > 0);

  function handleSubmit(e) {
    e.preventDefault();
    const validation = validateRecipeName(recipeName);
    if (validation.valid) {
      onSubmit(recipeName);
    }
  }
</script>

<section class="screen create-screen">
  <div class="screen-header">
    <h2>Nueva Receta</h2>
    <p>Dale un nombre a tu creacion</p>
  </div>

  <form class="create-form" onsubmit={handleSubmit}>
    <div class="input-group">
      <label for="recipe-name">Nombre de la receta</label>
      <input
        id="recipe-name"
        type="text"
        bind:value={recipeName}
        placeholder="Ej: Torta de Chocolate"
        autocomplete="off"
      />
      {#if nameError}
        <small class="error-text">{nameError}</small>
      {/if}
    </div>

    <button type="submit" class="submit-btn" class:disabled={!isValid}>
      <span>Crear y agregar ingredientes</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/>
        <path d="M12 5l7 7-7 7"/>
      </svg>
    </button>
  </form>
</section>

<style>
  .screen {
    flex: 1;
    padding: 24px 20px;
    animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .screen-header {
    margin-bottom: 24px;
  }

  .screen-header h2 {
    font-size: 1.5rem;
    font-weight: 750;
    margin: 0 0 4px 0;
    color: var(--color-foreground);
    letter-spacing: -0.02em;
  }

  .screen-header p {
    color: var(--color-muted-foreground);
    margin: 0;
    font-size: 0.9rem;
  }

  .create-form {
    background: var(--color-card);
    padding: 24px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
    color: var(--color-foreground);
  }

  .input-group {
    margin-bottom: 24px;
  }

  .input-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: var(--color-foreground);
  }

  input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius);
    font-size: 1rem;
    background: var(--color-background);
    color: var(--color-foreground);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  input:focus {
    outline: none;
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
  }

  input::placeholder {
    color: var(--color-muted-foreground);
    opacity: 0.6;
  }

  .submit-btn {
    width: 100%;
    padding: 15px 20px;
    background: linear-gradient(135deg, var(--color-primary), hsl(var(--primary) / 0.85));
    color: var(--color-primary-foreground);
    border: none;
    border-radius: var(--radius);
    font-size: 0.95rem;
    font-weight: 650;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all var(--transition-fast);
    box-shadow: 0 2px 12px hsl(var(--primary) / 0.25);
  }

  @media (hover: hover) {
    .submit-btn:hover:not(.disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px hsl(var(--primary) / 0.35);
    }
  }

  .submit-btn:active:not(.disabled) {
    transform: scale(0.98);
  }

  .submit-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }

  .error-text {
    color: var(--color-destructive);
    font-size: 0.82rem;
    margin-top: 6px;
    display: block;
  }

  @media (max-width: 480px) {
    .screen {
      padding: 16px;
    }
  }
</style>
