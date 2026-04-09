import {
  subscribePurchases,
  addPurchaseDoc,
  updatePurchaseDoc,
  deletePurchaseDoc,
  deleteAllPurchases,
} from "../firebase/firestore.js";
import { serverTimestamp } from "firebase/firestore";

/**
 * Composable para memoria de compras.
 * @param {{ user: { uid: string } | null }} authState
 */
export function usePurchases(authState) {
  let purchases = $state([]);
  /** @type {(() => void) | null} */
  let unsubscribe = null;

  $effect(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    if (authState?.user?.uid) {
      const uid = authState.user.uid;
      unsubscribe = subscribePurchases(uid, (/** @type {any[]} */ data) => {
        purchases = data;
      });
    } else {
      purchases = [];
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };
  });

  /**
   * @param {string} str
   */
  function normalize(str) {
    return (str || "").trim().toLowerCase();
  }

  /**
   * Busca compras por nombre de producto (case-insensitive).
   * @param {string} query
   */
  function searchByName(query) {
    const q = normalize(query);
    if (q.length < 2) return [];

    return purchases
      .filter((/** @type {any} */ p) => normalize(p.productName).includes(q))
      .sort((/** @type {any} */ a, /** @type {any} */ b) =>
        (b.lastUsedAt || "").toString().localeCompare((a.lastUsedAt || "").toString()),
      );
  }

  /**
   * Agrega una compra. Deduplica si ya existe una identica.
   * @param {{ productName: string, containerQuantity: string, containerUnit: string, containerPrice: number, brand?: string, store?: string }} data
   */
  async function addPurchase(data) {
    if (!authState?.user?.uid) return null;
    const uid = authState.user.uid;

    const { productName, containerQuantity, containerUnit, containerPrice, brand = "", store = "" } = data;

    // Check for exact duplicate in local state
    const existing = purchases.find(
      (/** @type {any} */ p) =>
        normalize(p.productName) === normalize(productName) &&
        normalize(p.containerQuantity) === normalize(containerQuantity) &&
        normalize(p.containerUnit) === normalize(containerUnit) &&
        Number(p.containerPrice) === Number(containerPrice) &&
        normalize(p.brand) === normalize(brand) &&
        normalize(p.store) === normalize(store),
    );

    if (existing) {
      await updatePurchaseDoc(uid, existing.id, { lastUsedAt: serverTimestamp() });
      return existing;
    }

    const id = await addPurchaseDoc(uid, data);
    return { id, ...data };
  }

  /**
   * Actualiza lastUsedAt de una compra existente.
   * @param {string} id
   */
  async function updatePurchaseUsage(id) {
    if (!authState?.user?.uid) return;
    await updatePurchaseDoc(authState.user.uid, id, { lastUsedAt: serverTimestamp() });
  }

  /**
   * Elimina una compra por ID.
   * @param {string} id
   */
  async function removePurchase(id) {
    if (!authState?.user?.uid) return;
    await deletePurchaseDoc(authState.user.uid, id);
  }

  /**
   * Limpia todo el historial de compras.
   */
  async function clearAll() {
    if (!authState?.user?.uid) return;
    const ids = purchases.map((/** @type {any} */ p) => p.id);
    if (ids.length > 0) {
      await deleteAllPurchases(authState.user.uid, ids);
    }
  }

  return {
    get purchases() { return purchases; },
    get count() { return purchases.length; },
    searchByName,
    addPurchase,
    updatePurchaseUsage,
    removePurchase,
    clearAll,
  };
}
