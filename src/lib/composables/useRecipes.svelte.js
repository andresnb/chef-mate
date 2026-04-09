import { onMount } from "svelte";
import { getUnitByValue } from "../units.js";
import {
  calculateIngredientCost,
  getUnitCategory,
  calculateContainerCost,
} from "../priceCalculator.js";

/**
 * Composable para gestión de recetas e ingredientes
 */
export function useRecipes() {
  let recipes = $state([]);
  /** @type {{id: string, name: string, prepTimeMinutes?: number, ingredients?: Array<any>, createdAt?: string} | null} */
  let currentRecipe = $state(null);

  // Debounce timer for localStorage save
  let saveTimer = $state(null);

  // Cargar recetas desde localStorage al iniciar
  onMount(() => {
    const saved = localStorage.getItem("chefmate-recipes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          recipes = parsed.filter(
            (r) => r && typeof r === "object" && r.id && r.name,
          );
        } else {
          recipes = [];
        }
      } catch (e) {
        recipes = [];
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  });

  // Guardar recetas en localStorage con debounce
  function saveRecipes() {
    if (saveTimer) clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem("chefmate-recipes", JSON.stringify(recipes));
      } catch (e) {
        // Silently fail
      }
    }, 500); // 500ms debounce
  }

  // Guardado inmediato (para cuando se elimina la receta completa)
  function saveRecipesImmediate() {
    if (saveTimer) clearTimeout(saveTimer);
    try {
      localStorage.setItem("chefmate-recipes", JSON.stringify(recipes));
    } catch (e) {
      // Silently fail
    }
  }

  // Crear nueva receta
  function createRecipe(name) {
    if (!name || !name.trim()) {
      return null;
    }

    const recipe = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      prepTimeMinutes: 0,
      ingredients: [],
      createdAt: new Date().toISOString(),
    };

    recipes = [...recipes, recipe];
    currentRecipe = recipe;
    saveRecipes();

    return recipe;
  }

  // Agregar ingrediente
  function addIngredient(ingredientData) {
    if (!ingredientData.name.trim() || !currentRecipe) return;

    const recipeIndex = recipes.findIndex((r) => r.id === currentRecipe.id);
    if (recipeIndex === -1) return;

    const validUnit =
      ingredientData.unit && getUnitByValue(ingredientData.unit);

    const ingredient = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: ingredientData.name.trim(),
      quantity: ingredientData.quantity.trim(),
      unit: validUnit ? ingredientData.unit : "",
      pricePerKgOrL: Math.max(
        0,
        parseFloat(String(ingredientData.pricePerKgOrL)) || 0,
      ),
      price: Math.max(0, parseFloat(String(ingredientData.pricePerKgOrL)) || 0),
      containerQuantity: ingredientData.containerQuantity
        ? ingredientData.containerQuantity.trim()
        : "",
      containerUnit: ingredientData.containerUnit || "",
      containerPrice: Math.max(
        0,
        parseFloat(String(ingredientData.containerPrice)) || 0,
      ),
    };

    recipes[recipeIndex].ingredients = [
      ...recipes[recipeIndex].ingredients,
      ingredient,
    ];
    currentRecipe = recipes[recipeIndex];
    saveRecipes();
  }

  // Eliminar ingrediente
  function removeIngredient(ingredientId) {
    if (!currentRecipe) return;

    const recipeIndex = recipes.findIndex((r) => r.id === currentRecipe.id);
    if (recipeIndex === -1) return;

    recipes[recipeIndex].ingredients = recipes[recipeIndex].ingredients.filter(
      (i) => i.id !== ingredientId,
    );
    currentRecipe = recipes[recipeIndex];
    saveRecipes();
  }

  // Eliminar receta
  function deleteRecipe(recipeId) {
    recipes = recipes.filter((r) => r.id !== recipeId);
    if (currentRecipe?.id === recipeId) {
      currentRecipe = null;
    }
    saveRecipesImmediate();
  }

  // Seleccionar receta para editar
  function selectRecipe(recipe) {
    if (!recipe) return;

    // Verify recipe exists in the recipes array
    const exists = recipes.find((r) => r.id === recipe.id);
    if (exists) {
      currentRecipe = recipe;
    }
  }

  // Actualizar tiempo de preparación
  function updatePrepTime(recipeId, minutes) {
    const recipeIndex = recipes.findIndex((r) => r.id === recipeId);
    if (recipeIndex === -1) return;

    recipes[recipeIndex].prepTimeMinutes = minutes;
    if (currentRecipe?.id === recipeId) {
      currentRecipe = recipes[recipeIndex];
    }
    saveRecipes();
  }

  // Calcular total de ingredientes
  function getTotal(ingredients) {
    return ingredients.reduce((sum, ing) => {
      // Check for container data first (new format)
      if (ing.containerQuantity && ing.containerUnit && ing.containerPrice) {
        const cost = calculateContainerCost(
          ing.quantity,
          ing.unit,
          ing.containerQuantity,
          ing.containerUnit,
          ing.containerPrice,
        );
        return sum + cost;
      }

      const category = getUnitCategory(ing.unit);

      if (category === "piece") {
        const price =
          parseFloat(ing.price) || parseFloat(ing.pricePerKgOrL) || 0;
        return sum + price;
      } else {
        const pricePerKgOrL =
          parseFloat(ing.pricePerKgOrL) || parseFloat(ing.price) || 0;
        const cost = calculateIngredientCost(ing, pricePerKgOrL);
        return sum + cost;
      }
    }, 0);
  }

  // Obtener precio de展示 para un ingrediente
  function getIngredientDisplayPrice(ingredient) {
    if (
      ingredient.containerQuantity &&
      ingredient.containerUnit &&
      ingredient.containerPrice
    ) {
      return calculateContainerCost(
        ingredient.quantity,
        ingredient.unit,
        ingredient.containerQuantity,
        ingredient.containerUnit,
        ingredient.containerPrice,
      ).toFixed(2);
    }

    const category = getUnitCategory(ingredient.unit);
    if (category === "piece") {
      return (
        parseFloat(ingredient.price) ||
        parseFloat(ingredient.pricePerKgOrL) ||
        0
      ).toFixed(2);
    } else {
      const pricePerKgOrL =
        parseFloat(ingredient.pricePerKgOrL) ||
        parseFloat(ingredient.price) ||
        0;
      return calculateIngredientCost(ingredient, pricePerKgOrL).toFixed(2);
    }
  }

  // Obtener display del contenedor
  function getContainerDisplay(ingredient) {
    if (!ingredient.containerQuantity || !ingredient.containerUnit) return "";
    const unitLabel =
      getUnitByValue(ingredient.containerUnit)?.label ||
      ingredient.containerUnit;
    return ` (env: ${ingredient.containerQuantity} ${unitLabel})`;
  }

  return {
    get recipes() {
      return recipes;
    },
    set recipes(v) {
      recipes = v;
    },
    get currentRecipe() {
      return currentRecipe;
    },
    set currentRecipe(v) {
      currentRecipe = v;
    },
    saveRecipes,
    saveRecipesImmediate,
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
