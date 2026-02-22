import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography, Button } from "@mui/material"

interface TemporizadorProps {
    duracaoInicialSegundos: number | null
    onTempoEsgotado: () => void
    onPausarESair: () => void
}

export const Temporizador = ({ duracaoInicialSegundos, onTempoEsgotado, onPausarESair }: TemporizadorProps) => {
    const [tempoRestanteSegundos, setTempoRestanteSegundos] = useState<number | null>(duracaoInicialSegundos)

    useEffect(() => {
        setTempoRestanteSegundos(duracaoInicialSegundos)
    }, [duracaoInicialSegundos])

    useEffect(() => {
        if (tempoRestanteSegundos == null || tempoRestanteSegundos <= 0) {
            return
        }

        const id = window.setInterval(() => {
            setTempoRestanteSegundos(prev => {
                if (prev == null) return prev
                if (prev <= 1) {
                    window.clearInterval(id)
                    onTempoEsgotado()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            window.clearInterval(id)
        }
    }, [tempoRestanteSegundos, onTempoEsgotado])

    const minutos = tempoRestanteSegundos != null ? Math.floor(tempoRestanteSegundos / 60) : 0
    const segundos = tempoRestanteSegundos != null ? tempoRestanteSegundos % 60 : 0
    const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
    const tempoEsgotado = tempoRestanteSegundos != null && tempoRestanteSegundos <= 0

    return (
        <Box
            sx={{
                flexBasis: "15%",
                flexShrink: 0,
                maxWidth: 220,
            }}
        >
            <Card
                sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: tempoEsgotado ? "error.main" : "divider",
                    bgcolor: tempoEsgotado ? "error.light" : "background.paper",
                }}
            >
                <CardContent>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Tempo do simulado
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                        {tempoFormatado}
                    </Typography>
                    <Typography
                        variant="body2"
                        color={tempoEsgotado ? "error.dark" : "text.secondary"}
                        sx={{ mb: 2 }}
                    >
                        {tempoEsgotado ? "Tempo esgotado" : "Contagem regressiva ativa"}
                    </Typography>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={onPausarESair}
                        sx={{ textTransform: "none" }}
                    >
                        Pausar e sair
                    </Button>
                </CardContent>
            </Card>
        </Box>
    )
}
