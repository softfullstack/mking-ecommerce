import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, CardActions, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { Product } from "../interfaces/ProductInterface"
import { useState, useEffect } from "react"
import { getPreferredIdentifier } from "../utils/uuidUtils"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import useAuthStore from "../store/AuthStore"
import { ToggleFavoriteService } from "../services/MKing.service"
import { toast } from "react-toastify"
import useCartStore from "../store/CartStore"
import { showCartToast } from "../utils/toastUtils"

const ProductCard = ({ product }: { product: Product }) => {
    const { id, uuid, name, price, images: originalImages, colors, isNew, discount } = product
    // Reordenar imágenes para que la principal esté primero
    const images = originalImages && Array.isArray(originalImages)
        ? [...originalImages].sort((a, b) => {
            if ((a as any).is_primary === (b as any).is_primary) return 0;
            if ((a as any).is_primary) return -1;
            if ((b as any).is_primary) return 1;
            return 0;
        })
        : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
    const [selectedSize, setSelectedSize] = useState("")

    const { addToCart } = useCartStore()

    useEffect(() => {
        let interval: number | null = null
        if (isHovered && images && images.length > 1) {
            interval = window.setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
            }, 1000)
        } else {
            setCurrentImageIndex(0)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isHovered, images])

    const hasImages = images && images.length > 0
    const currentImage = hasImages ? images[currentImageIndex] : null
    const imageUrl = currentImage?.url || currentImage?.image_path || "/images/placeholder.jpg"

    const productIdentifier = getPreferredIdentifier({ uuid, id })

    const { user, toggleFavoriteAction, isAuthenticated } = useAuthStore()
    const isFavorite = user?.favorites?.some((f: any) => getPreferredIdentifier(f) === productIdentifier)

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            toast.info("Inicia sesión para guardar tus favoritos")
            return
        }

        try {
            await ToggleFavoriteService(productIdentifier)
            toggleFavoriteAction(product)
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    const categoryTitle = (product as any).category?.name || (product.categories && product.categories[0]) || "Categoría"

    const normalizedColors = colors?.map((c: any) => typeof c === 'string' ? c : (c.hex_code || c)) || []

    const normalizedSizesChoices = Array.isArray(product.sizes)
        ? product.sizes.map((s: any) => typeof s === 'object' && s.name ? s.name : s)
        : (typeof (product.sizes as string) === 'string'
            ? (product.sizes as string).split(',').map((s: string) => s.trim()).filter(Boolean)
            : []);

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (normalizedSizesChoices.length > 1) {
            setIsSizeDialogOpen(true)
        } else {
            const sizeToAdd = normalizedSizesChoices.length === 1 ? normalizedSizesChoices[0] : "Única"
            executeAddToCart(sizeToAdd)
        }
    }

    const executeAddToCart = (size: string) => {
        const mainColor = colors && colors.length > 0 ? colors[0] : null
        const colorName = mainColor && typeof mainColor === 'object' ? (mainColor as any).name : (typeof mainColor === 'string' ? mainColor : "")

        addToCart(product, 1, size, colorName)
        showCartToast(product)
        setIsSizeDialogOpen(false)
        setSelectedSize("")
    }

    const handleConfirmSize = () => {
        if (!selectedSize) {
            toast.warning("Por favor selecciona una talla")
            return
        }
        executeAddToCart(selectedSize)
    }

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
                    label="Nuevo"
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

            <IconButton
                onClick={handleToggleFavorite}
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 1)",
                        transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease-in-out",
                }}
            >
                {isFavorite ? (
                    <FavoriteIcon color="error" />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>

            <CardActionArea
                component={Link}
                to={`/producto/${productIdentifier}`}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
            >
                <Box sx={{ position: "relative", pt: "100%", width: "100%" }}>
                    <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={name}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                            p: 2,
                            backgroundColor: "#f8f8f8",
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
                        {categoryTitle}
                    </Typography>

                    <Typography
                        variant="body1"
                        component="h3"
                        sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                        }}
                    >
                        {name}
                    </Typography>

                    {normalizedColors.length > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
                            {((product as any).originalColors?.length > 0 ? (product as any).originalColors : normalizedColors).slice(0, 6).map((colorObj: any, index: number) => {
                                const hexColor = typeof colorObj === 'string' ? colorObj : (colorObj.hex_code || normalizedColors[index]);
                                const hasSecondColor = typeof colorObj === 'object' && colorObj.hex_code_1;
                                
                                const isSelected = (product as any).color_id !== undefined && typeof colorObj === 'object' 
                                    ? colorObj.id === (product as any).color_id 
                                    : index === 0;

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: "50%",
                                            background: hasSecondColor 
                                                ? `linear-gradient(130deg, ${hexColor} 50%, ${colorObj.hex_code_1} 50%)` 
                                                : hexColor,
                                            border: isSelected ? "2px solid #fff" : "1px solid #ccc",
                                            boxShadow: isSelected ? "0 0 0 1px #333" : "none",
                                            cursor: "pointer",
                                        }}
                                    />
                                );
                            })}
                            {normalizedColors.length > 6 && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                    +{normalizedColors.length - 6}
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Box sx={{ mt: 'auto', display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        {discount && discount > 0 ? (
                            <>
                                <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold", mr: 1, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
                                    ${(price * (1 - discount / 100)).toFixed(2)}
                                </Typography>
                                <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                    ${price.toFixed(2)}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
                                ${price.toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>

            <CardActions sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 1.5, sm: 2 }, pt: 0, justifyContent: "flex-start" }}>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleAddToCartClick}
                    sx={{ borderRadius: 8, textTransform: "none", fontWeight: "bold", fontSize: "0.8rem", px: 2, py: 0.5 }}
                >
                    Agregar al carrito
                </Button>
            </CardActions>

            <Dialog open={isSizeDialogOpen} onClose={() => setIsSizeDialogOpen(false)}>
                <DialogTitle>Selecciona la talla</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            {normalizedSizesChoices.map((size: string, idx: number) => (
                                <FormControlLabel key={idx} value={size} control={<Radio />} label={size} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSizeDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmSize} variant="contained" color="error" sx={{ borderRadius: 8, textTransform: "none", fontWeight: "bold", fontSize: "0.8rem", px: 2, py: 0.5 }}>
                        Agregar al carrito
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default ProductCard
