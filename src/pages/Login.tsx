import React from "react"
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom"
import { Box, Container, Typography, TextField, Button, Divider, Link, InputAdornment, IconButton, Paper, Alert } from "@mui/material"
import { Visibility, VisibilityOff, Google, Facebook } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import useAuthStore from "../store/AuthStore"
import useCartStore from "../store/CartStore"
import { LoginService } from "../services/MKing.service"

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuthStore()
    const { fetchCart } = useCartStore()
    const [showPassword, setShowPassword] = React.useState(false)
    const [loginError, setLoginError] = React.useState("")

    const from = location.state?.from || "/"

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (data: any) => {
        setLoginError("")
        try {
            const response = await LoginService(data)
            const { token, user } = response.data
            console.log('%c este es el usuer y el token', 'color: green', user, token);
            // otambien mostrar la imagen del cliente 
            // Store token
            localStorage.setItem("token", token)

            // Update store
            login(user)

            await fetchCart()

            navigate(from, { replace: true })
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Error al iniciar sesión. Por favor verifica tus credenciales."
            setLoginError(message)
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: 4, backgroundColor: "#1e1e1e" }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Iniciar Sesión
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ingresa tus credenciales para acceder a tu cuenta
                    </Typography>
                </Box>

                {loginError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {loginError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        {...register("email", {
                            required: "El email es requerido",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email inválido",
                            },
                        })}
                        error={!!errors.email}
                        helperText={typeof errors.email?.message === "string" ? errors.email.message : ""}
                        defaultValue="demo@example.com"
                    />

                    <TextField
                        fullWidth
                        label="Contraseña"
                        variant="outlined"
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "La contraseña es requerida",
                            minLength: {
                                value: 6,
                                message: "La contraseña debe tener al menos 6 caracteres",
                            },
                        })}
                        error={!!errors.password}
                        helperText={typeof errors.password?.message === "string" ? errors.password.message : ""}
                        defaultValue="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 3 }}>
                        <Link component={RouterLink} to="/recuperar-password" variant="body2">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Box>

                    <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mb: 3 }} disabled={isSubmitting}>
                        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        O continúa con
                    </Typography>
                </Divider>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button fullWidth variant="outlined" startIcon={<Google />} sx={{ borderColor: "divider" }}>
                        Google
                    </Button>
                    <Button fullWidth variant="outlined" startIcon={<Facebook />} sx={{ borderColor: "divider" }}>
                        Facebook
                    </Button>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2">
                        ¿No tienes una cuenta?{" "}
                        <Link component={RouterLink} to="/registro">
                            Regístrate
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    )
}

export default Login
