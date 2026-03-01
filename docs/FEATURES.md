# Características de Chef Mate

## Versión Actual: 1.0.0

---

## Funcionalidades Principales

### ✅ Gestión de Recetas

| Característica  | Descripción                     | Estado |
| --------------- | ------------------------------- | ------ |
| Crear receta    | Nueva receta con nombre         | ✅     |
| Listar recetas  | Ver todas las recetas guardadas | ✅     |
| Eliminar receta | Remover receta completa         | ✅     |
| Editar nombre   | Modificar nombre de receta      | ✅     |

### ✅ Gestión de Ingredientes

| Característica        | Descripción                              | Estado |
| --------------------- | ---------------------------------------- | ------ |
| Agregar ingrediente   | Añadir nuevo ingrediente a receta        | ✅     |
| Eliminar ingrediente  | Remover ingrediente de receta            | ✅     |
| Editar ingrediente    | Modificar cantidad, unidad, precio       | ✅     |
| Lista de ingredientes | Ver todos los ingredientes de una receta | ✅     |

### ✅ Sistema de Precios

| Característica        | Descripción                             | Estado |
| --------------------- | --------------------------------------- | ------ |
| Precio por contenedor | Basado en presentación del supermercado | ✅     |
| Cálculo automático    | Costo se calcula al instante            | ✅     |
| Total de receta       | Suma de todos los ingredientes          | ✅     |
| Compatibilidad legacy | Recetas antiguas sin contenedor         | ✅     |

### ✅ Unidades de Medida

| Categoría | Unidades Soportadas |
| --------- | ------------------- |
| Peso      | kg, g, lb, oz       |
| Volumen   | L, mL, gal, qt, cup |
| Pieza     | pza, doc, par       |

### ✅ Interfaz de Usuario

| Característica       | Descripción                          | Estado |
| -------------------- | ------------------------------------ | ------ |
| Modo oscuro          | Toggle para tema oscuro/claro        | ✅     |
| Diseño responsivo    | Se adapta a móviles y desktop        | ✅     |
| Validación de inputs | Solo números positivos en cantidades | ✅     |
| Feedback visual      | Indicadores de interacción           | ✅     |

### ✅ Persistencia

| Característica          | Descripción                              | Estado |
| ----------------------- | ---------------------------------------- | ------ |
| Guardado automático     | localStorage se actualiza constantemente | ✅     |
| Carga automática        | Recupera datos al iniciar                | ✅     |
| Compatibilidad de datos | Manejo de formatos antiguos y nuevos     | ✅     |

---

## Flujo de Usuario

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   HOME   │───>│  CREATE  │───>│INGREDIENTS│───>│ RECIPES  │
│          │    │          │    │           │    │          │
│ + Nueva  │    │  Nombre  │    │  Agregar  │    │  Ver     │
│   Receta │    │  Receta  │    │  Items    │    │  Lista   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## Captura de Datos de Ingrediente

### Campos Obligatorios

1. **Nombre del ingrediente** (string)
   - Ej: "Harina", "Leche", "Huevos"

2. **Cantidad en receta** (number)
   - Ej: 250, 500, 3

3. **Unidad de receta** (select)
   - g, kg, L, mL, pza, etc.

4. **Cantidad del contenedor** (number)
   - Ej: 1, 500, 1000

5. **Unidad del contenedor** - g, (select)
   kg, L, mL, pza, etc.

6. **Precio del contenedor** (number)
   - Ej: 15.00, 25.50

---

## Ejemplos de Uso

### Ejemplo 1: Harina

```
Receta: 250g de harina
Contenedor: 1kg - $15.00
Costo: (250 / 1000) × $15 = $3.75
```

### Ejemplo 2: Leche

```
Receta: 500mL de leche
Contenedor: 1L - $12.00
Costo: (0.5 / 1) × $12 = $6.00
```

### Ejemplo 3: Huevos

```
Receta: 3 huevos
Contenedor: 1 doc (12 pza) - $24.00
Costo: (3 / 12) × $24 = $6.00
```

---

## Funcionalidades Futuras (Roadmap)

### Versión 1.1.0

- [ ] Editar nombre de receta
- [ ] Duplicar receta
- [ ] Ordenar ingredientes por nombre/costo

### Versión 1.2.0

- [ ] Exportar recetas (JSON)
- [ ] Importar recetas
- [ ] Categorías de recetas

### Versión 2.0.0

- [ ] TypeScript
- [ ] Soporte multi-moneda
- [ ] Tema personalizable
- [ ] PWA offline

---

## Limitaciones Conocidas

1. **Sin sincronización en la nube** - Datos solo en localStorage
2. **Sin autenticación** - App de uso personal
3. **Sin soporte para recetas compartidas** - Solo local
4. **Moneda fija** - USD (configurable en código)

---

## Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para historial completo de versiones.
