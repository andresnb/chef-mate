# Plan: Campos de Presentación del Contenedor de Ingredientes

## Resumen del Cambio

Se agregarán campos para capturar la información de presentación del ingrediente en el supermercado, permitiendo calcular el costo real de la receta basado en el precio del contenedor completo.

---

## 1. Estructura de Datos Actualizada

### 1.1 Estado del Formulario (newIngredient)

```javascript
// Estado actual
let newIngredient = { name: "", quantity: "", unit: "", pricePerKgOrL: 0 };

// Nuevo estado
let newIngredient = {
  name: "", // Nombre del ingrediente
  quantity: "", // Cantidad usada en la receta
  unit: "", // Unidad de la receta (g, kg, L, pza, etc.)

  // Nuevos campos para el contenedor del supermercado
  containerQuantity: "", // Cantidad en el contenedor (ej: 1, 500, 1000)
  containerUnit: "", // Unidad del contenedor (ej: kg, g, L)
  containerPrice: 0, // Precio del contenedor completo
};
```

### 1.2 Objeto Ingrediente Guardado

```javascript
// Nuevo formato del ingrediente guardado
const ingredient = {
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: newIngredient.name.trim(),
  quantity: newIngredient.quantity.trim(),
  unit: validUnit ? newIngredient.unit : "",

  // Nuevos campos
  containerQuantity: newIngredient.containerQuantity.trim(),
  containerUnit:
    newIngredient.containerUnit || validUnit ? newIngredient.unit : "",
  containerPrice: Math.max(
    0,
    parseFloat(String(newIngredient.containerPrice)) || 0,
  ),

  // Mantener campos legacy para compatibilidad
  pricePerKgOrL: Math.max(
    0,
    parseFloat(String(newIngredient.containerPrice)) || 0,
  ),
  price: Math.max(0, parseFloat(String(newIngredient.containerPrice)) || 0),
};
```

---

## 2. Cambios en la UI

### 2.1 Layout Propuesto (Opción B)

```
┌─────────────────────────────────────────┐
│  CANTIDAD  │ UNIDAD  │ INGREDIENTE     │
│  [_____]   │ [__▼__] │ [_____________] │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  PRESENTACIÓN EN EL SUPERMERCADO        │
├─────────────────────────────────────────┤
│  CONTENEDOR      │  UNIDAD    │PRECIO   │
│  [_____]         │  [__▼__]   │[_____]  │
│  "1 kg de harina"│            │ $15.00  │
└─────────────────────────────────────────┘
                              [ + AGREGAR ]
```

### 2.2 Componentes Necesarios

1. **Nueva sección visual** en [`src/App.svelte`](src/App.svelte) después del nombre del ingrediente
   - Título: "PRESENTACIÓN EN EL SUPERMERCADO"
   - Tres campos en fila: containerQuantity, containerUnit, containerPrice

2. **Modificación de UnitSelect** para soportar default value
   - Agregar prop `defaultValue` que permite pre-seleccionar la unidad de la receta

3. **Reutilizar QuantityInput** para containerQuantity

---

## 3. Lógica de Cálculo de Precio

### 3.1 Nueva Función en priceCalculator.js

```javascript
/**
 * Calcular el costo de un ingrediente basado en el precio del contenedor
 *
 * @param {Object} ingredient - Ingredient con quantity, unit, containerQuantity, containerUnit
 * @param {number} containerPrice - Precio del contenedor completo
 * @returns {number} Costo calculado del ingrediente en la receta
 *
 * Ejemplo:
 * - Receta: 250g de harina
 * - Contenedor: 1kg ($15)
 * - Costo = (250g / 1000g) * $15 = $3.75
 */
export function calculateCostFromContainer(ingredient, containerPrice) {
  const recipeQty = parseQuantity(ingredient.quantity);
  const containerQty = parseQuantity(ingredient.containerQuantity);

  if (recipeQty <= 0 || containerQty <= 0 || containerPrice <= 0) {
    return 0;
  }

  // Convertir ambas cantidades a unidades base (kg o L)
  const recipeBaseQty = convertToBaseUnit(recipeQty, ingredient.unit);
  const containerBaseQty = convertToBaseUnit(
    containerQty,
    ingredient.containerUnit,
  );

  if (containerBaseQty === 0) {
    return 0;
  }

  // Calcular precio por unidad base
  const pricePerBaseUnit = containerPrice / containerBaseQty;

  // Costo = cantidad de receta × precio por unidad base
  const cost = recipeBaseQty * pricePerBaseUnit;

  return Math.round(cost * 100) / 100;
}
```

### 3.2 Modificación de Funciones Existentes

```javascript
// En priceCalculator.js - Agregar función para obtener el precio por unidad base
export function getPricePerBaseUnit(
  containerQuantity,
  containerUnit,
  containerPrice,
) {
  const qty = parseQuantity(containerQuantity);
  if (qty <= 0 || containerPrice <= 0) return 0;

  const baseQty = convertToBaseUnit(qty, containerUnit);
  if (baseQty === 0) return 0;

  return containerPrice / baseQty;
}
```

### 3.3 Actualización de App.svelte

```javascript
// Importar nueva función
import {
  calculateIngredientCost,
  calculateCostFromContainer,
  getUnitCategory,
} from "./lib/priceCalculator.js";

// Modificar función de cálculo total
function getTotal(ingredients) {
  return ingredients.reduce((sum, ing) => {
    // Si tiene datos de contenedor, usar nuevo cálculo
    if (
      ing.containerQuantity &&
      ing.containerUnit &&
      ing.containerPrice !== undefined
    ) {
      return sum + calculateCostFromContainer(ing, ing.containerPrice);
    }

    // Fallback al cálculo legacy
    const category = getUnitCategory(ing.unit);
    if (category === "piece") {
      const price = parseFloat(ing.price) || parseFloat(ing.pricePerKgOrL) || 0;
      return sum + price;
    } else {
      const pricePerKgOrL =
        parseFloat(ing.pricePerKgOrL) || parseFloat(ing.price) || 0;
      const cost = calculateIngredientCost(ing, pricePerKgOrL);
      return sum + cost;
    }
  }, 0);
}
```

---

## 4. Conversión de Unidades

### 4.1 Flujo de Conversión

```
Receta: 250g
         ↓
   convertToBaseUnit(250, 'g') → 0.25 kg

Contenedor: 1kg
            ↓
      convertToBaseUnit(1, 'kg') → 1 kg

Costo = 0.25 × (precio / 1)
```

### 4.2 Manejo de Categorías Diferentes

Si la unidad de receta es diferente a la del contenedor (ej: receta en gramos, contenedor en libras):

```javascript
// Verificar compatibilidad de categorías
const recipeCategory = getUnitCategory(ingredient.unit);
const containerCategory = getUnitCategory(ingredient.containerUnit);

if (recipeCategory !== containerCategory && recipeCategory !== "piece") {
  // Advertencia o manejo de error
  // Por ahora, asumir que el usuario selecciona unidades compatibles
}
```

---

## 5. Pasos de Implementación

### Paso 1: Modificar priceCalculator.js

- [ ] Agregar función `calculateCostFromContainer()`
- [ ] Agregar función `getPricePerBaseUnit()`
- [ ] Agregar función `areUnitsCompatible(unit1, unit2)` para validación

### Paso 2: Modificar UnitSelect.svelte

- [ ] Agregar prop `defaultValue` para pre-seleccionar
- [ ] Agregar reactively update cuando cambia el default

### Paso 3: Modificar App.svelte - Datos

- [ ] Actualizar `newIngredient` con nuevos campos
- [ ] Actualizar `addIngredient()` para guardar nuevos campos
- [ ] Agregar lógica para auto-llenar containerUnit cuando cambia unit

### Paso 4: Modificar App.svelte - UI

- [ ] Crear nueva sección "PRESENTACIÓN EN EL SUPERMERCADO"
- [ ] Agregar campos: containerQuantity (QuantityInput), containerUnit (UnitSelect), containerPrice (input number)
- [ ] Agregar estilos para la nueva sección
- [ ] Hacer el layout responsivo

### Paso 5: Actualizar funciones de display

- [ ] Actualizar `getIngredientDisplayPrice()` para usar nuevo cálculo
- [ ] Actualizar `getPriceLabel()` - cambiar a "Precio del contenedor ($)"
- [ ] Agregar mostrar info de contenedor en la lista de ingredientes (opcional)

---

## 6. Ejemplos de Uso

### Ejemplo 1: Harina

```
Receta: 250g de harina
Contenedor: 1kg - $15.00
Costo: (250 / 1000) × $15 = $3.75
```

### Ejemplo 2: Leche

```
Receta: 500ml de leche
Contenedor: 1L - $12.00
Costo: (0.5 / 1) × $12 = $6.00
```

### Ejemplo 3: Huevos (pieza)

```
Receta: 3 huevos
Contenedor: 1 doc (12 unidades) - $24.00
Costo: (3 / 12) × $24 = $6.00
```

### Ejemplo 4: Cambio de unidad

```
Receta: 500g de azúcar
Contenedor: 1kg - $18.00 (el usuario cambió de g a kg)
Costo: (500 / 1000) × $18 = $9.00
```

---

## 7. Compatibilidad hacia Atrás

Para recetas existentes que no tienen los nuevos campos:

- Verificar si `containerQuantity` existe
- Si no existe, usar el cálculo legacy con `pricePerKgOrL`
- Mostrar un aviso en la UI para que el usuario actualice los datos (opcional)

---

## 8. Consideraciones Adicionales

### 8.1 Validaciones

- Container quantity debe ser > 0
- Container price debe ser >= 0
- Las unidades deben ser compatibles (misma categoría)

### 8.2 UX

- Cuando se selecciona una unidad en la receta, el containerUnit debería auto-llenarse
- El usuario puede cambiar el containerUnit si el contenedor usa otra unidad
- Mostrar un indicador visual de "precio por unidad" calculado (ej: "$15/kg")

### 8.3 Migración de Datos

- Los datos existentes en localStorage mantendrán `pricePerKgOrL`
- El sistema detectará que no hay container fields y usará el cálculo legacy
