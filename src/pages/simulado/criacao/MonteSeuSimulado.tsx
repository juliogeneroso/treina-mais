import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Slider, ToggleButton,
  ToggleButtonGroup, Radio, RadioGroup, FormControlLabel, TextField,
  Chip, Card, Stack, Container, IconButton
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MonteSeuSimulado = () => {
  const [materia, setMateria] = useState('Português');
  const [tempo, setTempo] = useState<number>(120);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="900" sx={{ color: '#0f172a', mb: 1 }}>
          Monte seu Simulado
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 5, maxWidth: 650 }}>
          Personalize sua experiência de estudo escolhendo os temas, bancas e o nível de dificuldade ideal para sua meta.
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Stack spacing={4}>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MenuBookIcon color="primary" fontSize="small" /> Seleção de Matérias
                </Typography>
                <Grid container spacing={2}>
                  {['Português', 'Matemática', 'Física', 'Inglês'].map((item) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={item}>
                      <Paper
                        elevation={0}
                        onClick={() => setMateria(item)}
                        sx={{
                          p: 3, textAlign: 'center', cursor: 'pointer', borderRadius: 3,
                          border: '2px solid',
                          borderColor: materia === item ? '#3b82f6' : '#f1f5f9',
                          transition: '0.2s',
                          '&:hover': { borderColor: '#3b82f6' }
                        }}
                      >
                        <Box sx={{ mb: 1, opacity: materia === item ? 1 : 0.5 }}>
                           <MenuBookIcon color="primary" />
                        </Box>
                        <Typography variant="caption" fontWeight="bold">{item}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceIcon color="primary" fontSize="small" /> Banca Organizadora
                </Typography>
                <RadioGroup row defaultValue="EEAR">
                  <Paper variant="outlined" sx={{ px: 2, py: 0.5, mr: 2, borderRadius: 2 }}>
                    <FormControlLabel value="EEAR" control={<Radio size="small" />} label="EEAR (CFS)" />
                  </Paper>
                  <Paper variant="outlined" sx={{ px: 2, py: 0.5, mr: 2, borderRadius: 2 }}>
                    <FormControlLabel value="EAGS" control={<Radio size="small" />} label="EAGS" />
                  </Paper>
                  <Paper variant="outlined" sx={{ px: 2, py: 0.5, borderRadius: 2 }}>
                    <FormControlLabel value="Outras" control={<Radio size="small" />} label="Outras Bancas" />
                  </Paper>
                </RadioGroup>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon color="primary" fontSize="small" /> Nível de Dificuldade
                  </Typography>
                  <ToggleButtonGroup exclusive value="facil" fullWidth size="small" sx={{ bgcolor: '#e2e8f0', p: 0.5, borderRadius: 2 }}>
                    <ToggleButton value="facil" sx={{ border: 'none', borderRadius: '8px !important', bgcolor: 'white', '&.Mui-selected': { bgcolor: 'white', color: '#3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }}>Fácil</ToggleButton>
                    <ToggleButton value="medio" sx={{ border: 'none', borderRadius: 2 }}>Médio</ToggleButton>
                    <ToggleButton value="dificil" sx={{ border: 'none', borderRadius: 2 }}>Difícil</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormatListNumberedIcon color="primary" fontSize="small" /> Qtd. de Questões
                  </Typography>
                  <TextField fullWidth size="small" defaultValue={24} slotProps={{ htmlInput: { style: { fontWeight: 'bold' } } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                </Grid>
              </Grid>

              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon color="primary" fontSize="small" /> Tempo de Prova
                  </Typography>
                  <Chip label={`${tempo} minutos`} size="small" sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 'bold' }} />
                </Stack>
                <Slider value={tempo} onChange={(_, v) => setTempo(v as number)} min={30} max={300} sx={{ mt: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                  <Typography variant="caption" color="text.secondary">30 min</Typography>
                  <Typography variant="caption" color="text.secondary">300 min</Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4.5 }}>
            <Card sx={{ p: 4, borderRadius: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Resumo do Simulado</Typography>
              
              <Stack spacing={3} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormatListNumberedIcon fontSize="inherit" /> Questões
                  </Typography>
                  <Typography fontWeight="bold">24</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="inherit" /> Tempo Total
                  </Typography>
                  <Typography fontWeight="bold">2h 00m</Typography>
                </Box>
              </Stack>

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon fontSize="inherit" /> Matérias Incluídas
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 5 }}>
                <Chip label={materia.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                <Chip label="Aguardando seleção..." size="small" disabled variant="outlined" />
              </Stack>

              <Button fullWidth variant="contained" size="large" startIcon={<PlayArrowRoundedIcon />} sx={{ py: 2, borderRadius: 3, textTransform: 'none', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}>
                Iniciar Simulado
              </Button>

              <Box sx={{ mt: 4, p: 2, bgcolor: '#fffbeb', borderRadius: 3, border: '1px solid #fef3c7', display: 'flex', gap: 1.5 }}>
                <InfoOutlinedIcon sx={{ color: '#d97706' }} />
                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: '500' }}>
                  Você ainda pode adicionar mais 76 questões para atingir o máximo recomendado pela banca EEAR.
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MonteSeuSimulado;