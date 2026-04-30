import { useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Paper, IconButton, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const socialRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            if (headerRef.current) {
                gsap.fromTo(
                    headerRef.current.children,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
                );
            }

            // Social section animation
            if (socialRef.current) {
                gsap.fromTo(
                    socialRef.current.children,
                    { opacity: 0, x: -50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: socialRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }

            // Media section (Youtube/WhatsApp) animation
            if (mediaRef.current) {
                gsap.fromTo(
                    mediaRef.current.children,
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: mediaRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }

            // Map animation
            if (mapRef.current) {
                gsap.fromTo(
                    mapRef.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: mapRef.current,
                            start: "top 85%",
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <Box sx={{ bgcolor: '#4b4b4bff', minHeight: '100vh', pb: 10 }}>
            <Helmet>
                <title>Contacto y Redes Sociales | MKing</title>
                <meta name="description" content="Ponte en contacto con MKing. Síguenos en nuestras redes sociales, conoce nuestros videos y ubícanos en nuestro mapa interactivo." />
            </Helmet>

            {/* Hero Header */}
            <Box
                sx={{
                    bgcolor: '#111',
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                    borderBottom: '5px solid #d32f2f'
                }}
            >
                <Container maxWidth="md" ref={headerRef}>
                    <Typography variant="h2" fontWeight="900" sx={{ textTransform: 'uppercase', mb: 2 }}>
                        Conecta con MKing
                    </Typography>
                    <Typography variant="h6" color="grey.400" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Estamos siempre cerca de ti. Síguenos en nuestras redes sociales, mira nuestros últimos videos o visítanos directamente en nuestra fábrica.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -5 }}>
                {/* Info Cards */}
                <Grid container spacing={3} ref={socialRef}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%' }}>
                            <PhoneIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Llámanos</Typography>
                            <Typography variant="body1" color="text.secondary">+52 33 5114 6348</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%', bgcolor: '#d32f2f', color: 'white' }}>
                            <LocationOnIcon sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Visítanos</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2, fontSize: '1.1rem' }}>M King SA DE CV, Maquila KING</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Betlehem 3277, Lagos de Oriente</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>44770 Guadalajara, Jal.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%' }}>
                            <EmailIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Escríbenos</Typography>
                            <Typography variant="body1" color="text.secondary">maquila.king@hotmail.com</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Social Media & Video Section */}
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
                        Nuestras Redes
                    </Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
                        Descubre lo último en innovación, promociones y detrás de escena de nuestra fábrica.
                    </Typography>

                    <Grid container spacing={4} ref={mediaRef}>
                        {/* YouTube Video */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', height: { xs: 300, sm: 400, md: '100%' } }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/mLONOiYOUOk"
                                    title="MKing YouTube Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{ minHeight: '400px' }}
                                ></iframe>
                            </Paper>
                        </Grid>

                        {/* Social Links & WhatsApp */}
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* WhatsApp Direct */}
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: '#25D366', color: 'white', textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                                <WhatsAppIcon sx={{ fontSize: 60, mb: 1 }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom>Atención Rápida</Typography>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    ¿Tienes dudas o requieres una cotización urgente? Contáctanos por WhatsApp.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: 'white', color: '#25D366', fontWeight: 'bold', '&:hover': { bgcolor: '#f0f0f0' } }}
                                    href="https://wa.me/523351146348"
                                    target="_blank"
                                    fullWidth
                                >
                                    Abrir WhatsApp
                                </Button>
                            </Paper>

                            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
                                    Síguenos
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                    <IconButton
                                        href="https://www.facebook.com/maquilaking"
                                        target="_blank"
                                        sx={{ bgcolor: '#1877F2', color: 'white', '&:hover': { bgcolor: '#155dbd' }, p: 2 }}
                                    >
                                        <FacebookIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                        href="https://www.instagram.com/maquilaking"
                                        target="_blank"
                                        sx={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', '&:hover': { filter: 'brightness(0.9)' }, p: 2 }}
                                    >
                                        <InstagramIcon fontSize="large" />
                                    </IconButton>
                                    {/* TikTok Custom Icon using SVG since MUI doesn't have a native one yet */}
                                    <IconButton
                                        href="https://www.tiktok.com/@maquilaking"
                                        target="_blank"
                                        sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' }, p: 2 }}
                                    >
                                        <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                        </svg>
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Google Maps Location */}
                <Box sx={{ mt: 10 }} ref={mapRef}>
                    <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
                        Nuestra Ubicación
                    </Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 1 }}>
                        Visita nuestra fábrica y conoce la calidad MKing en persona.
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary" textAlign="center" sx={{ mb: 4, fontSize: '1.2rem' }}>
                        📍 Betlehem 3277, Lagos de Oriente, 44770 Guadalajara, Jal.
                    </Typography>

                    <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', height: { xs: 400, md: 500 }, position: 'relative' }}>
                        <iframe
                            src="https://maps.google.com/maps?q=20.670765,-103.288203&t=&z=17&ie=UTF8&iwloc=near&output=embed"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            allowFullScreen
                            aria-hidden="false"
                            tabIndex={0}
                            title="Mapa MKing"
                        ></iframe>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            href="https://www.google.com/maps/place/M+King+SA+DE+CV,+Maquila+KING/@20.6707663,-103.2888467,269m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8428b112b5c14573:0x5587b1a7585aa952!8m2!3d20.670765!4d-103.288203!16s%2Fg%2F11lbbbcf0k?entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            startIcon={<LocationOnIcon />}
                            sx={{ borderRadius: 6, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', bgcolor: 'rgba(211,47,47,0.05)' }}
                        >
                            Ver en Maps
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            href="https://moovitapp.com/?to=M+King+SA+DE+CV&tll=20.670765_-103.288203"
                            target="_blank"
                            startIcon={<DirectionsBusIcon />}
                            sx={{ borderRadius: 6, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', color: '#FF7F00', borderColor: '#FF7F00', '&:hover': { bgcolor: 'rgba(255, 127, 0, 0.05)', borderColor: '#FF7F00' } }}
                        >
                            Rutas
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            href="https://www.google.com/maps/dir/?api=1&destination=20.670765,-103.288203"
                            target="_blank"
                            startIcon={<LocationOnIcon />}
                            sx={{ borderRadius: 6, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
                        >
                            Cómo llegar
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Contact;
