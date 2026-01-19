import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import { Product } from '../interfaces/ProductInterface';

interface SizeSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    onConfirm: (size: string) => void;
}

const SizeSelectionDialog = ({ open, onClose, product, onConfirm }: SizeSelectionDialogProps) => {
    const [selectedSize, setSelectedSize] = useState('');

    // Reset selection when dialog opens with a new product
    useEffect(() => {
        if (open) {
            setSelectedSize('');
        }
    }, [open, product]);

    if (!product) return null;

    // Normalize sizes logic (taken from ProductDetail.tsx)
    const normalizedSizes = Array.isArray(product.sizes)
        ? product.sizes.map((s: any) => typeof s === 'object' && s.name ? s.name : s)
        : (typeof (product.sizes as any) === 'string'
            ? (product.sizes as any).split(',').map((s: string) => s.trim()).filter(Boolean)
            : []);

    const getSizeName = (sizeId: string) => {
        const sizeMap: Record<string, string> = {
            xs: "XS",
            s: "S",
            m: "M",
            l: "L",
            xl: "XL",
            xxl: "XXL",
        }
        return sizeMap[sizeId] || sizeId
    }

    const handleConfirm = () => {
        if (selectedSize) {
            onConfirm(selectedSize);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Selecciona una Talla</DialogTitle>
            <DialogContent>
                <Box sx={{ py: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {product.name}
                    </Typography>

                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            aria-label="size"
                            name="size"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            {normalizedSizes.map((sizeId: string) => (
                                <FormControlLabel
                                    key={sizeId}
                                    value={sizeId}
                                    control={<Radio />}
                                    label={getSizeName(sizeId)}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedSize}
                    sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
                >
                    Agregar al Carrito
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SizeSelectionDialog;
