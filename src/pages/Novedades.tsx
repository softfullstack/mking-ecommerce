import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GetCollectionBySlugService, ProdutcList } from '../services/MKing.service';
import Product3DModal from '../components/Product3DModal';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

gsap.registerPlugin(ScrollTrigger);

const Novedades = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Try fetching "novedades" collection first, fallback to all products
        GetCollectionBySlugService('novedades')
            .then((res: any) => {
                if (res.data && res.data.products && res.data.products.length > 0) {
                    setProducts(res.data.products);
                } else {
                    fetchFallbackProducts();
                }
            })
            .catch(() => fetchFallbackProducts());

        const fetchFallbackProducts = () => {
            ProdutcList().then((res: any) => {
                if (res.data && res.data.products) {
                    // Just take the first few or a random slice for demo purposes
                    setProducts(res.data.products.slice(0, 6));
                }
            });
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.fromTo(
                    headerRef.current.children,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
                );
            }

            if (gridRef.current && products.length > 0) {
                gsap.fromTo(
                    gridRef.current.children,
                    { opacity: 0, y: 50, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }
        });
        return () => ctx.revert();
    }, [products]);

    const handleOpen3D = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300); // Wait for transition
    };

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 10 }}>
            <Helmet>
                <title>Novedades y Lanzamientos | MKing</title>
                <meta name="description" content="Descubre lo último en chalecos de seguridad industrial y tecnología de protección personal en MKing." />
            </Helmet>

            {/* Hero Banner Especial */}
            <Box 
                sx={{
                    position: 'relative',
                    height: { xs: '50vh', sm: '40vh', md: '50vh' },
                    bgcolor: '#111',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    mb: { xs: 4, md: 6 }
                }}
            >
                <Box
                    component="img"
                    src="/images/home.jpeg" // Reutilizamos imagen o puedes poner una específica
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.4,
                        filter: 'blur(2px)'
                    }}
                />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Box ref={headerRef}>
                        <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 'bold', color: '#ff3d00' }}>
                            RECIÉN LLEGADOS
                        </Typography>
                        <Typography variant="h2" fontWeight="900" sx={{ mt: 1, mb: 2, textTransform: 'uppercase', fontSize: { xs: '2.2rem', sm: '3rem', md: '3.75rem' } }}>
                            Innovación en Seguridad
                        </Typography>
                        <Typography variant="h6" color="grey.300" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 2, md: 0 } }}>
                            Descubre nuestra nueva línea de chalecos con materiales más resistentes, diseño ergonómico y tecnología reflectante de última generación.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Grid de Productos Novedades */}
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }} ref={gridRef}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <Card sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                position: 'relative',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                },
                                borderRadius: 3,
                                overflow: 'visible'
                            }}>
                                <Chip 
                                    label="NUEVO" 
                                    color="error" 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: -15, 
                                        right: { xs: 10, sm: 20 }, 
                                        zIndex: 10,
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(211,47,47,0.3)'
                                    }} 
                                />
                                <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#f0f0f0', borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        image={product.images?.[0]?.url || product.images?.[0]?.image_path || '/images/category-1.jpg'}
                                        alt={product.name}
                                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', p: 2 }}
                                    />
                                    
                                    {/* Botón flotante para ver en 3D */}
                                    <Box 
                                        className="btn-3d-container"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            p: 2,
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            opacity: { xs: 1, md: 0 },
                                            transition: 'opacity 0.3s',
                                            '.MuiCard-root:hover &': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <Button 
                                            variant="contained" 
                                            color="secondary"
                                            startIcon={<ThreeDRotationIcon />}
                                            onClick={() => handleOpen3D(product)}
                                            sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 'bold' }}
                                        >
                                            Ver Modelo 3D
                                        </Button>
                                    </Box>
                                </Box>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {product.description || "Nueva tecnología en protección y visibilidad."}
                                    </Typography>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        ${parseFloat(product.price).toFixed(2)} MXN
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Modal Interactivo */}
            <Product3DModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                product={selectedProduct} 
            />
        </Box>
    );
};

export default Novedades;
