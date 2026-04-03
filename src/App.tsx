import './App.css'
import { ThemeProvider, CssBaseline, Box } from "@mui/material"
import { Theme } from "./Theme"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import ProductList from "./pages/ProductList"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ConfirmEmail from "./pages/ConfirmEmail"
import Profile from "./pages/Profile"
import About from "./pages/About"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from "./components/ScrollToTop"
import PageTransition from "./components/PageTransition"
import { useEffect } from 'react'
import { GetMeService } from './services/MKing.service'
import useAuthStore from './store/AuthStore'
import useCartStore from './store/CartStore'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
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
            <Route path="/perfil" element={<Profile />} />
            <Route path="/nosotros" element={<About />} />
          </Routes>
        </PageTransition>
        <Footer />
      </Router>
    </ThemeProvider>
  )
}

export default App
