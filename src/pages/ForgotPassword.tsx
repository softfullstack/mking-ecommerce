import { useState, useEffect, useRef } from "react"
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material"
import { Visibility, VisibilityOff, LockReset, EmailOutlined, CheckCircleOutline } from "@mui/icons-material"
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ForgotPasswordService, ResetPasswordService } from "../services/MKing.service"

interface ForgotStep1FormData {
    email: string
}

interface ForgotStep2FormData {
    code: string
    password: string
    confirmPassword: string
}

const ForgotPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const formRef = useRef<HTMLDivElement>(null)

    const initialEmail = location.state?.email || ""
    const initialStep = location.state?.step !== undefined ? Number(location.state?.step) : 0
    const initialMessage = location.state?.message || ""

    const [activeStep, setActiveStep] = useState(initialStep)
    const [emailSubmitted, setEmailSubmitted] = useState(initialEmail)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [infoMessage, setInfoMessage] = useState(initialMessage)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Form 1: Solicitar código
    const {
        register: registerStep1,
        handleSubmit: handleSubmitStep1,
        formState: { errors: errorsStep1 },
    } = useForm<ForgotStep1FormData>()

    // Form 2: Código y nueva contraseña
    const {
        register: registerStep2,
        handleSubmit: handleSubmitStep2,
        watch: watchStep2,
        formState: { errors: errorsStep2 },
    } = useForm<ForgotStep2FormData>()

    const newPassword = watchStep2("password", "")

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 30, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
            )
        }
    }, [activeStep])

    // Paso 1: Enviar solicitud de código
    const onSubmitStep1 = async (data: ForgotStep1FormData) => {
        setLoading(true)
        setErrorMessage("")
        setInfoMessage("")
        try {
            const normalizedEmail = data.email.trim().toLowerCase()
            const response = await ForgotPasswordService({ email: normalizedEmail })
            setEmailSubmitted(normalizedEmail)
            setInfoMessage(
                response.data?.message ||
                "Si la cuenta existe, se ha enviado un código de recuperación a tu correo."
            )
            setActiveStep(1)
        } catch (error: any) {
            console.error("Error en forgot-password:", error)
            const msg =
                error.response?.data?.message ||
                "No fue posible procesar la solicitud. Por favor intenta de nuevo más tarde."
            setErrorMessage(msg)
        } finally {
            setLoading(false)
        }
    }

    // Paso 2: Reenviar código si no le llegó
    const handleResendCode = async () => {
        if (!emailSubmitted) return
        setResending(true)
        setErrorMessage("")
        try {
            const response = await ForgotPasswordService({ email: emailSubmitted })
            setInfoMessage(
                response.data?.message ||
                "Se ha reenviado el código de recuperación a tu correo."
            )
        } catch (error: any) {
            console.error("Error reenviando código:", error)
            setErrorMessage("No fue posible reenviar el código. Intenta de nuevo en unos momentos.")
        } finally {
            setResending(false)
        }
    }

    // Paso 3: Restablecer contraseña con código
    const onSubmitStep2 = async (data: ForgotStep2FormData) => {
        if (data.password !== data.confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.")
            return
        }

        setLoading(true)
        setErrorMessage("")
        try {
            const response = await ResetPasswordService({
                email: emailSubmitted,
                code: data.code.trim(),
                password: data.password,
            })

            setSuccessMessage(
                response.data?.message ||
                "¡Tu contraseña ha sido actualizada con éxito! Redirigiendo al inicio de sesión..."
            )

            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (error: any) {
            console.error("Error en reset-password:", error)
            const msg =
                error.response?.data?.message ||
                "Código inválido, expirado o error al actualizar la contraseña."
            setErrorMessage(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Helmet>
                <title>Recuperar Contraseña | MKing</title>
                <meta
                    name="description"
                    content="Restablece tu contraseña de forma segura en la tienda oficial de MKing."
                />
            </Helmet>

            <Paper
                ref={formRef}
                sx={{
                    p: 4,
                    backgroundColor: "#1e1e1e",
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* Cabecera */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Box
                        sx={{
                            display: "inline-flex",
                            p: 2,
                            borderRadius: "50%",
                            backgroundColor: "rgba(255, 0, 0, 0.12)",
                            color: "primary.main",
                            mb: 2,
                        }}
                    >
                        <LockReset sx={{ fontSize: 42 }} />
                    </Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Recuperar Contraseña
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {activeStep === 0
                            ? "Ingresa tu correo para recibir un código de restablecimiento."
                            : `Ingresa el código que enviamos a ${emailSubmitted} (válido por 15 min) y tu nueva contraseña.`}
                    </Typography>
                </Box>

                {/* Indicador de pasos */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    <Step key="correo">
                        <StepLabel>Solicitar Código</StepLabel>
                    </Step>
                    <Step key="restablecer">
                        <StepLabel>Restablecer</StepLabel>
                    </Step>
                </Stepper>

                {/* Alertas */}
                {infoMessage && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {infoMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMessage}
                    </Alert>
                )}

                {successMessage && (
                    <Alert
                        severity="success"
                        icon={<CheckCircleOutline fontSize="inherit" />}
                        sx={{ mb: 3 }}
                    >
                        {successMessage}
                    </Alert>
                )}

                {/* PASO 0: Ingreso de correo */}
                {activeStep === 0 && (
                    <form onSubmit={handleSubmitStep1(onSubmitStep1)}>
                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            variant="outlined"
                            margin="normal"
                            placeholder="ejemplo@correo.com"
                            autoComplete="email"
                            disabled={loading}
                            {...registerStep1("email", {
                                required: "El correo electrónico es requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Ingresa un correo electrónico válido",
                                },
                            })}
                            error={!!errorsStep1.email}
                            helperText={errorsStep1.email?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                            sx={{ py: 1.4, mb: 3, fontWeight: "bold" }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Enviar Código de Recuperación"
                            )}
                        </Button>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                ¿Recordaste tu contraseña?{" "}
                                <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                                    Iniciar Sesión
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                )}

                {/* PASO 1: Ingreso de código y nueva contraseña */}
                {activeStep === 1 && !successMessage && (
                    <form onSubmit={handleSubmitStep2(onSubmitStep2)}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1.5,
                                mb: 2,
                                backgroundColor: "rgba(255,255,255,0.03)",
                                borderRadius: 1.5,
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Correo: <strong>{emailSubmitted}</strong>
                            </Typography>
                            <Button
                                size="small"
                                variant="text"
                                color="inherit"
                                onClick={() => {
                                    setActiveStep(0)
                                    setErrorMessage("")
                                    setInfoMessage("")
                                }}
                            >
                                Cambiar
                            </Button>
                        </Box>

                        <TextField
                            fullWidth
                            label="Código de Confirmación (6 dígitos)"
                            variant="outlined"
                            margin="normal"
                            placeholder="123456"
                            disabled={loading}
                            {...registerStep2("code", {
                                required: "El código de recuperación es requerido",
                                minLength: {
                                    value: 6,
                                    message: "El código debe tener al menos 6 dígitos",
                                },
                            })}
                            error={!!errorsStep2.code}
                            helperText={errorsStep2.code?.message}
                            InputProps={{
                                sx: {
                                    textAlign: "center",
                                    fontSize: "1.3rem",
                                    letterSpacing: "0.4rem",
                                    fontWeight: "bold",
                                },
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Nueva Contraseña"
                            variant="outlined"
                            margin="normal"
                            type={showPassword ? "text" : "password"}
                            disabled={loading}
                            {...registerStep2("password", {
                                required: "La nueva contraseña es requerida",
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe contener al menos 6 caracteres",
                                },
                            })}
                            error={!!errorsStep2.password}
                            helperText={errorsStep2.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Confirmar Nueva Contraseña"
                            variant="outlined"
                            margin="normal"
                            type={showConfirmPassword ? "text" : "password"}
                            disabled={loading}
                            {...registerStep2("confirmPassword", {
                                required: "Confirma tu nueva contraseña",
                                validate: (value) =>
                                    value === newPassword || "Las contraseñas no coinciden",
                            })}
                            error={!!errorsStep2.confirmPassword}
                            helperText={errorsStep2.confirmPassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                            sx={{ py: 1.4, mb: 2, fontWeight: "bold" }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Restablecer Contraseña"
                            )}
                        </Button>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                            <Button
                                size="small"
                                variant="text"
                                color="inherit"
                                disabled={resending}
                                onClick={handleResendCode}
                            >
                                {resending ? "Reenviando..." : "¿No te llegó? Reenviar código"}
                            </Button>

                            <Link component={RouterLink} to="/login" variant="body2">
                                Volver a Iniciar Sesión
                            </Link>
                        </Box>
                    </form>
                )}

                {/* Estado de Éxito Final */}
                {successMessage && (
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2 }}
                        >
                            Ir a Iniciar Sesión Ahora
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}

export default ForgotPassword
