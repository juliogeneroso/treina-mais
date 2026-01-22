import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Avatar,
  Button,
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

const evolucaoData = [
  { mes: 'Jan', acerto: 62 },
  { mes: 'Fev', acerto: 65 },
  { mes: 'Mar', acerto: 72 },
  { mes: 'Abr', acerto: 80 },
  { mes: 'Mai', acerto: 74 },
  { mes: 'Jun', acerto: 85 },
]

export default function Desempenho() {
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
            src="https://i.pravatar.cc/150"
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography fontWeight={800} fontSize={18}>
              Wallace Ferreira
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Nível 12
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 3, px: 4 }}
        >
          Iniciar Simulado
        </Button>
      </Box>

      {/* TÍTULO */}
      <Typography variant="h4" fontWeight={900} mb={1}>
        Desempenho Geral
      </Typography>
      <Typography color="text.secondary" mb={5}>
        Acompanhe sua evolução detalhada para os exames EEAR/EAGS
      </Typography>

      {/* MÉTRICAS */}
      <Grid container spacing={3} mb={5}>
        {[
          {
            icon: <TrendingUp />,
            label: 'Total de Questões',
            value: '1.240',
            color: 'primary.main',
          },
          {
            icon: <CheckCircle />,
            label: 'Taxa de Acerto',
            value: '78%',
            color: 'success.main',
          },
          {
            icon: <Timer />,
            label: 'Tempo de Estudo',
            value: '156h',
            color: 'secondary.main',
          },
          {
            icon: <CalendarToday />,
            label: 'Dias Ativos',
            value: '45',
            color: 'warning.main',
          },
        ].map((item, index) => (
          <Grid key={index} sx={{xs: 12, md:6, lg:3}}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                p: 2,
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: item.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  fontSize={14}
                  color="text.secondary"
                  mb={0.5}
                >
                  {item.label}
                </Typography>

                <Typography
                  fontSize={32}
                  fontWeight={900}
                >
                  {item.value}
                </Typography>
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
              <LineChart data={evolucaoData}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
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
  {[
    {
      nome: 'Língua Portuguesa',
      questoes: '450 questões este mês',
      valor: 82,
      color: 'primary',
    },
    {
      nome: 'Matemática',
      questoes: '320 questões este mês',
      valor: 65,
      color: 'secondary',
    },
  ].map((mat, index) => (
    <Grid key={index} sx={{xs: 12, md: 6}}>
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
        <CardContent sx={{ p: 3 }}>
      
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight={800} fontSize={16}>
              {mat.nome}
            </Typography>

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                bgcolor: `${mat.color}.light`,
                color: `${mat.color}.main`,
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {mat.valor}%
            </Box>
          </Box>

          {/* Subtítulo */}
          <Typography
            fontSize={13}
            color="text.secondary"
            mb={2}
          >
            {mat.questoes}
          </Typography>

          {/* Progress */}
          <LinearProgress
            variant="determinate"
            value={mat.valor}
            color={mat.color as any}
            sx={{
              height: 10,
              borderRadius: 6,
            }}
          />
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

    </Box>
  )
}
