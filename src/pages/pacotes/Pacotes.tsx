import { useEffect, useState } from "react";
import { useApi } from "../../services/useAPI";
import { enqueueSnackbar } from "notistack";
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Grid,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
} from "@mui/material";

interface Pacote {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracaoDias: number;
    concursoNome: string;
    beneficios: string[];
    maisPopular: boolean;
    jaAdquirido: boolean;
}

interface ValidacaoCupomResponse {
    valido: boolean;
    mensagem: string;
    precoOriginal: number;
    precoFinal: number;
    desconto: number;
}

interface PagamentoPix {
    compraId: number;
    status: string;
    qrCodeBase64: string;
    qrCodeCopiaCola: string;
    expiracaoPix: string;
    ticketUrl: string;
}

interface VerificarSeCompraAprovadaResponse {
    id: number;
    status: string;
    ativo: boolean;
    dataCompra: string;
    dataExpiracao: string;
}

export const Pacotes = () => {
    const [pacotesData, setPacotesData] = useState<Pacote[]>([]);
    const [expandedBenefits, setExpandedBenefits] = useState<Record<number, boolean>>({});
    const [cupomValidacao, setCupomValidacao] = useState<Record<number, ValidacaoCupomResponse | null>>({});
    const [cupons, setCupons] = useState<Record<number, string>>({});
    const [pagamentoPix, setPagamentoPix] = useState<Record<number, PagamentoPix | null>>({});
    const [pagamentoModalAberto, setPagamentoModalAberto] = useState(false);
    const [pacoteSelecionado, setPacoteSelecionado] = useState<Pacote | null>(null);
    const [metodoPagamento, setMetodoPagamento] = useState<"pix" | "credito" | "debito">("pix");
    const [tempoRestanteSegundos, setTempoRestanteSegundos] = useState<number | null>(null);
    const { request: pacotes, isLoading } = useApi();
    const { request: validarCupom, isLoading: isValidandoCupom } = useApi();
    const { request: adquirirPacote, isLoading: isAdquirindoPacote } = useApi();
    const { request: verificarSeCompraAprovada } = useApi();

    useEffect(() => {
      carregarPacotes();
    }, []);


    const carregarPacotes = () => {
          pacotes("/api/pacotes/catalogo", {
            method: "GET",
            withAuth: true,
        })
            .then((data) => {
                const d = data as Pacote[];
                setPacotesData(d);
            })
            .catch((error) => {
                enqueueSnackbar(
                    "Erro ao carregar pacotes. Por favor, tente novamente mais tarde.",
                    { variant: "error" }
                );
                console.error("Erro ao carregar pacotes:", error);
            });
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(value);

    const formatTempoRestante = (totalSeconds: number | null) => {
        if (totalSeconds === null || totalSeconds <= 0) return "Expirado";
        const horas = Math.floor(totalSeconds / 3600);
        const minutos = Math.floor((totalSeconds % 3600) / 60);
        const segundos = totalSeconds % 60;

        const mm = minutos.toString().padStart(2, "0");
        const ss = segundos.toString().padStart(2, "0");

        return horas > 0
            ? `${horas.toString().padStart(2, "0")}:${mm}:${ss}`
            : `${mm}:${ss}`;
    };

    const usuarioPossuiAlgumPacote = pacotesData.some((p) => p.jaAdquirido);

    const handleValidarCupom = (pacoteId: number) => {
        validarCupom("/api/pacotes/cupom/validar", {
            method: "POST",
            withAuth: true,
            body: { codigo: cupons[pacoteId], pacoteId },
        })
            .then((data) => {
                const response = data as ValidacaoCupomResponse;
                setCupomValidacao((prev) => ({ ...prev, [pacoteId]: response }));
                enqueueSnackbar("Cupom validado com sucesso!", { variant: "success" });
            })
            .catch((error) => {
                enqueueSnackbar("Erro ao validar cupom. Por favor, tente novamente.", { variant: "error" });
                console.error("Erro ao validar cupom:", error);
            });
    }

    const handleAdquirirPacote = (pacoteId: number) => {
        adquirirPacote(`/api/comprar/${pacoteId}/pix`, {
            method: "POST",
            withAuth: true,
            body: { codigoCupom: cupons[pacoteId] },
        })
            .then((data) => {
                const d = data as PagamentoPix;
                setPagamentoPix((prev) => ({ ...prev, [pacoteId]: d }));
            })
            .catch((error) => {
                enqueueSnackbar("Erro ao adquirir pacote. Por favor, tente novamente.", { variant: "error" });
                console.error("Erro ao adquirir pacote:", error);
            });
    };

    const handleAbrirModalPagamento = (pacote: Pacote) => {
        setPacoteSelecionado(pacote);
        setMetodoPagamento("pix");
        setPagamentoModalAberto(true);
        setTempoRestanteSegundos(null);
        setPagamentoPix((prev) => ({ ...prev, [pacote.id]: null }));
        handleAdquirirPacote(pacote.id);
    };

    const handleFecharModalPagamento = () => {
        setPagamentoModalAberto(false);
        setPacoteSelecionado(null);
        setTempoRestanteSegundos(null);
    };

    useEffect(() => {
        let timer: number | undefined;

        if (pagamentoModalAberto && pacoteSelecionado) {
            const pagamento = pagamentoPix[pacoteSelecionado.id];

            if (pagamento?.expiracaoPix) {
                const atualizarTempo = () => {
                    const expiracao = new Date(pagamento.expiracaoPix).getTime();
                    const agora = Date.now();
                    const diffMs = expiracao - agora;

                    if (diffMs <= 0) {
                        setTempoRestanteSegundos(0);
                        if (timer !== undefined) window.clearInterval(timer);
                        return;
                    }

                    setTempoRestanteSegundos(Math.floor(diffMs / 1000));
                };

                atualizarTempo();
                timer = window.setInterval(atualizarTempo, 1000);
            }
        }

        return () => {
            if (timer !== undefined) {
                window.clearInterval(timer);
            }
        };
    }, [pagamentoModalAberto, pacoteSelecionado, pagamentoPix]);

    useEffect(() => {
        let pollId: number | undefined;

        if (pagamentoModalAberto && metodoPagamento === "pix" && pacoteSelecionado) {
            const pagamento = pagamentoPix[pacoteSelecionado.id];

            if (pagamento?.compraId) {
                const checarStatus = () => {
                    verificarStatusCompra(pagamento.compraId);
                };

                checarStatus();
                pollId = window.setInterval(checarStatus, 5000);
            }
        }

        return () => {
            if (pollId !== undefined) {
                window.clearInterval(pollId);
            }
        };
    }, [pagamentoModalAberto, metodoPagamento, pacoteSelecionado, pagamentoPix]);

    const verificarStatusCompra = async (compraId: number) => {
        verificarSeCompraAprovada(`/api/comprar/compras/${compraId}`, {
            method: "GET",
            withAuth: true,
        }).then((data) => {                
            const d = data as VerificarSeCompraAprovadaResponse;
            if (d.ativo) {
                enqueueSnackbar("Compra aprovada! O pacote já está disponível para acesso.", { variant: "success" });
                handleFecharModalPagamento();
                carregarPacotes();
            }
        })
    };

    return (
        <Box p={{ xs: 2, md: 4 }} mx="auto">
            <Typography variant="h4" fontWeight={800} mb={1}>
                Pacotes Disponíveis
            </Typography>
            <Typography color="text.secondary" mb={4} fontSize={15}>
                Escolha o pacote ideal para o seu concurso e comece a estudar hoje.
            </Typography>

            {isLoading ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    mt={6}
                >
                    <CircularProgress color="primary" />
                    <Typography mt={2} color="text.secondary">
                        Carregando pacotes...
                    </Typography>
                </Box>
            ) : pacotesData.length === 0 ? (
                <Box textAlign="center" mt={6}>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                        Nenhum pacote disponível no momento.
                    </Typography>
                    <Typography color="text.secondary">
                        Assim que novos pacotes forem adicionados, eles aparecerão aqui.
                    </Typography>
                </Box>
            ) : (
                <Grid
                    container
                    spacing={3}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    }}
                >
                    {pacotesData.map((pacote) => (
                        <Card
                            key={pacote.id}
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3,
                                position: "relative",
                                border: pacote.maisPopular
                                    ? "2px solid rgba(255, 193, 7, 0.8)"
                                    : "1px solid rgba(0,0,0,0.06)",
                                transform: pacote.maisPopular ? "translateY(-4px)" : "none",
                            }}
                        >
                            {pacote.maisPopular && (
                                <Chip
                                    label="Mais popular"
                                    color="warning"
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        fontWeight: 700,
                                    }}
                                />
                            )}

                            {pacote.jaAdquirido && null}

                            <CardContent sx={{ p: 3, pt: 4 }}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        noWrap
                                        title={pacote.nome}
                                    >
                                        {pacote.nome}
                                    </Typography>
                                    {pacote.jaAdquirido && (
                                        <Chip
                                            label="Já adquirido"
                                            color="success"
                                            size="small"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    )}
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mb={1.5}
                                    noWrap
                                    title={pacote.concursoNome}
                                >
                                    {pacote.concursoNome}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2, minHeight: 48 }}
                                >
                                    {pacote.descricao}
                                </Typography>

                                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                                    {(expandedBenefits[pacote.id] ? pacote.beneficios : pacote.beneficios?.slice(0, 3) || []).map((beneficio, index) => (
                                        <Chip
                                            key={index}
                                            label={beneficio}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                    {pacote.beneficios &&
                                        pacote.beneficios.length > 3 &&
                                        !expandedBenefits[pacote.id] && (
                                        <Chip
                                            label={`+${pacote.beneficios.length - 3}`}
                                            size="small"
                                            variant="outlined"
                                            clickable
                                            onClick={() =>
                                                setExpandedBenefits((prev) => ({
                                                    ...prev,
                                                    [pacote.id]: true,
                                                }))
                                            }
                                        />
                                    )}
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5} mb={1}>
                                    {cupomValidacao[pacote.id]?.valido ? (
                                        <>
                                            <Typography
                                                fontSize={14}
                                                color="text.secondary"
                                                sx={{ textDecoration: "line-through" }}
                                            >
                                                {formatCurrency(cupomValidacao[pacote.id]!.precoOriginal)}
                                            </Typography>
                                            <Typography variant="h5" fontWeight={800} color="primary">
                                                {formatCurrency(cupomValidacao[pacote.id]!.precoFinal)}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="h5" fontWeight={800} color="primary">
                                            {formatCurrency(pacote.preco)}
                                        </Typography>
                                    )}
                                    <Typography color="text.secondary" fontSize={13}>
                                        / {pacote.duracaoDias} dias de acesso
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ px: 3, pb: 3, pt: 0, flexDirection: "column", gap: 1.5, alignItems: "stretch" }}>
                                {!pacote.jaAdquirido && !usuarioPossuiAlgumPacote && (
                                    <Box display="flex" gap={1} width="100%">
                                        <TextField
                                            size="small"
                                            label="Cupom de desconto"
                                            placeholder="Digite seu cupom"
                                            fullWidth
                                            value={cupons[pacote.id] ?? ""}
                                            onChange={(e) =>
                                                setCupons((prev) => ({
                                                    ...prev,
                                                    [pacote.id]: e.target.value.toUpperCase(),
                                                }))
                                            }
                                        />
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            disabled={!cupons[pacote.id] || isValidandoCupom}
                                            onClick={() => {
                                                handleValidarCupom(pacote.id)
                                            }}
                                        >
                                            {isValidandoCupom ? (
                                                <CircularProgress size={18} />
                                            ) : (
                                                "Validar"
                                            )}
                                        </Button>
                                    </Box>
                                )}
                                <Button
                                    sx={{ marginTop: 2 }}
                                    fullWidth
                                    variant={pacote.jaAdquirido ? "outlined" : "contained"}
                                    color={"success"}
                                    disabled={pacote.jaAdquirido || usuarioPossuiAlgumPacote}
                                    onClick={() => handleAbrirModalPagamento(pacote)}
                                >
                                    {pacote.jaAdquirido ? "Já está no seu acesso" : "Comprar agora"}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Grid>
            )}
            {pacoteSelecionado && (
                <Dialog
                    open={pagamentoModalAberto}
                    onClose={handleFecharModalPagamento}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Escolha a forma de pagamento</DialogTitle>
                    <DialogContent dividers>
                        <Tabs
                            value={metodoPagamento}
                            onChange={(_, value) =>
                                setMetodoPagamento(value as "pix" | "credito" | "debito")
                            }
                            sx={{ mb: 2 }}
                        >
                            <Tab label="Pix" value="pix" />
                            <Tab label="Crédito (Ainda não disponível)" value="credito" disabled />
                            <Tab label="Débito (Ainda não disponível)" value="debito" disabled />
                        </Tabs>

                        {metodoPagamento === "pix" && (
                            <Box>
                                {isAdquirindoPacote && !pagamentoPix[pacoteSelecionado.id] ? (
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        py={3}
                                    >
                                        <CircularProgress />
                                        <Typography mt={2} color="text.secondary">
                                            Gerando pagamento via Pix...
                                        </Typography>
                                    </Box>
                                ) : pagamentoPix[pacoteSelecionado.id] ? (
                                    <Box display="flex" flexDirection="column" gap={2}>
                                          <Typography fontWeight={700} fontSize={18}>
                                            Valor a ser pago: {" "}
                                            {cupomValidacao[pacoteSelecionado.id]?.valido
                                                ? formatCurrency(cupomValidacao[pacoteSelecionado.id]!.precoFinal)
                                                : formatCurrency(
                                                      pacotesData.find(p => p.id === pacoteSelecionado.id)?.preco ?? 0
                                                  )}
                                        </Typography>

                                        {tempoRestanteSegundos !== null && (
                                            <Box textAlign="center" mb={1}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                >
                                                    Tempo restante para pagamento
                                                </Typography>
                                                <Typography
                                                    variant="h3"
                                                    fontWeight={800}
                                                    color={tempoRestanteSegundos > 0 ? "primary" : "error"}
                                                >
                                                    {formatTempoRestante(tempoRestanteSegundos)}
                                                </Typography>
                                            </Box>
                                        )}

                                      

                                        <Typography>
                                            Escaneie o QR Code abaixo com o app do seu banco ou copie o código Pix.
                                        </Typography>
                                        <Box
                                            component="img"
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                                                pagamentoPix[pacoteSelecionado.id]!.qrCodeCopiaCola
                                            )}`}
                                            alt="QR Code Pix"
                                            sx={{
                                                width: 220,
                                                height: 220,
                                                mx: "auto",
                                                borderRadius: 2,
                                                border: "1px solid rgba(0,0,0,0.1)",
                                                cursor: "pointer",
                                            }}
                                           
                                        />
                                        <TextField
                                            label="Código Pix copia e cola"
                                            value={pagamentoPix[pacoteSelecionado.id]!.qrCodeCopiaCola}
                                            fullWidth
                                            multiline
                                            maxRows={3}
                                            InputProps={{ readOnly: true }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Validade: {new Date(pagamentoPix[pacoteSelecionado.id]!.expiracaoPix).toLocaleString("pt-BR")} {" "}
                                        </Typography>
                                        {pagamentoPix[pacoteSelecionado.id]!.ticketUrl && (
                                            <Button
                                                sx={{ mt: 1, alignSelf: "flex-start" }}
                                                variant="text"
                                                color="primary"
                                                onClick={() =>
                                                    window.open(
                                                        pagamentoPix[pacoteSelecionado.id]!.ticketUrl,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                Abrir página de pagamento
                                            </Button>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">
                                        Não foi possível carregar os dados de pagamento. Tente novamente.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFecharModalPagamento}>Fechar</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};