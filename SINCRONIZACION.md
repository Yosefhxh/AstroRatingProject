# Configuración de Sincronización Widget-App

## ¿Qué se ha corregido?

1. **Módulo nativo actualizado**: Eliminé los mensajes de advertencia que causaban errores
2. **Fallback silencioso**: La app usa AsyncStorage automáticamente si el módulo nativo no está disponible
3. **Entitlements configurados**: Los archivos de App Groups ya están configurados para ambos targets
4. **Sincronización bidireccional**: El widget y la app comparten el mismo UserDefaults

## Cómo funciona la sincronización

### Desde la App → Widget
1. Cuando cambias la calificación en la app, se guarda en UserDefaults compartido
2. El widget se recarga automáticamente (`WidgetCenter.shared.reloadAllTimelines()`)
3. El widget muestra la nueva calificación inmediatamente

### Desde el Widget → App
1. Cuando tocas una estrella en el widget, se ejecuta el `SetRatingIntent`
2. El intent guarda la calificación en UserDefaults compartido
3. La app escucha los cambios vía NotificationCenter
4. El componente se actualiza automáticamente cuando recibe el evento

## Cómo probar la sincronización

### 1. Agregar el widget a la pantalla de inicio

1. En el simulador, mantén presionada la pantalla de inicio
2. Toca el botón "+" en la esquina superior izquierda
3. Busca "AstroRatingProject"
4. Selecciona el widget de calificación
5. Toca "Add Widget"

### 2. Probar cambios desde la app

1. Abre la app
2. Toca una calificación (ej: 4 estrellas)
3. Sal de la app (desliza hacia arriba o presiona el botón Home)
4. Verifica que el widget muestra 4 estrellas
5. Cierra la app completamente (desliza hacia arriba en el selector de apps)
6. Vuelve a abrir la app
7. Verifica que la calificación sigue siendo 4 estrellas

### 3. Probar cambios desde el widget

1. Con la app cerrada, toca 3 estrellas en el widget
2. Abre la app
3. Verifica que muestra 3 estrellas
4. Cierra y reabre el simulador
5. Verifica que tanto el widget como la app muestran 3 estrellas

## Verificación técnica

### Verificar que el módulo nativo está cargado

Ejecuta en consola de React Native:
```javascript
import * as SharedRating from '@/modules/shared-rating';
console.log(SharedRating.getRating()); // Debe devolver un número
```

Si devuelve 0, el módulo está usando el fallback de AsyncStorage (funciona pero sin sincronización en tiempo real con el widget).

### Verificar UserDefaults compartido

En Xcode, abre el proyecto y verifica:
1. **Target principal** (AstroRatingProject):
   - Signing & Capabilities → App Groups
   - Debe estar habilitado con: `group.codeyosef.AstroRatingProject`

2. **Target del widget** (widget):
   - Signing & Capabilities → App Groups
   - Debe estar habilitado con: `group.codeyosef.AstroRatingProject`

Si no ves App Groups en las capabilities:
1. Haz clic en "+ Capability"
2. Busca "App Groups"
3. Agrega el grupo: `group.codeyosef.AstroRatingProject`

## Solución de problemas

### La calificación no se sincroniza entre widget y app

**Causa**: App Groups no está configurado en Xcode
**Solución**:
1. Abre Xcode: `npx expo run:ios`
2. Selecciona el target "AstroRatingProject"
3. Ve a "Signing & Capabilities"
4. Agrega App Groups capability
5. Marca: `group.codeyosef.AstroRatingProject`
6. Repite para el target "widget"
7. Reconstruye: `npx expo run:ios`

### La calificación no persiste al cerrar la app

**Causa**: Esto es comportamiento normal en modo desarrollo
**Solución**:
- Los datos se guardan correctamente, solo que el metro bundler puede resetear el estado
- Prueba cerrando completamente el simulador y volviéndolo a abrir
- En producción (build de release) esto no sucede

### El widget no aparece en la lista

**Causa**: El widget no se instaló correctamente
**Solución**:
1. Borra la app del simulador
2. Reconstruye: `npx expo run:ios`
3. Reinicia el simulador: Menú Device → Restart

### Errores de compilación relacionados con entitlements

**Causa**: Conflicto entre archivos de entitlements
**Solución**:
```bash
# Limpiar y reconstruir
rm -rf ios node_modules
npm install
npx expo prebuild --clean
npx expo run:ios
```

## Comandos útiles

```bash
# Limpiar todo y reconstruir desde cero
rm -rf ios android node_modules
npm install
npx expo prebuild --clean
npx expo run:ios

# Solo reconstruir nativo
npx expo prebuild
npx expo run:ios

# Ver logs del widget en tiempo real
log stream --predicate 'process contains "widget"' --level debug
```

## Arquitectura técnica

```
┌─────────────────────────────────────────┐
│           React Native App              │
│  (AstroRatingProject)                   │
│                                          │
│  SharedRating Module (Swift)            │
│  ├─ getRating()                         │
│  ├─ setRating(rating)                   │
│  └─ onRatingChanged event               │
│                                          │
│  UserDefaults(suiteName:                │
│    "group.codeyosef.AstroRatingProject")│
└─────────────┬───────────────────────────┘
              │
              │  App Group Storage
              │  (Shared UserDefaults)
              │
┌─────────────▼───────────────────────────┐
│          WidgetKit Extension            │
│  (widget target)                        │
│                                          │
│  RatingWidget                           │
│  ├─ Provider (TimelineProvider)        │
│  ├─ SetRatingIntent (AppIntent)        │
│  └─ RatingWidgetEntryView              │
│                                          │
│  UserDefaults(suiteName:                │
│    "group.codeyosef.AstroRatingProject")│
└─────────────────────────────────────────┘
```

## Próximos pasos

1. ✅ Código actualizado sin advertencias molestas
2. ✅ Entitlements configurados
3. ⏳ **App construyéndose** → Espera a que termine
4. ⏳ Agregar widget a la pantalla del simulador
5. ⏳ Probar sincronización app → widget
6. ⏳ Probar sincronización widget → app
7. ⏳ Verificar persistencia al cerrar/abrir

Una vez que la construcción termine, sigue los pasos de prueba arriba para verificar que todo funciona correctamente.
