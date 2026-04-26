import { Box, Container, Grid, Typography, Link, IconButton, Divider, SvgIcon } from "@mui/material"
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"

const TikTokIcon = (props: any) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.35-2.85 5.74-1.8 1.48-4.24 2.1-6.49 1.52-2.18-.54-4.04-2.1-4.88-4.18C1.51 17.79 1.7 15.53 2.91 13.8c1.17-1.71 3.06-2.83 5.12-3.12 1.05-.15 2.13-.06 3.16.19v4.06c-.66-.17-1.36-.21-2.04-.1-.7.1-1.37.45-1.85.95-.51.52-.81 1.25-.83 1.99-.02.73.23 1.46.7 2.01.5.58 1.25.9 2.01.93.75.03 1.5-.22 2.08-.7.54-.46.88-1.11.96-1.8.03-.25.04-.51.04-.76V.02z" />
    </SvgIcon>
)

const Footer = () => {
    return (
        <Box
            sx={{
                bgcolor: "black",
                color: "white",
                py: { xs: 4, md: 6 },
                mt: "auto",
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            AYUDA
                        </Typography>

                        <Link component={RouterLink} to="/contacto" color="inherit" sx={{ display: "block", mb: 1 }}>
                            Contacto
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            ACERCA DE MKING
                        </Typography>
                        <Link component={RouterLink} to="/nosotros" color="inherit" sx={{ display: "block", mb: 1 }}>
                            Nosotros
                        </Link>
                        <Link component={RouterLink} to="/noticias" color="inherit" sx={{ display: "block", mb: 1 }}>
                            Noticias
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            VENTAJAS
                        </Typography>
                        <Link component={RouterLink} to="/ventajas/descuentos" color="inherit" sx={{ display: "block", mb: 1 }}>
                            Descuentos para empresas
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            SÍGUENOS
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton color="inherit" aria-label="Facebook" component="a" href="https://www.facebook.com/MKingbag" target="_blank" rel="noopener noreferrer">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Instagram" component="a" href="https://www.instagram.com/maquilaking/" target="_blank" rel="noopener noreferrer">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="TikTok" component="a" href="https://www.tiktok.com/@maquilaking" target="_blank" rel="noopener noreferrer">
                                <TikTokIcon />
                            </IconButton>
                            <IconButton color="inherit" aria-label="WhatsApp" component="a" href="https://api.whatsapp.com/send?phone=523351146348&text=Hola%2C%20vengo%20desde%20MKing%20y%20deseo%20m%C3%A1s%20informaci%C3%B3n.%20http%3A%2F%2Flocalhost%3A5173%2F" target="_blank" rel="noopener noreferrer">
                                <WhatsApp />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.12)" }} />

                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: { xs: "center", md: "space-between" } }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, mb: { xs: 2, md: 0 } }}>
                        <Link color="inherit" component={RouterLink} to="/ubicaciones">
                            <Typography variant="body2">Ubicaciones</Typography>
                        </Link>
                        <Link color="inherit" component={RouterLink} to="/terminos">
                            <Typography variant="body2">Términos de venta</Typography>
                        </Link>
                        <Link color="inherit" component={RouterLink} to="/privacidad">
                            <Typography variant="body2">Política de privacidad</Typography>
                        </Link>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} SafetyVest, Inc. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer
