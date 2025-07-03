"use client"

import { useState, useEffect } from "react"
import { useParams, Link as RouterLink } from "react-router-dom"
import { Box, Container, Grid, Typography, Button, Divider, Rating, Tabs, Tab, List, ListItem, ListItemText, Chip, IconButton, Snackbar, Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Breadcrumbs, Link, AlertColor } from "@mui/material"
import { Favorite, FavoriteBorder, Share, LocalShipping, Verified, ArrowBack } from "@mui/icons-material"
import { SnackbarCloseReason } from "@mui/material/Snackbar"
import ProductCarousel from "../components/ProductCarousel"
import ProductCard from "../components/ProductCard"
import useCartStore from "../store/CartStore"
import { Product } from "../interfaces/ProductInterface"
import { getProductById } from "../services/MKing.service"

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [selectedColor, setSelectedColor] = useState<number | null>(null)
    const [selectedSize, setSelectedSize] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [tabValue, setTabValue] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success")
    const { addToCart } = useCartStore()

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const response = await getProductById(Number.parseInt(id))
                    const foundProduct = response.data
                    setProduct(foundProduct)
                    if (foundProduct.colors && foundProduct.colors.length > 0) {
                        setSelectedColor(foundProduct.colors[0].id)
                    }
                    // No seleccionar talla por defecto
                    // if (foundProduct.sizes && foundProduct.sizes.length > 0) {
                    //     setSelectedSize(foundProduct.sizes[0])
                    // }
                    // TODO: Implement fetching related products from the API
                } catch (error) {
                    console.error("Failed to fetch product", error)
                    // Optionally, set an error state to show a message to the user
                }
            }
        }
        fetchProduct()
    }, [id])

    if (!product) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="h5">Cargando producto...</Typography>
            </Container>
        )
    }

    // Normalizar tallas y colores para el render
    const normalizedSizes = Array.isArray(product.sizes)
        ? product.sizes.map((s: any) => typeof s === 'object' && s.name ? s.name : s)
        : (typeof (product.sizes as string) === 'string'
            ? (product.sizes as string).split(',').map((s: string) => s.trim()).filter(Boolean)
            : []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColor(Number(event.target.value))
    }

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSize(event.target.value)
    }

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity)
        }
    }

    const handleAddToCart = () => {
        if (selectedColor === null || !selectedSize) {
            setSnackbarMessage("Por favor selecciona color y talla")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
            return
        }
        // Buscar el color seleccionado como objeto para pasarlo al si es necesario
        const colorObj = product.colors.find((c: any) => typeof c === "object" && c.id === selectedColor)
        addToCart(product, quantity, selectedSize, colorObj && typeof colorObj === "object" && "name" in colorObj ? colorObj.name : (typeof selectedColor === "string" ? selectedColor : ""))
        setSnackbarMessage("Producto añadido al carrito")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)

        setSnackbarMessage(isFavorite ? "Producto eliminado de favoritos" : "Producto añadido a favoritos")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)

        setSnackbarMessage("Enlace copiado al portapapeles")
        setSnackbarSeverity("info")
        setSnackbarOpen(true)
    }

    const handleCloseSnackbar = (_event: Event | React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return
        }
        setSnackbarOpen(false)
    }


    const getColorHex = (colorId: string) => {
        if (typeof colorId !== "string") return "#cccccc";
        const colorMap: Record<string, string> = {
            negro: "#000000",
            rojo: "#ff0000",
            amarillo: "#ffff00",
            naranja: "#ff9800",
            azul: "#0000ff",
            verde: "#00ff00",
        }
        return colorMap[colorId.toLowerCase()] || "#cccccc"
    }

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

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link component={RouterLink} to="/" color="inherit">
                    Inicio
                </Link>
                <Link component={RouterLink} to="/productos" color="inherit">
                    Chalecos
                </Link>
                <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            <Button component={RouterLink} to="/productos" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
                Volver a productos
            </Button>

            <Grid container spacing={4}>
                {/* Product Images */}
                <Grid item xs={12} md={6}>
                    <ProductCarousel images={product.images.map((img) => img.url || "")} />
                </Grid>

                {/* Product Info */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        {product.isNew && (
                            <Chip label="NUEVO" color="primary" size="small" sx={{ alignSelf: "flex-start", mb: 2 }} />
                        )}

                        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
                            {product.name}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Rating value={product.rating} precision={0.5} readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                {/* ({product.reviewCount} reseñas) */}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            {
                                product.discount && product.discount > 0 ? (
                                    <>
                                        <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", mr: 2 }}>
                                            ${(Number(product.price) * (1 - (product.discount || 0) / 100)).toFixed(2)}
                                        </Typography>
                                        <Typography variant="h6" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                            ${Number(product.price).toFixed(2)}
                                        </Typography>
                                        <Chip label={`-${product.discount}%`} color="error" size="small" sx={{ ml: 2 }} />
                                    </>
                                ) : (
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
                                        ${Number(product.price).toFixed(2)}
                                    </Typography>
                                )}
                        </Box>

                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {product.description}
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        {/* Color selection */}
                        <FormControl component="fieldset" sx={{ mb: 3 }}>
                            <FormLabel component="legend" sx={{ fontWeight: "bold", color: "text.primary" }}>
                                Color
                            </FormLabel>
                            <RadioGroup row aria-label="color" name="color" value={selectedColor ?? ''} onChange={handleColorChange}>
                                {Array.isArray(product.colors) && product.colors.length > 0
                                    ? product.colors.map((color: any, idx: number) => (
                                        <FormControlLabel
                                            key={color.id || color.name || idx}
                                            value={color.id || color.name}
                                            control={
                                                <Radio
                                                    sx={{
                                                        color: color.hex_code || getColorHex(color.name || color),
                                                        "&.Mui-checked": {
                                                            color: color.hex_code || getColorHex(color.name || color),
                                                        },
                                                    }}
                                                />
                                            }
                                            label={color.name || color}
                                        />
                                    ))
                                    : null}
                            </RadioGroup>
                        </FormControl>

                        {/* Size selection */}
                        <FormControl component="fieldset" sx={{ mb: 3 }}>
                            <FormLabel component="legend" sx={{ fontWeight: "bold", color: "text.primary" }}>
                                Talla
                            </FormLabel>
                            <RadioGroup row aria-label="size" name="size" value={selectedSize} onChange={handleSizeChange}>
                                {normalizedSizes.map((sizeId: string) => (
                                    <FormControlLabel key={sizeId} value={sizeId} control={<Radio />} label={getSizeName(sizeId)} />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {/* Quantity */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 2 }}>
                                Cantidad:
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                }}
                            >
                                <Button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                    sx={{ minWidth: "40px" }}
                                >
                                    -
                                </Button>
                                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                                <Button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 10}
                                    sx={{ minWidth: "40px" }}
                                >
                                    +
                                </Button>
                            </Box>
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                            <Button variant="contained" color="primary" size="large" fullWidth onClick={handleAddToCart}>
                                Añadir al Carrito
                            </Button>
                            <IconButton
                                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                                onClick={toggleFavorite}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                }}
                            >
                                {isFavorite ? <Favorite color="primary" /> : <FavoriteBorder />}
                            </IconButton>
                            <IconButton
                                aria-label="Share"
                                onClick={handleShare}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                }}
                            >
                                <Share />
                            </IconButton>
                        </Box>

                        {/* Shipping info */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <LocalShipping />
                            <Typography variant="body2">Envío gratuito en pedidos superiores a $100</Typography>
                        </Box>

                        {/* Guarantee */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Verified />
                            <Typography variant="body2">Garantía de 2 años en todos nuestros productos</Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Product details tabs */}
                        <Box sx={{ width: "100%", mt: "auto" }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="product details tabs"
                                sx={{
                                    borderBottom: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <Tab label="Detalles" id="tab-0" aria-controls="tabpanel-0" />
                                <Tab label="Especificaciones" id="tab-1" aria-controls="tabpanel-1" />
                                <Tab label="Reseñas" id="tab-2" aria-controls="tabpanel-2" />
                            </Tabs>

                            <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0" sx={{ py: 3 }}>
                                <Typography variant="body2">{product.description || ""}</Typography>
                            </Box>

                            <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1" sx={{ py: 3 }}>
                                <List disablePadding>
                                    {(product.specifications || []).map((spec, index) => (
                                        <ListItem
                                            key={index}
                                            disablePadding
                                            sx={{
                                                py: 1,
                                                borderBottom: index < (product.specifications?.length || 0) - 1 ? 1 : 0,
                                                borderColor: "divider",
                                            }}
                                        >
                                            <ListItemText
                                                primary={spec.name}
                                                secondary={spec.value}
                                                primaryTypographyProps={{ fontWeight: "bold" }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2" sx={{ py: 3 }}>
                                {(product.reviews?.length || 0) > 0 ? (
                                    (product.reviews || []).map((review, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                mb: 3,
                                                pb: 3,
                                                borderBottom: index < (product.reviews?.length || 0) - 1 ? 1 : 0,
                                                borderColor: "divider",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                    {review.author}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {review.date}
                                                </Typography>
                                            </Box>
                                            <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />
                                            <Typography variant="body2">{review.comment}</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2">Este producto aún no tiene reseñas.</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Related products */}
            {relatedProducts.length > 0 && (
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
                        Productos Relacionados
                    </Typography>
                    <Grid container spacing={3}>
                        {relatedProducts.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={3}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={(event) => handleCloseSnackbar(event, "timeout")} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default ProductDetail
