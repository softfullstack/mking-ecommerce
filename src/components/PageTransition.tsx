import { useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Box } from "@mui/material"
import gsap from "gsap"

interface PageTransitionProps {
    children: React.ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
    const location = useLocation()
    const pageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (pageRef.current) {
                // Transición sutil: Un suave fade-in con un ligero deslizamiento hacia arriba
                gsap.fromTo(
                    pageRef.current,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
                )
            }
        })

        return () => ctx.revert()
    }, [location.pathname])

    return (
        <Box sx={{ position: "relative", minHeight: "100vh" }}>
            <Box ref={pageRef} sx={{ willChange: "transform, opacity" }}>
                {children}
            </Box>
        </Box>
    )
}

export default PageTransition
