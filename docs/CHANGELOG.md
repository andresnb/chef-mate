# Changelog - Chef Mate

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [1.0.0] - 2026-04-09

### 🎉 Lanzamiento oficial

Chef Mate es una Progressive Web App (PWA) para calcular el costo real de tus recetas
a partir de los precios de contenedores del supermercado.

Esta versión consolida todas las funcionalidades desarrolladas desde el prototipo inicial
hasta una aplicación completa con autenticación, almacenamiento en la nube y diseño moderno.

---

## [0.9.0] - 2026-04-09

### Agregado — Firebase Auth, Firestore y PWA install (`5850e55`)

- **Firebase Authentication** — Login con Google y email/contraseña mediante `useAuth` composable
- **Firestore database** — Persistencia en la nube con colecciones por usuario (`users/{uid}/recipes`, `users/{uid}/purchases`)
- **Módulo `firebase/config.js`** — Configuración centralizada del SDK de Firebase
- **Módulo `firebase/firestore.js`** — CRUD genérico sobre Firestore (add, update, delete, query)
- **Módulo `firebase/migration.js`** — Migración automática de datos de localStorage a Firestore al iniciar sesión por primera vez
- **Pantalla `LoginScreen.svelte`** — UI de login/registro con formularios de email y botón de Google
- **Componente `InstallPrompt.svelte`** — Prompt de instalación PWA para Chrome/Edge con instrucciones para iOS Safari
- **Service Worker (`sw.js`)** — Caché offline de assets estáticos con estrategia cache-first
- **Firestore Rules** — Reglas de seguridad: solo lectura/escritura sobre documentos propios del usuario autenticado

### Cambiado

- `useRecipes` refactorizado para leer/escribir en Firestore cuando hay sesión activa, con fallback a localStorage
- `usePurchases` refactorizado para persistir historial de compras en Firestore por usuario
- `useUserSettings` ahora sincroniza configuración (hourlyRate) con Firestore
- `SettingsModal` ampliado con sección de cuenta: muestra email, botón de cerrar sesión
- `App.svelte` ahora gestiona estado de autenticación y renderiza `LoginScreen` o la app principal

---

## [0.8.0] - 2026-04-09

### Agregado — Memoria de compras con autocompletado (`faabecf`)

- **Composable `usePurchases.svelte.js`** — Almacena historial de compras de ingredientes (nombre, marca, tienda, precio, unidad)
- **Componente `PurchaseSuggestions.svelte`** — Dropdown de sugerencias que aparece al escribir el nombre de un ingrediente, mostrando compras anteriores con marca, tienda y precio
- **Campos de marca y tienda** en `IngredientForm` — Nuevos inputs opcionales para registrar de dónde viene cada ingrediente
- **Auto-llenado** — Al seleccionar una sugerencia, se rellenan automáticamente precio, unidad, cantidad del contenedor, marca y tienda
- **Gestión de historial** en `SettingsModal` — Botón para limpiar todo el historial de compras guardado

---

## [0.7.0] - 2026-04-09

### Agregado — Rediseño de UI con sistema de diseño moderno (`3f0be03`)

- **Arquitectura de componentes** — Descomposición de `App.svelte` (1500+ líneas) en componentes reutilizables:
  - `Header.svelte` — Barra superior con navegación, título dinámico y toggle de tema
  - `ActionCard.svelte` — Tarjetas de acción con icono, título y descripción
  - `RecipeCard.svelte` — Tarjeta de receta con nombre, cantidad de ingredientes y costo total
  - `IngredientForm.svelte` — Formulario completo de ingrediente con campos de contenedor
  - `IngredientItem.svelte` — Línea de ingrediente con nombre, cantidad y costo
  - `TotalBar.svelte` — Barra fija inferior con costo de ingredientes, mano de obra y total
  - `Modal.svelte` — Modal genérico reutilizable con overlay y animaciones
  - `ConfirmModal.svelte` — Modal de confirmación para acciones destructivas
  - `EmptyState.svelte` — Estado vacío con icono y mensaje personalizable
  - `Toast.svelte` — Notificaciones toast con auto-dismiss
  - `SettingsModal.svelte` — Modal de configuración de tarifa por hora
- **Pantallas** — Separación en screens dedicados:
  - `HomeScreen.svelte` — Pantalla principal con acciones rápidas
  - `CreateScreen.svelte` — Crear nueva receta con nombre y tiempo de preparación
  - `IngredientsScreen.svelte` — Gestión de ingredientes de una receta
  - `RecipesScreen.svelte` — Listado de todas las recetas guardadas
- **Composables** — Lógica extraída en composables reactivos (Svelte 5 Runes):
  - `useRecipes.svelte.js` — CRUD de recetas con persistencia en localStorage
  - `useNavigation.svelte.js` — Navegación entre pantallas con historial
  - `useDarkMode.svelte.js` — Toggle de tema con persistencia
  - `useUserSettings.svelte.js` — Configuración de usuario (tarifa por hora)
  - `useToast.svelte.js` — Sistema de notificaciones
- **Utilidades**:
  - `utils/format.js` — Formateo de moneda y fechas
  - `utils/validation.js` — Validación de formularios con mensajes de error

### Cambiado — Sistema de diseño

- **Glassmorphism** — Tarjetas con `backdrop-filter: blur`, bordes semi-transparentes y sombras suaves
- **Gradientes** — Botones CTA con gradientes lineales y efecto hover con brillo
- **Tokens CSS** — Variables de diseño centralizadas: colores, sombras, radios, transiciones
- **Iconos SVG inline** — Reemplazo de emojis por iconos SVG nativos sin dependencias
- **Animaciones spring** — Transiciones de entrada/salida con `svelte/transition`
- **Tipografía refinada** — Jerarquía visual mejorada con pesos y tamaños ajustados

---

## [0.6.0] - 2026-03-01

### Agregado — Costo de mano de obra y migración a Svelte 5 Runes (`e32afc8`)

- **Costo de mano de obra** — Cálculo automático basado en tarifa por hora y tiempo de preparación de la receta
- **Modal de Settings** — Configuración de tarifa por hora (`hourlyRate`) con persistencia en localStorage
- **Total desglosado** — La barra de totales ahora muestra: costo de ingredientes + mano de obra = total
- **Migración a Svelte 5 Runes** — Reemplazo de `let` reactivo por `$state()`, `$:` por `$derived()` y `$effect()`

---

## [0.5.0] - 2026-02-28

### Agregado — Documentación y release (`bb742dd`)

- **README.md** — Documentación completa del proyecto con descripción, features e instrucciones
- **docs/ARCHITECTURE.md** — Documentación de la arquitectura del proyecto
- **docs/FEATURES.md** — Listado detallado de funcionalidades
- **docs/CHANGELOG.md** — Este archivo, changelog del proyecto
- Versión en `package.json` actualizada a `1.0.0`

---

## [0.4.0] - 2026-02-28

### Agregado — Favicon y PWA (`b66f31e`)

- **Favicon** — `favicon.ico`, `favicon.svg` y `apple-touch-icon.png`
- **Web App Manifest** (`site.webmanifest`) — Nombre, iconos 192x192 y 512x512, theme color, background color
- **Meta tags PWA** en `index.html` — `theme-color`, `apple-touch-icon`, link al manifest
- Eliminado `svelte.svg` por defecto

---

## [0.3.0] - 2026-02-28

### Agregado — Precios por contenedor con conversión de unidades (`3872ee3`)

- **Motor de cálculo `priceCalculator.js`** — Lógica completa de cálculo de costo por ingrediente:
  - Conversión entre unidades de la misma categoría (peso, volumen, pieza)
  - Cálculo: `(cantidad usada / cantidad contenedor) × precio contenedor`
  - Soporte para unidades mixtas (ej: receta en gramos, contenedor en kilogramos)
  - Compatibilidad hacia atrás con recetas legacy sin datos de contenedor
- **Campos de contenedor en el formulario** — Cantidad, unidad y precio del contenedor del supermercado
- **Auto-fill de unidad** — La unidad del contenedor se pre-llena con la misma unidad del ingrediente
- **Etiqueta de precio dinámica** — Cambia entre "Precio por kg", "Precio por L" o "Precio por pieza" según la unidad seleccionada
- **Plan de implementación** (`plans/container-fields-plan.md`)

### Cambiado

- `units.js` ampliado con factores de conversión y funciones helper (`getUnitByValue`, `getUnitCategory`)
- `QuantityInput` y `UnitSelect` actualizados para soportar campos de contenedor

---

## [0.2.0] - 2026-02-28

### Agregado — Fracciones, unidades y modo oscuro

#### Modo oscuro (`23a98ab`)
- **Toggle de tema** claro/oscuro en el header
- **Persistencia** del tema seleccionado en localStorage
- **Variables CSS** para ambos temas con transición suave
- Estilos de scrollbar personalizados para modo oscuro

#### Input de cantidades y unidades (`f9ccf36`)
- **Componente `QuantityInput.svelte`** — Input numérico con botones de fracciones rápidas (¼, ½, ¾, ⅓, ⅔)
- **Componente `UnitSelect.svelte`** — Selector de unidad agrupado por categoría (peso, volumen, pieza)
- **Módulo `units.js`** — Definición de 12 unidades de medida con sus factores de conversión

---

## [0.1.0] - 2026-02-28

### Agregado — Gestión de recetas (`752bf4a`)

- **Navegación multi-pantalla** — Home, crear receta, ingredientes, lista de recetas
- **CRUD de recetas** — Crear, listar y eliminar recetas con persistencia en localStorage
- **Gestión de ingredientes** — Agregar y eliminar ingredientes con nombre, cantidad y precio
- **Cálculo de costo total** — Suma automática del costo de todos los ingredientes
- **Diseño responsivo** — Layout adaptable a móvil y desktop con CSS nativo

---

## [0.0.1] - 2026-02-28

### Interno — Prototipo inicial (`b06e159`)

- Scaffold del proyecto con Svelte 5 + Vite 7
- Estructura básica de `App.svelte` con estado reactivo
- Configuración de `index.html` y `app.css` base

---

## Formato de versiones

Usamos [Semantic Versioning](https://semver.org/lang/es/):

- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs compatibles

---

## Cómo contribuir

1. Crea un branch: `git checkout -b feature/nueva-caracteristica`
2. Commit tus cambios: `git commit -m 'Agregar nueva característica'`
3. Push al branch: `git push origin feature/nueva-caracteristica`
4. Abre un Pull Request

---

## Rutas de archivos relevantes

- Código fuente: [`../src/`](../src/)
- Planes: [`../plans/`](../plans/)
- Configuración: [`../package.json`](../package.json)
