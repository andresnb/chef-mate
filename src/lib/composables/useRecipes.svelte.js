import { getUnitByValue } from "../units.js";
import {
  calculateIngredientCost,
  getUnitCategory,
  calculateContainerCost,
} from "../priceCalculator.js";
import {
  subscribeRecipes,
  createRecipe as createRecipeFirestore,
  updateRecipe as updateRecipeFirestore,
  deleteRecipe as deleteRecipeFirestore,
  getRecipe as getRecipeFirestore,
} from "../firebase/firestore.js";

/**
 * Composable para gestión de recetas e ingredientes.
 * @param {{ user: { uid: string } | null }} authState
 */
export function useRecipes(authState) {
  let recipes = $state([]);
  /** @type {any} */
  let currentRecipe = $state(null);
  /** @type {(() => void) | null} */
  let unsubscribe = null;

  $effect(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    if (authState?.user?.uid) {
      const uid = authState.user.uid;
      unsubscribe = subscribeRecipes(uid, (/** @type {any[]} */ data) => {
        recipes = data;
        // Keep currentRecipe in sync
        if (currentRecipe) {
          const updated = data.find((/** @type {any} */ r) => r.id === currentRecipe.id);
          if (updated) {
            currentRecipe = updated;
          }
        }
      });
    } else {
      recipes = [];
      currentRecipe = null;
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };
  });

  /**
   * Crear nueva receta
   * @param {string} name
   */
  async function createRecipe(name) {
    if (!name || !name.trim() || !authState?.user?.uid) return null;

    const recipeData = {
      name: name.trim(),
      prepTimeMinutes: 0,
      ingredients: [],
    };

    const id = await createRecipeFirestore(authState.user.uid, recipeData);
    const recipe = { id, ...recipeData, createdAt: new Date().toISOString() };
    currentRecipe = recipe;
    return recipe;
  }

  /**
   * Agregar ingrediente a la receta actual
   * @param {any} ingredientData
   */
  async function addIngredient(ingredientData) {
    if (!ingredientData.name.trim() || !currentRecipe || !authState?.user?.uid) return;

    const validUnit = ingredientData.unit && getUnitByValue(ingredientData.unit);

    const ingredient = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: ingredientData.name.trim(),
      quantity: ingredientData.quantity.trim(),
      unit: validUnit ? ingredientData.unit : "",
      pricePerKgOrL: Math.max(0, parseFloat(String(ingredientData.pricePerKgOrL)) || 0),
      price: Math.max(0, parseFloat(String(ingredientData.pricePerKgOrL)) || 0),
      containerQuantity: ingredientData.containerQuantity
        ? ingredientData.containerQuantity.trim()
        : "",
      containerUnit: ingredientData.containerUnit || "",
      containerPrice: Math.max(0, parseFloat(String(ingredientData.containerPrice)) || 0),
    };

    // Get current recipe from Firestore to avoid stale data
    const fresh = await getRecipeFirestore(authState.user.uid, currentRecipe.id);
    if (!fresh) return;

    const updatedIngredients = [...(fresh.ingredients || []), ingredient];
    await updateRecipeFirestore(authState.user.uid, currentRecipe.id, {
      ingredients: updatedIngredients,
    });
  }

  /**
   * Eliminar ingrediente
   * @param {string} ingredientId
   */
  async function removeIngredient(ingredientId) {
    if (!currentRecipe || !authState?.user?.uid) return;

    const fresh = await getRecipeFirestore(authState.user.uid, currentRecipe.id);
    if (!fresh) return;

    const updatedIngredients = (fresh.ingredients || []).filter(
      (/** @type {any} */ i) => i.id !== ingredientId,
    );
    await updateRecipeFirestore(authState.user.uid, currentRecipe.id, {
      ingredients: updatedIngredients,
    });
  }

  /**
   * Eliminar receta
   * @param {string} recipeId
   */
  async function deleteRecipe(recipeId) {
    if (!authState?.user?.uid) return;

    await deleteRecipeFirestore(authState.user.uid, recipeId);
    if (currentRecipe?.id === recipeId) {
      currentRecipe = null;
    }
  }

  /**
   * Seleccionar receta para editar
   * @param {any} recipe
   */
  function selectRecipe(recipe) {
    if (!recipe) return;
    const exists = recipes.find((/** @type {any} */ r) => r.id === recipe.id);
    if (exists) {
      currentRecipe = exists;
    }
  }

  /**
   * Actualizar tiempo de preparación
   * @param {string} recipeId
   * @param {number} minutes
   */
  async function updatePrepTime(recipeId, minutes) {
    if (!authState?.user?.uid) return;

    await updateRecipeFirestore(authState.user.uid, recipeId, {
      prepTimeMinutes: minutes,
    });
  }

  /**
   * Calcular total de ingredientes
   * @param {any[]} ingredients
   */
  function getTotal(ingredients) {
    return ingredients.reduce((/** @type {number} */ sum, /** @type {any} */ ing) => {
      if (ing.containerQuantity && ing.containerUnit && ing.containerPrice) {
        const cost = calculateContainerCost(
          ing.quantity, ing.unit,
          ing.containerQuantity, ing.containerUnit, ing.containerPrice,
        );
        return sum + cost;
      }

      const category = getUnitCategory(ing.unit);
      if (category === "piece") {
        const price = parseFloat(ing.price) || parseFloat(ing.pricePerKgOrL) || 0;
        return sum + price;
      } else {
        const pricePerKgOrL = parseFloat(ing.pricePerKgOrL) || parseFloat(ing.price) || 0;
        const cost = calculateIngredientCost(ing, pricePerKgOrL);
        return sum + cost;
      }
    }, 0);
  }

  /**
   * Obtener precio display de un ingrediente
   * @param {any} ingredient
   */
  function getIngredientDisplayPrice(ingredient) {
    if (ingredient.containerQuantity && ingredient.containerUnit && ingredient.containerPrice) {
      return calculateContainerCost(
        ingredient.quantity, ingredient.unit,
        ingredient.containerQuantity, ingredient.containerUnit, ingredient.containerPrice,
      ).toFixed(2);
    }

    const category = getUnitCategory(ingredient.unit);
    if (category === "piece") {
      return (parseFloat(ingredient.price) || parseFloat(ingredient.pricePerKgOrL) || 0).toFixed(2);
    } else {
      const pricePerKgOrL = parseFloat(ingredient.pricePerKgOrL) || parseFloat(ingredient.price) || 0;
      return calculateIngredientCost(ingredient, pricePerKgOrL).toFixed(2);
    }
  }

  /**
   * Obtener display del contenedor
   * @param {any} ingredient
   */
  function getContainerDisplay(ingredient) {
    if (!ingredient.containerQuantity || !ingredient.containerUnit) return "";
    const unitLabel = getUnitByValue(ingredient.containerUnit)?.label || ingredient.containerUnit;
    return ` (env: ${ingredient.containerQuantity} ${unitLabel})`;
  }

  return {
    get recipes() { return recipes; },
    set recipes(v) { recipes = v; },
    get currentRecipe() { return currentRecipe; },
    set currentRecipe(v) { currentRecipe = v; },
    createRecipe,
    addIngredient,
    removeIngredient,
    deleteRecipe,
    selectRecipe,
    updatePrepTime,
    getTotal,
    getIngredientDisplayPrice,
    getContainerDisplay,
  };
}
