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
  Skeleton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useApi } from "../../services/useAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

interface FlashCardResponse {
  pendentesHoje: number;
  metaDiariaPercentual: number;
  baralhos: {
    pendentesHoje: number;
    titulo: string;
    totalCartoes: number;
    temaNome: string;
    id: number;
  }[];
}

export const FlashCard = () => {
  const { request } = useApi();
  const [flashCardData, setFlashCardData] = useState<FlashCardResponse | null>(null);
  const [showAllDecks, setShowAllDecks] = useState(false);
  const navigate = useNavigate();
  const [loadingDecks, setLoadingDecks] = useState(true);

  useEffect(() => {
    const fetchFlashCardData = async () => {
        setLoadingDecks(true);
        await request("/api/flashCard/dashboard", { method: "GET" , withAuth: true })
          .then((data) => {
            const d = data as FlashCardResponse;
            setFlashCardData(d);
          })
          .catch((error) => {
            enqueueSnackbar("Erro ao carregar dados do FlashCard. Tente novamente mais tarde.", { variant: "error" });
            console.error("Erro ao buscar dados do FlashCard:", error);
          })
          .finally(() => {
            setLoadingDecks(false);
          });
    };
     fetchFlashCardData();
  }, []);

  const decks = flashCardData?.baralhos ?? [];
  const displayedDecks = showAllDecks ? decks : decks.slice(0, 3);

  const topPriorityDeck =
    decks.length > 0
      ? decks.reduce((max, deck) =>
          deck.pendentesHoje > max.pendentesHoje ? deck : max
        )
      : null;

  const handleStartTopPriority = () => {
    if (!topPriorityDeck) return;
    navigate(`/flashcard/estudo/${topPriorityDeck.id}`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700}>
          Você tem <Box component="span" color="primary.main">{flashCardData?.pendentesHoje ?? 0} cartões</Box>{" "}
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
            <MenuBookIcon sx={{ fontSize: 64, color: "primary.contrastText" }} />
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
                {topPriorityDeck
                  ? `${topPriorityDeck.titulo} · ${topPriorityDeck.temaNome}`
                  : "Nenhum baralho prioritário"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 520, my: 1 }}
              >
                {topPriorityDeck
                  ? "Este é o baralho com mais revisões pendentes. Mantenha o foco nos tópicos de maior peso para seu concurso!"
                  : "Nenhum baralho com revisões pendentes no momento."}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {topPriorityDeck
                  ? `${topPriorityDeck.pendentesHoje} cartões pendentes`
                  : "0 cartões pendentes"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              endIcon={<PlayArrowIcon />}
              sx={{ borderRadius: 2, px: 3 }}
              disabled={!topPriorityDeck}
              onClick={handleStartTopPriority}
            >
              Começar Agora
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Box mb={3} display="flex" justifyContent="space-between">
        <Typography fontWeight={600}>Meus Baralhos</Typography>
        {!loadingDecks && decks.length > 3 && (
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ cursor: "pointer" }}
            onClick={() => setShowAllDecks((prev) => !prev)}
          >
            {showAllDecks ? "Ver menos ↑" : "Ver todos →"}
          </Typography>
        )}
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={5}>
        {loadingDecks ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{ flex: 1, borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="rounded" width={80} height={24} />
                  </Box>
                  <Skeleton width="60%" height={24} />
                  <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
                  <Skeleton
                    variant="rounded"
                    height={8}
                    sx={{ mt: 2, borderRadius: 4 }}
                  />
                  <Skeleton width={40} height={16} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            ))}
          </>
        ) : displayedDecks.length > 0 ? (
          displayedDecks.map((baralho) => {
            const estudados = baralho.totalCartoes - baralho.pendentesHoje;
            const progresso =
              baralho.totalCartoes > 0
                ? Math.round((estudados / baralho.totalCartoes) * 100)
                : 0;
            const revisado = baralho.pendentesHoje === 0;

            return (
              <Card key={baralho.id} sx={{ flex: 1, borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <MenuBookIcon color={revisado ? "success" : "primary"} />
                    <Chip
                      label={
                        revisado
                          ? "Revisado"
                          : `${baralho.pendentesHoje} pendentes`
                      }
                      color={revisado ? "success" : "primary"}
                      size="small"
                    />
                  </Box>
                  <Typography fontWeight={600}>{baralho.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {baralho.temaNome}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progresso}
                    sx={{ height: 8, borderRadius: 4 }}
                    color={revisado ? "success" : "primary"}
                  />
                  <Box
                    mt={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">{progresso}%</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/flashcard/estudo/${baralho.id}`)}
                    >
                      Iniciar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum baralho encontrado.
          </Typography>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          bgcolor: "background.default",
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
