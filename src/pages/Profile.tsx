import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Box, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, TextField, Chip, Card, CardContent, CardMedia, CardActions, Divider, IconButton, Stack } from '@mui/material';
import AddressDialog from '../components/AddressDialog';
import SizeSelectionDialog from '../components/SizeSelectionDialog';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, MenuItem } from '@mui/material';
import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import useCartStore from '../store/CartStore';
import { GetMeService, DeleteFavoriteService, GetOrdersService, UpdateProfileService, GetRegimenFiscalService, GetCfdisService, GetAddressesService, CreateAddressService, UpdateAddressService, DeleteAddressService } from '../services/MKing.service';
import { toast } from 'react-toastify';
import { showCartToast } from '../utils/toastUtils';
import { getPreferredIdentifier } from '../utils/uuidUtils';



// --- COMPONENTES DE SECCIONES ---

const ProfileSection = () => {
  const { user, login } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Catalogs state
  const [regimens, setRegimens] = useState<any[]>([]);
  const [allCfdis, setAllCfdis] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    phone: '',
    rfc: '',
    businessName: '',
    taxRegime: '',
    cfdiUse: '',
    personType: 'persona fisica',
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    neighborhood: '',
    municipality: '',
    state: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);

  // Filter Regimens based on CFDI Use
  const selectedCfdiCode = formData.cfdiUse;
  const filteredRegimens = regimens.filter(regimen => {
    if (!selectedCfdiCode) return true; // If no CFDI use is selected, show all regimens
    const selectedCfdi = allCfdis.find(c => c.code === selectedCfdiCode);
    if (!selectedCfdi || !selectedCfdi.regimen_fiscal_receptor) return true; // If CFDI not found or no receptor info, show all
    const allowedRegimens = selectedCfdi.regimen_fiscal_receptor.split(',').map((r: string) => r.trim());
    return allowedRegimens.includes(regimen.code);
  });

  // Fetch Catalogs
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [regimenRes, cfdiRes] = await Promise.all([
          GetRegimenFiscalService(),
          GetCfdisService()
        ]);
        setRegimens(regimenRes.data);
        setAllCfdis(cfdiRes.data);
      } catch (error) {
        console.error("Error loading catalogs", error);
      }
    };
    fetchCatalogs();
  }, []);

  // Update effect in case user data loads late
  useEffect(() => {
    if (user) {
      // @ts-ignore
      const detailsArray = user.client_details || user.clientDetails;
      const details = detailsArray && detailsArray.length > 0 ? detailsArray[0] : {};

      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        lastName: user.last_name || (user as any).lastName || '',
        email: user.email || '',
        phone: details.phone || '',
        rfc: details.rfc || '',
        businessName: details.businessName || details.business_name || '',
        taxRegime: details.taxRegime || details.tax_regime || '',
        cfdiUse: details.cfdiUse || details.cfdi_use || '',
        personType: details.personType || details.person_type || 'persona fisica',
        street: details.street || '',
        exteriorNumber: details.exteriorNumber || details.exterior_number || '',
        interiorNumber: details.interiorNumber || details.interior_number || '',
        neighborhood: details.neighborhood || '',
        municipality: details.municipality || '',
        state: details.state || '',
        postalCode: details.postalCode || details.postal_code || ''
      }));

      if (user.image) {
        // If image is full URL or needs constructing, handling here.
        // Assuming backend sends correct URL or path.
        const imgUrl = user.image.startsWith('http') ? user.image : `${import.meta.env.VITE_AWS_URL || 'https://mking-ecommerce.s3.us-east-2.amazonaws.com/ecommerce'}/${user.image}`;
        setImagePreview(imgUrl);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      // Append simple fields
      Object.keys(formData).forEach(key => {
        // @ts-ignore
        data.append(key, formData[key]);
      });

      // Append image if selected
      if (selectedImage) {
        data.append('image', selectedImage);
      }

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          toast.error('Debes ingresar tu contraseña actual para cambiarla');
          setLoading(false);
          return;
        }
      }

      // @ts-ignore - UpdateProfileService likely expects JSON by default if just checking types, but axios handles FormData fine
      const response = await UpdateProfileService(data);

      toast.success(response.data.message || 'Perfil actualizado correctamente');

      // Update global store
      if (response.data.user) {
        login(response.data.user);
      }

      // Clear passwords
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));

    } catch (error: any) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderTextField = (label: string, name: string, type: string = 'text') => (
    <Grid item xs={12} sm={6} md={6}>
      <TextField
        fullWidth
        label={label}
        name={name}
        // @ts-ignore
        value={formData[name]}
        onChange={handleChange as any}
        variant="outlined"
        size="small"
        type={type}
      />
    </Grid>
  );

  return (
    <Box component="form" noValidate autoComplete="off">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageChange}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>Información Personal</Typography>

        {/* Image Upload Button Trigger */}
        <Button
          variant="outlined"
          startIcon={<PhotoCameraIcon />}
          onClick={handleTriggerFileSelect}
          size="small"
        >
          Cambiar Foto
        </Button>
      </Box>

      {imagePreview && (
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar src={imagePreview} sx={{ width: 100, height: 100 }} />
        </Box>
      )}

      <Typography variant="body2" color="text.secondary" paragraph>
        Actualiza tu información personal y detalles de contacto.
      </Typography>

      <Grid container spacing={2}>
        {renderTextField("Nombre", "name")}
        {renderTextField("Apellidos", "lastName")}
        {renderTextField("Correo Electrónico", "email", "email")}
        {renderTextField("Teléfono", "phone")}

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Cambiar Contraseña</Typography>
        </Grid>
        {renderTextField("Contraseña Actual", "currentPassword", "password")}
        {renderTextField("Nueva Contraseña", "newPassword", "password")}
      </Grid>

      {/* DETALLES FISCALES */}
      <Accordion sx={{ mt: 3, bgcolor: 'background.paper' }} variant="outlined">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Detalles Fiscales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Persona"
                name="personType"
                value={formData.personType}
                onChange={handleChange as any}
                size="small"
              >
                <MenuItem value="persona fisica">Persona Física</MenuItem>
                <MenuItem value="persona moral">Persona Moral</MenuItem>
              </TextField>
            </Grid>
            {renderTextField("RFC", "rfc")}
            {renderTextField("Razón Social / Nombre Fiscal", "businessName")}

            {/* CFDI USE SELECT */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Uso de CFDI"
                name="cfdiUse"
                value={formData.cfdiUse}
                onChange={handleChange as any}
                size="small"
              >
                {allCfdis.map((item) => (
                  <MenuItem key={item.id} value={item.code}>
                    {item.code} - {item.description}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* TAX REGIME SELECT */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Régimen Fiscal"
                name="taxRegime"
                value={formData.taxRegime}
                onChange={handleChange as any}
                size="small"
                disabled={!selectedCfdiCode}
              >
                {filteredRegimens.map((item) => (
                  <MenuItem key={item.id} value={item.code}>
                    {item.code} - {item.description}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* DIRECCIÓN PRINCIPAL */}
      <Accordion sx={{ mt: 1, bgcolor: 'background.paper' }} variant="outlined">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Dirección Principal (Facturación)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {renderTextField("Calle", "street")}
            {renderTextField("No. Exterior", "exteriorNumber")}
            {renderTextField("No. Interior", "interiorNumber")}
            {renderTextField("Colonia", "neighborhood")}
            {renderTextField("Municipio / Alcaldía", "municipality")}
            {renderTextField("Estado", "state")}
            {renderTextField("Código Postal", "postalCode")}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>
    </Box>
  );
};

const OrdersSection = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await GetOrdersService();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <Typography>Cargando pedidos...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Mis Pedidos</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Historial de tus compras recientes.
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Aún no has realizado ningún pedido.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order.id} variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={1}>
                  <Box sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    p: 1.5,
                    borderRadius: 1,
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <InventoryIcon sx={{ color: 'text.secondary' }} />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{order.folio || `#ORD-${order.id}`}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" display="block">Total</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ${Number(order.total_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.quotations?.length || 0} artículos
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  {/* Placeholder status as backend doesn't have status field yet on Quotation table visible in earlier steps */}
                  <Chip
                    label="Procesando"
                    color="warning"
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: '4px', height: 24 }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Button
                    size="small"
                    color="error"
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    onClick={() => console.log('Ver detalles', order.uuid)}
                  >
                    Ver Detalles
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

const FavoritesSection = () => {
  const { user, toggleFavoriteAction } = useAuthStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const favorites = user?.favorites || [];

  const handleProductClick = (product: any) => {
    const identifier = getPreferredIdentifier(product);
    navigate(`/producto/${identifier}`);
  };

  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [selectedProductForSize, setSelectedProductForSize] = useState<any>(null);

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
    // Normalize sizes logic
    const normalizedSizes = Array.isArray(product.sizes)
      ? product.sizes.map((s: any) => typeof s === 'object' && s.name ? s.name : s)
      : (typeof product.sizes === 'string'
        ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []);

    // Get default color if available
    let defaultColor = undefined;
    if (product.colors && product.colors.length > 0) {
      const color = product.colors[0];
      defaultColor = typeof color === 'object' ? color.name : color;
    }

    if (normalizedSizes.length > 1) {
      // Multiple sizes -> Open dialog
      setSelectedProductForSize(product);
      setSizeDialogOpen(true);
    } else if (normalizedSizes.length === 1) {
      // Single size -> Add directly
      addToCart(product, 1, normalizedSizes[0], defaultColor);
      showCartToast(product);
    } else {
      // No sizes -> Add directly
      addToCart(product, 1, undefined, defaultColor);
      showCartToast(product);
    }
  };

  const handleConfirmAddToCart = (size: string) => {
    if (selectedProductForSize) {
      // Get default color if available
      let defaultColor = undefined;
      if (selectedProductForSize.colors && selectedProductForSize.colors.length > 0) {
        const color = selectedProductForSize.colors[0];
        defaultColor = typeof color === 'object' ? color.name : color;
      }

      addToCart(selectedProductForSize, 1, size, defaultColor);
      showCartToast(selectedProductForSize);
      setSizeDialogOpen(false);
      setSelectedProductForSize(null);
    }
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
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleProductClick(fav)}
                />
                <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 }, cursor: 'pointer' }} onClick={() => handleProductClick(fav)}>
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

      <SizeSelectionDialog
        open={sizeDialogOpen}
        onClose={() => setSizeDialogOpen(false)}
        product={selectedProductForSize}
        onConfirm={handleConfirmAddToCart}
      />
    </Box>
  );
};



const AddressesSection = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [_loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await GetAddressesService();
      setAddresses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenNew = () => {
    setSelectedAddress(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (addr: any) => {
    setSelectedAddress(addr);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;
    try {
      await DeleteAddressService(id);
      toast.success('Dirección eliminada');
      fetchAddresses();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleSaveAddress = async (formData: any) => {
    setLoading(true);
    try {
      if (selectedAddress) {
        await UpdateAddressService(selectedAddress.id, formData);
        toast.success('Dirección actualizada');
      } else {
        await CreateAddressService(formData);
        toast.success('Dirección agregada');
      }
      setOpenDialog(false);
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Mis Direcciones</Typography>
        <Button variant="outlined" startIcon={<LocationOnIcon />} color="error" onClick={handleOpenNew}>
          Nueva Dirección
        </Button>
      </Box>

      {addresses.length === 0 ? (
        <Typography color="text.secondary">No tienes direcciones guardadas.</Typography>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((addr) => (
            <Grid item xs={12} md={6} key={addr.id}>
              <Card variant="outlined" sx={{ height: '100%', bgcolor: '#1e1e1e', color: 'white', borderColor: '#333' }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <LocationOnIcon sx={{ color: 'grey.500', mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white' }}>{addr.municipality || 'Dirección'}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1, color: '#ddd' }}>
                    {addr.street} {addr.exteriorNumber} {addr.interiorNumber ? `Int. ${addr.interiorNumber}` : ''}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {addr.neighborhood}, {addr.municipality}, {addr.state}, CP: {addr.postalCode}
                  </Typography>
                  {addr.references && <Typography variant="caption" display="block" sx={{ mt: 1, color: 'grey.500' }}>Ref: {addr.references}</Typography>}
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'grey.500' }}>Recibe: {addr.recipientName} - Tel: {addr.phone}</Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<EditIcon />} color="error" size="small" onClick={() => handleOpenEdit(addr)}>Editar</Button>
                  <Button startIcon={<DeleteIcon />} color="error" size="small" onClick={() => handleDelete(addr.id)}>Eliminar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AddressDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        address={selectedAddress}
        onSave={handleSaveAddress}
      />
    </Box>
  );
};

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
      case 'perfil':
        return <ProfileSection />;
      case 'pedidos':
        return <OrdersSection />;
      case 'favoritos':
        return <FavoritesSection />;
      case 'direcciones':
        return <AddressesSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: { xs: 2, md: 4 }, fontWeight: 'bold', fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.125rem' } }}>Mi Cuenta</Typography>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            {user && (
              <Box sx={{ p: { xs: 2, md: 3 }, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', display: { xs: 'none', md: 'block' } }}>
                <Avatar sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, mx: 'auto', mb: { xs: 1, md: 2 }, bgcolor: 'primary.main', fontSize: '2rem' }} src={user.image ? (user.image.startsWith('http') ? user.image : `${import.meta.env.VITE_AWS_URL}/${user.image}`) : undefined}>
                  {!user.image && (user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />)}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>{user.name} {user.last_name}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>
            )}
            <List disablePadding sx={{ display: { xs: 'flex', md: 'block' }, overflowX: { xs: 'auto', md: 'visible' }, '&::-webkit-scrollbar': { height: 0 } }}>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={activeTab === item.id}
                    onClick={() => handleTabChange(item.id)}
                    sx={{
                      py: 1.5,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(211, 47, 47, 0.08)',
                        borderLeft: '4px solid #d32f2f',
                        '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.12)' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: activeTab === item.id ? 'error.main' : 'inherit', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: activeTab === item.id ? 'bold' : 'medium',
                        color: activeTab === item.id ? 'error.main' : 'text.primary'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, minHeight: { xs: 300, md: 400 } }}>
            {renderContent()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
