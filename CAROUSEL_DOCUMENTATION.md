# Documentación de Carruseles de Productos

## 📋 Resumen

Se han implementado carruseles de productos para mejorar la experiencia de usuario y mostrar productos relacionados de manera más atractiva y funcional.

## 🎯 Componentes Disponibles

### 1. `ProductsCarousel` (Componente Principal)
Componente genérico y reutilizable para mostrar productos en formato carrusel.

### 2. `RelatedProductsCarousel` (Componente Especializado)
Componente específico para productos relacionados, basado en `ProductsCarousel`.

## 🚀 Características Principales

### ✅ Responsive Design
- **Mobile**: 1 producto por vista
- **Tablet**: 2 productos por vista  
- **Desktop**: 4 productos por vista

### ✅ Navegación
- Botones de flecha (izquierda/derecha)
- Indicadores de puntos
- Navegación táctil (swipe)

### ✅ Auto-play
- Reproducción automática opcional
- Intervalo configurable
- Pausa al hacer hover

### ✅ Efectos Visuales
- Animaciones suaves
- Hover effects
- Transiciones fluidas

### ✅ Compatibilidad UUID
- Soporte completo para UUID
- Fallback a ID numérico
- URLs seguras

## 📦 Instalación y Uso

### Importación
```typescript
import ProductsCarousel from '../components/ProductsCarousel';
import RelatedProductsCarousel from '../components/RelatedProductsCarousel';
```

### Uso Básico
```typescript
<ProductsCarousel 
    products={productList}
    title="Productos Destacados"
/>
```

### Uso Avanzado
```typescript
<ProductsCarousel 
    products={productList}
    title="Productos Destacados"
    subtitle="Descubre nuestra selección más popular"
    showNavigation={true}
    autoPlay={true}
    autoPlayInterval={5000}
/>
```

## 🔧 Props Disponibles

### `ProductsCarousel`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `products` | `Product[]` | - | Lista de productos a mostrar |
| `title` | `string` | - | Título del carrusel |
| `subtitle` | `string` | - | Subtítulo del carrusel |
| `showNavigation` | `boolean` | `true` | Mostrar botones de navegación |
| `autoPlay` | `boolean` | `false` | Activar reproducción automática |
| `autoPlayInterval` | `number` | `5000` | Intervalo de auto-play en ms |

### `RelatedProductsCarousel`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `products` | `Product[]` | - | Lista de productos relacionados |
| `title` | `string` | `"Productos Relacionados"` | Título del carrusel |

## 📱 Ejemplos de Uso

### 1. Carrusel de Productos Destacados
```typescript
<ProductsCarousel 
    products={featuredProducts}
    title="Productos Destacados"
    subtitle="Descubre nuestra selección más popular"
    showNavigation={true}
    autoPlay={true}
    autoPlayInterval={4000}
/>
```

### 2. Carrusel de Productos Relacionados
```typescript
<RelatedProductsCarousel 
    products={relatedProducts}
    title="Productos Relacionados"
/>
```

### 3. Carrusel Simple
```typescript
<ProductsCarousel 
    products={productList}
    showNavigation={true}
    autoPlay={false}
/>
```

### 4. Carrusel sin Navegación
```typescript
<ProductsCarousel 
    products={productList}
    title="Productos Nuevos"
    showNavigation={false}
    autoPlay={true}
    autoPlayInterval={3000}
/>
```

## 🎨 Personalización

### Estilos CSS
Los carruseles usan Material-UI y pueden ser personalizados usando el sistema de temas:

```typescript
// Personalizar colores
<ProductsCarousel 
    products={products}
    sx={{
        '& .MuiCard-root': {
            backgroundColor: 'custom.background',
        },
        '& .MuiTypography-root': {
            color: 'custom.text',
        }
    }}
/>
```

### Responsive Breakpoints
Los breakpoints están configurados para:
- `xs`: < 600px (Mobile)
- `sm`: 600px - 900px (Tablet)
- `md`: 900px - 1200px (Desktop pequeño)
- `lg`: > 1200px (Desktop grande)

## 🔄 Integración con UUID

### Compatibilidad Automática
Los carruseles son completamente compatibles con el sistema UUID:

```typescript
// Los productos con UUID se manejan automáticamente
const productsWithUuid = [
    {
        id: 1,
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        name: "Producto 1",
        // ... otros campos
    }
];

<ProductsCarousel products={productsWithUuid} />
```

### URLs Generadas
- Con UUID: `/producto/550e8400-e29b-41d4-a716-446655440000`
- Sin UUID: `/producto/1` (fallback)

## 🧪 Testing

### Casos de Prueba
- ✅ Navegación con botones
- ✅ Navegación con indicadores
- ✅ Auto-play funciona correctamente
- ✅ Responsive en diferentes tamaños
- ✅ Hover effects
- ✅ URLs con UUID
- ✅ Fallback a ID numérico

### Testing Manual
```typescript
// Verificar que el carrusel se renderiza
expect(screen.getByText('Productos Destacados')).toBeInTheDocument();

// Verificar navegación
fireEvent.click(screen.getByLabelText('Siguiente'));
expect(carousel).toHaveStyle({ transform: 'translateX(-25%)' });
```

## 🚀 Optimización

### Performance
- Lazy loading de imágenes
- Debounce en eventos de navegación
- Memoización de componentes
- Optimización de re-renders

### Accesibilidad
- Navegación con teclado
- ARIA labels
- Screen reader support
- Focus management

## 📊 Métricas y Analytics

### Eventos Trackeables
- Clicks en productos
- Navegación del carrusel
- Tiempo de visualización
- Productos vistos

### Implementación
```typescript
// Ejemplo de tracking
const handleProductClick = (product) => {
    analytics.track('product_carousel_click', {
        product_id: product.id,
        product_uuid: product.uuid,
        carousel_type: 'related_products'
    });
};
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Carrusel no se muestra
```typescript
// Verificar que hay productos
if (products.length === 0) {
    return <div>No hay productos disponibles</div>;
}
```

#### 2. Navegación no funciona
```typescript
// Verificar que showNavigation está habilitado
<ProductsCarousel 
    products={products}
    showNavigation={true} // Asegurar que está en true
/>
```

#### 3. Auto-play no funciona
```typescript
// Verificar configuración
<ProductsCarousel 
    products={products}
    autoPlay={true} // Debe estar en true
    autoPlayInterval={5000} // Intervalo en ms
/>
```

## 📈 Roadmap

### Próximas Mejoras
- [ ] Swipe gestures para mobile
- [ ] Lazy loading de productos
- [ ] Infinite scroll
- [ ] Filtros en carrusel
- [ ] Modo presentación
- [ ] Exportar a PDF

### Versiones Futuras
- **v2.0**: Swipe gestures y lazy loading
- **v2.1**: Infinite scroll y filtros
- **v3.0**: Modo presentación y exportación

## 📞 Soporte

### Archivos Relacionados
- `src/components/ProductsCarousel.tsx` - Componente principal
- `src/components/RelatedProductsCarousel.tsx` - Componente especializado
- `src/examples/CarouselExample.tsx` - Ejemplos de uso

### Documentación Adicional
- `README_UUID_MIGRATION.md` - Migración a UUID
- `FRONTEND_CHANGES.md` - Cambios en frontend

---

**Versión**: 1.0.0  
**Última actualización**: [Fecha actual]  
**Compatibilidad**: React 18+, Material-UI 5+ 