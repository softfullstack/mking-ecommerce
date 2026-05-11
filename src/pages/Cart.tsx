import { useState, useEffect } from "react"
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
    Chip,
    Stack
} from "@mui/material"
import { Add, Remove, Delete, ArrowBack, LocalShipping, CheckCircle, Edit as EditIcon } from "@mui/icons-material"
import useCartStore from "../store/CartStore"
import useAuthStore from "../store/AuthStore"
import { getPreferredIdentifier } from "../utils/uuidUtils"
import ProductCustomizer from "../components/ProductCustomizer"
import { ItemCustomization } from "../interfaces/CustomizationInterface"
import { GetAddressesService, CreateAddressService, ProcessPaymentService, CheckoutService } from "../services/MKing.service"
import AddressDialog from "../components/AddressDialog"
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'
import { toast } from "react-toastify"

initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '')

const Cart = () => {
    const navigate = useNavigate()
    const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, updateCustomizations } = useCartStore()
    const { isAuthenticated, user } = useAuthStore()
    const [couponCode, setCouponCode] = useState("")
    const [couponError, setCouponError] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [activeStep, setActiveStep] = useState(0)
    const [customizerOpen, setCustomizerOpen] = useState(false)
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)

    // Address State
    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
    const [loadingAddresses, setLoadingAddresses] = useState(false)
    const [openAddressDialog, setOpenAddressDialog] = useState(false)
    const [paymentProcessing, setPaymentProcessing] = useState(false)

    useEffect(() => {
        if (activeStep === 1 && isAuthenticated) {
            fetchAddresses()
        }
    }, [activeStep, isAuthenticated])

    const fetchAddresses = async () => {
        setLoadingAddresses(true)
        try {
            const response = await GetAddressesService()
            setAddresses(response.data)
        } catch (error) {
            console.error("Error fetching addresses", error)
            toast.error("Error al cargar direcciones")
        } finally {
            setLoadingAddresses(false)
        }
    }

    const handleSaveAddress = async (data: any) => {
        try {
            await CreateAddressService(data)
            toast.success("Dirección agregada correctamente")
            setOpenAddressDialog(false)
            fetchAddresses()
        } catch (error) {
            console.error("Error creating address", error)
            toast.error("Error al guardar la dirección")
        }
    }

    const steps = ["Carrito", "Envío", "Pago", "Confirmación"]

    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            updateQuantity(index, newQuantity)
        }
    }

    const handleRemoveItem = (index: number) => {
        removeFromCart(index)
    }

    const handleCustomizeItem = (index: number) => {
        setSelectedItemIndex(index)
        setCustomizerOpen(true)
    }

    const handleSaveCustomization = (customizations: ItemCustomization[]) => {
        if (selectedItemIndex !== null) {
            updateCustomizations(selectedItemIndex, customizations)
        }
        setCustomizerOpen(false)
        setSelectedItemIndex(null)
    }

    const handleCancelCustomization = () => {
        setCustomizerOpen(false)
        setSelectedItemIndex(null)
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

    const handleNext = async () => {
        if (activeStep === 0 && !isAuthenticated) {
            navigate("/login", { state: { from: "/carrito" } })
            return
        }

        if (activeStep === 1 && selectedAddressId === null) {
            toast.error("Por favor selecciona una dirección de envío")
            return
        }

        setActiveStep((prevStep) => prevStep + 1)
    }

    const handlePaymentSubmit = async (formData: any) => {
        // CardPayment Brick REQUIERE que onSubmit retorne una Promise
        // con resolve() / reject() para manejar el estado de carga del Brick.
        return new Promise<void>(async (resolve, reject) => {
            setPaymentProcessing(true)
            try {
                // Generar referencia única para este intento de pago
                const paymentReference = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`

                console.log('MP formData recibido:', JSON.stringify(formData, null, 2))

                // IMPORTANTE: El Brick envía campos en camelCase, pero el backend
                // y la API de MP esperan snake_case. Mapeamos correctamente:
                // Construir identification solo si tiene datos válidos
                const rawIdentification = formData.payer?.identification || {
                    type: formData.identificationType,
                    number: formData.identificationNumber,
                }
                const identification = (rawIdentification?.type && rawIdentification?.number)
                    ? rawIdentification
                    : undefined

                // Obtener dirección de envío seleccionada
                const selectedAddress = addresses.find((a: any) => a.id === selectedAddressId)

                // Construir items para additional_info (requerido por MP para mejor aprobación)
                const mpItems = items.map((item) => ({
                    id: String(item.uuid || item.id),
                    title: item.name,
                    description: item.description?.substring(0, 256) || item.name,
                    category_id: item.categories?.[0] || 'others',
                    quantity: item.quantity,
                    unit_price: item.price,
                }))

                const response = await ProcessPaymentService({
                    token: formData.token,
                    issuer_id: formData.issuer_id || formData.issuerId,
                    payment_method_id: formData.payment_method_id || formData.paymentMethodId,
                    transaction_amount: calculateTotal(),
                    installments: Number(formData.installments) || 1,
                    description: `Pedido Maquila King - ${totalItems} artículo(s)`,
                    payer: {
                        email: formData.payer?.email || formData.cardholderEmail,
                        ...(identification && { identification }),
                        first_name: user?.name || undefined,
                        last_name: user?.last_name || undefined,
                    },
                    external_reference: paymentReference,
                    // additional_info para mejorar aprobación y calidad MP
                    additional_info: {
                        items: mpItems,
                        payer: {
                            first_name: user?.name || undefined,
                            last_name: user?.last_name || undefined,
                        },
                        ...(selectedAddress && {
                            shipments: {
                                receiver_address: {
                                    zip_code: selectedAddress.postal_code || '',
                                    state_name: selectedAddress.state || '',
                                    city_name: selectedAddress.municipality || '',
                                    street_name: selectedAddress.street || '',
                                    street_number: Number(selectedAddress.exterior_number) || 0,
                                },
                            },
                        }),
                    },
                })

                const { status, message, statusDetail } = response.data

                if (status === 'approved' || status === 'pending') {
                    try {
                        // Solo creamos el pedido si el pago fue aprobado o está pendiente
                        await CheckoutService({ external_reference: paymentReference })

                        if (status === 'approved') {
                            toast.success('¡Pago aprobado! Tu pedido ha sido registrado.')
                        } else {
                            toast.info('Tu pago está en proceso. Te notificaremos por correo.')
                        }
                        setActiveStep(3)
                        setTimeout(() => clearCart(), 1000)
                    } catch (checkoutError) {
                        console.error('Error creating order after payment:', checkoutError)
                        toast.warning('Pago procesado, pero hubo un error al registrar el pedido. Contacta a soporte.')
                        setActiveStep(3)
                    }
                    resolve() // Indicar al Brick que el proceso terminó exitosamente
                } else {
                    toast.error(`Pago rechazado: ${statusDetail || message}. Intenta con otra tarjeta.`)
                    resolve() // Resolve también en rechazo para que el Brick libere su UI
                }
            } catch (error: any) {
                console.error('Error processing payment or checkout:', error)
                console.error('Response data:', JSON.stringify(error?.response?.data, null, 2))
                const backendError = error?.response?.data
                const msg = backendError?.cause?.message 
                    || backendError?.cause?.description
                    || backendError?.message 
                    || 'Error al procesar el pago o registrar el pedido'
                toast.error(msg)
                reject() // Indicar al Brick que hubo un error de comunicación
            } finally {
                setPaymentProcessing(false)
            }
        })
    }

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1)
    }

    const getColorName = (colorId: string) => {
        const colorMap: { [key: string]: string } = {
            negro: "Negro",
            rojo: "Rojo",
            amarillo: "Amarillo",
            naranja: "Naranja",
            azul: "Azul",
            verde: "Verde",
        }
        return colorMap[colorId] || colorId
    }

    const getSizeName = (sizeId: string) => {
        const sizeMap: { [key: string]: string } = {
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
                        Tu bolsa está vacia
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Parece que aún no has añadido ningún producto a tu bolsa.
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
                            Bolsa de Compras ({totalItems} {totalItems === 1 ? "producto" : "productos"})
                        </Typography>

                        {items.map((item, index) => (
                            <Card key={index} sx={{ mb: { xs: 1.5, md: 2 }, backgroundColor: "#1e1e1e" }}>
                                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                                    <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
                                        <Grid item xs={3} sm={2}>
                                            <Box
                                                component="img"
                                                src={
                                                    Array.isArray(item.images) && item.images.length > 0
                                                        ? (item.images.find((img: any) => img.is_primary)?.url ||
                                                            item.images[0].url ||
                                                            item.images[0].image_path)
                                                        : undefined
                                                }
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
                                                to={`/producto/${getPreferredIdentifier({ uuid: item.uuid, id: item.id })}`}
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
                                                Color: {typeof item.color === 'object' && item.color !== null ? (item.color as any).name : getColorName(item.color || '')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Talla: {typeof item.size === 'object' && item.size !== null ? (item.size as any).name : getSizeName(item.size || '')}
                                            </Typography>

                                            {/* Mostrar personalizaciones existentes */}
                                            {item.customizations && item.customizations.length > 0 && (
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                        Personalizado:
                                                    </Typography>
                                                    <Stack direction="column" spacing={0.5}>
                                                        {item.customizations.map((cust, i) => {
                                                            // Only show if it has name or logos
                                                            if (!cust.name && (!cust.logos || cust.logos.length === 0)) return null;

                                                            return (
                                                                <Typography key={i} variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <span style={{ fontWeight: 'bold' }}>#{i + 1}:</span>
                                                                    {cust.name && <span>{cust.name}</span>}
                                                                    {cust.logos && cust.logos.length > 0 && (
                                                                        <Chip
                                                                            label={`${cust.logos.length} logo(s)`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                                        />
                                                                    )}
                                                                </Typography>
                                                            );
                                                        })}
                                                    </Stack>
                                                </Box>
                                            )}
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
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleCustomizeItem(index)}
                                                    title="Personalizar producto"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton color="error" size="small" onClick={() => handleRemoveItem(index)}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                            <Button component={RouterLink} to="/productos" startIcon={<ArrowBack />}>
                                Continuar Comprando
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                    Información de Envío
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenAddressDialog(true)}
                    size="small"
                >
                    Nueva Dirección
                </Button>
            </Box>

            {loadingAddresses ? (
                <Typography>Cargando direcciones...</Typography>
            ) : addresses.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <Typography color="text.secondary" paragraph>
                        No tienes direcciones guardadas.
                    </Typography>
                    <Button variant="contained" onClick={() => setOpenAddressDialog(true)}>
                        Agregar Dirección
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {addresses.map((addr) => (
                        <Grid item xs={12} md={6} key={addr.id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',
                                    borderColor: selectedAddressId === addr.id ? 'primary.main' : 'divider',
                                    borderWidth: selectedAddressId === addr.id ? 2 : 1,
                                    backgroundColor: selectedAddressId === addr.id ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.light'
                                    }
                                }}
                                onClick={() => setSelectedAddressId(addr.id)}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {addr.recipient_name || 'Destinatario'}
                                        </Typography>
                                        {selectedAddressId === addr.id && (
                                            <CheckCircle color="primary" fontSize="small" />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.street} {addr.exterior_number} {addr.interior_number ? `Int. ${addr.interior_number}` : ''}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.neighborhood}, {addr.municipality}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.state}, CP: {addr.postal_code}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                        Tel: {addr.phone}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <AddressDialog
                open={openAddressDialog}
                onClose={() => setOpenAddressDialog(false)}
                onSave={handleSaveAddress}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={handleBack}>Volver</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={selectedAddressId === null}
                >
                    Continuar
                </Button>
            </Box>
        </Paper>
    )

    // Payment step content
    const renderPaymentContent = () => (
        <Paper sx={{ p: 3, backgroundColor: "#1e1e1e" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                Información de Pago
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                💳 Pago 100% seguro procesado por Mercado Pago
            </Typography>

            <Grid container spacing={3}>
                {/* Card Payment Form */}
                <Grid item xs={12} md={7}>
                    <CardPayment
                        initialization={{ amount: calculateTotal() }}
                        onSubmit={handlePaymentSubmit}
                        onError={(error) => {
                            console.error('MP CardPayment error:', error)
                            toast.error('Error en el formulario de pago')
                        }}
                        customization={{
                            paymentMethods: { minInstallments: 1, maxInstallments: 12 }
                        }}
                    />
                    {paymentProcessing && (
                        <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                            Procesando pago...
                        </Typography>
                    )}
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ bgcolor: '#2a2a2a', borderRadius: 2, p: 2.5 }}>
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

                        <Divider sx={{ my: 1.5 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Total</Typography>
                            <Typography variant="body1" color="primary" sx={{ fontWeight: "bold" }}>
                                ${calculateTotal().toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Button onClick={handleBack}>Volver</Button>
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
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
            <Stepper
                activeStep={activeStep}
                sx={{ mb: { xs: 2, md: 4 }, '& .MuiStepIcon-root': { fontSize: { xs: 20, md: 24 } } }}
                alternativeLabel
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-label': {
                                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                                },
                            }}
                        >{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && renderCartContent()}
            {activeStep === 1 && renderShippingContent()}
            {activeStep === 2 && renderPaymentContent()}
            {activeStep === 3 && renderConfirmationContent()}

            {/* Product Customizer Dialog */}
            {selectedItemIndex !== null && items[selectedItemIndex] && (
                <ProductCustomizer
                    product={items[selectedItemIndex]}
                    quantity={items[selectedItemIndex].quantity}
                    isOpen={customizerOpen}
                    onSave={handleSaveCustomization}
                    onCancel={handleCancelCustomization}
                    initialCustomizations={items[selectedItemIndex].customizations || []}
                />
            )}
        </Container>
    )
}

export default Cart
