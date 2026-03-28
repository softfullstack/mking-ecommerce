import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Badge, Drawer, List, ListItem, ListItemText, ListItemButton, Divider, ListItemIcon } from "@mui/material"
import { styled } from "@mui/material/styles"
import { Menu as MenuIcon, ShoppingBag as ShoppingBagIcon, Close, Person as PersonIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon, Logout as LogoutIcon } from "@mui/icons-material"
import useCartStore from "../store/CartStore"
import useAuthStore from "../store/AuthStore"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import LogoIcon from "../assets/images/logo-header.png";

const Logo = styled("img")({
    height: 40,
    marginRight: 10,
})

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const { totalItems } = useCartStore() as { totalItems: number }
    const { isAuthenticated, user, logout } = useAuthStore()

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        handleCloseUserMenu()
        toast.info("Sesión cerrada")
        navigate("/")
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const menuItems = [
        { text: "Inicio", path: "/" },
        { text: "Productos", path: "/productos" },
        { text: "Ofertas", path: "/ofertas" },
        { text: "Novedades", path: "/novedades" },
    ]

    return (
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo for desktop */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontWeight: 700,
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        <Logo src={LogoIcon} alt="MKing" />
                    </Typography>

                    {/* Mobile menu button */}
                    <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={toggleMobileMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Logo for mobile */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                        }}
                    >
                        <Logo src={LogoIcon} alt="MKing" />
                    </Typography>

                    {/* Desktop menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                component={RouterLink}
                                to={item.path}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>

                    {/* Cart icon */}
                    <Box sx={{ flexGrow: 0, mr: { xs: 0.5, md: 2 } }}>
                        <IconButton component={RouterLink} to="/carrito" aria-label="cart" color="inherit" sx={{ p: { xs: 0.5, md: 1 } }}>
                            <Badge badgeContent={totalItems} color="primary">
                                <ShoppingBagIcon sx={{ fontSize: { xs: 22, md: 24 } }} />
                            </Badge>
                        </IconButton>
                    </Box>

                    {/* User menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={handleOpenUserMenu}>
                                    <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, color: "white" }}>
                                        {user?.name}
                                    </Typography>
                                    <Tooltip title="Opciones">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt={user?.name || "Usuario"} src={user?.image} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem component={RouterLink} to="/perfil" onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Mi Cuenta</Typography>
                                    </MenuItem>
                                    {/* <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center" color="error">Cerrar Sesión</Typography>
                                    </MenuItem> */}
                                </Menu>
                            </>
                        ) : (
                            <>
                                {/* Show icon on mobile, text on desktop */}
                                <IconButton
                                    component={RouterLink}
                                    to="/login"
                                    color="inherit"
                                    sx={{ display: { xs: 'flex', sm: 'none' }, p: 0.5 }}
                                >
                                    <PersonIcon />
                                </IconButton>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: { sm: '0.8rem', md: '0.875rem' } }}
                                >
                                    Iniciar Sesión
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile drawer menu */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                sx={{
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: 200,
                        backgroundColor: "#1e1e1e",
                        color: "white",
                    },
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                    <IconButton color="inherit" onClick={toggleMobileMenu}>
                        <Close />
                    </IconButton>
                </Box>

                {isAuthenticated && (
                    <Box sx={{ textAlign: "center", mb: 1 }}>
                        <Box sx={{ position: "relative", display: "inline-block", mb: 1 }}>
                            <Avatar
                                src={user?.image}
                                alt={user?.name}
                                sx={{ width: 80, height: 80, mx: "auto", border: "2px solid #ab0000ff" }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: "primary.main",
                                    borderRadius: "50%",
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid #1e1e1e"
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 18 }} />
                            </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cliente
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ backgroundColor: "#ae35351e" }} />

                <List sx={{ px: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={RouterLink} to={item.path} onClick={toggleMobileMenu} sx={{ borderRadius: 2 }}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {isAuthenticated && (
                        <>
                            <Divider sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.1)" }} />
                            <Typography variant="caption" sx={{ px: 2, mb: 1, display: "block", color: "text.secondary", textTransform: "uppercase" }}>
                                Mi Cuenta
                            </Typography>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/perfil?tab=perfil" onClick={toggleMobileMenu} sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mi Perfil" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/perfil?tab=pedidos" onClick={toggleMobileMenu} sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                                        <ShoppingBagIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mis Pedidos" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/perfil?tab=favoritos" onClick={toggleMobileMenu} sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                                        <FavoriteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Favoritos" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/perfil?tab=direcciones" onClick={toggleMobileMenu} sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                                        <LocationOnIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Direcciones" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => { handleLogout(); toggleMobileMenu(); }}
                                    sx={{
                                        borderRadius: 2,
                                        mt: 1,
                                        color: "#ff4d4d",
                                        "&:hover": { bgcolor: "rgba(255, 77, 77, 0.1)" }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: "#ff4d4d" }}>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Cerrar Sesión" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>
        </AppBar>
    )
}

export default Navbar
