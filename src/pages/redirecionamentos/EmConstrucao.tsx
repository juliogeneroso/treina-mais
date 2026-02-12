import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const EmConstrucao = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={10}
          sx={{
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            p: 4,
          }}
        >
          <CardContent>
            <ConstructionIcon
              sx={{ fontSize: 60, mb: 2 }}
              color="primary"
            />

            <Typography variant="h4" gutterBottom fontWeight="bold">
              Página em Construção
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={4}>
              Estamos trabalhando para trazer novidades em breve.
            </Typography>

            <CircularProgress />

            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 4 }}
              color="text.secondary"
            >
              © 2026 - Trein Mais
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EmConstrucao;
