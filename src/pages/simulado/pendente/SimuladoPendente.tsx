import React from 'react';
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

const SimuladoPendente = () => {
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
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
          }}
        >
          {/* Ícone Superior */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#eff6ff',
              color: '#3b82f6',
              mx: 'auto',
              mb: 4
            }}
          >
            <DescriptionRoundedIcon sx={{ fontSize: 40 }} />
          </Avatar>

          {/* Título e Subtítulo */}
          <Typography variant="h4" fontWeight="900" sx={{ color: '#0f172a', mb: 1 }}>
            Você possui um simulado pendente
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 5 }}>
            Retome de onde parou e garanta sua aprovação na EEAR/EAGS.
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
                  bgcolor: 'white',
                  borderColor: '#e2e8f0'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AssignmentLateRoundedIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Questões Restantes
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900" color="#0f172a">
                  24
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
                  bgcolor: 'white',
                  borderColor: '#e2e8f0'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AccessTimeFilledRoundedIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Tempo Restante
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900" color="#0f172a">
                  01:15:00
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
              sx={{
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#3b82f6',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                '&:hover': { bgcolor: '#2563eb' }
              }}
            >
              Continuar simulado
            </Button>

            <Button
              variant="text"
              startIcon={<ReplayRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: '#94a3b8',
                textTransform: 'none',
                fontWeight: '500',
                fontSize: '0.9rem',
                '&:hover': { color: '#64748b', bgcolor: 'transparent' }
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