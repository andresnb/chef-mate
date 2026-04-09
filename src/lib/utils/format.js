import { getUnitCategory } from "../priceCalculator.js";

/**
 * Formatea una fecha ISO a formato español
 * @param {string} isoString - Fecha en formato ISO
 * @returns {string} Fecha formateada (ej: "1 mar")
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Obtiene la etiqueta de precio según la categoría de unidad
 * @param {string} unit - Valor de la unidad
 * @returns {string} Etiqueta de precio
 */
export function getPriceLabel(unit) {
  if (!unit) return "Precio ($)";

  const category = getUnitCategory(unit);
  if (category === "weight") {
    return "Precio por kg ($)";
  } else if (category === "volume") {
    return "Precio por L ($)";
  } else {
    return "Precio ($)";
  }
}

/**
 * Formatea un número como precio
 * @param {number} value - Valor a formatear
 * @returns {string} Precio formateado
 */
export function formatPrice(value) {
  return (value || 0).toFixed(2);
}
