import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Modal, Typography, Fade, Backdrop, Button, Grid, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

interface Product3DModalProps {
    open: boolean;
    onClose: () => void;
    product: any;
}

const Product3DModal: React.FC<Product3DModalProps> = ({ open, onClose, product }) => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [currentView, setCurrentView] = useState<number>(0);
    const [isHovering, setIsHovering] = useState(false);

    // Fallback default images representing the 4 angles requested by the user
    // In a real scenario, these would come from the product.images array with metadata
    const demoImages = [
        product?.images?.[0]?.url || product?.images?.[0]?.image_path || '/images/category-1.jpg', // Front
        product?.images?.[1]?.url || product?.images?.[1]?.image_path || '/images/category-2.jpg', // Angled
        product?.images?.[2]?.url || product?.images?.[2]?.image_path || '/images/category-3.jpg', // Back
        product?.images?.[3]?.url || product?.images?.[3]?.image_path || '/images/home.jpeg', // Mannequin / Model
    ];

    const viewLabels = ["Frente", "Ángulo", "Espalda", "En Modelo"];

    useEffect(() => {
        if (!open) {
            setCurrentView(0);
        }
    }, [open]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !imageRef.current) return;
        
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        // GSAP 3D Tilt effect
        gsap.to(imageRef.current, {
            rotationY: x * 30, // max 15 degrees rotation
            rotationX: -y * 30,
            transformPerspective: 900,
            ease: "power2.out",
            duration: 0.5
        });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (imageRef.current) {
            gsap.to(imageRef.current, {
                rotationY: 0,
                rotationX: 0,
                ease: "power3.out",
                duration: 1
            });
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    if (!product) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
                },
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95%', md: '80%', lg: '70%' },
                    height: { xs: '90vh', md: '80vh' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    outline: 'none'
                }}>
                    {/* Header */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Vista Interactiva 3D
                        </Typography>
                        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <Grid container sx={{ flex: 1, overflow: 'hidden' }}>
                        {/* 3D Viewer Area */}
                        <Grid item xs={12} md={8} sx={{ 
                            position: 'relative', 
                            bgcolor: '#111', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {!isHovering && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    color: 'rgba(255,255,255,0.7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    zIndex: 10,
                                    pointerEvents: 'none',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 5
                                }}>
                                    <ThreeDRotationIcon fontSize="small" />
                                    <Typography variant="body2">Pasa el mouse para rotar en 3D</Typography>
                                </Box>
                            )}

                            <Box 
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={handleMouseEnter}
                                sx={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    perspective: '1000px',
                                    cursor: 'grab',
                                    '&:active': { cursor: 'grabbing' }
                                }}
                            >
                                <img 
                                    ref={imageRef}
                                    src={demoImages[currentView]} 
                                    alt={product.name} 
                                    style={{
                                        maxWidth: '80%',
                                        maxHeight: '80%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'
                                    }}
                                />
                            </Box>

                            {/* View Selectors overlay */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 20,
                                display: 'flex',
                                gap: 2,
                                zIndex: 10,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                p: 1,
                                borderRadius: 8,
                                backdropFilter: 'blur(5px)'
                            }}>
                                {viewLabels.map((label, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => setCurrentView(index)}
                                        variant={currentView === index ? 'contained' : 'text'}
                                        color={currentView === index ? 'primary' : 'inherit'}
                                        sx={{ 
                                            color: currentView === index ? '#fff' : '#ccc',
                                            borderRadius: 6,
                                            textTransform: 'none',
                                            px: 2
                                        }}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Box>
                        </Grid>

                        {/* Product Info */}
                        <Grid item xs={12} md={4} sx={{ p: 4, display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
                            <Chip label="NUEVO LANZAMIENTO" color="error" size="small" sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 'bold' }} />
                            <Typography variant="h5" fontWeight="900" gutterBottom>
                                {product.name}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                                ${parseFloat(product.price).toFixed(2)} MXN
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {product.description || "Chaleco de seguridad industrial con tecnología avanzada. Diseño ergonómico, materiales de alta resistencia y cintas reflectantes de máxima visibilidad."}
                            </Typography>

                            <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="large"
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={() => navigate(`/producto/${product.uuid}`)}
                                    fullWidth
                                    sx={{ py: 1.5 }}
                                >
                                    Ver Detalle Completo
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="inherit" 
                                    onClick={onClose}
                                    fullWidth
                                >
                                    Cerrar
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </Modal>
    );
};

export default Product3DModal;
