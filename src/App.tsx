import './App.css'
import { ThemeProvider, CssBaseline, Box } from "@mui/material"
import { Theme } from "./Theme"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./views/Home"
import ProductList from "./views/ProductList"
import ProductDetail from "./views/ProductDetail"
import Cart from "./views/Cart"
import Login from "./views/Login"
import Register from "./views/Register"
import ConfirmEmail from "./views/ConfirmEmail"
import ForgotPassword from "./views/ForgotPassword"
import Profile from "./views/Profile"
import About from "./views/About"
import Novedades from "./views/Novedades"
import Noticias from "./views/Noticias"
import Contact from "./views/Contact"
import Ubicaciones from "./views/Ubicaciones"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from "./components/ScrollToTop"
import PageTransition from "./components/PageTransition"
import ProtectedRoute from "./components/ProtectedRoute"
import { useEffect } from 'react'
import { GetMeService } from './services/MKing.service'
import useAuthStore from './store/AuthStore'
import useCartStore from './store/CartStore'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import useUIStore from './store/UIStore';
import DescuentosEmpresas from './views/DescuentosEmpresas'

function App() {
  const { currentProductName } = useUIStore()
  const { login, logout } = useAuthStore()
  const { fetchCart } = useCartStore()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const response = await GetMeService()
        login(response.data.user)
        fetchCart()
      } catch (error) {
        console.error('Session expired or invalid')
        localStorage.removeItem('token')
        logout()
      }
    }

    checkAuth()
  }, [login, logout])

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ToastContainer />
      <Router>
        <ScrollToTop />
        <Navbar />
        {/* Spacer for fixed navbar */}
        <Box sx={{ height: { xs: 56, sm: 64 } }} />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/producto/:uuid" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/confirmar-correo" element={<ConfirmEmail />} />
            <Route path="/recuperar-password" element={<ForgotPassword />} />
            <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/ubicaciones" element={<Ubicaciones />} />
            <Route path="/descuentos" element={<DescuentosEmpresas />} />
          </Routes>
        </PageTransition>
        <Footer />
        <WhatsAppFloatingButton phoneNumber="523351146348" productName={currentProductName} />
      </Router>
    </ThemeProvider>
  )
}

export default App
