import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config.js";

// ─── User Settings ───

export function subscribeUserSettings(uid, callback) {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback({ hourlyRate: 0 });
    }
  });
}

export async function updateUserSettings(uid, settings) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, settings, { merge: true });
}

// ─── Recipes ───

export function subscribeRecipes(uid, callback) {
  const recipesRef = collection(db, "users", uid, "recipes");
  return onSnapshot(recipesRef, (snap) => {
    const recipes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(recipes);
  });
}

export async function createRecipe(uid, data) {
  const recipesRef = collection(db, "users", uid, "recipes");
  const docRef = await addDoc(recipesRef, {
    name: data.name,
    prepTimeMinutes: data.prepTimeMinutes || 0,
    ingredients: data.ingredients || [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateRecipe(uid, recipeId, data) {
  const recipeRef = doc(db, "users", uid, "recipes", recipeId);
  await updateDoc(recipeRef, data);
}

export async function deleteRecipe(uid, recipeId) {
  const recipeRef = doc(db, "users", uid, "recipes", recipeId);
  await deleteDoc(recipeRef);
}

/**
 * @param {string} uid
 * @param {string} recipeId
 * @returns {Promise<{id: string, name: string, prepTimeMinutes: number, ingredients: any[], createdAt: any} | null>}
 */
export async function getRecipe(uid, recipeId) {
  const recipeRef = doc(db, "users", uid, "recipes", recipeId);
  const snap = await getDoc(recipeRef);
  if (snap.exists()) {
    return /** @type {any} */ ({ id: snap.id, ...snap.data() });
  }
  return null;
}

// ─── Purchases ───

export function subscribePurchases(uid, callback) {
  const purchasesRef = collection(db, "users", uid, "purchases");
  return onSnapshot(purchasesRef, (snap) => {
    const purchases = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(purchases);
  });
}

export async function addPurchaseDoc(uid, data) {
  const purchasesRef = collection(db, "users", uid, "purchases");
  const docRef = await addDoc(purchasesRef, {
    productName: data.productName,
    containerQuantity: data.containerQuantity,
    containerUnit: data.containerUnit,
    containerPrice: data.containerPrice,
    brand: data.brand || "",
    store: data.store || "",
    createdAt: serverTimestamp(),
    lastUsedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePurchaseDoc(uid, purchaseId, data) {
  const purchaseRef = doc(db, "users", uid, "purchases", purchaseId);
  await updateDoc(purchaseRef, data);
}

export async function deletePurchaseDoc(uid, purchaseId) {
  const purchaseRef = doc(db, "users", uid, "purchases", purchaseId);
  await deleteDoc(purchaseRef);
}

export async function deleteAllPurchases(uid, purchaseIds) {
  const promises = purchaseIds.map((id) =>
    deleteDoc(doc(db, "users", uid, "purchases", id)),
  );
  await Promise.all(promises);
}

// ─── User Doc ───

export async function ensureUserDoc(uid, email) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      hourlyRate: 0,
      email: email || "",
      createdAt: serverTimestamp(),
    });
    return false; // new user
  }
  return true; // existing user
}
