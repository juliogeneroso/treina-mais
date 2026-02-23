import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const FlashcardEstudo = () => {
  const { baralhoId } = useParams<{ baralhoId: string }>();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Estudo de Flashcards
      </Typography>
      <Typography variant="body1">
        Baralho selecionado: {baralhoId}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={2}>
        (Tela de estudo ainda em construção.)
      </Typography>
    </Box>
  );
};

export default FlashcardEstudo;
