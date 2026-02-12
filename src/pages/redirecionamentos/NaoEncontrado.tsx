import { Box, Button, Typography, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const NaoEncontrado = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #141e30, #243b55)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <ErrorOutlineIcon sx={{ fontSize: 80, mb: 2 }} />

        <Typography variant="h2" fontWeight="bold">
          404
        </Typography>

        <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
          Página não encontrada
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
          A página que você está tentando acessar não existe ou foi movida.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
        >
          Voltar para o início
        </Button>
      </Container>
    </Box>
  );
};

export default NaoEncontrado;
