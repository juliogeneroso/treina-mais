import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import type { HistoricoSimuladoResponse } from './Desempenho';

interface HistoricoSimuladoListProps {
  data: HistoricoSimuladoResponse | null;
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDuration(minutes: number) {
  if (!minutes) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h} h`;
  return `${h} h ${m} min`;
}

function getStatusColor(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes('aprov') || normalized.includes('concl')) return 'success';
  if (normalized.includes('pend') || normalized.includes('em andamento')) return 'warning';
  return 'default';
}

export default function HistoricoSimuladoList({ data }: HistoricoSimuladoListProps) {
  if (data === null) {
    return (
      <Box>
        <Typography color="text.secondary">
          Carregando histórico de simulados...
        </Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box>
        <Typography color="text.secondary">
          Você ainda não possui simulados realizados.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {data.map((item) => (
        <Grid  sx={{ xs: 12}} key={item.id}>
          <Card
            sx={{
              borderRadius: 3,
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              transition: '0.25s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ py: 2.5, px: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Box>
                  <Typography fontWeight={700} fontSize={15} gutterBottom>
                    {item.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Criado em {formatDate(item.dataCriacao)}
                  </Typography>
                </Box>

                <Chip
                  label={item.status}
                  color={getStatusColor(item.status) as any}
                  size="small"
                  sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                />
              </Box>

              <Box display="flex" flexWrap="wrap" columnGap={3} rowGap={1} mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Questões: <strong>{item.quantidadeQuestoes}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tempo: <strong>{formatDuration(item.tempoDuracao)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pontuação: <strong>{item.pontuacaoFinal.toFixed(1)}%</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
