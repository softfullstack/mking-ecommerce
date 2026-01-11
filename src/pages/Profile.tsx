import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Box, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, TextField, Chip, Card, CardContent, CardMedia, CardActions, Divider, IconButton, useMediaQuery, Stack, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import useCartStore from '../store/CartStore';
import { GetMeService, DeleteFavoriteService } from '../services/MKing.service';
import { toast } from 'react-toastify';
import { showCartToast } from '../utils/toastUtils';

// --- DATOS DE EJEMPLO (MOCK DATA) ---
const MOCK_ORDERS = [
  { id: '#ORD-7829', date: '10 Ene 2024', total: '$1,250.00', status: 'Entregado', color: 'success' as const, items: 3 },
  { id: '#ORD-8821', date: '15 Feb 2024', total: '$450.50', status: 'En camino', color: 'primary' as const, items: 1 },
  { id: '#ORD-9002', date: '20 Feb 2024', total: '$2,100.00', status: 'Procesando', color: 'warning' as const, items: 4 },
];



const MOCK_ADDRESSES = [
  { id: 1, name: 'Casa', address: 'Av. Reforma 123, Depto 4B', city: 'Ciudad de México, CDMX', zip: '06600', default: true },
  { id: 2, name: 'Oficina', address: 'Blvd. Kukulcán Km 12', city: 'Cancún, QROO', zip: '77500', default: false },
];

// --- COMPONENTES DE SECCIONES ---

const ProfileSection = () => {
  const { user } = useAuthStore();
  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h5" gutterBottom>Información Personal</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Actualiza tu información personal y detalles de contacto.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Nombre" defaultValue={user?.name || ''} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Apellidos" defaultValue={user?.last_name || ''} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Correo Electrónico" defaultValue={user?.email || ''} variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Cambiar Contraseña</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="password" label="Contraseña Actual" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="password" label="Nueva Contraseña" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            Guardar Cambios
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const OrdersSection = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Mis Pedidos</Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      Historial de tus compras recientes.
    </Typography>

    <Stack spacing={2}>
      {MOCK_ORDERS.map((order) => (
        <Paper key={order.id} variant="outlined" sx={{ p: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={2}>
              <Box sx={{ bgcolor: 'background.default', p: 1, borderRadius: 1, textAlign: 'center' }}>
                <InventoryIcon sx={{ color: 'text.secondary' }} />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">{order.id}</Typography>
              <Typography variant="caption" color="text.secondary">{order.date}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Total</Typography>
              <Typography variant="body2" fontWeight="bold">{order.total}</Typography>
              <Typography variant="caption" color="text.secondary">{order.items} artículos</Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Chip
                label={order.status}
                color={order.color}
                size="small"
                variant={order.status === 'Entregado' ? 'filled' : 'outlined'}
              />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
              <Button size="small" variant="text">Ver Detalles</Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  </Box>
);

const FavoritesSection = () => {
  const { user, toggleFavoriteAction } = useAuthStore();
  const { addToCart } = useCartStore();
  const favorites = user?.favorites || [];

  const handleRemoveFavorite = async (productId: number, product: any) => {
    try {
      await DeleteFavoriteService(productId);
      toggleFavoriteAction(product);
      toast.success('Eliminado de favoritos');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Error al eliminar de favoritos');
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    showCartToast(product);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Mis Favoritos</Typography>
      {favorites.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Aún no tienes productos favoritos.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((fav: any) => (
            <Grid item key={fav.id} xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={(() => {
                    if (fav.images && fav.images.length > 0) {
                      const primaryImage = fav.images.find((img: any) => img.is_primary);
                      const imageToUse = primaryImage || fav.images[0];
                      return imageToUse.url || imageToUse.image_path;
                    }
                    return fav.img_product || 'https://via.placeholder.com/300';
                  })()}
                  alt={fav.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="subtitle2" component="div" noWrap title={fav.name} sx={{ fontWeight: '600', mb: 0.5 }}>
                    {fav.name}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: '700' }}>
                    ${fav.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 1, pt: 0, justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ flexGrow: 1, mr: 1, fontSize: '0.75rem', py: 0.5 }}
                    onClick={() => handleAddToCart(fav)}
                  >
                    Agregar
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ bgcolor: 'rgba(211, 47, 47, 0.05)' }}
                    onClick={() => handleRemoveFavorite(fav.id, fav)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const AddressesSection = () => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5">Mis Direcciones</Typography>
      <Button variant="outlined" startIcon={<LocationOnIcon />}>
        Nueva Dirección
      </Button>
    </Box>

    <Grid container spacing={3}>
      {MOCK_ADDRESSES.map((addr) => (
        <Grid item key={addr.id} xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, position: 'relative', height: '100%' }}>
            {addr.default && (
              <Chip
                label="Predeterminada"
                color="primary"
                size="small"
                sx={{ position: 'absolute', top: 16, right: 16 }}
              />
            )}
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6">{addr.name}</Typography>
            </Box>
            <Typography variant="body1" paragraph>{addr.address}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {addr.city}, CP: {addr.zip}
            </Typography>
            <Box mt={2} display="flex" gap={1}>
              <Button size="small" startIcon={<EditIcon />}>Editar</Button>
              <Button size="small" color="error" startIcon={<DeleteIcon />}>Eliminar</Button>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// --- COMPONENTE PRINCIPAL ---

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'perfil';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user, login, logout } = useAuthStore();

  // Sync activeTab state with URL search param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Sesión cerrada correctamente');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await GetMeService();
        login(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If error is 401, maybe logout
        // logout(); 
      } finally {
        // Fin de carga
      }
    };

    fetchUser();
  }, [login]);

  const menuItems = [
    { id: 'perfil', label: 'Mi Perfil', icon: <PersonIcon /> },
    { id: 'pedidos', label: 'Mis Pedidos', icon: <ShoppingBagIcon /> },
    { id: 'favoritos', label: 'Favoritos', icon: <FavoriteIcon /> },
    { id: 'direcciones', label: 'Direcciones', icon: <LocationOnIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil': return <ProfileSection />;
      case 'pedidos': return <OrdersSection />;
      case 'favoritos': return <FavoritesSection />;
      case 'direcciones': return <AddressesSection />;
      default: return <ProfileSection />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '80vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* Sidebar de Navegación */}
          <Grid item xs={12} md={3} >
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Box position="relative">
                  <Avatar
                    src={user?.image || ''}
                    alt={user?.name || 'User'}
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: -5,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" color="text.primary">{user?.name || 'Usuario'}</Typography>
              </Box>

              <List component="nav" disablePadding sx={{ display: { xs: 'none', md: 'block' } }}>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeTab === item.id}
                      onClick={() => handleTabChange(item.id)}
                      sx={{
                        borderRadius: 2,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(255, 0, 0, 0.1)', // Primary alpha
                          color: 'primary.main',
                          '& .MuiListItemIcon-root': { color: 'primary.main' }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeTab === item.id ? 600 : 400 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Área de Contenido Dinámico */}
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, minHeight: 500, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              {renderContent()}
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
