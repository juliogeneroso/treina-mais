import { useEffect } from "react"
import { Pergunta } from "./pergunta/Pergunta"
import { useApi } from "../../services/useAPI";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

export const Simulado = () => {
    const { request, isLoading } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        request('/api/simulado/ativo', {
            method: 'GET',
            withAuth: true
        }).then((data) => {
            // 200 → data com simulado em andamento
            // 204 → useApi retorna null → redireciona para criação
            if (!data) {
                navigate('/simulado/criar');
            } else {
                navigate(`/simulado/pendente`);
            }
        }).catch((err) => {
            console.error('Erro ao verificar simulado ativo:', err);
            navigate('/dashboard');
        });
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <CircularProgress />
                <Typography variant="body1" color="text.secondary">
                    Carregando simulado...
                </Typography>
            </Box>
        );
    }

    return <Pergunta />
}