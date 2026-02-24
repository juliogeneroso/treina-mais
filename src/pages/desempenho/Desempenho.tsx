import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Avatar,
  Button,
  Tabs,
  Tab,
} from '@mui/material'
import {
  TrendingUp,
  CheckCircle,
  Timer,
  CalendarToday,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { use, useEffect, useState } from 'react';
import { useApi } from '../../services/useAPI';
import type { RootState } from '../../store';
import { useAppSelector } from '../../store/hooks';
import avatar01 from "../../assets/avatar/avatar_01.png";
import avatar02 from "../../assets/avatar/avatar_02.png";
import avatar03 from "../../assets/avatar/avatar_03.png";
import avatar04 from "../../assets/avatar/avatar_04.png";
import avatar05 from "../../assets/avatar/avatar_05.png";
import avatar06 from "../../assets/avatar/avatar_06.png";
import avatar07 from "../../assets/avatar/avatar_07.png";
import avatar08 from "../../assets/avatar/avatar_08.png";
import avatar09 from "../../assets/avatar/avatar_09.png";
import avatar10 from "../../assets/avatar/avatar_10.png";
import avatar11 from "../../assets/avatar/avatar_11.png";
import avatar12 from "../../assets/avatar/avatar_12.png";
import { useNavigate } from 'react-router-dom';
import HistoricoSimuladoList from './HistoricoSimuladoList';

const evolucaoData = [
  { mes: 'Jan', acerto: 62 },
  { mes: 'Fev', acerto: 65 },
  { mes: 'Mar', acerto: 72 },
  { mes: 'Abr', acerto: 80 },
  { mes: 'Mai', acerto: 74 },
  { mes: 'Jun', acerto: 85 },
]


interface DesempenhoResponse {
  nome: string;
  nivel: number;
  xpTotal: number;
  tituloNivel: string;
  questoesResolvidas: number;
  taxaAcerto: number;
  tempoEstudo: string;
  diasAtivos: number;
  evolucao: {
    data: string;
    percentual: number;
  }[];
  porMateria: {
    materia: string;
    percentual: number;
  }[];
}

export interface HistoricoSimuladoItem {
  id: number;
  titulo: string;
  dataCriacao: string;
  quantidadeQuestoes: number;
  tempoDuracao: number;
  pontuacaoFinal: number;
  status: string;
}

export type HistoricoSimuladoResponse = HistoricoSimuladoItem[];

const avatarMap: Record<string, string> = {
  avatar_01: avatar01,
  avatar_02: avatar02,
  avatar_03: avatar03,
  avatar_04: avatar04,
  avatar_05: avatar05,
  avatar_06: avatar06,
  avatar_07: avatar07,
  avatar_08: avatar08,
  avatar_09: avatar09,
  avatar_10: avatar10,
  avatar_11: avatar11,
  avatar_12: avatar12,
};

export default function Desempenho() {
  const { request } = useApi();
  const { request: historicoSimulado } = useApi();
  const [desempenhoData, setDesempenhoData] = useState<DesempenhoResponse | null>(null);
  const [historicoSimuladoData, setHistoricoSimuladoData] = useState<HistoricoSimuladoResponse | null>(null);
  const user = useAppSelector((state: RootState) => (state as any).auth.user);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchDesempenhoData();
  }, []);

  useEffect(() => { 
    if(tabValue === 1){ 
    fetchHistoricoSimuladoData();
    }
  }, [tabValue]);


  const fetchDesempenhoData = async () => {
    await request<DesempenhoResponse>(`/api/desempenho/${user?.id}`, { method: 'GET', withAuth: true })
      .then((response) => {
        const d = response as DesempenhoResponse;
        setDesempenhoData(d);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados de desempenho:', error);
      });
  };

  const fetchHistoricoSimuladoData = async () => {
    await historicoSimulado('/api/simulado/resumo', { method: 'GET', withAuth: true }).then((response) => {
      const desempenhoSimulado = response as HistoricoSimuladoResponse;  
      setHistoricoSimuladoData(desempenhoSimulado);
    }).catch((error) => {      
      console.error('Erro ao buscar histórico de simulados:', error);
    } );
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const evolucaoChartData =
    desempenhoData?.evolucao && desempenhoData.evolucao.length > 0
      ? [...desempenhoData.evolucao]
          .sort(
            (a, b) =>
              new Date(a.data).getTime() - new Date(b.data).getTime()
          )
          .map((item) => {
            const d = new Date(item.data);
            return {
              dia: d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              }),
              acerto: item.percentual,
            };
          })
      : evolucaoData.map((item) => ({
          dia: item.mes,
          acerto: item.acerto,
        }));


  return (
    <Box p={{ xs: 2, md: 4 }}>

      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        gap={3}
        mb={5}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={avatarMap[user?.avatarCodigo || 'avatar_01']}
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography fontWeight={800} fontSize={18}>
              {desempenhoData?.nome}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Nível {desempenhoData?.nivel}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 3, px: 4 }}
          onClick={() => {
            navigate('/simulado');
          }}
        >
          Iniciar Simulado
        </Button>
      </Box>

      {/* TÍTULO */}
      <Typography variant="h4" fontWeight={900} mb={1}>
        Desempenho Geral
      </Typography>
      <Typography color="text.secondary" mb={5}>
        Acompanhe sua evolução detalhada para seus concursos. 
        Veja métricas, gráficos e histórico de simulados para identificar seus pontos fortes e áreas de melhoria. Mantenha o foco no seu objetivo!
      </Typography>

      {/* ABAS INTERNAS */}
      <Box mb={4}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="Visão geral" />
          <Tab label="Histórico de simulados" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
      {/* MÉTRICAS */}
      <Grid container spacing={3} mb={5}>
        {[
          {
            icon: <TrendingUp />,
            label: 'Total de Questões',
            helper: 'Questões resolvidas até agora',
            value: desempenhoData?.questoesResolvidas ?? 0,
            color: 'primary.main',
          },
          {
            icon: <CheckCircle />,
            label: 'Taxa de Acerto',
            helper: 'Média geral de acertos',
            value:
              desempenhoData && desempenhoData.taxaAcerto != null
                ? `${desempenhoData.taxaAcerto.toFixed(1)}%`
                : '0%',
            color: 'success.main',
          },
          {
            icon: <Timer />,
            label: 'Tempo de Estudo',
            helper: 'Tempo total dedicado',
            value: desempenhoData?.tempoEstudo || '0h',
            color: 'secondary.main',
          },
          {
            icon: <CalendarToday />,
            label: 'Dias Ativos',
            helper: 'Dias que você estudou',
            value: desempenhoData?.diasAtivos ?? 0,
            color: 'warning.main',
          },
        ].map((item, index) => (
          <Grid sx={{ xs: 12, md: 3, sm: 6 }} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                p: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: '0.25s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    columnGap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontSize={13} color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography fontSize={11} color="text.disabled" noWrap>
                        {item.helper}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    fontSize={26}
                    fontWeight={900}
                    sx={{ lineHeight: 1.1, textAlign: 'right', ml: 1 }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* GRÁFICO */}
      <Card sx={{ borderRadius: 4, mb: 5 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography fontWeight={800} fontSize={18} mb={3}>
            Evolução de Desempenho
          </Typography>

          <Box height={320}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoChartData}>
                <XAxis dataKey="dia" />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value) => `${value ?? 0}%`}
                  labelFormatter={(label) =>
                    label != null ? `Dia: ${label}` : ''
                  }
                />
                <Line
                  type="monotone"
                  dataKey="acerto"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* MATÉRIAS */}
      <Typography fontWeight={800} fontSize={18} mb={3}>
        Desempenho por Matéria
      </Typography>

      <Grid container spacing={3}>
        {desempenhoData?.porMateria.map((mat, index) => {
          const progressColor: 'success' | 'warning' | 'error' =
            mat.percentual >= 80 ? 'success' : mat.percentual >= 50 ? 'warning' : 'error';
          const badgeBg =
            mat.percentual >= 80
              ? 'success.main'
              : mat.percentual >= 50
              ? 'warning.main'
              : 'error.main';

          return (
            <Grid key={index} sx={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 3, pb: 2.5 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.75}
                    columnGap={2}
                  >
                    <Box>
                      <Typography fontWeight={800} fontSize={15}>
                        {mat.materia}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        Desempenho nesta matéria
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: badgeBg,
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 13,
                        minWidth: 70,
                        textAlign: 'center',
                        ml: 1,
                      }}
                    >
                      {mat.percentual.toPrecision(2)}%
                    </Box>
                  </Box>

                  <Box mt={1.5}>
                    <LinearProgress
                      variant="determinate"
                      value={mat.percentual}
                      color={progressColor}
                      sx={{ height: 8, borderRadius: 999, bgcolor: 'action.hover' }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography fontSize={12} color="text.secondary">
                        0%
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        100%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

        </>
      )}

      {tabValue === 1 && (
        <Box mt={3}>
          <HistoricoSimuladoList data={historicoSimuladoData} />
        </Box>
      )}

    </Box>
  )
}
