import { useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider, useTheme } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

gsap.registerPlugin(ScrollTrigger);

const Ubicaciones = () => {
    const theme = useTheme();
    const headerRef = useRef<HTMLDivElement>(null);
    const gdlRef = useRef<HTMLDivElement>(null);
    const mtyRef = useRef<HTMLDivElement>(null);

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

            // Guadalajara section animation
            if (gdlRef.current) {
                gsap.fromTo(
                    gdlRef.current.children,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: gdlRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }

            // Monterrey section animation
            if (mtyRef.current) {
                gsap.fromTo(
                    mtyRef.current.children,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: mtyRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            <Helmet>
                <title>Fábrica de Chalecos en Guadalajara y Monterrey | Ubicaciones MKing</title>
                <meta name="description" content="Visita nuestra fábrica y sucursales de chalecos de seguridad industrial en Guadalajara, Jalisco y Monterrey. Direcciones, atención directas y mapa de ubicación." />
                <meta name="keywords" content="fabrica de chalecos guadalajara, chalecos en guadalajara ubicacion, sucursal chalecos de seguridad guadalajara, mking guadalajara" />
            </Helmet>

            {/* Hero Header */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    color: 'white',
                    py: { xs: 8, md: 10 },
                    textAlign: 'center',
                    borderBottom: `5px solid ${theme.palette.primary.main}`,
                    mb: 8
                }}
            >
                <Container maxWidth="md" ref={headerRef}>
                    <Typography variant="h2" fontWeight="900" sx={{ textTransform: 'uppercase', mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                        Nuestras Ubicaciones
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Visítanos en nuestras plantas de producción y showrooms. Estamos listos para atender tus requerimientos con la mejor calidad en equipos de protección industrial.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Guadalajara Branch */}
                <Grid container spacing={4} alignItems="center" ref={gdlRef} sx={{ mb: 10 }}>
                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                height: '100%',
                                borderLeft: `6px solid ${theme.palette.primary.main}`,
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOnIcon color="primary" sx={{ fontSize: 35, mr: 1 }} />
                                <Typography variant="h4" fontWeight="bold">
                                    Guadalajara (Matriz)
                                </Typography>
                            </Box>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Nuestra planta de manufactura principal y oficinas generales están ubicadas en Guadalajara, Jalisco. Desde aquí coordinamos la producción y distribución nacional.
                            </Typography>

                            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Dirección</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Betlehem 3277, Lagos de Oriente<br />
                                            44770 Guadalajara, Jal.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <PhoneIcon color="primary" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Teléfono</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            +52 33 5114 6348
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <EmailIcon color="primary" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Correo Electrónico</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            maquila.king@hotmail.com
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    href="https://www.google.com/maps/dir/?api=1&destination=20.670765,-103.288203"
                                    target="_blank"
                                    startIcon={<LocationOnIcon />}
                                    sx={{ py: 1.2, fontWeight: 'bold' }}
                                >
                                    Cómo llegar
                                </Button>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        href="https://www.google.com/maps/place/M+King+SA+DE+CV,+Maquila+KING/@20.6707663,-103.2888467,269m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8428b112b5c14573:0x5587b1a7585aa952!8m2!3d20.670765!4d-103.288203!16s%2Fg%2F11lbbbcf0k?entry=ttu"
                                        target="_blank"
                                        sx={{ py: 1, fontWeight: 'bold', fontSize: '0.85rem' }}
                                    >
                                        Ver en Maps
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        href="https://moovitapp.com/?to=M+King+SA+DE+CV&tll=20.670765_-103.288203"
                                        target="_blank"
                                        startIcon={<DirectionsBusIcon />}
                                        sx={{
                                            py: 1,
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            color: '#FF7F00',
                                            borderColor: '#FF7F00',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 127, 0, 0.05)',
                                                borderColor: '#FF7F00'
                                            }
                                        }}
                                    >
                                        Rutas
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                height: { xs: 350, md: 500 },
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            <iframe
                                src="https://maps.google.com/maps?q=20.670765,-103.288203&t=&z=17&ie=UTF8&iwloc=near&output=embed"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                aria-hidden="false"
                                tabIndex={0}
                                title="Mapa MKing Guadalajara"
                            ></iframe>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Monterrey Branch */}
                <Grid container spacing={4} alignItems="center" ref={mtyRef} sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}>
                    <Grid item xs={12} md={7}>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                height: { xs: 350, md: 500 },
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            <iframe
                                src="https://maps.google.com/maps?q=Luis%20Moreno%204815,%20Ni%C3%B1o%20Artillero,%2064280%20Monterrey,%20N.L.&t=&z=17&ie=UTF8&iwloc=near&output=embed"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                aria-hidden="false"
                                tabIndex={0}
                                title="Mapa MKing Monterrey"
                            ></iframe>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                height: '100%',
                                borderLeft: `6px solid ${theme.palette.primary.main}`,
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOnIcon color="primary" sx={{ fontSize: 35, mr: 1 }} />
                                <Typography variant="h4" fontWeight="bold">
                                    Monterrey
                                </Typography>
                            </Box>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Nuestra nueva sucursal y centro de distribución en Monterrey atiende la región norte del país, ofreciendo tiempos de entrega rápidos y atención directa al mercado industrial de la zona.
                            </Typography>

                            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Dirección</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Luis Moreno 4815, Niño Artillero<br />
                                            64280 Monterrey, N.L.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <PhoneIcon color="primary" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Contacto y Ventas</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            +52 33 5114 6348 (Atención Nacional)
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <EmailIcon color="primary" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Correo Electrónico</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            maquila.king@hotmail.com
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    href="https://www.google.com/maps/dir/?api=1&destination=Luis%20Moreno%204815,%20Ni%C3%B1o%20Artillero,%2064280%20Monterrey,%20N.L."
                                    target="_blank"
                                    startIcon={<LocationOnIcon />}
                                    sx={{ py: 1.2, fontWeight: 'bold' }}
                                >
                                    Cómo llegar
                                </Button>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        href="https://www.google.com/maps/search/?api=1&query=Luis%20Moreno%204815,%20Ni%C3%B1o%20Artillero,%2064280%20Monterrey,%20N.L."
                                        target="_blank"
                                        sx={{ py: 1, fontWeight: 'bold', fontSize: '0.85rem' }}
                                    >
                                        Ver en Maps
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        href="https://moovitapp.com/?to=Luis+Moreno+4815+Niño+Artillero+Monterrey"
                                        target="_blank"
                                        startIcon={<DirectionsBusIcon />}
                                        sx={{
                                            py: 1,
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            color: '#FF7F00',
                                            borderColor: '#FF7F00',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 127, 0, 0.05)',
                                                borderColor: '#FF7F00'
                                            }
                                        }}
                                    >
                                        Rutas
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Ubicaciones;
