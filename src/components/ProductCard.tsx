import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import { Product } from "../interfaces/ProductInterface"

const ProductCard = ({ product }: { product: Product }) => {
    const { id, name, price, images, colors, isNew, discount } = product

    return (
        <Card
            sx={{
                maxWidth: 345,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                backgroundColor: "#1e1e1e",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-5px)",
                },
            }}
        >
            {isNew && (
                <Chip
                    label="NUEVO"
                    color="primary"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 1,
                        fontWeight: "bold",
                    }}
                />
            )}

            {discount > 0 && (
                <Chip
                    label={`-${discount}%`}
                    color="error"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        fontWeight: "bold",
                    }}
                />
            )}

            <CardActionArea
                component={Link}
                to={`/producto/${id}`}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
            >
                <CardMedia component="img" height="200" image={images[0]} alt={name} sx={{ objectFit: "cover" }} />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        {name}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                        {colors.map((color, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: color,
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ mt: "auto" }}>
                        {discount > 0 ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                    ${(price * (1 - discount / 100)).toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                    ${price.toFixed(2)}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                ${price.toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ProductCard
