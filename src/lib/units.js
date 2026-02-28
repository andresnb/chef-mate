/**
 * Catálogo de unidades de medida para ChefMate
 * Organizadas por categoría para mejor UX
 */

export const unitCategories = [
  {
    name: "Peso",
    units: [
      { value: "g", label: "g", name: "gramos" },
      { value: "kg", label: "kg", name: "kilogramos" },
      { value: "oz", label: "oz", name: "onzas" },
      { value: "lb", label: "lb", name: "libras" },
      { value: "mg", label: "mg", name: "miligramos" },
    ],
  },
  {
    name: "Volumen Líquido",
    units: [
      { value: "ml", label: "ml", name: "mililitros" },
      { value: "L", label: "L", name: "litros" },
      { value: "fl oz", label: "fl oz", name: "onzas fluidas" },
      { value: "gal", label: "gal", name: "galones" },
    ],
  },
  {
    name: "Volumen Sólido / Cucharas",
    units: [
      { value: "tz", label: "tz", name: "tazas" },
      { value: "cda", label: "cda", name: "cucharadas" },
      { value: "cdta", label: "cdta", name: "cucharaditas" },
      { value: "pizca", label: "pizca", name: "pizca" },
      { value: "punta", label: "punta", name: "punta de cuchillo" },
    ],
  },
  {
    name: "Pieza",
    units: [
      { value: "pza", label: "pza", name: "pieza" },
      { value: "und", label: "und", name: "unidad" },
      { value: "doc", label: "doc", name: "docena" },
    ],
  },
];

// flatten para usar en selects simples
export const allUnits = unitCategories.flatMap((cat) => cat.units);

// Fracciones predefinidas para botones táctiles
export const fractionButtons = [
  { value: "½", display: "½" },
  { value: "¼", display: "¼" },
  { value: "¾", display: "¾" },
  { value: "⅓", display: "⅓" },
  { value: "⅔", display: "⅔" },
  { value: "⅛", display: "⅛" },
];

// Obtener unidad por valor
export function getUnitByValue(value) {
  return allUnits.find((u) => u.value === value);
}

// Simple counter for generating unique IDs (works with SSR)
let idCounter = 0;
export function generateId(prefix) {
  return `${prefix}-${++idCounter}`;
}
