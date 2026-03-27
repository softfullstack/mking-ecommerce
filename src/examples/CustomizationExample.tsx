import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import ProductCustomizer from '../components/ProductCustomizer';
import { ItemCustomization } from '../interfaces/CustomizationInterface';

// Producto de ejemplo
const exampleProduct = {
    id: 1,
    uuid: 'example-product-1',
    name: 'Chaleco Alta Visibilidad Pro',
    price: 89.99,
    description: 'Chaleco de alta visibilidad con múltiples bolsillos y bandas reflectantes.',
    images: [
        { url: '/images/product-1-1.jpg' }
    ],
    colors: [],
    sizes: ['s', 'm', 'l', 'xl'],
    categories: ['alta-visibilidad'],
    isNew: true,
    rating: 4.5,
    reviewCount: 12,
    specifications: [],
    reviews: []
};

const CustomizationExample: React.FC = () => {
    const [customizerOpen, setCustomizerOpen] = useState(false);
    const [savedCustomizations, setSavedCustomizations] = useState<ItemCustomization[]>([]);

    const handleSaveCustomization = (customizations: ItemCustomization[]) => {
        setSavedCustomizations(customizations);
        setCustomizerOpen(false);
        console.log('Personalizaciones guardadas:', customizations);
    };

    const handleCancelCustomization = () => {
        setCustomizerOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
                Ejemplo de Personalización de Productos
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Producto de Ejemplo
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Nombre:</strong> {exampleProduct.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Precio:</strong> ${exampleProduct.price}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    <strong>Descripción:</strong> {exampleProduct.description}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setCustomizerOpen(true)}
                    sx={{ mr: 2 }}
                >
                    Personalizar Producto
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => setCustomizerOpen(true)}
                >
                    Editar Personalización Existente
                </Button>
            </Paper>

            {/* Mostrar personalizaciones guardadas */}
            {savedCustomizations.length > 0 && (
                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Personalizaciones Guardadas
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Se han guardado {savedCustomizations.length} artículo{savedCustomizations.length > 1 ? 's' : ''} personalizado{savedCustomizations.length > 1 ? 's' : ''}.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {savedCustomizations.map((item, itemIndex) => (
                            <Box key={item.id} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Artículo {itemIndex + 1} {item.name ? `- ${item.name}` : ''}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {item.logos.map((logo, index) => (
                                        <Box
                                            key={logo.id}
                                            sx={{
                                                p: 2,
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                backgroundColor: '#fff',
                                                minWidth: 200
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                Logo {index + 1}
                                            </Typography>
                                            <Typography variant="body2">
                                                Posición: ({Math.round(logo.x)}, {Math.round(logo.y)})
                                            </Typography>
                                            <Typography variant="body2">
                                                Tamaño: {Math.round(logo.width)} × {Math.round(logo.height)}px
                                            </Typography>
                                            <Typography variant="body2">
                                                Rotación: {logo.rotation}°
                                            </Typography>
                                            <Typography variant="body2">
                                                Opacidad: {Math.round(logo.opacity * 100)}%
                                            </Typography>
                                        </Box>
                                    ))}
                                    {item.logos.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Sin logos
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Instrucciones de uso */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Instrucciones de Uso
                </Typography>

                <Box component="ol" sx={{ pl: 3 }}>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Haz clic en "Personalizar Producto"</strong> para abrir el customizer
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Agrega un logo</strong> haciendo clic en "Agregar Logo" y seleccionando una imagen
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Posiciona el logo</strong> arrastrándolo en el canvas o usando los controles deslizantes
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Ajusta el tamaño</strong> usando los controles de ancho y alto
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Rota el logo</strong> usando el control de rotación o los botones +/-
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Ajusta la opacidad</strong> para hacer el logo más transparente o sólido
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Guarda la personalización</strong> haciendo clic en "Guardar Personalización"
                        </Typography>
                    </li>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    <strong>Nota:</strong> Este es un ejemplo de demostración. En una aplicación real,
                    las personalizaciones se guardarían en el carrito de compras y se procesarían
                    junto con el pedido.
                </Typography>
            </Paper>

            {/* Product Customizer */}
            <ProductCustomizer
                product={exampleProduct}
                quantity={1}
                isOpen={customizerOpen}
                onSave={handleSaveCustomization}
                onCancel={handleCancelCustomization}
                initialCustomizations={savedCustomizations}
            />
        </Container>
    );
};

export default CustomizationExample;
