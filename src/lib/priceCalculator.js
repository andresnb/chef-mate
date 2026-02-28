/**
 * Price Calculator Utilities for ChefMate
 * Handles quantity parsing, unit conversion, and cost calculation
 */

import { unitCategories, getUnitByValue } from "./units.js";

// Unicode fraction to decimal mapping
const UNICODE_FRACTIONS = {
  "½": 0.5,
  "¼": 0.25,
  "¾": 0.75,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "⅛": 0.125,
  "⅜": 0.375,
  "⅝": 0.625,
  "⅞": 0.875,
};

/**
 * Parse a fraction string to decimal number
 * Handles Unicode fractions (½, ¼) and text fractions (1/2, 3/4)
 * @param {string} fractionString - The fraction string to parse
 * @returns {number} The decimal value
 */
function parseFraction(fractionString) {
  // Check for Unicode fractions
  if (UNICODE_FRACTIONS[fractionString]) {
    return UNICODE_FRACTIONS[fractionString];
  }

  // Check for text fractions like "1/2", "3/4"
  const fractionMatch = fractionString.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    if (denominator !== 0) {
      return numerator / denominator;
    }
  }

  // Return the string as-is if not a fraction
  return NaN;
}

/**
 * Parse a quantity string to a numeric value
 * Handles formats like: "1 ½", "300", "1.5", "1/2", "2 1/4"
 * @param {string|number} quantityString - The quantity to parse
 * @returns {number} The numeric value
 */
export function parseQuantity(quantityString) {
  // If it's already a number, return it
  if (typeof quantityString === "number") {
    return quantityString;
  }

  // If it's not a string, try to convert
  if (typeof quantityString !== "string") {
    return parseFloat(quantityString) || 0;
  }

  // Trim whitespace
  const trimmed = quantityString.trim();

  if (!trimmed) {
    return 0;
  }

  // Try direct parse first (handles "300", "1.5", "-5")
  const directParse = parseFloat(trimmed);
  if (!isNaN(directParse) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
    return directParse;
  }

  // Handle mixed numbers with Unicode fractions: "1 ½" or "2 ¾"
  const mixedUnicodeMatch = trimmed.match(/^(\d+)\s+([½¼¾⅓⅔⅛⅜⅝⅞])$/);
  if (mixedUnicodeMatch) {
    const wholeNumber = parseInt(mixedUnicodeMatch[1], 10);
    const fractionValue = parseFraction(mixedUnicodeMatch[2]);
    return wholeNumber + fractionValue;
  }

  // Handle mixed numbers with text fractions: "1 1/2" or "2 3/4"
  const mixedTextMatch = trimmed.match(/^(\d+)\s+(\d+\/\d+)$/);
  if (mixedTextMatch) {
    const wholeNumber = parseInt(mixedTextMatch[1], 10);
    const fractionValue = parseFraction(mixedTextMatch[2]);
    return wholeNumber + fractionValue;
  }

  // Handle standalone Unicode fractions: "½", "¼"
  if (UNICODE_FRACTIONS[trimmed]) {
    return UNICODE_FRACTIONS[trimmed];
  }

  // Handle standalone text fractions: "1/2", "3/4"
  const fractionValue = parseFraction(trimmed);
  if (!isNaN(fractionValue)) {
    return fractionValue;
  }

  // Fallback: try parseFloat
  const finalParse = parseFloat(trimmed);
  return isNaN(finalParse) ? 0 : finalParse;
}

/**
 * Get the category of a unit
 * @param {string} unit - The unit value (e.g., "g", "L", "pza")
 * @returns {string} 'weight', 'volume', or 'piece'
 */
export function getUnitCategory(unit) {
  const unitObj = getUnitByValue(unit);

  if (!unitObj) {
    return "piece"; // Default to piece for unknown units
  }

  for (const category of unitCategories) {
    const found = category.units.find((u) => u.value === unit);
    if (found) {
      if (category.name === "Peso") {
        return "weight";
      } else if (category.name === "Pieza") {
        return "piece";
      } else {
        // Both "Volumen Líquido" and "Volumen Sólido / Cucharas" are volume
        return "volume";
      }
    }
  }

  return "piece";
}

/**
 * Convert a quantity to its base unit (kg for weight, L for volume, or piece)
 * @param {number} quantity - The numeric quantity
 * @param {string} unit - The unit value
 * @returns {number} The quantity in base units
 */
export function convertToBaseUnit(quantity, unit) {
  const unitObj = getUnitByValue(unit);

  if (!unitObj) {
    return quantity; // Unknown unit, return as-is
  }

  // For weight units: convert to kg
  // toBaseUnit values are: g=1000, kg=1, oz=35.274, lb=2.205, mg=1000000
  // So to get kg: quantity / toBaseUnit
  // Wait, looking at the data: g has toBaseUnit=1000, meaning 1g = 1/1000 kg
  // So to convert TO base unit (kg): quantity / toBaseUnit

  // Actually, let's check the semantics:
  // g: toBaseUnit=1000 → 1g = 1/1000 kg, so divide by 1000 to get kg
  // kg: toBaseUnit=1 → 1kg = 1kg, so divide by 1
  // oz: toBaseUnit=35.274 → 1oz = 1/35.274 kg, so divide by 35.274

  // For volume: toBaseUnit values are in L
  // ml: toBaseUnit=1000 → 1ml = 1/1000 L
  // L: toBaseUnit=1 → 1L = 1L
  // fl oz: toBaseUnit=33.814 → 1fl oz = 1/33.814 L

  // So the formula is: baseUnit = quantity / toBaseUnit

  return quantity / unitObj.toBaseUnit;
}

/**
 * Calculate the cost of an ingredient based on quantity and price
 * @param {Object} ingredient - The ingredient object with quantity and unit
 * @param {number} pricePerKgOrL - Price per kg (for weight) or per L (for volume)
 * @returns {number} The calculated cost
 *
 * @example
 * // For a weight ingredient
 * calculateIngredientCost({ quantity: "500", unit: "g" }, 10) // Returns 5 (500g = 0.5kg × $10/kg)
 *
 * // For a volume ingredient
 * calculateIngredientCost({ quantity: "1.5", unit: "L" }, 5) // Returns 7.5 (1.5L × $5/L)
 */
export function calculateIngredientCost(ingredient, pricePerKgOrL) {
  // Parse the quantity
  const numericQuantity = parseQuantity(ingredient.quantity);

  if (numericQuantity <= 0) {
    return 0;
  }

  // Convert to base unit
  const baseUnitQuantity = convertToBaseUnit(numericQuantity, ingredient.unit);

  // Calculate cost
  const cost = baseUnitQuantity * pricePerKgOrL;

  // Return cost rounded to 2 decimal places
  return Math.round(cost * 100) / 100;
}

/**
 * Calculate the cost of a recipe quantity based on container price and quantity
 * @param {number} recipeQuantity - The quantity used in the recipe
 * @param {string} recipeUnit - The unit of the recipe quantity
 * @param {number} containerQuantity - The quantity in the container/package
 * @param {string} containerUnit - The unit of the container quantity
 * @param {number} containerPrice - The price of the container/package
 * @returns {number} The calculated cost for the recipe quantity
 *
 * @example
 * // For 250g of ingredient in a 1kg package costing $15
 * calculateContainerCost(250, 'g', 1, 'kg', 15) // Returns 3.75
 */
export function calculateContainerCost(
  recipeQuantity,
  recipeUnit,
  containerQuantity,
  containerUnit,
  containerPrice,
) {
  // Parse quantities
  const numericRecipeQty = parseQuantity(recipeQuantity);
  const numericContainerQty = parseQuantity(containerQuantity);

  if (
    numericRecipeQty <= 0 ||
    numericContainerQty <= 0 ||
    containerPrice <= 0
  ) {
    return 0;
  }

  // Validate unit category compatibility (weight vs volume)
  // Note: Cross-category conversion is possible for viscous ingredients measured in different units
  // We allow it but warn in console for debugging
  const recipeCategory = getUnitCategory(recipeUnit);
  const containerCategory = getUnitCategory(containerUnit);

  if (
    recipeCategory !== "piece" &&
    containerCategory !== "piece" &&
    recipeCategory !== containerCategory
  ) {
    // Allow cross-category (e.g., grams to liters for viscous ingredients)
    // but log warning for debugging purposes
    console.warn(
      `[ChefMate] Unit category mismatch: recipe uses '${recipeCategory}' but container uses '${containerCategory}'. ` +
        `This is allowed for viscous ingredients but may produce unexpected results.`,
    );
  }

  // Convert both to base units for comparison
  const recipeBaseQty = convertToBaseUnit(numericRecipeQty, recipeUnit);
  const containerBaseQty = convertToBaseUnit(
    numericContainerQty,
    containerUnit,
  );

  // Calculate the fraction of container used
  const fractionUsed = recipeBaseQty / containerBaseQty;

  // Calculate cost
  const cost = fractionUsed * containerPrice;

  // Return cost rounded to 2 decimal places
  return Math.round(cost * 100) / 100;
}

/**
 * Calculate price per base unit (kg or L) from container information
 * @param {number} containerQuantity - The quantity in the container/package
 * @param {string} containerUnit - The unit of the container quantity
 * @param {number} containerPrice - The price of the container/package
 * @returns {number} Price per kg or L
 *
 * @example
 * // For 1kg package costing $15
 * calculatePricePerBaseUnit(1, 'kg', 15) // Returns 15
 */
export function calculatePricePerBaseUnit(
  containerQuantity,
  containerUnit,
  containerPrice,
) {
  const numericContainerQty = parseQuantity(containerQuantity);

  if (numericContainerQty <= 0 || containerPrice <= 0) {
    return 0;
  }

  const containerBaseQty = convertToBaseUnit(
    numericContainerQty,
    containerUnit,
  );
  const pricePerBase = containerPrice / containerBaseQty;

  return Math.round(pricePerBase * 100) / 100;
}
