import React from "react"
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom"
import { Box, Container, Typography, TextField, Button, Paper, Alert, CircularProgress, Link } from "@mui/material"
import { ConfirmEmailService } from "../services/MKing.service"

const ConfirmEmail = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [code, setCode] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState(false)

    // Get email from location state (passed from Register page)
    const email = location.state?.email || ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            setError("No se encontró el correo electrónico. Por favor, intenta registrarte de nuevo.")
            return
        }
        if (code.length < 6) {
            setError("El código debe tener al menos 6 dígitos.")
            return
        }

        setLoading(true)
        setError("")
        try {
            await ConfirmEmailService({ email, code })
            setSuccess(true)
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (err: any) {
            console.error(err)
            const message = err.response?.data?.message || "Código inválido o error al confirmar."
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    if (!email) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#1e1e1e" }}>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Falta información del registro.
                    </Alert>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        No pudimos encontrar tu correo electrónico para la verificación.
                    </Typography>
                    <Button component={RouterLink} to="/register" variant="contained" color="primary">
                        Ir a Registro
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
                        Verifica tu Correo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Hemos enviado un código de 6 dígitos a: <br />
                        <strong>{email}</strong>
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        ¡Cuenta activada con éxito! Redirigiendo al login...
                    </Alert>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Código de Confirmación"
                            variant="outlined"
                            margin="normal"
                            placeholder="Ej. 123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            disabled={loading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                sx: { textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                            sx={{ mb: 2 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Confirmar Cuenta"}
                        </Button>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2">
                                ¿No recibiste el código?{" "}
                                <Link component={RouterLink} to="/register" sx={{ cursor: "pointer" }}>
                                    Regístrate de nuevo
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                )}
            </Paper>
        </Container>
    )
}

export default ConfirmEmail
