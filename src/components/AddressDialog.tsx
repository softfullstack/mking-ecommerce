import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Grid, Button } from '@mui/material';

interface AddressDialogProps {
    open: boolean;
    onClose: () => void;
    address?: any;
    onSave: (data: any) => void;
}

const AddressDialog = ({ open, onClose, address, onSave }: AddressDialogProps) => {
    const [formData, setFormData] = useState({
        recipient_name: '',
        phone: '',
        street: '',
        exterior_number: '',
        interior_number: '',
        neighborhood: '',
        municipality: '',
        state: '',
        postal_code: '',
        references: ''
    });

    useEffect(() => {
        if (address) {
            setFormData({
                recipient_name: address.recipient_name || '',
                phone: address.phone || '',
                street: address.street || '',
                exterior_number: address.exterior_number || '',
                interior_number: address.interior_number || '',
                neighborhood: address.neighborhood || '',
                municipality: address.municipality || '',
                state: address.state || '',
                postal_code: address.postal_code || '',
                references: address.references || ''
            });
        } else {
            setFormData({
                recipient_name: '',
                phone: '',
                street: '',
                exterior_number: '',
                interior_number: '',
                neighborhood: '',
                municipality: '',
                state: '',
                postal_code: '',
                references: ''
            });
        }
    }, [address, open]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{address ? 'Editar Dirección' : 'Nueva Dirección de Envío'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField label="Nombre de quien recibe" name="recipient_name" value={formData.recipient_name} onChange={handleChange} fullWidth size="small" />
                    <TextField label="Teléfono de contacto" name="phone" value={formData.phone} onChange={handleChange} fullWidth size="small" />
                    <Grid container spacing={2}>
                        <Grid item xs={8}><TextField label="Calle" name="street" value={formData.street} onChange={handleChange} fullWidth size="small" /></Grid>
                        <Grid item xs={4}><TextField label="CP" name="postal_code" value={formData.postal_code} onChange={handleChange} fullWidth size="small" /></Grid>
                        <Grid item xs={6}><TextField label="No. Exterior" name="exterior_number" value={formData.exterior_number} onChange={handleChange} fullWidth size="small" /></Grid>
                        <Grid item xs={6}><TextField label="No. Interior" name="interior_number" value={formData.interior_number} onChange={handleChange} fullWidth size="small" /></Grid>
                    </Grid>
                    <TextField label="Colonia" name="neighborhood" value={formData.neighborhood} onChange={handleChange} fullWidth size="small" />
                    <Grid container spacing={2}>
                        <Grid item xs={6}><TextField label="Municipio" name="municipality" value={formData.municipality} onChange={handleChange} fullWidth size="small" /></Grid>
                        <Grid item xs={6}><TextField label="Estado" name="state" value={formData.state} onChange={handleChange} fullWidth size="small" /></Grid>
                    </Grid>
                    <TextField label="Referencias" name="references" value={formData.references} onChange={handleChange} fullWidth multiline rows={2} size="small" />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddressDialog;
