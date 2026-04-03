import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { Link as RouterLink } from "react-router-dom"
import {
    Factory as FactoryIcon,
    Verified as VerifiedIcon,
    LocalShipping as ShippingIcon,
    Brush as BrushIcon,
    Security as SecurityIcon,
    EmojiObjects as InnovationIcon,
    Groups as GroupsIcon,
    Handshake as HandshakeIcon,
    TrendingUp as TrendingUpIcon,
    Star as StarIcon,
} from "@mui/icons-material"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const stats = [
    { number: "10+", label: "Años de Experiencia", icon: <TrendingUpIcon /> },
    { number: "100%", label: "Fabricación Nacional", icon: <FactoryIcon /> },
    { number: "1,000+", label: "Clientes Satisfechos", icon: <GroupsIcon /> },
    { number: "50+", label: "Modelos Disponibles", icon: <StarIcon /> },
]

const values = [
    {
        icon: <SecurityIcon sx={{ fontSize: 48 }} />,
        title: "Compromiso con la Seguridad",
        description: "La protección del trabajador es nuestra prioridad número uno. Cada prenda está diseñada para cumplir con los más altos estándares de seguridad industrial."
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
        title: "Calidad Superior",
        description: "Manufactura directa con los mejores materiales: telas 100% poliéster con tratamiento UV, cintas reflejantes de alta intensidad y costuras reforzadas."
    },
    {
        icon: <InnovationIcon sx={{ fontSize: 48 }} />,
        title: "Innovación y Diseño",
        description: "Desarrollamos modelos ergonómicos que combinan funcionalidad, visibilidad y comodidad. La gama de colores más amplia del mercado a tu disposición."
    },
    {
        icon: <HandshakeIcon sx={{ fontSize: 48 }} />,
        title: "Enfoque en el Cliente",
        description: "Personalización desde una sola pieza con bordado de logotipos. Nos adaptamos a las necesidades de tu empresa sin mínimos de compra."
    },
]

const features = [
    {
        icon: <FactoryIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        title: "Fabricantes Directos",
        description: "Sin intermediarios, asegurando el mejor precio y control de calidad total en cada paso del proceso de manufactura."
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        title: "Certificaciones Internacionales",
        description: "Cumplimiento con estándares internacionales de alta visibilidad ISO 20471 y EN 20471 para tu tranquilidad."
    },
    {
        icon: <BrushIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        title: "Bordado Personalizado",
        description: "Personaliza tus chalecos con el logotipo de tu empresa. Disponible desde 1 unidad, ideal para empresas de cualquier tamaño."
    },
    {
        icon: <ShippingIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        title: "Envíos a Todo México",
        description: "Cobertura nacional desde nuestra sede en Guadalajara, Jalisco. Envíos rápidos y seguros a cualquier parte del país."
    },
]

const About = () => {
    const heroContentRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const quienesTextRef = useRef<HTMLDivElement>(null)
    const quienesImageRef = useRef<HTMLDivElement>(null)
    const misionVisionRef = useRef<HTMLDivElement>(null)
    const valoresGridRef = useRef<HTMLDivElement>(null)
    const valoresTitleRef = useRef<HTMLDivElement>(null)
    const featuresGridRef = useRef<HTMLDivElement>(null)
    const featuresTitleRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero content
            if (heroContentRef.current) {
                gsap.fromTo(
                    heroContentRef.current.children,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.18,
                        ease: "power3.out",
                        delay: 0.3,
                    }
                )
            }

            // Stats counter animation
            if (statsRef.current) {
                gsap.fromTo(
                    statsRef.current.querySelectorAll(".stat-item"),
                    { opacity: 0, y: 30, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "back.out(1.4)",
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Quiénes somos text
            if (quienesTextRef.current) {
                gsap.fromTo(
                    quienesTextRef.current.children,
                    { opacity: 0, x: -40 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: quienesTextRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Quiénes somos image
            if (quienesImageRef.current) {
                gsap.fromTo(
                    quienesImageRef.current,
                    { opacity: 0, x: 60, scale: 0.92 },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: quienesImageRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Misión/Visión cards
            if (misionVisionRef.current) {
                gsap.fromTo(
                    misionVisionRef.current.children,
                    { opacity: 0, y: 50, rotateY: 8 },
                    {
                        opacity: 1,
                        y: 0,
                        rotateY: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: misionVisionRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Valores title
            if (valoresTitleRef.current) {
                gsap.fromTo(
                    valoresTitleRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: valoresTitleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Valores cards staggered
            if (valoresGridRef.current) {
                gsap.fromTo(
                    valoresGridRef.current.children,
                    { opacity: 0, y: 60, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: valoresGridRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Features title
            if (featuresTitleRef.current) {
                gsap.fromTo(
                    featuresTitleRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featuresTitleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Features grid staggered
            if (featuresGridRef.current) {
                gsap.fromTo(
                    featuresGridRef.current.children,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featuresGridRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // CTA section
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current.children,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }
        })

        return () => ctx.revert()
    }, [])

    return (
        <Box>
            <Helmet>
                <title>Nosotros | MKing – Fábrica de Chalecos de Seguridad Industrial en México</title>
                <meta name="description" content="Conoce MKing - Maquila King: más de 10 años fabricando chalecos de seguridad industrial en Guadalajara, Jalisco. Fabricación 100% nacional, certificación ISO 20471 y bordado personalizado." />
                <link rel="canonical" href="https://mking.com.mx/nosotros" />
            </Helmet>

            {/* Hero Section */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "50vh", md: "60vh" },
                    backgroundImage: "url('/images/about-hero.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box ref={heroContentRef}>
                        <Typography
                            variant="overline"
                            sx={{ color: "#d32f2f", fontWeight: 700, letterSpacing: 3, fontSize: { xs: "0.7rem", md: "0.85rem" } }}
                        >
                            Desde Guadalajara, Jalisco para todo México
                        </Typography>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: "#fff",
                                mb: 2,
                                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
                                lineHeight: 1.1,
                            }}
                        >
                            Fabricantes de Chalecos<br />
                            de Seguridad Industrial
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                maxWidth: 550,
                                mb: 3,
                                fontSize: { xs: "0.9rem", md: "1.15rem" },
                                lineHeight: 1.6
                            }}
                        >
                            Más de 10 años de experiencia confeccionando prendas de alta visibilidad
                            con certificación ISO 20471. Fabricación 100% nacional.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/productos"
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: "#d32f2f",
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                fontSize: { xs: "0.85rem", md: "1rem" },
                                "&:hover": { bgcolor: "#b71c1c" },
                            }}
                        >
                            Ver Nuestros Productos
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ bgcolor: "#d32f2f", py: { xs: 4, md: 5 } }}>
                <Container maxWidth="lg">
                    <Grid ref={statsRef} container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index} className="stat-item">
                                <Box sx={{ textAlign: "center", color: "#fff" }}>
                                    <Box sx={{ mb: 1, opacity: 0.9 }}>{stat.icon}</Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "2.8rem" } }}>
                                        {stat.number}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: "0.75rem", md: "0.9rem" } }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Quiénes Somos Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box ref={quienesTextRef}>
                            <Typography
                                variant="overline"
                                sx={{ color: "#d32f2f", fontWeight: 700, letterSpacing: 2 }}
                            >
                                ¿Quiénes Somos?
                            </Typography>
                            <Typography
                                variant="h3"
                                component="h2"
                                sx={{ fontWeight: 800, mb: 3, fontSize: { xs: "1.6rem", md: "2.5rem" } }}
                            >
                                Maquila King – Líderes en Seguridad Industrial
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: "text.secondary", mb: 3, lineHeight: 1.8, fontSize: { xs: "0.9rem", md: "1rem" } }}
                            >
                                Somos una empresa 100% mexicana con sede en Guadalajara, Jalisco, especializada en la
                                fabricación de chalecos de seguridad industrial de alta visibilidad. Con más de una década
                                de experiencia en el mercado, nos hemos consolidado como referentes en la industria de la
                                seguridad laboral en México.
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: "text.secondary", mb: 3, lineHeight: 1.8, fontSize: { xs: "0.9rem", md: "1rem" } }}
                            >
                                Nuestra planta de producción cuenta con tecnología de punta y personal altamente capacitado
                                para garantizar que cada prenda cumpla con los estándares internacionales de calidad y seguridad,
                                incluyendo la certificación ISO 20471 de alta visibilidad.
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: "text.secondary", lineHeight: 1.8, fontSize: { xs: "0.9rem", md: "1rem" } }}
                            >
                                Nos distinguimos por ofrecer la gama de colores más amplia del mercado, personalización
                                con bordado desde una sola pieza y la mejor relación precio-calidad al ser fabricantes directos
                                sin intermediarios.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            ref={quienesImageRef}
                            sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                position: "relative",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: "30%",
                                    background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                                },
                            }}
                        >
                            <img
                                src="/images/about-hero.jpeg"
                                alt="Planta de producción MKing - Fabricación de chalecos de seguridad"
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Divider />

            {/* Misión y Visión */}
            <Box sx={{ bgcolor: "rgba(211, 47, 47, 0.05)", py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Grid ref={misionVisionRef} container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    height: "100%",
                                    background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
                                    border: "1px solid rgba(211, 47, 47, 0.3)",
                                    borderRadius: 3,
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 40px rgba(211, 47, 47, 0.15)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                bgcolor: "rgba(211, 47, 47, 0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mr: 2,
                                            }}
                                        >
                                            <SecurityIcon sx={{ fontSize: 32, color: "#d32f2f" }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" } }}>
                                            Misión
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary", lineHeight: 1.9, fontSize: { xs: "0.9rem", md: "1.05rem" } }}
                                    >
                                        Proporcionar soluciones de seguridad industrial a través de chalecos de alta visibilidad
                                        resistentes y de alta calidad, garantizando la protección y seguridad de los trabajadores
                                        en sus entornos laborales. Ofrecemos productos con la mejor relación precio-calidad,
                                        siendo fabricantes directos comprometidos con la excelencia.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    height: "100%",
                                    background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
                                    border: "1px solid rgba(211, 47, 47, 0.3)",
                                    borderRadius: 3,
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 40px rgba(211, 47, 47, 0.15)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                bgcolor: "rgba(211, 47, 47, 0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mr: 2,
                                            }}
                                        >
                                            <TrendingUpIcon sx={{ fontSize: 32, color: "#d32f2f" }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" } }}>
                                            Visión
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary", lineHeight: 1.9, fontSize: { xs: "0.9rem", md: "1.05rem" } }}
                                    >
                                        Ser reconocidos como la fábrica líder en la confección de chalecos de seguridad industrial
                                        en México, destacando por nuestra innovación, durabilidad y compromiso con la excelencia
                                        en cada prenda. Expandir nuestra presencia en el mercado latinoamericano manteniendo
                                        los más altos estándares de calidad.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Valores */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Box ref={valoresTitleRef} sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                    <Typography variant="overline" sx={{ color: "#d32f2f", fontWeight: 700, letterSpacing: 2 }}>
                        Lo que nos define
                    </Typography>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "1.5rem", md: "2.5rem" } }}
                    >
                        Nuestros Valores
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", maxWidth: 600, mx: "auto", fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                        Cada chaleco que fabricamos refleja nuestro compromiso con la seguridad,
                        la calidad y la satisfacción de nuestros clientes.
                    </Typography>
                </Box>

                <Grid ref={valoresGridRef} container spacing={3}>
                    {values.map((value, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    textAlign: "center",
                                    bgcolor: "#1a1a1a",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 3,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        borderColor: "rgba(211, 47, 47, 0.4)",
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 16px 48px rgba(211, 47, 47, 0.12)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: "50%",
                                            bgcolor: "rgba(211, 47, 47, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 3,
                                            color: "#d32f2f",
                                        }}
                                    >
                                        {value.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "0.95rem", md: "1.1rem" } }}>
                                        {value.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                                        {value.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Divider />

            {/* ¿Por qué elegirnos? */}
            <Box sx={{ py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Box ref={featuresTitleRef} sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                        <Typography variant="overline" sx={{ color: "#d32f2f", fontWeight: 700, letterSpacing: 2 }}>
                            Ventajas competitivas
                        </Typography>
                        <Typography
                            variant="h3"
                            component="h2"
                            sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "1.5rem", md: "2.5rem" } }}
                        >
                            ¿Por Qué Elegir MKing?
                        </Typography>
                    </Box>

                    <Grid ref={featuresGridRef} container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 3,
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: "#1a1a1a",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        height: "100%",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            borderColor: "rgba(211, 47, 47, 0.3)",
                                            bgcolor: "#1e1e1e",
                                        },
                                    }}
                                >
                                    <Box sx={{ flexShrink: 0, mt: 0.5 }}>
                                        {feature.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1rem", md: "1.15rem" } }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
                    py: { xs: 6, md: 8 },
                    textAlign: "center",
                }}
            >
                <Container ref={ctaRef} maxWidth="md">
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 800, color: "#fff", mb: 2, fontSize: { xs: "1.5rem", md: "2.5rem" } }}
                    >
                        ¿Listo para proteger a tu equipo?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "rgba(255,255,255,0.9)", mb: 4, maxWidth: 500, mx: "auto", fontSize: { xs: "0.9rem", md: "1.1rem" } }}
                    >
                        Descubre nuestra línea completa de chalecos de seguridad industrial
                        con bordado personalizado y envíos a todo México.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            component={RouterLink}
                            to="/productos"
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: "#fff",
                                color: "#d32f2f",
                                fontWeight: 700,
                                px: 4,
                                py: 1.5,
                                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                            }}
                        >
                            Explorar Productos
                        </Button>
                        <Button
                            component="a"
                            href="https://api.whatsapp.com/send?phone=523351146348&text=Hola+deseo+m%C3%A1s+informaci%C3%B3n+%F0%9F%A6%BA"
                            target="_blank"
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: "#fff",
                                color: "#fff",
                                fontWeight: 700,
                                px: 4,
                                py: 1.5,
                                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                            }}
                        >
                            Contáctanos por WhatsApp
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}

export default About
