# AstroRatingProject - Widget de Calificación con Estrellas

## Funcionalidades Implementadas

### Componente RatingStars (React Native)
- ✅ Calificación de 1 a 5 estrellas
- ✅ Estado interno (Stateful Widget)
- ✅ Estilos personalizables (colores, tamaño)
- ✅ Evento `onRatingChange`
- ✅ Animación al seleccionar estrellas

### Widget iOS (WidgetKit)
- ✅ Widget interactivo con estrellas (iOS 17+)
- ✅ Sincronización con la app principal
- ✅ Persistencia de calificación

### Sincronización y Persistencia
- ✅ App Group compartido para sincronizar datos entre app y widget
- ✅ Cambios en el widget se reflejan en la app en tiempo real
- ✅ Cambios en la app actualizan el widget automáticamente
- ✅ Persistencia al cerrar/abrir la app

## Configuración del Widget (Pasos finales)

### 1. Configurar App Groups en Xcode

Para que la sincronización funcione correctamente, necesitas configurar App Groups:

1. Abre el proyecto en Xcode:
   ```bash
   open ios/AstroRatingProject.xcworkspace
   ```

2. Selecciona el target **AstroRatingProject** (app principal)
   - Ve a **Signing & Capabilities**
   - Haz clic en **+ Capability**
   - Agrega **App Groups**
   - Marca la casilla: `group.codeyosef.AstroRatingProject`

3. Selecciona el target **widget** (extensión del widget)
   - Ve a **Signing & Capabilities**
   - Haz clic en **+ Capability**
   - Agrega **App Groups**
   - Marca la casilla: `group.codeyosef.AstroRatingProject`

### 2. Agregar el Widget a la pantalla de inicio

1. Ejecuta la app en el simulador:
   ```bash
   npx expo run:ios
   ```

2. En el simulador:
   - Mantén presionada la pantalla de inicio
   - Toca el ícono **+** en la esquina superior izquierda
   - Busca "AstroRatingProject"
   - Selecciona el widget **Rating Stars**
   - Elige el tamaño (Small o Medium)
   - Toca **Add Widget**

### 3. Probar la Sincronización

1. **Desde la app:**
   - Abre la app
   - Toca las estrellas para calificar (tab "Calificar")
   - Verás que el widget se actualiza automáticamente

2. **Desde el widget:**
   - Toca una estrella en el widget
   - Abre la app
   - Verás que la calificación se refleja en la app

3. **Persistencia:**
   - Califica desde la app o el widget
   - Cierra el simulador (Cmd+Q)
   - Vuelve a abrir la app
   - La calificación se mantiene guardada

## Estructura del Proyecto

```
app/
  (tabs)/
    index.tsx         # Tab principal con calificación sincronizada
    explore.tsx       # Tab con calificaciones secundarias (producto/servicio)

components/
  rating-stars.tsx    # Componente reutilizable de estrellas

modules/
  shared-rating/      # Módulo nativo para sincronización
    index.ts          # API JavaScript
    src/
      SharedRatingModule.swift  # Implementación nativa iOS

targets/
  widget/
    widgets.swift     # Widget interactivo de calificación
    index.swift       # Registro de widgets
```

## API del Componente RatingStars

```tsx
<RatingStars
  initialRating={0}           // Calificación inicial (0-5)
  maxStars={5}                // Número máximo de estrellas
  starSize={42}               // Tamaño de las estrellas
  filledColor="#FFB300"       // Color de estrellas llenas
  emptyColor="#B0B0B0"        // Color de estrellas vacías
  onRatingChange={(r) => {}}  // Callback al cambiar calificación
  accessibilityLabel="Rating" // Etiqueta de accesibilidad
/>
```

## Tecnologías Utilizadas

- **React Native** - Framework de la app
- **Expo** - Toolchain y desarrollo
- **WidgetKit** - Widgets nativos de iOS
- **App Intents** - Interactividad del widget (iOS 17+)
- **UserDefaults con App Groups** - Almacenamiento compartido
- **AsyncStorage** - Persistencia de calificaciones secundarias
- **Expo Modules** - Módulo nativo personalizado

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npx expo start

# Build iOS
npx expo run:ios

# Limpiar y rebuild
npx expo prebuild --clean
npx expo run:ios

# Lint
npm run lint
```

## Notas Técnicas

- El widget requiere iOS 17+ para la interactividad (App Intents)
- La sincronización usa UserDefaults con App Group compartido
- Las calificaciones secundarias usan AsyncStorage local
- El módulo nativo incluye fallback a AsyncStorage si no está disponible
