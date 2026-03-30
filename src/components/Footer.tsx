import { Box, Container, Grid, Typography, Link, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, YouTube } from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"

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
                            <IconButton color="inherit" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="YouTube">
                                <YouTube />
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
