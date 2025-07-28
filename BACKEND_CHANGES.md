# Cambios Necesarios en el Backend para UUID

## Endpoints Requeridos

### 1. Obtener producto por UUID
```
GET /api/products/uuid/{uuid}
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Chaleco Alta Visibilidad Pro",
  "description": "Chaleco de alta visibilidad...",
  "sku": "CHAL-001",
  "price": "89.99",
  "img_product": null,
  "category_id": 1,
  "warehouse_id": null,
  "color_id": 1,
  "status": 1,
  "created_at": "2023-10-15T00:00:00.000000Z",
  "updated_at": "2023-10-15T00:00:00.000000Z",
  "category": {
    "id": 1,
    "name": "Alta Visibilidad"
  },
  "images": [
    {
      "id": 1,
      "image_path": "/images/product-1-1.jpg",
      "url": "https://example.com/images/product-1-1.jpg",
      "product_id": 1,
      "is_primary": true
    }
  ],
  "colors": [
    {
      "id": 1,
      "name": "Amarillo",
      "hex_code": "#ffff00",
      "hex_code_1": null
    }
  ]
}
```

### 2. Modificar endpoint existente de productos
El endpoint actual `GET /api/products/{id}` debe seguir funcionando para compatibilidad, pero se recomienda agregar el campo `uuid` a la respuesta.

## Cambios en la Base de Datos

### 1. Agregar columna UUID a la tabla de productos
```sql
ALTER TABLE products ADD COLUMN uuid VARCHAR(36) UNIQUE NOT NULL;
```

### 2. Generar UUIDs para productos existentes
```sql
UPDATE products SET uuid = UUID() WHERE uuid IS NULL;
```

### 3. Crear índice para UUID
```sql
CREATE INDEX idx_products_uuid ON products(uuid);
```

## Implementación en el Backend

### Laravel (PHP)
```php
// En el modelo Product
protected $fillable = [
    'uuid',
    'name',
    'description',
    // ... otros campos
];

// En el controlador
public function showByUuid($uuid)
{
    $product = Product::where('uuid', $uuid)->with(['category', 'images', 'colors'])->first();
    
    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }
    
    return response()->json($product);
}

// En las rutas
Route::get('/products/uuid/{uuid}', [ProductController::class, 'showByUuid']);
```

### Node.js/Express
```javascript
// En el controlador
const getProductByUuid = async (req, res) => {
    try {
        const { uuid } = req.params;
        const product = await Product.findOne({
            where: { uuid },
            include: ['category', 'images', 'colors']
        });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// En las rutas
router.get('/products/uuid/:uuid', getProductByUuid);
```

## Consideraciones de Seguridad

1. **Validación de UUID**: Asegurarse de que el UUID tenga el formato correcto
2. **Rate Limiting**: Aplicar límites de tasa para prevenir abuso
3. **CORS**: Configurar CORS apropiadamente para el frontend

## Migración Gradual

1. Agregar el campo UUID a la base de datos
2. Generar UUIDs para productos existentes
3. Implementar el nuevo endpoint
4. Actualizar el frontend para usar UUID
5. Mantener compatibilidad con el endpoint de ID durante un período de transición
6. Eventualmente deprecar el endpoint de ID (opcional)

## Testing

### Endpoints a probar:
- `GET /api/products/uuid/{uuid}` - Producto válido
- `GET /api/products/uuid/{uuid}` - UUID inválido
- `GET /api/products/uuid/{uuid}` - UUID inexistente
- Verificar que el endpoint de ID siga funcionando

### Casos de prueba:
1. Producto con UUID válido
2. UUID malformado
3. UUID que no existe
4. Producto sin imágenes
5. Producto sin colores
6. Producto con múltiples imágenes y colores 