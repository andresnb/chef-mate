/**
 * Composable para manejar notificaciones toast
 */
export function useToast() {
  let toasts = $state([]);
  let nextId = 0;

  function show(message, type = 'success', duration = 3000) {
    const id = nextId++;
    toasts = [...toasts, { id, message, type, visible: true }];

    setTimeout(() => {
      dismiss(id);
    }, duration);
  }

  function dismiss(id) {
    toasts = toasts.filter(t => t.id !== id);
  }

  function success(message, duration) {
    show(message, 'success', duration);
  }

  function error(message, duration) {
    show(message, 'error', duration);
  }

  function warning(message, duration) {
    show(message, 'warning', duration);
  }

  return {
    get toasts() { return toasts; },
    show,
    dismiss,
    success,
    error,
    warning
  };
}
