import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Container,
  Avatar,
  Stack
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLateRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useApi } from '../../../services/useAPI';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import type { SimuladoAtivoResponse } from '../../../interfaces/simulado/simulado-ativo.interface';

interface SimuladoPendenteProps {
  data: SimuladoAtivoResponse;
  onContinuar: (data: SimuladoAtivoResponse) => void;
}

const SimuladoPendente = ({ data, onContinuar }: SimuladoPendenteProps) => {

  const { request, isLoading: loading } = useApi();
  const navigate = useNavigate();

  const storageKeyTempo = `simulado_tempo_restante_${data.id}`;
  let tempoRestanteTexto: string = `${data.tempoDuracao} min`;

  try {
    const salvo = window.localStorage.getItem(storageKeyTempo);
    if (salvo) {
      const segundos = Number(salvo);
      if (!Number.isNaN(segundos) && segundos >= 0) {
        const minutos = Math.floor(segundos / 60);
        const restoSegundos = segundos % 60;
        tempoRestanteTexto = `${String(minutos).padStart(2, '0')}:${String(restoSegundos).padStart(2, '0')}`;
      }
    }
  } catch {
    // se localStorage não estiver disponível, mantém o tempo padrão em minutos
  }


  const descartarProgresso = () => {
    request(`/api/simulado/delete/${data.id}`, { method: 'DELETE', withAuth: true }).then(() => {
      try {
        window.localStorage.removeItem(`simulado_tempo_restante_${data.id}`);
      } catch {
        // ignore falhas ao limpar o tempo salvo
      }
      enqueueSnackbar('Progresso do simulado descartado com sucesso.', { variant: 'success' });
      navigate('/simulado/criar');
    }).catch((err) => {
      enqueueSnackbar('Erro ao descartar progresso do simulado. Tente novamente.', { variant: 'error' });
      console.error('Erro ao descartar progresso do simulado:', err);
    });
  }



  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            bgcolor: 'background.paper',
          }}
        >
          {/* Ícone Superior */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              mx: 'auto',
              mb: 4
            }}
          >
            <DescriptionRoundedIcon sx={{ fontSize: 40 }} />
          </Avatar>

          {/* Título e Subtítulo */}
          <Typography variant="h4" fontWeight="900" color="text.primary" sx={{ mb: 1 }}>
            Você possui um simulado pendente
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Retome de onde parou e garanta sua aprovação.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
            {data.titulo}
          </Typography>

          {/* Cards de Status */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'left',
                  bgcolor: 'background.paper',
                  borderColor: 'divider',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AssignmentLateRoundedIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Questões Restantes
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900" color="text.primary">
                  {data.quantidadeQuestoes}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'left',
                  bgcolor: 'background.paper',
                  borderColor: 'divider',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AccessTimeFilledRoundedIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Tempo Restante
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900" color="text.primary">
                  {tempoRestanteTexto}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Botões de Ação */}
          <Stack spacing={2} alignItems="center">
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PlayArrowRoundedIcon />}
              loading={loading}
              onClick={() => onContinuar(data)}
              sx={{
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Continuar simulado
            </Button>

            <Button
              variant="text"
              startIcon={<ReplayRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => descartarProgresso()}
              loading={loading}
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: '500',
                fontSize: '0.9rem',
                '&:hover': { color: 'text.primary', bgcolor: 'transparent' }
              }}
            >
              Descartar progresso e iniciar novo
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default SimuladoPendente;