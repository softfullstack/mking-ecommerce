import { useState, MouseEventHandler } from "react"
import { Box, IconButton } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import Carousel from "react-material-ui-carousel"

interface ProductCarouselProps {
    images: string[];
}

const ProductCarousel = ({ images }: ProductCarouselProps) => {
    const [activeStep, setActiveStep] = useState(0)

    const handleStepChange = (_now?: number, _previous?: number) => {
        if (typeof _now === 'number') {
            setActiveStep(_now)
        }
    }

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            <Carousel
                index={activeStep}
                onChange={handleStepChange}
                animation="slide"
                navButtonsAlwaysVisible
                indicators={true}
                navButtonsProps={{
                    style: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                    }
                }}
                NavButton={({ onClick, className, style, next, prev }) => {
                    const handleClick: MouseEventHandler = (e) => {
                        if (onClick) onClick(e)
                    }

                    return (
                        <IconButton
                            onClick={handleClick}
                            className={className}
                            style={style}
                            sx={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                },
                            }}
                        >
                            {next && <KeyboardArrowRight />}
                            {prev && <KeyboardArrowLeft />}
                        </IconButton>
                    )
                }}
            >
                {images.map((image, index) => (
                    <Box
                        key={index}
                        component="img"
                        sx={{
                            height: 500,
                            display: "block",
                            overflow: "hidden",
                            width: "100%",
                            objectFit: "contain",
                            backgroundColor: "#000",
                        }}
                        src={image}
                        alt={`Product image ${index + 1}`}
                    />
                ))}
            </Carousel>

            {/* Thumbnails */}
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 1,
                    mt: 2,
                    pb: 1,
                    "&::-webkit-scrollbar": {
                        height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(255,0,0,0.5)",
                        borderRadius: 3,
                    },
                }}
            >
                {images.map((image, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => handleStepChange(index)}
                        sx={{
                            height: 60,
                            width: 60,
                            objectFit: "cover",
                            cursor: "pointer",
                            border: index === activeStep ? "2px solid #ff0000" : "2px solid transparent",
                            opacity: index === activeStep ? 1 : 0.7,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                opacity: 1,
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default ProductCarousel
