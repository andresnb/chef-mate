import { onMount } from "svelte";

/**
 * Composable para memoria de compras - guarda info de contenedor/precio
 * para sugerir al usuario cuando vuelva a usar el mismo ingrediente.
 */
export function usePurchases() {
  let purchases = $state([]);
  let isInitialized = $state(false);

  $effect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("chefmate-purchases", JSON.stringify(purchases));
    } catch (e) {
      // Silently fail in private browsing mode
    }
  });

  onMount(() => {
    try {
      const saved = localStorage.getItem("chefmate-purchases");
      if (saved) {
        const parsed = JSON.parse(saved);
        purchases = Array.isArray(parsed)
          ? parsed.filter((p) => p && p.id && p.productName)
          : [];
      }
    } catch (e) {
      purchases = [];
    }
    isInitialized = true;
  });

  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  function normalize(str) {
    return (str || "").trim().toLowerCase();
  }

  /**
   * Busca compras por nombre de producto (case-insensitive).
   * Retorna [] si query tiene menos de 2 caracteres.
   * Resultados ordenados por lastUsedAt descendente.
   */
  function searchByName(query) {
    const q = normalize(query);
    if (q.length < 2) return [];

    return purchases
      .filter((p) => normalize(p.productName).includes(q))
      .sort((a, b) => (b.lastUsedAt || "").localeCompare(a.lastUsedAt || ""));
  }

  /**
   * Agrega una compra. Si ya existe un duplicado exacto (mismos 6 campos),
   * solo actualiza lastUsedAt.
   */
  function addPurchase({
    productName,
    containerQuantity,
    containerUnit,
    containerPrice,
    brand = "",
    store = "",
  }) {
    const now = new Date().toISOString();

    // Buscar duplicado exacto
    const existing = purchases.find(
      (p) =>
        normalize(p.productName) === normalize(productName) &&
        normalize(p.containerQuantity) === normalize(containerQuantity) &&
        normalize(p.containerUnit) === normalize(containerUnit) &&
        Number(p.containerPrice) === Number(containerPrice) &&
        normalize(p.brand) === normalize(brand) &&
        normalize(p.store) === normalize(store),
    );

    if (existing) {
      existing.lastUsedAt = now;
      purchases = [...purchases]; // trigger reactivity
      return existing;
    }

    const newPurchase = {
      id: generateId(),
      productName: productName.trim(),
      containerQuantity: String(containerQuantity).trim(),
      containerUnit,
      containerPrice: Number(containerPrice),
      brand: (brand || "").trim(),
      store: (store || "").trim(),
      createdAt: now,
      lastUsedAt: now,
    };

    purchases = [...purchases, newPurchase];
    return newPurchase;
  }

  /**
   * Actualiza lastUsedAt de una compra existente.
   */
  function updatePurchaseUsage(id) {
    const purchase = purchases.find((p) => p.id === id);
    if (purchase) {
      purchase.lastUsedAt = new Date().toISOString();
      purchases = [...purchases]; // trigger reactivity
    }
  }

  /**
   * Elimina una compra por ID.
   */
  function removePurchase(id) {
    purchases = purchases.filter((p) => p.id !== id);
  }

  /**
   * Limpia todo el historial de compras.
   */
  function clearAll() {
    purchases = [];
  }

  return {
    get purchases() {
      return purchases;
    },
    get count() {
      return purchases.length;
    },
    searchByName,
    addPurchase,
    updatePurchaseUsage,
    removePurchase,
    clearAll,
  };
}
