"use client"

import React from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
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
    Checkbox,
    FormControlLabel,
    Alert,
} from "@mui/material"
import { Visibility, VisibilityOff, Google, Facebook } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import useAuthStore from "../store/AuthStore"

const Register = () => {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const [registerSuccess, setRegisterSuccess] = React.useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
    const password = React.useRef({})
    password.current = watch("password", "")

    const onSubmit = (data) => {
        // In a real app, this would call an API
        setRegisterSuccess(true)

        // Auto login after registration
        setTimeout(() => {
            login({
                id: 1,
                name: data.name,
                email: data.email,
            })

            navigate("/")
        }, 1500)
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    if (registerSuccess) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#1e1e1e" }}>
                    <Alert severity="success" sx={{ mb: 3 }}>
                        ¡Registro exitoso! Serás redirigido automáticamente...
                    </Alert>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        ¡Gracias por registrarte!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Tu cuenta ha sido creada correctamente.
                    </Typography>
                    <Button component={RouterLink} to="/" variant="contained" color="primary">
                        Ir a la Tienda
                    </Button>
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: 4, backgroundColor: "#1e1e1e" }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Crear Cuenta
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Regístrate para acceder a todas las funcionalidades
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Nombre Completo"
                        variant="outlined"
                        margin="normal"
                        {...register("name", {
                            required: "El nombre es requerido",
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

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

                    <TextField
                        fullWidth
                        label="Confirmar Contraseña"
                        variant="outlined"
                        margin="normal"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                            required: "Por favor confirma tu contraseña",
                            validate: (value) => value === password.current || "Las contraseñas no coinciden",
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register("terms", {
                                    required: "Debes aceptar los términos y condiciones",
                                })}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body2">
                                Acepto los{" "}
                                <Link component={RouterLink} to="/terminos">
                                    Términos y Condiciones
                                </Link>{" "}
                                y la{" "}
                                <Link component={RouterLink} to="/privacidad">
                                    Política de Privacidad
                                </Link>
                            </Typography>
                        }
                    />
                    {errors.terms && (
                        <Typography variant="caption" color="error">
                            {errors.terms.message}
                        </Typography>
                    )}

                    <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3, mb: 3 }}>
                        Registrarse
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        O regístrate con
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
                        ¿Ya tienes una cuenta?{" "}
                        <Link component={RouterLink} to="/login">
                            Inicia Sesión
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    )
}

export default Register
