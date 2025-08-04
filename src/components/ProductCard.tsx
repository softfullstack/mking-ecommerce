import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import { Product } from "../interfaces/ProductInterface"
import { useState, useEffect } from "react"
import { getPreferredIdentifier } from "../utils/uuidUtils"

const ProductCard = ({ product }: { product: Product }) => {
    const { id, uuid, name, price, images: originalImages, colors, isNew, discount } = product
    // Reordenar imágenes para que la principal esté primero
    const images = originalImages && Array.isArray(originalImages)
        ? [...originalImages].sort((a, b) => {
            // Si ambos tienen is_primary, o ambos no lo tienen, no cambiar el orden
            if ((a as any).is_primary === (b as any).is_primary) return 0;
            // Si a es principal, va antes
            if ((a as any).is_primary) return -1;
            // Si b es principal, va antes
            if ((b as any).is_primary) return 1;
            // Si ninguno es principal, no cambiar el orden
            return 0;
        })
        : [];
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
    const currentImage = hasImages ? images[currentImageIndex] : null
    const imageUrl = currentImage?.url || currentImage?.image_path || "/images/placeholder.jpg"

    // Obtener el identificador preferido (UUID o ID como fallback)
    const productIdentifier = getPreferredIdentifier({ uuid, id })

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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

            {typeof discount === "number" && discount > 0 && (
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
                to={`/producto/${productIdentifier}`}
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
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontWeight: "bold",
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        {discount && discount > 0 ? (
                            <>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ fontWeight: "bold", mr: 1 }}
                                >
                                    ${(price * (1 - discount / 100)).toFixed(2)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ textDecoration: "line-through", color: "text.secondary" }}
                                >
                                    ${price.toFixed(2)}
                                </Typography>
                            </>
                        ) : (
                            <Typography
                                variant="h6"
                                color="primary"
                                sx={{ fontWeight: "bold" }}
                            >
                                ${price.toFixed(2)}
                            </Typography>
                        )}
                    </Box>

                    {/* Color chips */}
                    {colors && colors.length > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            {/* Indicador principal de colores combinados */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                {colors.length === 1 ? (
                                    // Si solo hay un color, mostrar un círculo simple
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            backgroundColor: colors[0],
                                            border: "2px solid #fff",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        }}
                                    />
                                ) : (
                                    // Si hay múltiples colores, mostrar un indicador con superposición
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        {colors.slice(0, 3).map((color, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    backgroundColor: color,
                                                    border: "2px solid #fff",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                                    marginLeft: index > 0 ? "-8px" : 0,
                                                    zIndex: colors.length - index,
                                                    position: "relative",
                                                    "&:hover": {
                                                        transform: "scale(1.1)",
                                                        zIndex: 10,
                                                    },
                                                    transition: "transform 0.2s ease-in-out",
                                                }}
                                            />
                                        ))}
                                        {colors.length > 3 && (
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f0f0f0",
                                                    border: "2px solid #fff",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                                    marginLeft: "-8px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        fontSize: "0.6rem", 
                                                        fontWeight: "bold",
                                                        color: "#666"
                                                    }}
                                                >
                                                    +{colors.length - 3}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ProductCard
