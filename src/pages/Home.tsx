import { Box, Button, Container, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { featuredProducts } from "../data/Products"

const Home = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "60vh", md: "80vh" },
                    backgroundColor: "#000",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src="images/home.png"
                    alt="Home"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.6,
                    }}
                />
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ maxWidth: { xs: "100%", md: "50%" } }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: "2.5rem", md: "4rem" },
                                mb: 2,
                                textTransform: "uppercase",
                            }}
                        >
                            Seguridad con Estilo
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4 }}>
                            Descubre nuestra nueva colección de chalecos industriales que combinan seguridad y diseño.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/productos"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mr: 2 }}
                        >
                            Comprar Ahora
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/novedades"
                            variant="outlined"
                            color="primary"
                            size="large"
                            sx={{ borderColor: "#fff", color: "#fff" }}
                        >
                            Ver Novedades
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Featured Products */}
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: "bold" }}>
                    Productos Destacados
                </Typography>
                <Grid container spacing={3}>
                    {featuredProducts.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button component={RouterLink} to="/productos" variant="outlined" color="primary" size="large">
                        Ver Todos los Productos
                    </Button>
                </Box>
            </Container>

            {/* Categories */}
            <Box sx={{ backgroundColor: "#0a0a0a", py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: "bold", color: "white" }}>
                        Categorías
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: "100%", backgroundColor: "#1e1e1e" }}>
                                <CardMedia component="img" height="200" image="/images/category-1.jpg" alt="Alta Visibilidad" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                                        Alta Visibilidad
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Chalecos diseñados para entornos que requieren máxima visibilidad.
                                    </Typography>
                                    <Button component={RouterLink} to="/categoria/alta-visibilidad" variant="text" color="primary">
                                        Explorar
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: "100%", backgroundColor: "#1e1e1e" }}>
                                <CardMedia component="img" height="200" image="/images/category-2.jpg" alt="Multibolsillos" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                                        Multibolsillos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Funcionalidad y practicidad con múltiples compartimentos.
                                    </Typography>
                                    <Button component={RouterLink} to="/categoria/multibolsillos" variant="text" color="primary">
                                        Explorar
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: "100%", backgroundColor: "#1e1e1e" }}>
                                <CardMedia component="img" height="200" image="/images/category-3.jpg" alt="Ignífugos" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                                        Ignífugos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Protección contra el fuego y altas temperaturas.
                                    </Typography>
                                    <Button component={RouterLink} to="/categoria/ignifugos" variant="text" color="primary">
                                        Explorar
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="/images/feature.jpg"
                            alt="Características"
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 2,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
                                Por qué elegir nuestros chalecos
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Nuestros chalecos industriales combinan la última tecnología en seguridad con un diseño moderno y
                                cómodo. Fabricados con materiales de alta calidad, garantizan durabilidad y protección en los entornos
                                más exigentes.
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    ✓ Materiales de alta resistencia
                                </Typography>
                                <Typography variant="body2">
                                    Tejidos duraderos que soportan condiciones extremas y uso intensivo.
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    ✓ Diseño ergonómico
                                </Typography>
                                <Typography variant="body2">
                                    Adaptados a la anatomía para garantizar comodidad durante largas jornadas.
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    ✓ Certificaciones internacionales
                                </Typography>
                                <Typography variant="body2">
                                    Cumplimos con los estándares más exigentes de seguridad laboral.
                                </Typography>
                            </Box>
                            <Button
                                component={RouterLink}
                                to="/nosotros"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ mt: 2, alignSelf: "flex-start" }}
                            >
                                Conoce más
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Home
