import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../services/useAPI";


interface FlashcardEstudoResponse {
  cartaoId: number | null;
  frente: string;
  verso: string;
  pendentesHoje: number;
  revisadosHoje: number;
  metaDiariaPercentual: number;
}

const FlashcardEstudo = () => {
  const { baralhoId } = useParams<{ baralhoId: string }>();
  const { request } = useApi();
  const [history, setHistory] = useState<FlashcardEstudoResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [answeredCardIds, setAnsweredCardIds] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const currentCard = history[currentIndex] ?? null;

  useEffect(() => {
    carregarPrimeiroCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, baralhoId]);

  const carregarPrimeiroDoServidor = async () => {
    try {
      setLoading(true);
      const query = baralhoId ? `?baralhoId=${baralhoId}` : "";
      const data = await request(`/api/cartoes/estudo/proximo${query}`, {
        method: "GET",
        withAuth: true,
      });
      if (data == null) {
        setFinished(true);
        return;
      }

      const d = data as FlashcardEstudoResponse;
      setFinished(false);

      setHistory((prev) => {
        const truncated = prev.slice(0, currentIndex + 1);
        const nextHistory = [...truncated, d];
        setCurrentIndex(nextHistory.length - 1);
        return nextHistory;
      });
      setIsFlipped(false);
    } catch (error) {
      console.error("Erro ao carregar dados do baralho para estudo:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarPrimeiroCard = async () => {
    if (history.length > 0 || loading) return;
    await carregarPrimeiroDoServidor();
  };

  const handleFlip = () => {
    if (!currentCard || !currentCard.cartaoId) return;
    setIsFlipped((prev) => !prev);
  };

  const handleAnswer = async (value: number) => {
    setLoading(true);
    await request(`/api/cartoes/${currentCard?.cartaoId}/responder?qualidade=${value}`, {
      method: "POST",
      withAuth: true,
      body: JSON.stringify({ resposta: value }),
    }).then((data) => {
         const d = data as FlashcardEstudoResponse;

      setHistory((prev) => {
        const truncated = prev.slice(0, currentIndex + 1);
        const nextHistory = [...truncated, d];
        setCurrentIndex(nextHistory.length - 1);
        return nextHistory;
      });
      setIsFlipped(false);
    }).catch((error) => {
      console.error("Erro ao enviar resposta do cartão:", error);
      return;
    });

    if (!currentCard || !currentCard.cartaoId) return;
    if (answeredCardIds.includes(currentCard.cartaoId)) return;
    setAnswers((prev) => ({ ...prev, [currentCard.cartaoId as number]: value }));
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
    setIsFlipped(false);
  };

  const handleNext = async () => {
    if (finished) {
      return;
    }

    if (
      !currentCard ||
      !currentCard.cartaoId ||
      respostaSelecionada === undefined
    ) {
      return;
    }

    if (!answeredCardIds.includes(currentCard.cartaoId)) {
      setAnsweredCardIds((prev) => [...prev, currentCard.cartaoId as number]);
    }

    // Se já temos próximo no histórico, apenas navega
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      return;
    }
  };

  const respostaSelecionada =
    currentCard && currentCard.cartaoId !== null
      ? answers[currentCard.cartaoId]
      : undefined;

  const isCurrentCardAnswered =
    !!currentCard && !!currentCard.cartaoId
      ? answeredCardIds.includes(currentCard.cartaoId)
      : false;

  const answerOptions = [
    { label: "Não sei", emoji: "❌", value: 0 },
    { label: "Erro grave", emoji: "⚠️", value: 1 },
    { label: "Quase", emoji: "🤏", value: 2 },
    { label: "Difícil", emoji: "😓", value: 3 },
    { label: "Leve esforço", emoji: "🙂", value: 4 },
    { label: "Perfeito", emoji: "💪", value: 5 },
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Estudo de Flashcards
      </Typography>

      {/* Parte superior: métricas */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Revisados hoje
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {currentCard?.revisadosHoje ?? 0}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Pendentes hoje
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {currentCard?.pendentesHoje ?? 0}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Parte central: card com frente/verso */}
      <Box mb={4}>
        <Card sx={{ borderRadius: 3, p: 2, display: "flex", minHeight: 220 }}>
          {loading && !currentCard ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Carregando cartão...
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  perspective: 1000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    transform: isFlipped
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  }}
                >
                  {/* Frente */}
                  <Box
                    sx={{
                      position: "relative",
                      backfaceVisibility: "hidden",
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mb={1}
                    >
                      Frente
                    </Typography>
                    <Typography variant="body1">
                      {currentCard?.frente ?? "Nenhum cartão disponível."}
                    </Typography>
                  </Box>

                  {/* Verso */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mb={1}
                    >
                      Verso
                    </Typography>
                    <Typography variant="body1">
                      {currentCard?.verso ?? "Nenhum cartão disponível."}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  ml: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleFlip}
                  disabled={!currentCard || !currentCard.cartaoId}
                >
                  {isFlipped ? "Ver frente" : "Ver verso"}
                </Button>
              </Box>
            </>
          )}
        </Card>

        {/* Botões de resposta (somente no verso) */}
        {isFlipped && currentCard && currentCard.cartaoId && !loading && (
          <Stack
            spacing={1}
            direction={{ xs: "column", sm: "row" }}
            flexWrap="wrap"
            justifyContent="center"
            mt={2}
          >
            {answerOptions.map(
              ({ label, emoji, value }) => (
                <Button
                  key={label}
                  variant={respostaSelecionada === value ? "contained" : "outlined"}
                  color={
                    label === "Não sei" || label === "Erro grave"
                      ? "error"
                      : label === "Perfeito"
                      ? "success"
                      : "primary"
                  }
                  onClick={() => handleAnswer(value)}
                  sx={{ minWidth: 120 }}
                  disabled={isCurrentCardAnswered}
                >
                  {emoji} {label}
                </Button>
              )
            )}
          </Stack>
        )}
      </Box>

      {/* Parte inferior: navegação */}
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={handlePrev}
          disabled={currentIndex === 0 || loading}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            loading ||
            !currentCard ||
            respostaSelecionada === undefined ||
            finished
          }
        >
          Responder
        </Button>
      </Box>

      {finished && (
        <Typography
          variant="body2"
          color="text.secondary"
          mt={2}
          textAlign="center"
        >
          Você finalizou todos os cards de revisão deste baralho.
        </Typography>
      )}
    </Box>
  );
};

export default FlashcardEstudo;
