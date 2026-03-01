# Arquitectura de Chef Mate

## Visión General

Chef Mate es una aplicación web progresiva (PWA) desarrollada con Svelte 5 y Vite, diseñada para calcular el costo de recetas basándose en los precios de los contenedores del supermercado.

## Stack Tecnológico

```
┌─────────────────────────────────────────┐
│              UI Layer                   │
│         (Svelte 5 Components)            │
├─────────────────────────────────────────┤
│           Logic Layer                   │
│      (priceCalculator.js, units.js)     │
├─────────────────────────────────────────┤
│         Storage Layer                   │
│           (localStorage)                │
└─────────────────────────────────────────┘
```

## Estructura de Archivos

```
src/
├── App.svelte              # Componente raíz - maneja toda la lógica de la app
├── main.js                 # Entry point de Svelte
├── app.css                 # Estilos globales
└── lib/
    ├── priceCalculator.js  # ✓ Calcula costos de ingredientes
    ├── units.js            # ✓ Define unidades de medida
    ├── QuantityInput.svelte # ✓ Input validado para cantidades
    └── UnitSelect.svelte   # ✓ Selector de unidades
```

## Componentes Principales

### 1. App.svelte

**Responsabilidades:**

- Gestión de estado global (pantallas, recetas, modo oscuro)
- Persistencia en localStorage
- Lógica de negocio (agregar/edit/eliminar recetas)
- Cálculo de totales

**Estado principal:**

```javascript
let currentScreen = "home"; // 'home' | 'create' | 'ingredients' | 'recipes'
let recipes = []; // Array de recetas
let isDarkMode = false; // Tema oscuro
```

### 2. priceCalculator.js

**Funciones exportadas:**

| Función                                                                                      | Descripción                                        |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `calculateIngredientCost(ingredient, pricePerKgOrL)`                                         | Calcula costo legacy                               |
| `calculateContainerCost(recipeQty, recipeUnit, containerQty, containerUnit, containerPrice)` | Calcula costo basado en contenedor                 |
| `getUnitCategory(unit)`                                                                      | Retorna categoría: 'weight' \| 'volume' \| 'piece' |
| `getUnitByValue(value)`                                                                      | Obtiene unidad por su valor                        |

### 3. units.js

Define las unidades disponibles organizadas por categoría:

```javascript
export const units = {
  weight: ["kg", "g", "lb", "oz"],
  volume: ["L", "mL", "gal", "qt", "cup"],
  piece: ["pza", "doc", "par"],
};
```

### 4. QuantityInput.svelte

Componente de input con validación:

- Solo permite números positivos
- Maneja entrada de teclado
- Soporta atributos de Svelte 5

### 5. UnitSelect.svelte

Dropdown para selección de unidades:

- Categorías: peso, volumen, pieza
- Soporta valor por defecto

## Flujo de Datos

```
User Input → newIngredient state → addIngredient()
                                         ↓
                              Validación de datos
                                         ↓
                              Guardar en recipes array
                                         ↓
                              Persistir en localStorage
                                         ↓
                              Recalcular totales
```

## Sistema de Cálculo de Precios

### Modo Legacy (sin contenedor)

```
Costo = quantity × pricePerKgOrL
```

### Modo Contenedor (recomendado)

```
Costo = (quantityReceta / quantityContenedor) × precioContenedor
```

Ejemplo:

- Receta: 250g de harina
- Contenedor: 1kg ($15.00)
- Costo = (250 / 1000) × $15 = $3.75

## Persistencia

Se utiliza `localStorage` con la siguiente estructura:

```javascript
{
  recipes: [
    {
      id: "timestamp-random",
      name: "Nombre de receta",
      ingredients: [
        {
          id: "...",
          name: "harina",
          quantity: "250",
          unit: "g",
          containerQuantity: "1",
          containerUnit: "kg",
          containerPrice: 15.0,
        },
      ],
    },
  ];
}
```

## Modo Oscuro

El tema oscuro se maneja mediante:

- CSS custom properties en `app.css`
- Estado `isDarkMode` en App.svelte
- Toggle button en la UI

## Decisiones de Diseño

### ¿Por qué Svelte 5?

- Bundle más pequeño
- Mejor rendimiento
- Sintaxis más limpia con runes

### ¿Por qué localStorage?

- Sin backend necesario
- Datos locales del usuario
- Simple de implementar

### ¿Por qué no SvelteKit?

- Proyecto simple que no requiere routing
- Solo una página principal
- Fácil de migrar si es necesario

## Planos Futuros (Véase /plans)

- [Container Fields Plan](../plans/container-fields-plan.md) - Implementado
- Migración a TypeScript
- Export/Import de recetas
- Soporte multi-moneda
