import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useLocation, useNavigate } from "react-router-dom";
import type { SimuladoFinalizadoResponse } from "../../../interfaces/simulado/responder-simulado.interface";

interface ResultadoLocationState {
  resultado: SimuladoFinalizadoResponse | null;
  nomeSimulado: string;
}

export const Resultado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as ResultadoLocationState;

  const resultado = state.resultado ?? null;
  const nomeSimulado = state.nomeSimulado ?? "";

  const percentual = resultado ? Math.round(resultado.pontuacaoFinal * 100) : 0;

  const getMensagemFinal = (p: number) => {
    if (p >= 100) {
      return {
        titulo: "Incrível, você gabaritou!",
        descricao:
          "Você acertou 100% das questões. Continue assim e leve essa confiança para a prova.",
      };
    }
    if (p >= 90) {
      return {
        titulo: "Quase perfeito!",
        descricao:
          `Você acertou ${p}% das questões. Falta pouco para gabaritar, revise apenas os pontos de erro.`,
      };
    }
    if (p >= 70) {
      return {
        titulo: "Ótimo desempenho!",
        descricao:
          `Você acertou ${p}% das questões. Você está bem preparado, continue revisando para consolidar o conteúdo.`,
      };
    }
    if (p >= 50) {
      return {
        titulo: "Bom caminho!",
        descricao:
          `Você acertou ${p}% das questões. Já domina boa parte, foque nas questões erradas para subir ainda mais a nota.`,
      };
    }
    if (p >= 30) {
      return {
        titulo: "Você está aquecendo!",
        descricao:
          `Você acertou ${p}% das questões. Identifique os temas com mais erro e priorize-os nos próximos estudos.`,
      };
    }
    if (p >= 10) {
      return {
        titulo: "Primeiros passos dados!",
        descricao:
          `Você acertou ${p}% das questões. Continue praticando, cada simulado é uma oportunidade de aprender.`,
      };
    }
    return {
      titulo: "Todo começo conta!",
      descricao:
        "Mesmo com poucos ou nenhum acerto, o importante é identificar onde melhorar. Use esse resultado como ponto de partida.",
    };
  };
  

  const mensagemFinal = getMensagemFinal(percentual);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Resultado do Simulado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nomeSimulado}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("/dashboard")}
        >
          Voltar ao Início
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography fontWeight={600} mb={2}>
            Resumo de Performance
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ minWidth: 200 }}>
              <Typography fontWeight={700} fontSize={28}>
                {resultado ? `${Math.round(resultado.pontuacaoFinal * 100)}%` : '0%'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taxa de Acerto Geral
              </Typography>
              <LinearProgress
                variant="determinate"
                value={resultado ? Math.round(resultado.pontuacaoFinal * 100) : 0}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                }}
              />
              <Typography variant="caption" color="text.primary">
                {resultado ? `${resultado.totalAcertos} acertos de ${resultado.totalQuestoes} questões` : 'Carregando...'}
              </Typography>
            </Box>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="caption" color="text.primary">
                  Total de Questões
                </Typography>
                <Typography fontWeight={700} fontSize={22}>
                  {resultado ? resultado.totalQuestoes : '0'}
                </Typography>
                <Chip
                  label="100% Concluído"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3}}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Acertos
                </Typography>
                <Typography fontWeight={700} fontSize={22} color="success.main">
                  {resultado ? resultado.totalAcertos : '0'}
                </Typography>
                <Typography variant="caption" color="success.main">
                  {resultado ? `+${Math.round((resultado.totalAcertos / resultado.totalQuestoes) * 100)}% de precisão` : 'Carregando...'}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3}}>
              <CardContent>
                <Typography variant="caption" color="text.primary">
                  Erros
                </Typography>
                <Typography fontWeight={700} fontSize={22} color="text.primary">
                  {resultado ? resultado.totalErros : '0'}
                </Typography>
                <Typography variant="caption" color="text.primary">
                  {resultado ? `-${Math.round((resultado.totalErros / resultado.totalQuestoes) * 100)}% de precisão` : 'Carregando...'}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      <Box mb={2}>
        <Typography fontWeight={600}>Revisão Detalhada</Typography>
      </Box>

      <Stack spacing={2}>
        {resultado?.feedbackQuestoes.map((fb, index) => {
          const correta = fb.correta;
          const chipColor = correta ? "success" : "error" as const;
          const chipLabel = correta ? "Correta" : "Incorreta";
          const IconeStatus = correta ? CheckCircleIcon : CancelIcon;

          return (
            <Card
              key={fb.questaoId}
              sx={{
                borderRadius: 3,
                bgcolor: correta ? "background.paper" : "background.default",
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Chip label={String(index + 1).padStart(2, "0")} color={chipColor} />
                    <Typography fontWeight={600}>
                      Questão {index + 1}
                    </Typography>
                    <Chip
                      icon={<IconeStatus />}
                      label={chipLabel}
                      color={chipColor}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2">
                    Sua resposta <b>[{fb.respostaUsuario}]</b> · Gabarito <b>[{fb.respostaCorreta}]</b>
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 1 }}
                >
                  {fb.enunciado}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.6}
                >
                  {fb.explicacao}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Card
        sx={{
          mt: 5,
          borderRadius: 3,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontWeight={700} color="inherit">
              {mensagemFinal.titulo}
            </Typography>
            <Typography variant="body2" color="inherit">
              {mensagemFinal.descricao}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            sx={{
              bgcolor: "background.paper",
              color: "primary.main",
              fontWeight: 700,
              borderRadius: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Gerar Flashcards
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
