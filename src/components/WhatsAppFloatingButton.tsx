import React from 'react';
import { Fab, Zoom, useTheme, Tooltip } from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface WhatsAppFloatingButtonProps {
    phoneNumber: string;
    productName?: string | null;
}

const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
    phoneNumber,
    productName
}) => {
    const theme = useTheme();
    const location = useLocation();

    const handleWhatsAppClick = () => {
        const url = window.location.href;
        let message = "Hola, deseo más información.";

        // Si estamos en un producto y tenemos el nombre, personalizamos el mensaje
        if (location.pathname.includes('/producto/') && productName) {
            message = `Hola deseo más información del producto ${productName} ${url}`;
        } else {
            message = `Hola, vengo desde MKing y deseo más información. ${url}`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Zoom in={true} unmountOnExit>
            <Tooltip title="Contáctanos por WhatsApp" placement="left">
                <Fab
                    color="primary"
                    aria-label="whatsapp"
                    onClick={handleWhatsAppClick}
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 20, md: 32 },
                        right: { xs: 20, md: 32 },
                        backgroundColor: '#25D366', // Color oficial WhatsApp
                        '&:hover': {
                            backgroundColor: '#128C7E',
                            transform: 'scale(1.1)',
                        },
                        zIndex: 1100, // Por encima de Navbar y otros elementos
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                >
                    <WhatsAppIcon sx={{ color: 'white', fontSize: 34 }} />
                </Fab>
            </Tooltip>
        </Zoom>
    );
};

export default WhatsAppFloatingButton;
