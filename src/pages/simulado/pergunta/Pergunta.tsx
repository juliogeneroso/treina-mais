import { useState } from "react";
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

type Option = {
  id: string;
  label: string;
};

const options: Option[] = [
  { id: "A", label: "30 cm²" },
  { id: "B", label: "60 cm²" },
  { id: "C", label: "65 cm²" },
  { id: "D", label: "12 cm²" },
  { id: "E", label: "15 cm²" },
];

export const Pergunta = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card
      sx={{
        maxWidth: 760,
        mx: "auto",
        mt: 6,
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
              DISCIPLINA
            </Typography>
            <Typography fontWeight={600} fontSize={18}>
              Matemática · Geometria Plana
            </Typography>
          </Box>

          <Typography
            fontWeight={700}
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Questão 01/10
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography mb={4} fontSize={16} lineHeight={1.6}>
          No triângulo retângulo ABC, a hipotenusa mede 13 cm e um dos catetos mede
          5 cm. Determine a área deste triângulo em centímetros quadrados.
        </Typography>

        <Stack spacing={2}>
          {options.map((option) => {
            const isSelected = selected === option.id;

            return (
              <Button
                key={option.id}
                onClick={() => setSelected(option.id)}
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
            sx={{ borderRadius: 2, px: 3 }}
          >
            ← Anterior
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: 2, px: 4 }}
          >
            Próxima →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
