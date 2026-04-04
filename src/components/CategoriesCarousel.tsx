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

                <Box sx={{ overflow: 'hidden', padding: { xs: '10px 0', md: '20px 0' } }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: { xs: 1.5, sm: 2, md: 3 },
                            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                            transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            width: `${(categories.length / itemsPerView) * 100}%`, // Fix width calc for categories
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
                                    sx={{ 
                                        height: '100%', 
                                        backgroundColor: "#1e1e1e",
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                >
                                    <CardMedia 
                                        component="img" 
                                        sx={{ 
                                            height: { xs: 180, sm: 220, md: 260 },
                                            objectFit: 'cover'
                                        }} 
                                        image={category.image} 
                                        alt={category.name} 
                                    />
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold", color: 'white', textAlign: 'center', m: 0 }}>
                                            {category.name}
                                        </Typography>
                                        <Typography className="category-action" variant="button" sx={{ color: 'primary.main', mt: 2, fontWeight: 'bold', opacity: 0.8, transition: '0.2s' }}>
                                            Explorar Colección
                                        </Typography>
                                    </CardContent>
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
