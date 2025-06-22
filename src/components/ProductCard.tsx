import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import { Product } from "../interfaces/ProductInterface"
import { useState, useEffect } from "react"

const ProductCard = ({ product }: { product: Product }) => {
    const { id, name, price, images, colors, isNew, discount } = product
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        let interval: number | null = null
        if (isHovered && images && images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
            }, 1000) // Cambia la imagen cada segundo
        } else {
            setCurrentImageIndex(0)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isHovered, images])
    
    // Verificar si hay imágenes y si la imagen actual tiene una URL válida
    const hasImages = images && images.length > 0
    const imageUrl = hasImages && images[currentImageIndex] && images[currentImageIndex].url
        ? images[currentImageIndex].url
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlbjwvdGV4dD48L3N2Zz4=';

    // Verificar si hay colores
    const hasColors = colors && colors.length > 0;

    return (
        <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                maxWidth: 345,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                backgroundColor: "#1e1e1e",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                },
            }}
        >
            {isNew && (
                <Chip
                    label="NUEVO"
                    color="primary"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 1,
                        fontWeight: "bold",
                    }}
                />
            )}

            {discount > 0 && (
                <Chip
                    label={`-${discount}%`}
                    color="error"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        fontWeight: "bold",
                    }}
                />
            )}

            <CardActionArea
                component={Link}
                to={`/producto/${id}`}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
            >
                <CardMedia 
                    component="img" 
                    height="200" 
                    image={imageUrl} 
                    alt={name} 
                    sx={{ 
                        objectFit: "cover",
                        transition: 'opacity 0.3s ease-in-out', // Transición suave para el cambio de imagen
                    }}
                />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        {name}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                        {hasColors && colors.map((color, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: color,
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ mt: "auto" }}>
                        {discount > 0 ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                    ${(price * (1 - discount / 100)).toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                    ${price.toFixed(2)}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                {/* ${price.toFixed(2)} */}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ProductCard
