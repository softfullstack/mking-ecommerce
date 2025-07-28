import React from 'react';
import { Box, Typography, IconButton, Card, CardContent, CardMedia, Chip, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Product } from '../interfaces/ProductInterface';
import { getPreferredIdentifier } from '../utils/uuidUtils';

interface ProductsCarouselProps {
    products: Product[];
    title?: string;
    subtitle?: string;
    showNavigation?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({ 
    products, 
    title,
    subtitle,
    showNavigation = true,
    autoPlay = false,
    autoPlayInterval = 5000
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const [currentIndex, setCurrentIndex] = React.useState(0);
    
    // Responsive items per view
    const getItemsPerView = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 4;
    };
    
    const itemsPerView = getItemsPerView();
    const maxIndex = Math.max(0, products.length - itemsPerView);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
    };

    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;

    // Auto-play functionality
    React.useEffect(() => {
        if (!autoPlay || products.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex >= maxIndex) {
                    return 0; // Reset to beginning
                }
                return prevIndex + 1;
            });
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, maxIndex, products.length, itemsPerView]);

    if (products.length === 0) {
        return null;
    }

    return (
        <Box sx={{ position: 'relative' }}>
            {(title || subtitle) && (
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    {title && (
                        <Typography 
                            variant="h4" 
                            component="h2" 
                            sx={{ 
                                fontWeight: "bold",
                                mb: subtitle ? 1 : 3,
                                color: 'primary.main'
                            }}
                        >
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'text.secondary',
                                mb: 3,
                                maxWidth: 600,
                                mx: 'auto'
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ position: 'relative' }}>
                {showNavigation && products.length > itemsPerView && (
                    <>
                        <IconButton
                            onClick={handlePrevious}
                            disabled={!canGoPrevious}
                            size="large"
                            sx={{
                                position: 'absolute',
                                left: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                [theme.breakpoints.down('sm')]: {
                                    left: -10,
                                    width: 40,
                                    height: 40,
                                }
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            disabled={!canGoNext}
                            size="large"
                            sx={{
                                position: 'absolute',
                                right: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                [theme.breakpoints.down('sm')]: {
                                    right: -10,
                                    width: 40,
                                    height: 40,
                                }
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </>
                )}

                <Box sx={{ overflow: 'hidden' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: { xs: 1, sm: 2 },
                            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                            transition: 'transform 0.3s ease-in-out',
                            width: `${(products.length / itemsPerView) * 100}%`,
                        }}
                    >
                        {products.map((product) => {
                            const productIdentifier = getPreferredIdentifier({ 
                                uuid: product.uuid, 
                                id: product.id 
                            });

                            // Procesar imágenes
                            const images = product.images && Array.isArray(product.images)
                                ? [...product.images].sort((a, b) => {
                                    if ((a as any).is_primary === (b as any).is_primary) return 0;
                                    if ((a as any).is_primary) return -1;
                                    if ((b as any).is_primary) return 1;
                                    return 0;
                                })
                                : [];

                            const imageUrl = images.length > 0 
                                ? (images[0]?.url || images[0]?.image_path || "/images/placeholder.jpg")
                                : "/images/placeholder.jpg";

                            return (
                                <Card
                                    key={product.id}
                                    component={Link}
                                    to={`/producto/${productIdentifier}`}
                                    sx={{
                                        minWidth: `calc(100% / ${itemsPerView} - ${isMobile ? '8px' : '16px'})`,
                                        height: { xs: 280, sm: 300, md: 320 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        position: 'relative',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    {product.isNew && (
                                        <Chip
                                            label="NUEVO"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                left: 8,
                                                zIndex: 1,
                                                fontWeight: "bold",
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                            }}
                                        />
                                    )}

                                    {typeof product.discount === "number" && product.discount > 0 && (
                                        <Chip
                                            label={`-${product.discount}%`}
                                            color="error"
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                zIndex: 1,
                                                fontWeight: "bold",
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                            }}
                                        />
                                    )}

                                    <CardMedia
                                        component="img"
                                        height={isMobile ? 140 : 180}
                                        image={imageUrl}
                                        alt={product.name}
                                        sx={{
                                            objectFit: "cover",
                                        }}
                                    />

                                    <CardContent sx={{ 
                                        flexGrow: 1, 
                                        display: "flex", 
                                        flexDirection: "column",
                                        p: { xs: 1.5, sm: 2 }
                                    }}>
                                        <Typography
                                            variant={isMobile ? "body2" : "subtitle1"}
                                            component="h3"
                                            sx={{
                                                fontWeight: "bold",
                                                mb: 1,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                lineHeight: 1.2,
                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                            }}
                                        >
                                            {product.name}
                                        </Typography>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            {product.discount && product.discount > 0 ? (
                                                <>
                                                    <Typography
                                                        variant={isMobile ? "body2" : "h6"}
                                                        color="primary"
                                                        sx={{ 
                                                            fontWeight: "bold", 
                                                            mr: 1, 
                                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                                        }}
                                                    >
                                                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ textDecoration: "line-through", color: "text.secondary" }}
                                                    >
                                                        ${product.price.toFixed(2)}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography
                                                    variant={isMobile ? "body2" : "h6"}
                                                    color="primary"
                                                    sx={{ 
                                                        fontWeight: "bold", 
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}
                                                >
                                                    ${product.price.toFixed(2)}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Color chips */}
                                        {product.colors && product.colors.length > 0 && (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 'auto' }}>
                                                {product.colors.slice(0, isMobile ? 2 : 3).map((color, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            width: { xs: 14, sm: 16 },
                                                            height: { xs: 14, sm: 16 },
                                                            borderRadius: "50%",
                                                            backgroundColor: color,
                                                            border: "1px solid #fff",
                                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                        }}
                                                    />
                                                ))}
                                                {product.colors.length > (isMobile ? 2 : 3) && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        +{product.colors.length - (isMobile ? 2 : 3)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                </Box>
            </Box>

            {/* Indicadores de navegación */}
            {products.length > itemsPerView && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
                    {Array.from({ length: maxIndex + 1 }, (_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: { xs: 6, sm: 8 },
                                height: { xs: 6, sm: 8 },
                                borderRadius: '50%',
                                backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(0, 0, 0, 0.2)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(0, 0, 0, 0.4)',
                                }
                            }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ProductsCarousel; 