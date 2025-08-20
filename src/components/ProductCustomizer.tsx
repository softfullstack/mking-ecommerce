import React, { useState, useRef, useCallback } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    IconButton,
    Slider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Save as SaveIcon,
    Upload as UploadIcon,
    RotateLeft as RotateLeftIcon,
    RotateRight as RotateRightIcon
} from '@mui/icons-material';
import { LogoCustomization } from '../interfaces/CustomizationInterface';

interface ProductCustomizerProps {
    product: {
        id: string | number;
        uuid?: string;
        name: string;
        images?: Array<{ 
            id?: number; 
            image_path?: string; 
            url?: string; 
            is_primary?: boolean;
        }>;
    };
    onSave: (customizations: LogoCustomization[]) => void;
    onCancel: () => void;
    isOpen: boolean;
    initialCustomizations?: LogoCustomization[];
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
    product,
    onSave,
    onCancel,
    isOpen,
    initialCustomizations = []
}) => {
    const [logos, setLogos] = useState<LogoCustomization[]>(initialCustomizations);
    const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [productImageReady, setProductImageReady] = useState(false);
    const [productImageRef] = useState(useRef<HTMLImageElement>(null));
    const [canvasRef] = useState(useRef<HTMLCanvasElement>(null));

    // Función para agregar un nuevo logo
    const addLogo = useCallback(() => {
        if (!uploadedImage) return;

        const newLogo: LogoCustomization = {
            id: `logo-${Date.now()}`,
            imageUrl: uploadedImage,
            x: 50, // Posición inicial centrada
            y: 50,
            width: 100,
            height: 100,
            rotation: 0,
            opacity: 1
        };

        setLogos(prev => [...prev, newLogo]);
        setSelectedLogo(newLogo.id);
        setUploadedImage('');
        setUploadDialogOpen(false);
    }, [uploadedImage]);

    // Función para eliminar un logo
    const removeLogo = useCallback((logoId: string) => {
        setLogos(prev => prev.filter(logo => logo.id !== logoId));
        if (selectedLogo === logoId) {
            setSelectedLogo(null);
        }
    }, [selectedLogo]);

    // Función para actualizar la posición de un logo
    const updateLogoPosition = useCallback((logoId: string, x: number, y: number) => {
        setLogos(prev => prev.map(logo => 
            logo.id === logoId ? { ...logo, x, y } : logo
        ));
    }, []);

    // Función para actualizar el tamaño de un logo
    const updateLogoSize = useCallback((logoId: string, width: number, height: number) => {
        setLogos(prev => prev.map(logo => 
            logo.id === logoId ? { ...logo, width, height } : logo
        ));
    }, []);

    // Función para actualizar la rotación de un logo
    const updateLogoRotation = useCallback((logoId: string, rotation: number) => {
        setLogos(prev => prev.map(logo => 
            logo.id === logoId ? { ...logo, rotation } : logo
        ));
    }, []);

    // Función para actualizar la opacidad de un logo
    const updateLogoOpacity = useCallback((logoId: string, opacity: number) => {
        setLogos(prev => prev.map(logo => 
            logo.id === logoId ? { ...logo, opacity } : logo
        ));
    }, []);

    // Función para manejar la subida de imagen
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para renderizar el canvas con el producto y logos
    const renderCanvas = useCallback(() => {
        if (!canvasRef.current || !productImageRef.current || !productImageReady) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar imagen del producto
        ctx.drawImage(productImageRef.current, 0, 0, canvas.width, canvas.height);

        // Dibujar logos solo si están completamente cargados
        logos.forEach(logo => {
            const logoImg = new Image();
            logoImg.onload = () => {
                if (!canvasRef.current) return;
                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;

                ctx.save();
                ctx.globalAlpha = logo.opacity;
                ctx.translate(logo.x + logo.width / 2, logo.y + logo.height / 2);
                ctx.rotate((logo.rotation * Math.PI) / 180);
                
                ctx.drawImage(
                    logoImg,
                    -logo.width / 2,
                    -logo.height / 2,
                    logo.width,
                    logo.height
                );
                
                ctx.restore();
            };
            logoImg.onerror = () => {
                console.warn('Error loading logo image:', logo.imageUrl);
            };
            logoImg.src = logo.imageUrl;
        });
    }, [logos, canvasRef, productImageRef, productImageReady]);

    // Función para manejar el clic en el canvas
    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Buscar si se hizo clic en algún logo
        const clickedLogo = logos.find(logo => 
            x >= logo.x && x <= logo.x + logo.width &&
            y >= logo.y && y <= logo.y + logo.height
        );

        setSelectedLogo(clickedLogo?.id || null);
    }, [logos, canvasRef]);

    // Función para manejar el arrastre de logos
    const handleLogoDrag = useCallback((logoId: string, newX: number, newY: number) => {
        updateLogoPosition(logoId, newX, newY);
    }, [updateLogoPosition]);

    // Función para guardar las personalizaciones
    const handleSave = () => {
        onSave(logos);
    };

    // Renderizar el canvas cuando cambien los logos o cuando la imagen del producto esté lista
    React.useEffect(() => {
        if (productImageReady) {
            renderCanvas();
        }
    }, [logos, productImageReady, renderCanvas]);

    // Actualizar logos cuando cambien las personalizaciones iniciales
    React.useEffect(() => {
        setLogos(initialCustomizations);
    }, [initialCustomizations]);

    const selectedLogoData = logos.find(logo => logo.id === selectedLogo);

    return (
        <Dialog 
            open={isOpen} 
            onClose={onCancel}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Personalizar {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Agrega logos y personaliza tu producto
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    {/* Área de visualización */}
                    <Grid item xs={12} md={8}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 2, 
                                backgroundColor: '#f5f5f5',
                                position: 'relative'
                            }}
                        >
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={500}
                                    style={{
                                        border: '2px solid #ddd',
                                        cursor: 'crosshair',
                                        backgroundColor: 'white'
                                    }}
                                    onClick={handleCanvasClick}
                                />
                                
                                {/* Imagen de referencia (oculta) */}
                                <img
                                    ref={productImageRef}
                                    src={
                                        product.images?.[0]?.url || 
                                        product.images?.[0]?.image_path || 
                                        '/images/placeholder.jpg'
                                    }
                                    alt={product.name}
                                    style={{ display: 'none' }}
                                    onLoad={() => {
                                        setProductImageReady(true);
                                        renderCanvas();
                                    }}
                                    onError={() => {
                                        console.warn('Error loading product image');
                                        setProductImageReady(false);
                                    }}
                                />

                                {/* Logos renderizados */}
                                {logos.map(logo => (
                                    <Box
                                        key={logo.id}
                                        sx={{
                                            position: 'absolute',
                                            left: logo.x,
                                            top: logo.y,
                                            width: logo.width,
                                            height: logo.height,
                                            border: selectedLogo === logo.id ? '2px solid #1976d2' : '2px solid transparent',
                                            cursor: 'move',
                                            transform: `rotate(${logo.rotation}deg)`,
                                            opacity: logo.opacity,
                                            '&:hover': {
                                                border: '2px solid #1976d2',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                            },
                                            transition: 'all 0.2s ease-in-out',
                                            zIndex: selectedLogo === logo.id ? 10 : 1,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLogo(logo.id);
                                        }}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', logo.id);
                                        }}
                                        onDragEnd={(e) => {
                                            const canvas = canvasRef.current;
                                            if (!canvas) return;
                                            
                                            const rect = canvas.getBoundingClientRect();
                                            const x = e.clientX - rect.left;
                                            const y = e.clientY - rect.top;
                                            
                                            // Verificar que esté dentro de los límites del canvas
                                            if (x >= 0 && x <= canvas.width - logo.width && 
                                                y >= 0 && y <= canvas.height - logo.height) {
                                                handleLogoDrag(logo.id, x, y);
                                            }
                                        }}
                                    >
                                        <img
                                            src={logo.imageUrl}
                                            alt="Logo"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                        
                                        {/* Controles de redimensionamiento */}
                                        {selectedLogo === logo.id && (
                                            <>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        left: -5,
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#1976d2',
                                                        borderRadius: '50%',
                                                        cursor: 'nw-resize',
                                                        zIndex: 11,
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        right: -5,
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#1976d2',
                                                        borderRadius: '50%',
                                                        cursor: 'ne-resize',
                                                        zIndex: 11,
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: -5,
                                                        left: -5,
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#1976d2',
                                                        borderRadius: '50%',
                                                        cursor: 'sw-resize',
                                                        zIndex: 11,
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: -5,
                                                        right: -5,
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#1976d2',
                                                        borderRadius: '50%',
                                                        cursor: 'se-resize',
                                                        zIndex: 11,
                                                    }}
                                                />
                                            </>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Panel de controles */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            {/* Botón para agregar logo */}
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                fullWidth
                                onClick={() => setUploadDialogOpen(true)}
                                sx={{ mb: 2 }}
                            >
                                Agregar Logo
                            </Button>

                            {/* Lista de logos */}
                            {logos.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Logos ({logos.length})
                                    </Typography>
                                    {logos.map(logo => (
                                        <Chip
                                            key={logo.id}
                                            label={`Logo ${logo.id.slice(-4)}`}
                                            onClick={() => setSelectedLogo(logo.id)}
                                            onDelete={() => removeLogo(logo.id)}
                                            color={selectedLogo === logo.id ? 'primary' : 'default'}
                                            sx={{ m: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            )}

                            {/* Controles del logo seleccionado */}
                            {selectedLogoData && (
                                <Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Propiedades del Logo
                                    </Typography>

                                    {/* Posición X */}
                                    <Typography variant="body2" gutterBottom>
                                        Posición X: {Math.round(selectedLogoData.x)}px
                                    </Typography>
                                    <Slider
                                        value={selectedLogoData.x}
                                        onChange={(_, value) => updateLogoPosition(selectedLogoData.id, value as number, selectedLogoData.y)}
                                        min={0}
                                        max={400}
                                        sx={{ mb: 2 }}
                                    />

                                    {/* Posición Y */}
                                    <Typography variant="body2" gutterBottom>
                                        Posición Y: {Math.round(selectedLogoData.y)}px
                                    </Typography>
                                    <Slider
                                        value={selectedLogoData.y}
                                        onChange={(_, value) => updateLogoPosition(selectedLogoData.id, selectedLogoData.x, value as number)}
                                        min={0}
                                        max={500}
                                        sx={{ mb: 2 }}
                                    />

                                    {/* Ancho */}
                                    <Typography variant="body2" gutterBottom>
                                        Ancho: {Math.round(selectedLogoData.width)}px
                                    </Typography>
                                    <Slider
                                        value={selectedLogoData.width}
                                        onChange={(_, value) => updateLogoSize(selectedLogoData.id, value as number, selectedLogoData.height)}
                                        min={20}
                                        max={200}
                                        sx={{ mb: 2 }}
                                    />

                                    {/* Alto */}
                                    <Typography variant="body2" gutterBottom>
                                        Alto: {Math.round(selectedLogoData.height)}px
                                    </Typography>
                                    <Slider
                                        value={selectedLogoData.height}
                                        onChange={(_, value) => updateLogoSize(selectedLogoData.id, selectedLogoData.width, value as number)}
                                        min={20}
                                        max={200}
                                        sx={{ mb: 2 }}
                                    />

                                    {/* Rotación */}
                                    <Typography variant="body2" gutterBottom>
                                        Rotación: {selectedLogoData.rotation}°
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => updateLogoRotation(selectedLogoData.id, selectedLogoData.rotation - 15)}
                                        >
                                            <RotateLeftIcon />
                                        </IconButton>
                                        <Slider
                                            value={selectedLogoData.rotation}
                                            onChange={(_, value) => updateLogoRotation(selectedLogoData.id, value as number)}
                                            min={-180}
                                            max={180}
                                            sx={{ flex: 1 }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => updateLogoRotation(selectedLogoData.id, selectedLogoData.rotation + 15)}
                                        >
                                            <RotateRightIcon />
                                        </IconButton>
                                    </Box>

                                    {/* Opacidad */}
                                    <Typography variant="body2" gutterBottom>
                                        Opacidad: {Math.round(selectedLogoData.opacity * 100)}%
                                    </Typography>
                                    <Slider
                                        value={selectedLogoData.opacity}
                                        onChange={(_, value) => updateLogoOpacity(selectedLogoData.id, value as number)}
                                        min={0.1}
                                        max={1}
                                        step={0.1}
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onCancel} color="inherit">
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    disabled={logos.length === 0}
                >
                    Guardar Personalización
                </Button>
            </DialogActions>

            {/* Dialog para subir imagen */}
            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
                <DialogTitle>Subir Logo</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="logo-upload"
                        />
                        <label htmlFor="logo-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<UploadIcon />}
                                fullWidth
                            >
                                Seleccionar Imagen
                            </Button>
                        </label>
                    </Box>
                    
                    {uploadedImage && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={uploadedImage}
                                alt="Logo preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={addLogo} 
                        variant="contained"
                        disabled={!uploadedImage}
                    >
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default ProductCustomizer;
