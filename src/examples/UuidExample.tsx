import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { 
    isValidUuid, 
    generateUuid, 
    extractUuidFromUrl, 
    buildProductUrl, 
    hasValidUuid,
    getPreferredIdentifier 
} from '../utils/uuidUtils';

/**
 * Ejemplo de uso de las utilidades de UUID
 */
const UuidExample: React.FC = () => {
    // Ejemplos de UUIDs válidos e inválidos
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    const invalidUuid = "not-a-uuid";
    const productUrl = "/producto/550e8400-e29b-41d4-a716-446655440000";
    
    // Ejemplo de producto
    const productWithUuid = {
        id: 1,
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        name: "Chaleco Alta Visibilidad"
    };
    
    const productWithoutUuid = {
        id: 2,
        name: "Chaleco Ignífugo"
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Ejemplos de Utilidades UUID
            </Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Validación de UUID
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary={`UUID válido: ${validUuid}`}
                            secondary={`Resultado: ${isValidUuid(validUuid) ? '✅ Válido' : '❌ Inválido'}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary={`UUID inválido: ${invalidUuid}`}
                            secondary={`Resultado: ${isValidUuid(invalidUuid) ? '✅ Válido' : '❌ Inválido'}`}
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Generación de UUID
                </Typography>
                <Typography variant="body1">
                    UUID generado: {generateUuid()}
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Extracción de UUID de URL
                </Typography>
                <Typography variant="body1">
                    URL: {productUrl}
                </Typography>
                <Typography variant="body1">
                    UUID extraído: {extractUuidFromUrl(productUrl)}
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Construcción de URL de Producto
                </Typography>
                <Typography variant="body1">
                    URL construida: {buildProductUrl(validUuid)}
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Identificadores de Producto
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="Producto con UUID"
                            secondary={`Identificador: ${getPreferredIdentifier(productWithUuid)}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Producto sin UUID"
                            secondary={`Identificador: ${getPreferredIdentifier(productWithoutUuid)}`}
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Verificación de UUID en Producto
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="Producto con UUID válido"
                            secondary={`Tiene UUID válido: ${hasValidUuid(productWithUuid) ? '✅ Sí' : '❌ No'}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Producto sin UUID"
                            secondary={`Tiene UUID válido: ${hasValidUuid(productWithoutUuid) ? '✅ Sí' : '❌ No'}`}
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Casos de Uso Comunes
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="Navegación a producto"
                            secondary={`const url = buildProductUrl(product.uuid || product.id.toString())`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Validación antes de API call"
                            secondary={`if (isValidUuid(uuid)) { await getProductByUuid(uuid) }`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Fallback a ID"
                            secondary={`const identifier = getPreferredIdentifier({ uuid, id })`}
                        />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default UuidExample; 