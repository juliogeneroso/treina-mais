import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Chip,
  Divider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FunctionsIcon from "@mui/icons-material/Functions";
import TranslateIcon from "@mui/icons-material/Translate";

export const FlashCard = () => {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700}>
          Você tem <Box component="span" color="primary.main">45 cartões</Box>{" "}
          pendentes hoje
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mantenha sua constância nos estudos! O segredo da aprovação é a
          repetição.
        </Typography>
      </Box>

      <Box mb={5}>
        <Typography fontWeight={600} mb={2}>
          Prioridade do Dia
        </Typography>

        <Card
          sx={{
            display: "flex",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: 140,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 64, color: "white" }} />
          </Box>

          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Chip
                label="MAIS URGENTE"
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography fontWeight={700} fontSize={18}>
                Português · Sintaxe
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 520, my: 1 }}
              >
                Este é o baralho com mais revisões pendentes. Mantenha o foco nos
                tópicos de maior peso para a EEAR/EAGS (Sujeito, Predicado e
                Complementos).
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                32 cartões
              </Typography>
            </Box>

            <Button
              variant="contained"
              endIcon={<PlayArrowIcon />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Começar Agora
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Box mb={3} display="flex" justifyContent="space-between">
        <Typography fontWeight={600}>Meus Baralhos</Typography>
        <Typography
          variant="body2"
          color="primary.main"
          sx={{ cursor: "pointer" }}
        >
          Ver todos →
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={5}>
        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <FunctionsIcon color="warning" />
              <Chip label="12 novos" color="warning" size="small" />
            </Box>
            <Typography fontWeight={600}>Matemática</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Álgebra e Trigonometria
            </Typography>
            <LinearProgress
              variant="determinate"
              value={65}
              sx={{ height: 8, borderRadius: 4 }}
              color="warning"
            />
            <Typography variant="caption">65%</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <BoltIcon color="success" />
              <Chip label="Revisado" color="success" size="small" />
            </Box>
            <Typography fontWeight={600}>Física</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Mecânica e Eletricidade
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{ height: 8, borderRadius: 4 }}
              color="success"
            />
            <Typography variant="caption">100%</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <TranslateIcon color="primary" />
              <Chip label="5 pendentes" color="primary" size="small" />
            </Box>
            <Typography fontWeight={600}>Inglês</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Interpretação e Vocabulário
            </Typography>
            <LinearProgress
              variant="determinate"
              value={42}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption">42%</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          bgcolor: "#f8fafc",
          p: 3,
          borderRadius: 3,
          borderLeft: "4px solid",
          borderColor: "primary.main",
        }}
      >
        <Typography fontStyle="italic">
          “O sucesso é a soma de pequenos esforços repetidos dia após dia.”
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          — R. Collier
        </Typography>
      </Box>
    </Box>
  );
};
