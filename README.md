# Chef Mate 🍳

> Calculadora de costos de recetas basada en precios de contenedores del supermercado

## Características

- 📊 Cálculo automático de costos por receta
- 🛒 Precios basados en presentación del supermercado (contenedor)
- 📱 Interfaz responsiva y ligera
- 💾 Persistencia local (localStorage)

## Tech Stack

- **Frontend**: Svelte 5 + Vite
- **Estilos**: CSS nativo
- **Almacenamiento**: localStorage

## Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Previsualizar build
npm run preview
```

## Estructura del Proyecto

```
src/
├── App.svelte              # Componente principal
├── main.js                 # Punto de entrada
├── app.css                 # Estilos globales
└── lib/
    ├── priceCalculator.js      # Lógica de cálculos de precios
    ├── units.js                 # Definiciones de unidades
    ├── QuantityInput.svelte    # Componente de entrada de cantidad
    └── UnitSelect.svelte       # Componente de selector de unidades
```

## Cómo Funciona

1. **Crear una receta**: Dale un nombre a tu receta
2. **Agregar ingredientes**: Define cantidad, unidad y precio del contenedor
3. **Calcular costo**: El sistema calcula automáticamente el costo total

### Ejemplo

```
Receta: 250g de harina
Contenedor: 1kg - $15.00
Costo: (250 / 1000) × $15 = $3.75
```

## Documentación Adicional

Consulta la carpeta `docs/` para documentación detallada:

- [docs/README.md](docs/README.md) - Índice de documentación
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitectura técnica
- [docs/FEATURES.md](docs/FEATURES.md) - Lista de características
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - Historial de cambios

## Licencia

MIT
