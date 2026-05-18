import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Hotspot {
  id: string;
  /** Position as percentage of the image dimensions */
  x: number;
  y: number;
  title: string;
  description: string;
  /** Tooltip direction: which side of the hotspot the card appears */
  direction: 'left' | 'right';
  icon: string;
}

const hotspots: Hotspot[] = [
  {
    id: 'lapicero',
    x: 38,
    y: 38,
    title: 'Lapicero y Porta Celular',
    description: 'Incluye un práctico porta lapicero de acceso rápido y espacio seguro para tu celular.',
    direction: 'right',
    icon: '✏️',
  },
  {
    id: 'radio',
    x: 62,
    y: 35,
    title: 'Bolsillo con Cierre y Porta-Radio',
    description: 'Bolsillo discreto con cierre de gran capacidad. Incluye porta-radio con correa de seguridad.',
    direction: 'left',
    icon: '📻',
  },
  {
    id: 'reflejantes',
    x: 72,
    y: 22,
    title: 'Bandas Reflejantes',
    description: 'Bandas de reflejantes con alta visibilidad para máxima seguridad en condiciones de baja luz.',
    direction: 'left',
    icon: '💡',
  },
  {
    id: 'malla',
    x: 28,
    y: 55,
    title: 'Malla en Espalda',
    description: 'Malla en espalda para mayor transpiración. Incluye reflejantes de alta visibilidad.',
    direction: 'right',
    icon: '🌬️',
  },
  {
    id: 'bolsas',
    x: 70,
    y: 72,
    title: 'Bolsas Frontales',
    description: 'Dos bolsas grandes con cierre funcionales para guardar muchos objetos de trabajo.',
    direction: 'left',
    icon: '🧰',
  },
  {
    id: 'cierre',
    x: 50,
    y: 50,
    title: 'Cierre Central Resistente',
    description: 'Cierre central de metal con doble cursor para mayor durabilidad y facilidad de uso.',
    direction: 'right',
    icon: '🔗',
  },
];

const InteractiveVest = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const vestRef = useRef<HTMLDivElement>(null);
  const hotspotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Animate vest image
      if (vestRef.current) {
        gsap.fromTo(
          vestRef.current,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: vestRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Animate hotspots pulsating entrance
      hotspotsRef.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              delay: 0.8 + i * 0.15,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // Continuous pulse animation for hotspot dots
  useEffect(() => {
    const pulseTimelines: gsap.core.Tween[] = [];
    hotspotsRef.current.forEach((el) => {
      if (el) {
        const pulseRing = el.querySelector('.pulse-ring');
        if (pulseRing) {
          const tween = gsap.to(pulseRing, {
            scale: 2.5,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            ease: 'power1.out',
          });
          pulseTimelines.push(tween);
        }
      }
    });
    return () => {
      pulseTimelines.forEach((t) => t.kill());
    };
  }, []);

  const handleHotspotEnter = (id: string) => {
    setActiveHotspot(id);
    // Animate the tooltip card in
    const tooltipEl = document.getElementById(`tooltip-${id}`);
    if (tooltipEl) {
      gsap.killTweensOf(tooltipEl);
      gsap.fromTo(
        tooltipEl,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  };

  const handleHotspotLeave = (id: string) => {
    const tooltipEl = document.getElementById(`tooltip-${id}`);
    if (tooltipEl) {
      gsap.to(tooltipEl, {
        opacity: 0,
        scale: 0.8,
        y: 10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setActiveHotspot((prev) => (prev === id ? null : prev)),
      });
    }
  };

  const handleHotspotToggle = (id: string) => {
    if (activeHotspot === id) {
      handleHotspotLeave(id);
    } else {
      // Close any open one first
      if (activeHotspot) {
        handleHotspotLeave(activeHotspot);
      }
      setTimeout(() => handleHotspotEnter(id), 100);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow effects */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,61,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section Title */}
      <Box ref={titleRef} sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: 'white',
            textTransform: 'uppercase',
            mt: 1,
            fontSize: { xs: '1.6rem', sm: '2.2rem', md: '3rem' },
            background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 50%, #ff3d00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Chaleco de Seguridad Industrial
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.55)',
            mt: 1,
            fontWeight: 400,
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Pasa el cursor sobre cada punto para descubrir las características de nuestro chaleco multifuncional
        </Typography>
      </Box>

      {/* Interactive Vest Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          maxWidth: 700,
          mx: 'auto',
        }}
      >
        {/* Vest Image */}
        <Box
          ref={vestRef}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: { xs: 340, sm: 450, md: 550 },
            mx: 'auto',
          }}
        >
          <Box
            component="img"
            src="/images/chaleco-interactivo.jpeg"
            alt="Chaleco de Seguridad Industrial MKing - Vista interactiva"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
              transition: 'filter 0.3s',
              borderRadius: '12px',
            }}
          />

          {/* Hotspot Dots */}
          {hotspots.map((spot, index) => (
            <Box
              key={spot.id}
              ref={(el: HTMLDivElement | null) => {
                hotspotsRef.current[index] = el;
              }}
              onMouseEnter={() => handleHotspotEnter(spot.id)}
              onMouseLeave={() => handleHotspotLeave(spot.id)}
              onClick={() => handleHotspotToggle(spot.id)}
              sx={{
                position: 'absolute',
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: activeHotspot === spot.id ? 20 : 10,
                '&:hover .hotspot-dot': {
                  background: '#ff3d00',
                  boxShadow: '0 0 20px rgba(255,61,0,0.6)',
                },
              }}
            >
              {/* Pulse ring animation */}
              <Box
                className="pulse-ring"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: 16, md: 20 },
                  height: { xs: 16, md: 20 },
                  borderRadius: '50%',
                  border: '2px solid rgba(255,61,0,0.6)',
                  pointerEvents: 'none',
                }}
              />

              {/* Dot */}
              <Box
                className="hotspot-dot"
                sx={{
                  width: { xs: 16, md: 20 },
                  height: { xs: 16, md: 20 },
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: '3px solid #ff3d00',
                  boxShadow: '0 0 12px rgba(255,61,0,0.4), inset 0 0 4px rgba(255,61,0,0.2)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 5, md: 6 },
                    height: { xs: 5, md: 6 },
                    borderRadius: '50%',
                    background: '#ff3d00',
                  },
                }}
              />

              {/* Tooltip Card */}
              <Box
                id={`tooltip-${spot.id}`}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  ...(spot.direction === 'left'
                    ? { right: { xs: 30, md: 40 } }
                    : { left: { xs: 30, md: 40 } }),
                  transform: 'translateY(-50%)',
                  width: { xs: 180, sm: 220, md: 260 },
                  background: 'linear-gradient(135deg, rgba(20,20,35,0.97) 0%, rgba(30,30,50,0.97) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  p: { xs: 1.5, md: 2 },
                  border: '1px solid rgba(255,61,0,0.3)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,61,0,0.1)',
                  opacity: 0,
                  pointerEvents: activeHotspot === spot.id ? 'auto' : 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    ...(spot.direction === 'left'
                      ? {
                        right: -8,
                        borderLeft: '8px solid rgba(255,61,0,0.3)',
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                      }
                      : {
                        left: -8,
                        borderRight: '8px solid rgba(255,61,0,0.3)',
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                      }),
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                  },
                }}
              >
                {/* Connector line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    ...(spot.direction === 'left'
                      ? { right: -30, width: 22 }
                      : { left: -30, width: 22 }),
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(255,61,0,0.6), rgba(255,61,0,0.1))',
                    transform: 'translateY(-50%)',
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.4rem' },
                      width: { xs: 28, md: 34 },
                      height: { xs: 28, md: 34 },
                      borderRadius: '10px',
                      background: 'rgba(255,61,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {spot.icon}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#ff3d00',
                      fontWeight: 800,
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem' },
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      lineHeight: 1.2,
                    }}
                  >
                    {spot.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.78rem' },
                    lineHeight: 1.5,
                    pl: { xs: 0, md: 0.5 },
                  }}
                >
                  {spot.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>


    </Box>
  );
};

export default InteractiveVest;
