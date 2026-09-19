import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button,
  SvgIcon,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  OpenInNew as OpenInNewIcon,
  CheckCircle as VerifiedIcon,
  Facebook,
  Instagram,
  WhatsApp,
  Share as ShareIcon,
} from '@mui/icons-material';
import { SocialStory, PLATFORM_PROFILES } from '../../data/storiesData';

const TikTokIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.35-2.85 5.74-1.8 1.48-4.24 2.1-6.49 1.52-2.18-.54-4.04-2.1-4.88-4.18C1.51 17.79 1.7 15.53 2.91 13.8c1.17-1.71 3.06-2.83 5.12-3.12 1.05-.15 2.13-.06 3.16.19v4.06c-.66-.17-1.36-.21-2.04-.1-.7.1-1.37.45-1.85.95-.51.52-.81 1.25-.83 1.99-.02.73.23 1.46.7 2.01.5.58 1.25.9 2.01.93.75.03 1.5-.22 2.08-.7.54-.46.88-1.11.96-1.8.03-.25.04-.51.04-.76V.02z" />
  </SvgIcon>
);

interface StoryViewerModalProps {
  open: boolean;
  onClose: () => void;
  stories: SocialStory[];
  initialIndex: number;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  open,
  onClose,
  stories,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);

  const currentStory = stories[currentIndex] || stories[0];
  const storyDurationMs = (currentStory?.durationSeconds || 6) * 1000;
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Sync initialIndex when modal opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setIsPaused(false);
      setHasLiked(false);
    }
  }, [open, initialIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setHasLiked(false);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setHasLiked(false);
    }
  }, [currentIndex]);

  // Timer loop for active story
  useEffect(() => {
    if (!open || !currentStory || isPaused) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentPct = Math.min((elapsed / storyDurationMs) * 100, 100);
      setProgress(currentPct);

      if (currentPct >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        handleNext();
      }
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [open, currentIndex, isPaused, storyDurationMs, handleNext, currentStory]);

  const togglePause = () => {
    if (!isPaused) {
      elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleNext, handlePrev, onClose, isPaused]);

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = 20 + Math.random() * 60; // percentage
    setReactions((prev) => [...prev, { id, emoji, left }]);

    if (emoji === '❤️') {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1800);
  };

  if (!currentStory) return null;

  const profile = PLATFORM_PROFILES[currentStory.platform];

  const getPlatformIcon = (platform: string, size = 18) => {
    switch (platform) {
      case 'instagram':
        return <Instagram sx={{ fontSize: size, color: '#fff' }} />;
      case 'tiktok':
        return <TikTokIcon sx={{ fontSize: size, color: '#fff' }} />;
      case 'facebook':
        return <Facebook sx={{ fontSize: size, color: '#fff' }} />;
      default:
        return null;
    }
  };

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: currentStory.title,
        text: currentStory.caption,
        url: currentStory.externalUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(currentStory.externalUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          m: { xs: 0, sm: 2 },
          height: { xs: '100%', sm: 'auto' },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(5, 5, 10, 0.92)',
          backdropFilter: 'blur(16px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: { xs: '100vw', sm: 440 },
          height: { xs: '100vh', sm: '88vh' },
          maxHeight: { sm: 840 },
        }}
      >
        {/* Prev Arrow (desktop) */}
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            left: -64,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
            '&.Mui-disabled': { opacity: 0.2, color: 'white' },
          }}
          size="large"
          aria-label="Historia anterior"
        >
          <PrevIcon fontSize="large" />
        </IconButton>

        {/* Story Phone Card Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: '#0a0a0c',
            borderRadius: { xs: 0, sm: 4 },
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(211, 47, 47, 0.25)',
            border: { xs: 'none', sm: '1px solid rgba(255, 255, 255, 0.12)' },
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none',
          }}
        >
          {/* Top Progress Bars Segmented */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              display: 'flex',
              gap: '4px',
              p: '10px 14px 6px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            }}
          >
            {stories.map((s, idx) => {
              let fillPct = 0;
              if (idx < currentIndex) fillPct = 100;
              else if (idx === currentIndex) fillPct = progress;

              return (
                <Box
                  key={s.id}
                  sx={{
                    flex: 1,
                    height: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${fillPct}%`,
                      height: '100%',
                      bgcolor: '#ffffff',
                      transition: idx === currentIndex && !isPaused ? 'width 50ms linear' : 'none',
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Story Header (Author, Time, Platform Badge, Controls) */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 0,
              right: 0,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
            }}
          >
            {/* Author info */}
            <Box
              component="a"
              href={currentStory.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                textDecoration: 'none',
                color: 'white',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  p: '2px',
                  borderRadius: '50%',
                  background: profile?.gradient || 'transparent',
                }}
              >
                <Avatar
                  src={currentStory.authorAvatar}
                  alt={currentStory.author}
                  sx={{ width: 36, height: 36, border: '2px solid #000' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    bgcolor: profile?.color || '#333',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #000',
                  }}
                >
                  {getPlatformIcon(currentStory.platform, 10)}
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.1 }}>
                    {currentStory.handle}
                  </Typography>
                  {currentStory.verified && (
                    <VerifiedIcon sx={{ fontSize: 14, color: '#3897f0' }} />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem' }}>
                  {currentStory.timeAgo} • {currentStory.views} vistas
                </Typography>
              </Box>
            </Box>

            {/* Header controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={togglePause}
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              >
                {isPaused ? <PlayIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsMuted(!isMuted)}
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                aria-label="Silenciar"
              >
                {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
              </IconButton>
              <IconButton
                size="small"
                onClick={onClose}
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                aria-label="Cerrar"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Story Visual Media */}
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              bgcolor: '#000',
            }}
          >
            <Box
              component="img"
              src={currentStory.mediaUrl}
              alt={currentStory.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isPaused ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />

            {/* Tap navigation hotzones: Left 30% prev, Right 70% next */}
            <Box
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                top: '70px',
                bottom: '160px',
                left: 0,
                width: '32%',
                zIndex: 15,
                cursor: 'pointer',
              }}
            />
            <Box
              onClick={handleNext}
              sx={{
                position: 'absolute',
                top: '70px',
                bottom: '160px',
                right: 0,
                width: '68%',
                zIndex: 15,
                cursor: 'pointer',
              }}
            />

            {/* Floating Reactions overlay */}
            {reactions.map((r) => (
              <Box
                key={r.id}
                sx={{
                  position: 'absolute',
                  bottom: 120,
                  left: `${r.left}%`,
                  fontSize: '2.5rem',
                  pointerEvents: 'none',
                  zIndex: 40,
                  animation: 'floatUp 1.8s forwards ease-out',
                  '@keyframes floatUp': {
                    '0%': { opacity: 1, transform: 'translateY(0) scale(0.6)' },
                    '50%': { opacity: 0.9, transform: 'translateY(-120px) scale(1.3) rotate(10deg)' },
                    '100%': { opacity: 0, transform: 'translateY(-240px) scale(1.6) rotate(-10deg)' },
                  },
                }}
              >
                {r.emoji}
              </Box>
            ))}

            {/* Bottom Gradient for Text Readability */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '52%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            />

            {/* Story Details (Bottom Overlay) */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, sm: 2.5 },
                zIndex: 25,
                color: 'white',
              }}
            >
              {/* Badge & Platform pill */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {currentStory.badgeText && (
                  <Chip
                    label={currentStory.badgeText}
                    size="small"
                    sx={{
                      bgcolor: '#D32F2F',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      letterSpacing: '0.5px',
                      height: 22,
                    }}
                  />
                )}
                <Chip
                  icon={getPlatformIcon(currentStory.platform, 13) || undefined}
                  label={currentStory.platform.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    backdropFilter: 'blur(6px)',
                    height: 22,
                  }}
                />
              </Box>

              {/* Title & Caption */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  lineHeight: 1.25,
                  mb: 0.8,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                {currentStory.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.8rem',
                  lineHeight: 1.35,
                  mb: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                }}
              >
                {currentStory.caption}
              </Typography>

              {/* Action Buttons: Open Official Network & Cotizar */}
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                <Button
                  component="a"
                  href={currentStory.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  size="small"
                  startIcon={getPlatformIcon(currentStory.platform, 16)}
                  endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    flex: 1,
                    py: 0.8,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    background: profile?.gradient || 'primary.main',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    '&:hover': {
                      filter: 'brightness(1.15)',
                    },
                  }}
                >
                  {currentStory.ctaText || `Ver en ${currentStory.platform}`}
                </Button>

                <Button
                  component="a"
                  href={`https://api.whatsapp.com/send?phone=523351146348&text=${encodeURIComponent(
                    `Hola MKing, vi su historia sobre "${currentStory.title}" y deseo más información.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  startIcon={<WhatsApp sx={{ color: '#25D366' }} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      borderColor: '#25D366',
                      bgcolor: 'rgba(37, 211, 102, 0.15)',
                    },
                  }}
                >
                  Cotizar
                </Button>
              </Box>

              {/* Live Reactions Bar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pt: 1,
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['❤️', '🔥', '👏', '🚀'].map((emoji) => (
                    <IconButton
                      key={emoji}
                      onClick={() => triggerReaction(emoji)}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        fontSize: '1.1rem',
                        p: '5px 8px',
                        borderRadius: '20px',
                        transition: 'transform 0.15s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.25)',
                          transform: 'scale(1.2)',
                        },
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={shareStory}
                    sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                    aria-label="Compartir"
                  >
                    <ShareIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                    {hasLiked ? `${parseInt(currentStory.likes.replace(/,/g, '')) + likesCount} likes` : `${currentStory.likes} likes`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Next Arrow (desktop) */}
        <IconButton
          onClick={handleNext}
          disabled={currentIndex === stories.length - 1}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            right: -64,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
            '&.Mui-disabled': { opacity: 0.2, color: 'white' },
          }}
          size="large"
          aria-label="Siguiente historia"
        >
          <NextIcon fontSize="large" />
        </IconButton>
      </Box>
    </Dialog>
  );
};
export default StoryViewerModal;
