import { useState } from "react";
import { Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Typography } from "@mui/material";
import type { PacoteAtivo } from "./Configuracao";

interface PacotesAtivosProps {
  pacotes: PacoteAtivo[];
  onCancelarCompra?: (pacote: PacoteAtivo) => void | Promise<void>;
  onComprarMaisPacotes?: () => void;
}

function podeCancelarCompra(pacote: PacoteAtivo): boolean {
  if (!pacote.dataCompra) return false;
  const compraDate = new Date(pacote.dataCompra);
  if (Number.isNaN(compraDate.getTime())) return false;

  const agora = new Date();
  const diffMs = agora.getTime() - compraDate.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  return diffDias < 7;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export const PacotesAtivos = ({ pacotes, onCancelarCompra, onComprarMaisPacotes }: PacotesAtivosProps) => {
  const [loadingCompraId, setLoadingCompraId] = useState<number | null>(null);

  const handleCancelarClick = async (pacote: PacoteAtivo) => {
    if (!onCancelarCompra || loadingCompraId !== null) return;

    try {
      setLoadingCompraId(pacote.compraId);
      const result = onCancelarCompra(pacote);
      if (result && typeof (result as Promise<void>).then === "function") {
        await result;
      }
    } finally {
      setLoadingCompraId(null);
    }
  };

  if (!pacotes || pacotes.length === 0) {
    return (
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Pacotes ativos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onComprarMaisPacotes}
            disabled={!onComprarMaisPacotes}
          >
            Comprar mais pacotes
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Você não possui pacotes ativos no momento.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Pacotes ativos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onComprarMaisPacotes}
          disabled={!onComprarMaisPacotes}
        >
          Comprar mais pacotes
        </Button>
      </Box>
      <Grid container spacing={2}>
        {pacotes.map((pacote) => {
          const cancelavel = podeCancelarCompra(pacote);
          const isLoadingCancelamento = loadingCompraId === pacote.compraId;

          return (
            <Grid sx={{xs: 12, md: 6}} key={pacote.compraId}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {pacote.nomePacote}
                    </Typography>
                    <Chip
                      size="small"
                      label={pacote.ativo ? "Ativo" : "Inativo"}
                      color={pacote.ativo ? "success" : "default"}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Concurso: {pacote.nomeConcurso}
                  </Typography>

                  <Typography variant="body2">
                    Compra: {formatDate(pacote.dataCompra)}
                  </Typography>
                  <Typography variant="body2">
                    Expira em: {formatDate(pacote.dataExpiracao)}
                  </Typography>
                  <Typography variant="body2">
                    Data da prova: {formatDate(pacote.dataDaProva)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Dias restantes: {pacote.diasRestantes}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Usuário: {pacote.nomeUsuario}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    E-mail: {pacote.emailUsuario}
                  </Typography>

                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={!cancelavel || !onCancelarCompra || isLoadingCancelamento}
                      onClick={() => handleCancelarClick(pacote)}
                    >
                      {isLoadingCancelamento ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Cancelando...
                        </>
                      ) : (
                        "Cancelar compra"
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
