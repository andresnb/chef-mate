# Changelog - Chef Mate

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [1.0.0] - 2026-03-01

### Agregado

- 🎉 **Lanzamiento inicial**
- Sistema de gestión de recetas (crear, listar, eliminar)
- Sistema de ingredientes con cálculo de costos
- Campo de presentación de contenedor (precio del supermercado)
- Cálculo automático de costo por ingrediente
- Soporte para múltiples unidades de medida:
  - Peso: kg, g, lb, oz
  - Volumen: L, mL, gal, qt, cup
  - Pieza: pza, doc, par
- Modo oscuro (dark mode)
- Persistencia en localStorage
- Diseño responsivo (móvil y desktop)
- Compatibilidad hacia atrás con recetas legacy
- Validación de inputs

### Tech Stack

- Svelte 5
- Vite 7
- CSS nativo

---

## [0.0.1] - Pre-lanzamiento

### Interno

- Estructura inicial del proyecto Svelte + Vite
- Definición de unidades de medida
- Lógica básica de cálculo de precios

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
