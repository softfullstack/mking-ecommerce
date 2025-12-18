import './App.css'
import { ThemeProvider, CssBaseline } from "@mui/material"
import { Theme } from "./Theme"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import ProductList from "./pages/ProductList"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from "./components/ScrollToTop"
import { useEffect } from 'react'
import { GetMeService } from './services/MKing.service'
import useAuthStore from './store/AuthStore'

function App() {
  const { login, logout } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const response = await GetMeService()
        login(response.data)
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
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/producto/:uuid" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  )
}

export default App
