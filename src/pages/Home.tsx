import { useEffect, useRef, useState } from "react"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import ProductsCarousel from "../components/ProductsCarousel"
import { GetCollectionBySlugService, ProdutcList } from "../services/MKing.service"
import CategoriesCarousel from "../components/CategoriesCarousel"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
    const heroTextRef = useRef<HTMLDivElement>(null)
    const heroImageRef = useRef<HTMLDivElement>(null)
    const featuredTitleRef = useRef<HTMLDivElement>(null)
    const featuredGridRef = useRef<HTMLDivElement>(null)
    const categoriesTitleRef = useRef<HTMLDivElement>(null)
    const categoriesGridRef = useRef<HTMLDivElement>(null)
    const featureImageRef = useRef<HTMLDivElement>(null)
    const featureTextRef = useRef<HTMLDivElement>(null)

    const [featured, setFeatured] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])

    const heroImages = [
        "images/home.jpeg",
        "images/home_2.jpeg",
        "images/home_3.jpeg"
    ];

    useEffect(() => {
        GetCollectionBySlugService('productos-destacados')
            .then((res: any) => {
                if (res.data && res.data.products) {
                    setFeatured(res.data.products)
                }
            })
            .catch((err) => console.error("Error fetching featured collection:", err))

        ProdutcList()
            .then((res: any) => {
                if (res.data && res.data.categories && res.data.products) {
                    const cats = res.data.categories
                    const prods = res.data.products

                    const categoriesWithImages = cats
                        .filter((cat: any) => prods.some((p: any) => p.category_id === cat.id))
                        .map((cat: any) => {
                            const catProducts = prods.filter((p: any) => p.category_id === cat.id && p.images && p.images.length > 0)
                            let randomImg = "/images/category-1.jpg" // Fallback

                            if (catProducts.length > 0) {
                                const randomProduct = catProducts[Math.floor(Math.random() * catProducts.length)]
                                const firstImage = randomProduct.images[0]
                                randomImg = firstImage.url || firstImage.image_path || randomImg
                            } else if (cat.name.toLowerCase().includes("multi")) {
                                randomImg = "/images/category-2.jpg"
                            } else if (cat.name.toLowerCase().includes("igni")) {
                                randomImg = "/images/category-3.jpg"
                            }

                            return {
                                id: cat.id,
                                name: cat.name,
                                image: randomImg,
                                slug: cat.name.toLowerCase().replace(/ /g, '-')
                            }
                        })
                    setCategories(categoriesWithImages)
                }
            })
            .catch((err) => console.error("Error fetching categories:", err))
    }, [])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text animation
            if (heroTextRef.current) {
                gsap.fromTo(
                    heroTextRef.current.children,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.2,
                        ease: "power3.out",
                        delay: 0.3,
                    }
                )
            }

            // Hero image slider animation
            if (heroImageRef.current && heroImageRef.current.children.length > 0) {
                const images = gsap.utils.toArray(heroImageRef.current.children) as HTMLElement[];

                // Initialize all images
                gsap.set(images, { opacity: 0, scale: 1.15, zIndex: 0 });

                const tl = gsap.timeline({ repeat: -1 });

                images.forEach((img, index) => {
                    const isFirst = index === 0;
                    const isLast = index === images.length - 1;

                    // Bring current image to front
                    tl.set(img, { zIndex: 1 }, isFirst ? 0 : "-=1.5");

                    // Fade in and zoom out slightly
                    tl.to(img, { opacity: 0.6, scale: 1, duration: 2, ease: "power2.out" }, isFirst ? 0 : "-=1.5");

                    // Hold and zoom in (Ken Burns)
                    tl.to(img, { scale: 1.05, duration: 4, ease: "none" });

                    if (!isLast) {
                        // Fade out as the next one fades in
                        tl.to(img, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
                        tl.set(img, { zIndex: 0 });
                    } else {
                        // The last image fades out at the very beginning of the timeline 
                        // so it crossfades seamlessly with the first image on repeat.
                        tl.set(img, { zIndex: 0 });
                        tl.to(img, { opacity: 0, duration: 1.5, ease: "power2.inOut" }, 0);
                    }
                });
            }

            // Featured products section
            if (featuredTitleRef.current) {
                gsap.fromTo(
                    featuredTitleRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featuredTitleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Featured products grid staggered
            if (featuredGridRef.current) {
                gsap.fromTo(
                    featuredGridRef.current.children,
                    { opacity: 0, y: 60, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featuredGridRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Categories title
            if (categoriesTitleRef.current) {
                gsap.fromTo(
                    categoriesTitleRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: categoriesTitleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            if (categoriesGridRef.current) {
                gsap.fromTo(
                    categoriesGridRef.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: categoriesGridRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Feature section image
            if (featureImageRef.current) {
                gsap.fromTo(
                    featureImageRef.current,
                    { opacity: 0, x: -60, scale: 0.95 },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featureImageRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                )
            }

            // Feature section text
            if (featureTextRef.current) {
                gsap.fromTo(
                    featureTextRef.current.children,
                    { opacity: 0, x: 40 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featureTextRef.current,
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
                <title>MKing – Chalecos de Seguridad Industrial | Tienda en Línea México</title>
                <meta name="description" content="Fábrica y tienda en línea de chalecos de seguridad industrial con bordado personalizado. Equipo de protección personal, ropa de trabajo y envíos a todo México. Venta al mayoreo y menudeo." />
                <link rel="canonical" href="https://mking.com.mx/" />
            </Helmet>
            {/* Hero Section */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "55vh", sm: "60vh", md: "80vh" },
                    backgroundColor: "#000",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <Box
                    ref={heroImageRef}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {heroImages.map((src, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={src}
                            alt={`MKing Home ${index + 1}`}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: 0, // GSAP will handle opacity
                            }}
                        />
                    ))}
                </Box>
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box ref={heroTextRef} sx={{ maxWidth: { xs: "100%", md: "50%" } }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "4rem" },
                                mb: { xs: 1, md: 2 },
                                textTransform: "uppercase",
                                lineHeight: 1.1,
                            }}
                        >
                            Seguridad con Estilo
                        </Typography>
                        <Typography variant="h5" sx={{ mb: { xs: 2, md: 4 }, fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.5rem" } }}>
                            Descubre nuestra nueva colección de chalecos industriales que combinan seguridad y diseño.
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 2 }, alignItems: { xs: "stretch", sm: "flex-start" } }}>
                            <Button
                                component={RouterLink}
                                to="/productos"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ fontSize: { xs: "0.85rem", md: "0.95rem" } }}
                            >
                                Comprar Ahora
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/novedades"
                                variant="outlined"
                                color="primary"
                                size="large"
                                sx={{ borderColor: "#fff", color: "#fff", fontSize: { xs: "0.85rem", md: "0.95rem" } }}
                            >
                                Ver Novedades
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Featured Products */}
            <Container maxWidth="lg" sx={{ my: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
                <Typography ref={featuredTitleRef} variant="h4" component="h2" sx={{ mb: { xs: 2, md: 4 }, fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } }}>
                    Productos Destacados
                </Typography>
                <Box ref={featuredGridRef}>
                    <ProductsCarousel products={featured} autoPlay={true} autoPlayInterval={5000} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button component={RouterLink} to="/productos" variant="outlined" color="primary" size="large">
                        Ver Todos los Productos
                    </Button>
                </Box>
            </Container>

            {/* Categories */}
            <Box sx={{ backgroundColor: "#0a0a0a", py: { xs: 4, md: 8 } }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Typography ref={categoriesTitleRef} variant="h4" component="h2" sx={{ mb: { xs: 2, md: 4 }, fontWeight: "bold", color: "white", fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } }}>
                        Categorías
                    </Typography>
                    <Box ref={categoriesGridRef}>
                        <CategoriesCarousel categories={categories} />
                    </Box>
                </Container>
            </Box>

            {/* Features */}
            <Container maxWidth="lg" sx={{ my: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Box
                            ref={featureImageRef}
                            component="img"
                            src="/images/feature.jpeg"
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
                        <Box ref={featureTextRef} sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography variant="h4" component="h2" sx={{ mb: { xs: 2, md: 3 }, fontWeight: "bold", fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2.125rem" } }}>
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
