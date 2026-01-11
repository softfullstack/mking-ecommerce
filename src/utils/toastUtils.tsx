import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';

export const showCartToast = (product: any, message: string = "Producto agregado al carrito") => {
    // Buscar la imagen principal o la primera disponible
    let imageUrl = '/images/placeholder.jpg';

    if (product.images && product.images.length > 0) {
        const primaryImage = product.images.find((img: any) => img.is_primary);
        const imageToUse = primaryImage || product.images[0];
        imageUrl = imageToUse.url || imageToUse.image_path || imageUrl;
    } else if (product.img_product) {
        imageUrl = product.img_product;
    }

    toast.success(
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
                component="img"
                src={imageUrl}
                alt={product.name}
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 1,
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '1px solid #eee'
                }}
            />
            <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="body2" sx={{ fontWeight: '600', display: 'block' }}>
                    {message}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {product.name}
                </Typography>
            </Box>
        </Box>,
        {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
    );
};
