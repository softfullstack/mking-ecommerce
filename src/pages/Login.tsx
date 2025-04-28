"use client"

import React from "react"
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom"
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Divider,
    Link,
    InputAdornment,
    IconButton,
    Paper,
    Alert,
} from "@mui/material"
import { Visibility, VisibilityOff, Google, Facebook } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import useAuthStore from "../store/AuthStore"

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = React.useState(false)
    const [loginError, setLoginError] = React.useState("")

    const from = location.state?.from || "/"

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        // In a real app, this would call an API
        if (data.email === "demo@example.com" && data.password === "password") {
            login({
                id: 1,
                name: "Usuario Demo",
                email: data.email,
            })

            navigate(from)
        } else {
            setLoginError("Email o contraseña incorrectos")
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
                        helperText={errors.email?.message}
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
                        helperText={errors.password?.message}
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

                    <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mb: 3 }}>
                        Iniciar Sesión
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

            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    Para fines de demostración, usa:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Email: demo@example.com | Contraseña: password
                </Typography>
            </Box>
        </Container>
    )
}

export default Login
