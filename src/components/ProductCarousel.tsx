import { useState, useEffect } from "react"
import { Box, IconButton } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface ProductCarouselProps {
    images: string[];
    onImageClick?: (index: number) => void;
    initialIndex?: number;
    isModal?: boolean;
}

const ProductCarousel = ({ images, onImageClick, initialIndex = 0, isModal = false }: ProductCarouselProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    useEffect(() => {
        if (swiperInstance && !swiperInstance.destroyed) {
            swiperInstance.slideTo(initialIndex, 0);
        }
    }, [initialIndex, swiperInstance]);

    return (
        <Box sx={{
            width: "100%",
            position: "relative",
            "& .swiper-pagination-bullet-active": {
                backgroundColor: "#ff0000"
            },
            "& .swiper-button-next, & .swiper-button-prev": {
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                "&:after": {
                    fontSize: 20
                },
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                }
            }
        }}>
            <Swiper
                onSwiper={setSwiperInstance}
                initialSlide={initialIndex}
                spaceBetween={10}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[Navigation, Pagination, Thumbs, FreeMode]}
                className="main-swiper"
                style={{
                    borderRadius: isModal ? 0 : 8,
                    overflow: "hidden"
                }}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            component="img"
                            sx={{
                                height: isModal ? "85vh" : { xs: 280, sm: 380, md: 500 },
                                display: "block",
                                width: "100%",
                                objectFit: "contain",
                                backgroundColor: isModal ? "transparent" : "#000",
                                cursor: onImageClick ? "pointer" : "default",
                            }}
                            src={image}
                            alt={`Product image ${index + 1}`}
                            onClick={() => onImageClick && onImageClick(index)}
                        />
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <IconButton
                    className="swiper-button-prev-custom"
                    sx={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                        // Swiper hides these if at start/end if we want, but we can just use normal props
                    }}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    className="swiper-button-next-custom"
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
                    }}
                >
                    <KeyboardArrowRight />
                </IconButton>
            </Swiper>

            {/* Thumbnails */}
            {!isModal && images.length > 1 && (
                <Box sx={{ mt: 2 }}>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={Math.min(images.length, 5)}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="thumbs-swiper"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} style={{ width: 'auto' }}>
                                <Box
                                    component="img"
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    sx={{
                                        height: { xs: 60, sm: 70, md: 80 },
                                        width: { xs: 60, sm: 70, md: 80 },
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: 1,
                                        border: "2px solid transparent",
                                        transition: "all 0.2s ease-in-out",
                                        "&.swiper-slide-thumb-active": {
                                            borderColor: "#ff0000",
                                        },
                                        opacity: 0.7,
                                        ".swiper-slide-thumb-active &": {
                                            opacity: 1,
                                            borderColor: "#ff0000",
                                        }
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            )}
        </Box>
    )
}

export default ProductCarousel
