# Plan: Costo de Mano de Obra (Labor Cost)

## Objetivo

Implementar el cálculo del **Costo de Mano de Obra** utilizando el método de "Tarifa por Hora Fija" en ChefMate.

---

## Requisitos Funcionales

### 1. Estado Global: userSettings

- Objeto con estructura: `{ hourlyRate: number }`
- Persistencia automática en localStorage mediante `$effect`

### 2. Campo prepTimeMinutes

- Cada receta tendrá un nuevo campo `prepTimeMinutes` (integer, minutos)
- Valor inicial: 0

### 3. Pantalla Home - Modal de Settings

- Botón de "Ajustes" (ícono ⚙️) junto al toggle de modo oscuro
- Modal con:
  - Input numérico para "Valor de tu hora de trabajo ($)"
  - Enlazado con `bind:value={userSettings.hourlyRate}`

### 4. Pantalla Editor (Ingredientes)

- Input numérico para "Tiempo de preparación (minutos)"
- Ubicación: En el header de la receta, junto al nombre

### 5. Barra de Total - Desglose

```
┌─────────────────────────────────────────┐
│  Costo Ingredientes:    $X.XX           │
│  Mano de Obra:          $Y.YY           │
│  ─────────────────────────────         │
│  Costo Total:           $Z.ZZ           │
└─────────────────────────────────────────┘
```

---

## Fórmulas de Cálculo

### Costo de Mano de Obra

```javascript
const laborCost = $derived(
  userSettings.hourlyRate * (recipe.prepTimeMinutes / 60) || 0,
);
```

### Costo Total

```javascript
const totalRecipeCost = $derived(totalIngredientsCost + laborCost);
```

---

## Estructura de Cambios

### App.svelte - Script Section

```javascript
// ===== 1. Estado Global: userSettings =====
let userSettings = $state({ hourlyRate: 0 });

// ===== 2. Effect para persistencia =====
$effect(() => {
  localStorage.setItem("chefmate-user-settings", JSON.stringify(userSettings));
});

// ===== 3. Cargar userSettings desde localStorage (en onMount) =====
const savedSettings = localStorage.getItem("chefmate-user-settings");
if (savedSettings) {
  try {
    const parsed = JSON.parse(savedSettings);
    userSettings.hourlyRate = parsed.hourlyRate || 0;
  } catch (e) {
    userSettings.hourlyRate = 0;
  }
}

// ===== 4. Modelo de receta actualizado =====
function createRecipe() {
  const recipe = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: newRecipeName.trim(),
    prepTimeMinutes: 0, // ← Nuevo campo
    ingredients: [],
    createdAt: new Date().toISOString(),
  };
  // ...
}

// ===== 5. Funciones derivadas para costos =====
let totalIngredientsCost = $derived(getTotal(currentRecipe?.ingredients || []));
let laborCost = $derived(
  userSettings.hourlyRate * ((currentRecipe?.prepTimeMinutes || 0) / 60) || 0,
);
let totalRecipeCost = $derived(totalIngredientsCost + laborCost);
```

### Manejo de Casos Nulos/NaN

```javascript
// En las funciones derivadas, usar valores por defecto
let laborCost = $derived(
  (userSettings.hourlyRate || 0) *
    ((currentRecipe?.prepTimeMinutes || 0) / 60) || 0,
);
```

---

## Estructura de UI

### Pantalla Home

```
┌─────────────────────────────────────────┐
│ ←                    ChefMate      🌙 ⚙️ │
├─────────────────────────────────────────┤
│              👨‍🍳                        │
│         Tu bitácora de costos          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ➕  Nueva Receta                │   │
│  │    Crear una receta desde cero  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📖  Mis Recetas                 │   │
│  │    X recetas guardadas          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            ⚙️ Ajustes                    │
│  ───────────────────────────────────    │
│  Valor de tu hora de trabajo ($)        │
│  ┌─────────────────────────────────┐    │
│  │ 25.00                          │    │
│  └─────────────────────────────────┘    │
│                                         │
│         [ Cerrar ]                       │
└─────────────────────────────────────────┘
```

### Pantalla Editor (Ingredientes)

```
┌─────────────────────────────────────────┐
│ ←                   🍪 Torta Chocolate   │
│                              🗑️         │
├─────────────────────────────────────────┤
│  ⏱️ Tiempo de preparación:             │
│  ┌───────┐ minutos                      │
│  │  45   │                              │
│  └───────┘                              │
├─────────────────────────────────────────┤
│  [Agregar ingrediente form]             │
├─────────────────────────────────────────┤
│  • Harina 250g / 1kg      $3.75    ×   │
│  • Azúcar 200g / 1kg      $2.50    ×   │
│  • Huevos 4 pza            $4.00    ×   │
├─────────────────────────────────────────┤
│  Costo Ingredientes:     $10.25          │
│  Mano de Obra:           $18.75          │
│  ─────────────────────────────          │
│  Costo Total:            $29.00          │
└─────────────────────────────────────────┘
```

---

## Checklist de Implementación

- [ ] 1. Agregar estado `userSettings` con `$state`
- [ ] 2. Agregar `$effect` para persistencia en localStorage
- [ ] 3. Cargar `userSettings` desde localStorage en `onMount`
- [ ] 4. Agregar campo `prepTimeMinutes` al modelo de receta
- [ ] 5. Crear Modal de Settings en Home screen
- [ ] 6. Agregar input de prepTimeMinutes en pantalla Editor
- [ ] 7. Implementar `$derived` para laborCost y totalRecipeCost
- [ ] 8. Actualizar barra de total con desglose
- [ ] 9. Agregar estilos CSS para el Modal y nueva UI
- [ ] 10. Probar casos nulos/NaN

---

## Notas Adicionales

1. **Coherencia visual**: Usar las variables CSS existentes (`--color-primary`, `--color-muted`, etc.)
2. **Accesibilidad**: Labels claros en todos los inputs
3. **Validación**: Manejar inputs vacíos como 0
4. **Compatibilidad**: Mantener retrocompatibilidad con recetas existentes (prepTimeMinutes = 0 por defecto)
