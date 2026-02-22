import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Questao } from "../../../interfaces/simulado/simulado-ativo.interface";

type Alternativa = "A" | "B" | "C" | "D";

interface PerguntaProps {
  questao: Questao;
  indice: number;
  total: number;
  alternativaSelecionada: Alternativa | null;
  onSelecionarAlternativa: (alternativa: Alternativa) => void;
  onAnterior: () => void;
  onProxima: () => void;
  isPrimeira: boolean;
  isUltima: boolean;
  onFinalizar: () => void;
  bloqueado: boolean;
}

export const Pergunta = ({
  questao,
  indice,
  total,
  alternativaSelecionada,
  onSelecionarAlternativa,
  onAnterior,
  onProxima,
  isPrimeira,
  isUltima,
  onFinalizar,
  bloqueado
}: PerguntaProps) => {

  const options = [
    { id: "A" as const, label: questao.alternativaA },
    { id: "B" as const, label: questao.alternativaB },
    { id: "C" as const, label: questao.alternativaC },
    { id: "D" as const, label: questao.alternativaD },
  ];

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: 860, lg: 920 },
        mx: "auto",
        mt: 4,
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ letterSpacing: 1, fontWeight: 600 }}
            >
              {questao.tema}
            </Typography>
            <Typography fontWeight={600} fontSize={18}>
              {questao.capitulo} · {questao.subCapitulo}
            </Typography>
          </Box>

          <Typography
            fontWeight={700}
            color="primary"
            sx={{ fontSize: 14 }}
          >
            {`Questão ${indice + 1}/${total}`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography mb={4} fontSize={16} lineHeight={1.6}>
          {questao.enunciado}
        </Typography>

        <Stack spacing={2}>
          {options.map((option) => {
            const isSelected = alternativaSelecionada === option.id;

            return (
              <Button
                key={option.id}
                disabled={bloqueado}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => onSelecionarAlternativa(option.id)}
                disableRipple
                sx={{
                  justifyContent: "space-between",
                  textTransform: "none",
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "grey.300",
                  color: "text.primary",
                  backgroundColor: "transparent",
                  transition: "all .2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isSelected
                        ? "primary.main"
                        : "grey.400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: isSelected
                        ? "primary.main"
                        : "text.secondary",
                    }}
                  >
                    {option.id}
                  </Box>

                  <Typography fontSize={15}>
                    {option.label}
                  </Typography>
                </Box>

                {isSelected && (
                  <CheckCircleIcon
                    color="primary"
                    sx={{ fontSize: 22 }}
                  />
                )}
              </Button>
            );
          })}
        </Stack>

        <Box display="flex" justifyContent="space-between" mt={5}>
          <Button
            variant="outlined"
            disabled={isPrimeira}
            onClick={onAnterior}
            sx={{ borderRadius: 2, px: 3 }}
          >
            ← Anterior
          </Button>
          {isUltima ? (
            <Button
              variant="contained"
              color="primary"
              onClick={onFinalizar}
              sx={{ borderRadius: 2, px: 4, textTransform: "none" }}
            >
              Finalizar simulado
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onProxima}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Próxima →
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
