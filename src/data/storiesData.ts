export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook';

export interface SocialStory {
  id: string;
  platform: SocialPlatform;
  author: string;
  handle: string;
  authorAvatar: string;
  title: string;
  caption: string;
  hashtags: string[];
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timeAgo: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  externalUrl: string;
  badgeText?: string;
  verified: boolean;
  ctaText?: string;
  productLink?: string;
  durationSeconds?: number;
}

export interface PlatformProfile {
  platform: SocialPlatform;
  name: string;
  handle: string;
  url: string;
  avatar: string;
  followers: string;
  description: string;
  storiesCount: number;
  gradient: string;
  color: string;
}

export const PLATFORM_PROFILES: Record<SocialPlatform, PlatformProfile> = {
  instagram: {
    platform: 'instagram',
    name: 'MKing Maquila & Chalecos',
    handle: '@maquilaking',
    url: 'https://www.instagram.com/maquilaking/',
    avatar: '/images/logo.png',
    followers: '15.4K',
    description: 'Fábrica de chalecos de seguridad industrial, brigadista y maquila textil en Guadalajara, Jal.',
    storiesCount: 3,
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    color: '#E1306C',
  },
  tiktok: {
    platform: 'tiktok',
    name: 'MKing Seguridad & Maquila',
    handle: '@maquilaking',
    url: 'https://www.tiktok.com/@maquilaking',
    avatar: '/images/logo.png',
    followers: '28.9K',
    description: 'Procesos de confección, pruebas de resistencia y detrás de cámaras en planta.',
    storiesCount: 3,
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 30%, #ff0844 70%, #ff4e50 100%)',
    color: '#00F2FE',
  },
  facebook: {
    platform: 'facebook',
    name: 'MKing Fábrica de Chalecos',
    handle: '@maquila.king',
    url: 'https://www.facebook.com/maquila.king',
    avatar: '/images/logo.png',
    followers: '22.1K',
    description: 'Venta de mayoreo, pedidos personalizados con bordado y envíos a todo México.',
    storiesCount: 3,
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0052cc 100%)',
    color: '#1877F2',
  },
};

export const RECENT_STORIES: SocialStory[] = [
  // INSTAGRAM STORIES
  {
    id: 'ig-1',
    platform: 'instagram',
    author: 'MKing Maquila & Chalecos',
    handle: '@maquilaking',
    authorAvatar: '/images/logo.png',
    title: 'Chamarra Bicolor con Reflejantes',
    caption: '¡Nuevo lote listo! Diseñado para supervisores y brigadistas. Bandas reflejantes de alta visibilidad para máxima protección día y noche.',
    hashtags: ['#MKing', '#ChalecoEjecutivo', '#SeguridadIndustrial', '#Guadalajara', '#HechoEnMexico'],
    mediaUrl: '/images/stories/story_instagram.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 45m',
    views: '14.8K',
    likes: '1,420',
    comments: '89',
    shares: '312',
    externalUrl: 'https://www.instagram.com/maquilaking/',
    badgeText: 'NUEVO MODELO',
    verified: true,
    ctaText: 'Ver en Instagram',
    productLink: '/productos',
    durationSeconds: 6,
  },
  {
    id: 'ig-2',
    platform: 'instagram',
    author: 'MKing Maquila & Chalecos',
    handle: '@maquilaking',
    authorAvatar: '/images/logo.png',
    title: 'Detalle de Costura & Malla Transpirable',
    caption: 'Comodidad total en jornadas largas. Nuestra malla en espalda evita el calor acumulado sin perder resistencia industrial.',
    hashtags: ['#MKingChalecos', '#Ergonomia', '#SeguridadLaboral', '#EPP'],
    mediaUrl: '/images/feature.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 3h',
    views: '9.2K',
    likes: '840',
    comments: '42',
    shares: '128',
    externalUrl: 'https://www.instagram.com/maquilaking/',
    badgeText: 'DETALLES',
    verified: true,
    ctaText: 'Ver en Instagram',
    productLink: '/novedades',
    durationSeconds: 6,
  },
  {
    id: 'ig-3',
    platform: 'instagram',
    author: 'MKing Maquila & Chalecos',
    handle: '@maquilaking',
    authorAvatar: '/images/logo.png',
    title: 'Prueba de Visibilidad en Oscuridad',
    caption: '¿Sabías que nuestras cintas reflejantes superan la norma ANSI/ISEA 107? Mira el brillo directo con luz de vehículo.',
    hashtags: ['#Reflejante3M', '#VisibilidadTotal', '#ProteccionCivil'],
    mediaUrl: '/images/chaleco-interactivo.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 7h',
    views: '21.5K',
    likes: '2,890',
    comments: '164',
    shares: '560',
    externalUrl: 'https://www.instagram.com/maquilaking/',
    badgeText: 'TEST 3M',
    verified: true,
    ctaText: 'Ver en Instagram',
    productLink: '/productos',
    durationSeconds: 6,
  },

  // TIKTOK STORIES / REELS
  {
    id: 'tt-1',
    platform: 'tiktok',
    author: 'MKing Seguridad & Maquila',
    handle: '@maquilaking',
    authorAvatar: '/images/logo.png',
    title: '¡Así cosemos las cintas reflejantes reforzadas!',
    caption: 'Doble costura industrial con hilo de alta tenacidad. Calidad que no se rompe ni se deshilacha en obra. ¡Orgullosamente mexicanos!',
    hashtags: ['#TikTokIndustrial', '#FabricaMexico', '#CosturaIndustrial', '#AprendeEnTikTok'],
    mediaUrl: '/images/stories/story_tiktok.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 1h',
    views: '48.9K',
    likes: '4,650',
    comments: '310',
    shares: '1,120',
    externalUrl: 'https://www.tiktok.com/@maquilaking',
    badgeText: 'TENDENCIA',
    verified: true,
    ctaText: 'Ver en TikTok',
    productLink: '/nosotros',
    durationSeconds: 6,
  },
  {
    id: 'tt-2',
    platform: 'tiktok',
    author: 'MKing Seguridad & Maquila',
    handle: '@maquilaking',
    authorAvatar: '/images/logo.png',
    title: 'Tour rápido por nuestra planta en Guadalajara 🏭',
    caption: 'Más de 10,000 prendas producidas mensualmente. Conoce a los artesanos detrás de cada chaleco de seguridad que llega a tu empresa.',
    hashtags: ['#BehindTheScenes', '#MKingFactory', '#GuadalajaraJalisco', '#MadeInMexico'],
    mediaUrl: '/images/about-hero.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 4h',
    views: '32.1K',
    likes: '2,980',
    comments: '185',
    shares: '430',
    externalUrl: 'https://www.tiktok.com/@maquilaking',
    badgeText: 'PLANTA EN VIVO',
    verified: true,
    ctaText: 'Ver en TikTok',
    productLink: '/nosotros',
    durationSeconds: 6,
  },
  {
    id: 'tt-3',
    platform: 'tiktok',
    author: 'MKing Seguridad & Maquila',
    handle: '@maquilaking',
    authorAvatar: '/images/logo.png',
    title: 'Prueba de resistencia: ¿Cuánto peso aguanta un bolsillo?',
    caption: 'Radios, libretas, herramientas pesadas y celulares grandes. Pusimos a prueba el bolsillo táctico reforzado con remaches.',
    hashtags: ['#PruebaDeFuerza', '#ChalecoMinero', '#Construccion', '#Seguridad'],
    mediaUrl: '/images/home_2.jpeg',
    mediaType: 'image',
    timeAgo: 'Ayer',
    views: '67.4K',
    likes: '6,120',
    comments: '412',
    shares: '1,890',
    externalUrl: 'https://www.tiktok.com/@maquilaking',
    badgeText: 'VIRAL',
    verified: true,
    ctaText: 'Ver en TikTok',
    productLink: '/productos',
    durationSeconds: 6,
  },

  // FACEBOOK STORIES / POSTS
  {
    id: 'fb-1',
    platform: 'facebook',
    author: 'MKing Fábrica de Chalecos',
    handle: '@maquila.king',
    authorAvatar: '/images/logo.png',
    title: 'Despacho corporativo de 500 chalecos bordados',
    caption: 'Pedido especial para empresa de logística internacional en Monterrey. Bordados en hilo de poliéster de alta definición que resiste lavadas industriales.',
    hashtags: ['#MKingMayoristas', '#BordadoIndustrial', '#Logistica', '#Flotillas'],
    mediaUrl: '/images/stories/story_facebook.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 2h',
    views: '11.3K',
    likes: '960',
    comments: '73',
    shares: '184',
    externalUrl: 'https://www.facebook.com/maquila.king',
    badgeText: 'PEDIDO ESPECIAL',
    verified: true,
    ctaText: 'Ver en Facebook',
    productLink: '/descuentos',
    durationSeconds: 6,
  },
  {
    id: 'fb-2',
    platform: 'facebook',
    author: 'MKing Fábrica de Chalecos',
    handle: '@maquila.king',
    authorAvatar: '/images/logo.png',
    title: 'Convenio con constructoras y plantas industriales',
    caption: '¿Requieres chalecos para más de 50 trabajadores? Aprovecha nuestros precios escalonados de fabricante directo sin intermediarios.',
    hashtags: ['#DescuentosEmpresas', '#PreciosMayoreo', '#FabricantesDirectos'],
    mediaUrl: '/images/home.jpeg',
    mediaType: 'image',
    timeAgo: 'Hace 5h',
    views: '8.7K',
    likes: '710',
    comments: '58',
    shares: '92',
    externalUrl: 'https://www.facebook.com/maquila.king',
    badgeText: 'EMPRESAS',
    verified: true,
    ctaText: 'Ver en Facebook',
    productLink: '/descuentos',
    durationSeconds: 6,
  },
  {
    id: 'fb-3',
    platform: 'facebook',
    author: 'MKing Fábrica de Chalecos',
    handle: '@maquila.king',
    authorAvatar: '/images/logo.png',
    title: 'Envíos asegurados a todo el territorio nacional',
    caption: 'Garantizamos los tiempos de entrega más ágiles del mercado. Cotiza tu pedido hoy mismo con atención personalizada vía WhatsApp.',
    hashtags: ['#EnviosMexico', '#Guadalajara', '#EmpresaMexicana'],
    mediaUrl: '/images/home_3.jpeg',
    mediaType: 'image',
    timeAgo: 'Ayer',
    views: '15.6K',
    likes: '1,340',
    comments: '91',
    shares: '215',
    externalUrl: 'https://www.facebook.com/maquila.king',
    badgeText: 'COBERTURA',
    verified: true,
    ctaText: 'Ver en Facebook',
    productLink: '/contacto',
    durationSeconds: 6,
  },
];
