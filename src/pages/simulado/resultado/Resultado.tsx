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

export const Resultado = () => {
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
            Simulado Geral EEAR · Turma 2024.1
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
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
                80%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taxa de Acerto Geral
              </Typography>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Acima de 75% dos candidatos
              </Typography>
            </Box>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Total de Questões
                </Typography>
                <Typography fontWeight={700} fontSize={22}>
                  96
                </Typography>
                <Chip
                  label="100% Concluído"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3, bgcolor: "#f0fdf4" }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Acertos
                </Typography>
                <Typography fontWeight={700} fontSize={22} color="success.main">
                  77
                </Typography>
                <Typography variant="caption" color="success.main">
                  +80% de precisão
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3, bgcolor: "error.light" }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Erros
                </Typography>
                <Typography fontWeight={700} fontSize={22} color="error.main">
                  19
                </Typography>
                <Typography variant="caption" color="error.main">
                  Focar em Português
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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Box display="flex" gap={2} alignItems="center">
                <Chip label="01" color="success" />
                <Typography fontWeight={600}>
                  Língua Portuguesa · Sintaxe
                </Typography>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Correta"
                  color="success"
                  size="small"
                />
              </Box>

              <Typography variant="body2">
                Sua resposta <b>[A]</b> · Gabarito <b>[A]</b>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.6}
            >
              Nesta questão, o termo destacado funciona como objeto direto
              preposicionado. A preposição “a” é exigida pelo verbo “amar” para
              dar ênfase ao objeto, técnica comum na literatura clássica cobrada
              pela EEAR.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, bgcolor: "background.default" }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Box display="flex" gap={2} alignItems="center">
                <Chip label="02" color="error" />
                <Typography fontWeight={600}>
                  Física · Termodinâmica
                </Typography>
                <Chip
                  icon={<CancelIcon />}
                  label="Incorreta"
                  color="error"
                  size="small"
                />
              </Box>

              <Typography variant="body2">
                Sua resposta <b>[C]</b> · Gabarito <b>[D]</b>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.6}
            >
              A temperatura deve ser convertida para Kelvin.
              <br />
              T = 27°C + 273 = 300K
              <br />
              Como o volume é constante, o aumento da temperatura absoluta dobra
              a pressão.
            </Typography>
          </CardContent>
        </Card>
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
              Excelente progresso, aluno!
            </Typography>
            <Typography variant="body2" color="inherit">
              Você conquistou 19 pontos de melhoria hoje.
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
