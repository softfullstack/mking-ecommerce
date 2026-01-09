"use client"

import { useState, useEffect } from "react"
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom"
import { Box, Container, Grid, Typography, Button, Divider, Rating, Tabs, Tab, List, ListItem, ListItemText, Chip, IconButton, Snackbar, Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Breadcrumbs, Link, AlertColor, Dialog } from "@mui/material"
import { Favorite, FavoriteBorder, Share, LocalShipping, Verified, ArrowBack, Close } from "@mui/icons-material"
import { SnackbarCloseReason } from "@mui/material/Snackbar"
import ProductCarousel from "../components/ProductCarousel"
import RelatedProductsCarousel from "../components/RelatedProductsCarousel"
import useCartStore from "../store/CartStore"
import { Product } from "../interfaces/ProductInterface"
import { getProductByUuid, getProductById, getProductsByCategory } from "../services/MKing.service"
import { isValidUuid, getPreferredIdentifier } from "../utils/uuidUtils"
import useAuthStore from "../store/AuthStore"
import { ToggleFavoriteService } from "../services/MKing.service"

const ProductDetail = () => {
    const { uuid } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [relatedProductsForCarousel, setRelatedProductsForCarousel] = useState<Product[]>([])
    const [selectedColor, setSelectedColor] = useState<number | null>(null)
    const [selectedSize, setSelectedSize] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [tabValue, setTabValue] = useState(0)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success")
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [modalActiveStep, setModalActiveStep] = useState(0)
    const { addToCart } = useCartStore()
    const { user, toggleFavoriteAction, isAuthenticated } = useAuthStore()
    const isFavorite = user?.favorites?.some((f: any) => f.id === product?.id)

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (uuid) {
                try {
                    let response;

                    // Intentar usar UUID primero, si no es válido usar ID como fallback
                    if (isValidUuid(uuid)) {
                        response = await getProductByUuid(uuid)
                    } else {
                        // Si no es un UUID válido, intentar como ID numérico
                        const numericId = parseInt(uuid)
                        if (!isNaN(numericId)) {
                            response = await getProductById(numericId)
                        } else {
                            throw new Error('Invalid product identifier')
                        }
                    }

                    const foundProduct = response.data
                    setProduct(foundProduct)
                    console.log('Producto cargado:', foundProduct.name)
                    console.log('Colores del producto:', foundProduct.colors)

                    if (foundProduct.colors && foundProduct.colors.length > 0) {
                        setSelectedColor(foundProduct.colors[0].id)
                    }

                    // Cargar productos relacionados de la misma categoría
                    if (foundProduct.category_id) {
                        try {
                            const relatedResponse = await getProductsByCategory(foundProduct.category_id)
                            const relatedProductsData = relatedResponse.data.products || []
                            console.log('Productos relacionados encontrados:', relatedProductsData.length)

                            // Transformar los datos de productos relacionados
                            const transformedRelated = relatedProductsData.map((p: any) => ({
                                id: p.id,
                                uuid: p.uuid,
                                name: p.name,
                                price: parseFloat(p.price),
                                discount: 0,
                                description: p.description,
                                details: p.description,
                                images: p.images || [],
                                colors: p.colors || [],
                                colorIds: p.colors?.map((c: any) => c.id) || [],
                                sizes: ["s", "m", "l", "xl"],
                                categories: [p.category?.name?.toLowerCase() || ""],
                                isNew: new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                                rating: 5,
                                reviewCount: 0,
                                reviews: [],
                                specifications: []
                            }))

                            // Filtrar el producto actual solo para el carrusel de productos relacionados
                            const filteredForCarousel = transformedRelated.filter((p: any) => p.uuid !== foundProduct.uuid)

                            // Para los colores disponibles, incluir TODOS los productos de la categoría
                            setRelatedProducts(transformedRelated)

                            console.log('Productos para colores disponibles:', transformedRelated.length)
                            console.log('Productos para carrusel:', filteredForCarousel.length)
                            console.log('Colores disponibles en productos relacionados:', transformedRelated.map((p: any) => ({ name: p.name, colors: p.colors?.length || 0 })))

                            // También guardar los productos filtrados para el carrusel
                            setRelatedProductsForCarousel(filteredForCarousel)
                        } catch (error) {
                            console.error("Failed to fetch related products", error)
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch product", error)
                }
            }
        }
        fetchProduct()
    }, [uuid])

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
        const colorObj = product.colors.find(
            (c: any) => typeof c === "object" && c.id === selectedColor
        )
        // Usar el nombre del color si existe, de lo contrario usar el id o string
        const colorName =
            colorObj && typeof colorObj === "object" && (colorObj as { name?: string }).name
                ? (colorObj as { name: string }).name
                : (typeof selectedColor === "string" ? selectedColor : "")

        addToCart(product, quantity, selectedSize, colorName)
        setSnackbarMessage("Producto añadido al carrito")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
    }

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            setSnackbarMessage("Inicia sesión para guardar tus favoritos")
            setSnackbarSeverity("info")
            setSnackbarOpen(true)
            return
        }

        try {
            await ToggleFavoriteService(product.id)
            toggleFavoriteAction(product)

            setSnackbarMessage(!isFavorite ? "Producto añadido a favoritos" : "Producto eliminado de favoritos")
            setSnackbarSeverity("success")
            setSnackbarOpen(true)
        } catch (error) {
            console.error("Error toggling favorite:", error)
            setSnackbarMessage("Error al actualizar favoritos")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
        }
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

    const handleColorClick = (colorId: number) => {
        // Buscar el producto que tenga este color
        const productWithColor = relatedProducts.find(p =>
            p.colors && p.colors.some((c: any) => c.id === colorId)
        )

        if (productWithColor) {
            const productIdentifier = getPreferredIdentifier({ uuid: productWithColor.uuid, id: productWithColor.id })
            navigate(`/producto/${productIdentifier}`)
        }
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

    const handleOpenImageModal = (index: number) => {
        setModalActiveStep(index)
        setIsImageModalOpen(true)
    }

    const handleCloseImageModal = () => {
        setIsImageModalOpen(false)
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
                    <ProductCarousel
                        images={product.images.map((img) => img.url || "")}
                        onImageClick={handleOpenImageModal}
                    />
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
                                    ? product.colors.map((color: any, idx: number) => {
                                        const hasSecondColor = color.hex_code_1 && color.hex_code_1 !== null;
                                        const isSelected = selectedColor === color.id;

                                        return (
                                            <FormControlLabel
                                                key={color.id || color.name || idx}
                                                value={color.id || color.name}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: "transparent",
                                                            "&.Mui-checked": {
                                                                color: "transparent",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        {/* Indicador de color combinado */}
                                                        <Box
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: "50%",
                                                                border: isSelected ? "3px solid #1976d2" : "2px solid #e0e0e0",
                                                                background: hasSecondColor
                                                                    ? `linear-gradient(130deg, ${color.hex_code} 50%, ${color.hex_code_1} 50%)`
                                                                    : color.hex_code,
                                                                boxShadow: isSelected
                                                                    ? "0 0 0 3px rgba(25, 118, 210, 0.15), 0 4px 12px rgba(0,0,0,0.15)"
                                                                    : "0 2px 8px rgba(0,0,0,0.1)",
                                                                transition: "all 0.3s ease-in-out",
                                                                cursor: "pointer",
                                                                "&:hover": {
                                                                    transform: "scale(1.08)",
                                                                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                                                                    border: isSelected ? "3px solid #1976d2" : "2px solid #bdbdbd",
                                                                },
                                                                position: "relative",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {/* Indicador de selección interno */}
                                                            {isSelected && (
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        top: "50%",
                                                                        left: "50%",
                                                                        transform: "translate(-50%, -50%)",
                                                                        width: 12,
                                                                        height: 12,
                                                                        borderRadius: "50%",
                                                                        backgroundColor: "white",
                                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                }
                                                sx={{
                                                    margin: 0,
                                                    marginRight: 2,
                                                    marginBottom: 1,
                                                }}
                                            />
                                        );
                                    })
                                    : null}
                            </RadioGroup>
                        </FormControl>

                        {/* Otros colores disponibles */}
                        {(relatedProducts.length > 0 || (product.colors && product.colors.length > 1)) && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                                    Otros colores disponibles
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                    {relatedProducts.length > 0 ? (
                                        // Mostrar colores de productos relacionados
                                        relatedProducts.map((relatedProduct) =>
                                            relatedProduct.colors?.map((color: any) => {
                                                // Evitar mostrar colores que ya están seleccionados en el producto actual
                                                const isCurrentProductColor = product.colors?.some((c: any) => c.id === color.id)
                                                if (isCurrentProductColor) return null

                                                const hasSecondColor = color.hex_code_1 && color.hex_code_1 !== null;
                                                return (
                                                    <Box
                                                        key={`${relatedProduct.id}-${color.id}`}
                                                        onClick={() => handleColorClick(color.id)}
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: "50%",
                                                            cursor: "pointer",
                                                            border: "2px solid #e0e0e0",
                                                            background: hasSecondColor
                                                                ? `linear-gradient(130deg, ${color.hex_code} 50%, ${color.hex_code_1} 50%)`
                                                                : color.hex_code,
                                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                            transition: "all 0.3s ease-in-out",
                                                            "&:hover": {
                                                                transform: "scale(1.1)",
                                                                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                                                                border: "2px solid #bdbdbd",
                                                            },
                                                            position: "relative",
                                                            overflow: "hidden",
                                                        }}
                                                        title={`${color.name} - ${relatedProduct.name}`}
                                                    />
                                                );
                                            }).filter(Boolean) // Filtrar los null
                                        )
                                    ) : (
                                        // Mostrar todos los colores del producto actual
                                        product.colors?.map((color: any) => {
                                            const hasSecondColor = color.hex_code_1 && color.hex_code_1 !== null;
                                            const isSelected = selectedColor === color.id;
                                            return (
                                                <Box
                                                    key={color.id}
                                                    onClick={() => setSelectedColor(color.id)}
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: "50%",
                                                        cursor: "pointer",
                                                        border: isSelected ? "3px solid #1976d2" : "2px solid #e0e0e0",
                                                        background: hasSecondColor
                                                            ? `linear-gradient(130deg, ${color.hex_code} 50%, ${color.hex_code_1} 50%)`
                                                            : color.hex_code,
                                                        boxShadow: isSelected
                                                            ? "0 0 0 3px rgba(25, 118, 210, 0.15), 0 4px 12px rgba(0,0,0,0.15)"
                                                            : "0 2px 8px rgba(0,0,0,0.1)",
                                                        transition: "all 0.3s ease-in-out",
                                                        "&:hover": {
                                                            transform: "scale(1.1)",
                                                            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                                                            border: isSelected ? "3px solid #1976d2" : "2px solid #bdbdbd",
                                                        },
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {/* Indicador de selección interno */}
                                                    {isSelected && (
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: "50%",
                                                                left: "50%",
                                                                transform: "translate(-50%, -50%)",
                                                                width: 14,
                                                                height: 14,
                                                                borderRadius: "50%",
                                                                backgroundColor: "white",
                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            );
                                        })
                                    )}
                                </Box>
                                {relatedProducts.every(p => !p.colors || p.colors.length === 0) && product.colors && product.colors.length <= 1 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        No hay otros colores disponibles en esta categoría.
                                    </Typography>
                                )}
                            </Box>
                        )}

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
                            <Typography variant="body2">Garantía en todos nuestros productos</Typography>
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

            {/* Related products carousel */}
            <RelatedProductsCarousel
                products={relatedProductsForCarousel.map((relatedProduct) => ({
                    ...relatedProduct,
                    // Asegurar que los colores se pasen correctamente
                    colors: relatedProduct.colors?.map((color: any) => {
                        if (color.hex_code_1 && color.hex_code_1 !== null) {
                            return [color.hex_code, color.hex_code_1];
                        }
                        return [color.hex_code];
                    }).flat() || [],
                }))}
                title="Productos Relacionados"
            />

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

            {/* Image Detail Modal */}
            <Dialog
                fullScreen
                open={isImageModalOpen}
                onClose={handleCloseImageModal}
                PaperProps={{
                    sx: {
                        backgroundColor: "black",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleCloseImageModal}
                    sx={{
                        position: "absolute",
                        right: 20,
                        top: 20,
                        color: "white",
                        zIndex: 1100,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                        }
                    }}
                >
                    <Close fontSize="large" />
                </IconButton>

                <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", maxWidth: "1200px" }}>
                        <ProductCarousel
                            images={product.images.map((img) => img.url || "")}
                            initialIndex={modalActiveStep}
                            isModal={true}
                        />
                    </Box>
                </Box>
            </Dialog>
        </Container>
    )
}

export default ProductDetail
