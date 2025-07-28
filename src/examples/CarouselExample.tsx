import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import ProductsCarousel from '../components/ProductsCarousel';
import RelatedProductsCarousel from '../components/RelatedProductsCarousel';
import { Product } from '../interfaces/ProductInterface';

/**
 * Ejemplo de uso de los diferentes tipos de carruseles
 */
const CarouselExample: React.FC = () => {
    // Datos de ejemplo para productos
    const sampleProducts: Product[] = [
        {
            id: 1,
            uuid: "550e8400-e29b-41d4-a716-446655440000",
            name: "Chaleco Alta Visibilidad Pro",
            price: 89.99,
            discount: 0,
            description: "Chaleco de alta visibilidad con múltiples bolsillos",
            images: [
                { id: 1, url: "/images/product-1-1.jpg" }
            ],
            colors: ["#ffff00", "#ff9800"],
            colorIds: ["amarillo", "naranja"],
            sizes: ["s", "m", "l", "xl"],
            categories: ["alta-visibilidad"],
            isNew: true,
            rating: 4.5,
            reviewCount: 12,
            reviews: [],
            specifications: []
        },
        {
            id: 2,
            uuid: "550e8400-e29b-41d4-a716-446655440001",
            name: "Chaleco Ignífugo Premium",
            price: 129.99,
            discount: 15,
            description: "Chaleco ignífugo de alta resistencia",
            images: [
                { id: 2, url: "/images/product-2-1.jpg" }
            ],
            colors: ["#ff0000", "#000000"],
            colorIds: ["rojo", "negro"],
            sizes: ["m", "l", "xl"],
            categories: ["ignifugos"],
            isNew: false,
            rating: 5,
            reviewCount: 8,
            reviews: [],
            specifications: []
        },
        {
            id: 3,
            uuid: "550e8400-e29b-41d4-a716-446655440002",
            name: "Chaleco Multibolsillos Utility",
            price: 69.99,
            discount: 0,
            description: "Chaleco con múltiples bolsillos para herramientas",
            images: [
                { id: 3, url: "/images/product-3-1.jpg" }
            ],
            colors: ["#000000", "#0000ff", "#00ff00"],
            colorIds: ["negro", "azul", "verde"],
            sizes: ["s", "m", "l", "xl"],
            categories: ["multibolsillos"],
            isNew: false,
            rating: 4,
            reviewCount: 15,
            reviews: [],
            specifications: []
        },
        {
            id: 4,
            uuid: "550e8400-e29b-41d4-a716-446655440003",
            name: "Chaleco Reflectante Sport",
            price: 45.99,
            discount: 20,
            description: "Chaleco deportivo con bandas reflectantes",
            images: [
                { id: 4, url: "/images/product-4-1.jpg" }
            ],
            colors: ["#ffff00", "#00ff00"],
            colorIds: ["amarillo", "verde"],
            sizes: ["xs", "s", "m", "l"],
            categories: ["deportivo"],
            isNew: true,
            rating: 4.2,
            reviewCount: 6,
            reviews: [],
            specifications: []
        },
        {
            id: 5,
            uuid: "550e8400-e29b-41d4-a716-446655440004",
            name: "Chaleco Industrial Heavy Duty",
            price: 159.99,
            discount: 0,
            description: "Chaleco industrial de máxima durabilidad",
            images: [
                { id: 5, url: "/images/product-5-1.jpg" }
            ],
            colors: ["#ff9800", "#000000"],
            colorIds: ["naranja", "negro"],
            sizes: ["l", "xl", "xxl"],
            categories: ["industrial"],
            isNew: false,
            rating: 4.8,
            reviewCount: 22,
            reviews: [],
            specifications: []
        },
        {
            id: 6,
            uuid: "550e8400-e29b-41d4-a716-446655440005",
            name: "Chaleco Eléctrico Aislante",
            price: 199.99,
            discount: 10,
            description: "Chaleco aislante para trabajos eléctricos",
            images: [
                { id: 6, url: "/images/product-6-1.jpg" }
            ],
            colors: ["#ff0000", "#ffff00"],
            colorIds: ["rojo", "amarillo"],
            sizes: ["m", "l", "xl"],
            categories: ["electrico"],
            isNew: true,
            rating: 5,
            reviewCount: 18,
            reviews: [],
            specifications: []
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
                Ejemplos de Carruseles
            </Typography>

            {/* Carrusel de Productos Destacados */}
            <Paper sx={{ p: 4, mb: 6 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
                    1. Carrusel de Productos Destacados (con Auto-play)
                </Typography>
                <ProductsCarousel 
                    products={sampleProducts}
                    title="Productos Destacados"
                    subtitle="Descubre nuestra selección de chalecos más populares"
                    showNavigation={true}
                    autoPlay={true}
                    autoPlayInterval={4000}
                />
            </Paper>

            {/* Carrusel de Productos Relacionados */}
            <Paper sx={{ p: 4, mb: 6 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
                    2. Carrusel de Productos Relacionados
                </Typography>
                <RelatedProductsCarousel 
                    products={sampleProducts.slice(0, 4)}
                    title="Productos Relacionados"
                />
            </Paper>

            {/* Carrusel Simple */}
            <Paper sx={{ p: 4, mb: 6 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
                    3. Carrusel Simple (sin título)
                </Typography>
                <ProductsCarousel 
                    products={sampleProducts.slice(0, 3)}
                    showNavigation={true}
                    autoPlay={false}
                />
            </Paper>

            {/* Carrusel sin Navegación */}
            <Paper sx={{ p: 4, mb: 6 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
                    4. Carrusel sin Navegación (solo indicadores)
                </Typography>
                <ProductsCarousel 
                    products={sampleProducts}
                    title="Productos Nuevos"
                    subtitle="Los últimos productos agregados a nuestro catálogo"
                    showNavigation={false}
                    autoPlay={true}
                    autoPlayInterval={3000}
                />
            </Paper>

            {/* Información sobre Responsive */}
            <Paper sx={{ p: 4, backgroundColor: 'primary.light', color: 'white' }}>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: "bold" }}>
                    Características del Carrusel
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                    <li>Responsive: Se adapta automáticamente a diferentes tamaños de pantalla</li>
                    <li>Mobile: 1 producto por vista</li>
                    <li>Tablet: 2 productos por vista</li>
                    <li>Desktop: 4 productos por vista</li>
                    <li>Navegación: Botones de flecha y indicadores de puntos</li>
                    <li>Auto-play: Opcional con intervalo configurable</li>
                    <li>Hover effects: Animaciones suaves al pasar el mouse</li>
                    <li>UUID support: Compatible con el sistema de UUID implementado</li>
                </Box>
            </Paper>
        </Container>
    );
};

export default CarouselExample; 