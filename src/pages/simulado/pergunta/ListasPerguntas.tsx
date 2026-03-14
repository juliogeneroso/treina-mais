import { Box, Typography, Stack, Card, CardContent, Button, useMediaQuery, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Questao } from "../../../interfaces/simulado/simulado-ativo.interface";

export type Alternativa = "A" | "B" | "C" | "D";

interface ListasPerguntasProps {
  questoes: Questao[];
  indiceAtual: number;
  respostas: Record<number, Alternativa>;
  onIrParaQuestao: (index: number) => void;
  onFinalizarSimulado: () => void;
}

export const ListasPerguntas = ({
  questoes,
  indiceAtual,
  respostas,
  onIrParaQuestao,
  onFinalizarSimulado,
}: ListasPerguntasProps) => {
  const theme = useTheme();
  const isFullWidth = useMediaQuery(theme.breakpoints.down("md"));
  const maxChars = isFullWidth ? 80 : 50;

  return (
    <Box
      sx={{
        flexBasis: { xs: "100%", lg: "20%" },
        flexShrink: 0,
        maxWidth: { xs: "100%", lg: 320 },
        height: { xs: "auto", lg: "100%" },
        overflowY: { xs: "visible", lg: "auto" },
        borderLeft: { xs: "none", lg: "1px solid" },
        borderTop: { xs: "1px solid", lg: "none" },
        borderColor: "divider",
        pl: { xs: 0, lg: 2 },
        pt: { xs: 2, lg: 0 },
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Questões
      </Typography>

      <Stack spacing={1}>
        {questoes.map((q, index) => {
          const respondida = !!respostas[q.id];
          const atual = index === indiceAtual;

          return (
            <Card
              key={q.id}
              variant={atual ? "elevation" : "outlined"}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                borderColor: atual ? "primary.main" : "divider",
                bgcolor: atual ? "action.selected" : "background.paper",
              }}
              onClick={() => onIrParaQuestao(index)}
            >
              <CardContent
                sx={{
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  Questão {index + 1} - {q.enunciado.length > maxChars ? `${q.enunciado.substring(0, maxChars)}...` : q.enunciado}
                </Typography>
                {respondida && (
                  <CheckCircleIcon
                    color={atual ? "inherit" : "success"}
                    sx={{ fontSize: 18 }}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Card finalizador */}
        <Card
          variant="outlined"
          sx={{
            mt: 1,
            borderRadius: 2,
            borderStyle: "dashed",
            borderColor: "primary.main",
          }}
        >
          <CardContent
            sx={{
              py: 1.5,
              px: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              onClick={onFinalizarSimulado}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Finalizar simulado
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
