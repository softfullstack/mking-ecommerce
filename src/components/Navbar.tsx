import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Badge, InputBase, Drawer, List, ListItem, ListItemText, ListItemButton, Divider } from "@mui/material"
import { styled, alpha } from "@mui/material/styles"
import { Menu as MenuIcon, Search as SearchIcon, ShoppingBag as ShoppingBagIcon, Close } from "@mui/icons-material"
import useCartStore from "../store/CartStore"
import useAuthStore from "../store/AuthStore"

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}))

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

    const handleLogout = () => {
        logout()
        handleCloseUserMenu()
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
                        <Logo src="images/logo.png" alt="MKing" sx={{borderRadius: 1}} />
                        MKing
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
                            fontWeight: 700,
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        <Logo src="images/logo.png" alt="SafetyVest" sx={{borderRadius: 1}}     />
                        MKing
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

                    {/* Search */}
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Buscar..." inputProps={{ "aria-label": "search" }} />
                    </Search>

                    {/* Cart icon */}
                    <Box sx={{ flexGrow: 0, mr: 2 }}>
                        <IconButton component={RouterLink} to="/carrito" aria-label="cart" color="inherit">
                            <Badge badgeContent={totalItems} color="primary">
                                <ShoppingBagIcon />
                            </Badge>
                        </IconButton>
                    </Box>

                    {/* User menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <>
                                <Tooltip title="Abrir opciones">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user?.name || "Usuario"} src={user?.avatar} />
                                    </IconButton>
                                </Tooltip>
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
                                        <Typography textAlign="center">Mi Perfil</Typography>
                                    </MenuItem>
                                    <MenuItem component={RouterLink} to="/pedidos" onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Mis Pedidos</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center">Cerrar Sesión</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button color="inherit" component={RouterLink} to="/login">
                                Iniciar Sesión
                            </Button>
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
                        width: 280,
                        backgroundColor: "black",
                        color: "white",
                    },
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                    <IconButton color="inherit" onClick={toggleMobileMenu}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={RouterLink} to={item.path} onClick={toggleMobileMenu}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    )
}

export default Navbar
