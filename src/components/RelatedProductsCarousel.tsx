import React from 'react';
import { Box } from '@mui/material';
import { Product } from '../interfaces/ProductInterface';
import ProductsCarousel from './ProductsCarousel';

interface RelatedProductsCarouselProps {
    products: Product[];
    title?: string;
}

const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({ 
    products, 
    title = "Productos Relacionados" 
}) => {
    return (
        <Box sx={{ mt: 8 }}>
            <ProductsCarousel 
                products={products}
                title={title}
                showNavigation={true}
                autoPlay={false}
            />
        </Box>
    );
};

export default RelatedProductsCarousel; 