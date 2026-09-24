import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Avatar, Tab, Tabs, IconButton, Tooltip, SvgIcon } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Facebook, Instagram, WhatsApp, OpenInNew as OpenInNewIcon, CheckCircle as VerifiedIcon, Visibility as VisibilityIcon, Favorite as FavoriteIcon, AutoAwesome as AutoAwesomeIcon, Campaign as CampaignIcon, } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { RECENT_STORIES, PLATFORM_PROFILES, SocialPlatform } from '../data/storiesData';
import StoryViewerModal from '../components/stories/StoryViewerModal';

const TikTokIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.35-2.85 5.74-1.8 1.48-4.24 2.1-6.49 1.52-2.18-.54-4.04-2.1-4.88-4.18C1.51 17.79 1.7 15.53 2.91 13.8c1.17-1.71 3.06-2.83 5.12-3.12 1.05-.15 2.13-.06 3.16.19v4.06c-.66-.17-1.36-.21-2.04-.1-.7.1-1.37.45-1.85.95-.51.52-.81 1.25-.83 1.99-.02.73.23 1.46.7 2.01.5.58 1.25.9 2.01.93.75.03 1.5-.22 2.08-.7.54-.46.88-1.11.96-1.8.03-.25.04-.51.04-.76V.02z" />
  </SvgIcon>
);

const Noticias = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | SocialPlatform>('all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Filtered stories according to tab
  const filteredStories =
    selectedTab === 'all'
      ? RECENT_STORIES
      : RECENT_STORIES.filter((s) => s.platform === selectedTab);

  const openStoryViewer = (storyId: string) => {
    const idx = RECENT_STORIES.findIndex((s) => s.id === storyId);
    if (idx !== -1) {
      setActiveStoryIndex(idx);
      setViewerOpen(true);
    }
  };

  const openStoryViewerByIndex = (index: number) => {
    setActiveStoryIndex(index);
    setViewerOpen(true);
  };

  const getPlatformIcon = (platform: SocialPlatform, size = 18) => {
    switch (platform) {
      case 'instagram':
        return <Instagram sx={{ fontSize: size }} />;
      case 'tiktok':
        return <TikTokIcon sx={{ fontSize: size }} />;
      case 'facebook':
        return <Facebook sx={{ fontSize: size }} />;
    }
  };

  return (
    <Box sx={{ bgcolor: '#0b0c10', color: '#ffffff', minHeight: '100vh', pb: 10 }}>
      <Helmet>
        <title>Noticias & Historias en Vivo | MKing Chalecos de Seguridad</title>
        <meta
          name="description"
          content="Sigue en tiempo real las historias recientes de MKing en Instagram, TikTok y Facebook: lanzamientos de chalecos de seguridad, procesos de maquila y pedidos especiales."
        />
        <link rel="canonical" href="https://mking.com.mx/noticias" />
        <meta property="og:title" content="Historias & Novedades de MKing en Redes Sociales" />
        <meta property="og:description" content="Historias y novedades recientes de MKing en Instagram, TikTok y Facebook." />
        <meta property="og:url" content="https://mking.com.mx/noticias" />
      </Helmet>

      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 6, md: 9 },
          background: 'radial-gradient(circle at 50% 10%, #200508 0%, #0b0c10 70%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Glow ambient effects */}
        <Container maxWidth="lg" sx={{ mt: 0, mb: 0 }}>
          <Box
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CampaignIcon sx={{ color: '#D32F2F', fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                Historias Activas
              </Typography>
              <Chip
                label="EN VIVO"
                size="small"
                sx={{
                  bgcolor: '#D32F2F',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  height: 20,
                  animation: 'pulse 1.8s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Toca una historia para verla en pantalla completa
            </Typography>
          </Box> */}

            {/* Stories row scroll */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 4 },
                overflowX: 'auto',
                py: 1,
                px: 1,
                // scrollbarWidth: 'thin',
                // '&::-webkit-scrollbar': { height: 6 },
                // '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3 },
              }}
            >
              {RECENT_STORIES.map((story, index) => {
                const profile = PLATFORM_PROFILES[story.platform];
                return (
                  <Box
                    key={story.id}
                    onClick={() => openStoryViewerByIndex(index)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      minWidth: { xs: 80, sm: 94 },
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.08)',
                      },
                    }}
                  >
                    {/* Avatar Ring */}
                    <Box
                      sx={{
                        position: 'relative',
                        p: '3px',
                        borderRadius: '50%',
                        background: profile.gradient,
                        boxShadow: `0 0 16px ${profile.color}50`,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        src={story.mediaUrl}
                        alt={story.title}
                        sx={{
                          width: { xs: 62, sm: 74 },
                          height: { xs: 62, sm: 74 },
                          border: '3px solid #0b0c10',
                          filter: 'contrast(1.05)',
                        }}
                      />
                      {/* Platform tiny badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: profile.color,
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #0b0c10',
                        }}
                      >
                        {getPlatformIcon(story.platform, 12)}
                      </Box>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.9)',
                        maxWidth: 84,
                        lineHeight: 1.2,
                      }}
                      noWrap
                    >
                      {story.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.65rem',
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {story.timeAgo}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            top: '-15%',
            left: '20%',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(211, 47, 47, 0.22) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '15%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* TOP STORIES TRAY (Instagram/Facebook Carousel Style) */}


      {/* PLATFORM FILTER TABS */}
      <Container maxWidth="lg" sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            pb: 1,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, val) => setSelectedTab(val)}
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              sx: {
                bgcolor:
                  selectedTab === 'instagram'
                    ? '#E1306C'
                    : selectedTab === 'tiktok'
                      ? '#00F2FE'
                      : selectedTab === 'facebook'
                        ? '#1877F2'
                        : '#D32F2F',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
            sx={{
              minHeight: 44,
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                textTransform: 'none',
                minWidth: { xs: 90, sm: 130 },
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-selected': {
                  color: '#ffffff',
                },
              },
            }}
          >
            <Tab
              value="all"
              label={`Todas (${RECENT_STORIES.length})`}
            />
            <Tab
              value="instagram"
              icon={<Instagram sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Instagram"
            />
            <Tab
              value="tiktok"
              icon={<TikTokIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="TikTok"
            />
            <Tab
              value="facebook"
              icon={<Facebook sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Facebook"
            />
          </Tabs>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', px: 1 }}>
            Mostrando <b>{filteredStories.length}</b> historias recientes
          </Typography>
        </Box>
      </Container>

      {/* STORIES CARDS GRID (9:16 VERTICAL ASPECT) */}
      <Container maxWidth="lg">
        <Grid container spacing={3.5}>
          {filteredStories.map((story) => {
            const profile = PLATFORM_PROFILES[story.platform];
            return (
              <Grid item xs={12} sm={6} md={4} key={story.id}>
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    bgcolor: '#14161d',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: profile.color,
                      boxShadow: `0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px ${profile.color}35`,
                      '& .story-media': {
                        transform: 'scale(1.06)',
                      },
                      '& .play-button-overlay': {
                        transform: 'scale(1.15)',
                        bgcolor: profile.color,
                      },
                    },
                  }}
                >
                  {/* Top Bar on Card */}
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'rgba(11, 12, 16, 0.9)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      zIndex: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Box
                        sx={{
                          p: '2px',
                          borderRadius: '50%',
                          background: profile.gradient,
                        }}
                      >
                        <Avatar
                          src={story.authorAvatar}
                          alt={story.author}
                          sx={{ width: 32, height: 32 }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', fontSize: '0.85rem' }}>
                            {story.handle}
                          </Typography>
                          {story.verified && (
                            <VerifiedIcon sx={{ fontSize: 14, color: '#3897f0' }} />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                          {story.timeAgo}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      icon={getPlatformIcon(story.platform, 13) || undefined}
                      label={story.platform.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 24,
                      }}
                    />
                  </Box>

                  {/* Story 9:16 Media Preview */}
                  <Box
                    onClick={() => openStoryViewer(story.id)}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '135%', // Tall story ratio
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: '#000',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={story.mediaUrl}
                      alt={story.title}
                      className="story-media"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                    />

                    {/* Badge top-left */}
                    {story.badgeText && (
                      <Chip
                        label={story.badgeText}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 14,
                          left: 14,
                          bgcolor: '#D32F2F',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                          zIndex: 2,
                        }}
                      />
                    )}

                    {/* Central Play Button Overlay */}
                    <Box
                      className="play-button-overlay"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
                        transition: 'all 0.3s ease',
                        zIndex: 2,
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 32, color: 'white', ml: 0.3 }} />
                    </Box>

                    {/* Stats pills on bottom of media */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.6,
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 14, color: '#fff' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'white', fontSize: '0.72rem' }}>
                          {story.views}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.6,
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        <FavoriteIcon sx={{ fontSize: 13, color: '#ff4d6d' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'white', fontSize: '0.72rem' }}>
                          {story.likes}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Dark gradient for text visibility */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '40%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                      }}
                    />
                  </Box>

                  {/* Card Content Description */}
                  <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: 'white',
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {story.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {story.caption}
                    </Typography>

                    {/* Hashtags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2.5 }}>
                      {story.hashtags.slice(0, 3).map((tag) => (
                        <Typography
                          key={tag}
                          variant="caption"
                          sx={{
                            color: profile.color,
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </Box>

                    {/* Bottom Actions */}
                    <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => openStoryViewer(story.id)}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                          bgcolor: '#D32F2F',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          textTransform: 'none',
                          borderRadius: 2,
                          py: 0.9,
                          '&:hover': {
                            bgcolor: '#b71c1c',
                          },
                        }}
                      >
                        Ver Historia
                      </Button>

                      <Tooltip title={`Abrir en ${story.platform}`}>
                        <IconButton
                          component="a"
                          href={story.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.08)',
                            color: 'white',
                            borderRadius: 2,
                            p: 1,
                            '&:hover': {
                              bgcolor: profile.color,
                              color: '#fff',
                            },
                          }}
                        >
                          <OpenInNewIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* CHANNELS QUICK ACTION CARDS */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: 5 }}>
        <Grid container spacing={2.5} justifyContent="center">
          {/* Instagram */}
          <Grid item xs={12} sm={4}>
            <Box
              component="a"
              href={PLATFORM_PROFILES.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2.2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(225, 48, 108, 0.25)',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(225, 48, 108, 0.12)',
                  borderColor: '#E1306C',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(225, 48, 108, 0.25)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: PLATFORM_PROFILES.instagram.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(225, 48, 108, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Instagram sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem' }} noWrap>
                    Instagram
                  </Typography>
                  <VerifiedIcon sx={{ fontSize: 15, color: '#3897f0' }} />
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }} noWrap>
                  {PLATFORM_PROFILES.instagram.handle}
                </Typography>
              </Box>
              <Chip
                label="Seguir"
                size="small"
                sx={{
                  bgcolor: '#E1306C',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 26,
                }}
              />
            </Box>
          </Grid>

          {/* TikTok */}
          <Grid item xs={12} sm={4}>
            <Box
              component="a"
              href={PLATFORM_PROFILES.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2.2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 242, 254, 0.12)',
                  borderColor: '#00F2FE',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0, 242, 254, 0.25)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#000',
                  border: '2px solid #00F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 242, 254, 0.35)',
                  flexShrink: 0,
                }}
              >
                <TikTokIcon sx={{ color: '#00F2FE', fontSize: 26 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem' }} noWrap>
                    TikTok
                  </Typography>
                  <VerifiedIcon sx={{ fontSize: 15, color: '#3897f0' }} />
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }} noWrap>
                  {PLATFORM_PROFILES.tiktok.handle}
                </Typography>
              </Box>
              <Chip
                label="Seguir"
                size="small"
                sx={{
                  bgcolor: '#00F2FE',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  height: 26,
                }}
              />
            </Box>
          </Grid>

          {/* Facebook */}
          <Grid item xs={12} sm={4}>
            <Box
              component="a"
              href={PLATFORM_PROFILES.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2.2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(24, 119, 242, 0.25)',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(24, 119, 242, 0.12)',
                  borderColor: '#1877F2',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(24, 119, 242, 0.25)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: PLATFORM_PROFILES.facebook.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(24, 119, 242, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Facebook sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem' }} noWrap>
                    Facebook
                  </Typography>
                  <VerifiedIcon sx={{ fontSize: 15, color: '#3897f0' }} />
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }} noWrap>
                  {PLATFORM_PROFILES.facebook.handle}
                </Typography>
              </Box>
              <Chip
                label="Seguir"
                size="small"
                sx={{
                  bgcolor: '#1877F2',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 26,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* OFFICIAL CHANNELS EMBED / FOLLOW BANNER */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.15) 0%, rgba(20, 22, 29, 0.9) 100%)',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5, fontSize: { xs: '1.25rem', md: '1.6rem' } }}>
              ¿Quieres contenido exclusivo o cotizaciones en mayoreo?
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              Síguenos en nuestras 3 redes oficiales para enterarte de nuevos lotes, descuentos especiales para empresas y demostraciones de resistencia de nuestros chalecos de seguridad industrial.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              component="a"
              href={PLATFORM_PROFILES.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<Instagram />}
              sx={{
                background: PLATFORM_PROFILES.instagram.gradient,
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 3,
                px: 2.5,
                py: 1,
              }}
            >
              Instagram
            </Button>

            <Button
              component="a"
              href={PLATFORM_PROFILES.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<TikTokIcon />}
              sx={{
                bgcolor: '#00F2FE',
                color: '#000',
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 3,
                px: 2.5,
                py: 1,
                '&:hover': { bgcolor: '#4facfe' },
              }}
            >
              TikTok
            </Button>

            <Button
              component="a"
              href={PLATFORM_PROFILES.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<Facebook />}
              sx={{
                bgcolor: '#1877F2',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 3,
                px: 2.5,
                py: 1,
                '&:hover': { bgcolor: '#0052cc' },
              }}
            >
              Facebook
            </Button>

            <Button
              component="a"
              href="https://api.whatsapp.com/send?phone=523351146348&text=Hola%20MKing%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20chalecos"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<WhatsApp sx={{ color: '#25D366' }} />}
              sx={{
                color: 'white',
                borderColor: '#25D366',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 3,
                px: 2.5,
                py: 1,
                '&:hover': {
                  borderColor: '#25D366',
                  bgcolor: 'rgba(37, 211, 102, 0.1)',
                },
              }}
            >
              WhatsApp
            </Button>
          </Box>
        </Box>
      </Container>

      <Container sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 4 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ color: '#ffb703 !important', fontSize: 16 }} />}
            label="REDES SOCIALES OFICIALES"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 183, 3, 0.12)',
              color: '#ffb703',
              border: '1px solid rgba(255, 183, 3, 0.3)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: 1,
              mb: 2,
              px: 1,
            }}
          />

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
              lineHeight: 1.15,
              mb: 2,
              background: 'linear-gradient(180deg, #FFFFFF 30%, #A0AEC0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Historias Recientes & Novedades
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: { xs: '0.95rem', md: '1.15rem' },
              lineHeight: 1.6,
              maxWidth: 680,
              mx: 'auto',
            }}
          >
            Conoce el día a día de nuestra fábrica de chalecos de seguridad en Guadalajara.
            Lanzamientos, pruebas de reflectividad, procesos de confección y pedidos de empresas.
          </Typography>
        </Box>
      </Container>

      {/* STORY VIEWER MODAL */}
      <StoryViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        stories={RECENT_STORIES}
        initialIndex={activeStoryIndex}
      />
    </Box>
  );
};

export default Noticias;
