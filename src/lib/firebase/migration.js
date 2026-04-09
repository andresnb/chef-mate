import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config.js";

/**
 * Migrates localStorage data to Firestore for a given user.
 * Only runs once per user (checked via localStorage flag).
 * Returns true if migration was performed.
 */
export async function migrateLocalData(uid) {
  const migrationKey = `chefmate-migrated-${uid}`;

  // Already migrated on this device
  if (localStorage.getItem(migrationKey)) {
    return false;
  }

  const recipesRaw = localStorage.getItem("chefmate-recipes");
  const purchasesRaw = localStorage.getItem("chefmate-purchases");
  const settingsRaw = localStorage.getItem("chefmate-user-settings");

  const recipes = safeParse(recipesRaw, []);
  const purchases = safeParse(purchasesRaw, []);
  const settings = safeParse(settingsRaw, { hourlyRate: 0 });

  const hasData = recipes.length > 0 || purchases.length > 0 || (settings.hourlyRate && settings.hourlyRate > 0);

  if (!hasData) {
    localStorage.setItem(migrationKey, "true");
    return false;
  }

  try {
    // Migrate user settings
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      hourlyRate: settings.hourlyRate || 0,
      createdAt: serverTimestamp(),
    }, { merge: true });

    // Migrate recipes
    const recipesRef = collection(db, "users", uid, "recipes");
    for (const recipe of recipes) {
      if (!recipe.name) continue;
      await addDoc(recipesRef, {
        name: recipe.name,
        prepTimeMinutes: recipe.prepTimeMinutes || 0,
        ingredients: (recipe.ingredients || []).map(cleanIngredient),
        createdAt: recipe.createdAt ? new Date(recipe.createdAt) : serverTimestamp(),
      });
    }

    // Migrate purchases
    const purchasesRef = collection(db, "users", uid, "purchases");
    for (const purchase of purchases) {
      if (!purchase.productName) continue;
      await addDoc(purchasesRef, {
        productName: purchase.productName,
        containerQuantity: purchase.containerQuantity || "",
        containerUnit: purchase.containerUnit || "",
        containerPrice: purchase.containerPrice || 0,
        brand: purchase.brand || "",
        store: purchase.store || "",
        createdAt: purchase.createdAt ? new Date(purchase.createdAt) : serverTimestamp(),
        lastUsedAt: purchase.lastUsedAt ? new Date(purchase.lastUsedAt) : serverTimestamp(),
      });
    }

    // Clear migrated localStorage keys (keep dark-mode and current-screen)
    localStorage.removeItem("chefmate-recipes");
    localStorage.removeItem("chefmate-purchases");
    localStorage.removeItem("chefmate-user-settings");

    // Mark migration complete
    localStorage.setItem(migrationKey, "true");
    return true;
  } catch (e) {
    console.error("Migration failed:", e);
    return false;
  }
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function cleanIngredient(ing) {
  return {
    id: ing.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: ing.name || "",
    quantity: ing.quantity || "",
    unit: ing.unit || "",
    pricePerKgOrL: ing.pricePerKgOrL || 0,
    price: ing.price || 0,
    containerQuantity: ing.containerQuantity || "",
    containerUnit: ing.containerUnit || "",
    containerPrice: ing.containerPrice || 0,
  };
}
