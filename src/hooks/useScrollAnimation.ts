import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type AnimationType = "fadeUp" | "fadeLeft" | "fadeRight" | "scaleIn" | "staggerUp"

interface UseScrollAnimationOptions {
    type?: AnimationType
    delay?: number
    duration?: number
    staggerDelay?: number
    triggerStart?: string
}

export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
) => {
    const ref = useRef<T>(null)
    const {
        type = "fadeUp",
        delay = 0,
        duration = 0.8,
        triggerStart = "top 85%",
    } = options

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const ctx = gsap.context(() => {
            const baseConfig = {
                scrollTrigger: {
                    trigger: el,
                    start: triggerStart,
                    toggleActions: "play none none none",
                },
                delay,
                duration,
                ease: "power3.out",
            }

            switch (type) {
                case "fadeUp":
                    gsap.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ...baseConfig })
                    break
                case "fadeLeft":
                    gsap.fromTo(el, { opacity: 0, x: -60 }, { opacity: 1, x: 0, ...baseConfig })
                    break
                case "fadeRight":
                    gsap.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, ...baseConfig })
                    break
                case "scaleIn":
                    gsap.fromTo(el, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, ...baseConfig })
                    break
                case "staggerUp":
                    gsap.fromTo(
                        el.children,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.15,
                            ...baseConfig,
                        }
                    )
                    break
            }
        })

        return () => ctx.revert()
    }, [type, delay, duration, triggerStart])

    return ref
}

export default useScrollAnimation
