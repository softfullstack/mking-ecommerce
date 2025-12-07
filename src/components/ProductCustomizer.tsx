import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    Divider,
    TextField,
    Tabs,
    Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Save as SaveIcon,
    Upload as UploadIcon,
    RotateLeft as RotateLeftIcon,
    RotateRight as RotateRightIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    OpenWith as MoveIcon,
    ZoomOutMap as ResizeIcon,
    Refresh as RotateIcon
} from '@mui/icons-material';
import { ItemCustomization, LogoCustomization } from '../interfaces/CustomizationInterface';

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
    quantity: number;
    onSave: (customizations: ItemCustomization[]) => void;
    onCancel: () => void;
    isOpen: boolean;
    initialCustomizations?: ItemCustomization[];
}

// Define the customization zone (area where logos can be placed on the vest)
const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 550;
const ZONE = {
    x: 100,      // Left boundary
    y: 120,      // Top boundary  
    width: 250,  // Zone width
    height: 280  // Zone height
};

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
    product,
    quantity,
    onSave,
    onCancel,
    isOpen,
    initialCustomizations = []
}) => {
    // State for all items' customizations
    const [itemsCustomizations, setItemsCustomizations] = useState<ItemCustomization[]>([]);
    const [activeItemIndex, setActiveItemIndex] = useState(0);

    // State for the currently selected logo in the active item
    const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialLogoState, setInitialLogoState] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [productImageReady, setProductImageReady] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const productImageRef = useRef<HTMLImageElement>(null);

    // Initialize customizations based on quantity
    useEffect(() => {
        if (isOpen) {
            const newCustomizations: ItemCustomization[] = [];
            for (let i = 0; i < quantity; i++) {
                if (initialCustomizations[i]) {
                    newCustomizations.push(initialCustomizations[i]);
                } else {
                    newCustomizations.push({
                        id: `item-${Date.now()}-${i}`,
                        name: '',
                        logos: []
                    });
                }
            }
            setItemsCustomizations(newCustomizations);
            setActiveItemIndex(0);
            setSelectedLogoId(null);
        }
    }, [isOpen, quantity, initialCustomizations]);

    const activeCustomization = itemsCustomizations[activeItemIndex] || { id: 'temp', logos: [] };
    const logos = activeCustomization.logos || [];

    // Update the current item's customization
    const updateActiveItem = useCallback((updates: Partial<ItemCustomization>) => {
        setItemsCustomizations(prev => {
            const newItems = [...prev];
            newItems[activeItemIndex] = { ...newItems[activeItemIndex], ...updates };
            return newItems;
        });
    }, [activeItemIndex]);

    // Update logos for the current item
    const updateLogos = useCallback((newLogos: LogoCustomization[]) => {
        updateActiveItem({ logos: newLogos });
    }, [updateActiveItem]);

    // Update a single logo
    const updateLogo = useCallback((logoId: string, updates: Partial<LogoCustomization>) => {
        updateLogos(logos.map(logo =>
            logo.id === logoId ? { ...logo, ...updates } : logo
        ));
    }, [logos, updateLogos]);

    // Clamp position within zone
    const clampPosition = useCallback((x: number, y: number, width: number, height: number) => {
        const clampedX = Math.max(ZONE.x, Math.min(ZONE.x + ZONE.width - width, x));
        const clampedY = Math.max(ZONE.y, Math.min(ZONE.y + ZONE.height - height, y));
        return { x: clampedX, y: clampedY };
    }, []);

    // Image compression function
    const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1080;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
            };
        });
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const compressedBase64 = await compressImage(file);
                setUploadedImage(compressedBase64);
            } catch (error) {
                console.error("Error compressing image:", error);
            }
        }
    };

    const addLogo = useCallback(() => {
        if (!uploadedImage) return;

        // Place new logo in center of zone
        const logoSize = 80;
        const newLogo: LogoCustomization = {
            id: `logo-${Date.now()}`,
            imageUrl: uploadedImage,
            x: ZONE.x + (ZONE.width - logoSize) / 2,
            y: ZONE.y + (ZONE.height - logoSize) / 2,
            width: logoSize,
            height: logoSize,
            rotation: 0,
            opacity: 1
        };

        updateLogos([...logos, newLogo]);
        setSelectedLogoId(newLogo.id);
        setUploadedImage('');
        setUploadDialogOpen(false);
    }, [uploadedImage, logos, updateLogos]);

    const removeLogo = useCallback((logoId: string) => {
        updateLogos(logos.filter(logo => logo.id !== logoId));
        if (selectedLogoId === logoId) {
            setSelectedLogoId(null);
        }
    }, [logos, selectedLogoId, updateLogos]);

    // Mouse event handlers for drag
    const handleMouseDown = useCallback((e: React.MouseEvent, logoId: string, action: 'move' | 'resize' | 'rotate') => {
        e.preventDefault();
        e.stopPropagation();

        const logo = logos.find(l => l.id === logoId);
        if (!logo) return;

        setSelectedLogoId(logoId);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialLogoState({
            x: logo.x,
            y: logo.y,
            width: logo.width,
            height: logo.height,
            rotation: logo.rotation
        });

        if (action === 'move') setIsDragging(true);
        else if (action === 'resize') setIsResizing(true);
        else if (action === 'rotate') setIsRotating(true);
    }, [logos]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!selectedLogoId) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        if (isDragging) {
            const newX = initialLogoState.x + deltaX;
            const newY = initialLogoState.y + deltaY;
            const clamped = clampPosition(newX, newY, initialLogoState.width, initialLogoState.height);
            updateLogo(selectedLogoId, { x: clamped.x, y: clamped.y });
        } else if (isResizing) {
            // Calculate new size based on diagonal distance
            const newWidth = Math.max(30, Math.min(200, initialLogoState.width + deltaX));
            const newHeight = Math.max(30, Math.min(200, initialLogoState.height + deltaY));
            // Keep aspect ratio approximately
            const avgSize = (newWidth + newHeight) / 2;

            // Ensure logo stays in zone after resize
            const clamped = clampPosition(initialLogoState.x, initialLogoState.y, avgSize, avgSize);
            updateLogo(selectedLogoId, {
                width: avgSize,
                height: avgSize,
                x: clamped.x,
                y: clamped.y
            });
        } else if (isRotating) {
            // Calculate rotation based on horizontal movement
            const newRotation = initialLogoState.rotation + deltaX;
            updateLogo(selectedLogoId, { rotation: newRotation % 360 });
        }
    }, [isDragging, isResizing, isRotating, selectedLogoId, dragStart, initialLogoState, updateLogo, clampPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setIsRotating(false);
    }, []);

    // Add global mouse event listeners
    useEffect(() => {
        if (isDragging || isResizing || isRotating) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

    // Deselect when clicking on container background
    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
            setSelectedLogoId(null);
        }
    }, []);

    const selectedLogoData = logos.find(logo => logo.id === selectedLogoId);

    // Control button style
    const controlButtonStyle = {
        width: 28,
        height: 28,
        backgroundColor: '#333',
        color: 'white',
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        '&:hover': {
            backgroundColor: '#555',
        },
        position: 'absolute' as const,
        zIndex: 100,
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onCancel}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Personalizar {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Personaliza cada artículo individualmente ({quantity} unidades)
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    {/* Item Selector (if quantity > 1) */}
                    {quantity > 1 && (
                        <Grid item xs={12}>
                            <Paper variant="outlined">
                                <Tabs
                                    value={activeItemIndex}
                                    onChange={(_, val) => {
                                        setActiveItemIndex(val);
                                        setSelectedLogoId(null);
                                    }}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    {itemsCustomizations.map((item, index) => (
                                        <Tab
                                            key={index}
                                            label={item.name ? `${index + 1}. ${item.name}` : `Artículo ${index + 1}`}
                                        />
                                    ))}
                                </Tabs>
                            </Paper>
                        </Grid>
                    )}

                    {/* Canvas Area */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                backgroundColor: '#e8e8e8',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                ref={containerRef}
                                onClick={handleContainerClick}
                                sx={{
                                    position: 'relative',
                                    width: CANVAS_WIDTH,
                                    height: CANVAS_HEIGHT,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    cursor: isDragging ? 'grabbing' : 'default',
                                    userSelect: 'none',
                                }}
                            >
                                {/* Product Image */}
                                <img
                                    ref={productImageRef}
                                    src={
                                        product.images?.[0]?.url ||
                                        product.images?.[0]?.image_path ||
                                        '/images/placeholder.jpg'
                                    }
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        pointerEvents: 'none'
                                    }}
                                    onLoad={() => setProductImageReady(true)}
                                    onError={() => setProductImageReady(false)}
                                />

                                {/* Customization Zone Indicator */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: ZONE.x,
                                        top: ZONE.y,
                                        width: ZONE.width,
                                        height: ZONE.height,
                                        border: '2px dashed rgba(25, 118, 210, 0.5)',
                                        borderRadius: 1,
                                        pointerEvents: 'none',
                                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                    }}
                                />

                                {/* Logo Elements */}
                                {logos.map(logo => {
                                    const isSelected = selectedLogoId === logo.id;

                                    return (
                                        <Box
                                            key={logo.id}
                                            sx={{
                                                position: 'absolute',
                                                left: logo.x,
                                                top: logo.y,
                                                width: logo.width,
                                                height: logo.height,
                                                transform: `rotate(${logo.rotation}deg)`,
                                                transformOrigin: 'center center',
                                                cursor: isDragging && isSelected ? 'grabbing' : 'grab',
                                                zIndex: isSelected ? 50 : 10,
                                            }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                handleMouseDown(e, logo.id, 'move');
                                            }}
                                        >
                                            {/* Logo Image */}
                                            <img
                                                src={logo.imageUrl}
                                                alt="Logo"
                                                draggable={false}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    pointerEvents: 'none',
                                                    border: isSelected ? '2px solid #1976d2' : '2px solid transparent',
                                                    boxSizing: 'border-box',
                                                    borderRadius: 4,
                                                }}
                                            />

                                            {/* Control Buttons - Only show when selected */}
                                            {isSelected && (
                                                <>
                                                    {/* Delete Button - Top Left */}
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            ...controlButtonStyle,
                                                            top: -14,
                                                            left: -14,
                                                            backgroundColor: '#d32f2f',
                                                            '&:hover': { backgroundColor: '#f44336' },
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeLogo(logo.id);
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>

                                                    {/* Rotate Button - Top Right */}
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            ...controlButtonStyle,
                                                            top: -14,
                                                            right: -14,
                                                            cursor: 'grab',
                                                        }}
                                                        onMouseDown={(e) => handleMouseDown(e, logo.id, 'rotate')}
                                                    >
                                                        <RotateIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>

                                                    {/* Resize Button - Bottom Right */}
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            ...controlButtonStyle,
                                                            bottom: -14,
                                                            right: -14,
                                                            cursor: 'nwse-resize',
                                                        }}
                                                        onMouseDown={(e) => handleMouseDown(e, logo.id, 'resize')}
                                                    >
                                                        <ResizeIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>

                                                    {/* Move indicator - Bottom Left */}
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            ...controlButtonStyle,
                                                            bottom: -14,
                                                            left: -14,
                                                            cursor: 'move',
                                                        }}
                                                        onMouseDown={(e) => handleMouseDown(e, logo.id, 'move')}
                                                    >
                                                        <MoveIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </>
                                            )}
                                        </Box>
                                    );
                                })}

                                {/* Zone Label */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: CANVAS_HEIGHT - ZONE.y - ZONE.height - 25,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: 'rgba(0,0,0,0.4)',
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        px: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    Zona de personalización
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Controls Panel */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                            <Typography variant="h6" gutterBottom>
                                {quantity > 1 ? `Artículo ${activeItemIndex + 1}` : 'Personalización'}
                            </Typography>

                            <TextField
                                fullWidth
                                label="Nombre (Bordado)"
                                value={activeCustomization.name || ''}
                                onChange={(e) => updateActiveItem({ name: e.target.value })}
                                placeholder="Ej. Juan Pérez"
                                helperText="Escribe el nombre que deseas bordar en este chaleco"
                                sx={{ mb: 3 }}
                            />

                            <Divider sx={{ mb: 2 }} />

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                fullWidth
                                onClick={() => setUploadDialogOpen(true)}
                                sx={{ mb: 2 }}
                            >
                                Agregar Logo
                            </Button>

                            {logos.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Logos agregados:</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {logos.map((logo, index) => (
                                            <Chip
                                                key={logo.id}
                                                label={`Logo ${index + 1}`}
                                                onClick={() => setSelectedLogoId(logo.id)}
                                                onDelete={() => removeLogo(logo.id)}
                                                color={selectedLogoId === logo.id ? 'primary' : 'default'}
                                                avatar={<img src={logo.imageUrl} alt="logo" style={{ borderRadius: '50%' }} />}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {selectedLogoData && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" gutterBottom>Ajustes Precisos</Typography>

                                    <Typography variant="caption">Posición X</Typography>
                                    <Slider
                                        size="small"
                                        value={selectedLogoData.x}
                                        onChange={(_, v) => {
                                            const clamped = clampPosition(v as number, selectedLogoData.y, selectedLogoData.width, selectedLogoData.height);
                                            updateLogo(selectedLogoData.id, { x: clamped.x });
                                        }}
                                        min={ZONE.x}
                                        max={ZONE.x + ZONE.width - selectedLogoData.width}
                                    />

                                    <Typography variant="caption">Posición Y</Typography>
                                    <Slider
                                        size="small"
                                        value={selectedLogoData.y}
                                        onChange={(_, v) => {
                                            const clamped = clampPosition(selectedLogoData.x, v as number, selectedLogoData.width, selectedLogoData.height);
                                            updateLogo(selectedLogoData.id, { y: clamped.y });
                                        }}
                                        min={ZONE.y}
                                        max={ZONE.y + ZONE.height - selectedLogoData.height}
                                    />

                                    <Typography variant="caption">Tamaño</Typography>
                                    <Slider
                                        size="small"
                                        value={selectedLogoData.width}
                                        onChange={(_, v) => {
                                            const size = v as number;
                                            const clamped = clampPosition(selectedLogoData.x, selectedLogoData.y, size, size);
                                            updateLogo(selectedLogoData.id, {
                                                width: size,
                                                height: size,
                                                x: clamped.x,
                                                y: clamped.y
                                            });
                                        }}
                                        min={30}
                                        max={Math.min(ZONE.width, ZONE.height)}
                                    />

                                    <Typography variant="caption">Rotación</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => updateLogo(selectedLogoData.id, { rotation: selectedLogoData.rotation - 15 })}
                                        >
                                            <RotateLeftIcon fontSize="small" />
                                        </IconButton>
                                        <Slider
                                            size="small"
                                            value={selectedLogoData.rotation}
                                            onChange={(_, v) => updateLogo(selectedLogoData.id, { rotation: v as number })}
                                            min={-180}
                                            max={180}
                                            sx={{ mx: 1 }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => updateLogo(selectedLogoData.id, { rotation: selectedLogoData.rotation + 15 })}
                                        >
                                            <RotateRightIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => removeLogo(selectedLogoData.id)}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Eliminar Logo
                                    </Button>
                                </Box>
                            )}

                            {/* Instructions */}
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    <strong>Instrucciones:</strong><br />
                                    • Arrastra el logo para moverlo<br />
                                    • Usa los controles en las esquinas para rotar/redimensionar<br />
                                    • El logo debe permanecer dentro de la zona marcada
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onCancel} color="inherit">
                    Cancelar
                </Button>
                <Button
                    onClick={() => onSave(itemsCustomizations)}
                    variant="contained"
                    startIcon={<SaveIcon />}
                >
                    Guardar Todo
                </Button>
            </DialogActions>

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
                <DialogTitle>Subir Logo</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, mt: 1 }}>
                        <Typography variant="body2" gutterBottom>
                            La imagen se optimizará automáticamente (Max 1080p).
                        </Typography>
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
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
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
