import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Paper, Slider, TextField, Button, Card, CardContent, Divider, Stack, IconButton, useTheme, alpha } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

gsap.registerPlugin(ScrollTrigger);

// Pricing structures
const BASE_PRICE = 460.00; // 180 MXN base price per vest

const TIERS = [
    { min: 1, max: 9, discount: 0, label: "Menudeo", benefits: ["Garantía de fabricación MKing", "Envíos a todo el país"] },
    { min: 10, max: 49, discount: 3, label: "Bronce B2B", benefits: ["3% de Descuento directo", "Logotipo frontal incluido (1 bordado)", "Garantía de fabricación MKing", "Envío express disponible"] },
    { min: 50, max: 99, discount: 5, label: "Plata B2B", benefits: ["5% de Descuento directo", "Logotipo frontal y trasero incluidos (2 bordados)", "Prueba de color digital previa", "Garantía MKing extendida", "Envío express disponible"] },
    { min: 100, max: 499, discount: 10, label: "Oro B2B", benefits: ["10% de Descuento directo", "Logotipo frontal + trasero incluidos (2 bordados)", "Envío gratuito a todo México", "Muestra física previa (costo reembolsable)", "Prioridad en línea de producción"] },
    { min: 500, max: 10000, discount: 15, label: "Platino B2B", benefits: ["15% de Descuento directo", "Logotipos ilimitados (Bordado/Serigrafía)", "Envío gratuito a todo México", "Muestra física gratuita en tus oficinas antes de fabricar", "Ejecutivo de cuenta B2B dedicado", "Customización total de bolsillos y colores de bies"] }
];

// Vest features for hotspot explorer
const VEST_FEATURES = [
    {
        id: "logo-front",
        title: "Bordado de Logo Frontal",
        description: "Espacio reservado en el pecho derecho para el logotipo de tu empresa. Utilizamos bordados con hilos de alta resistencia a la abrasión y ciclos de lavado industrial para asegurar una presencia de marca duradera.",
        cx: "63%",
        cy: "25%",
        icon: "BusinessIcon"
    },
    {
        id: "reflective",
        title: "Cintas Reflejantes de 2 Pulgadas",
        description: "Bandas reflejantes con tecnología microprismática de alta visibilidad que cumplen con normativas de seguridad laboral. Aseguran visibilidad nocturna y en condiciones de lluvia o polvo en el campo laboral.",
        cx: "50%",
        cy: "42%",
        icon: "DoneAllIcon"
    },
    {
        id: "pocket-phone",
        title: "Porta-Radio y Celular Premium",
        description: "Bolsillo izquierdo adaptado y reforzado con velcro para asegurar teléfonos móviles modernos, radios de comunicación y espacio para plumas. Diseñado para evitar que se caigan los dispositivos al inclinarse.",
        cx: "37%",
        cy: "28%",
        icon: "InfoIcon"
    },
    {
        id: "zipper",
        title: "Cierre Frontal Reforzado",
        description: "Cierre de cremallera de uso pesado y dientes de nylon que facilitan abrocharse y desabrocharse rápidamente. Resistente a atascos de suciedad o hilos sueltos comunes en zonas de construcción.",
        cx: "50%",
        cy: "55%",
        icon: "InfoIcon"
    },
    {
        id: "pocket-utility",
        title: "Bolsillos Portaherramientas Dobles",
        description: "Dos bolsillos de carga de gran amplitud en la sección inferior con costuras dobles de refuerzo. Ideales para portar flexómetros, libretas de notas, llaves o herramientas manuales ligeras.",
        cx: "32%",
        cy: "75%",
        icon: "InfoIcon"
    }
];

const DescuentosEmpresas = () => {
    const theme = useTheme();

    // Calculator States
    const [quantity, setQuantity] = useState(100);
    const [selectedTier, setSelectedTier] = useState(TIERS[3]);
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [savings, setSavings] = useState(0);

    // Hotspot States
    const [activeFeature, setActiveFeature] = useState(VEST_FEATURES[1]);

    // Form States
    const [formData, setFormData] = useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        qtyNeeded: "100",
        message: "",
        logoFile: null as File | null
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Refs for animations
    const headerRef = useRef<HTMLDivElement>(null);
    const calcRef = useRef<HTMLDivElement>(null);
    const explorerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    // Dynamic math calculations
    useEffect(() => {
        const tier = TIERS.find(t => quantity >= t.min && quantity <= t.max) || TIERS[0];
        setSelectedTier(tier);

        const unitPrice = BASE_PRICE * (1 - tier.discount / 100);
        const rawSubtotal = BASE_PRICE * quantity;
        const finalTotal = unitPrice * quantity;

        setPricePerUnit(unitPrice);
        setSubtotal(rawSubtotal);
        setTotal(finalTotal);
        setSavings(rawSubtotal - finalTotal);
    }, [quantity]);

    // Animations with GSAP
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.fromTo(
                    headerRef.current.children,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
                );
            }

            if (calcRef.current) {
                gsap.fromTo(
                    calcRef.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: calcRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }

            if (explorerRef.current) {
                gsap.fromTo(
                    explorerRef.current,
                    { opacity: 0, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: explorerRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }

            if (formRef.current) {
                gsap.fromTo(
                    formRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: formRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    const handleFormChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, logoFile: e.target.files[0] });
        }
    };

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        // Here we simulate form submission
        setFormSubmitted(true);
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            <Helmet>
                <title>Descuentos para Empresas y Chalecos al Mayoreo | MKing</title>
                <meta name="description" content="Calcula descuentos corporativos en chalecos de seguridad industrial. Precios de fábrica al mayoreo para empresas con logotipo incluido." />
            </Helmet>

            {/* Hero Header */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    color: 'white',
                    py: { xs: 8, md: 10 },
                    textAlign: 'center',
                    borderBottom: `5px solid ${theme.palette.primary.main}`,
                    mb: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                        pointerEvents: 'none'
                    }
                }}
            >
                <Container maxWidth="md" ref={headerRef}>
                    <Typography
                        variant="h2"
                        fontWeight="900"
                        sx={{
                            textTransform: 'uppercase',
                            mb: 2,
                            fontSize: { xs: '2rem', sm: '3rem', md: '3.8rem' },
                            letterSpacing: '1px'
                        }}
                    >
                        Descuentos para Empresas
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', px: 2 }}>
                        Equipa a tu personal de campo y oficinas con chalecos industriales de alta durabilidad y visibilidad certificada. Obtén precios de fábrica preferenciales y personalización corporativa gratis.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* 1. CALCULATOR SECTION */}
                <Box ref={calcRef} sx={{ mb: 10 }}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 1 }}>
                        Calculadora Interactiva de Volumen
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6 }}>
                        Ajusta la cantidad de piezas y observa cómo incrementa tu nivel de descuento corporativo y ahorro.
                    </Typography>

                    <Paper
                        elevation={6}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 5,
                            bgcolor: 'background.paper',
                            border: '1px solid rgba(255,255,255,0.06)'
                        }}
                    >
                        <Grid container spacing={5} alignItems="center">
                            {/* Left: Slider Controls */}
                            <Grid item xs={12} md={7}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Cantidad Solicitada</span>
                                        <span style={{ color: theme.palette.primary.main }}>{quantity} chalecos</span>
                                    </Typography>
                                    <Slider
                                        value={quantity}
                                        onChange={(_, val) => setQuantity(val as number)}
                                        min={10}
                                        max={1000}
                                        step={10}
                                        valueLabelDisplay="auto"
                                        color="primary"
                                        sx={{
                                            height: 8,
                                            '& .MuiSlider-thumb': {
                                                width: 24,
                                                height: 24,
                                                border: '3px solid currentColor'
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">10 pzs (Mínimo)</Typography>
                                        <Typography variant="caption" color="text.secondary">500 pzs (Descuento Max.)</Typography>
                                        <Typography variant="caption" color="text.secondary">1,000+ pzs</Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DoneAllIcon color="primary" />
                                        Beneficios Activos en Nivel:
                                        <span style={{ color: theme.palette.primary.main, fontWeight: '900' }}>
                                            {selectedTier.label} ({selectedTier.discount}% desc.)
                                        </span>
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {selectedTier.benefits.map((benefit, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    bgcolor: 'rgba(255,255,255,0.03)',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    borderLeft: `4px solid ${theme.palette.primary.main}`
                                                }}
                                            >
                                                <DoneAllIcon color="primary" sx={{ fontSize: 18 }} />
                                                <Typography variant="body2" fontWeight="medium">{benefit}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* Right: Dynamic Pricing Result Card */}
                            <Grid item xs={12} md={5}>
                                <Card
                                    sx={{
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                        borderRadius: 4,
                                        border: `1.5px solid ${theme.palette.primary.main}`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 15,
                                                right: -30,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                px: 4,
                                                py: 0.5,
                                                transform: 'rotate(45deg)',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Mayoreo
                                        </Box>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Cotización Estimada
                                        </Typography>

                                        <Box sx={{ my: 3 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">Precio Unitario Base: ${BASE_PRICE.toFixed(2)} MXN</Typography>
                                            <Typography variant="h3" fontWeight="900" color="primary.main" sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                ${pricePerUnit.toFixed(2)}
                                                <Typography variant="body2" color="text.secondary" component="span">MXN / pz</Typography>
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                        <Stack spacing={1} sx={{ my: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">Subtotal Normal:</Typography>
                                                <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>${subtotal.toFixed(2)}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">Porcentaje de Descuento:</Typography>
                                                <Typography variant="body2" fontWeight="bold" color="primary.main">-{selectedTier.discount}%</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">Ahorro Corporativo:</Typography>
                                                <Typography variant="body2" fontWeight="bold" color="primary.main">-${savings.toFixed(2)} MXN</Typography>
                                            </Box>
                                        </Stack>

                                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 3, mb: 1 }}>
                                            <Typography variant="h6" fontWeight="bold">Total Estimado:</Typography>
                                            <Typography variant="h4" fontWeight="bold" color="white">${total.toFixed(2)} MXN</Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            onClick={() => {
                                                setFormData({ ...formData, qtyNeeded: String(quantity) });
                                                document.getElementById('form-contacto-empresas')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                                        >
                                            Solicitar esta Oferta
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* 2. INTERACTIVE VEST EXPLORER */}
                <Box ref={explorerRef} sx={{ mb: 10 }}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 1 }}>
                        Explorador Interactivo del Chaleco MKing
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6 }}>
                        Haz clic en los puntos interactivos del chaleco para conocer los materiales de alta durabilidad y detalles técnicos.
                    </Typography>

                    <Paper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 5,
                            bgcolor: 'background.paper',
                            border: '1px solid rgba(255,255,255,0.06)'
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            {/* Left: Vest Interactive SVG Graphic */}
                            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, height: 480 }}>
                                    {/* Safety Vest Interactive SVG Drawing */}
                                    <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                        {/* Background Shadow */}
                                        <ellipse cx="200" cy="460" rx="140" ry="12" fill="rgba(0,0,0,0.4)" />

                                        {/* Hanger */}
                                        <path d="M170 80 C180 50, 220 50, 230 80" fill="none" stroke="#555" strokeWidth="6" strokeLinecap="round" />

                                        {/* VEST BODY SHAPE */}
                                        <path
                                            d="M 120,95 C 160,90 240,90 280,95 L 320,130 L 305,185 L 290,185 L 295,440 L 105,440 L 110,185 L 95,185 L 120,95 Z"
                                            fill="#ff9800" /* Neon safety orange */
                                            stroke="#e65100"
                                            strokeWidth="4"
                                        />

                                        {/* Neck Cutout */}
                                        <path d="M 155,93 C 180,120 220,120 245,93 L 230,93 C 215,108 185,108 170,93 Z" fill="#242424" />

                                        {/* Reflector Stripes (Silver/White lines on safety vest) */}
                                        {/* Vertical Left shoulder */}
                                        <path d="M 148,93 L 148,185" stroke="#e0e0e0" strokeWidth="18" fill="none" opacity="0.9" />
                                        <path d="M 148,93 L 148,185" stroke="#ffeb3b" strokeWidth="22" fill="none" opacity="0.4" />
                                        {/* Vertical Right shoulder */}
                                        <path d="M 252,93 L 252,185" stroke="#e0e0e0" strokeWidth="18" fill="none" opacity="0.9" />
                                        <path d="M 252,93 L 252,185" stroke="#ffeb3b" strokeWidth="22" fill="none" opacity="0.4" />

                                        {/* Horizontal Top stripe */}
                                        <path d="M 107,240 L 293,240" stroke="#e0e0e0" strokeWidth="18" fill="none" opacity="0.9" />
                                        <path d="M 107,240 L 293,240" stroke="#ffeb3b" strokeWidth="22" fill="none" opacity="0.4" />

                                        {/* Horizontal Bottom stripe */}
                                        <path d="M 106,370 L 294,370" stroke="#e0e0e0" strokeWidth="18" fill="none" opacity="0.9" />
                                        <path d="M 106,370 L 294,370" stroke="#ffeb3b" strokeWidth="22" fill="none" opacity="0.4" />

                                        {/* Left Pocket (Radio Phone holder) */}
                                        <rect x="125" y="135" width="40" height="45" rx="3" fill="#ff7043" stroke="#d84315" strokeWidth="2.5" />
                                        {/* Pocket Flap */}
                                        <path d="M 122,135 L 168,135 L 168,128 L 122,128 Z" fill="#d84315" />
                                        {/* Pen pocket detail */}
                                        <line x1="135" y1="135" x2="135" y2="180" stroke="#d84315" strokeWidth="2" />

                                        {/* Right Logo area decoration placeholder */}
                                        <circle cx="252" cy="148" r="8" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />

                                        {/* Heavy duty zipper line in the middle */}
                                        <line x1="200" y1="92" x2="200" y2="440" stroke="#37474f" strokeWidth="5" />
                                        {/* Zipper details */}
                                        <rect x="197" y="110" width="6" height="15" rx="1.5" fill="#cfd8dc" />

                                        {/* Lower Right tool pocket */}
                                        <rect x="220" y="275" width="60" height="70" rx="4" fill="#ff7043" stroke="#d84315" strokeWidth="2.5" />
                                        <path d="M 217,275 L 283,275 L 283,268 L 217,268 Z" fill="#d84315" />

                                        {/* Lower Left tool pocket */}
                                        <rect x="120" y="275" width="60" height="70" rx="4" fill="#ff7043" stroke="#d84315" strokeWidth="2.5" />
                                        <path d="M 117,275 L 183,275 L 183,268 L 117,268 Z" fill="#d84315" />
                                    </svg>

                                    {/* INTERACTIVE GLOWING HOTSPOT CIRCLES (OVERLAY) */}
                                    {VEST_FEATURES.map((feature) => {
                                        const isActive = activeFeature.id === feature.id;
                                        return (
                                            <IconButton
                                                key={feature.id}
                                                onClick={() => setActiveFeature(feature)}
                                                sx={{
                                                    position: 'absolute',
                                                    left: feature.cx,
                                                    top: feature.cy,
                                                    transform: 'translate(-50%, -50%)',
                                                    width: isActive ? 28 : 20,
                                                    height: isActive ? 28 : 20,
                                                    bgcolor: isActive ? theme.palette.primary.main : '#fff',
                                                    color: isActive ? '#fff' : theme.palette.primary.main,
                                                    border: `2px solid ${isActive ? '#fff' : theme.palette.primary.main}`,
                                                    boxShadow: `0 0 12px ${alpha(isActive ? theme.palette.primary.main : '#fff', 0.8)}`,
                                                    animation: isActive ? 'none' : 'pulse 2.2s infinite',
                                                    '&:hover': {
                                                        bgcolor: theme.palette.primary.main,
                                                        color: '#fff',
                                                        border: '2px solid #fff'
                                                    },
                                                    transition: 'all 0.3s ease-in-out',
                                                    zIndex: 10,
                                                    p: 0
                                                }}
                                            >
                                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}></span>
                                            </IconButton>
                                        );
                                    })}

                                    {/* CSS keyframe animations for hotspots */}
                                    <style>{`
                                        @keyframes pulse {
                                            0% {
                                                box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
                                            }
                                            70% {
                                                box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
                                            }
                                            100% {
                                                box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
                                            }
                                        }
                                    `}</style>
                                </Box>
                            </Grid>

                            {/* Right: Selected Feature Detailed Panel */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        bgcolor: 'rgba(0,0,0,0.15)',
                                        border: '1.5px solid rgba(255,255,255,0.06)',
                                        minHeight: 280,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        transition: 'all 0.4s ease-in-out'
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="primary.main" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Característica Destacada
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5, mb: 2 }}>
                                            {activeFeature.title}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                        {activeFeature.description}
                                    </Typography>

                                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />

                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 16 }} />
                                        Haz clic en otros puntos rojos parpadeantes del chaleco para explorar más detalles técnicos.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* 3. CORPORATE B2B LEADS FORM */}
                <Box ref={formRef} id="form-contacto-empresas">
                    <Paper
                        elevation={6}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 5,
                            bgcolor: 'background.paper',
                            border: '1px solid rgba(255,255,255,0.06)',
                            position: 'relative'
                        }}
                    >
                        {formSubmitted ? (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <DoneAllIcon color="primary" sx={{ fontSize: 75, mb: 3 }} />
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    ¡Solicitud Recibida Exitosamente!
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                                    Gracias por contactar al departamento B2B de MKing. Un ejecutivo de cuenta especializado se pondrá en contacto contigo en un plazo menor a 4 horas hábiles para enviarte tu propuesta formal.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setFormSubmitted(false)}
                                >
                                    Enviar otra Solicitud
                                </Button>
                            </Box>
                        ) : (
                            <form onSubmit={handleFormSubmit}>
                                <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                                    Solicita una Cotización Especializada
                                </Typography>
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
                                    Completa el siguiente formulario corporativo. Analizaremos tu requerimiento y te enviaremos una propuesta formal en PDF con descuentos de volumen.
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Nombre de la Empresa"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleFormChange}
                                            InputProps={{
                                                startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Nombre del Contacto"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleFormChange}
                                            InputProps={{
                                                startAdornment: <AccountCircleIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Correo Electrónico Corporativo"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            InputProps={{
                                                startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Teléfono de Contacto"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            InputProps={{
                                                startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="number"
                                            label="Cantidad Estimada de Chalecos"
                                            name="qtyNeeded"
                                            value={formData.qtyNeeded}
                                            onChange={handleFormChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                border: '1.5px dashed rgba(255,255,255,0.12)',
                                                borderRadius: 2,
                                                p: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',
                                                bgcolor: 'rgba(255,255,255,0.01)'
                                            }}
                                        >
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="upload-logo-button"
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="upload-logo-button" style={{ cursor: 'pointer', width: '100%' }}>
                                                <Button
                                                    component="span"
                                                    variant="text"
                                                    fullWidth
                                                    startIcon={<UploadFileIcon color="primary" />}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {formData.logoFile ? formData.logoFile.name : "Subir Logotipo de la Empresa (.PNG/.JPG)"}
                                                </Button>
                                            </label>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Cuéntanos más sobre tus necesidades (Colores, especificaciones especiales, tipo de bies, etc.)"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleFormChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        sx={{
                                            px: 6,
                                            py: 1.8,
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            borderRadius: 3
                                        }}
                                    >
                                        Enviar Solicitud de Cotización
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default DescuentosEmpresas;
