import React from 'react';
import { Box, Typography, IconButton, Card, CardContent, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface CategoryCarouselItem {
    id: number;
    name: string;
    image: string;
    slug: string;
}

interface CategoriesCarouselProps {
    categories: CategoryCarouselItem[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

const CategoriesCarousel: React.FC<CategoriesCarouselProps> = ({ 
    categories, 
    autoPlay = true,
    autoPlayInterval = 4000
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const [currentIndex, setCurrentIndex] = React.useState(0);
    
    // Responsive items per view
    const getItemsPerView = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
    };
    
    const itemsPerView = getItemsPerView();
    const maxIndex = Math.max(0, categories.length - itemsPerView);

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
        if (!autoPlay || categories.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex >= maxIndex) {
                    return 0; // Reset to beginning
                }
                return prevIndex + 1;
            });
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, maxIndex, categories.length, itemsPerView]);

    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    
    // the required distance between touchStart and touchEnd to be detected as a swipe
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

    if (categories.length === 0) {
        return null;
    }

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <Box sx={{ position: 'relative' }}>
                {categories.length > itemsPerView && (
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
                            width: `${(categories.length / itemsPerView) * 100}%`, // Fix width calc for categories
                            pointerEvents: isDragging ? 'none' : 'auto', // Evita que se activen links mientras arrastras
                        }}
                    >
                        {categories.map((category) => (
                            <Box 
                                key={category.id} 
                                sx={{ 
                                    width: `calc(100% / ${categories.length})`, // Ensure child width corresponds to total flex ratio
                                    flexShrink: 0
                                }}
                            >
                                <Card 
                                    component={Link}
                                    to={`/productos?categoria=${category.slug}`}
                                    onClick={(e) => { 
                                        if (isDragging || touchStart !== touchEnd && touchEnd !== null) { 
                                            e.preventDefault(); // prevenir navegación si deslizó en móviles o arrastró en PC
                                        } 
                                    }}
                                    sx={{ 
                                        height: { xs: 260, sm: 300, md: 360 }, 
                                        backgroundColor: "#ffffff",
                                        textDecoration: 'none',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'block',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                                            '& .category-action': {
                                                opacity: 1,
                                            }
                                        },
                                    }}
                                >
                                    <CardMedia 
                                        component="img" 
                                        sx={{ 
                                            height: '100%',
                                            width: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            objectFit: 'contain',
                                            padding: '10px 10px 80px 10px',
                                            backgroundColor: '#ffffff'
                                        }} 
                                        image={category.image} 
                                        alt={category.name} 
                                    />
                                    
                                    {/* Overlay for text */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            pt: 10,
                                            pb: 3,
                                            background: 'linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.7) 40%, rgba(20,20,20,0) 100%)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="h5" component="div" sx={{ fontWeight: "bold", color: 'white', textAlign: 'center', mb: 0.5 }}>
                                            {category.name}
                                        </Typography>
                                        <Typography className="category-action" variant="button" sx={{ color: 'primary.light', fontWeight: 'bold', opacity: 0.8, transition: '0.2s' }}>
                                            Explorar Colección
                                        </Typography>
                                    </Box>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Navigation Dots */}
            {categories.length > itemsPerView && (
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

export default CategoriesCarousel;
