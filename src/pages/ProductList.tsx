"use client"

import { useState, useEffect } from "react"
import { Box, Container, Grid, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Checkbox, Slider, Button, FormControl, InputLabel, Select, MenuItem, Divider, Chip, IconButton, useMediaQuery, useTheme, SelectChangeEvent } from "@mui/material"
import { FilterList, Close } from "@mui/icons-material"
import ProductCard from "../components/ProductCard"
import { products } from "../data/Products"

const ProductList = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [priceRange, setPriceRange] = useState([0, 500])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [sortBy, setSortBy] = useState("featured")

    const categories = [
        { id: "alta-visibilidad", name: "Alta Visibilidad" },
        { id: "multibolsillos", name: "Multibolsillos" },
        { id: "ignifugos", name: "Ignífugos" },
        { id: "reflectantes", name: "Reflectantes" },
        { id: "termicos", name: "Térmicos" },
    ]

    const colors = [
        { id: "negro", name: "Negro", hex: "#000000" },
        { id: "rojo", name: "Rojo", hex: "#ff0000" },
        { id: "amarillo", name: "Amarillo", hex: "#ffff00" },
        { id: "naranja", name: "Naranja", hex: "#ff9800" },
        { id: "azul", name: "Azul", hex: "#0000ff" },
        { id: "verde", name: "Verde", hex: "#00ff00" },
    ]

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const handlePriceChange = (e: Event, newValue: number[]) => {
        console.log(e);

        setPriceRange(newValue)
    }

    const handleCategoryToggle = (categoryId: string) => {
        const currentIndex = selectedCategories.indexOf(categoryId)
        const newSelectedCategories = [...selectedCategories]

        if (currentIndex === -1) {
            newSelectedCategories.push(categoryId)
        } else {
            newSelectedCategories.splice(currentIndex, 1)
        }

        setSelectedCategories(newSelectedCategories)
    }

    const handleColorToggle = (colorId: string) => {
        const currentIndex = selectedColors.indexOf(colorId)
        const newSelectedColors = [...selectedColors]

        if (currentIndex === -1) {
            newSelectedColors.push(colorId)
        } else {
            newSelectedColors.splice(currentIndex, 1)
        }

        setSelectedColors(newSelectedColors)
    }

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value || "featured")
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setSelectedColors([])
        setPriceRange([0, 500])
    }

    const removeCategory = (categoryId: string) => {
        setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }

    const removeColor = (colorId: string) => {
        setSelectedColors(selectedColors.filter((id) => id !== colorId))
    }

    // Apply filters and sorting
    useEffect(() => {
        let result = [...products]

        // Filter by price
        result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

        // Filter by category
        if (selectedCategories.length > 0) {
            result = result.filter((product) => product.categories.some((category) => selectedCategories.includes(category)))
        }

        // Filter by color
        if (selectedColors.length > 0) {
            result = result.filter((product) => product.colorIds.some((color) => selectedColors.includes(color)))
        }

        // Sort products
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price)
                break
            case "price-high":
                result.sort((a, b) => b.price - a.price)
                break
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            default:
                // 'featured' - no sorting needed as products are already sorted by featured
                break
        }

        setFilteredProducts(result)
    }, [priceRange, selectedCategories, selectedColors, sortBy])

    const filterDrawerContent = (
        <Box
            sx={{
                width: isMobile ? "100vw" : 300,
                p: 3,
                height: "100%",
                overflow: "auto",
            }}
            role="presentation"
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Filtros
                </Typography>
                <IconButton onClick={toggleDrawer}>
                    <Close />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Precio
            </Typography>
            <Box sx={{ px: 1, mb: 3 }}>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={500}
                    color="primary"
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">${priceRange[0]}</Typography>
                    <Typography variant="body2">${priceRange[1]}</Typography>
                </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Categorías
            </Typography>
            <List sx={{ mb: 2 }}>
                {categories.map((category) => (
                    <ListItem key={category.id} disablePadding>
                        <ListItemButton dense onClick={() => handleCategoryToggle(category.id)}>
                            <Checkbox
                                edge="start"
                                checked={selectedCategories.indexOf(category.id) !== -1}
                                tabIndex={-1}
                                disableRipple
                                color="primary"
                            />
                            <ListItemText primary={category.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Colores
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {colors.map((color) => (
                    <Box
                        key={color.id}
                        onClick={() => handleColorToggle(color.id)}
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: color.hex,
                            cursor: "pointer",
                            border: selectedColors.includes(color.id) ? "2px solid #ff0000" : "1px solid rgba(255,255,255,0.2)",
                            position: "relative",
                            "&:hover": {
                                opacity: 0.8,
                            },
                        }}
                    >
                        {selectedColors.includes(color.id) && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Box>

            <Button variant="outlined" color="primary" fullWidth onClick={clearFilters} sx={{ mt: 2 }}>
                Limpiar Filtros
            </Button>
        </Box>
    )

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                    Chalecos Industriales
                </Typography>
                <Button variant="outlined" startIcon={<FilterList />} onClick={toggleDrawer} sx={{ display: { md: "none" } }}>
                    Filtros
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Filters for desktop */}
                <Grid item md={3} lg={2} sx={{ display: { xs: "none", md: "block" } }}>
                    {filterDrawerContent}
                </Grid>

                {/* Product grid */}
                <Grid item xs={12} md={9} lg={10}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {selectedCategories.map((categoryId) => {
                                const category = categories.find((c) => c.id === categoryId)
                                return (
                                    <Chip
                                        key={categoryId}
                                        label={category?.name}
                                        onDelete={() => removeCategory(categoryId)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )
                            })}

                            {selectedColors.map((colorId) => {
                                const color = colors.find((c) => c.id === colorId)
                                return (
                                    <Chip
                                        key={colorId}
                                        label={color?.name}
                                        onDelete={() => removeColor(colorId)}
                                        color="primary"
                                        variant="outlined"
                                        sx={{
                                            "& .MuiChip-avatar": {
                                                backgroundColor: color?.hex,
                                            },
                                        }}
                                    />
                                )
                            })}

                            {(selectedCategories.length > 0 || selectedColors.length > 0) && (
                                <Chip label="Limpiar todo" onClick={clearFilters} color="primary" />
                            )}
                        </Box>

                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <InputLabel id="sort-select-label">Ordenar por</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                id="sort-select"
                                value={sortBy}
                                label="Ordenar por"
                                onChange={handleSortChange}
                            >
                                <MenuItem value="featured">Destacados</MenuItem>
                                <MenuItem value="newest">Más recientes</MenuItem>
                                <MenuItem value="price-low">Precio: Bajo a Alto</MenuItem>
                                <MenuItem value="price-high">Precio: Alto a Bajo</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {filteredProducts.length} productos encontrados
                    </Typography>

                    <Grid container spacing={3}>
                        {filteredProducts.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>

                    {filteredProducts.length === 0 && (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                No se encontraron productos
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Intenta cambiar los filtros o buscar con otros términos.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={clearFilters}>
                                Limpiar Filtros
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Mobile drawer */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                {filterDrawerContent}
            </Drawer>
        </Container>
    )
}

export default ProductList
