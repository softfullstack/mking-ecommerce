# Personalización de Productos - MKing E-commerce

## Descripción

La funcionalidad de personalización permite a los usuarios agregar logos personalizados a los productos del carrito, especialmente chalecos de seguridad. Los usuarios pueden posicionar, redimensionar, rotar y ajustar la opacidad de los logos.

## Características

### 🎨 Funcionalidades del Customizer
- **Agregar logos**: Subir imágenes desde el dispositivo
- **Posicionamiento**: Mover logos arrastrándolos en el canvas
- **Redimensionamiento**: Ajustar ancho y alto con controles deslizantes
- **Rotación**: Girar logos desde -180° hasta 180°
- **Opacidad**: Ajustar transparencia del 10% al 100%
- **Selección múltiple**: Gestionar varios logos en un mismo producto
- **Vista previa en tiempo real**: Ver cambios instantáneamente

### 🛒 Integración con el Carrito
- Los productos personalizados se guardan en el carrito
- Las personalizaciones persisten entre sesiones
- Indicador visual de productos personalizados
- Botón de edición para modificar personalizaciones existentes

## Cómo Usar

### 1. Agregar Producto al Carrito
1. Navega a la página del producto
2. Selecciona color y talla
3. Haz clic en "Añadir al Carrito"

### 2. Personalizar Producto
1. Ve al carrito (`/carrito`)
2. Encuentra el producto que quieres personalizar
3. Haz clic en el botón de edición (ícono de lápiz)
4. Se abrirá el modal de personalización

### 3. Agregar Logo
1. Haz clic en "Agregar Logo"
2. Selecciona una imagen desde tu dispositivo
3. El logo aparecerá en el canvas
4. Haz clic en el logo para seleccionarlo

### 4. Personalizar Logo
- **Mover**: Arrastra el logo a la posición deseada
- **Redimensionar**: Usa los controles deslizantes de ancho y alto
- **Rotar**: Usa el control deslizante de rotación o los botones +/-
- **Opacidad**: Ajusta la transparencia con el control deslizante

### 5. Guardar Personalización
1. Haz clic en "Guardar Personalización"
2. Las personalizaciones se guardarán en el carrito
3. El producto mostrará un indicador de "Personalizado"

## Estructura Técnica

### Componentes
- `ProductCustomizer.tsx`: Modal principal de personalización
- `Cart.tsx`: Integración con el carrito de compras
- `CartStore.tsx`: Store para manejar personalizaciones

### Interfaces
```typescript
interface LogoCustomization {
    id: string;
    imageUrl: string;
    x: number;        // Posición X
    y: number;        // Posición Y
    width: number;    // Ancho
    height: number;   // Alto
    rotation: number; // Rotación en grados
    opacity: number;  // Opacidad (0.1 - 1.0)
}
```

### Store del Carrito
- `updateCustomizations()`: Actualiza las personalizaciones de un item
- Los items del carrito incluyen un array `customizations`
- Las personalizaciones se persisten automáticamente

## Limitaciones y Consideraciones

### Técnicas
- Tamaño máximo de imagen: Recomendado 2MB
- Formatos soportados: JPG, PNG, GIF, WebP
- Canvas: 400x500 píxeles (ajustable)
- Máximo de logos por producto: Sin límite (recomendado 5-10)

### UX
- Los logos se posicionan con precisión de píxeles
- El canvas tiene límites para evitar logos fuera de vista
- Las personalizaciones se pueden editar en cualquier momento
- Se mantiene el historial de personalizaciones

## Futuras Mejoras

### Funcionalidades Planificadas
- [ ] Plantillas predefinidas de logos
- [ ] Biblioteca de logos comunes
- [ ] Exportar imagen personalizada
- [ ] Vista 3D del producto
- [ ] Múltiples ángulos de vista
- [ ] Guardado de configuraciones favoritas

### Mejoras Técnicas
- [ ] Optimización de imágenes
- [ ] Compresión automática
- [ ] Cache de logos
- [ ] Soporte para SVG
- [ ] Responsive design mejorado

## Troubleshooting

### Problemas Comunes

**El logo no se muestra**
- Verifica que la imagen sea válida
- Asegúrate de que el formato sea soportado
- Revisa la consola del navegador

**No se puede mover el logo**
- Haz clic en el logo para seleccionarlo
- Verifica que esté dentro de los límites del canvas
- Intenta refrescar la página

**Las personalizaciones no se guardan**
- Verifica que hayas hecho clic en "Guardar Personalización"
- Revisa que el producto esté en el carrito
- Limpia el caché del navegador

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
1. Revisa este README
2. Consulta la documentación técnica
3. Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Desarrollado por**: Equipo MKing
