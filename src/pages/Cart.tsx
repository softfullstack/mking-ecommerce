import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    IconButton,
    TextField,
    InputAdornment,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Paper,
} from "@mui/material"
import { Add, Remove, Delete, ArrowBack, LocalShipping, CheckCircle } from "@mui/icons-material"
import useCartStore from "../store/CartStore"
import useAuthStore from "../store/AuthStore"

const Cart = () => {
    const navigate = useNavigate()
    const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const [couponCode, setCouponCode] = useState("")
    const [couponError, setCouponError] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [activeStep, setActiveStep] = useState(0)

    const steps = ["Carrito", "Envío", "Pago", "Confirmación"]

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            updateQuantity(index, newQuantity)
        }
    }

    const handleRemoveItem = (index) => {
        removeFromCart(index)
    }

    const handleCouponApply = () => {
        // In a real app, this would validate against an API
        if (couponCode.toUpperCase() === "DESCUENTO20") {
            setCouponDiscount(20)
            setCouponError("")
        } else {
            setCouponDiscount(0)
            setCouponError("Cupón inválido o expirado")
        }
    }

    const handleNext = () => {
        if (activeStep === 0 && !isAuthenticated) {
            navigate("/login", { state: { from: "/carrito" } })
            return
        }

        setActiveStep((prevStep) => prevStep + 1)

        // If we reach the confirmation step, clear the cart
        if (activeStep === 2) {
            // In a real app, this would process payment and create an order
            setTimeout(() => {
                clearCart()
            }, 1000)
        }
    }

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1)
    }

    const getColorName = (colorId) => {
        const colorMap = {
            negro: "Negro",
            rojo: "Rojo",
            amarillo: "Amarillo",
            naranja: "Naranja",
            azul: "Azul",
            verde: "Verde",
        }
        return colorMap[colorId] || colorId
    }

    const getSizeName = (sizeId) => {
        const sizeMap = {
            xs: "XS",
            s: "S",
            m: "M",
            l: "L",
            xl: "XL",
            xxl: "XXL",
        }
        return sizeMap[sizeId] || sizeId
    }

    const calculateSubtotal = () => {
        return totalPrice
    }

    const calculateDiscount = () => {
        return (calculateSubtotal() * couponDiscount) / 100
    }

    const calculateShipping = () => {
        return calculateSubtotal() > 100 ? 0 : 10
    }

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount() + calculateShipping()
    }

    // Cart content
    const renderCartContent = () => (
        <>
            {items.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Tu carrito está vacío
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Parece que aún no has añadido ningún producto a tu carrito.
                    </Typography>
                    <Button component={RouterLink} to="/productos" variant="contained" color="primary" size="large">
                        Explorar Productos
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {/* Cart items */}
                    <Grid item xs={12} lg={8}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                            Carrito de Compras ({totalItems} {totalItems === 1 ? "producto" : "productos"})
                        </Typography>

                        {items.map((item, index) => (
                            <Card key={index} sx={{ mb: 2, backgroundColor: "#1e1e1e" }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={3} sm={2}>
                                            <Box
                                                component="img"
                                                src={item.images[0]}
                                                alt={item.name}
                                                sx={{
                                                    width: "100%",
                                                    aspectRatio: "1/1",
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={9} sm={4}>
                                            <Typography
                                                variant="subtitle1"
                                                component={RouterLink}
                                                to={`/producto/${item.id}`}
                                                sx={{
                                                    fontWeight: "bold",
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    "&:hover": {
                                                        color: "primary.main",
                                                    },
                                                }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Color: {getColorName(item.color)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Talla: {getSizeName(item.size)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <TextField
                                                    value={item.quantity}
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        inputProps: {
                                                            style: { textAlign: "center" },
                                                        },
                                                    }}
                                                    sx={{ width: "50px", mx: 1 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                                    disabled={item.quantity >= 10}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4} sm={2} sx={{ textAlign: "right" }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2} sm={1} sx={{ textAlign: "right" }}>
                                            <IconButton color="error" size="small" onClick={() => handleRemoveItem(index)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                            <Button component={RouterLink} to="/productos" startIcon={<ArrowBack />}>
                                Continuar Comprando
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => clearCart()}>
                                Vaciar Carrito
                            </Button>
                        </Box>
                    </Grid>

                    {/* Order summary */}
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                            Resumen del Pedido
                        </Typography>
                        <Card sx={{ backgroundColor: "#1e1e1e" }}>
                            <CardContent>
                                <Box sx={{ mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Código de Cupón"
                                        variant="outlined"
                                        size="small"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        error={!!couponError}
                                        helperText={couponError}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button variant="text" onClick={handleCouponApply} disabled={!couponCode}>
                                                        Aplicar
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                {couponDiscount > 0 && (
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        Cupón aplicado: {couponDiscount}% de descuento
                                    </Alert>
                                )}

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography variant="body1">Subtotal</Typography>
                                    <Typography variant="body1">${calculateSubtotal().toFixed(2)}</Typography>
                                </Box>

                                {couponDiscount > 0 && (
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <Typography variant="body1">Descuento</Typography>
                                        <Typography variant="body1" color="error">
                                            -${calculateDiscount().toFixed(2)}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography variant="body1">Envío</Typography>
                                    <Typography variant="body1">
                                        {calculateShipping() === 0 ? "Gratis" : `$${calculateShipping().toFixed(2)}`}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        Total
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                        ${calculateTotal().toFixed(2)}
                                    </Typography>
                                </Box>

                                <Button variant="contained" color="primary" size="large" fullWidth onClick={handleNext}>
                                    Proceder al Pago
                                </Button>

                                <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <LocalShipping fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2" align="center">
                                        Envío gratuito en pedidos superiores a $100
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </>
    )

    // Shipping step content
    const renderShippingContent = () => (
        <Paper sx={{ p: 3, backgroundColor: "#1e1e1e" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Información de Envío
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Nombre" variant="outlined" defaultValue="John" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Apellido" variant="outlined" defaultValue="Doe" />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Dirección" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Ciudad" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Código Postal" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Teléfono" variant="outlined" />
                </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={handleBack}>Volver</Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    Continuar
                </Button>
            </Box>
        </Paper>
    )

    // Payment step content
    const renderPaymentContent = () => (
        <Paper sx={{ p: 3, backgroundColor: "#1e1e1e" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Información de Pago
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField fullWidth label="Número de Tarjeta" variant="outlined" placeholder="1234 5678 9012 3456" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Fecha de Expiración" variant="outlined" placeholder="MM/AA" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="CVV" variant="outlined" placeholder="123" />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Nombre en la Tarjeta" variant="outlined" />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Resumen del Pedido
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">${calculateSubtotal().toFixed(2)}</Typography>
                </Box>

                {couponDiscount > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">Descuento</Typography>
                        <Typography variant="body2" color="error">
                            -${calculateDiscount().toFixed(2)}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Envío</Typography>
                    <Typography variant="body2">
                        {calculateShipping() === 0 ? "Gratis" : `$${calculateShipping().toFixed(2)}`}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Total
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: "bold" }}>
                        ${calculateTotal().toFixed(2)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={handleBack}>Volver</Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    Confirmar Pedido
                </Button>
            </Box>
        </Paper>
    )

    // Confirmation step content
    const renderConfirmationContent = () => (
        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#1e1e1e" }}>
            <CheckCircle color="primary" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                ¡Pedido Completado!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Tu pedido ha sido procesado correctamente. Hemos enviado un correo electrónico con los detalles de tu compra.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Número de pedido: #ORD-{Math.floor(100000 + Math.random() * 900000)}
            </Typography>
            <Button component={RouterLink} to="/" variant="contained" color="primary" size="large">
                Volver a la Tienda
            </Button>
        </Paper>
    )

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && renderCartContent()}
            {activeStep === 1 && renderShippingContent()}
            {activeStep === 2 && renderPaymentContent()}
            {activeStep === 3 && renderConfirmationContent()}
        </Container>
    )
}

export default Cart
