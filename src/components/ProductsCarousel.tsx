import React from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProductCard from './ProductCard';

interface ProductsCarouselProps {
    products: any[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({ 
    products, 
    autoPlay = true,
    autoPlayInterval = 4000
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
    
    const [currentIndex, setCurrentIndex] = React.useState(0);
    
    // Responsive items per view
    const getItemsPerView = () => {
        if (isMobile) return 2; // Mostrar 2 productos en móvil
        if (isTablet) return 3; // Mostrar 3 en tablet
        if (isLarge) return 4; // Mostrar 4 en escritorio grande
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

    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    
    const minSwipeDistance = 50; 

    const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setTouchEnd(null); 
        const clientX = 'touches' in e ? e.targetTouches[0].clientX : (e as React.MouseEvent).clientX;
        setTouchStart(clientX);
    };

    const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        const clientX = 'touches' in e ? e.targetTouches[0].clientX : (e as React.MouseEvent).clientX;
        setTouchEnd(clientX);
    };

    const onTouchEndEvent = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe && currentIndex < maxIndex) {
            handleNext();
        }
        if (isRightSwipe && currentIndex > 0) {
            handlePrevious();
        }
    };

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        onTouchStart(e);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        onTouchMove(e);
    };

    const onMouseUp = () => {
        if (isDragging) {
            onTouchEndEvent();
            setIsDragging(false);
        }
    };

    const onMouseLeave = () => {
        if (isDragging) {
            onTouchEndEvent();
            setIsDragging(false);
        }
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <Box sx={{ position: 'relative' }}>
                {products.length > itemsPerView && (
                    <>
                        <IconButton
                            onClick={handlePrevious}
                            disabled={!canGoPrevious}
                            size="small"
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
                            size="small"
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

                <Box 
                    sx={{ overflow: 'hidden', padding: { xs: '10px 0', md: '20px 0' }, cursor: isDragging ? 'grabbing' : 'grab' }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEndEvent}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: { xs: 1.5, sm: 2, md: 3 },
                            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                            transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            width: `${(products.length / itemsPerView) * 100}%`,
                            pointerEvents: isDragging ? 'none' : 'auto', 
                        }}
                    >
                        {products.map((product) => (
                            <Box 
                                key={product.uuid} 
                                onClickCapture={(e) => {
                                    if (isDragging || touchStart !== touchEnd && touchEnd !== null) { 
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                                sx={{ 
                                    width: `calc(100% / ${products.length})`, 
                                    flexShrink: 0
                                }}
                            >
                                <ProductCard product={{
                                    ...product,
                                    price: Number(product.price) || 0,
                                    colors: product.colors?.map((c: any) => c.hex_code || c) || [],
                                    originalColors: product.colors || [],
                                    color_id: product.color_id,
                                    uuid: product.uuid,
                                    images: (product.images || []).map((img: any) =>
                                        typeof img === "string"
                                            ? { url: img }
                                            : img
                                    ),
                                }} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Navigation Dots */}
            {products.length > itemsPerView && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                    {Array.from({ length: maxIndex + 1 }, (_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: { xs: 8, sm: 10 },
                                height: { xs: 8, sm: 10 },
                                borderRadius: '50%',
                                backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
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
