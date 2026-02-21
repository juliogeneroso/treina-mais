import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Slider, ToggleButton,
  ToggleButtonGroup, FormControlLabel, TextField,
  Chip, Card, Stack, Container, CircularProgress, Checkbox
} from '@mui/material';
import { useSnackbar } from 'notistack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useApi } from '../../../services/useAPI';
import type { RootState } from '../../../store';
import { useAppSelector } from '../../../store/hooks';
import type { FiltroSimuladoResponse } from '../../../interfaces/simulado/simulado.interface';
import type { HttpError } from '../../../interfaces/error/http-error.interface';

     
const MonteSeuSimulado = () => {
  const [materia, setMateria] = useState<string[]>([]);
  const [capitulosSelecionados, setCapitulosSelecionados] = useState<string[]>([]);
  const [subcapitulosSelecionados, setSubcapitulosSelecionados] = useState<string[]>([]);
  const [bancasSelecionadas, setBancasSelecionadas] = useState<string[]>([]);
  const [niveisSelecionados, setNiveisSelecionados] = useState<string[]>([]);
  const [tempo, setTempo] = useState<number>(120);
  const [ numeroQuestoes, setNumeroQuestoes] = useState<number>(24);
  const { request, isLoading } = useApi();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [filtros, setFiltros] = useState<FiltroSimuladoResponse[]>([]);
  const [pacoteSelecionado, setPacoteSelecionado] = useState<number | null>(null);

  useEffect(() => {
    request(`/api/simulado/filtros/${user?.id}`, {
      method: 'GET',
      withAuth: true
    }).then((data) => {
      const lista = (data as FiltroSimuladoResponse[]) ?? [];
      setFiltros(lista);
      if (lista.length > 0) {
        setPacoteSelecionado(lista[0].pacoteId);
      }
      console.log('Dados de filtros recebidos:', lista);
    }).catch((err) => {
      console.error('Erro ao buscar filtros:', err);
    });
  }, []);

  const criarSimulado = () => {
    const pacoteAtualSelecionado = filtros.find((p) => p.pacoteId === pacoteSelecionado);

    if (!pacoteAtualSelecionado || !pacoteAtualSelecionado.concursoId) {
      enqueueSnackbar('Selecione um pacote para o simulado.', { variant: 'warning' });
      return;
    }

    if (materia.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma matéria.', { variant: 'warning' });
      return;
    }

    if (bancasSelecionadas.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma banca organizadora.', { variant: 'warning' });
      return;
    }

    if (niveisSelecionados.length === 0) {
      enqueueSnackbar('Selecione pelo menos um nível de dificuldade.', { variant: 'warning' });
      return;
    }

    if (!numeroQuestoes || Number.isNaN(numeroQuestoes) || numeroQuestoes <= 0) {
      enqueueSnackbar('Informe a quantidade de questões.', { variant: 'warning' });
      return;
    }

    if (!tempo || tempo <= 0) {
      enqueueSnackbar('Informe o tempo de prova.', { variant: 'warning' });
      return;
    }

    const temaIds = materia
      .map((m) => {
        const tema = pacoteAtualSelecionado.temas.find((t) => t.nome === m);
        return tema?.id;
      })
      .filter((id): id is number => typeof id === 'number');

    const capituloIds = capitulosSelecionados
      .map((c) => {
        const cap = pacoteAtualSelecionado.temas
          .flatMap((t) => t.capitulos)
          .find((cap) => cap.nome === c);
        return cap?.id;
      })
      .filter((id): id is number => typeof id === 'number');

    const subcapituloIds = subcapitulosSelecionados
      .map((s) => {
        const sub = pacoteAtualSelecionado.temas
          .flatMap((t) => t.capitulos)
          .flatMap((cap) => cap.subcapitulos)
          .find((sub) => sub.nome === s);
        return sub?.id;
      })
      .filter((id): id is number => typeof id === 'number');

    const payload = {
      concursoId: pacoteAtualSelecionado.concursoId,
      temaIds,
      capituloIds,
      subcapituloIds,
      bancas: bancasSelecionadas,
      niveis: niveisSelecionados,
      tempoDuracao: tempo,
      quantidadeQuestoes: numeroQuestoes
    };

    request(`/api/simulado/create?usuarioId=${user?.id}`, {
      method: 'POST',
      withAuth: true,
      body: payload
    }).then((data) => {
      console.log('Simulado criado com sucesso:', data);
      // Redirecionar para a página do simulado ativo
      window.location.href = '/simulado/pendente';
    }).catch((err: HttpError) => {
      enqueueSnackbar(err.message || 'Erro ao criar simulado', { variant: 'error' });
      console.error('Erro ao criar simulado:', err);
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Carregando opções do simulado...
          </Typography>
        </Stack>
      </Box>
    );
  }

  const pacoteAtual = filtros.find((p) => p.pacoteId === pacoteSelecionado) || null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 5 }}>
      <Container maxWidth="xl">
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
                  Pacote
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  value={pacoteSelecionado}
                  onChange={(_, value) => {
                    if (value !== null) {
                      setPacoteSelecionado(value as number);
                      setMateria([]);
                    }
                  }}
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {filtros.map((pacote) => (
                    <ToggleButton
                      key={pacote.pacoteId}
                      value={pacote.pacoteId}
                      sx={{ borderRadius: 3, textTransform: 'none', px: 2, py: 1, minWidth: 120 }}
                    >
                      {pacote.nomePacote}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MenuBookIcon color="primary" fontSize="small" /> Seleção de Matérias
                </Typography>
                <Grid container spacing={2}>
                  {(pacoteAtual?.temas ?? []).map((tema) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={tema.id}>
                      <Paper
                        elevation={0}
                        onClick={() =>
                          setMateria((prev) =>
                            prev.includes(tema.nome)
                              ? prev.filter((t) => t !== tema.nome)
                              : [...prev, tema.nome]
                          )
                        }
                        sx={{
                          p: 3, textAlign: 'center', cursor: 'pointer', borderRadius: 3,
                          border: '2px solid',
                          borderColor: materia.includes(tema.nome) ? '#3b82f6' : '#f1f5f9',
                          transition: '0.2s',
                          '&:hover': { borderColor: '#3b82f6' }
                        }}
                      >
                        <Box sx={{ mb: 1, opacity: materia.includes(tema.nome) ? 1 : 0.5 }}>
                           <MenuBookIcon color="primary" />
                        </Box>
                        <Typography variant="caption" fontWeight="bold">{tema.nome}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Capítulos */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Capitulos
                </Typography>
                <Grid container spacing={2}>
                  {(pacoteAtual?.temas ?? [])
                    .filter((tema) => materia.includes(tema.nome))
                    .flatMap((tema) => tema.capitulos)
                    .map((capitulo) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={capitulo.id}>
                        <Paper
                          elevation={0}
                          onClick={() =>
                            setCapitulosSelecionados((prev) =>
                              prev.includes(capitulo.nome)
                                ? prev.filter((c) => c !== capitulo.nome)
                                : [...prev, capitulo.nome]
                            )
                          }
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: capitulosSelecionados.includes(capitulo.nome) ? '#3b82f6' : '#f1f5f9',
                            transition: '0.2s',
                            '&:hover': { borderColor: '#3b82f6' },
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold">
                            {capitulo.nome}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>

              {/* Subcapítulos */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Subcapítulos
                </Typography>
                <Grid container spacing={2}>
                  {(pacoteAtual?.temas ?? [])
                    .filter((tema) => materia.includes(tema.nome))
                    .flatMap((tema) => tema.capitulos)
                    .filter((cap) => capitulosSelecionados.includes(cap.nome))
                    .flatMap((cap) => cap.subcapitulos)
                    .map((sub) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={sub.id}>
                        <Paper
                          elevation={0}
                          onClick={() =>
                            setSubcapitulosSelecionados((prev) =>
                              prev.includes(sub.nome)
                                ? prev.filter((s) => s !== sub.nome)
                                : [...prev, sub.nome]
                            )
                          }
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: subcapitulosSelecionados.includes(sub.nome) ? '#3b82f6' : '#f1f5f9',
                            transition: '0.2s',
                            '&:hover': { borderColor: '#3b82f6' },
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold">
                            {sub.nome}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceIcon color="primary" fontSize="small" /> Banca Organizadora
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(pacoteAtual?.bancasDisponiveis ?? []).map((banca) => (
                    <Paper key={banca} variant="outlined" sx={{ px: 2, py: 0.5, borderRadius: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={bancasSelecionadas.includes(banca)}
                            onChange={() =>
                              setBancasSelecionadas((prev) =>
                                prev.includes(banca)
                                  ? prev.filter((b) => b !== banca)
                                  : [...prev, banca]
                              )
                            }
                          />
                        }
                        label={banca}
                      />
                    </Paper>
                  ))}
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon color="primary" fontSize="small" /> Nível de Dificuldade
                  </Typography>
                  <ToggleButtonGroup
                    value={niveisSelecionados}
                    fullWidth
                    size="small"
                    sx={{
                      bgcolor: '#e2e8f0',
                      p: 0.5,
                      borderRadius: 2,
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        textTransform: 'none',
                        borderRadius: 2,
                        color: '#64748b',
                        fontWeight: 500,
                      },
                      '& .MuiToggleButton-root.Mui-selected': {
                        bgcolor: '#ffffff',
                        color: '#3b82f6',
                        boxShadow: '0 2px 4px rgba(15,23,42,0.15)',
                      },
                    }}
                    onChange={(_, values) => setNiveisSelecionados(values as string[])}
                  >
                    <ToggleButton value="facil">Fácil</ToggleButton>
                    <ToggleButton value="medio" >Médio</ToggleButton>
                    <ToggleButton value="dificil" >Difícil</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormatListNumberedIcon color="primary" fontSize="small" /> Qtd. de Questões
                  </Typography>
                  <TextField fullWidth onChange={(e) => setNumeroQuestoes(Number(e.target.value))} size="small" defaultValue={24} slotProps={{ htmlInput: { style: { fontWeight: 'bold' } } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
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

          <Grid size={{ xs: 12, md: 4.5 }} sx={{ mt: { xs: 4, md: 0 } }}>
            <Card
              sx={{
                p: 4,
                borderRadius: 5,
                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                border: '1px solid #f1f5f9',
                position: { md: 'sticky' },
                top: { md: 80 },
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Resumo do Simulado</Typography>
              
              <Stack spacing={3} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormatListNumberedIcon fontSize="inherit" /> Questões
                  </Typography>
                  <Typography fontWeight="bold">{numeroQuestoes}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="inherit" /> Tempo Total
                  </Typography>
                  <Typography fontWeight="bold">{`${Math.floor(tempo / 60)}h ${tempo % 60}m`}</Typography>
                </Box>
              </Stack>

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon fontSize="inherit" /> Matérias Incluídas
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 5 }}>
                {materia.length > 0 ? (
                  <Chip label={materia.join(', ').toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                ) : (
                  <Chip label="Aguardando seleção..." size="small" disabled variant="outlined" />
                )}
              </Stack>

              <Button fullWidth variant="contained" size="large" startIcon={<PlayArrowRoundedIcon />} sx={{ py: 2, borderRadius: 3, textTransform: 'none', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }} onClick={() => criarSimulado()}>
                Iniciar Simulado
              </Button>

              {/* <Box sx={{ mt: 4, p: 2, bgcolor: '#fffbeb', borderRadius: 3, border: '1px solid #fef3c7', display: 'flex', gap: 1.5 }}>
                <InfoOutlinedIcon sx={{ color: '#d97706' }} />
                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: '500' }}>
                  Você ainda pode adicionar mais 76 questões para atingir o máximo recomendado pela banca EEAR.
                </Typography>
              </Box> */}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MonteSeuSimulado;

