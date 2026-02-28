/**
 * Catálogo de unidades de medida para ChefMate
 * Organizadas por categoría para mejor UX
 */

export const unitCategories = [
  {
    name: "Peso",
    units: [
      { value: "g", label: "g", name: "gramos", toBaseUnit: 1000 },
      { value: "kg", label: "kg", name: "kilogramos", toBaseUnit: 1 },
      { value: "oz", label: "oz", name: "onzas", toBaseUnit: 35.274 },
      { value: "lb", label: "lb", name: "libras", toBaseUnit: 2.205 },
      { value: "mg", label: "mg", name: "miligramos", toBaseUnit: 1000000 },
    ],
  },
  {
    name: "Volumen Líquido",
    units: [
      { value: "ml", label: "ml", name: "mililitros", toBaseUnit: 1000 },
      { value: "L", label: "L", name: "litros", toBaseUnit: 1 },
      {
        value: "fl oz",
        label: "fl oz",
        name: "onzas fluidas",
        toBaseUnit: 33.814,
      },
      { value: "gal", label: "gal", name: "galones", toBaseUnit: 0.264172 },
    ],
  },
  {
    name: "Volumen Sólido / Cucharas",
    units: [
      { value: "tz", label: "tz", name: "tazas", toBaseUnit: 4.227 },
      { value: "cda", label: "cda", name: "cucharadas", toBaseUnit: 67.628 },
      {
        value: "cdta",
        label: "cdta",
        name: "cucharaditas",
        toBaseUnit: 202.884,
      },
      { value: "pizca", label: "pizca", name: "pizca", toBaseUnit: 1000 },
      {
        value: "punta",
        label: "punta",
        name: "punta de cuchillo",
        toBaseUnit: 2000,
      },
    ],
  },
  {
    name: "Pieza",
    units: [
      { value: "pza", label: "pza", name: "pieza", toBaseUnit: 1 },
      { value: "und", label: "und", name: "unidad", toBaseUnit: 1 },
      { value: "doc", label: "doc", name: "docena", toBaseUnit: 1 },
    ],
  },
];

// flatten para usar en selects simples
export const allUnits = unitCategories.flatMap((cat) => cat.units);

// Commercial units only (for container presentations - excludes spoons, cups, etc.)
export const commercialUnits = [
  {
    name: "Peso",
    units: unitCategories[0].units, // Peso: g, kg, oz, lb, mg
  },
  {
    name: "Volumen Líquido",
    units: unitCategories[1].units, // Volumen Líquido: ml, L, fl oz, gal
  },
  {
    name: "Pieza",
    units: unitCategories[3].units, // Pieza: pza, und, doc
  },
];

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
