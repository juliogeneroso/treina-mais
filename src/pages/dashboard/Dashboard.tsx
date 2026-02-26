import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Avatar,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LayersIcon from '@mui/icons-material/Layers'
import BarChartIcon from '@mui/icons-material/BarChart'
import type { RootState } from '../../store'
import { useAppSelector } from '../../store/hooks'
import { useApi } from '../../services/useAPI'
import { useEffect, useState } from 'react'
import type { DesempenhoUsuarioResponse } from '../../interfaces/progresso/progresso.interface'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import image from '../../assets/image-dashboard.png'

interface PacoteAtivo {
  compraId: number;
  pacoteId: number;
  nomePacote: string;
  dataCompra: string;
  dataExpiracao: string;
  ativo: boolean;
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  concursoId: number;
  nomeConcurso: string;
  dataDaProva: string;
  diasRestantes: number;
}

export default function Dashboard() {
  const formatarData = (data?: string) => {
    if (!data) return '--'
    const date = new Date(data)
    if (Number.isNaN(date.getTime())) return data
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const { user } = useAppSelector((state: RootState) => state.auth)
  const [desempenho, setDesempenho] = useState<DesempenhoUsuarioResponse | null>(null)
   const [pacotesAtivos, setPacotesAtivos] = useState<PacoteAtivo[]>([]);
   const [openSemPacotes, setOpenSemPacotes] = useState(false);
  const { request: pacotesAdquiridos } = useApi();
  const [isLoadingPacotes, setIsLoadingPacotes] = useState(false);
   const { request } = useApi()
   const navigate = useNavigate();
   
   useEffect(() => {
    if (!user?.id) return;
    fetchPacotesAtivos();
    fetchProgresso()
    }, []); 

    const fetchProgresso = () => {
       request(`/api/usuario/progresso/${user?.id}`, {
      method: 'GET'})
    .then((data) => {
      const p = data as DesempenhoUsuarioResponse;
      setDesempenho(p);
    } ).catch((err) => {
      console.error('Erro ao buscar desempenho:', err);
    } ); 
  }

    const fetchPacotesAtivos = () => {
     setIsLoadingPacotes(true);
       pacotesAdquiridos(`/api/pacotes/ativos`, {
         method: "GET",
         withAuth: true,
       })
         .then((data) => { 
           const d = data as PacoteAtivo[];
           setPacotesAtivos(d);
           if (!d || d.length === 0) {
             setOpenSemPacotes(true);
           }
       })
       .catch(() => {
       enqueueSnackbar("Erro ao carregar pacotes adquiridos.", {
           variant: "error",
       });
       })
       .finally(() => {
         setIsLoadingPacotes(false);
       });
     };

  return (
    <Box p={{ xs: 2, md: 4 }} maxWidth={1300} mx="auto">
      <Typography variant="h4" fontWeight={800} mb={0.5}>
        Olá, {user?.name}
      </Typography>

      <Typography color="text.secondary" mb={4} fontSize={16}>
        Pronto para o combate hoje? Sua meta diária está a <b>40%</b>.
      </Typography>

      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        <Grid
          container
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          }}
        >
          <Box
            component="img"
            src={image}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 260,
              maxHeight: 300,
              objectFit: 'cover',
            }}
          />

          <CardContent sx={{ p: 4 }}>
            {isLoadingPacotes ? (
              <>
                <Typography
                  color="primary"
                  fontWeight={800}
                  fontSize={12}
                  letterSpacing={1.2}
                >
                  CARREGANDO PACOTES
                </Typography>

                <Box display="flex" alignItems="center" mt={2} gap={2}>
                  <CircularProgress size={28} />
                  <Typography fontSize={15}>
                    Buscando seus pacotes ativos...
                  </Typography>
                </Box>
              </>
            ) : !openSemPacotes && pacotesAtivos.length > 0 ? (
              <>
                <Typography
                  color="primary"
                  fontWeight={800}
                  fontSize={12}
                  letterSpacing={1.2}
                >
                  CONTAGEM REGRESSIVA
                </Typography>

                <Typography variant="h5" fontWeight={800} mt={1}>
                  Término do seu pacote: {formatarData(pacotesAtivos[0]?.dataExpiracao)}
                </Typography>

                <Typography mt={1.5} fontSize={15}>
                  📅 {formatarData(pacotesAtivos[0]?.dataExpiracao)}
                </Typography>

                <Typography color="primary" fontWeight={700} mt={1}>
                  ⏳ Faltam {pacotesAtivos[0].diasRestantes} dias para o seu objetivo
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  color="primary"
                  fontWeight={800}
                  fontSize={12}
                  letterSpacing={1.2}
                >
                  RUMO À APROVAÇÃO
                </Typography>

                <Typography variant="h5" fontWeight={800} mt={1}>
                  Comece hoje a construir a sua vaga.
                </Typography>

                <Typography mt={1.5} fontSize={15}>
                  Cada questão resolvida é um passo a menos entre você e o uniforme. Escolha um pacote e dê o primeiro passo agora.
                </Typography>

                <Typography color="primary" fontWeight={700} mt={1}>
                  🚀 Disciplina hoje, aprovação amanhã.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, borderRadius: 2, px: 4 }}
                  onClick={() => {
                    navigate('/pacotes')
                  }}
                >
                  Comprar Pacote
                </Button>
              </>
            )}
          </CardContent>
        </Grid>
      </Card>

      <Grid
        container
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            background:
              'linear-gradient(135deg, rgba(25,118,210,0.12), rgba(25,118,210,0.03))',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography fontWeight={800} fontSize={20} mb={2}>
              💡 Dica do Dia
            </Typography>

            <Typography fontSize={16} lineHeight={1.7} mb={2}>
              A aprovação não vem só de estudar muito, mas de estudar <b>do jeito certo</b>.
              Separe blocos curtos de estudo focado (25 a 40 min) e, ao final de cada bloco,
              resolva questões recentes do seu concurso. Anote seus erros, revise-os no mesmo dia
              e transforme-os em <b>flashcards</b> para revisar rápido amanhã.
            </Typography>

            <Typography color="primary" fontWeight={700}>
              #Estratégia #Foco
            </Typography>
          </CardContent>
        </Card>

        <Grid
          sx={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gap: 3,
          }}
        >
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary" fontSize={14}>
                Questões Resolvidas
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {desempenho?.questoesResolvidas ?? '--'}
              </Typography>
              <Typography color="success.main" fontWeight={600}>
                {desempenho ? `Aproveitamento: ${desempenho.aproveitamento.toFixed(2)}%` : 'Carregando...'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary" fontSize={14}>
                Aproveitamento
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {desempenho ? `${desempenho.aproveitamento.toFixed(2)}%` : '--'}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={desempenho ? desempenho.aproveitamento : 0}
                sx={{ mt: 1.5, height: 10, borderRadius: 5 }}
              />
              <Typography fontSize={13} align="right" mt={0.5}>
                Meta: 85%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography fontWeight={800} fontSize={20} mb={2}>
        Ações Rápidas
      </Typography>

      <Grid
        container
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {[
          {
            icon: <LayersIcon />,
            title: 'Montar Simulado',
            desc: 'Personalize questões por matéria e dificuldade.',
            color: 'primary.light',
            link: '/simulado'
          },
          {
            icon: <TrendingUpIcon />,
            title: 'Revisar Flashcards',
            desc: 'Use repetição espaçada para memorizar fórmulas.',
            color: 'secondary.light',
            link: '/flashcard'
          },
          {
            icon: <BarChartIcon />,
            title: 'Meu Desempenho',
            desc: 'Analise sua evolução por disciplina.',
            color: 'success.light',
            link: '/desempenho'
          },
        ].map((item) => (
          <Card
            key={item.title}
            sx={{
              borderRadius: 4,
              cursor: 'pointer',
              transition: '0.25s',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: 8,
              },
            }}
            onClick={() => {navigate(item.link)}}
          >
            <CardContent sx={{ p: 3 }}>
              <Avatar sx={{ bgcolor: item.color, mb: 2 }}>
                {item.icon}
              </Avatar>
              <Typography fontWeight={800} fontSize={16}>
                {item.title}
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                {item.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  )
}
