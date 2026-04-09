import { getUnitByValue } from "../units.js";
import { getUnitCategory } from "../priceCalculator.js";

/**
 * Valida que los datos del contenedor estén completos
 * @param {Object} ingredient - Objeto con datos del ingrediente
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateContainerData(ingredient) {
  const { containerQuantity, containerUnit, containerPrice } = ingredient;

  const hasContainerData = containerQuantity || containerUnit || containerPrice;
  if (!hasContainerData) {
    return { valid: true };
  }

  // Check for partial container data
  const hasPartialContainer =
    (containerQuantity && !containerUnit) ||
    (containerQuantity && !containerPrice) ||
    (containerUnit && !containerQuantity) ||
    (containerPrice && !containerQuantity);

  if (hasPartialContainer) {
    return {
      valid: false,
      error:
        "Si ingresa datos del contenedor, complete todos los campos: cantidad, unidad y precio.",
    };
  }

  return { valid: true };
}

/**
 * Valida la compatibilidad de categorías de unidades
 * @param {string} recipeUnit - Unidad de la receta
 * @param {string} containerUnit - Unidad del contenedor
 * @returns {{ valid: boolean, warning?: string }}
 */
export function validateUnitCompatibility(recipeUnit, containerUnit) {
  if (!recipeUnit || !containerUnit) {
    return { valid: true };
  }

  const validUnit = getUnitByValue(recipeUnit);
  if (!validUnit) {
    return { valid: true };
  }

  const recipeCategory = getUnitCategory(recipeUnit);
  const containerCategory = getUnitCategory(containerUnit);

  if (
    recipeCategory !== "piece" &&
    containerCategory !== "piece" &&
    recipeCategory !== containerCategory
  ) {
    return {
      valid: true,
      warning: `Advertencia: La unidad de receta (${recipeCategory}) es diferente a la del contenedor (${containerCategory}). Esto puede generar cálculos incorrectos.`,
    };
  }

  return { valid: true };
}

/**
 * Valida un nuevo ingrediente
 * @param {Object} ingredient - Objeto con datos del ingrediente
 * @returns {{ valid: boolean, error?: string, warning?: string }}
 */
export function validateIngredient(ingredient) {
  // Validate container data
  const containerValidation = validateContainerData(ingredient);
  if (!containerValidation.valid) {
    return containerValidation;
  }

  // Validate unit compatibility
  const unitValidation = validateUnitCompatibility(
    ingredient.unit,
    ingredient.containerUnit,
  );
  if (unitValidation.warning) {
    return unitValidation;
  }

  return { valid: true };
}

/**
 * Valida el nombre de una receta
 * @param {string} name - Nombre de la receta
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateRecipeName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: "El nombre no puede estar vacío" };
  }

  return { valid: true };
}
