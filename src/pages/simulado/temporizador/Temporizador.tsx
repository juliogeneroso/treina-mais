import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography, Button } from "@mui/material"

interface TemporizadorProps {
    simuladoId: number | string
    duracaoTotalSegundos: number
    onTempoEsgotado: () => void
    onPausarESair: () => void
}

export const Temporizador = ({ simuladoId, duracaoTotalSegundos, onTempoEsgotado, onPausarESair }: TemporizadorProps) => {
    const storageKeyTempo = `simulado_tempo_restante_${simuladoId}`

    const [tempoRestanteSegundos, setTempoRestanteSegundos] = useState<number>(() => {
        if (!duracaoTotalSegundos) return 0
        try {
            const salvo = window.localStorage.getItem(storageKeyTempo)
            if (salvo) {
                const valor = Number(salvo)
                if (!Number.isNaN(valor) && valor >= 0) {
                    return valor
                }
            }
        } catch {
            // se localStorage falhar, usa a duração total
        }
        return duracaoTotalSegundos
    })

    useEffect(() => {
        if (tempoRestanteSegundos <= 0) {
            return
        }

        const id = window.setInterval(() => {
            setTempoRestanteSegundos(prev => {
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

    useEffect(() => {
        return () => {
            try {
                window.localStorage.setItem(storageKeyTempo, String(tempoRestanteSegundos))
            } catch {
                // ignore falhas ao salvar
            }
        }
    }, [storageKeyTempo, tempoRestanteSegundos])

    const minutos = Math.floor(tempoRestanteSegundos / 60)
    const segundos = tempoRestanteSegundos % 60
    const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
    const tempoEsgotado = tempoRestanteSegundos <= 0

    const handlePausarClick = () => {
        try {
            window.localStorage.setItem(storageKeyTempo, String(tempoRestanteSegundos))
        } catch {
            // ignore falhas ao salvar
        }
        onPausarESair()
    }

    return (
        <Box
            sx={{
                flexBasis: "20%",
                flexShrink: 0,
                maxWidth: 250,
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
                        onClick={handlePausarClick}
                        sx={{ textTransform: "none" }}
                    >
                        Pausar e sair
                    </Button>
                </CardContent>
            </Card>
        </Box>
    )
}
