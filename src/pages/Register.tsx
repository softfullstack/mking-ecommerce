import React from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { Box, Container, Typography, TextField, Button, Divider, Link, InputAdornment, IconButton, Paper, Checkbox, FormControlLabel, Alert } from "@mui/material"
import { Visibility, VisibilityOff, Google, Facebook } from "@mui/icons-material"
import { useForm, FieldValues } from "react-hook-form"
import { RegisterService } from "../services/MKing.service"
import { Grid } from "@mui/material"

interface RegisterFormData extends FieldValues {
    name: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phone?: string
    street?: string
    exteriorNumber?: string
    interiorNumber?: string
    neighborhood?: string
    municipality?: string
    state?: string
    postalCode?: string
    terms: boolean
}

const Register = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const [registerSuccess, setRegisterSuccess] = React.useState(false)
    const [registerError, setRegisterError] = React.useState("")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>()

    const passwordValue = watch("password", "")

    const onSubmit = async (data: RegisterFormData) => {
        setRegisterError("")
        try {
            await RegisterService(data)
            setRegisterSuccess(true)

            // Redirigir a la página de confirmación pasando el email
            setTimeout(() => {
                navigate("/confirmar-correo", { state: { email: data.email } })
            }, 3000)
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Error al registrarse. Por favor intenta de nuevo."
            setRegisterError(message)
        }
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
                        ¡Registro exitoso! Por favor verifica tu correo electrónico para el código de confirmación. Serás redirigido automáticamente...
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

                {registerError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {registerError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                variant="outlined"
                                margin="normal"
                                {...register("name", {
                                    required: "El nombre es requerido",
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message as string}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Apellidos"
                                variant="outlined"
                                margin="normal"
                                {...register("lastName", {
                                    required: "Los apellidos son requeridos",
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message as string}
                            />
                        </Grid>
                    </Grid>

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
                        helperText={errors.email?.message as string}
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
                        helperText={errors.password?.message as string}
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
                            validate: (value) => value === passwordValue || "Las contraseñas no coinciden",
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message as string}
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

                    <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "primary.main" }}>
                        Datos de Envío (Opcional)
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                variant="outlined"
                                margin="normal"
                                {...register("phone")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Código Postal"
                                variant="outlined"
                                margin="normal"
                                {...register("postalCode")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Calle"
                                variant="outlined"
                                margin="normal"
                                {...register("street")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Núm. Exterior"
                                variant="outlined"
                                margin="normal"
                                {...register("exteriorNumber")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Núm. Interior"
                                variant="outlined"
                                margin="normal"
                                {...register("interiorNumber")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Colonia"
                                variant="outlined"
                                margin="normal"
                                {...register("neighborhood")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Municipio"
                                variant="outlined"
                                margin="normal"
                                {...register("municipality")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Estado"
                                variant="outlined"
                                margin="normal"
                                {...register("state")}
                            />
                        </Grid>
                    </Grid>

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
                            {errors.terms.message as string}
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
